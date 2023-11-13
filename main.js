//  #aprendiNaAlura

function alterarContexto(contexto){
    let tituloTexto = null;

    mostraTimer();
    botoes.forEach(function (contexto) {
        contexto.classList.remove('active');
    });
    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `assets/imagens/${contexto}.png`);
    
    switch (contexto) {
        case "foco":
            tituloTexto = `
            Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>
            `
            focoBt.classList.add('active');

            break;
        
        case "descanso-curto":
            tituloTexto = `
            Que tal dar uma respirada?<br>
            <strong class="app__title-strong">Faça uma pausa curta!</strong>
            `
            curtoBt.classList.add('active');

            break;
        
        case "descanso-longo":
            tituloTexto = `
            Hora de voltar à superfície.<br>
            <strong class="app__title-strong">Faça uma pausa longa.</strong>
            `
            longoBt.classList.add('active');
            
            break;

        default:
            break;
    }
    titulo.innerHTML = `${tituloTexto}`;
}

function iniciarOuPausar() {
    if (intervaloId) {
        zerar();
        somPause.play();
        return;

    }

    somPlay.play();
    intervaloId = setInterval(contagemRegressiva, 1000);
    iniciarOuPausarBt.textContent = "Pausar";
    imagemPlayBt.setAttribute('src', 'assets/imagens/pause.png');
}

function zerar() {
    clearInterval(intervaloId);
    iniciarOuPausarBt.textContent = "Começar";
    imagemPlayBt.setAttribute('src', 'assets/imagens/play_arrow.png');
    intervaloId = null;
}

function mostraTimer() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'});
    TemporizadorNaTela.innerHTML = `${tempoFormatado}`;
}

//  documento
const html = document.querySelector('html');

//  botoes
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const iniciarOuPausarBt = document.querySelector('#start-pause span');
const imagemPlayBt = document.querySelector('.app__card-primary-button-icon');
const botoes = document.querySelectorAll('.app__card-button');

//  visual
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');

//  sons
const musicaFocoInput = document.querySelector('#alternar-musica');
const musica = new Audio('assets/sons/luna-rise-part-one.mp3');
const startPauseBt = document.querySelector('#start-pause');
const somPlay = new Audio('assets/sons/play.wav');
const somPause = new Audio('assets/sons/pause.mp3');
const somTimerExpirado = new Audio('assets/sons/beep.mp3');

//  timer
const TemporizadorNaTela = document.querySelector('#timer');
let tempoDecorridoEmSegundos = (25 * 60);
let intervaloId = null;

//  loop da musica de fundo
musica.loop = true;

// arrow function
musicaFocoInput.addEventListener('change', () => {
    if (musica.paused){
        musica.play();
    } else {
        musica.pause();
    }
})

focoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = (25 * 60);
    alterarContexto("foco");
});

curtoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = (5 * 60);
    alterarContexto("descanso-curto");
});

longoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = (15 * 60);
    alterarContexto("descanso-longo");
});

const contagemRegressiva = ()  => {
    if (tempoDecorridoEmSegundos <=0){
        somTimerExpirado.play();
        alert('Tempo Finalizado');
        somTimerExpirado.pause();
        zerar();
        return;
    }

    tempoDecorridoEmSegundos -= 1;
    mostraTimer();
}

startPauseBt.addEventListener('click', iniciarOuPausar);
mostraTimer();
