let campoNumero = document.querySelector('#numero-candidato');
let campoEndereco = document.querySelector('#endereco');
let campoSenha = document.querySelector('#senha');

let identificacaoCandidato = document.querySelector('#identificacao-candidato');
let quadroCandidato = document.querySelector('#quadro-candidato');

let form = document.querySelector('#formulario');
form.addEventListener('submit', event => {
    event.preventDefault();
    
    let numero = campoNumero.value;
    let endereco = campoEndereco.value;
    let senha = campoSenha.value;

    let payload = { numero, endereco, senha };
    console.log(payload);

    axios.post(`/api/eleitor/voto`, payload)
        .then(resposta => {
            alert('Voto computado com sucesso!');
            window.location.href = '/eleitor/consultar-voto';
        })
        .catch(erro => {
            console.log(`Erro ao registrar voto: ${JSON.stringify(erro)}`);
            alert(`Erro ao registrar voto!`);
        });
});

let botaoPesquisar = document.querySelector('#botao-pesquisar');
botaoPesquisar.addEventListener('click', event => {
    event.preventDefault();

    let numero = campoNumero.value;
    axios.get(`/api/candidato/${numero}`)
        .then(resposta => {
            identificacaoCandidato.innerHTML = `${resposta.data.numero} - ${resposta.data.nome}`;
            quadroCandidato.classList.remove('d-none');
        })
        .catch(erro => {
            console.log(`Erro ao cadastrar candidato! ${JSON.stringify(erro)}`);
            alert(`Erro ao pesquisar candidato ${numero}!`);
        });
});