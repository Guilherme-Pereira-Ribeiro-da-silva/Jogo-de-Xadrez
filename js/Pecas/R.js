import Peca from "./Peca.js";

export default class R extends Peca{
    constructor(coodenadas,cor) {
        super(coodenadas,cor);
        this.Deltas = [
            {
                x: 1,
                y: 0
            },
            {
                x: -1,
                y: 0
            },
            {
                x: 0,
                y: 1
            },
            {
                x: 0,
                y: -1
            },

        ];
    }

    CalcularPossiveisRotas(ConfigJogo){
        let casas_possiveis = this.GetCasasDeMovimentacaoPossiveis(this.Deltas,ConfigJogo);
        return casas_possiveis;
    }
}