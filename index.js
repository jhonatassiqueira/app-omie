require('dotenv').config();
const express = require('express');
const { SearchLinkOrderService, SearchInvoiceServices, SearchAccountReceive, SearchInformationClient } = require('./omie')
const { MessageText } = require('./digisac')

const app = express();

app.use(express.json());

app.use('/webhook/new-service-invoice', async (req, res) => {
    var idOrderService = req.body.event.idOrdemServico
    var codClient = req.body.event.idCliente
    var client = await SearchInformationClient(codClient)
    var nameClient = client.razao_social
    var linkOrderService = await SearchLinkOrderService(idOrderService)
    var linkOrderService = linkOrderService.cLinkPortal
    var invoice = await SearchInvoiceServices(idOrderService)
    var numberInvoice = invoice.Cabecalho.nNumeroNFSe
    var valueInvoice = invoice.Cabecalho.nValorNFSe.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})
    var account = await SearchAccountReceive(idOrderService)
    var dueDate = account.data_vencimento
    var numberTelefone = "+55" + client.telefone1_ddd + client.telefone1_numero


    var message = `
        Olá ${nameClient}!\n\nA nota fiscal ${numberInvoice} com vencimento em ${dueDate} no valor de ${valueInvoice} está disponível!\n\n*Clique no link para acessar a Nota Fiscal/Boleto*\n${linkOrderService}`

    MessageText(numberTelefone, message)

    console.log(message)


    res.send({
        "status": 200,
        "message": "Integration success!"
    })
})

app.use('/', (req, res) => {
    res.send('Servidor logado!')
})

app.listen(process.env.PORT, () => {
    console.log('servidor em execução');
})