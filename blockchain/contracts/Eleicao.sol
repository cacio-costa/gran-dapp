pragma solidity >=0.7.0 <0.9.0;

contract Eleicao {

    bool public encerrada;
    address public dono;

    uint32[] private numerosDosCandidatos;
    mapping(uint32 => Candidato) public candidatos;
    
    Candidato public vencedor;
    mapping(uint32 => uint256) public urna;
    mapping(address => Candidato) public consultaVoto;

    constructor() {
        dono = _sender();
    }

    function _sender() private view returns (address) {
        return msg.sender;
    }

    function votar(uint32 numeroDoCandidato) external {
        require(!encerrada, 'Eleicao jah encerrada');
        require(!_jahVotou(), 'Eleitor jah registrou voto anteriormente nessa eleicao');

        Candidato memory escolhido = candidatos[numeroDoCandidato];
        require(escolhido.numero > 0, 'Candidato inexistente!');
        
        urna[numeroDoCandidato] += 1;
        consultaVoto[_sender()] = escolhido;
    }

    function _jahVotou() private view returns (bool) {
        Candidato memory candidatoEscolhido = consultaVoto[_sender()];
        return bytes(candidatoEscolhido.nome).length > 0;
    }

    function cadastrarCandidato(uint32 numero, string memory nome) external {
        require(numero > 0, 'Numero invalido!');
        require(bytes(nome).length > 1, 'Nome precisa ter 2 ou mais caracteres');
        require(_numeroDisponivel(numero), 'Numero jah cadastrado!');

        numerosDosCandidatos.push(numero);

        Candidato memory novo = Candidato({numero: numero, nome: nome});
        candidatos[numero] = novo;
    }

    function _numeroDisponivel(uint32 numero) private view returns (bool) {
        Candidato memory possivelCandidato = candidatos[numero];
        return bytes(possivelCandidato.nome).length == 0;
    }

    function encerrar() external {
        require(dono == _sender(), 'Somente dono pode encerrar eleicao!');
        encerrada = true;

        uint256 maiorVotacao = 0;
        for (uint32 numero = 0; numero < numerosDosCandidatos.length; numero++) {
            Candidato memory candidato = candidatos[numero];

            uint256 votosObtidos = urna[candidato.numero];
            if (votosObtidos > maiorVotacao) {
                maiorVotacao = votosObtidos;

                vencedor = candidato;
            }
        }
    }

    fallback() external {
        revert();
    }

    struct Candidato {
        uint32 numero; 
        string nome;
    }

}