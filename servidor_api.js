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
sw.post('/inserirpessoa', function (req, res, next) {
  postgres.connect(function (err, client, done) {
    if (err) {
      console.log("Nao conseguiu acessar o  BD " + err);
      res.status(400).send('{' + err + '}');
    } else {
      var q = {
        text: 'insert into tb_pessoa (data_cadastro, tipo, nome, cpf, rg, email, cep, endereco, complemento, data_nascimento, numero_celular, senha) values (now(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning nome, cpf, data_cadastro, data_nascimento;',
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
sw.post('/alterarpessoa/:cpf', (req, res) => {
  postgres.connect(function (err, client, done) {
    if (err) {
      console.log("Não conseguiu acessar o BD: " + err);
      res.status(400).send('{' + err + '}');
    } else {
      var q = {
        text: 'update tb_pessoa set tipo= $1, nome = $2, cpf= $3, rg= $4, email= $5, cep= $6, endereco= $7, complemento= $8, data_nascimento= $9, numero_celular= $10, senha= $11, data_cadastro = $12 where cpf = $3 returning cpf, nome',
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
          req.body.senha,
          req.body.data_cadastro
        ]
      }
      console.log(q);
      client.query(q, function (err, result) {
        done();
        if (err) {
          console.log("Erro no alterar: " + err);
          res.status(400).send('{' + err + '}');
        } else {
          res.status(200).send({
            "nome": req.body.nome,
            "tipo": req.body.tipo,
            "nome": req.body.nome,
            "cpf": req.body.cpf,
            "rg": req.body.rg,
            "email": req.body.email,
            "cep": req.body.cep,
            "endereco": req.body.endereco,
            "complemento": req.body.complemento,
            "data_cadastro": req.body.data_cadastro,
            "data_nascimento": req.body.data_nascimento,
            "numero_celular": req.body.numero_celular,
            "senha": req.body.senha
          });
        }
      });
    }
  });
});
sw.get('/deletarpessoa/:cpf', (req, res) => {
  postgres.connect(function (err, client, done) {
    if (err) {
      console.log("Não conseguiu acessar o banco de dados" + err);
      res.status(400).send('{' + err + '}');
    } else {
      var q = {
        text: 'delete FROM tb_pessoa where cpf = $1',
        values: [req.params.cpf]
      }
      var c = {
        text: 'delete FROM tb_cliente where cpf = $1',
        values: [req.params.cpf]
      }
      client.query(q, function (err, result) {
        if (err) {
          console.log(err);
          res.status(400).send('{' + err + '}');
        } else {
          client.query(c, function (err, result) {
            done();
            if (err) {
              console.log(err);
              res.status(400).send('{' + err + '}');
            } else {
              res.status(200).send({ 'cpf': req.params.cpf });
            }
          });
        }
      });



    }
  });
});

sw.get('/listarclientes', function (req, res) {
  postgres.connect(function (err, client, done) {
    if (err) {
      console.log("Não conseguiu acessar o BD :" + err);
      res.status(400).send('{' + err + '}');
    } else {
      client.query('select * from tb_cliente, tb_pessoa where tb_cliente.cpf = tb_pessoa.cpf order by data_cadastro asc;', function (err, result) {
        done();
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
sw.get('/mostrarcliente/:cpf', function (req, res) {
  postgres.connect(function (err, client, done) {
    if (err) {
      console.log("Não conseguiu acessar o BD :" + err);
      res.status(400).send('{' + err + '}');
    } else {
      const q = {
        text: 'SELECT * FROM tb_cliente JOIN tb_pessoa ON tb_cliente.cpf = tb_pessoa.cpf WHERE tb_cliente.cpf = $1;',
        values: [req.params.cpf]
      }
      client.query(q, function (err, result) {
        done();
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
sw.post('/inserircliente', function (req, res, next) {
  postgres.connect(function (err, client, done) {
    if (err) {
      console.log("Nao conseguiu acessar o  BD " + err);
      res.status(400).send('{' + err + '}');
    } else {
      var q = {
        text: ' insert into tb_cliente (data_ultima_visita, cpf) values ($1, $2) returning cpf, data_ultima_visita;',
        values: [
          req.body.data_ultima_visita,
          req.body.cpf
        ]
      }
      console.log(q);
      client.query(q, function (err, result) {
        done();
        if (err) {
          console.log('retornou 400 pelo inserircliente');
          res.status(400).send('{' + err + '}');
        } else {
          console.log('retornou 201 no inserircliente');
          res.status(201).send({
            "cpf": req.body.cpf,
            "data_ultima_visita": req.body.data_ultima_visita
          })
        }
      });
    }
  });
}); 
sw.post('/alterarcliente/:cpf', (req, res) => {
  postgres.connect(function (err, client, done) {
    if (err) {
      console.log("Não conseguiu acessar o BD: " + err);
      res.status(400).send('{' + err + '}');
    } else {
      var q = {
        text: 'update tb_cliente set cpf= $1, data_ultima_visita = $2 where cpf = $1 returning cpf, data_ultima_visita',
        values: [
          req.body.cpf,
          req.body.data_ultima_visita
        ]
      }
      console.log(q);
      client.query(q, function (err, result) {
        done(); // closing the connection;
        if (err) {
          console.log("Erro no alterar: " + err);
          res.status(400).send('{' + err + '}');
        } else {
          res.status(200).send({
            "cpf": req.body.cpf,
            "data_ultima_visita": req.body.data_ultima_visita
          });
        }
      });
    }
  });
});

sw.get('/listarfuncionários', function (req, res) {
  postgres.connect(function (err, client, done) {
    if (err) {
      console.log("Não conseguiu acessar o BD :" + err);
      res.status(400).send('{' + err + '}');
    } else {
      client.query('select * from tb_funcionario, tb_pessoa where tb_funcionario.cpf = tb_pessoa.cpf order by data_cadastro asc;', function (err, result) {
        done();
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
sw.get('/mostrarfuncionario/:cpf', function (req, res) {
  postgres.connect(function (err, client, done) {
    if (err) {
      console.log("Não conseguiu acessar o BD :" + err);
      res.status(400).send('{' + err + '}');
    } else {
      const q = {
        text: 'SELECT * FROM tb_funcionario JOIN tb_pessoa ON tb_funcionario.cpf = tb_pessoa.cpf WHERE tb_funcionario.cpf = $1;',
        values: [req.params.cpf]
      }
      client.query(q, function (err, result) {
        done();
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
sw.post('/inserirfuncionario', function (req, res, next) {
  postgres.connect(function (err, client, done) {
    if (err) {
      console.log("Nao conseguiu acessar o  BD " + err);
      res.status(400).send('{' + err + '}');
    } else {
      var q = {
        text: ' insert into tb_funcionario (cargo, numero_ctps, numero_pis, cpf) values ($1, $2, $3, $4) returning cpf;',
        values: [
          req.body.cargo,
          req.body.numero_ctps,
          req.body.numero_pis,
          req.body.cpf
        ]
      }
      console.log(q);
      client.query(q, function (err, result) {
        done();
        if (err) {
          console.log('retornou 400 pelo inserirfuncionario');
          res.status(400).send('{' + err + '}');
        } else {
          console.log('retornou 201 no inserirfuncionario');
          res.status(201).send({
           "cargo": req.body.cargo,
           "numero_ctps": req.body.numero_ctps,
           "numero_pis": req.body.numero_pis,
            "cpf": req.body.cpf
          })
        }
      });
    }
  });
});
sw.post('/alterarfuncionario/:cpf', (req, res) => {
  postgres.connect(function (err, client, done) {
    if (err) {
      console.log("Não conseguiu acessar o BD: " + err);
      res.status(400).send('{' + err + '}');
    } else {
      var q = {
        text: 'update tb_funcionario set cpf= $1, cargo = $2, numero_ctps = $3, numero_pis = $4 where cpf = $1 returning cpf',
        values: [
          req.body.cpf,
          req.body.cargo,
          req.body.numero_ctps,
          req.body.numero_pis
        ]
      }
      console.log(q);
      client.query(q, function (err, result) {
        done(); // closing the connection;
        if (err) {
          console.log("Erro no alterar: " + err);
          res.status(400).send('{' + err + '}');
        } else {
          res.status(200).send({
            "cargo": req.body.cargo,
            "numero_ctps": req.body.numero_ctps,
            "numero_pis": req.body.numero_pis,
             "cpf": req.body.cpf
          });
        }
      });
    }
  });
});

const postgres = new pg.Pool(config);

sw.listen(4000, function () {
  console.log('Server is running.. on Port 4000');
});

















