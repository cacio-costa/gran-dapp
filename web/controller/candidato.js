const { web3, smartContractEleicao } = require('../infraestrutura/Web3Config');
const config = require('../config');

module.exports = function(app) {

    app.get('/cadidato/formulario-cadastro', (req, res) => res.render('candidato/formulario-cadastro.html'));

    app.post('/api/candidato', async (req, res) => {
        let numero = req.body.numero;
        let nome = req.body.nome;
        
        console.log('*** Desbloqueando conta de serviço...');
    
        await web3.eth.personal.unlockAccount(config.CONTA.ENDERECO, config.CONTA.SENHA, 60000);
        console.log('*** Conta de serviço desbloqueada!');
    
        console.log(`*** Cadastrando novo candidato: ${numero} => ${nome}...`);
    
        try {
            let recibo = await smartContractEleicao.methods.cadastrarCandidato(numero, nome)
                .send({from: config.CONTA.ENDERECO});
            
            console.log(`*** Candidato ${numero} => ${nome} cadastrado (${JSON.stringify(recibo)})!`);
            res.json({ 
                numero, 
                nome,
                mensagem: 'Candidato cadastrado!'
            });
        } catch (e) {
            console.log(`*** Erro ao cadastrar candidato: ${e}`);
    
            res.status(500).json({ 
                mensagem: e.message.replace('Returned error: execution reverted: ', '') 
            });
        }
        
    });
    
    app.get('/api/candidato/:numero', async (req, res) => {
        let numero = req.params.numero;
        
        console.log('*** Desbloqueando conta de serviço...');
    
        await web3.eth.personal.unlockAccount(config.CONTA.ENDERECO, config.CONTA.SENHA, 60000);
        console.log('*** Conta de serviço desbloqueada!');
    
        try {
            console.log(`*** Recuperando dados do candidato: ${numero}...`);
            let candidato = await smartContractEleicao.methods.candidatos(numero)
                .call({from: config.CONTA.ENDERECO});
            
            console.log(`*** Candidato ${numero} recuperado: ${candidato.nome}.`);
            res.json(candidato);
        } catch (e) {
            console.log(`*** Erro recuperar candidato ${numero}: ${e}.`);
    
            res.status(500).json({ 
                mensagem: e.message
            });
        }
        
    });

};