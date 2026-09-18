# Quarto Abandonado

Um projeto de estudo em **Three.js** focado em aprender a construção de ambientes 3D exploráveis, iluminação atmosférica e sistemas de interação em primeira pessoa.

## Objetivo
O objetivo deste projeto é aplicar conceitos fundamentais de computação gráfica 3D, transformando um espaço simples em uma experiência imersiva e misteriosa, utilizando apenas JavaScript puro e geometrias primitivas.

## Tecnologias Utilizadas
- **HTML5 & CSS3**: Estrutura e interface de usuário (HUD).
- **JavaScript (ES6+)**: Lógica de jogo e controle de cena.
- **Three.js**: Motor 3D via CDN.

## Como Executar
Como o projeto utiliza Módulos ES, é necessário executá-lo através de um servidor local para evitar erros de CORS.

### Opções sugeridas:
1. **VS Code**: Instale a extensão **Live Server**, clique com o botão direito no `index.html` e selecione *"Open with Live Server"*.
2. **Node.js**: Execute `npx serve .` no terminal dentro da pasta do projeto.
3. **Python**: Execute `python -m http.server 8000`.

## Controles
- **Clique na tela**: Ativar controle de exploração (captura o mouse).
- **WASD**: Movimentação do jogador.
- **Mouse**: Olhar ao redor (360º horizontal, limitado verticalmente).
- **Tecla E**: Interagir com objetos (Lâmpada, Porta).
- **ESC**: Liberar o cursor do mouse.

## Conceitos Estudados
- **Cena & Renderização**: Uso de `THREE.Scene`, `PerspectiveCamera` e `WebGLRenderer` com suporte a sombras (`PCFSoftShadowMap`).
- **Geometrias Primitivas**: Construção de cenários usando `BoxGeometry`, `PlaneGeometry`, `SphereGeometry` e `CylinderGeometry`.
- **Iluminação Atmosférica**: Implementação de `AmbientLight` (luz base) e `PointLight` (luz localizada) para criar contraste e profundidade.
- **Controle FPS**: Implementação de `Pointer Lock API` e movimentação baseada em vetores locais da câmera e `deltaTime`.
- **Interação 3D**: Uso de `THREE.Raycaster` para detecção de objetos interativos através de tags em `userData`.
- **Animação**: Implementação de interpolação linear (Lerp) para a abertura e fechamento suave da porta.

## Futuras Expansões
- [ ] **Fase 2**: Implementação de lanterna, interruptores e gavetas interativas.
- [ ] **Fase 3**: Efeitos climáticos (chuva externa) e sons ambientes.
- [ ] **Fase 4**: Sistema de enigmas e documentos examináveis.
- [ ] **Fase 5**: Eventos aleatórios e mudanças dinâmicas na iluminação.
- [ ] **Fase 6**: Transformação em um jogo completo de investigação.
