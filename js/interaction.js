import * as THREE from 'three';

/**
 * Classe InteractionSystem
 * Responsável por detectar objetos interativos usando Raycaster
 * e processar a entrada do teclado ou botões mobile para disparar ações.
 */
export class InteractionSystem {
    constructor(camera, scene, lights) {
        this.camera = camera;
        this.scene = scene;
        this.lights = lights; // Recebe as luzes da cena
        this.raycaster = new THREE.Raycaster();

        // Configurações do Raycaster
        this.raycaster.far = 3; // Distância máxima de interação

        this.promptElement = document.getElementById('interaction-prompt');
        this.mobileBtnElement = document.getElementById('mobile-interact-btn');
        this.mobileFlashlightBtn = document.getElementById('mobile-flashlight-btn');
        this.interactiveObject = null;

        // Estados para animação da porta
        this.doorRotationTarget = 0;
        this.doorRotationSpeed = 0.05;
        this.doorObject = null;

        // Estado da lanterna
        this.flashLightOn = false;

        if (this.mobileFlashlightBtn) {
            this.mobileFlashlightBtn.textContent = 'LANTERNA';
            this.mobileFlashlightBtn.classList.remove('active');
        }

        this.initListeners();
    }

    initListeners() {
        // Interação via teclado
        window.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if (key === 'e') {
                this.interact();
            } else if (key === 'f') {
                this.toggleFlashlight();
            }
        });

        // Interação via botão mobile
        if (this.mobileBtnElement) {
            this.mobileBtnElement.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.interact();
            });
        }

        // Lanterna via botão mobile
        if (this.mobileFlashlightBtn) {
            this.mobileFlashlightBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.toggleFlashlight();
            });

            this.mobileFlashlightBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleFlashlight();
            });
        }
    }

    update() {
        // 1. Lógica de Animação da Porta (Lerp simples)
        if (this.doorObject) {
            const currentRot = this.doorObject.rotation.y;
            const diff = this.doorRotationTarget - currentRot;

            if (Math.abs(diff) > 0.001) {
                this.doorObject.rotation.y += diff * this.doorRotationSpeed;
            } else {
                this.doorObject.rotation.y = this.doorRotationTarget;
            }
        }

        // 2. Detecção de Interação via Raycaster
        this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);

        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0) {
            let found = null;
            for (const intersect of intersects) {
                const obj = intersect.object;
                let current = obj;
                while (current) {
                    if (current.userData && current.userData.interactive) {
                        found = current;
                        break;
                    }
                    current = current.parent;
                }
                if (found) break;
            }

            if (found) {
                this.interactiveObject = found;
                this.promptElement.classList.remove('hidden');
                if (this.mobileBtnElement) this.mobileBtnElement.classList.remove('hidden');
                return;
            }
        }

        this.interactiveObject = null;
        this.promptElement.classList.add('hidden');
        if (this.mobileBtnElement) this.mobileBtnElement.classList.add('hidden');
    }

    interact() {
        if (!this.interactiveObject) return;

        const type = this.interactiveObject.userData.type;
        console.log(`Interagindo com: ${type}`);

        if (type === 'lamp') {
            this.toggleLamp();
        } else if (type === 'door') {
            this.toggleDoor(this.interactiveObject);
        }
    }

    toggleLamp() {
        this.scene.traverse((obj) => {
            if (obj instanceof THREE.PointLight) {
                if (obj.intensity > 0) {
                    obj.intensity = 0;
                } else {
                    obj.intensity = 1.5;
                }
            }
        });
    }

    toggleDoor(door) {
        if (!door.userData.isOpen) {
            door.userData.isOpen = true;
            this.doorRotationTarget = -Math.PI / 2;
        } else {
            door.userData.isOpen = false;
            this.doorRotationTarget = 0;
        }
        this.doorObject = door;
    }

    toggleFlashlight() {
        if (!this.lights || !this.lights.flashlight) {
            console.error("Lanterna não encontrada no sistema de luzes");
            return;
        }

        this.flashLightOn = !this.flashLightOn;
        this.lights.flashlight.intensity = this.flashLightOn ? 1.0 : 0;

        if (this.mobileFlashlightBtn) {
            this.mobileFlashlightBtn.textContent = this.flashLightOn ? 'LANTERNA ON' : 'LANTERNA';
            this.mobileFlashlightBtn.classList.toggle('active', this.flashLightOn);
        }

        console.log(`Lanterna: ${this.flashLightOn ? 'Ligada' : 'Desligada'}`);
    }
}
