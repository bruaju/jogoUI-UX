const startButton = document.getElementById("start-button");
const gameContainer = document.getElementById("game");
const player = document.getElementById("player");
const scoreBoard = document.getElementById("score");
let score = 0;
let isGameRunning = false;
let gameInterval;
let enemyInterval;

// Função para iniciar o jogo
function startGame() {
    isGameRunning = true;
    score = 0;
    scoreBoard.innerText = score;
    startButton.classList.add("hidden");
    gameContainer.classList.remove("hidden");
    player.style.left = "50%";

    gameInterval = setInterval(updateGame, 20);
    enemyInterval = setInterval(createEnemy, 1000);
}

// Função para criar inimigos
function createEnemy() {
    if (!isGameRunning) return;

    const enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemy.style.left = `${Math.floor(Math.random() * 370)}px`; // Posiciona aleatoriamente no eixo X
    gameContainer.appendChild(enemy);

    // Movimentação do inimigo
    const enemyFallInterval = setInterval(() => {
        if (!isGameRunning) return;

        let enemyTop = parseInt(window.getComputedStyle(enemy).getPropertyValue("top"));
        enemy.style.top = `${enemyTop + 4}px`;

        // Checar colisão com o jogador
        if (detectCollision(player, enemy)) {
            endGame();
        }

        // Remover inimigos fora da tela
        if (enemyTop > 600) {
            enemy.remove();
            clearInterval(enemyFallInterval);
            score++;
            scoreBoard.innerText = score;

            // Verificar se o jogador atingiu 50 pontos
            if (score >= 50) {
                endGameWithVictory();
            }
        }
    }, 20);
}

// Função de detecção de colisão
function detectCollision(player, enemy) {
    const playerRect = player.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();
    return !(
        playerRect.top > enemyRect.bottom ||
        playerRect.bottom < enemyRect.top ||
        playerRect.right < enemyRect.left ||
        playerRect.left > enemyRect.right
    );
}

// Movimentação do jogador
document.addEventListener("keydown", (e) => {
    if (!isGameRunning) return;

    const playerLeft = parseInt(window.getComputedStyle(player).getPropertyValue("left"));

    if (e.key === "ArrowLeft" && playerLeft > 0) {
        player.style.left = `${playerLeft - 10}px`;
    }

    if (e.key === "ArrowRight" && playerLeft < 360) {
        player.style.left = `${playerLeft + 10}px`;
    }
});

// Função para atualizar o jogo (se precisar de outros eventos)
function updateGame() {}

// Função para encerrar o jogo em caso de derrota
function endGame() {
    isGameRunning = false;
    clearInterval(gameInterval);
    clearInterval(enemyInterval);
    alert(`Game Over! Pontuação final: ${score}`);
    document.querySelectorAll(".enemy").forEach((enemy) => enemy.remove());
    showRestartOptions();
}

// Função para encerrar o jogo com vitória ao atingir 50 pontos
function endGameWithVictory() {
    isGameRunning = false;
    clearInterval(gameInterval);
    clearInterval(enemyInterval);
    alert(`Parabéns! Você alcançou 50 pontos e completou esta fase!`);
    document.querySelectorAll(".enemy").forEach((enemy) => enemy.remove());
    showNextPhaseOptions();
}

// Exibir opções para reiniciar o jogo ou avançar para a próxima fase
function showRestartOptions() {
    startButton.classList.remove("hidden");
    gameContainer.classList.add("hidden");
}

// Exibir opções para ir para a próxima fase ou voltar para a tela inicial
function showNextPhaseOptions() {
    // Remover opções anteriores se houver
    const existingOptions = document.querySelector(".options-container");
    if (existingOptions) existingOptions.remove();

    const optionsContainer = document.createElement("div");
    optionsContainer.classList.add("options-container");

    const title = document.createElement("h2");
    title.innerText = "Fim do Jogo";
    optionsContainer.appendChild(title);

    const nextPhaseButton = document.createElement("button");
    nextPhaseButton.innerText = "Próxima Fase";
    nextPhaseButton.classList.add("option-button");
    nextPhaseButton.addEventListener("click", () => {
        window.location.href = "fase2.html"; // Link para a próxima fase
    });

    const homeButton = document.createElement("button");
    homeButton.innerText = "Tela Inicial";
    homeButton.classList.add("option-button");
    homeButton.addEventListener("click", () => {
        window.location.href = "index.html"; // Link para a tela inicial
    });

    optionsContainer.appendChild(nextPhaseButton);
    optionsContainer.appendChild(homeButton);
    document.body.appendChild(optionsContainer);
}

// Iniciar o jogo ao pressionar o botão
startButton.addEventListener("click", startGame);
