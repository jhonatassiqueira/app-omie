const { SearchLinkOrderService, SearchInvoiceServices, SearchAccountReceive, SearchInformationClient } = require('./omie')
const { MessageText } = require('./digisac')

        
async function SendMessageNewInvoice(idOrderService, codClient){
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

    return 'Mensagem enviada com sucesso!'
}

module.exports = {
    SendMessageNewInvoice
}