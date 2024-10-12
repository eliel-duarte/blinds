// Adicione os caminhos dos arquivos de som
const sound1m = new Audio('falta_1m.mp3');
const sound5s = new Audio('falta_5s.mp3');
const soundMudarBlind = new Audio('mudar_blind.mp3');

// Dados de blinds e ante para cada nível
const blindsLevels = [
    { blinds: "100/200", ante: 200 },
    { blinds: "200/400", ante: 200 },
    { blinds: "300/600", ante: 300 },
    { blinds: "400/800", ante: 400 },
    { blinds: "500/1000", ante: 500 },
    { blinds: "600/1200", ante: 600 },
    { blinds: "800/1600", ante: 800 },
    { blinds: "1000/2000", ante: 1000 },
    { blinds: "1200/2400", ante: 1200 },
    { blinds: "1500/3000", ante: 1500 },
    { blinds: "2000/4000", ante: 2000 },
    { blinds: "2500/5000", ante: 2500 },
    { blinds: "3000/6000", ante: 3000 },
    { blinds: "4000/8000", ante: 4000 },
    { blinds: "5000/10000", ante: 5000 },
    { blinds: "6000/12000", ante: 6000 },
    { blinds: "8000/16000", ante: 8000 },
    { blinds: "10000/20000", ante: 10000 },
    { blinds: "12000/24000", ante: 12000 },
    { blinds: "15000/30000", ante: 15000 },
    { blinds: "20000/40000", ante: 20000 },
    { blinds: "25000/50000", ante: 25000 },
    { blinds: "30000/60000", ante: 30000 },
    { blinds: "40000/80000", ante: 40000 },
    { blinds: "50000/100000", ante: 50000 },
    { blinds: "60000/120000", ante: 60000 },
];

let currentLevel = 0;
let timerInterval;
let timeLeft = 1200; // 20 minutos em segundos
let isPaused = true; // Inicia em estado pausado

// Verifica se existem dados no localStorage
if (localStorage.getItem('currentLevel')) {
    currentLevel = parseInt(localStorage.getItem('currentLevel'));
}
if (localStorage.getItem('timeLeft')) {
    timeLeft = parseInt(localStorage.getItem('timeLeft'));
}
if (localStorage.getItem('isPaused')) {
    isPaused = localStorage.getItem('isPaused') === 'true';
}

// Referências aos elementos DOM
const timerDisplay = document.querySelector('.timer');
const levelDisplay = document.querySelector('.level');
const blindsDisplay = document.querySelector('.blinds');
const anteDisplay = document.querySelector('.ante');
const nextBlindsDisplay = document.querySelector('.next-blinds');
const nextAnteDisplay = document.querySelector('.next-ante');
const pauseButtonIcon = document.querySelector('#pausar i'); // Referência ao ícone do botão de pausar

const nivel = document.querySelector('#nivel');

// Inicia o timer
function startTimer() {
    if (timerInterval) return; // Impede a criação de múltiplas instâncias do timer
    timerInterval = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            updateTimerDisplay();

            // Quando o tempo acabar, avança para o próximo nível
            if (timeLeft <= 0) {
                nextLevel();
            }
        }

        // Armazena o estado atual no localStorage
        localStorage.setItem('timeLeft', timeLeft);
    }, 1000);
}

// Função para verificar e tocar sons apropriados
function checkSounds() {
    if (timeLeft === 60) { // Faltando 1 minuto
        sound1m.play();
    } else if (timeLeft === 4) { // Faltando 4 segundos
        sound5s.play();
    } else if (timeLeft === 0) { // Quando chega a 0
        soundMudarBlind.play();
    }
}

// Avança para o próximo nível
function nextLevel() {
    if (currentLevel < blindsLevels.length - 1) {
        currentLevel++;
        updateDisplays();
        resetTimer(); // Reseta o timer para 20 minutos, mas o cronômetro continua
        if (!isPaused) {
            startTimer(); // Reinicia o timer se não estiver pausado
        }

        // Armazena o nível atual no localStorage
        localStorage.setItem('currentLevel', currentLevel);
    }
}

// Volta para o nível anterior
function previousLevel() {
    if (currentLevel > 0) {
        currentLevel--;
        updateDisplays();
        resetTimer();

        // Armazena o nível atual no localStorage
        localStorage.setItem('currentLevel', currentLevel);
    }
}

// Pausa ou continua o timer
function togglePause() {
    isPaused = !isPaused;

    // Muda o ícone dependendo do estado
    if (isPaused) {
        pauseButtonIcon.classList.remove('fa-pause');
        pauseButtonIcon.classList.add('fa-play');
    } else {
        pauseButtonIcon.classList.remove('fa-play');
        pauseButtonIcon.classList.add('fa-pause');
        startTimer(); // Inicia o timer se não estiver pausado
    }

    // Armazena o estado de pausa no localStorage
    localStorage.setItem('isPaused', isPaused);
}

// Reinicia apenas o cronômetro
function resetTimer() {
    timeLeft = 1200; // Zera o cronômetro para 20 minutos
    updateTimerDisplay(); // Atualiza a exibição do timer
}

// Atualiza a exibição do cronômetro
function updateTimerDisplay() {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // Verifica os sons quando o timer é atualizado
    checkSounds();
}

// Atualiza as exibições de nível, blinds e ante
function updateDisplays() {
    levelDisplay.textContent = `Nível ${currentLevel + 1}`;
    nivel.textContent = currentLevel + 1;
    blindsDisplay.textContent = blindsLevels[currentLevel].blinds;
    anteDisplay.textContent = `Ante: ${blindsLevels[currentLevel].ante}`;
    nextBlindsDisplay.textContent = blindsLevels[currentLevel + 1] ? blindsLevels[currentLevel + 1].blinds : 'N/A';
    nextAnteDisplay.textContent = blindsLevels[currentLevel + 1] ? `Ante: ${blindsLevels[currentLevel + 1].ante}` : 'N/A';
}

// Configura os eventos dos botões
document.getElementById('voltar').addEventListener('click', previousLevel);
document.getElementById('pausar').addEventListener('click', togglePause);
document.getElementById('reiniciar').addEventListener('click', resetTimer);
document.getElementById('avancar').addEventListener('click', nextLevel);

// Atualiza a exibição inicial
updateTimerDisplay(); // Exibe o tempo inicial
updateDisplays(); // Exibe o nível, blinds e ante iniciais

// Atualiza o estado do botão de pausar
if (isPaused) {
    pauseButtonIcon.classList.remove('fa-pause');
    pauseButtonIcon.classList.add('fa-play');
} else {
    pauseButtonIcon.classList.remove('fa-play');
    pauseButtonIcon.classList.add('fa-pause');
    startTimer(); // Inicia o timer se não estiver pausado
}
