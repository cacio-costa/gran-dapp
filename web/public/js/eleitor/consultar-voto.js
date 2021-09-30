let campoEndereco = document.querySelector('#endereco');
let campoSenha = document.querySelector('#senha');

let identificacaoCandidato = document.querySelector('#identificacao-candidato');
let quadroCandidato = document.querySelector('#quadro-candidato');

let botaoPesquisar = document.querySelector('#botao-pesquisar');
botaoPesquisar.addEventListener('click', event => {
    event.preventDefault();

    let endereco = campoEndereco.value;
    let senha = campoSenha.value;

    axios.post(`/api/eleitor/voto/consultar`, { endereco, senha })
        .then(resposta => {
            identificacaoCandidato.innerHTML = `${resposta.data.numero} - ${resposta.data.nome}`;
            quadroCandidato.classList.remove('d-none');

            campoSenha.value = '';
            campoEndereco.value = '';
        })
        .catch(erro => {
            console.log(`Erro ao pesquisar voto! ${JSON.stringify(erro)}`);
            alert(`Erro ao pesquisar voto do código ${endereco}!`);
        });
});