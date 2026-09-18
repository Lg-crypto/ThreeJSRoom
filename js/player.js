import * as THREE from 'three';

/**
 * Classe Player
 * Gerencia a câmera em primeira pessoa, movimentação (WASD e Joystick)
 * e rotação (Mouse e Touch).
 */
export class Player {
    constructor(camera) {
        this.camera = camera;
        this.camera.position.set(0, 1.7, 0); // Altura média dos olhos

        this.moveSpeed = 1.5;
        this.rotationSpeed = 0.002;

        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false,
            f: false
        };

        this.yaw = 0;   // Rotação horizontal (esquerda/direita)
        this.pitch = 0; // Rotação vertical (cima/baixo)

        // Estado do Joystick Virtual
        this.joystickValue = { x: 0, y: 0 };
        this.isMobile = false;

        this.initListeners();
    }

    initListeners() {
        // Detectar se é mobile (toque)
        this.isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

        // Captura de teclado
        window.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if (this.keys.hasOwnProperty(key)) this.keys[key] = true;
        });

        window.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            if (this.keys.hasOwnProperty(key)) this.keys[key] = false;
        });

        // Captura de mouse para rotação
        window.addEventListener('mousemove', (e) => {
            if (document.pointerLockElement === document.body) {
                this.yaw -= e.movementX * this.rotationSpeed;
                this.pitch -= e.movementY * this.rotationSpeed;
                this.pitch = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, this.pitch));
            }
        });

        // Pointer Lock API para capturar o mouse
        const startUI = document.getElementById('instructions');
        const clickMsg = document.getElementById('click-to-start');
        const guide = document.getElementById('controls-guide');

        startUI.addEventListener('click', () => {
            if (!this.isMobile) {
                document.body.requestPointerLock();
            } else {
                // No mobile, apenas escondemos o menu inicial
                startUI.classList.add('hidden');
            }
        });

        document.addEventListener('pointerlockchange', () => {
            if (document.pointerLockElement === document.body) {
                startUI.classList.add('hidden');
                guide.classList.add('hidden');
            } else {
                startUI.classList.remove('hidden');
                clickMsg.classList.remove('hidden');
                guide.classList.remove('hidden');
            }
        });

        if (this.isMobile) {
            this.initMobileControls();
            this.initOrientationWarning();
        }
    }

    initOrientationWarning() {
        const warning = document.getElementById('orientation-warning');

        const checkOrientation = () => {
            if (window.innerHeight > window.innerWidth) {
                warning.classList.remove('hidden');
            } else {
                warning.classList.add('hidden');
            }
        };

        window.addEventListener('resize', checkOrientation);
        checkOrientation();
    }

    initMobileControls() {
        // Mostrar elementos mobile
        document.getElementById('joystick-container').classList.remove('hidden');

        const joystickBase = document.getElementById('joystick-base');
        const joystickHandle = document.getElementById('joystick-handle');
        const baseRect = joystickBase.getBoundingClientRect();
        const centerX = baseRect.width / 2;
        const centerY = baseRect.height / 2;
        const maxDistance = baseRect.width / 2;

        // 1. Controle do Joystick Virtual
        const onJoystickStart = (e) => {
            e.preventDefault();
            this.handleJoystickTouch(e, joystickHandle, centerX, centerY, maxDistance);
        };

        const onJoystickMove = (e) => {
            e.preventDefault();
            this.handleJoystickTouch(e, joystickHandle, centerX, centerY, maxDistance);
        };

        const onJoystickEnd = () => {
            this.joystickValue = { x: 0, y: 0 };
            joystickHandle.style.left = '50%';
            joystickHandle.style.top = '50%';
            joystickHandle.style.transform = 'translate(-50%, -50%)';
        };

        joystickBase.addEventListener('touchstart', onJoystickStart);
        joystickBase.addEventListener('touchmove', onJoystickMove);
        joystickBase.addEventListener('touchend', onJoystickEnd);

        // 2. Controle de Olhar (Touch Drag na tela)
        let lastTouchX = 0;
        let lastTouchY = 0;

        window.addEventListener('touchstart', (e) => {
            // Só processa toque para olhar se não for no joystick
            if (e.target.id === 'joystick-base' || e.target.id === 'joystick-handle') return;

            const touch = e.touches[0];
            lastTouchX = touch.clientX;
            lastTouchY = touch.clientY;
        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            if (e.target.id === 'joystick-base' || e.target.id === 'joystick-handle') return;

            const touch = e.touches[0];
            const deltaX = touch.clientX - lastTouchX;
            const deltaY = touch.clientY - lastTouchY;

            this.yaw -= deltaX * this.rotationSpeed * 2;
            this.pitch -= deltaY * this.rotationSpeed * 2;
            this.pitch = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, this.pitch));

            lastTouchX = touch.clientX;
            lastTouchY = touch.clientY;
        }, { passive: false });
    }

    handleJoystickTouch(e, handle, centerX, centerY, maxDistance) {
        const touch = e.touches[0];
        const rect = e.currentTarget.getBoundingClientRect();

        let touchX = touch.clientX - rect.left - centerX;
        let touchY = touch.clientY - rect.top - centerY;

        const distance = Math.sqrt(touchX * touchX + touchY * touchY);

        if (distance > maxDistance) {
            touchX *= maxDistance / distance;
            touchY *= maxDistance / distance;
        }

        // Atualiza a posição visual do handle
        handle.style.left = `${centerX + touchX}px`;
        handle.style.top = `${centerY + touchY}px`;
        handle.style.transform = 'translate(-50%, -50%)';

        // Normaliza os valores para movimentação (-1 a 1)
        this.joystickValue.x = touchX / maxDistance;
        this.joystickValue.y = touchY / maxDistance;
    }

    update(deltaTime) {
        this.camera.rotation.set(0, 0, 0);
        this.camera.rotateY(this.yaw);
        this.camera.rotateX(this.pitch);

        const movement = new THREE.Vector3(0, 0, 0);
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);

        forward.y = 0;
        forward.normalize();
        right.y = 0;
        right.normalize();

        // Input Teclado
        if (this.keys.w) movement.add(forward);
        if (this.keys.s) movement.sub(forward);
        if (this.keys.a) movement.sub(right);
        if (this.keys.d) movement.add(right);

        // Input Joystick (Soma ao movimento)
        if (this.isMobile) {
            movement.add(forward.clone().multiplyScalar(-this.joystickValue.y));
            movement.add(right.clone().multiplyScalar(this.joystickValue.x));
        }

        if (movement.length() > 0) {
            movement.normalize().multiplyScalar(this.moveSpeed * deltaTime);

            this.camera.position.add(movement);

            const margin = 0.2;
            if (this.camera.position.x > 3 - margin) this.camera.position.x = 3 - margin;
            if (this.camera.position.x < -3 + margin) this.camera.position.x = -3 + margin;
            if (this.camera.position.z > 3 - margin) this.camera.position.z = 3 - margin;
            if (this.camera.position.z < -3 + margin) this.camera.position.z = -3 + margin;
        }
    }
}
