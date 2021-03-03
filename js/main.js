import Jogo from "./Jogo.js";

window.addEventListener('load',() => {
   document.querySelector('#novo-jogo-multiplayer').addEventListener('click',() => {
      IniciarJogo();
   })
});

function IniciarJogo() {
    new Jogo();
}

IniciarJogo();