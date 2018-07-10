const Promise = require('bluebird')
const fs = require('fs')
const readFileAsync = Promise.promisify(fs.readFile)
const writeFileAsync = Promise.promisify(fs.writeFile)
const deleteFileAsync = Promise.promisify(fs.unlink)
const ursa = require('ursa')
const path = require('path')
const Magic = require('./magic_num')

// reading file under key-pairs folder
async function readAsync(type,fileName){
    const filePath = path.join(__dirname,'..','key-pairs',`${fileName}.${type}.pem`)
    return readFileAsync(filePath)
}

// create / overwriting file under key-pairs folder
async function overWriteFileAsync(fileName,content=''){
    const filePath = path.join(__dirname,'..','key-pairs',`${fileName}.pem`)
    return writeFileAsync(filePath,content)
}
async function createFileAsync(fileName){
    const filePath = path.join(__dirname,'..','key-pairs',`${fileName}.pem`)
    return writeFileAsync(filePath,'')
}

async function removeFileAsync(fileName){
    const filePath = path.join(__dirname,'..','key-pairs',`${fileName}.pem`)
    return deleteFileAsync(filePath)
}

async function generateKeys(){

   const MagicGen = new Magic()
   const magicNum = await MagicGen.generateMagicNumberAsync('sha256',16)
   // generate one-time access key-pairs
   const keys = ursa.generatePrivateKey(2048,65537)
   const privatePem = keys.toPrivatePem()
   const publicPem = keys.toPublicPem()
   const privateKeyName = `${magicNum}.private`
   const publicKeyName = `${magicNum}.public`
   try{
    await Promise.all([
        createFileAsync(privateKeyName),
        createFileAsync(publicKeyName),
    ])
    await Promise.all([
        overWriteFileAsync(privateKeyName,privatePem,'ascii'), 
        overWriteFileAsync(publicKeyName, publicPem, 'ascii')
    ])
   }catch(err){
       throw err
   }
}

async function fetchKey(type,fileName){
    if(type !== 'private' && type !== 'public'){
        throw new Error('type need to be either private or public')
    }
    const file = await readAsync(type,fileName)
    console.log(file.toString())
}






