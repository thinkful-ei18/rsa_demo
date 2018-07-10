const express = require('express')
const router = express.Router()
const Magic = require('../lib/magic_num')
const MagicNumber = new Magic()

const {fetchKeyAsync,generateKeys,removeFileAsync} = require('../lib/key-gen')
router.get('/generateMagicNumber',async(req,res,next)=> {
    try{
        const magicNum = await MagicNumber.generateMagicNumberAsync('sha256',16)
        res.status(200).json({magic_token:magicNum})
    }catch(err){
        return next(err)
    }
})

router.post('/access-public',async(req,res,next)=> {
    try{
        const {magicNum} = req.body
        if(!magicNum) throw new Error('access denied')
        await generateKeys(magicNum)
        const publicKey = (await fetchKeyAsync('public', magicNum)).toString()
        res.status(200).json({magic_token:magicNum, publicKey})
        
    }catch(err){
        if(err.message === 'access denied') err.status = 422
        return  next(err)
    }
})

router.post('/access-private',async(req,res,next)=> {
    try{
        // error handle
        const {magicNum} = req.body
        if(!magicNum) throw new Error('access denied')

        const privateKey = (await fetchKeyAsync('private', magicNum)).toString()
        //delete key-pairs from server
        await Promise.all([removeFileAsync(`${magicNum}.private`),removeFileAsync(`${magicNum}.public`)])
        res.status(200).json({privateKey})
        
    }catch(err){
        if(err.message === 'access denied') err.status = 422
        return  next(err)
    }
})



module.exports = router