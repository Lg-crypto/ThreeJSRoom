import * as THREE from 'three';

/**
 * Classe InteractionSystem
 * Responsável por detectar objetos interativos usando Raycaster
 * e processar a entrada do teclado para disparar ações.
 */
export class InteractionSystem {
    constructor(camera, scene) {
        this.camera = camera;
        this.scene = scene;
        this.raycaster = new THREE.Raycaster();

        // Configurações do Raycaster
        this.raycaster.far = 3; // Distância máxima de interação

        this.promptElement = document.getElementById('interaction-prompt');
        this.interactiveObject = null;

        // Estados para animação da porta
        this.doorRotationTarget = 0;
        this.doorRotationSpeed = 0.05;
        this.doorObject = null;

        this.initListeners();
    }

    initListeners() {
        window.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'e') {
                this.interact();
            }
        });
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
                // Verifica o objeto ou seus pais para encontrar a tag interactive
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
                return;
            }
        }

        this.interactiveObject = null;
        this.promptElement.classList.add('hidden');
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
            this.doorRotationTarget = -Math.PI / 2; // Abre 90 graus no sentido oposto
        } else {
            door.userData.isOpen = false;
            this.doorRotationTarget = 0; // Fecha
        }
        this.doorObject = door;
    }
}
