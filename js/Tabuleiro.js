import P from "./Pecas/P.js";
import N from "./Pecas/N.js";
import B from "./Pecas/B.js";
import R from "./Pecas/R.js";
import Q from "./Pecas/Q.js";
import K from "./Pecas/K.js";
import Conversoes from "./Conversoes.js";

//classe será responsável pela representação gráfica das peças e do tabuleiro assim como marcar graficamente
//as casas de movimentação possiveis
export default class Tabuleiro {
    constructor(jogo) {
        this.Jogo = jogo;
        this.div_tabuleiro = document.querySelector("#xadrez");
        this.card_jogo = document.querySelector('#card-jogo');
        this.Pecas = {
            K: 'imagens/brancas/K.png',
            k: 'imagens/pretas/k.png',
            P: 'imagens/brancas/P.png',
            p: 'imagens/pretas/p.png',
            B: 'imagens/brancas/B.png',
            b: 'imagens/pretas/b.png',
            Q: 'imagens/brancas/Q.png',
            q: 'imagens/pretas/q.png',
            N: 'imagens/brancas/N.png',
            n: 'imagens/pretas/n.png',
            R: 'imagens/brancas/R.png',
            r: 'imagens/pretas/r.png'
        };

        const mensagem = "Este Jogo ainda não possuí resultado";
        this.MensagemResultado(mensagem);
        this.ApagarPecasAtacadas();

        //adequando o tamanho do tabuleiro
        window.addEventListener('resize', () => {
           this.DesenharTabuleiro();
           this.DesenharPecas(this.Jogo.GetPosicoes());
        });
    }

    DesenharTabuleiro(){
        this.div_tabuleiro.innerHTML = "";

        const num_linhas_tabuleiro = 8;
        const num_colunas_tabuleiro = 8;
        const TamanhoTabuleiro = window.innerHeight > window.innerWidth ? window.innerWidth /1.5 : window.innerHeight/1.5;
        this.div_tabuleiro.style.width = TamanhoTabuleiro  + "px";
        this.div_tabuleiro.style.height = TamanhoTabuleiro + "px";

        let id_casa = 0;
        for(let i = 0;i < num_linhas_tabuleiro;i++){
            for(let j = 0;j < num_colunas_tabuleiro;j++){
                const div_casa_tabuleiro = document.createElement('div');
                div_casa_tabuleiro.classList.add('d-inline-block','p-2');
                div_casa_tabuleiro.style.width = div_casa_tabuleiro.style.height = TamanhoTabuleiro / 8 + "px";
                div_casa_tabuleiro.setAttribute('id',"_" + id_casa);

                j % 2 === i % 2 ? div_casa_tabuleiro.classList.add('bg-casa-branca') :
                    div_casa_tabuleiro.classList.add('bg-casa-preta');


                this.div_tabuleiro.appendChild(div_casa_tabuleiro);
                id_casa++;
            }
        }
    }

    DesenharPecas(config_pecas){
        let pecas_separadas = config_pecas.split(" ")[0].split("");

        const casas_do_tabuleiro = this.div_tabuleiro.children;

        let contador_casas = 0;
        let contador_pecas = 0;
        do{
            const EhUmaBarra = pecas_separadas[contador_pecas] === "/";
            if(EhUmaBarra){contador_pecas++;continue;}
            const EhUmaLetra = isNaN(parseInt(pecas_separadas[contador_pecas]));
            if(EhUmaLetra){
                const obj = this;
                const letra_peca = pecas_separadas[contador_pecas];
                const imagem_peca = document.createElement('img');
                imagem_peca.classList.add('mh-100','mw-100','d-block','cursor-pointer');
                imagem_peca.src = this.Pecas[letra_peca];
                imagem_peca.onclick = function (){
                    const img_src = this.src;
                    const posicao_em_numero = parseInt(this.parentElement.id.replace("_",""));
                    obj.EnviarInfoPeca(img_src,posicao_em_numero);
                }

                casas_do_tabuleiro[contador_casas].appendChild(imagem_peca);
            }else{
                const num_de_casas_a_pular = parseInt(pecas_separadas[contador_pecas]);
                contador_casas += num_de_casas_a_pular;
                contador_pecas++;
                continue;
            }
            contador_pecas++
            contador_casas++;
        }while (contador_casas < casas_do_tabuleiro.length);
    }

    EnviarInfoPeca(img_src,posicao_em_numero){

        this.DesmarcarPossiveisCasas();

        const y = Math.abs(Math.floor(posicao_em_numero/8) -7);
        const x = (posicao_em_numero % 8);
        const posicao_em_coordenada = {
            x: x,
            y: y
        }

        const peca = img_src.replace(".png","").split("/")[img_src.replace(".png","").split("/").length -1];
        const cor = peca === peca.toUpperCase() ? "Branco" : "Preto";
        if(!this.Jogo.EhAhVezDoJogador(cor)) return false;

        let peca_para_a_classe = peca.toUpperCase();

        //preciso disso pra conseguir instanciar a classe pela string
        const dict_classes_das_pecas = new Map([['P',P],['N',N],['B',B],['R',R],['Q',Q],['K',K]]);

        const classe_da_peca = new (dict_classes_das_pecas.get(peca_para_a_classe))(posicao_em_coordenada,cor);

        const PosicoesJogo = this.Jogo.SepararPosicaoEmArray(this.Jogo.GetPosicoes());
        const possiveis_casas = classe_da_peca.CalcularPossiveisRotas(PosicoesJogo);

        this.MarcarPossiveisCasas(possiveis_casas,posicao_em_numero,cor,peca);
    }

    MarcarPossiveisCasas(PossiveisCasas,PosicaoEmNumero,cor,peca){
        this.RemoverSinaisDeCasaAtacada();
        const ConfigJogo = this.Jogo.SepararPosicaoEmArray(this.Jogo.GetPosicoes());

        for(let casa of PossiveisCasas){
            //---------TesteCheque-----------//
            let PossivelConfigJogo = [...ConfigJogo];

            PossivelConfigJogo[casa] = peca;
            PossivelConfigJogo[PosicaoEmNumero] = "";

            if(K.EstaEmCheque(PossivelConfigJogo,cor)) continue;
            //-------------------------------//

            const EhCasaVazia = ConfigJogo[casa] === "";
            const PecaInimiga = ConfigJogo[casa];

            //---------TestePromoção--------//
            if(peca.toUpperCase() === "P") {
                const Peao = new P(Conversoes.NumeroParaCoordenada(casa), cor);
                if(Peao.EhPromocao()){
                    this.MarcarCasaPromocao(casa,PosicaoEmNumero,cor,PecaInimiga); continue;
                }
            }
            //-----------------------------//

            const DivAhSerMarcada = document.querySelector("#_" + casa);
            const CasaEhInimiga = DivAhSerMarcada.innerHTML !== "";
            let div;
            if(CasaEhInimiga){
                DivAhSerMarcada.classList.add('bg-casa-atacada');
                div = DivAhSerMarcada;
            }else{
                const DivCirculo = document.createElement('div');
                DivCirculo.classList.add('circulo','cursor-pointer');
                div = DivCirculo;
                DivAhSerMarcada.appendChild(div);
            }



            div.onclick = () => {
              !EhCasaVazia ? this.AdicionarPecaCapturadaAhDiv(cor,PecaInimiga) : null;
              this.Jogo.MoverPeca(PosicaoEmNumero,casa,cor);
            };
        }


            //------TestePossibilidadeRoque------//
        if(!(peca.toUpperCase() === "K")) return;

        let RoquesPossiveis = this.Jogo.GetPosicoes().split(" ")[2];
        const EhOhJogadorBranco = cor === "Branco";
        if(EhOhJogadorBranco){
            RoquesPossiveis = RoquesPossiveis.replace("k","");
            RoquesPossiveis = RoquesPossiveis.replace("q","");
        }else{
            RoquesPossiveis = RoquesPossiveis.replace("K","");
            RoquesPossiveis = RoquesPossiveis.replace("Q","");
        }
        RoquesPossiveis = RoquesPossiveis.split("");

        const PosRei = cor === "Branco" ? ConfigJogo.indexOf("K") : ConfigJogo.indexOf("k");
        for (let RoquePossivel of RoquesPossiveis){
           if(K.EhPossivelRocar(ConfigJogo,RoquePossivel)){
               const delta = RoquePossivel.toUpperCase() === "K" ? 1 : -1;
               const PosCasaQueSeraMarcadaParaOhRoque = PosRei + 2 * delta;
               this.MarcarCasaRoque(PosCasaQueSeraMarcadaParaOhRoque, RoquePossivel);
           }
        }
        //-----------------------------------//
    }

    MarcarCasaPromocao(casa,inicio,cor,peca){
       const EhCasaVazia = peca === "";
       const DivCasa = document.querySelector("#_" + casa);
       DivCasa.setAttribute('data-bs-container','body');
       DivCasa.setAttribute('data-bs-toggle','popover');
       DivCasa.setAttribute('tabindex','0');
       DivCasa.setAttribute('data-bs-trigger','focus');

       const EhPromocaoBranca = casa >= 0 && casa <= 7;
       const Posicao = EhPromocaoBranca ? "top" : "bottom";

       DivCasa.setAttribute('data-bs-placement',Posicao);
       DivCasa.classList.add('bg-casa-atacada','cursor-pointer');

       const PastaComAsImagens = EhPromocaoBranca ? "Brancas" : "Pretas";
       const obj = this;


        const ConteudoDiv = document.createElement('div');
        ConteudoDiv.classList.add('d-flex','justify-content-center');

       const FuncCapturarPeca = () => {!EhCasaVazia ? this.AdicionarPecaCapturadaAhDiv(cor,peca) : null};
       //-----------------CriandoAsOpçõesDePromoção----------------------//
       const PecasPossiveisDePromocao = ['Q','R','B','N'];
       for(let PossivelPeca of PecasPossiveisDePromocao){
           const FuncPeca = function () {obj.Jogo.Promover(casa,inicio,PossivelPeca,cor)};
           const ImgPeca =  document.createElement('img');
           ImgPeca.src = "/imagens/" + PastaComAsImagens + "/" + PossivelPeca +".png";
           ImgPeca.alt = PossivelPeca;
           ImgPeca.classList.add('d-inline-block','pecas-promocao','cursor-pointer');
           ImgPeca.onclick = () => {
               FuncPeca();
               FuncCapturarPeca();
           };
           ConteudoDiv.appendChild(ImgPeca);
       }
       //-----------------------------------------------------------------//

       const popover = new bootstrap.Popover(DivCasa, {
            trigger: 'focus',
            content: ConteudoDiv,
            html: true,
       });
    }

    MarcarCasaRoque(casa,CodigoRoque){
        const DivCasa = document.querySelector("#_" + casa);
        const DivCirculo = document.createElement('div');
        DivCirculo.classList.add('circulo','cursor-pointer');
        DivCasa.appendChild(DivCirculo);

        DivCirculo.onclick = () => {
          this.Jogo.Rocar(CodigoRoque);
        };
    }

    AdicionarPecaCapturadaAhDiv(cor,peca){
        peca = peca.toUpperCase();
        const EhBranca = cor === "Branco";
        const CaminhoImg = EhBranca ? '/imagens/pretas/' + peca + '.png' : '/imagens/brancas/' + peca + '.png';

        const DivPecasCapturadas = document.querySelector('#' + cor);

        const ImgPecaCapturada = document.createElement('img');
        ImgPecaCapturada.src = CaminhoImg;
        ImgPecaCapturada.alt = peca;
        ImgPecaCapturada.classList.add('img-peca-capturada');

        DivPecasCapturadas.appendChild(ImgPecaCapturada);
    }

    DesmarcarPossiveisCasas(){
        const PossiveisCasas = document.querySelectorAll(".circulo");
        for(let casa of PossiveisCasas){
            casa.parentNode.removeChild(casa);
        }
    }

    RemoverSinaisDeCasaAtacada(){
        const CasasComAhClasseDeAtaque = document.querySelectorAll(".bg-casa-atacada");
        CasasComAhClasseDeAtaque.forEach((casa) => {
            casa.classList.remove('bg-casa-atacada');
        });
    }

    MensagemResultado(mensagem){
        const DivChequeMate = document.querySelector('#cheque-mate');

        DivChequeMate.innerHTML = mensagem;
    }

    AbrirModalJogo(){
        const divmodal = document.querySelector('#ModalJogo');
        const modal =new bootstrap.Modal(divmodal, {
            keyboard: false,
        });

        modal.show();
    }

    ApagarPecasAtacadas(){
        document.querySelector("#Branco").innerHTML = "";
        document.querySelector("#Preto").innerHTML = "";
    }
}

