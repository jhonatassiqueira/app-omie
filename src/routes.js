require('dotenv').config();
const express = require('express');
const path = require('path')
const { writeJson } = require('./createJson')

const app = express();
const port = process.env.PORT ?? 3000

// VARIÁVEIS GLOBAIS
var now = new Date()
var newDate = now.getFullYear() +'-' +(now.getMonth()+1) +'-' +now.getDay() +'-' +now.getTime()


app.use(express.json());


app.post('/v1/webhooks/omie', (req, res) => {

    var valBody = Object.keys(req.body).length

    if(valBody === 0){
        return res.json('')
    }else{
        var fileNameLog = `${__dirname}/webhook/response/${newDate}.json`  
        writeJson({data: req.body, fileName: fileNameLog})
    
        return res.status(200).json(req.body)
    }

})


app.listen(port, () => console.log('Server is running on port ', port))