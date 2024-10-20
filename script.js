        // Previne o menu de contexto padrão e exibe uma mensagem
        window.addEventListener('contextmenu', function (e) {
            //e.preventDefault(); // Evita que o menu de contexto apareça
            //alert(' bad beat! isso não é permitido :('); // Exibe a mensagem personalizada
        });

// Adicione os caminhos dos arquivos de som
const sound1m = new Audio('falta_1m.mp3');
const sound5s = new Audio('falta_5s.mp3');
const soundMudarBlind = new Audio('mudar_blind.mp3');


            // Verifica o número de elementos da lista de prêmios
            let prizeList = document.querySelector('.prize-list');
            let prizeItems = prizeList.querySelectorAll('li');

        // Inicializa a variável para os níveis de blinds
        let blindsLevels = [];
        // Função para carregar os dados do arquivo JSON
        async function loadBlindsLevels() {
            try {
                const response = await fetch('blind-padrao.json'); // Caminho para o arquivo JSON
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                blindsLevels = await response.json(); // Converte a resposta em JSON

                if (localStorage.getItem('blindsLevels')) {
                    blindsLevels = JSON.parse(localStorage.getItem('blindsLevels'));
                }

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

            } catch (error) {
                console.error('Erro ao carregar os níveis de blinds:', error);
            }
        }        

        
        // carrega os blinds padrão
        loadBlindsLevels();
        

let currentLevel = 0;
let timerInterval;
let timeLeft = 900;
let isPaused = true; // Inicia em estado pausado

// Verifica se existem dados no localStorage
if (localStorage.getItem('blindsLevels')) {
    blindsLevels = JSON.parse(localStorage.getItem('blindsLevels'));
}
if (localStorage.getItem('currentLevel')) {
    currentLevel = parseInt(localStorage.getItem('currentLevel'));
}
if (localStorage.getItem('timeLeft')) {
    timeLeft = parseInt(localStorage.getItem('timeLeft'));
}
if (localStorage.getItem('isPaused')) {
    isPaused = localStorage.getItem('isPaused') === 'true';
}
if (localStorage.getItem('blindPre')) {
    blindPre = parseInt(localStorage.getItem('blindPre'));
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

    // carrega os blinds padrão
    loadBlindsLevels();   

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

    // carrega os blinds padrão
    loadBlindsLevels();

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
        document.body.classList.add('paused'); // Adiciona a classe paused para fundo vermelho

    } else {
        pauseButtonIcon.classList.remove('fa-play');
        pauseButtonIcon.classList.add('fa-pause');
        document.body.classList.remove('paused'); // Remove a classe paused quando continuar

        startTimer(); // Inicia o timer se não estiver pausado
    }

    AtualizaCores();  

    // Armazena o estado de pausa no localStorage
    localStorage.setItem('isPaused', isPaused);
}

// Reinicia apenas o cronômetro
function resetTimer() {    
    // Converte os valores para inteiros para garantir que a comparação seja correta
    const currentNivel = parseInt(blindsLevels[currentLevel].nivel, 10); 
    const tardio = parseInt(localStorage.getItem('tardio'), 10);

    // Verifica se o nível atual é maior ou igual ao nível de registro tardio
    if (currentNivel >= tardio) {        
        // Converte o valor de 'blindPos' em inteiro ao atribuir para 'timeLeft'
        timeLeft = parseInt(localStorage.getItem('blindPos'), 10);
    } else {        
        // Converte o valor de 'blindPre' em inteiro ao atribuir para 'timeLeft'
        timeLeft = parseInt(localStorage.getItem('blindPre'), 10);
    }

    // Armazena o estado atual no localStorage
    localStorage.setItem('timeLeft', timeLeft);

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

    // Atualiza nome
    document.querySelector('.title').textContent = localStorage.getItem('tournamentName');
    // Atualiza Registro tardio
    document.querySelector('.info-tardio').textContent = localStorage.getItem('tardio');
    // Atualiza Cores
    AtualizaCores();

}

// Atualiza as exibições de nível, blinds e ante
function updateDisplays() {
    levelDisplay.textContent = `Nível ${blindsLevels[currentLevel].nivel}`;
    nivel.textContent = blindsLevels[currentLevel].nivel;
    blindsDisplay.textContent = blindsLevels[currentLevel].sb+'/'+blindsLevels[currentLevel].bb;
    anteDisplay.textContent = `Ante: ${blindsLevels[currentLevel].ante}`;
    nextBlindsDisplay.textContent = blindsLevels[currentLevel + 1] ? blindsLevels[currentLevel + 1].sb+'/'+blindsLevels[currentLevel + 1].bb: 'N/A';
    nextAnteDisplay.textContent = blindsLevels[currentLevel + 1] ? `Ante: ${blindsLevels[currentLevel + 1].ante}` : 'N/A';  
}

function AtualizaCores(){
    var bigblind = blindsLevels[currentLevel].bb;

    if (typeof bigblind === 'string' && bigblind.toLowerCase() === 'intervalo') {
        document.querySelector('.meio').style.backgroundColor = "rgb(52, 168, 83)";            
    }else if (isPaused) {
        document.querySelector('.meio').style.backgroundColor = "rgb(234, 67, 53)";
    }else{
        document.querySelector('.meio').style.backgroundColor = "#00aaff";
    }    
}

// Configura os eventos dos botões
document.getElementById('voltar').addEventListener('click', previousLevel);
document.getElementById('pausar').addEventListener('click', togglePause);
document.getElementById('reiniciar').addEventListener('click', resetTimer);
document.getElementById('avancar').addEventListener('click', nextLevel);

// Atualiza a exibição inicial
updateTimerDisplay(); // Exibe o tempo inicial
updateDisplays(); // Exibe o nível, blinds e ante iniciais

// Função para abrir e fechar o menu lateral
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    } else {
        sidebar.classList.add('active');
    }

    // carregar formulário
    document.getElementById('tournament-name').value = localStorage.getItem('tournamentName');
    document.getElementById('blind-time-pre').value = secondsToHHMMSS(localStorage.getItem('blindPre'));
    document.getElementById('blind-time-pos').value = secondsToHHMMSS(localStorage.getItem('blindPos'));
    document.getElementById('tardio').value = localStorage.getItem('tardio');
}

// Função de salvar as configurações
function saveSettings() {
    const tournamentName = document.getElementById('tournament-name').value;
    const blindPre = timeToSeconds(document.getElementById('blind-time-pre').value);
    const blindPos = timeToSeconds(document.getElementById('blind-time-pos').value);
    const tardio = document.getElementById('tardio').value;

    localStorage.setItem('tournamentName', tournamentName);
    localStorage.setItem('blindPre', blindPre);
    localStorage.setItem('blindPos', blindPos);
    localStorage.setItem('tardio', tardio);

    // salvar alterações nos blinds
    saveBlinds();

    //console.log(tardio);
    toggleMenu();
}

    function resetAndSave() {

        // Mostra a caixa de diálogo de confirmação
        document.getElementById('confirmation-dialog').style.display = 'flex';
    
        // Aguarda a resposta do usuário
        document.getElementById('confirm-yes').onclick = function() {
    
            // Salvar as configurações
            saveSettings();

            // Reseta o nível para -1 e avança para o primeiro nível
            currentLevel = -1;
            nextLevel();

            // pausa se não tiver pausado
            if (!isPaused) {
                togglePause();
            }
            // Fecha a caixa de diálogo
            document.getElementById('confirmation-dialog').style.display = 'none';
        };
    
        document.getElementById('confirm-no').onclick = function() {            
    
            // Fecha a caixa de diálogo
            document.getElementById('confirmation-dialog').style.display = 'none';
        };
    }
    

document.querySelectorAll('input[type="text"]').forEach(function(input) {
    input.addEventListener('input', function() {
        if (!this.value.match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/)) {
            //alert('Por favor, insira o tempo no formato HH:MM:SS');
        } else {
            this.setCustomValidity('');
        }
    });
});

function timeToSeconds(time) {
    // Divide o tempo na string HH:MM:SS
    const parts = time.split(':');
    
    // Extrai as horas, minutos e segundos
    const hours = parseInt(parts[0], 10);    // Converte horas para inteiro
    const minutes = parseInt(parts[1], 10);  // Converte minutos para inteiro
    const seconds = parseInt(parts[2], 10);  // Converte segundos para inteiro

    // Retorna o total em segundos
    return (hours * 3600) + (minutes * 60) + seconds;
}

function secondsToHHMMSS(seconds) {
    // Calcula as horas, minutos e segundos
    const hours = Math.floor(seconds / 3600); // 1 hora = 3600 segundos
    const minutes = Math.floor((seconds % 3600) / 60); // 1 minuto = 60 segundos
    const remainingSeconds = seconds % 60;

    // Formata para sempre ter 2 dígitos
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Retorna o resultado no formato HH:MM:SS
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

        // Carrega o arquivo JSON ao carregar a página
        async function loadBlinds() {
            try {
                const response = await fetch('blind-padrao.json');
                blindsLevels = await response.json(); // Armazena o conteúdo no array
            } catch (error) {
                console.error('Erro ao carregar o arquivo JSON:', error);
            }
        }

        // Preenche a tabela de blinds no modal
        function populateBlindsList() {
            const blindsList = document.getElementById('blinds-list');
            blindsList.innerHTML = ''; // Limpa a lista antes de adicionar

            blindsLevels.forEach((blind, index) => {
                const blindRow = document.createElement('tr');
                blindRow.innerHTML = `
                    <td>
                        <input type="text" value="${blind.nivel}" onchange="updateBlind(${index}, 'nivel', this.value)">
                    </td>
                    <td><input type="text" value="${blind.sb}" onchange="updateBlind(${index}, 'sb', this.value)"></td>
                    <td><input type="text" value="${blind.bb}" onchange="updateBlind(${index}, 'bb', this.value)"></td>
                    <td><input type="text" value="${blind.ante}" onchange="updateBlind(${index}, 'ante', this.value)"></td>
                    <td>
                        <button class="botao-vermelho" type="button" onclick="removeBlindLevel(${index})">Excluir</button>
                        <button class="botao-verde" type="button" onclick="addBlindLevelAfter(${index})"><i class="fa-solid fa-plus"></i> Adicionar</button>
                    </td>
                `;
                blindsList.appendChild(blindRow);
            });
        }

        // Atualiza o valor de um blind específico
        function updateBlind(index, field, value) {
            blindsLevels[index][field] = value; // Atualiza o campo específico (sb, bb, ante)
        }

        // Abre o popup modal e preenche a lista de blinds
        function openBlindsPopup() {
            populateBlindsList(); // Preenche a lista antes de abrir
            document.getElementById('blinds-popup').style.display = 'flex'; // Mostra o modal
        }

        // Fecha o popup modal
        function closeBlindsPopup() {
            document.getElementById('blinds-popup').style.display = 'none'; // Fecha o modal
        }

        // Adiciona um novo nível de blind após um nível específico
        function addBlindLevelAfter(index) {
            const newLevel = {
                nivel: (blindsLevels.length + 1).toString(),
                sb: "0",  // Valor padrão para Small Blind
                bb: "0",  // Valor padrão para Big Blind
                ante: "0" // Valor padrão para Ante
            };
            blindsLevels.splice(index + 1, 0, newLevel); // Adiciona o novo nível no índice após o atual
            populateBlindsList(); // Atualiza a lista
        }

        // Remove um nível de blind
        function removeBlindLevel(index) {
            blindsLevels.splice(index, 1); // Remove o nível do array
            populateBlindsList(); // Atualiza a lista
        }

        // Salva as alterações no arquivo JSON
        async function saveBlinds() {
            const updatedJson = JSON.stringify(blindsLevels, null, 4); // Formata o JSON

            // Salva no localStorage
            localStorage.setItem('blindsLevels', updatedJson); // Salva o JSON formatado no localStorage

            // Aqui você deve implementar a lógica para enviar o JSON para o servidor
            // Por exemplo, usando fetch para enviar um POST para um endpoint que salva o arquivo
            console.log("Blinds salvos:", updatedJson); // Para fins de depuração
            //alert('Blinds salvos com sucesso!'); // Mensagem de confirmação

            closeBlindsPopup(); // Fecha o popup após salvar
        }

        function adicionaBuyn(){
            localStorage.setItem('buyn', localStorage.getItem('buyn'));
        }           
           

        prizeList = [
            { posicao: "1º", valor: "R$ 5.000,00" },
            { posicao: "2º", valor: "R$ 2.500,00" },
            { posicao: "3º", valor: "R$ 1.000,00" }
        ];
                
        // Função para abrir o modal de edição de prêmios
        function openPrizePopup() {
            populatePrizeList(); // Popula a lista de prêmios no modal
            document.getElementById('prize-popup').style.display = 'flex';
        }
        
        // Função para fechar o modal de edição de prêmios
        function closePrizePopup() {
            document.getElementById('prize-popup').style.display = 'none';
        }
        
        // Popula a lista de prêmios no modal
        function populatePrizeList() {
            const prizeListEdit = document.getElementById('prize-list-edit');
            prizeListEdit.innerHTML = ''; // Limpa a lista antes de popular
        
            prizeList.forEach((prize, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><input type="text" value="${prize.posicao}" onchange="updatePrize(${index}, 'posicao', this.value)"></td>
                    <td><input type="text" value="${prize.valor}" onchange="updatePrize(${index}, 'valor', this.value)"></td>
                    <td><button class="botao-vermelho" type="button" onclick="removePrize(${index})">Excluir</button></td>
                `;
                prizeListEdit.appendChild(row);
            });

            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="3"><button class="botao-verde" type="button" onclick="addPrize()">Adicionar Posição</button>`;
            prizeListEdit.appendChild(row);


            document.getElementById('premiacao-total').value = localStorage.getItem('premio');

            
        }
        
        // Atualiza o prêmio no array prizeList
        function updatePrize(index, field, value) {
            prizeList[index][field] = value; // Atualiza o campo correspondente
        }
        
        // Adiciona uma nova posição à lista de prêmios
        function addPrize() {
            prizeList.push({ posicao: "", valor: "" }); // Adiciona uma nova entrada vazia
            populatePrizeList(); // Atualiza a tabela no modal
        }
        
        // Remove uma posição da lista de prêmios
        function removePrize(index) {
            prizeList.splice(index, 1); // Remove o item do array
            populatePrizeList(); // Atualiza a tabela no modal
        }
        
        // Salva as alterações na lista de prêmios e atualiza a exibição na página
        function savePrizes() {
            const prizeListContainer = document.getElementById('prize-list');
            prizeListContainer.innerHTML = ''; // Limpa a lista antes de popular
        
            prizeList.forEach(prize => {
                const li = document.createElement('li');
                li.textContent = `${prize.posicao} ${prize.valor}`;
                prizeListContainer.appendChild(li);
            });

            prizeListx = document.querySelector('.prize-list');
            prizeItemsx = prizeListx.querySelectorAll('li');
    
            // Se a lista tiver mais de 10 itens, adiciona a classe 'scroll'
            if (prizeItemsx.length > 10) {
                prizeListx.classList.add('scroll');
                console.log(prizeItemsx.length);
            }else{
                prizeListx.classList.remove('scroll');
                console.log(prizeItemsx.length);
            }            
        
            localStorage.setItem('prizeList', JSON.stringify(prizeList)); // Salva a lista no localStorage

            // Salva no locastorage e Atualiza premiação total
            localStorage.setItem('premio', document.getElementById('premiacao-total').value);
            document.getElementById('premio').innerHTML = localStorage.getItem('premio');    
            document.getElementById('premiacao-total').value = localStorage.getItem('premio');
            

            closePrizePopup(); // Fecha o popup após salvar
        }

        // Função para carregar a lista de prêmios do localStorage (se houver)
        function loadPrizes() {
            const savedPrizes = localStorage.getItem('prizeList');
            
            // Atualiza premiação total
            document.getElementById('premio').innerHTML = localStorage.getItem('premio');    
            document.getElementById('premiacao-total').value = localStorage.getItem('premio');            
            
            if (savedPrizes) {
                prizeList = JSON.parse(savedPrizes);
                savePrizes(); // Atualiza a exibição com a lista carregada
            }
        }
        
        // Carregar prêmios ao iniciar
        window.onload = function() {
            loadPrizes(); // Carrega os prêmios do localStorage ou da lista padrão
            checkPrizeListLength(); // Verifica o comprimento da lista de prêmios e aplica/remova a classe 'scroll'
        };


       
        
