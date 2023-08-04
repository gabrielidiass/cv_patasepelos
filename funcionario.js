
$(document).ready(function () {
    var funcionario_popup = [];

    var funcionarios = [];
    var dados = {
        sobrepor: false,
        "funcionarios": funcionarios,
        "form_funcionario": {
            nome: '',
            cargo: '',
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
            numero_pis: '',
            numero_ctps: ''
        },
        "funcionario_popup": funcionario_popup,

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
            form_funcionario: {

                nome: {
                    required,
                    minLength: minLength(4)
                },
                cargo: {
                    required
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
                numero_ctps: {
                    required
                },
                numero_pis: {
                    required
                }
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
            limpar_form_funcionario: function () {
                this.form_funcionario.nome = '';
                this.form_funcionario.cargo = '';
                this.form_funcionario.cpf = '';
                this.form_funcionario.rg = '';
                this.form_funcionario.email = '';
                this.form_funcionario.cep = '';
                this.form_funcionario.endereco = '';
                this.form_funcionario.complemento = '';
                this.form_funcionario.data_nascimento = '';
                this.form_funcionario.numero_celular = '';
                this.form_funcionario.senha = '';
                this.form_funcionario.numero_ctps = '';
                this.form_funcionario.numero_pis = '';
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
                        this.$http.post('http://localhost:4000/alterarpessoa/' + pessoa.cpf, pessoa)
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
            mostrar_funcionario: async function (param_index, cpf) {
                try {
                    const response = await this.$http.get('http://localhost:4000/mostrarfuncionario/' + cpf)
                    const funcionario = response.data[0];
                    this.funcionario_popup = funcionario;
                    this.abrirPopup();

                } catch (error) {
                    console.error("Erro ao mostrar o funcionario:", error);
                    alert('Erro ao mostrar o funcionario: ' + error);
                }


            },
            inserir_funcionario: async function ($v) {
                if ($v.$invalid) {
                    alert("preencha o formulario corretamente")
                }
                else {

                    var funcionario = jQuery.extend({}, this.form_funcionario);
                    funcionario.tipo = "funcionario";

                    if ((funcionarios.some(funcionario => funcionario.cpf === this.form_funcionario.cpf) == false)) {
                        try {
                            // documentação do some(): https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/some
                            var objeto_pessoa = await this.inserir_pessoa(funcionario);
                            var objeto_funcionario = await this.$http.post('http://localhost:4000/inserirfuncionario', funcionario)
                                .then(response => {
                                    alert('funcionario inserido');
                                    return response.data;
                                })
                                .catch(error => { alert('erro ao inserir' + error); })
                            console.log(objeto_funcionario);

                            var objeto_final = $.extend({}, objeto_funcionario, objeto_pessoa);


                            objeto_final.data_cadastro = this.$options.filters.formataData(objeto_final.data_cadastro);
                            objeto_final.data_nascimento = this.$options.filters.formataData(objeto_final.data_nascimento);
                            this.funcionarios.push(objeto_final);
                        } catch (error) { alert(error.message); }


                    } else {
                        try {
                            this.form_funcionario.data_cadastro = funcionario.data_cadastro;
                            var pessoa_alterada = await this.alterar_pessoa(funcionario);
                            var funcionario_alterado = await new Promise((resolve, reject) => {
                                this.$http.post('http://localhost:4000/alterarfuncionario/' + funcionario.cpf, funcionario)
                                    .then(response => {
                                        resolve(funcionario_alterado = response.data);
                                        alert('funcionario alterado');
                                    })
                                    .catch(error => {
                                        reject(alert('Erro ao alterar a funcionario ' + error));
                                    });
                            }
                            )

                            var alteracao_final = $.extend({}, funcionario_alterado, pessoa_alterada);

                            // aqui mescla funcionario alterado e pessoa alterada pra incluir no vetor
                            const index = this.funcionarios.findIndex(item => item.cpf === alteracao_final.cpf);
                            if (index !== -1) { Vue.set(this.funcionarios, index, alteracao_final); }
                            alert('funcionario alterado ');
                        } catch (error) { alert(error.message); }
                    }








                }
            },
            edita_funcionario: function (param_index) {
                this.form_funcionario.tipo = this.funcionarios[param_index].tipo;
                this.form_funcionario.nome = this.funcionarios[param_index].nome;
                this.form_funcionario.cargo = this.funcionarios[param_index].cargo;
                this.form_funcionario.cpf = this.funcionarios[param_index].cpf;
                this.form_funcionario.rg = this.funcionarios[param_index].rg;
                this.form_funcionario.email = this.funcionarios[param_index].email;
                this.form_funcionario.cep = this.funcionarios[param_index].cep;
                this.form_funcionario.endereco = this.funcionarios[param_index].endereco;
                this.form_funcionario.numero_pis = this.funcionarios[param_index].numero_pis;
                this.form_funcionario.numero_ctps = this.funcionarios[param_index].numero_ctps;
                this.form_funcionario.complemento = this.funcionarios[param_index].complemento;
                this.form_funcionario.data_nascimento = this.funcionarios[param_index].data_nascimento;
                this.form_funcionario.data_ultima_visita = this.funcionarios[param_index].data_ultima_visita;
                this.form_funcionario.numero_celular = this.funcionarios[param_index].numero_celular;
                this.form_funcionario.senha = this.funcionarios[param_index].senha;
                this.form_funcionario.data_cadastro = this.funcionarios[param_index].data_cadastro;
                editando = true;
            },
            deleta_funcionario: function (param_index, cpf) {
                this.$http.get('http://localhost:4000/deletarpessoa/' + cpf)
                    .then(
                        this.funcionarios.splice(param_index, 1))
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
            this.$http.get('http://localhost:4000/listarfuncionarios')
                .then(response => {
                    for (let e of response.data) {
                        this.funcionarios.push({
                            nome: e.nome,
                            cargo: e.cargo,
                            cpf: e.cpf,
                            rg: e.rg,
                            email: e.email,
                            cep: e.cep,
                            endereco: e.endereco,
                            complemento: e.complemento,
                            data_cadastro: this.$options.filters.formataData(e.data_cadastro),
                            data_nascimento: this.$options.filters.formataData(e.data_nascimento),
                            numero_celular: e.numero_celular,
                            numero_ctps: e.numero_ctps,
                            numero_pis: e.numero_pis,
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
