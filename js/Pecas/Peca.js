//classe e filhas serão responsáveis por fazer as contas se é possivel se mover ao local desejado

import Conversoes from "../Conversoes.js";

export default class Peca {
    constructor(coordenadas,cor) {
        this.Coordenadas = coordenadas;
        this.Cor = cor;
    }

    GetCasasDeAtaqueValidas(casas_de_ataque,config_jogo){
        let casas_possiveis = [];
        for(let casa of casas_de_ataque){
            casa.x += this.Coordenadas.x;
            casa.y += this.Coordenadas.y;
            if (Conversoes.CoordenadaForaDoTabuleiro(casa)) continue;

            const CasaEstaVazia = config_jogo[Conversoes.CoordenadaParaNumero(casa)] === "";
            if(CasaEstaVazia){casas_possiveis.push(Conversoes.CoordenadaParaNumero(casa));continue;}

            const CasaEhInimiga = this.GetSeCasaEhInimiga(Conversoes.CoordenadaParaNumero(casa),config_jogo);
            if(CasaEhInimiga) casas_possiveis.push(Conversoes.CoordenadaParaNumero(casa));
        }

        return casas_possiveis;
    }

    GetCasasDeMovimentacaoPossiveis(deltas,config_jogo){
        let casas_possiveis = [];
        for (let Delta of deltas){
            let coordenada = {...this.Coordenadas};
            coordenada.x += Delta.x;
            coordenada.y += Delta.y;
            while(!Conversoes.CoordenadaForaDoTabuleiro(coordenada)){
                const coordenada_em_num = Conversoes.CoordenadaParaNumero(coordenada);

                const CasaEhVazia = config_jogo[coordenada_em_num] === "";
                if(CasaEhVazia){
                    casas_possiveis.push(coordenada_em_num);
                    coordenada.x += Delta.x;
                    coordenada.y += Delta.y;
                    continue;}

                const EhCasaInimiga = this.GetSeCasaEhInimiga(coordenada_em_num,config_jogo);
                if(EhCasaInimiga){casas_possiveis.push(coordenada_em_num);break;}
                break;
            }
        }
        return casas_possiveis;
    }

    GetSeCasaEhInimiga(casa,ConfigJogo){
        const EuSouBranca = this.Cor === "Branco";
        const LetraPeca = ConfigJogo[casa];
        const PecaEhBranca = LetraPeca === LetraPeca.toUpperCase();

        const CasaEhInimiga = PecaEhBranca && !EuSouBranca || EuSouBranca && !PecaEhBranca;

        return CasaEhInimiga;
    }
}