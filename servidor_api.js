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

sw.post('/insertpessoa', function (req, res, next) {
  postgres.connect(function (err, client, done) {
    if (err) {
      console.log("Nao conseguiu acessar o  BD " + err);
      res.status(400).send('{' + err + '}');
    } else {
      var q = {
        text: 'insert into tb_pessoa (tipo, nome, cpf, rg, email, cep, endereco, complemento, data_cadastro, data_nascimento, numero_celular, senha) values ($1, $2, $3, $4, $5, $6, $7, $8, now(), $9, $10, $11) returning nome, id, data_cadastro;',
        values: [

          req.body.tipo,
          req.body.nome,
          req.body.cpf,
          req.body.rg,
          req.body.email,
          req.body.cep,
          req.body.endereco,
          req.body.complemento,
          req.body.data_nascimento,
          req.body.numero_celular,
          req.body.senha
        ]
      }
      console.log(q);
      client.query(q, function (err, result) {
        done();
        if (err) {
          console.log('retornou 400 pelo insertpessoa');
          res.status(400).send('{' + err + '}');
        } else {
          console.log('retornou 201 no insertpessoa');
          res.status(201).send({
            "id": req.body.id,
            "tipo": req.body.tipo,
            "nome": req.body.nome,
            "cpf": req.body.cpf,
            "rg": req.body.rg,
            "email": req.body.email,
            "cep": req.body.cep,
            "endereco": req.body.endereco,
            "complemento": req.body.complemento,
            "data_cadastro": result.rows[0].data_cadastro,
            "data_nascimento": req.body.data_nascimento,
            "numero_celular": req.body.numero_celular,
            "senha": req.body.senha
          })

        }
      });
    }
  });
});

sw.get('/listpessoa', function (req, res) {
  postgres.connect(function (err, client, done) {
    if (err) {
      console.log("Não conseguiu acessar o BD :" + err);
      res.status(400).send('{' + err + '}');
    } else {
      client.query('select * from tb_pessoa order by id asc;', function (err, result) {
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

sw.post('/updatepessoa/:id', (req, res) => {
  postgres.connect(function (err, client, done) {
    if (err) {
      console.log("Não conseguiu acessar o BD: " + err);
      res.status(400).send('{' + err + '}');
    } else {
      var q = {
        text: 'update tb_pessoa set tipo= $2, nome = $3, cpf= $4, rg= $5, email= $6, cep= $7, endereco= $8, complemento= $9, data_cadastro= $10, data_nascimento= $11, numero_celular= $12, senha= $13 where id = $1 returning id, nome, data_cadastro',
        values: [
          req.body.id,
          req.body.tipo,
          req.body.nome,
          req.body.cpf,
          req.body.rg,
          req.body.email,
          req.body.cep,
          req.body.endereco,
          req.body.complemento,
          req.body.data_cadastro,
          req.body.data_nascimento,
          req.body.numero_celular,
          req.body.senha
        ]
      }
      console.log(q);
      client.query(q, function (err, result) {
        done(); // closing the connection;
        if (err) {
          console.log("Erro no update Pessoa: " + err);
          res.status(400).send('{' + err + '}');
        } else {
          res.status(200).send({
            "nome": req.body.nome,
            "id": req.body.id,
            "id": req.body.id,
            "tipo": req.body.tipo,
            "nome": req.body.nome,
            "cpf": req.body.cpf,
            "rg": req.body.rg,
            "email": req.body.email,
            "cep": req.body.cep,
            "endereco": req.body.endereco,
            "complemento": req.body.complemento,
            "data_cadastro": result.rows[0].data_cadastro,
            "data_nascimento": req.body.data_nascimento,
            "numero_celular": req.body.numero_celular,
            "senha": req.body.senha
          });
        }
      });
    }
  });
});

sw.get('/delpessoa/:id', (req, res) => {
  postgres.connect(function (err, client, done) {
    if (err) {
      console.log("Não conseguiu acessar o banco de dados" + err);
      res.status(400).send('{' + err + '}');
    } else {
      var q = {
        text: 'delete FROM tb_pessoa where id = $1',
        values: [req.params.id]
      }
      client.query(q, function (err, result) {
        done(); // closing the connection;
        if (err) {
          console.log(err);
          res.status(400).send('{' + err + '}');
        } else {
          res.status(200).send({ 'id': req.params.id });//retorna o nickname deletado.
        }
      });
    }
  });
});

const postgres = new pg.Pool(config);
sw.listen(4000, function () {
  console.log('Server is running.. on Port 4000');
});

















