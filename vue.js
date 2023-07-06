
    $(document).ready(function () {
        var pessoas = [];
        var clientes = [];
        var dados = {
            "pessoas": pessoas,
            "form_pessoa": {
                id: '',
                tipo: '',
                nome: '',
                cpf: '',
                rg: '',
                email: '',
                cep: '',
                endereco: '',
                complemento: '',
                data_cadastro: '',
                data_nascimento: '',
                numero_celular: '',
                senha: '',
                ultimaVisita: ''
            }
        }
        Vue.prototype.$http = axios;
        Vue.use(window.vuelidate.default);

        const {
            required,
            minLength,
            minValue,
            maxLength,
        } = window.validators

        new Vue({
            el: '#appPessoa',
            data: dados,
            validations: {
                form_pessoa: {
                    tipo: {
                        required
                    },
                    nome: {
                        required,
                        minLength: minLength(4)
                    },
                    cpf: {
                        required,
                        minLength: minLength(8),
                        maxLength: maxLength(11)
                    },
                    rg: {
                        required,
                        minLength: minLength(11),
                        maxLength: maxLength(11)
                    },

                    cep: {
                        minLength: minLength(8),
                        maxLength: maxLength(11)
                    },
                    endereco: {

                    },
                    complemento: {

                    },
                    data_nascimento: {
                        required,
                        minValue: value => value < new Date().toISOString()
                    },
                    numero_celular: {
                        maxLength: maxLength(11)
                    },
                    email: {
                        maxLength: maxLength(100)
                    },
                    senha: {
                        required,
                        minLength: minLength(4)
                    },
                    ultimaVisita: {

                    }
                }
            },
            methods: {
                cliente: function (cliente) {
                    if (cliente.tipo == "cliente") {
                        return true;
                    }
                },
                mostrarInput: function () {
                    var inputContainer = document.getElementById("inputContainer");
                    inputContainer.classList.remove("hidden");
                },
                esconderInput: function () {
                    var inputContainer = document.getElementById("inputContainer");
                    inputContainer.classList.add("hidden");
                },
                status(validation) {
                    return {
                        error: validation.$error,
                        dirty: validation.$dirty
                    }
                },
                markAsDirty(validation) {
                    validation.$touch();
                },
                limparFormPessoa: function () {
                    this.form_pessoa.tipo = '';
                    this.form_pessoa.nome = '';
                    this.form_pessoa.cpf = '';
                    this.form_pessoa.rg = '';
                    this.form_pessoa.email = '';
                    this.form_pessoa.cep = '';
                    this.form_pessoa.endereco = '';
                    this.form_pessoa.complemento = '';
                    this.form_pessoa.data_nascimento = '';
                    this.form_pessoa.numero_celular = '';
                    this.form_pessoa.senha = '';
                },
                inserirPessoa: function () {
                    var pessoa = jQuery.extend({}, this.form_pessoa);
                    // copia e cria um novo objeto chamado pessoa 
                    let ehcliente = this.cliente(pessoa);
                    // testa se pessoa é cliente e retorna true 
                    if (ehcliente == true) {
                        console.log("é cliente")
                    }
                    else { console.log("não é cliente") }

                    // se o id existe
                    if (isNaN(parseInt(this.form_pessoa.id))) {
                    
                        this.$http.post('http://localhost:4000/insertpessoa', pessoa)
                        
                            .then(response => {
                                pessoa.id = response.data.id;
                                response.data.data_cadastro = this.$options.filters.formataData(response.data.data_cadastro);
                                this.pessoas.push(response.data);
                                alert('pessoa inserida');
                                this.limparFormPessoa();
                            })
                            .catch(error => {
                                alert('erro ao inserir pessoa');
                            });
                    } else {
                        this.$http.post('http://localhost:4000/updatepessoa/' + pessoa.id, pessoa)
                            .then(response => {
                                const pessoa_alterada = response.data;
                                pessoa_alterada.data_cadastro = this.$options.filters.formataData(pessoa_alterada.data_cadastro);
                                const index = this.pessoas.findIndex(item => item.id === pessoa_alterada.id);
                                if (index !== -1) { Vue.set(this.pessoas, index, pessoa_alterada); }
                                alert('Pessoa alterada ');

                            })
                            .catch(error => {
                                alert('Erro ao alterar a pessoa ' + error);
                            });
                    }

                },
                editPessoa: function (param_index) {
                    this.form_pessoa.id = this.pessoas[param_index].id;
                    this.form_pessoa.tipo = this.pessoas[param_index].tipo;
                    this.form_pessoa.nome = this.pessoas[param_index].nome;
                    this.form_pessoa.cpf = this.pessoas[param_index].cpf;
                    this.form_pessoa.rg = this.pessoas[param_index].rg;
                    this.form_pessoa.email = this.pessoas[param_index].email;
                    this.form_pessoa.cep = this.pessoas[param_index].cep;
                    this.form_pessoa.endereco = this.pessoas[param_index].endereco;
                    this.form_pessoa.complemento = this.pessoas[param_index].complemento;
                    this.form_pessoa.data_cadastro = this.pessoas[param_index].data_cadastro;
                    this.form_pessoa.data_nascimento = this.pessoas[param_index].data_nascimento;
                    this.form_pessoa.numero_celular = this.pessoas[param_index].numero_celular;
                    this.form_pessoa.senha = this.pessoas[param_index].senha;
                },
                remPessoa: function (param_index, param_id) {
                    var decisao = confirm('Deseja realmente remover a pessoa id:' + param_id + ' ?');
                    if (decisao) {
                        this.$http.get('http://localhost:4000/delpessoa/' + param_id)
                            .then(response => {
                                this.pessoas.splice(param_index, 1);
                                alert('Removeu com sucesso a pessoa id:' + response.data.id);
                            })
                            .catch(error => {
                                // error callback                                        
                                alert('Erro ao remover a pessoa ' + param_id + ': ' + error);
                                console.log(error);
                            });
                    } else {
                        alert('pessoa não removida !!!');
                    }

                }
            },
            //fim do methods
            filters: {
                formataData: function (value) {
                    //yyyy-mm-dd
                    var data = new Date(value);
                    data.setDate(data.getDate()); //incrementa a data em um dia para mostrar corretamente (pode nao ser necessário)              
                    dia = (data.getDate()).toString().padStart(2, '0'),
                        mes = (data.getMonth() + 1).toString().padStart(2, '0'), //+1 pois no getMonth Janeiro começa com zero.                
                        ano = data.getFullYear();
                    return dia + "/" + mes + "/" + ano;
                }

            }, //fim do filters
            created: function () {
                this.$http.get('http://localhost:4000/listpessoa')
                    .then(response => {
                        for (let e of response.data) {
                            this.pessoas.push({
                                id: e.id,
                                tipo: e.tipo,
                                nome: e.nome,
                                cpf: e.cpf,
                                rg: e.rg,
                                email: e.email,
                                cep: e.cep,
                                endereco: e.endereco,
                                complemento: e.complemento,
                                data_cadastro: this.$options.filters.formataData(e.data_cadastro),
                                data_nascimento: this.$options.filters.formataData(e.data_nascimento),
                                numero_celular: e.numero_celular,
                                senha: e.senha
                            }
                            );
                        }
                    }).catch(response => {
                        console.log(response);
                    });

            }//fecha o created
        })//fecha o vue
    })//fecha o $doc ready
