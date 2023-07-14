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
            ultima_visita: ''
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
                this.form_cliente.ultima_visita = '';
            },
            inserir_pessoa: function (pessoa) {

                console.log(pessoa);
                this.$http.post('http://localhost:4000/inserirpessoa', pessoa)
                    .then(() => {
                        console.log('pessoa inserida')
                        console.log(response.data)
                        })
                    .catch(error => {
                        console.log('erro ao inserir pessoa');
                    });
            },
            inserir_cliente: function () {
                // faz uma cópia de cliente e transforma em objeto jquerry
                var cliente = jQuery.extend({}, this.form_cliente);
                //adiciona a propriedade "tipo", pra que no bd, o objeto seja inserido como cliente
                cliente.tipo = "cliente";
                // a condicional a seguir usa a função "some()", que procura se algum objeto do array
                //  possui aquela propriedade específica, para testar se algum cliente no array de clientes possui aquele cpf
                //  se retornar "false" indica que nenhum cliente possui aquele cpf, logo, se trata de um cliente novo
                if ((clientes.some(cliente => cliente.cpf === this.form_cliente.cpf) == false)) {
                    // chama a função "inserir pessoa" passando o objeto jquerry "cliente"
                    this.inserir_pessoa(cliente);
                    this.$http.post('http://localhost:4000/inserircliente', cliente)
                        .then(response => {
                            console.log(response.data);
                            response.data.data_cadastro = this.$options.filters.formataData(response.data.data_cadastro);
                            response.data.ultima_visita = this.$options.filters.formataData(response.data.ultima_visita);
                            response.data.data_nascimento = this.$options.filters.formataData(response.data.data_nascimento);
                            this.clientes.push(response.data);
                            console.log('cliente inserido');
                            this.limpar_form_cliente();
                            
                        })
                        .catch(error => {
                            alert('erro ao inserir');
                        });
                } else {

                    console.log("alterar cliente");
                    // console.log("caiu no else");
                    // this.$http.post('http://localhost:4000/updatepessoa/' + pessoa.id, pessoa)
                    //     .then(response => {
                    //         const pessoa_alterada = response.data;
                    //         pessoa_alterada.data_cadastro = this.$options.filters.formataData(pessoa_alterada.data_cadastro);
                    //         const index = this.pessoas.findIndex(item => item.id === pessoa_alterada.id);
                    //         if (index !== -1) { Vue.set(this.pessoas, index, pessoa_alterada); }
                    //         alert('Pessoa alterada ');

                    //     })
                    //     .catch(error => {
                    //         alert('Erro ao alterar a pessoa ' + error);
                    //     });
                }

            },
            editPessoa: function (param_index) {
                this.form_cliente.id = this.pessoas[param_index].id;
                this.form_cliente.tipo = this.pessoas[param_index].tipo;
                this.form_cliente.nome = this.pessoas[param_index].nome;
                this.form_cliente.cpf = this.pessoas[param_index].cpf;
                this.form_cliente.rg = this.pessoas[param_index].rg;
                this.form_cliente.email = this.pessoas[param_index].email;
                this.form_cliente.cep = this.pessoas[param_index].cep;
                this.form_cliente.endereco = this.pessoas[param_index].endereco;
                this.form_cliente.complemento = this.pessoas[param_index].complemento;
                this.form_cliente.data_cadastro = this.pessoas[param_index].data_cadastro;
                this.form_cliente.data_nascimento = this.pessoas[param_index].data_nascimento;
                this.form_cliente.numero_celular = this.pessoas[param_index].numero_celular;
                this.form_cliente.senha = this.pessoas[param_index].senha;
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
                            ultima_visita: this.$options.filters.formataData(e.data_ultima_visita),
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
