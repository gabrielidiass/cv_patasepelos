var express = require('express');
var pg = require("pg");
var sw = express();
sw.use(express.json());
sw.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  next();
});
const config = {
  host: 'localhost',
  user: 'postgres',
  database: 'patasepelos_db',
  password: 'postgres',
  port: 5432
};
sw.get('/listarclientes', function (req, res) {
  postgres.connect(function (err, client, done) {
    if (err) {
      console.log("Não conseguiu acessar o BD :" + err);
      res.status(400).send('{' + err + '}');
    } else {
      client.query('select * from tb_cliente, tb_pessoa where tb_cliente.cpf = tb_pessoa.cpf order by data_cadastro asc;', function (err, result) {
        done(); // closing the connection;
        if (err) {
          console.log(err);
          res.status(400).send('{' + err + '}');
        } else {
          res.status(200).send(result.rows);
        }
      });
    }
  });
});
const postgres = new pg.Pool(config);
sw.listen(4000, function () {
  console.log('Server is running.. on Port 4000');
});

















