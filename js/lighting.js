import * as THREE from 'three';

/**
 * Função para criar a iluminação do quarto.
 * Focada em criar uma atmosfera misteriosa e abandonada.
 */
export function createLighting(scene, camera) {
    // Luz Ambiente: Muito fraca para que as sombras sejam profundas
    const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
    scene.add(ambientLight);

    // Luz da Lâmpada (PointLight)
    const lampLight = new THREE.PointLight(0xfff0dd, 1.5, 15);
    lampLight.position.set(0, 3.8, 0);
    lampLight.castShadow = true;

    lampLight.shadow.mapSize.width = 1024;
    lampLight.shadow.mapSize.height = 1024;
    lampLight.shadow.camera.near = 0.1;
    lampLight.shadow.camera.far = 20;

    scene.add(lampLight);

    // --- Lanterna (SpotLight) ---
    // A lanterna é fixada na câmera para seguir o olhar do jogador
    const flashlight = new THREE.SpotLight(0xffffff, 1.0, 10, Math.PI / 6, 0.5, 1);
    flashlight.position.set(0, 0, 0);
    flashlight.target = new THREE.Object3D();

    // O alvo da lanterna deve ser projetado à frente da câmera
    // Vamos configurar isso no loop de atualização no main.js ou via grupo
    flashlight.castShadow = true;
    flashlight.intensity = 0; // Começa desligada

    // Adicionamos a lanterna e seu alvo à câmera
    camera.add(flashlight);
    camera.add(flashlight.target);
    flashlight.target.position.set(0, 0, -1);

    return {
        ambientLight,
        lampLight,
        flashlight
    };
}
