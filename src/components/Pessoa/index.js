import React, { Component } from 'react';
import PubSub from 'pubsub-js';

import {
    Table,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    Alert
} from 'reactstrap';

class FormPessoa extends Component {

    state = {
        model: { id: 0, nome: '', dataNascimento: '', sexo: '', email: '', cpf: '', naturalidade: '', nacionalidade: '' }
    };

    setValues = (e, field) => {
        const { model } = this.state;
        model[field] = e.target.value;
        this.setState({ model });
    }

    create = () => {

        this.setState({
            model: {
                id: 0, nome: '', dataNascimento: '', sexo: '', email: '', cpf: '', naturalidade: '', nacionalidade: ''
            }
        })
        this.props.pessoaCreate(this.state.model);

    }

    componentWillMount() {
        PubSub.subscribe('edit-pessoa', (topic, pessoa) => {
            this.setState({ model: pessoa });
        });
    }

    render() {
        return (
            <Form>
                <FormGroup>
                    <Label for="nome">Nome:</Label>
                    <Input id="nome" type="text" value={this.state.model.nome} placeholder="nome"
                        onChange={e => this.setValues(e, 'nome')} />

                    <Label for="dataNascimento">Data de Nascimento:</Label>
                    <Input id="dataNascimento" type="date" value={this.state.model.dataNascimento} placeholder="data de nascimento"
                        onChange={e => this.setValues(e, 'dataNascimento')} />

                    <Label for="sexo">Sexo:</Label>
                    <Input id="sexo" type="text" value={this.state.model.sexo} placeholder="sexo"
                        onChange={e => this.setValues(e, 'sexo')} />

                    <Label for="email">e-mail:</Label>
                    <Input id="email" type="text" value={this.state.model.email} placeholder="email"
                        onChange={e => this.setValues(e, 'email')} />

                    <Label for="cpf">CPF:</Label>
                    <Input id="cpf" type="text" value={this.state.model.cpf} placeholder="cpf"
                        onChange={e => this.setValues(e, 'cpf')} />

                    <Label for="naturalidade">Naturalidade:</Label>
                    <Input id="naturalidade" type="text" value={this.state.model.naturalidade} placeholder="naturalidade"
                        onChange={e => this.setValues(e, 'naturalidade')} />

                    <Label for="nacionalidade">Nacionalidade:</Label>
                    <Input id="nacionalidade" type="text" value={this.state.model.nacionalidade} placeholder="nacionalidade"
                        onChange={e => this.setValues(e, 'nacionalidade')} />
                </FormGroup>

                <Button color="primary" block onClick={this.create} > Gravar </Button>

            </Form>

        );
    }
}

class BuscarPessoa extends Component {
    state = {
        model: { cpf: '' }
    };

    setValues = (e, field) => {
        const { model } = this.state;
        model[field] = e.target.value;
        this.setState({ model });
    }

    buscar = () => {

        this.setState({
            model: {
                id: null, nome: null, dataNascimento: null, sexo: null, email: null, cpf: '', naturalidade: null, nacionalidade: null
            }
        })
        this.props.pessoaBuscar(this.state.model);

    }

    render() {
        return (
            <Form>
                <Label for="cpfBuscar">CPF:</Label>
                <Input id="cpf" type="text" value={this.state.model.cpf} placeholder="cpf"
                    onChange={e => this.setValues(e, 'cpf')} />

                <Button color="primary" block onClickCapture={this.buscar} > Buscar </Button>

            </Form >
        );
    }
}

class ListPessoa extends Component {
    delete = (id) => {
        this.props.deletePessoa(id);
    }

    onEdit = (pessoa) => {
        PubSub.publish('edit-pessoa', pessoa);
    }

    render() {
        const { pessoas } = this.props;
        return (

            <Table className="table-bordered text-center">
                <thead className="thead-dark">
                    <tr>
                        <th>Nome</th>
                        <th>Sexo</th>
                        <th>e-mail</th>
                        <th>CPF</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        pessoas.map(pessoa => (
                            <tr key={pessoa.id}>
                                <td>{pessoa.nome}</td>
                                <td>{pessoa.sexo}</td>
                                <td>{pessoa.email}</td>
                                <td>{pessoa.cpf}</td>
                                <td>
                                    <Button color="info" size="sm" onClick={e => this.onEdit(pessoa)}>Editar</Button>
                                    <Button color="danger" size="sm" onClick={e => this.delete(pessoa.id)}>Deletar</Button>
                                </td>

                            </tr>
                        ))
                    }

                </tbody>

            </Table>
        );
    }

}

export default class PessoaBox extends Component {
    Url = 'http://localhost:9000/api-syscad/';

    state = {
        pessoas: [],
        message: {
            text: '',
            alert: ''
        }
    }

    componentDidMount() {
        this.refreshUserTable();

    }

    save = (pessoa) => {
        let data = {
            id: parseInt(pessoa.id),
            nome: pessoa.nome,
            dataNascimento: pessoa.dataNascimento,
            sexo: pessoa.sexo,
            email: pessoa.email,
            cpf: pessoa.cpf,
            naturalidade: pessoa.naturalidade,
            nacionalidade: pessoa.nacionalidade,
        };

        const requestInfo = {
            method: data.id === 0 ? 'POST' : 'PUT',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Sec-Fetch-Mode': 'cors',
                'Authorization': 'Basic ' + localStorage.getItem('app-token')
            },
            body: JSON.stringify(data)

        };



        if (data.id === 0) {
            fetch(this.Url + 'pessoa/adicionar', requestInfo)
                .then(response =>
                    response.json()
                )
                .then(json => {
                    if (json.hasOwnProperty("message")) {
                        throw Error(json.message);
                    }
                })
                .then(newPessoa => {
                    let { pessoas } = this.state;
                    this.setState({ pessoas, message: { text: 'Registro adicionado com sucesso!', alert: 'success' } });
                    this.timerMessage(3000);
                    this.refreshUserTable();
                })
                .catch(e => {
                    console.log(e);
                    this.setState({ message: { text: e.message, alert: 'danger' } })
                });
        } else {
            fetch(`${this.Url}pessoa/atualizar/${data.id}`, requestInfo)
                .then(response => response.json())
                .then(json => {
                    if (json.hasOwnProperty("message")) {
                        throw Error(json.message);
                    }
                })
                .then(updatedPessoa => {
                    let { pessoas } = this.state;
                    this.setState({ pessoas, message: { text: 'Registro atualizado com sucesso!', alert: 'info' } });
                    this.timerMessage(3000);
                    this.refreshUserTable();
                })
                .catch(e => {
                    this.setState({ message: { text: e.message, alert: 'danger' } })
                    this.refreshUserTable();
                });
        }
    }

    delete = (id) => {
        const requestInfo = {
            method: 'DELETE',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Sec-Fetch-Mode': 'cors',
                'Authorization': 'Basic ' + localStorage.getItem('app-token')
            }

        };
        fetch(`${this.Url}pessoa/deletar/${id}`, requestInfo)
            .then(response => response.text)
            .then(rows => {
                const pessoas = this.state.pessoas.filter(pessoa => pessoa.id === id);
                this.setState({ pessoas, message: { text: 'Registro Removido com sucesso.', alert: 'danger' } });
                this.timerMessage(3000);
                this.refreshUserTable();

            })
            .catch(e => console.log(e));
    }

    buscar = (pessoa) => {
        console.log('eitx');
        let data = {
            id: null,
            nome: null,
            dataNascimento: null,
            sexo: null,
            email: null,
            cpf: pessoa.cpf,
            naturalidade: null,
            nacionalidade: null,
        };

        const requestInfo = {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Sec-Fetch-Mode': 'cors',
                'Authorization': 'Basic ' + localStorage.getItem('app-token')
            },
            body: JSON.stringify(data)

        };

        console.log('CPF: ', requestInfo)
        fetch(this.Url + 'pessoa/pesquisar', requestInfo)
            //.then(this.refreshUserTable())
            .catch(e => console.log(e));
    }

    timerMessage = (duration) => {
        setTimeout(() => {
            this.setState({ message: { text: '', alert: '' } });
        }, duration);
    }

    refreshUserTable() {
        const requestInfo = {
            method: 'GET',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Sec-Fetch-Mode': 'cors',
                'Authorization': 'Basic ' + localStorage.getItem('app-token')
            },
        };

        fetch(this.Url + 'pessoa/listar_todos', requestInfo)
            .then(response => response.json())
            .then(pessoas => this.setState({ pessoas }))
            .catch(e => console.log(e));
    }

    render() {
        return (
            <div>
                {
                    this.state.message.text !== '' ? (
                        <Alert color={this.state.message.alert} className="text-center"> {this.state.message.text} </Alert>
                    ) : ''
                }

                <div className="row">

                    <div className="col-md-6 my-3">
                        <h2 className="font-weight-bold text-center"> Cadastro de Pessoas </h2>
                        <FormPessoa pessoaCreate={this.save} />
                    </div>

                    <div className="col-md-6 my-3">
                        <h2 className="font-weight-bold text-center"> Pesquisar </h2>
                        <BuscarPessoa pessoaBuscar={this.buscar} />

                        <h2 className="font-weight-bold text-center"> Lista de Pessoas </h2>
                        <ListPessoa pessoas={this.state.pessoas} deletePessoa={this.delete} />
                    </div>
                </div>
            </div>
        );
    }

}