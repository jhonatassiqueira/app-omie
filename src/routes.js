require('dotenv').config();
const express = require('express');
const { SearchLinkOrderService, SearchInvoiceServices, SearchAccountReceive, SearchInformationClient } = require('./omie')
const { MessageText } = require('./digisac')

const app = express();

const port = process.env.PORT ?? 3000

app.use(express.json());


app.route('/v1/webhooks/new-service-invoice')
    .get((req, res) => res.json(''))
    .post(async(req, res) => {


        var valBody = Object.keys(req.body).length

        if(valBody === 0){
            return res.json('')
        }else{
            var idOrderService = await req.body.event.idOrdemServico
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
        
            return res.json({message: req.body})
        }
    })


app.listen(port, () => console.log('Server is running on port ', port))