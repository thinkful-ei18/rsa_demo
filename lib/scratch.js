const Promise = require('bluebird')
const Crypto = Promise.promisifyAll(require('crypto'))
async function test(){
    const shasum = Crypto.createHash('sha256')
    shasum.update('some thing need to be hidden')
    const number = await shasum.digest('hex')
    console.log(number)
}

test()
test()