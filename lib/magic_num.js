const Promise = require('bluebird')
const Crypto = Promise.promisifyAll(require('crypto'))
const fs = require('fs')
const readFileAsync = Promise.promisify(fs.readFile)
const writeFileAsync = Promise.promisify(fs.writeFile)
const path = require('path')

const MAX_COUNTER = Math.pow(2,53)
const counterFile = path.join(__dirname,'counter.txt')

const {HASHWORD} = require('../config')
/*=============================
    return counter number from counter file
============================= */
async function loadCounter(){
    counter = await readFileAsync(counterFile)
    return Number(counter)
}
/*=============================
  @params(magicNum)
    split magicNum into raw and counter
    hash raw string with environment stored hashword
    return hashed magic number
============================= */
async function magicNumberHashingAsync(magicNum){
    const [raw,counter] = magicNum.split(' ')
    const shasum = Crypto.createHash('sha256')
    shasum.update(raw + HASHWORD)
    const hash = (await shasum.digest('hex')).concat(counter)
    return hash
}

/*=============================
  generateMagicNumber will return xxxx xxx raw + counter
============================= */
async function generateMagicNumberAsync(algorithm, length){
    const counter = await loadCounter()
    // error checking
    if(typeof algorithm !== 'string' || typeof length !== 'number'){
        throw new Error('parameters type no match')
    }
    let salt = null
    let result = null
    try{
        // get static random salt from Node build in crypto library with length
        /*=============================
        salt + time + auto increment hashing to guarantee uniqueness
        ============================= */
        salt = await _getSaltAsync(length)
        const time = (new Date()).getTime()
        const raw = salt.toString('hex').concat(time) 
        result = `${raw} ${counter}`
    }catch(err){
        throw err
    }
    await _increaseCounter(counter)
    return result
}

async function _getSaltAsync(length){
    return Crypto.randomBytes(length)
}

async function _increaseCounter(counter){
    try{
        if(counter < MAX_COUNTER){
            await writeFileAsync(counterFile, ++counter)
        }else{
            await _resetCounter()
        }
    }catch(err){
        throw err
    }

}

async function _resetCounter(){
    try{
        await writeFileAsync(counterFile, 0)
    }catch(err){
        throw err
    }
}

// async function exc(){
    
//     const weirdNumber = await generateMagicNumberAsync('sha256',16)
//     const hash = await magicNumberHashingAsync(weirdNumber)

//     const promiseLands = []
//     for(let i =0; i< 10; i++){
//         promiseLands.push(magicNumberHashingAsync(weirdNumber))
//     }
//     Promise.all(promiseLands)
//         .then(data => console.log(data))
// }

// exc()
module.exports = {
    magicNumberHashingAsync,
    generateMagicNumberAsync
}






