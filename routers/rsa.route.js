const express = require('express')
const router = express.Router()
const {generateMagicNumberAsync, magicNumberHashingAsync} = require('../lib/magic_num')

const {fetchPrivateKeyAsync,generateKeys} = require('../lib/key-gen')

/*=============================
    Any authentication process ?
============================= */
router.get('/public-key',async(req,res,next)=> {
    try{
        const magicNum = await generateMagicNumberAsync('sha256',16)
        if(!magicNum){
            const err = new Error('no magic num return ')
            err.status = 422
            throw err
        }
        const hashedMagicNum = await magicNumberHashingAsync(magicNum)
        const publicKey = await generateKeys(hashedMagicNum)
        res.status(200).json({magicNum,publicKey})
    }catch(err){
        return next(err)
    }
})


// How do I store parameters in headers?
/*=============================
   @headers:{magicNum}
   return privatekey
============================= */
router.get('/private-key',async(req,res,next)=> {
    try{
        // error handle
        const {magic_num} = req.headers
        if(!magic_num) throw new Error('access denied')
        const hashedMagicNum = await magicNumberHashingAsync(magic_num)
        const privateKey = await fetchPrivateKeyAsync(hashedMagicNum)
        console.log(privateKey)
        res.status(200).json({privateKey})
        
    }catch(err){
        if(err.message === 'access denied') err.status = 422
        return  next(err)
    }
})



module.exports = router