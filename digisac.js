require('dotenv').config()

function MessageText (telephone, message){
    fetch('https://livecontabilidade.digisac.chat/api/v1/messages', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' +process.env.DIGISAC_TOKEN,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "number": telephone,
            "serviceId": process.env.DIGISAC_SERVICE,
            "dontOpenTicket": true,
            "origin": "bot",
            "text": message
        }),
    })
    .then(res => res.json())
    .then(res => {
        console.log(res)
    })
    .catch(err => console.log('Mensagem não enviada!' +err))
}


module.exports = {
    MessageText
}