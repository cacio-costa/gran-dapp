let campoNome = document.querySelector('#nome');
let campoNumero = document.querySelector('#numero');

let form = document.querySelector('#formulario');
form.addEventListener('submit', event => {
    event.preventDefault();
    
    let nome = campoNome.value;
    let numero = campoNumero.value;

    let payload = { nome, numero };
    console.log('Enviando formulário para cadastro de candidato:', payload);

    axios.post(`/api/candidato`, payload)
        .then(resposta => {
            campoNome.value = '';
            campoNumero.value = '';

            alert('Candidato cadastrado com sucesso');
        })
        .catch(erro => {
            console.log(`Erro ao cadastrar candidato! ${erro.response.data.mensagem}`);
            alert(`Erro ao cadastrar candidato! ${erro.response.data.mensagem}`);
        });
});