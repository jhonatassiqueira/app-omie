require('dotenv').config()

const PathURL = 'https://app.omie.com.br/api/v1'
const AppHeaders = {'Content-Type': 'application/json'}


// CONFIGURAÇÃO PADRÃO PARA TODAS AS CHAMADAS DA API PARA A OMIE
function AppFetch (endpoint, omieCall, omieParam){

    const resultAppFetch = fetch(PathURL + endpoint, {
        method: 'POST',
        headers: AppHeaders,
        body: JSON.stringify({
            'call': omieCall,
            'app_key': process.env.OMIE_KEY,
            'app_secret': process.env.OMIE_SECRET,
            'param': [omieParam]
        })
    })
    .then(res => res.json())
    .then(res => res)
    .catch(err => console.log(err))

    return resultAppFetch
}

async function SearchLinkOrderService(codOrderService){
    const resultSearchLinkOrderService = await AppFetch('/servicos/osdocs/', 'ObterOS', {
        "nIdOs": codOrderService
    })

    return resultSearchLinkOrderService
}

async function SearchInformationClient(idClient){
    const resultSearchInformationClient = await AppFetch('/geral/clientes/', 'ConsultarCliente', {
        "codigo_cliente_omie": idClient
    })

    return resultSearchInformationClient
}


async function ListInvoiceServicesOnPage (numberPage){
    const resultListInvoiceServices = await AppFetch('/servicos/nfse/', 'ListarNFSEs' , {
        "nPagina": numberPage,
        "nRegPorPagina": 500
    })

    return resultListInvoiceServices
}

async function SearchInvoiceServices (numberOrderService){
    var totalPages = await ListInvoiceServicesOnPage(1)
    var invoice = ""


    for(page = 1; page <= totalPages.nTotPaginas; page ++){
        var list = await ListInvoiceServicesOnPage(page)
        
        list.nfseEncontradas.forEach(item => {
            if(item.OrdemServico.nCodigoOS === numberOrderService){
                invoice = item
            }
        });
    }

    return invoice
}

async function ListAccountsReceive(numberPage){
    const resultListAccountReceive = await AppFetch('/financas/contareceber/', 'ListarContasReceber' , {
        "pagina": numberPage,
        "registros_por_pagina": 500,
        "apenas_importado_api": "N"
    })

    return resultListAccountReceive
}

async function SearchAccountReceive(numberOrderService){
    const totalPages = await ListAccountsReceive(1)
    var account = ""

    for(page = 1; page <= totalPages.total_de_paginas; page ++){
        var list = await ListAccountsReceive(page)

        list.conta_receber_cadastro.forEach(item => {
            if(item.nCodOS === numberOrderService){
                account = item
            }
        });
    }

    return account
}

module.exports = {
    SearchLinkOrderService,
    SearchInformationClient,
    SearchInvoiceServices,
    SearchAccountReceive
}