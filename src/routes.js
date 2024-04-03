require('dotenv').config();
const express = require('express');
const { SearchLinkOrderService, SearchInvoiceServices, SearchAccountReceive, SearchInformationClient } = require('./omie')
const { SendMessageNewInvoice } = require('./index')
const { MessageText } = require('./digisac')

const app = express();

const port = process.env.PORT ?? 3000

app.use(express.json());


app.route('/v1/webhooks/new-service-invoice')
    .get((req, res) => res.json(''))
    .post(async (req, res) => {
        const sendMessage = await SendMessageNewInvoice(req.body.event.idOrdemServico, req.body.event.idCliente)
        
        return res.json({message: sendMessage})
    })


app.listen(port, () => console.log('Server is running on port ', port))