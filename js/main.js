import * as THREE from 'three';
import { createRoom } from './room.js';
import { createLighting } from './lighting.js';
import { Player } from './player.js';
import { InteractionSystem } from './interaction.js';

/**
 * Classe Principal do Projeto
 * Responsável por inicializar a cena, câmera, renderer e loop principal.
 */
class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x050505);

        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);

        this.clock = new THREE.Clock();

        this.init();
    }

    init() {
        // 1. Criar Iluminação
        this.lights = createLighting(this.scene);

        // 2. Criar o Quarto
        this.room = createRoom(this.scene);

        // 3. Criar o Jogador
        this.player = new Player(this.camera);
        this.scene.add(this.player.camera);

        // 4. Sistema de Interação
        this.interaction = new InteractionSystem(this.camera, this.scene);

        // Eventos
        window.addEventListener('resize', () => this.onWindowResize());

        // Iniciar loop
        this.animate();
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const deltaTime = this.clock.getDelta();

        // Atualizar Jogador (movimentação e rotação)
        this.player.update(deltaTime);

        // Atualizar Interações (Raycaster)
        this.interaction.update();

        this.renderer.render(this.scene, this.camera);
    }
}

// Iniciar o jogo
new Game();
