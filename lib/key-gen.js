const Promise = require('bluebird')
const fs = require('fs')
const readFileAsync = Promise.promisify(fs.readFile)
const writeFileAsync = Promise.promisify(fs.writeFile)
const deleteFileAsync = Promise.promisify(fs.unlink)
const ursa = require('ursa')
const path = require('path')
// reading file under key-pairs folder
async function _readAsync(type,magicNumber){
    const filePath = path.join(__dirname,'..','key-pairs',`${magicNumber}.${type}.pem`)
    return readFileAsync(filePath)
}

// create / overwriting file under key-pairs folder
async function _overWriteFileAsync(fileName,content=''){
    const filePath = path.join(__dirname,'..','key-pairs',`${fileName}.pem`)
    return writeFileAsync(filePath,content)
}

async function _removeFileAsync(type,fileName){
    const filePath = path.join(__dirname,'..','key-pairs',`${fileName}.${type}.pem`)
    return deleteFileAsync(filePath)
}

/*=============================
    @params(magicNum)
    store privatekey
    return publickey
============================= */
async function generateKeys(magicNum){

   try{
    // generate key-pairs
    const keys = ursa.generatePrivateKey(2048,65537)
    const privatePem = keys.toPrivatePem()
    const publicPem = keys.toPublicPem()
    const privateKeyName = `${magicNum}.private`
    await _overWriteFileAsync(privateKeyName,privatePem,'ascii')
    return publicPem.toString()

   }catch(err){
       throw err
   }
}

async function fetchPrivateKeyAsync(fileName){
    if(typeof fileName !== 'string'){
        throw new Error('file name need to be string')
    }
    try{
        const privateKey = await _readAsync('private',fileName)
        await _removeFileAsync('private',fileName)
        return privateKey.toString()
        
    }catch(err){
        throw err
    }
}


module.exports = {
    generateKeys,fetchPrivateKeyAsync
}








