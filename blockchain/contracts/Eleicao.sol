pragma solidity >=0.7.0 <0.9.0;

contract Eleicao {

    struct Candidato {
        uint32 numero; 
        string nome;
    }

    mapping(uint32 => Candidato) public candidatos;
    mapping(uint32 => uint256) public votos;

    function votar(uint32 numeroDoCandidato, string memory codigoEleitor) external {
        Candidato memory escolhido = candidatos[numeroDoCandidato];
        require(escolhido.numero > 0, 'Candidato inexistente!');

        votos[numeroDoCandidato] += 1;
    }

    function cadastrarCandidato(uint32 numero, string memory nome) external {
        require(numero > 0, 'Numero invalido!');
        require(bytes(nome).length > 1, 'Nome precisa ter 2 ou mais caracteres');

        verificaSeNumeroJahExiste(numero);
        Candidato memory novo = Candidato({numero: numero, nome: nome});
        candidatos[numero] = novo;
    }

    function verificaSeNumeroJahExiste(uint32 numero) private view {
        require(candidatos[numero].numero != 0, 'Numero jah cadastrado!');
        
    }

    fallback() external {
        revert();
    }

}