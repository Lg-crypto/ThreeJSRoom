import * as THREE from 'three';

/**
 * Função para construir a estrutura do quarto e seus móveis.
 * Utiliza geometrias primitivas para manter a simplicidade.
 */
export function createRoom(scene) {
    const roomGroup = new THREE.Group();

    // Materiais Básicos
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x7a7a7a });
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x3a3a3a });
    const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0x5a5a5a });
    const woodMaterial = new THREE.MeshStandardMaterial({ color: 0x4b3621 });

    // --- Estrutura do Quarto (Tamanho 6x6x4) ---

    // Chão
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    roomGroup.add(floor);

    // Teto
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), ceilingMaterial);
    ceiling.position.y = 4;
    ceiling.rotation.x = Math.PI / 2;
    ceiling.receiveShadow = true;
    roomGroup.add(ceiling);

    // Parede Traseira
    const wallBack = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 0.2), wallMaterial);
    wallBack.position.set(0, 2, -3);
    wallBack.castShadow = true;
    wallBack.receiveShadow = true;
    roomGroup.add(wallBack);

    // Parede Esquerda
    const wallLeft = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4, 6), wallMaterial);
    wallLeft.position.set(-3, 2, 0);
    wallLeft.castShadow = true;
    wallLeft.receiveShadow = true;
    roomGroup.add(wallLeft);

    // Parede Direita
    const wallRight = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4, 6), wallMaterial);
    wallRight.position.set(3, 2, 0);
    wallRight.castShadow = true;
    wallRight.receiveShadow = true;
    roomGroup.add(wallRight);

    // Parede Frontal (com abertura para a porta)
    const wallFront = new THREE.Group();

    // Parte esquerda da parede frontal
    const wallFrontLeft = new THREE.Mesh(new THREE.BoxGeometry(2, 4, 0.2), wallMaterial);
    wallFrontLeft.position.set(-2, 2, 3);
    wallFront.add(wallFrontLeft);

    // Parte direita da parede frontal
    const wallFrontRight = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 0.2), wallMaterial);
    wallFrontRight.position.set(1.5, 2, 3);
    wallFront.add(wallFrontRight);

    // Parte superior da porta
    const wallFrontTop = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.2), wallMaterial);
    wallFrontTop.position.set(0, 3.5, 3);
    wallFront.add(wallFrontTop);

    roomGroup.add(wallFront);

    // --- Móveis ---

    // Mesa
    const table = new THREE.Group();
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.1, 0.8), woodMaterial);
    tableTop.position.y = 0.8;
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    table.add(tableTop);

    const legGeo = new THREE.BoxGeometry(0.05, 0.8, 0.05);
    const legPos = [
        [-0.7, 0.4, -0.35], [0.7, 0.4, -0.35],
        [-0.7, 0.4, 0.35], [0.7, 0.4, 0.35]
    ];
    legPos.forEach(pos => {
        const leg = new THREE.Mesh(legGeo, woodMaterial);
        leg.position.set(...pos);
        leg.castShadow = true;
        table.add(leg);
    });
    table.position.set(-2, 0, -2);
    roomGroup.add(table);

    // Cadeira
    const chair = new THREE.Group();
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.4), woodMaterial);
    seat.position.y = 0.4;
    seat.castShadow = true;
    chair.add(seat);

    const back = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.1), woodMaterial);
    back.position.set(0, 0.65, -0.15);
    back.castShadow = true;
    chair.add(back);

    const cLegGeo = new THREE.BoxGeometry(0.03, 0.4, 0.03);
    const cLegPos = [
        [-0.15, 0.2, -0.15], [0.15, 0.2, -0.15],
        [-0.15, 0.2, 0.15], [0.15, 0.2, 0.15]
    ];
    cLegPos.forEach(pos => {
        const leg = new THREE.Mesh(cLegGeo, woodMaterial);
        leg.position.set(...pos);
        leg.castShadow = true;
        chair.add(leg);
    });
    chair.position.set(-2, 0, -1.2);
    roomGroup.add(chair);

    // Lâmpada (Objeto físico)
    const lamp = new THREE.Group();
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.2), wallMaterial);
    lampBase.position.y = 3.9;
    lamp.add(lampBase);

    const lampBulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 16, 16),
        new THREE.MeshStandardMaterial({
            color: 0xffffcc,
            emissive: 0xffffcc,
            emissiveIntensity: 0.5
        })
    );
    lampBulb.position.y = 3.8;
    lampBulb.userData = { interactive: true, type: 'lamp' };
    lamp.add(lampBulb);
    roomGroup.add(lamp);

    // Janela
    const windowGroup = new THREE.Group();
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 1.2), wallMaterial);
    frame.position.set(-3, 2, 0);
    windowGroup.add(frame);

    const glass = new THREE.Mesh(
        new THREE.PlaneGeometry(1.1, 1.1),
        new THREE.MeshStandardMaterial({ color: 0x000000, transparent: true, opacity: 0.8 })
    );
    glass.position.set(-2.95, 2, 0);
    glass.rotation.y = Math.PI / 2;
    windowGroup.add(glass);
    roomGroup.add(windowGroup);

    // Porta - Pivotada no canto para futura rotação
    const door = new THREE.Group();

    // A folha da porta é deslocada para que o Group (pivot) fique na extremidade
    const doorLeaf = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3, 1), woodMaterial);
    doorLeaf.position.set(0, 1.5, 0.5); // Centro da folha deslocado em Z para pivotar na borda
    doorLeaf.castShadow = true;
    door.add(doorLeaf);

    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), new THREE.MeshStandardMaterial({ color: 0xaaaaaa }));
    knob.position.set(0.06, 1.5, 0.9); // Maçaneta no lado oposto ao pivot
    door.add(knob);

    // Posiciona o Group (pivot) na borda da porta (z=2.5, folha vai de 2.5 a 3.5)
    door.position.set(0, 0, 3);
    door.userData = { interactive: true, type: 'door' };
    roomGroup.add(door);

    scene.add(roomGroup);
    return roomGroup;
}
