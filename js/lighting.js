import * as THREE from 'three';

/**
 * Função para criar a iluminação do quarto.
 * Focada em criar uma atmosfera misteriosa e abandonada.
 */
export function createLighting(scene) {
    // Luz Ambiente: Muito fraca para que as sombras sejam profundas
    const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
    scene.add(ambientLight);

    // Luz da Lâmpada (PointLight)
    // Representa a fonte de luz principal do teto
    const lampLight = new THREE.PointLight(0xfff0dd, 1.5, 15);
    lampLight.position.set(0, 3.8, 0);
    lampLight.castShadow = true;

    // Configurações de sombra para maior realismo
    lampLight.shadow.mapSize.width = 1024;
    lampLight.shadow.mapSize.height = 1024;
    lampLight.shadow.camera.near = 0.1;
    lampLight.shadow.camera.far = 20;

    scene.add(lampLight);

    return {
        ambientLight,
        lampLight
    };
}
