const express = require('express');
const app = express();

app.set('views', __dirname + "/view");
app.engine('html', require('ejs').renderFile);

app.use(express.static('public'));
app.use(express.static('node_modules'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => res.render('index.html'));

const moduloCandidato = require('./controller/candidato');
moduloCandidato(app);

const moduloEleitor = require('./controller/eleitor');
moduloEleitor(app);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

// geth --datadir /root/gran-ethereum --networkid 11223 --http --http.addr 0.0.0.0 --http.api 'web3,eth,net,debug,personal' --http.corsdomain '*' --allow-insecure-unlock --mine --miner.threads 1