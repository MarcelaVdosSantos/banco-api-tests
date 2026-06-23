const request = require('supertest');
const { expect } = require('chai')
require('dotenv').config()
const { obterToken } = require('../helpers/autenticacao.js')
const postTransferencias = require('../fixtures/postTransferencias.json')

describe('Transferencias', () => {
    describe('POST /transferencias', () => {
        let token
         //capturar o token
        beforeEach( async () => {
            token = await obterToken('julio.lima', '123456') 
        })

        it('Deve retornar sucesso com 201 quando o valor da transferência for acima ou igual a R$10,00', async () => {
             // esta clonando o json de transferências, pois o preenchimento é diferente, porém apenas no primeiro nível subniveis não seriam clonados
            const bodyTransferencias = { ...postTransferencias }

            const resposta = await request('http://localhost:3000')
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)  //'Bearer ' + token são iguais `Bearer ${token}` (é uma crase e não aspas simples)
                .send(bodyTransferencias)

                expect(resposta.status).to.equal(201);

                console.log(resposta.body)
        })

        it('Deve retornar 422 quando o valor da transferência for abaixo de R$10,00', async () => {
            const bodyTransferencias = { ...postTransferencias }
            bodyTransferencias.valor = 7

            const resposta = await request('http://localhost:3000')
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)  //'Bearer ' + token são iguais `Bearer ${token}` (é uma crase e não aspas simples)
                .send(bodyTransferencias)

                expect(resposta.status).to.equal(422);

                console.log(resposta.body)

        })
    })
})