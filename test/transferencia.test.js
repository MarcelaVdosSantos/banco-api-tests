const request = require('supertest');
const { expect } = require('chai')

describe('Transferencias', () => {
    describe('POST /transferencias', () => {
        it('Deve retornar sucesso com 201 quando o valor da transferência for acima ou igual a R$10,00', async () => {
            //capturar o token
            const respostaLogin = await request('http://localhost:3000')
                    .post('/login')
                    .set('Content-Type', 'application/json')
                    .send({
                       'username': 'julio.lima',
                       'senha': '123456'
                    })
             
            const token = respostaLogin.body.token        

            const resposta = await request('http://localhost:3000')
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)  //'Bearer ' + token são iguais `Bearer ${token}` (é uma crase e não aspas simples)
                .send({
                    contaOrigem: 1,
                    contaDestino: 2,
                    valor: 11,
                    token: ""
                })

                expect(resposta.status).to.equal(201);

                console.log(resposta.body)
        })

        it('Deve retornar 422 quando o valor da transferência for abaixo de R$10,00', async () => {
             //capturar o token
            const respostaLogin = await request('http://localhost:3000')
                    .post('/login')
                    .set('Content-Type', 'application/json')
                    .send({
                       'username': 'julio.lima',
                       'senha': '123456'
                    })
             
            const token = respostaLogin.body.token        

            const resposta = await request('http://localhost:3000')
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)  //'Bearer ' + token são iguais `Bearer ${token}` (é uma crase e não aspas simples)
                .send({
                    contaOrigem: 1,
                    contaDestino: 2,
                    valor: 7,
                    token: ""
                })

                expect(resposta.status).to.equal(422);

                console.log(resposta.body)

        })
    })
})