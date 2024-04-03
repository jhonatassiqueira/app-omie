const fs = require('fs')

const writeJson = ({data, fileName}) => {
    fs.writeFileSync(fileName, JSON.stringify(data))
}

module.exports = {
    writeJson
}