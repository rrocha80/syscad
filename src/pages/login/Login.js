import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';


import Header from '../../components/Header';
import { history } from '../../history'



export default class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            message : this.props.location.state?this.props.location.state.message: '',
        };
    }

    signIn = () => {
        const data = { user: this.user, password: this.password };
        const requestInfo = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
        };

        fetch('http://localhost:9000/api-syscad/pessoa/auth', requestInfo)
        .then(response => {
            if(response.ok) {
                console.log('response: ', response)      
                return response.json()
            }
            throw new Error("Login inválido...");
        })
        .then(token => {
            console.log('token: ', token.password)
            localStorage.setItem('app-token', token.password);
            history.push('/pessoa')
            this.props.history.push("/pessoa");
            return;
        })
        .catch(e => {
            this.setState({ message: e.message });
        }); 
    }

    render() {
        return (
            <div className="col-md-6">
                <Header title="Login" />
                <hr  className="my-3"/>
                {
                    this.state.message !== ''? (
                        <Alert color="danger" className="text-center"> {this.state.message} </Alert>
                    ) : ''
                }
                <Form>
                    <FormGroup>
                        <Label for="usuario">Usuário</Label>
                        <Input type="text" id="usuario" onChange={e => this.user = e.target.value} placeholder="Informe o usuário..." />
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Senha</Label>
                        <Input type="password" id="password" onChange={e => this.password = e.target.value} placeholder="Informe a senha..." />
                    </FormGroup>
                    <Button color="primary" block onClick={this.signIn}> Entrar </Button>
                </Form>
            </div>
        );
    }
}