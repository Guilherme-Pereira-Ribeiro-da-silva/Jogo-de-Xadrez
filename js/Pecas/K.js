import Peca from "./Peca.js";
import P from "./P.js";
import N from "./N.js";
import B from "./B.js";
import R from "./R.js";
import Q from "./Q.js";
import Conversoes from "../Conversoes.js";

export default class K extends Peca{
    constructor(coodenadas,cor) {
        super(coodenadas,cor);
        this.Deltas =  [
            {
                x: 1,
                y: 1
            },
            {
                x: -1,
                y: -1
            },
            {
                x: -1,
                y: 1
            },
            {
                x: 1,
                y: -1
            },
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
        ]

    }

    CalcularPossiveisRotas(ConfigJogo){
        let casas_possiveis = this.GetCasasDeAtaqueValidas(this.Deltas,ConfigJogo);
        return casas_possiveis;
    }

    //--------------MétodosDeUtilidades--------------------//

    //Este métodos utilizam informações que não necessáriamente são verdade no
    //momento, uma vez que servem no cálculo da possibilidade de jogadas futuras.
    //Além disso utilizam informações as quais o objeto nativamente não possuí.
    //De tal forma, não faz sentido utilizar as informações concretas do objeto, então deixo os
    //métodos estáticos.
    static EstaEmCheque(ConfigJogo,CorRei){
        const LetraRei = CorRei === "Branco" ? "K" : "k";
        const CorInimiga = CorRei === "Branco" ? "Preto" : "Branco";
        const PosicaoRei = ConfigJogo.indexOf(LetraRei);

        const CasasNoTabuleiro = 64;
        for (let Casa = 0; Casa < CasasNoTabuleiro;Casa++){
            let CasaEhVazia = ConfigJogo[Casa] === "";
            if(CasaEhVazia) continue;

            //-----------EhPecaAmiga-------------//
            const PecaNaCasa = ConfigJogo[Casa];
            const CorPeca = PecaNaCasa === PecaNaCasa.toUpperCase() ? "Branco" : "Preto";
            const EhPecaAmiga = CorRei === CorPeca;
            if(EhPecaAmiga) continue;
            //-----------------------------------//

            //-----------PecaConsegueSeMoverAtéOhRei-------------//
            let PecaNaCasaParaClasse = PecaNaCasa.toUpperCase();

            const possiveis_casas = K.CalcularPossiveisRotas(PecaNaCasaParaClasse,CorInimiga,Casa,ConfigJogo);
            const EhCheque = possiveis_casas.includes(PosicaoRei);

            //-------------------------------------------------//
            if (EhCheque) return true;
        }

        return false;
    }

    static CalcularPossiveisRotas(PecaNaCasaParaClasse,cor,Casa,ConfigJogo){
        const dict_classes_das_pecas = new Map([['P',P],['N',N],['B',B],['R',R],['Q',Q],['K',K]]);
        const CasaEmCoordenada = Conversoes.NumeroParaCoordenada(Casa);
        const classe_da_peca = new (dict_classes_das_pecas.get(PecaNaCasaParaClasse))(CasaEmCoordenada,cor);
        const possiveis_casas = classe_da_peca.CalcularPossiveisRotas(ConfigJogo);

        return possiveis_casas;
    }

    static EhChequeMate(ConfigJogo,CorRei){
        const EhChequeNaPosAtual = K.EstaEmCheque(ConfigJogo,CorRei);
        if(!EhChequeNaPosAtual) return false;

        const CasasNoTabuleiro = 64;
        for (let Casa = 0; Casa < CasasNoTabuleiro;Casa++){
            let CasaEhVazia = ConfigJogo[Casa] === "";
            if(CasaEhVazia) continue;

            //-----------EhPecaAmiga-------------//
            const PecaNaCasa = ConfigJogo[Casa];
            const CorPeca = PecaNaCasa === PecaNaCasa.toUpperCase() ? "Branco" : "Preto";
            const EhPecaAmiga = CorRei === CorPeca;
            if(!EhPecaAmiga) continue;
            //-----------------------------------//

            //-----------PecaConsegueSeMoverAtéOhRei-------------//
            let PecaNaCasaParaClasse = PecaNaCasa.toUpperCase();

            const possiveis_casas = K.CalcularPossiveisRotas(PecaNaCasaParaClasse,CorRei,Casa,ConfigJogo);

            for(let possivel_casa of possiveis_casas){
                const PossivelConfigJogo = [...ConfigJogo];
                PossivelConfigJogo[Casa] = "";
                PossivelConfigJogo[possivel_casa] = PecaNaCasa;

                if(!K.EstaEmCheque(PossivelConfigJogo,CorRei)) return false;
            }

            //-------------------------------------------------//
        }
        return true;
    }

    static EhAfogamento(ConfigJogo,CorRei){
        //Tirando as partes que não são peças
        ConfigJogo = ConfigJogo.splice(0,64);

        if(this.EhChequeMate(ConfigJogo,CorRei)) return false;

        const LetraRei = CorRei === "Branco" ? "K" : "k";
        const LetraPeaoDoRei = CorRei === "Branco" ? 'P' : 'p';

        //Se o rei tiver mais alguma peça além do peão não é afogamento
        let PecasDoRei = CorRei === "Branco" ?
            ConfigJogo.map((valor) => valor === valor.toUpperCase() ? valor.toUpperCase() : '').filter(String) :
            ConfigJogo.map((valor) => valor === valor.toLowerCase() ? valor.toUpperCase() : '').filter(String);

        const ReiTemAlgumaOutraPeca = PecasDoRei.includes('Q') || PecasDoRei.includes('R') ||PecasDoRei.includes('B') ||
            PecasDoRei.includes('N');
        if(ReiTemAlgumaOutraPeca) return false;

        //Se o peão poder se mover não é afogamento
        const PosPeoesOhReiAindaTem = ConfigJogo.map((valor, i) => valor === LetraPeaoDoRei ? i : '').filter(String);
        for(let Peao of PosPeoesOhReiAindaTem){
            const PeaoTemAlgumMovValido = K.CalcularPossiveisRotas(LetraPeaoDoRei.toUpperCase(),CorRei,Peao,ConfigJogo).length > 0;
            if(PeaoTemAlgumMovValido) return false;
        }

        //se o rei poder se mover não é afogamento
        const CasaRei = ConfigJogo.indexOf(LetraRei);
        const PosPossiveisRei = this.CalcularPossiveisRotas(LetraRei.toUpperCase(),CorRei,CasaRei,ConfigJogo);
        for(let PosPossivelRei of PosPossiveisRei){
            let PossivelConfigJogo = [...ConfigJogo];
            PossivelConfigJogo[CasaRei] = "";
            PossivelConfigJogo[PosPossivelRei] = LetraRei;

            if(!this.EstaEmCheque(PossivelConfigJogo,CorRei)) return false;
        }

        return true;
    }

    static EhPossivelRocar(ConfigJogo, CodigoRoque){
        const LetraRei = CodigoRoque === CodigoRoque.toUpperCase() ? "K" : "k";
        const cor = LetraRei === "K" ? "Branco" : "Preto";
        const PosRei = CodigoRoque === CodigoRoque.toUpperCase() ?
            ConfigJogo.indexOf(LetraRei)  : ConfigJogo.indexOf(LetraRei);
        const EhRoqueDoRei = CodigoRoque.toUpperCase() === "K";
        const delta = EhRoqueDoRei ? 1 : -1;

        let NumCasasQueFazemParteDoRoque
        if(EhRoqueDoRei){
            NumCasasQueFazemParteDoRoque = 3;
        }else{
            NumCasasQueFazemParteDoRoque = 4;
        }

        if(K.EstaEmCheque(ConfigJogo, cor)) return false;
        for (let i = (PosRei + delta); i !== (PosRei + NumCasasQueFazemParteDoRoque * delta);i += delta) {
            const casa = i;
            const CasaEhVazia = ConfigJogo[casa] === "";
            let PossivelConfigJogo = ConfigJogo;
            PossivelConfigJogo[PosRei] = "";
            PossivelConfigJogo[casa] = LetraRei;
            if (!CasaEhVazia || K.EstaEmCheque(PossivelConfigJogo, cor)) return false;
        }

        return true;
    }

    static AtualizarPossibilidadesRoque(LetraPeca,inicio,RoquesPossiveis){
        let RoquesPossiveisAposEste;
        if(LetraPeca.toUpperCase() === "K"){
            const RoqueDaDama = LetraPeca === "K" ? "Q" : "q";
            RoquesPossiveisAposEste = RoquesPossiveis.replace(LetraPeca,"").replace(RoqueDaDama,"");
        }else{
            const PosInicialTorreReiBranco = 63,PosInicialTorreReiPreto = 7,PosInicialTorreDamaBranco = 0,PosInicialTorreDamaPreto = 56;
            const EhAhTorreDoRei = inicio === PosInicialTorreReiBranco || inicio === PosInicialTorreReiPreto;
            const EhAhTorreDaDama = inicio === PosInicialTorreDamaBranco || inicio === PosInicialTorreDamaPreto;
            if(EhAhTorreDoRei){
                const RoqueDoRei = LetraPeca === "R" ? "K" : "k";
                RoquesPossiveisAposEste = RoquesPossiveis.replace(RoqueDoRei,"");
            }else if(EhAhTorreDaDama){
                const RoqueDaDama = LetraPeca === "R" ? "Q" : "q";
                RoquesPossiveisAposEste = RoquesPossiveis.replace(RoqueDaDama,"");
            }else{
                RoquesPossiveisAposEste = RoquesPossiveis;
            }
        }
        return RoquesPossiveisAposEste;
    }
    //---------------------------------------------------//
}