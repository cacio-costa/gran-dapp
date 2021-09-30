let { web3, smartContractEleicao } = require('../infraestrutura/Web3Config');
const config = require('../config');

module.exports = function(app) {

    app.get('/eleitor/votar', (req, res) => res.render('eleitor/votar.html'));
    app.get('/eleitor/liberar-votacao', (req, res) => res.render('eleitor/liberacao.html'));
    app.get('/eleitor/consultar-voto', (req, res) => res.render('eleitor/consultar-voto.html'));

    /**
     * Cria conta ao liberar eleitor para votação.
     * Inicializa saldo da nova conta com 1 Ether.
     */
    app.post('/api/eleitor', async (req, res) => {
        console.log('*** Criando nova conta para votação...');
    
        web3.eth.personal.newAccount(req.body.senha)
            .then(async enderecoGerado => {
                console.log(`Endereço gerado: ${enderecoGerado}!`);
                console.log('*** Desbloqueando conta de serviço...');
    
                await web3.eth.personal.unlockAccount(config.CONTA.ENDERECO, config.CONTA.SENHA, 60000);
                return enderecoGerado;
            })
            .then(destinatario => {
                console.log('*** Conta de serviço desbloquada!');
                console.log(`*** Inicializando saldo da nova conta ${destinatario}...`);
    
                let umEther = web3.utils.toWei('1', 'ether');
                return web3.eth.sendTransaction({from: config.CONTA.ENDERECO, to: destinatario, value: umEther});
            })
            .then(recibo => {
                console.log(`*** Saldo inicializado! Recibo: ${recibo.transactionHash}!`);
                res.json({ 'codigo': recibo.to });
            })
            .catch(error => {
                res.status(500).json({ mensagem: error.message });
            });
    });
    
    /**
     * Registra voto do eleitor.
     */
    app.post('/api/eleitor/voto', async (req, res) => {
        let numero = req.body.numero;
        let endereco = req.body.endereco;
        let senha = req.body.senha;
    
        console.log('*** Desbloqueando conta do eleitor...');
    
        await web3.eth.personal.unlockAccount(endereco, senha, 60000);
        console.log('*** Conta do eleitor desbloqueada!');
    
        console.log(`*** Registrando voto do eleitor: ${endereco}...`);
    
        try {
            let recibo = await smartContractEleicao.methods.votar(numero)
            .send({from: endereco});
    
            console.log(`*** Voto registrado! Recibo: ${recibo.transactionHash}!`);
            res.status(200).end();
        } catch (e) {
            console.log(`Erro ao registrar voto: ${e.message}`);
            res.status(500).json({ mensagem: e.message});
        }
        
    });
    
    /**
     * Dado o endereço do eleitor, consulta seu voto.
     * Tenta 'logar' no blockchain desbloquando a conta. Se não conseguir, devolve UNAUTHORIZED (401).
     */
    app.post('/api/eleitor/voto/consultar', async (req, res) => {
        let endereco = req.body.endereco;
        let senha = req.body.senha;
        
        console.log('*** Desbloqueando conta do eleitor...');
    
        let logou = await web3.eth.personal.unlockAccount(endereco, senha, 60000);
        if (!logou) {
            res.status(401).end();
            return false;
        }
        
        console.log('*** Conta de serviço desbloqueada!');
    
        try {
            console.log(`*** Recuperando dados do candidato...`);
    
            await web3.eth.personal.unlockAccount(config.CONTA.ENDERECO, config.CONTA.SENHA, 60000);
            let candidato = await smartContractEleicao.methods.consultaVoto(endereco)
                .call({from: config.CONTA.ENDERECO});
            
            console.log(`*** Candidato ${candidato.numero} recuperado: ${candidato.nome}.`);
            res.json(candidato);
        } catch (e) {
            console.log(`*** Erro recuperar candidato: ${e}.`);
    
            res.status(500).json({ 
                mensagem: e.message
            });
        }
    });

};
