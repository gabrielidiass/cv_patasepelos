$(document).ready(function () {
    var clientes = [];
    var dados = {
        "clientes": clientes,
        "form_cliente": {
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
            data_ultima_visita: ''
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
        el: '#app',
        data: dados,
        // validations: {
        //     form_cliente: {
        //         tipo: {
        //             required
        //         },
        //         nome: {
        //             required,
        //             minLength: minLength(4)
        //         },
        //         cpf: {
        //             required,
        //             minLength: minLength(8),
        //             maxLength: maxLength(11)
        //         },
        //         rg: {
        //             required,
        //             minLength: minLength(11),
        //             maxLength: maxLength(11)
        //         },

        //         cep: {
        //             minLength: minLength(8),
        //             maxLength: maxLength(11)
        //         },
        //         endereco: {

        //         },
        //         complemento: {

        //         },
        //         data_nascimento: {
        //             required,
        //             minValue: value => value < new Date().toISOString()
        //         },
        //         numero_celular: {
        //             maxLength: maxLength(11)
        //         },
        //         email: {
        //             maxLength: maxLength(100)
        //         },
        //         senha: {
        //             required,
        //             minLength: minLength(4)
        //         },
        //         ultimaVisita: {

        //         }
        //     }
        // },
        methods: {
            // status(validation) {
            //     return {
            //         error: validation.$error,
            //         dirty: validation.$dirty
            //     }
            // },
            // markAsDirty(validation) {
            //     validation.$touch();
            // }, 
            limpar_form_cliente: function () {
                this.form_cliente.nome = '';
                this.form_cliente.cpf = '';
                this.form_cliente.rg = '';
                this.form_cliente.email = '';
                this.form_cliente.cep = '';
                this.form_cliente.endereco = '';
                this.form_cliente.complemento = '';
                this.form_cliente.data_nascimento = '';
                this.form_cliente.numero_celular = '';
                this.form_cliente.senha = '';
                this.form_cliente.data_ultima_visita = '';
            },
            inserir_pessoa: function (pessoa) {
                // construção da Promise baseada no vídeo: https://www.youtube.com/watch?v=87gWRVGRZ5o;
                return new Promise((resolve, reject) => {
                    this.$http.post('http://localhost:4000/inserirpessoa', pessoa)
                        .then(response => {
                            resolve(response.data);
                        })
                        .catch(error => {
                            console.log('erro ao inserir pessoa' + error);
                            reject("erro ao inserir pessoa");
                        });
                });
            },
            alterar_pessoa: function (pessoa){
                // chama a api e passa a pessoa (objeto) pra ela
                // o cpf pra requisição será o cpf da pessoa passada como parametro
                     this.$http.post('http://localhost:4000/alterarpessoa/' + pessoa.cpf, pessoa)
                // quando bem sucedido
                            .then(response => {
                                // atribui a resposta do servidor a uma variável
                                const pessoa_alterada = response.data;
                                // aplica o filtro de data no data_cadastro
                                // pessoa_alterada.data_cadastro = this.$options.filters.formataData(pessoa_alterada.data_cadastro);
                                const index = this.clientes.findIndex(item => item.cpf === pessoa_alterada.cpf);
                                if (index !== -1) { Vue.set(this.clientes, index, pessoa_alterada); }
                                alert('Pessoa alterada ');
                            })
                            .catch(error => {
                                alert('Erro ao alterar a pessoa ' + error);
                            });
                        return;
            },
            inserir_cliente: async function () {
                var cliente = jQuery.extend({}, this.form_cliente);

                cliente.tipo = "cliente";

                if ((clientes.some(cliente => cliente.cpf === this.form_cliente.cpf) == false)) {
                    try {
                        // documentação do some(): https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/some
                        var objeto_pessoa = await this.inserir_pessoa(cliente);
                        var objeto_cliente = await new Promise((resolve, reject) => {
                            this.$http.post('http://localhost:4000/inserircliente', cliente)
                                .then(response => {
                                    resolve(objeto_cliente = response.data);
                                    console.log('cliente inserido');
                                })
                                .catch(error => {
                                    reject(alert('erro ao inserir' + error));
                                })
                        })

                        var objeto_final = $.extend({}, objeto_cliente, objeto_pessoa);

                        objeto_final.data_cadastro = this.$options.filters.formataData(objeto_final.data_cadastro);
                        objeto_final.data_ultima_visita = this.$options.filters.formataData(objeto_final.data_ultima_visita);
                        objeto_final.data_nascimento = this.$options.filters.formataData(objeto_final.data_nascimento);

                        this.clientes.push(objeto_final);
                    } catch (error) { alert(error.message); }


                } else {
                   console.log(cliente);
                   this.alterar_pessoa(cliente);
                }

            },
            edita_cliente: function (param_index) {
                this.form_cliente.tipo = this.clientes[param_index].tipo;
                this.form_cliente.nome = this.clientes[param_index].nome;
                this.form_cliente.cpf = this.clientes[param_index].cpf;
                this.form_cliente.rg = this.clientes[param_index].rg;
                this.form_cliente.email = this.clientes[param_index].email;
                this.form_cliente.cep = this.clientes[param_index].cep;
                this.form_cliente.endereco = this.clientes[param_index].endereco;
                this.form_cliente.complemento = this.clientes[param_index].complemento;
                this.form_cliente.data_nascimento = this.clientes[param_index].data_nascimento;
                this.form_cliente.numero_celular = this.clientes[param_index].numero_celular;
                this.form_cliente.senha = this.clientes[param_index].senha;
            },
            deleta_cliente: function (param_index, cpf) {
                    this.$http.get('http://localhost:4000/deletarpessoa/' + cpf)
                        .then(response => {
                            this.clientes.splice(param_index, 1);
                            //alert('Removeu com sucesso ' + response.data.cpf);
                        })
                        .catch(error => {
                            // error callback                                        
                            // alert('Erro ao remover ' + cpf + ': ' + error);
                            console.log(error);
                        });
            }
            
        },
        // fim do methods
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
            this.$http.get('http://localhost:4000/listarclientes')
                .then(response => {
                    for (let e of response.data) {
                        this.clientes.push({
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
                            data_ultima_visita: this.$options.filters.formataData(e.data_ultima_visita),
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
