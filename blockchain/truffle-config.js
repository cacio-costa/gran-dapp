module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     
      port: 8545,            
      network_id: "*", 
      from: "0xC6C5544C849c74932b3Af7831B7f8af67d1034dd"
    },
  }, 
  
  compilers: {
    solc: {
      version: "0.8.7"
    }
  }
};
