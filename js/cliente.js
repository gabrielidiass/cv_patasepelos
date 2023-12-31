
$(document).ready(function () {
    var cliente_popup = [];
  var editando = false;
  var cpf_original;
    var clientes = [];
    var dados = {
        sobrepor: false,
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
        },
        "cliente_popup": cliente_popup,

    }
    
    Vue.prototype.$http = axios;
    Vue.use(window.vuelidate.default);
    Vue.use(window.VueMask.default)
    const {
        required,
        minLength,
        minValue,
        maxLength,
    } = window.validators

    new Vue({
        el: '#app',
        data: dados,
       
        validations: {
            form_cliente: {

                nome: {
                    required,
                    minLength: minLength(4)
                },
                cpf: {
                    required,
                    minLength: minLength(14),
                    maxLength: maxLength(14)
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
                    maxLength: maxLength(19),
                    minLength: minLength(19)
                },
                email: {
                    maxLength: maxLength(100)
                },
                senha: {
                    required,
                    minLength: minLength(4)
                },
                data_ultima_visita: {}
            }
        },
        
        methods: {
            abrirPopup: function () { document.getElementById("popupOverlay").style.display = "block"; },
            fecharPopup: function () { document.getElementById("popupOverlay").style.display = "none"; },
            status(validation) {
                return {
                    error: validation.$error,
                    dirty: validation.$dirty
                }
            },
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
                            alert('erro ao inserir pessoa' + error);
                            reject("erro ao inserir pessoa");
                        });

                })


            },

            alterar_pessoa: async function (pessoa) {
                return new Promise((resolve, reject) => {

                    try {
                        this.$http.post('http://localhost:4000/alterarpessoa/' + pessoa.cpf_original, pessoa)
                            .then(response => {
                                resolve(response.data);
                            })
                            .catch(error => {
                                reject(alert('Erro ao alterar a pessoa ' + error));
                            });
                    } catch (error) {
                        console.error("Erro ao executar a chamada assíncrona:", error);
                    }
                })
            },
            mostrar_cliente: async function (param_index, cpf) {
                try {
                    const response = await this.$http.get('http://localhost:4000/mostrarcliente/' + cpf)
                    const cliente = response.data[0];
                    this.cliente_popup = cliente;
                    this.abrirPopup();
                  
                } catch (error) {
                    console.error("Erro ao mostrar o cliente:", error);
                    alert('Erro ao mostrar o cliente: ' + error);
                }


            },
            inserir_cliente: async function ($v) {
                if ($v.$invalid) {
                    alert("preencha o formulario corretamente")
                }
                else {
                    
                    var cliente = jQuery.extend({}, this.form_cliente);
                    cliente.tipo = "cliente";
                    cliente.cpf_original = cpf_original;
                    console.log(cpf_original);
                    if ((!editando)) {
                        try {
                            // documentação do some(): https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/some
                            var objeto_pessoa = await this.inserir_pessoa(cliente);
                            var objeto_cliente = await this.$http.post('http://localhost:4000/inserircliente', cliente)
                                .then(response => {
                                    objeto_cliente = response.data;
                                    alert('cliente inserido');
                                })
                                .catch(error => { alert('erro ao inserir' + error); })


                            var objeto_final = $.extend({}, objeto_cliente, objeto_pessoa);

                            objeto_final.data_cadastro = this.$options.filters.formataData(objeto_final.data_cadastro);
                            objeto_final.data_ultima_visita = this.$options.filters.formataData(objeto_final.data_ultima_visita);
                            objeto_final.data_nascimento = this.$options.filters.formataData(objeto_final.data_nascimento);

                            this.clientes.push(objeto_final);
                        } catch (error) { alert(error.message); }


                    } else {
                        try {
                            this.form_cliente.data_cadastro = cliente.data_cadastro;
                            var pessoa_alterada = await this.alterar_pessoa(cliente);
                            var cliente_alterado = await new Promise((resolve, reject) => {
                                this.$http.post('http://localhost:4000/alterarcliente/' + cliente.cpf_original, cliente)
                                    .then(response => {
                                        resolve(cliente_alterado = response.data);
                                        alert('cliente alterado');
                                    })
                                    .catch(error => {
                                        reject(alert('Erro ao alterar a cliente ' + error));
                                    });
                            }
                            )
                          
                            var alteracao_final = $.extend({}, cliente_alterado, pessoa_alterada);

                            // aqui mescla cliente alterado e pessoa alterada pra incluir no vetor
                            const index = this.clientes.findIndex(item => item.cpf === cliente.cpf_original);
                            if (index !== -1) { Vue.set(this.clientes, index, alteracao_final); }
                            alert('cliente alterado ');
                        } catch (error) { alert(error.message); }
                    }








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
                this.form_cliente.data_ultima_visita = this.clientes[param_index].data_ultima_visita;
                this.form_cliente.numero_celular = this.clientes[param_index].numero_celular;
                this.form_cliente.senha = this.clientes[param_index].senha;
                this.form_cliente.data_cadastro = this.clientes[param_index].data_cadastro;
                editando = true;
                cpf_original = this.clientes[param_index].cpf;
            },
            deleta_cliente: function (param_index, cpf) {
                this.$http.get('http://localhost:4000/deletarpessoa/' + cpf)
                    .then(
                        this.clientes.splice(param_index, 1))
                    .catch(error => {
                        // error callback                                        
                        alert('Erro ao remover ' + cpf + ': ' + error);
                        alert(error);
                    });
            }

        },
        filters: {
            formataData: function (value) {
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
                    alert(response);
                });

        }
    })
})
