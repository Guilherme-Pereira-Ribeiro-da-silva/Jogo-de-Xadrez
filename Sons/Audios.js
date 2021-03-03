//Classe de utilidade responsável pelos sons
export default class Audios {
    static GetAudioInstance(){
        return new Audio();
    }

    static TocarAudioMovPeca(){
        let som = this.GetAudioInstance();
        som.src = "Sons/Movimento.mp3";
        som.play();
    }
}