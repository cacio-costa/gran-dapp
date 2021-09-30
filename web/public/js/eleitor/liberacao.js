let campoTitulo = document.querySelector('#titulo-eleitor');
let campoSenha = document.querySelector('#senha');

let form = document.querySelector('#formulario');
form.addEventListener('submit', event => {
    event.preventDefault();
    
    let titulo = campoTitulo.value;
    let senha = campoSenha.value;

    let payload = { titulo, senha };
    console.log('Enviando formulário para liberar votação:', payload);

    axios.post(`/api/eleitor`, payload)
        .then(resposta => {
            campoTitulo.value = '';
            campoSenha.value = '';

            console.log(`Código gerado para eleitor: ${resposta.data.codigo}.`);

            let codigo = document.querySelector('#codigo');
            codigo.innerHTML = resposta.data.codigo;

            let mensagem = document.querySelector('#mensagem');
            mensagem.classList.remove('d-none');
        })
        .catch(erro => {
            console.log(`Erro ao cadastrar candidato! ${erro.response.data.mensagem}`);
            alert(`Erro ao cadastrar candidato! ${erro.response.data.mensagem}`);
        });
});