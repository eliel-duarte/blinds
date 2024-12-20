// Adicione os caminhos dos arquivos de som
const sound1m = new Audio('falta_1m.mp3');
const sound5s = new Audio('falta_5s.mp3');
const soundMudarBlind = new Audio('mudar_blind.mp3');

// Referências aos elementos DOM
const timerDisplay = document.querySelector('.timer');
const levelDisplay = document.querySelector('.level');
const blindsDisplay = document.querySelector('.blinds');
const anteDisplay = document.querySelector('.ante');
const nextBlindsDisplay = document.querySelector('.next-blinds');
const nextAnteDisplay = document.querySelector('.next-ante');
const pauseButtonIcon = document.querySelector('#pausar i'); // Referência ao ícone do botão de pausar
const nivel = document.querySelector('#nivel');

let currentLevel = 0;
let timerInterval;
let timeLeft = 900;
let blindPre = 900;
let blindPos = 900;
let isPaused = true; // Inicia em estado pausado

        // Previne o menu de contexto padrão e exibe uma mensagem
        window.addEventListener('contextmenu', function (e) {
            e.preventDefault(); // Evita que o menu de contexto apareça
            alert(' bad beat! isso não é permitido :('); // Exibe a mensagem personalizada
        });

// desativar função enter no formulário
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();
});


        // Verifica o número de elementos da lista de prêmios
        let prizeList = document.querySelector('.prize-list');
        let prizeItems = prizeList.querySelectorAll('li');

        // Inicializa a variável para os níveis de blinds
        let blindsLevels = [];
        // Função para carregar os dados do arquivo JSON
        async function loadBlindsLevels() {
            try {
                // Defina os níveis de blinds diretamente como um array de objetos
                blindsLevels = [
                    { "nivel": "1", "sb": 100, "bb": 200, "ante": 200 },
                    { "nivel": "2", "sb": 200, "bb": 400, "ante": 400 },
                    { "nivel": "3", "sb": 300, "bb": 600, "ante": 600 },
                    { "nivel": "4", "sb": 400, "bb": 800, "ante": 800 },
                    { "nivel": "5", "sb": 500, "bb": 1000, "ante": 1000 },
                    { "nivel": "6", "sb": 600, "bb": 1200, "ante": 1200 },
                    { "nivel": "7", "sb": 800, "bb": 1600, "ante": 1600 },
                    { "nivel": "7", "sb": "Add-on ", "bb": " Intervalo", "ante": 0 },
                    { "nivel": "8", "sb": 1000, "bb": 2000, "ante": 2000 },
                    { "nivel": "9", "sb": 1200, "bb": 2400, "ante": 2400 },
                    { "nivel": "10", "sb": 1500, "bb": 3000, "ante": 3000 },
                    { "nivel": "11", "sb": 2000, "bb": 4000, "ante": 4000 },
                    { "nivel": "12", "sb": 2500, "bb": 5000, "ante": 5000 },
                    { "nivel": "13", "sb": 3000, "bb": 6000, "ante": 6000 },
                    { "nivel": "14", "sb": 4000, "bb": 8000, "ante": 8000 },
                    { "nivel": "15", "sb": 5000, "bb": 10000, "ante": 10000 },
                    { "nivel": "16", "sb": 6000, "bb": 12000, "ante": 12000 },
                    { "nivel": "17", "sb": 8000, "bb": 16000, "ante": 16000 },
                    { "nivel": "18", "sb": 10000, "bb": 20000, "ante": 20000 },
                    { "nivel": "19", "sb": 12000, "bb": 24000, "ante": 24000 },
                    { "nivel": "20", "sb": 15000, "bb": 30000, "ante": 30000 },
                    { "nivel": "21", "sb": 20000, "bb": 40000, "ante": 40000 },
                    { "nivel": "22", "sb": 25000, "bb": 50000, "ante": 50000 },
                    { "nivel": "23", "sb": 30000, "bb": 60000, "ante": 60000 },
                    { "nivel": "24", "sb": 40000, "bb": 80000, "ante": 80000 },
                    { "nivel": "25", "sb": 50000, "bb": 100000, "ante": 100000 },
                    { "nivel": "26", "sb": 60000, "bb": 120000, "ante": 120000 }
                    // Continue a adicionar mais níveis conforme necessário...
                ];
        
                // Carrega níveis de blinds do localStorage, se existir
                if (localStorage.getItem('blindsLevels')) {
                    blindsLevels = JSON.parse(localStorage.getItem('blindsLevels'));
                }
        
                // Atualiza a exibição inicial
                updateTimerDisplay(); // Exibe o tempo inicial
                updateDisplays(); // Exibe o nível, blinds e ante iniciais
        
            } catch (error) {
                console.error('Erro ao carregar os níveis de blinds:', error);
            }
        }
        
               

        
        // carrega os blinds padrão
        loadBlindsLevels();

        AtualizaBuyns();//
        



// Verifica se existem dados no localStorage
if (localStorage.getItem('blindsLevels')) {
    blindsLevels = JSON.parse(localStorage.getItem('blindsLevels'));
}
if (localStorage.getItem('currentLevel')) {
    currentLevel = parseInt(localStorage.getItem('currentLevel'));
}
if (localStorage.getItem('timeLeft')) {
    timeLeft = parseInt(localStorage.getItem('timeLeft'));
}else{
    localStorage.setItem('timeLeft', timeLeft)
}
if (localStorage.getItem('isPaused')) {
    isPaused = localStorage.getItem('isPaused') === 'true';
}
if (localStorage.getItem('blindPre')) {
    blindPre = parseInt(localStorage.getItem('blindPre'));
}else{
    localStorage.setItem('blindPre', blindPre)
}
if (localStorage.getItem('blindPos')) {
    blindPos = parseInt(localStorage.getItem('blindPos'));
}else{
    localStorage.setItem('blindPos', blindPos)
}
if (!localStorage.getItem('tournamentName')) {    
    localStorage.setItem('tournamentName', "Torneio");
}
if (!localStorage.getItem('tardio')) {    
    localStorage.setItem('tardio', 8);
}
if (!localStorage.getItem('fichast')) {    
    localStorage.setItem('fichast', 1000);
}
if (!localStorage.getItem('fichasb')) {    
    localStorage.setItem('fichasb', 10000);
}
if (!localStorage.getItem('fichasr')) {    
    localStorage.setItem('fichasr', 10000);
}
if (!localStorage.getItem('fichasd')) {    
    localStorage.setItem('fichasd', 20000);
}
if (!localStorage.getItem('fichasa')) {    
    localStorage.setItem('fichasa', 30000);
}
if (!localStorage.getItem('fichas')) {    
    localStorage.setItem('fichas', 0);
}








// Inicia o timer
function startTimer() {
    if (timerInterval) return; // Impede a criação de múltiplas instâncias do timer
    timerInterval = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            updateTimerDisplay();

            // Quando o tempo acabar, avança para o próximo nível
            if (timeLeft <= 0) {
                //console.log(currentLevel+' '+(blindsLevels.length - 1));
                // se for o ultimo nivel
                if (currentLevel == blindsLevels.length - 1){
                    togglePause();
                    timerDisplay.textContent = "FIM";
                }else{
                    nextLevel();
                }
            }
        }

        // Armazena o estado atual no localStorage
        localStorage.setItem('timeLeft', timeLeft);
    }, 1000);
}

// Atualiza a barra de progresso conforme o tempo passa
function AtualizaBarra() {
    let sliderValue = (timeLeft / localStorage.getItem('blindPre') * 600);
    document.getElementById('time-slider').value = sliderValue;
    //console.log(parseInt(sliderValue));
}

// Evento para quando o usuário arrasta o slider
document.getElementById('time-slider').addEventListener('input', (event) => {
    const newTimePercentage = event.target.value / 600;
    timeLeft = parseInt(localStorage.getItem('blindPre') * newTimePercentage); // Ajusta o tempo baseado na posição da barra
    updateTimerDisplay();
});

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

    atualizaPause();

    AtualizaCores();  

    // Armazena o estado de pausa no localStorage
    localStorage.setItem('isPaused', isPaused);
}

function atualizaPause(){
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
}

// Reinicia apenas o cronômetro
function resetTimer() {    
    // Converte os valores para inteiros para garantir que a comparação seja correta
    const currentNivel = parseInt(blindsLevels[currentLevel].nivel, 10); 
    const tardio = parseInt(localStorage.getItem('tardio'), 10);

    // Verifica se o nível atual é maior ou igual ao nível de registro tardio
    if (currentNivel > tardio) {        
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
    // Atualiza Registro tardio e fichas
    document.querySelector('.info-tardio').textContent = localStorage.getItem('tardio');
    

    // Atualiza Cores
    AtualizaCores();
    atualizaPause();
    AtualizaBarra();
    AtualizaBuyns();
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

function isString(value) {
    return typeof value === 'string';
}

function AtualizaCores(){
    var bigblind = blindsLevels[currentLevel].bb;

    if (bigblind % 1 != 0) {
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
}

// Carregar fomulario
function carregarFormulario(){

    document.getElementById('tournament-name').value = localStorage.getItem('tournamentName');
    document.getElementById('blind-time-pre').value = secondsToHHMMSS(localStorage.getItem('blindPre'));
    document.getElementById('blind-time-pos').value = secondsToHHMMSS(localStorage.getItem('blindPos'));
    document.getElementById('tardio').value = localStorage.getItem('tardio');   
    
    document.getElementById('fichast').value = parseFloat(localStorage.getItem('fichast'));
    document.getElementById('fichasb').value = parseFloat(localStorage.getItem('fichasb'));
    document.getElementById('fichasr').value = parseFloat(localStorage.getItem('fichasr'));
    document.getElementById('fichasd').value = parseFloat(localStorage.getItem('fichasd'));
    document.getElementById('fichasa').value = parseFloat(localStorage.getItem('fichasa'));
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
    localStorage.setItem('fichast', document.getElementById('fichast').value);
    localStorage.setItem('fichasb', document.getElementById('fichasb').value);
    localStorage.setItem('fichasr', document.getElementById('fichasr').value);
    localStorage.setItem('fichasd', document.getElementById('fichasd').value);
    localStorage.setItem('fichasa', document.getElementById('fichasa').value);

    // salvar alterações nos blinds
    saveBlinds();

    //console.log(tardio);
    toggleMenu();

    updateTimerDisplay();
}

    function resetAndSave() {

        // Mostra a caixa de diálogo de confirmação
        document.getElementById('confirmation-dialog').style.display = 'flex';
    
        // Aguarda a resposta do usuário
        document.getElementById('confirm-yes').onclick = function() {

            // Zera todas as variaveis de controle do torneio
            localStorage.setItem('bonus', 0);
            localStorage.setItem('buyn', 0);
            localStorage.setItem('rebuy', 0);
            localStorage.setItem('duplo', 0);
            localStorage.setItem('addon', 0);
            localStorage.setItem('prizeList', "");
            localStorage.setItem('premio', 0); 
            localStorage.setItem('fichas', 0);
            
            // Salvar as configurações
            saveSettings();

            // Reseta o nível para -1 e avança para o primeiro nível
            currentLevel = -1;
            nextLevel();  
            
            AtualizaBuyns();

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

// Carrega os níveis de blinds ao carregar a página, sem usar um arquivo JSON
async function loadBlinds() {
    try {
        // Defina os níveis de blinds diretamente como um array de objetos
        blindsLevels = [
            { "nivel": "1", "sb": 100, "bb": 200, "ante": 200 },
            { "nivel": "2", "sb": 200, "bb": 400, "ante": 400 },
            { "nivel": "3", "sb": 300, "bb": 600, "ante": 600 },
            { "nivel": "4", "sb": 400, "bb": 800, "ante": 800 },
            { "nivel": "5", "sb": 500, "bb": 1000, "ante": 1000 },
            { "nivel": "6", "sb": 600, "bb": 1200, "ante": 1200 },
            { "nivel": "7", "sb": 800, "bb": 1600, "ante": 1600 },
            { "nivel": "7", "sb": "Add-on ", "bb": " Intervalo", "ante": 0 },
            { "nivel": "8", "sb": 1000, "bb": 2000, "ante": 2000 },
            { "nivel": "9", "sb": 1200, "bb": 2400, "ante": 2400 },
            { "nivel": "10", "sb": 1500, "bb": 3000, "ante": 3000 },
            { "nivel": "11", "sb": 2000, "bb": 4000, "ante": 4000 },
            { "nivel": "12", "sb": 2500, "bb": 5000, "ante": 5000 },
            { "nivel": "13", "sb": 3000, "bb": 6000, "ante": 6000 },
            { "nivel": "14", "sb": 4000, "bb": 8000, "ante": 8000 },
            { "nivel": "15", "sb": 5000, "bb": 10000, "ante": 10000 },
            { "nivel": "16", "sb": 6000, "bb": 12000, "ante": 12000 },
            { "nivel": "17", "sb": 8000, "bb": 16000, "ante": 16000 },
            { "nivel": "18", "sb": 10000, "bb": 20000, "ante": 20000 },
            { "nivel": "19", "sb": 12000, "bb": 24000, "ante": 24000 },
            { "nivel": "20", "sb": 15000, "bb": 30000, "ante": 30000 },
            { "nivel": "21", "sb": 20000, "bb": 40000, "ante": 40000 },
            { "nivel": "22", "sb": 25000, "bb": 50000, "ante": 50000 },
            { "nivel": "23", "sb": 30000, "bb": 60000, "ante": 60000 },
            { "nivel": "24", "sb": 40000, "bb": 80000, "ante": 80000 },
            { "nivel": "25", "sb": 50000, "bb": 100000, "ante": 100000 },
            { "nivel": "26", "sb": 60000, "bb": 120000, "ante": 120000 }
            // Continue a adicionar mais níveis conforme necessário...
        ];

        console.log('Níveis de blinds carregados com sucesso');
        
        // Você pode adicionar mais ações após carregar os blinds, como atualizar a interface
        updateTimerDisplay(); // Atualiza a exibição do tempo
        updateDisplays();     // Atualiza os valores de blinds e níveis
    } catch (error) {
        console.error('Erro ao carregar os níveis de blinds:', error);
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
            //console.log("Blinds salvos:", updatedJson); // Para fins de depuração
            //alert('Blinds salvos com sucesso!'); // Mensagem de confirmação

            closeBlindsPopup(); // Fecha o popup após salvar
        }

        function Bonus(x){
            // se ja existe buyn no localstorage
            if (localStorage.getItem('bonus')) {
                var bonus = localStorage.getItem('bonus');
            }else{
                var bonus = 0;
            }
            
            if ( (x === 1) || (bonus > 0)){  
                // atribui
                bonus = parseInt(bonus) + x;          

                // atualiza o fichast no localstorage
                localStorage.setItem('fichast', document.getElementById('fichast').value);
                
                // salva no localstorage
                localStorage.setItem('bonus', bonus);

                AtualizaBuyns();
            }
        }          

        function Buyn(x){
            // se ja existe buyn no localstorage
            if (localStorage.getItem('buyn')) {
                var buyn = localStorage.getItem('buyn');
            }else{
                var buyn = 0;
            }
            
            if ( (x === 1) || (buyn > 0)){  
                // atribui
                buyn = parseInt(buyn) + x;          

                localStorage.setItem('fichasb', document.getElementById('fichasb').value);
                
                // salva no localstorage
                localStorage.setItem('buyn', buyn);

                AtualizaBuyns();
            }
        }          

        function Rebuy(x){
            // se ja existe buyn no localstorage
            if (localStorage.getItem('rebuy')) {
                var rebuy = localStorage.getItem('rebuy');
            }else{
                var rebuy = 0;
            }   
            
            if ( (x === 1) || (rebuy > 0)){              
                
                // atribui
                rebuy = parseInt(rebuy) + x; 

                localStorage.setItem('fichasr', document.getElementById('fichasr').value);                       
                
                // salva no localstorage
                localStorage.setItem('rebuy', rebuy);

                AtualizaBuyns();
            }
        } 

        function Duplo(x){
            // se ja existe buyn no localstorage
            if (localStorage.getItem('duplo')) {
                var duplo = localStorage.getItem('duplo');
            }else{
                var duplo = 0;
            }     
            
            // verificar se adicionar ou addon maior que zero
            if ( (x === 1) || (duplo > 0)){            
                // atribui
                duplo = parseInt(duplo) + x; 
                
                localStorage.setItem('fichasd', document.getElementById('fichasd').value);            
                
                // salva no localstorage
                localStorage.setItem('duplo', duplo);

                AtualizaBuyns();
            }
        }      
        
        function Addon(x){
            // se ja existe buyn no localstorage
            if (localStorage.getItem('addon')) {
                var addon = localStorage.getItem('addon');
            }else{
                var addon = 0;
            }     
            
            // verificar se adicionar ou addon maior que zero
            if ( (x === 1) || (addon > 0)){

                // atribui
                addon = parseInt(addon) + x; 
                
                localStorage.setItem('fichasa', document.getElementById('fichasa').value);          
                
                // salva no localstorage
                localStorage.setItem('addon', addon);

                AtualizaBuyns();
            }
        } 
        document.querySelectorAll('.inteiro').forEach(function(element) {
            element.addEventListener('input', function (e) {
                // Remove qualquer ponto ou vírgula que o usuário tente inserir
                this.value = this.value.replace(/[.,]/g, '');
            });
        });        
        
        function AtualizaBuyns(){
            document.getElementById('bonus').innerHTML = localStorage.getItem('bonus');
            document.getElementById('entradas').innerHTML = localStorage.getItem('buyn');
            document.getElementById('rebuys').innerHTML = localStorage.getItem('rebuy');
            document.getElementById('duplos').innerHTML = localStorage.getItem('duplo');
            document.getElementById('addons').innerHTML = localStorage.getItem('addon');

            // calculo de fichas
            bonus = localStorage.getItem('fichast') * localStorage.getItem('bonus');
            buyn = localStorage.getItem('fichasb') * localStorage.getItem('buyn');
            rebuy = localStorage.getItem('fichasr') * localStorage.getItem('rebuy');
            duplo = localStorage.getItem('fichasd') * localStorage.getItem('duplo');
            addon = localStorage.getItem('fichasa') * localStorage.getItem('addon');

            localStorage.setItem('fichas', bonus + buyn + rebuy + duplo + addon);

            var fichas = parseFloat(localStorage.getItem('fichas'));
            document.getElementById('fichas').innerHTML = fichas.toLocaleString('pt-BR');
        }
           

        prizeList = [
            { posicao: "1º", valor: "R$ 00,00" }
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
                //console.log(prizeItemsx.length);
            }else{
                prizeListx.classList.remove('scroll');
                //console.log(prizeItemsx.length);
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
            loadBlindsLevels(); // carregar lista de blinds   
            carregarFormulario();  
                 
        };


       
        
