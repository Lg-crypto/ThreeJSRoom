import * as THREE from 'three';

/**
 * Classe Player
 * Gerencia a câmera em primeira pessoa, movimentação WASD e rotação via mouse.
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
            d: false
        };

        this.yaw = 0;   // Rotação horizontal (esquerda/direita)
        this.pitch = 0; // Rotação vertical (cima/baixo)

        this.initListeners();
    }

    initListeners() {
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

                // Limita a rotação vertical para não girar 360 graus (clamping)
                this.pitch = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, this.pitch));
            }
        });

        // Pointer Lock API para capturar o mouse
        const startUI = document.getElementById('instructions');
        const clickMsg = document.getElementById('click-to-start');
        const guide = document.getElementById('controls-guide');

        startUI.addEventListener('click', () => {
            document.body.requestPointerLock();
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
    }

    update(deltaTime) {
        // 1. Aplicar rotações à câmera
        this.camera.rotation.set(0, 0, 0); // Reset
        this.camera.rotateY(this.yaw);
        this.camera.rotateX(this.pitch);

        // 2. Movimentação
        const movement = new THREE.Vector3(0, 0, 0);

        // Direções relativas à câmera
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);

        // Zerar Y para não "voar" ao olhar para cima/baixo
        forward.y = 0;
        forward.normalize();
        right.y = 0;
        right.normalize();

        if (this.keys.w) movement.add(forward);
        if (this.keys.s) movement.sub(forward);
        if (this.keys.a) movement.sub(right);
        if (this.keys.d) movement.add(right);

        if (movement.length() > 0) {
            movement.normalize().multiplyScalar(this.moveSpeed * deltaTime);

            // Guardar posição anterior para colisão
            const oldPos = this.camera.position.clone();

            this.camera.position.add(movement);

            // Colisão Simples (Limites do Quarto 6x6)
            // Margem de 0.2 para evitar atravessar a parede
            const margin = 0.2;
            if (this.camera.position.x > 3 - margin) this.camera.position.x = 3 - margin;
            if (this.camera.position.x < -3 + margin) this.camera.position.x = -3 + margin;
            if (this.camera.position.z > 3 - margin) this.camera.position.z = 3 - margin;
            if (this.camera.position.z < -3 + margin) this.camera.position.z = -3 + margin;
        }
    }
}
