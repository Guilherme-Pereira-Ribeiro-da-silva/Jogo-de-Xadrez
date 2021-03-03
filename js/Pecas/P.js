import Peca from "./Peca.js";
import Conversoes from "../Conversoes.js";

export default class P extends Peca{
    constructor(coodenadas,cor) {
        super(coodenadas,cor);
    }

    CalcularPossiveisRotas(ConfigJogo){
        let casas_possiveis = [];
        const NumDeCasasQuePodeAndar = this.JaSeMoveu() ? 1 : 2;
        const delta = this.Cor === "Branco" ? 1 : -1;
        const casas_de_ataque = [
            {
                x : (this.Coordenadas.x + 1),
                y : (this.Coordenadas.y + delta)
            },
            {
                x : (this.Coordenadas.x - 1),
                y : (this.Coordenadas.y + delta)
            }
        ];

        for(let casa of casas_de_ataque){
            if (Conversoes.CoordenadaForaDoTabuleiro(casa)) continue;
            const CasaEstaVazia = ConfigJogo[Conversoes.CoordenadaParaNumero(casa)] === "";
            if(CasaEstaVazia) continue;
            let CasaEhInimiga = this.GetSeCasaEhInimiga(Conversoes.CoordenadaParaNumero(casa),ConfigJogo);
            CasaEhInimiga ? casas_possiveis.push(Conversoes.CoordenadaParaNumero(casa)) : null;
        }

        for(let i = 1;i <= NumDeCasasQuePodeAndar;i++){
            const PossivelCasa = {
              x: this.Coordenadas.x,
              y: this.Coordenadas.y + (i * delta)
            };

            const CasaEstaVazia = ConfigJogo[Conversoes.CoordenadaParaNumero(PossivelCasa)] === "";
            if(CasaEstaVazia){
                casas_possiveis.push(Conversoes.CoordenadaParaNumero(PossivelCasa));
            }else{
                break;
            }
        }

        return casas_possiveis;
    }



    JaSeMoveu(){
        let coluna_inicial;
        if(this.Cor === "Branco"){
            coluna_inicial = 1;
        }else{
            coluna_inicial = 6;
        }

        const JaSeMoveu = this.Coordenadas.y !== coluna_inicial;

        return JaSeMoveu;
    }

    EhPromocao(){
        const PosicaoEmNumero = Conversoes.CoordenadaParaNumero(this.Coordenadas);
        const EhPromocaoBranca = PosicaoEmNumero >= 0 && PosicaoEmNumero <= 7;
        const EhPromocaoPreta = PosicaoEmNumero >= 56 && PosicaoEmNumero <= 63;
        return EhPromocaoBranca || EhPromocaoPreta;


    }
}