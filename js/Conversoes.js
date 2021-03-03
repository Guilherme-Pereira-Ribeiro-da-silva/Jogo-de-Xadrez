//classe responsavel por fazer as conversões de medidas
export default class Conversoes {
    constructor() {
        this.Movimentos = [];
        this.DivMovimentos = document.querySelector("#movimentos");
    }

    static NumeroParaCoordenada(posicao_em_numero){
        const y = Math.abs(Math.floor(posicao_em_numero/8) -7);
        const x = (posicao_em_numero % 8);
        const posicao_em_coordenada = {
            x: x,
            y: y
        }

        return posicao_em_coordenada;
    }

    static CoordenadaParaNumero(coordenada){
        let numero = Math.abs((Math.floor(coordenada.y * 8) + 7) - 64);
        if(numero > 8) {
            numero = Math.abs(((Math.floor(coordenada.y * 8) + 7) - 64) + Math.abs(coordenada.x - 8)) + 7;
        }else {
            numero += (coordenada.x % 8) -1;
        }
        return numero;
    }

    static CoordenadaForaDoTabuleiro(casa){
        const CasaForaDoTabuleiro = (casa.x < 0 || casa.x > 7) || (casa.y < 0 || casa.y > 7);
        return CasaForaDoTabuleiro;
    }
}