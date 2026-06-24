const request = require('supertest');
const { expect } = require('chai')
require('dotenv').config()
const { obterToken } = require('../helpers/autenticacao.js')
const postTransferencias = require('../fixtures/postTransferencias.json')

describe('Transferencias', () => {
    let token
    //capturar o token
        beforeEach( async () => {
            token = await obterToken('julio.lima', '123456') 
        })

    describe('POST /transferencias', () => {
        it('Deve retornar sucesso com 201 quando o valor da transferência for acima ou igual a R$10,00', async () => {
             // esta clonando o json de transferências, pois o preenchimento é diferente, porém apenas no primeiro nível subniveis não seriam clonados
            const bodyTransferencias = { ...postTransferencias }

            const resposta = await request(process.env.BASE_URL)
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

            const resposta = await request(process.env.BASE_URL)
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)  //'Bearer ' + token são iguais `Bearer ${token}` (é uma crase e não aspas simples)
                .send(bodyTransferencias)

                expect(resposta.status).to.equal(422);

                console.log(resposta.body)

        })
    })

    describe('GET /transferencias/{id}', () =>{
        it('Deve retprnar sucesso com 200 e dados iguais ao registro de transaferência contido no BD quando o ID for válido', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/transferencias/7')
                .set('Authorization', `Bearer ${token}`)

            //console.log(resposta.status)
            //console.log(resposta.body)
            expect(resposta.status).to.equal(200)
            expect(resposta.body.id).to.equal(7)
            expect(resposta.body.id).to.be.a('number')
            expect(resposta.body.conta_origem_id).to.equal(1)
            expect(resposta.body.conta_destino_id).to.equal(2)
            expect(resposta.body.valor).to.equal('10.00')
        })

    })

    describe('GET /transferencias', () => {
        it('Deve retornar 10 elementos na paginação quando informar limite de 10 registros', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/transferencias?page=1&limit=10')
                .set('Authorization', `Bearer ${token}`)

            //console.log(resposta.body)
            expect(resposta.status).to.equal(200)
            expect(resposta.body.limit).to.equal(10)
            expect(resposta.body.transferencias).to.have.lengthOf(10)
        })
    })
})