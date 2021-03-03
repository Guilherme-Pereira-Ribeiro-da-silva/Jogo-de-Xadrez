import Peca from "./Peca.js";

export default class N extends Peca{
    constructor(coodenadas,cor) {
        super(coodenadas,cor);
        this.Deltas = [
            {
                x : (+2),
                y : (+1)
            },
            {
                x : (+2),
                y : (-1)
            },
            {
                x : (+1),
                y : (+2)
            },
            {
                x : (-1),
                y : (+2)
            },
            {
                x : (-2),
                y : (+1)
            },
            {
                x : (-2),
                y : (-1)
            },
            {
                x : (-1),
                y : (-2)
            },
            {
                x : (+1),
                y : (-2)
            },

        ];
    }

    CalcularPossiveisRotas(ConfigJogo){
        let casas_possiveis = [];

        casas_possiveis = this.GetCasasDeAtaqueValidas(this.Deltas,ConfigJogo);

        return casas_possiveis;
    }
}