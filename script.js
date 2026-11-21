
const MOVE_SPEED = 3;
const GRAVITY = 0.5;
const JUMP_STRENGTH = -7.6;
const PIPE_GAP = 35;
const PIPE_INTERVAL = 1900;

// Elementos do jogo
const bird = document.querySelector('.bird');
const birdImage = document.getElementById('bird-1');
let birdJumping = false;
const background = document.querySelector('.background');
const score = document.getElementById('score');
const scoreValue = document.querySelector('.score_val');
const scoreTitle = document.querySelector('.score_title');
const message = document.getElementById('message');

const mainMenu = document.getElementById('mainMenu');
const eventsMenu = document.getElementById('eventsMenu');
const totalPointsDisplay = document.getElementById('totalPoints');
const profileMenu = document.getElementById('profileMenu');
const shopMenu = document.getElementById('shopMenu');
const shopPointsDisplay = document.getElementById('shopPoints');

// Sons
const soundPoint = new Audio('sounds effect/point.mp3');
const soundDie = new Audio('sounds effect/die.mp3');
const backgroundMusic ={
    classic: new Audio('sons1/jogo.mp3'),
    star: new Audio('sons1/imperial.mp3'),
    angry: new Audio('sons1/AngryBirds.mp3'),
    america: new Audio('sons1/Interstellar.mp3'),
    russia: new Audio('sons1/jurassic.mp3'),
    dragonball: new Audio('sons1/Dragon Ball.mp3'),
    cyber: new Audio('sons1/Cybernetic.mp3'),
    airface: new Audio('sons1/airwar.mp3'),
}


// Modos de jogo
const modes = {
    classic: {
        bird: 'Imagens/Bird.png',
        birdUp: 'Imagens/Bird-2.png',
        background: 'Imagens/background-img.png'
    },
    star: {
        bird: 'Star/Darth.png',
        birdUp: 'Star/Darth2.png',
        background: 'Star/wars.png'
    },
    angry: {
        bird: 'Angry/red.png',
        background: 'Angry/d.png'
    },
    airface: {
        bird: 'airflane/airforce.png',
        birdUp: 'airflane/airforce2.png',
        background: 'airflane/airmap.png'
    },
    america: {
        bird: 'usa/donald.png',
        birdUp: 'usa/donald2.png',
        background: 'usa/nova.png'
    },
    russia: {
        bird: 'rs/putin.png',
        birdUp: 'rs/putin2.png',
        background: 'rs/moscovo.png'
    },
    dragonball: {
        bird: 'anime/goku.png',
        birdUp: 'anime/goku2.png',
        background: 'anime/dragon.png'
    },
    cyber: {
        bird: 'cyber/cyberbird.png',
        birdUp: 'cyber/cyberbird2.png',
        background: 'cyber/cybermap.png'
    },
};



// Skins disponíveis na loja
const skins = [
    // comuns apenas as comuns
    { nome: 'Pombo', imagem: 'Comuns/pombo.png', raridade: 'Comum', preco: 100},
    { nome: 'Pato', imagem: 'Comuns/pato.png', raridade: 'Comum', preco: 100},
    { nome: 'Papagaio', imagem: 'Comuns/papagaio.png', raridade: 'Comum',  preco: 100},
    { nome: 'Galinha', imagem: 'Comuns/galinha.png', raridade: 'Comum',  preco: 100 },
    { nome: 'Coruja', imagem: 'Comuns/coruja.png', raridade: 'Comum',  preco: 100 },

    // raras apenas as raras
    { nome: 'Zombie', imagem: 'Raros/zombie.png', raridade: 'Rara', preco: 300 },
    { nome: 'Morcego', imagem: 'Raros/morcego.png', raridade: 'Rara', preco: 300 },
    { nome: 'Libélula', imagem: 'Raros/Libélula.png', raridade: 'Rara', preco: 300 },
    { nome: 'Falcão', imagem: 'Raros/falcao.png', raridade: 'Rara', preco: 300 },
    { nome: 'Corvo', imagem: 'Raros/corvo.png', raridade: 'Rara', preco: 300 },

    // epicas tbm tem mapas algumas
    { nome: 'Bruxa', imagem: 'Epico/bruxa.png', raridade: 'Épica', preco: 700 },
    { nome: 'Gelo', imagem: 'Epico/gelo.png', raridade: 'Épica', preco: 700 },
    { nome: 'Natal', imagem: 'Epico/Natal.png', raridade: 'Épica', preco: 700 },
    { nome: 'Pirata', imagem: 'Epico/pirata.png', raridade: 'Épica', preco: 700 },
    { nome: 'Samurai', imagem: 'Epico/samurai.png', raridade: 'Épica', preco: 700 },

    // miticas tem mapas
    { nome: 'Fénix', imagem: 'Mitico/fenix.png', raridade: 'Mítica', preco: 1500 },
    { nome: 'Trovão', imagem: 'Mitico/trovao.png', raridade: 'Mítica', preco: 1500 },
    { nome: 'Tesla', imagem: 'Mitico/tesla.png', raridade: 'Mítica', preco: 1500 },

    // Secretas
    { nome: 'OVNI', imagem: 'Secreto/ovni.png', raridade: 'Secreta', preco: 'Desbloqueada ao alcançar o 1.º lugar no ranking' }
];

// Estado do jogo
let gameState = 'Menu';
let currentMode = 'classic';
let birdVelocity = 0;
let lastTime = 0;
let pipeTimer = 0;
let animationId = null;
let totalPoints = Number(localStorage.getItem('totalPoints')) || 0;
const MODO_ADMIN = true; //temporario ok 
let skinsCompradas = JSON.parse(localStorage.getItem('skinsCompradas')) || [];
let skinEquipada = localStorage.getItem('skinEquipada') || null;

// Preparação inicial
birdImage.style.display = 'none';
score.classList.add('hidden');

// Mostrar o menu principal
function showMainMenu() {
    gameState = 'Menu';

    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    clearPipes();

    birdImage.style.display = 'none';
    score.classList.add('hidden');
    message.classList.add('hidden');
    profileMenu.classList.add('hidden');
    shopMenu.classList.add('hidden');
    mainMenu.classList.remove('hidden');
    eventsMenu.classList.add('hidden');

    stopSounds();
    stopBackgroundMusic();
}

function updateTotalPoints(){
    const pontos = MODO_ADMIN ? '∞' : totalPoints;
    totalPointsDisplay.textContent = `Points: ${pontos}`;
    shopPointsDisplay.textContent = `Points: ${pontos}`;
}

// Mostrar o menu de eventos
function showEventsMenu() {
    mainMenu.classList.add('hidden');
    eventsMenu.classList.remove('hidden');
}

function showProfileMenu() {
    mainMenu.classList.add('hidden');
    eventsMenu.classList.add('hidden');
    profileMenu.classList.remove('hidden');
}

function showShopMenu() {
    mainMenu.classList.add('hidden');
    eventsMenu.classList.add('hidden');
    profileMenu.classList.add('hidden');
    shopMenu.classList.remove('hidden');
    updateTotalPoints();

    displaySkins();
}

function displaySkins(){
    const container = document.getElementById('skinsContainer');
    container.innerHTML = '';
    skins.forEach(skin => {
        const card = document.createElement('div');
        card.className = 'skin-card';
        const comprada = skinsCompradas.includes(skin.nome);
        const raridadeClass= {
            'Comum': 'comum',
            'Rara': 'rara',
            'Épica': 'epica',
            'Mítica': 'mitica',
            'Secreta': 'secreta'
        };
        card.classList.add(raridadeClass[skin.raridade]);
        card.innerHTML = `
            <img src="${skin.imagem}" alt="${skin.nome}">
            <h3>${skin.nome}</h3>
            <p>Raridade: ${skin.raridade}</p>
            <p>Pontos para Desbloquear:  ${
                skin.raridade === 'Secreta' 
                ? skin.preco
                : skin.preco + ' pontos'
            }</p>

            <button ${skinEquipada === skin.nome ? 'disabled' : ''}>
                ${ 
                    skinEquipada === skin.nome
                    ? 'Equipada'
                    : comprada
                    ? 'Equipar'
                    : skin.raridade === 'Secreta'
                        ? 'Desbloquear'
                        : 'Comprar'
                }
            </button>

        `;
        container.appendChild(card);

        const button = card.querySelector('button');
        button.addEventListener('click', () => {
            if(comprada){
                skinEquipada = skin.nome;
                localStorage.setItem('skinEquipada', skinEquipada);
                displaySkins();
                alert(`Equipaste a skin ${skin.nome}!`);
                return;
            }
            comprarSkin(skin);
        });
    });
}

function comprarSkin(skin) {

    if (skin.raridade === 'Secreta') {
        alert('Esta skin é desbloqueada ao alcançar o 1.º lugar no ranking!');
        return;
    }

    if (skinsCompradas.includes(skin.nome)) {
        return;
    }

    if (!MODO_ADMIN && totalPoints < skin.preco) {
        alert('Não tens pontos suficientes para comprar esta skin!');
        return;
    }

    if (!MODO_ADMIN) {
        totalPoints -= skin.preco;
        localStorage.setItem('totalPoints', totalPoints);
    }

    skinsCompradas.push(skin.nome);

    localStorage.setItem('skinsCompradas', JSON.stringify(skinsCompradas));

    updateTotalPoints();
    displaySkins();

    alert(`Compraste a skin ${skin.nome}!`);
}


// Limpar obstáculos
function clearPipes() {
    document.querySelectorAll('.pipe_sprite').forEach(pipe => {
        pipe.remove();
    });
}

// Parar os sons
function stopSounds() {
    soundPoint.pause();
    soundPoint.currentTime = 0;

    soundDie.pause();
    soundDie.currentTime = 0;
}

function stopBackgroundMusic() {
    Object.values(backgroundMusic).forEach(music => {
        music.pause();
        music.currentTime = 0;
    });
}

function playBackgroundMusic(mode) {
    stopBackgroundMusic();
    const music = backgroundMusic[mode];

    if (!music) return;

    music.loop = true;
    music.volume = 0.3;
    music.currentTime = 0;
    music.play().catch(() => {});
}

// Iniciar ou reiniciar um modo
function startGame(mode = currentMode) {
    currentMode = mode;
    const selectedMode = modes[currentMode];

    if (!selectedMode) return;

    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    clearPipes();
    stopSounds();

    // Escolher as imagens do modo
    birdImage.src = selectedMode.bird;
    background.style.backgroundImage =
        `url("${selectedMode.background}")`;

    document.body.classList.remove(
        'mode-classic',
        'mode-star',
        'mode-angry',
        'mode-america',
        'mode-russia',
        'mode-dragonball',
        'mode-cyber',
        'mode-airface'
    );

    document.body.classList.add(`mode-${currentMode}`);

    // Reiniciar as variáveis
    bird.style.top = '40vh';
    birdVelocity = 0;
    pipeTimer = 0;
    lastTime = 0;
    birdJumping = false;
    updateBirdImage();


    birdImage.style.display = 'block';

    scoreValue.textContent = '0';
    scoreTitle.textContent = 'Pontuação: ';

    score.classList.remove('hidden');
    mainMenu.classList.add('hidden');
    eventsMenu.classList.add('hidden');
    message.classList.add('hidden');

    gameState = 'Play';
    playBackgroundMusic(currentMode);
    animationId = requestAnimationFrame(gameLoop);
}

// Terminar o jogo
function endGame() {
    if (gameState !== 'Play') return;

    gameState = 'End';
    totalPoints += Number(scoreValue.textContent);
    localStorage.setItem('totalPoints', totalPoints);
    updateTotalPoints();
    stopBackgroundMusic();
    birdImage.style.display = 'none';
    

    message.innerHTML = `
        <h2>Game Over!</h2>
        <p>Pontuação: ${scoreValue.textContent}</p>
        <button id="restartGame">Jogar novamente</button>
        <button id="returnToMenu" class="secondary-button">
            Menu principal
        </button>
    `;

    message.classList.remove('hidden');

    soundDie.currentTime = 0;
    soundDie.play().catch(() => {});
}

function updateBirdImage() {
    const selectedMode = modes[currentMode];

    // Verificar se estamos no modo clássico e temos uma skin equipada
    if (currentMode === 'classic' && skinEquipada) {
        const skinSelecionada = skins.find(
            skin => skin.nome === skinEquipada
        );
        if (skinSelecionada) {
            birdImage.src = birdJumping
                ? skinSelecionada.imagem.replace('.png', '2.png')
                : skinSelecionada.imagem;
            return;
        }
    }
    if (!selectedMode.birdUp){
        birdImage.src = selectedMode.bird;
        return; 
    }

    birdImage.src = birdJumping
        ? selectedMode.birdUp
        : selectedMode.bird;
}

// Fazer o pássaro saltar
function jump() {
    if (gameState !== 'Play') return;

    birdVelocity = JUMP_STRENGTH;
    birdJumping = true;
    updateBirdImage();
}

// Criar um par de obstáculos
function createPipe() {
    const pipePosition = Math.floor(Math.random() * 43) + 8;

    const topPipe = document.createElement('div');
    topPipe.className = 'pipe_sprite';
    topPipe.style.top = `${pipePosition - 70}vh`;
    topPipe.style.left = '100vw';

    const bottomPipe = document.createElement('div');
    bottomPipe.className = 'pipe_sprite';
    bottomPipe.style.top = `${pipePosition + PIPE_GAP}vh`;
    bottomPipe.style.left = '100vw';

    // Só o obstáculo inferior conta para a pontuação
    bottomPipe.dataset.scored = 'false';

    document.body.append(topPipe, bottomPipe);
}

// Verificar colisões
function checkCollision(birdRect, pipeRect) {
    return (
        birdRect.left < pipeRect.right &&
        birdRect.right > pipeRect.left &&
        birdRect.top < pipeRect.bottom &&
        birdRect.bottom > pipeRect.top
    );
}

// Mover obstáculos, verificar colisões e contar pontos
function updatePipes(delta) {
    const pipes = document.querySelectorAll('.pipe_sprite');
    const birdRect = bird.getBoundingClientRect();

    pipes.forEach(pipe => {
        if (gameState !== 'Play') return;

        const left = pipe.getBoundingClientRect().left;
        const nextLeft = left - MOVE_SPEED * delta;

        pipe.style.left = `${nextLeft}px`;

        if (nextLeft + pipe.offsetWidth < 0) {
            pipe.remove();
            return;
        }

        const pipeRect = pipe.getBoundingClientRect();

        if (checkCollision(birdRect, pipeRect)) {
            endGame();
            return;
        }

        if (
            pipe.dataset.scored === 'false' &&
            pipeRect.right < birdRect.left
        ) {
            pipe.dataset.scored = 'true';

            scoreValue.textContent =
                Number(scoreValue.textContent) + 1;

            soundPoint.currentTime = 0;
            soundPoint.play().catch(() => {});
        }
    });
}

// Ciclo principal do jogo
function gameLoop(timestamp) {
    if (gameState !== 'Play') return;

    const elapsed = lastTime === 0
        ? 1000 / 60
        : timestamp - lastTime;

    const delta = Math.min(elapsed / (1000 / 60), 2);

    lastTime = timestamp;
    pipeTimer += elapsed;

    // Aplicar gravidade
    birdVelocity += GRAVITY * delta;

    if (birdVelocity > 0) {
        birdJumping = false;
        updateBirdImage();
    }

    const birdTop = bird.getBoundingClientRect().top;
    bird.style.top = `${birdTop + birdVelocity * delta}px`;

    const birdRect = bird.getBoundingClientRect();
    const backgroundRect = background.getBoundingClientRect();

    // Verificar se o pássaro saiu do ecrã
    if (
        birdRect.top <= backgroundRect.top ||
        birdRect.bottom >= backgroundRect.bottom
    ) {
        endGame();
        return;
    }

    // Criar obstáculos em intervalos regulares
    if (pipeTimer >= PIPE_INTERVAL) {
        pipeTimer -= PIPE_INTERVAL;
        createPipe();
    }

    updatePipes(delta);

    if (gameState === 'Play') {
        animationId = requestAnimationFrame(gameLoop);
    }
}

// Botões dos menus
document.getElementById('playClassic').addEventListener('click', () => {
    startGame('classic');
});

document.getElementById('openEvents').addEventListener('click', () => {
    showEventsMenu();
});

document.getElementById('abrirPerfil').addEventListener('click', () => {
    showProfileMenu();
});

document.getElementById('backFromProfile').addEventListener('click', () => {
    showMainMenu();
});

document.getElementById('playStar').addEventListener('click', () => {
    startGame('star');
});

document.getElementById('playAngry').addEventListener('click', () => {
    startGame('angry');
});


document.getElementById('playAirface').addEventListener('click', () => {
    startGame('airface');
});

document.getElementById('playDragonball').addEventListener('click', () => {
    startGame('dragonball');
});

document.getElementById('playCyber').addEventListener('click', () => {
    startGame('cyber');
});

document.getElementById('playRussia').addEventListener('click', () => {
    startGame('russia');
});

document.getElementById('playAmerica').addEventListener('click', () => {
    startGame('america');
});

document.getElementById('backToMenu').addEventListener('click', () => {
    showMainMenu();
});

document.getElementById('OpenShop').addEventListener('click', () => {
    showShopMenu();
});

document.getElementById('backFromShop').addEventListener('click', () => {
    showMainMenu();
});

// Botões do ecrã de Game Over
message.addEventListener('click', event => {
    if (event.target.id === 'restartGame') {
        startGame(currentMode);
    }

    if (event.target.id === 'returnToMenu') {
        showMainMenu();
    }
});

// Controlos do teclado
document.addEventListener('keydown', event => {
    if (
        event.code === 'Space' ||
        event.code === 'ArrowUp'
    ) {
        if (gameState === 'Play') {
            event.preventDefault();

            if (!event.repeat) {
                jump();
            }
        }
    }

    if (event.key === 'Enter') {
        if (gameState === 'Menu') {
            startGame('classic');
        } else if (gameState === 'End') {
            startGame(currentMode);
        }
    }
});

updateTotalPoints();
// Começar no menu principal
showMainMenu();


