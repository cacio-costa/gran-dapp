const path = require('path');
const Web3 = require('web3');
const config = require('../config');

const connection = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

const metadadosContratoEleicao = require(path.resolve("../blockchain/build/contracts/Eleicao.json"));
let smartContractEleicao = new connection.eth.Contract(metadadosContratoEleicao.abi, metadadosContratoEleicao.networks[config.REDE].address);
console.log(`Contrato de eleição no endereço ${smartContractEleicao.options.address}`);

module.exports = {
    web3: connection, 
    smartContractEleicao
};