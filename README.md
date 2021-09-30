# GranVote 
 - Aplicação de exemplo para interagir com contratos inteligente numa rede Ethereum.

### Dependências necessárias

Os softwares necessários para rodar o app são:

- [NodeJS](https://nodejs.org)
- [Truffle](https://www.trufflesuite.com/truffle)
- [Docker](https://www.docker.com/products/docker-desktop)


### Instruções

#### Instalação do Truffle

Após instalar o NodeJS, abra um terminal e digite o comando abaixo para instalar o utilitário do Truffle:
> npm install -g truffle


#### Subir um nó Ethereum

A imagem [caciocosta/gran-ethereum](https://hub.docker.com/r/caciocosta/gran-ethereum) já vem pré-configurada com o [Geth Client](https://geth.ethereum.org).

Ela possui a conta **0xC6C5544C849c74932b3Af7831B7f8af67d1034dd** com senha vazia. Essa conta é utilizada como recompensa de mineração, e como conta de serviço pela aplicação, tanto para implantar contratos como para realizar operações.

Para executar o contêiner faça:
> docker run -it --name ethereum -p 8545:8545 -p 30303:30303 caciocosta/gran-ethereum

O comando acima adentra o contêiner. Para executar o Geth faça:
> geth --datadir /root/gran-ethereum --nodiscover --maxpeers 0 --networkid 11223 --http --http.addr 0.0.0.0 --http.api 'web3,eth,net,debug,personal' --http.corsdomain '*' --allow-insecure-unlock --mine --miner.threads 1

*O nó construirá a DAG para realizar a mineração e este processo pode demorar um pouco.*
**Deixe o terminal aberto! A aplicação se conectará a esse cliente.**


#### Implantar o contrato de eleição

Abra outro terminal e acesse o diretório **blockchain** localizado no projeto. Os comandos abaixo desbloqueiam a conta de implantação dos contratos e implanta o contrato de eleição no Ethereum.
> truffle console
> contas = await web3.eth.getAccounts()
> web3.eth.personal.unlockAccount('0xC6C5544C849c74932b3Af7831B7f8af67d1034dd', '', 0)
> migrate

*O código "compilado" do contrato, necessário para utilizar a biblioteca web3.js está localizado em **blockchain/build/contracts/Eleicao.json**.*

#### Executar a aplicação

Num terminal, acesse o diretório **web** do projeto. É necessário instalar as dependências da aplicação antes de executá-la. Execute:
> npm install

Após instaladas as dependências, é só subir a aplicação:
> npm start

Basta acessar a aplicação em **http://localhost:3000**. No menu superior ficam as funcionalidades para cadastrar candidato, liberar um eleitor para votação, registrar voto e consultar voto realizado.