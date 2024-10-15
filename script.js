// Adicione os caminhos dos arquivos de som
const sound1m = new Audio('falta_1m.mp3');
const sound5s = new Audio('falta_5s.mp3');
const soundMudarBlind = new Audio('mudar_blind.mp3');

let blindsLevels = []; // Variável para armazenar os blinds

// Função para carregar blinds a partir de um arquivo JSON
async function loadBlinds() {
    try {
        const response = await fetch('blindsLevels.json'); // Caminho para o arquivo JSON
        blindsLevels = await response.json(); // Armazena os dados na variável

        // Recupera o nível e o tempo restantes do localStorage
        if (localStorage.getItem('currentLevel')) {
            currentLevel = parseInt(localStorage.getItem('currentLevel'), 10);
        }

        if (localStorage.getItem('timeLeft')) {
            timeLeft = parseInt(localStorage.getItem('timeLeft'), 10);
        }

        console.log(blindsLevels); // Verifica os dados carregados
        updateDisplays(); // Atualiza a interface com os dados recuperados
    } catch (error) {
        console.error('Erro ao carregar os blinds:', error);
    }
}

// Chama a função para carregar os blinds ao iniciar o script
loadBlinds();

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

// Função para abrir e fechar o menu lateral
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    } else {
        sidebar.classList.add('active');
    }
}

// Função de salvar as configurações
function saveSettings() {
    const tournamentName = document.getElementById('tournament-name').value;
    const blindTime = document.getElementById('blind-time').value;
    const startingBlinds = document.getElementById('starting-blinds').value;
    const ante = document.getElementById('ante').value;

    // Exemplo: salvar no localStorage (pode adaptar para outras funcionalidades)
    localStorage.setItem('tournamentName', tournamentName);
    localStorage.setItem('blindTime', blindTime);
    localStorage.setItem('startingBlinds', startingBlinds);
    localStorage.setItem('ante', ante);

    // Exibir uma mensagem ou fazer qualquer ação após salvar
    alert('Configurações salvas com sucesso!');
}

document.querySelectorAll('input[type="text"]').forEach(function(input) {
    input.addEventListener('input', function() {
        if (!this.value.match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/)) {
            this.setCustomValidity('Por favor, insira o tempo no formato HH:MM:SS');
        } else {
            this.setCustomValidity('');
        }
    });
});


