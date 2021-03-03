import Tabuleiro from "./Tabuleiro.js";
import Conversoes from "./Conversoes.js";
import K from "./Pecas/K.js";
import Audios from "../Sons/Audios.js";

//classe será responsável pelo controle da vez de cada jogador e chamar todos os métodos necessários
//para atender as regras do jogo, assim como movimento das peças e tocar os áudios
export default class Jogo {
    constructor() {
        this.Tabuleiro = new Tabuleiro(this);
        this.Movimentos = new Conversoes();
        const posicao_inicial = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq";

        this.Posicao = posicao_inicial;
        this.Tabuleiro.DesenharTabuleiro();
        this.Tabuleiro.DesenharPecas(posicao_inicial);
    }

    GetPosicoes(){
        return this.Posicao;
    }

    MoverPeca(inicio,destino,cor){
        if(!this.EhAhVezDoJogador(cor)) return false;

        let Posicoes = this.SepararPosicaoEmArray(this.Posicao);
        Posicoes[destino] = Posicoes[inicio];
        Posicoes[inicio] = "";

        const LetraPeca = Posicoes[destino];
        this.AtualizarPossibilidadesDeRoque(LetraPeca,inicio);

        Posicoes = this.JuntarPosicoesEmString(Posicoes);
        this.Posicao = Posicoes;

        this.EhFimDeJogo(cor);

        Audios.TocarAudioMovPeca();

        this.Tabuleiro.DesenharTabuleiro();
        this.Tabuleiro.DesenharPecas(Posicoes);
    }

    EhFimDeJogo(cor){
        let NovasPosicoes = this.SepararPosicaoEmArray(this.Posicao);
        const CorReiInimigo = cor === "Branco" ? "Preto" : "Branco";

        if(K.EhChequeMate(NovasPosicoes,CorReiInimigo)){
            let mensagem = cor === "Branco" ? "<b>1 X 0</b>" : "<b>0 X 1</b>";
            mensagem += "<br/><b>Vitória por Cheque-mate</b>";
            this.Tabuleiro.MensagemResultado(mensagem);
            this.Tabuleiro.AbrirModalJogo();
        }else if(K.EhAfogamento(NovasPosicoes,CorReiInimigo)){
            const mensagem = "<b>1/2 X 1/2</b><br/><b>Empate por Afogamento</b>";
            this.Tabuleiro.MensagemResultado(mensagem);
            this.Tabuleiro.AbrirModalJogo();
        }
    }

    Promover(destino,inicio,peca,cor){
        if(cor === "Branco") peca = peca.toUpperCase();
        else peca = peca.toLowerCase();

        let ConfigJogo = this.SepararPosicaoEmArray(this.Posicao);
        ConfigJogo[inicio] = "";
        ConfigJogo[destino] = peca;

        ConfigJogo = this.JuntarPosicoesEmString(ConfigJogo);

        this.Posicao = ConfigJogo;

        this.Tabuleiro.DesenharTabuleiro();
        this.Tabuleiro.DesenharPecas(this.Posicao);
    }

    AtualizarPossibilidadesDeRoque(LetraPeca,inicio){
        //--------------AtualizarAsPossibilidadesDeRoque------------------//
        if(LetraPeca.toUpperCase() === "K" || LetraPeca.toUpperCase() === "R"){
            const RoquesPossiveis = this.Posicao.split(" ")[2];
            const RoquesPossiveisAposEste = K.AtualizarPossibilidadesRoque(LetraPeca,inicio,RoquesPossiveis);

            this.Posicao = this.Posicao.replace(RoquesPossiveis,RoquesPossiveisAposEste);
        }
        //-------------------------------------------------------------------//
    }

    Rocar(CodigoRoque){
        const cor = CodigoRoque === CodigoRoque.toUpperCase() ? "Branco" : "Preto";
        const LetraRei = CodigoRoque === CodigoRoque.toUpperCase() ? "K" : "k";
        const ConfigJogo = this.SepararPosicaoEmArray(this.Posicao);
        const PosRei = ConfigJogo.indexOf(LetraRei);
        let PosTorre;
        let DestinoRei;
        let DestinoTorre
        if(CodigoRoque.toUpperCase() === "K"){
            PosTorre = PosRei + 3;
            DestinoRei = PosRei + 2;
            DestinoTorre = PosTorre - 2;
        }else{
            PosTorre = PosRei - 4;
            DestinoRei = PosRei - 2;
            DestinoTorre = PosTorre + 3;
        }


        this.MoverPeca(PosTorre,DestinoTorre,cor);
        this.TrocarAhVez();
        this.MoverPeca(PosRei,DestinoRei,cor);
    }

    SepararPosicaoEmArray(string){
        const posicao = string.split("/").join("").split("");
        let array_posicoes = [];
        for(let peca of posicao){
            const EhUmaLetra = isNaN(parseInt(peca));
            if(EhUmaLetra){
                array_posicoes.push(peca);
            }else{
                const numero = peca;
                for(let i = 0;i < numero;i++){
                    array_posicoes.push("");
                }
            }
        }

        return array_posicoes;
    }

    JuntarPosicoesEmString(ArrayPosicoes){
        const roques = this.Posicao.split(" ")[2];

        let ArrayComColunas = [];
        for(let Posicao = 0;Posicao < 8;Posicao++){
           ArrayComColunas.push(ArrayPosicoes.splice(0,8));
        }

        for (let Linha of ArrayComColunas){
            for (let Pos = 0;Pos !== 8;Pos++){
                if(Linha[Pos] === "") {Linha[Pos] = "em"}
                else Linha[Pos] = Linha[Pos].toUpperCase() === Linha[Pos] ? "w" + Linha[Pos].toLowerCase() : "b" + Linha[Pos].toLowerCase();
            }
        }
        let Resultado = "";

        for(let i = 0; i < ArrayComColunas.length; i++)
        {
            let CasasVazias = 0;
            for(let j = 0; j < ArrayComColunas[i].length; j++) {
                let PecaNaCasa = ArrayComColunas[i][j][0];
                if(PecaNaCasa === 'w' || PecaNaCasa === 'b') {
                    if(CasasVazias > 0) {
                        Resultado += CasasVazias.toString();
                        CasasVazias = 0;
                    }if(PecaNaCasa === 'w') {
                        Resultado += ArrayComColunas[i][j][1].toUpperCase();  // Fixed
                    } else {
                        Resultado += ArrayComColunas[i][j][1].toLowerCase();  // Fixed
                    }
                } else {
                    CasasVazias += 1;
                }
            }
            if(CasasVazias > 0) {
                Resultado += CasasVazias.toString();
            }if(i < ArrayComColunas.length - 1) {
                Resultado += '/';
            }
        }
        Resultado += " " + this.TrocarAhVez();
        Resultado += " " + roques;
        return Resultado;
    }

    EhAhVezDoJogador(cor){
        let jogador_da_vez = this.Posicao.split(" ");
        jogador_da_vez = jogador_da_vez[1];
        const EhAvezDoJogador = jogador_da_vez === "w" && cor === "Branco" || jogador_da_vez === "b" && cor === "Preto";
        return EhAvezDoJogador;
    }

    TrocarAhVez(){
        let ConfigJogo = this.Posicao.split(" ");
        let JogadorAtual = ConfigJogo[1];
        let ProximoJogador = JogadorAtual === "w" ? "b" : "w";

        ConfigJogo[1] = ProximoJogador;
        ConfigJogo = ConfigJogo.join(" ");


        this.Posicao = ConfigJogo;

        return ProximoJogador;
    }
}