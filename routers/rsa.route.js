const express = require('express')
const router = express.Router()
const {readAsync,generateKeys,removeFileAsync} = require('../lib/key-gen')
router.get('/generateMagicNumber',async(req,res,next)=> {
    try{
        const magicNum = await generateKeys()
        res.status(200).json({magic_token:magicNum})
    }catch(err){
        return next(err)
    }
})



module.exports = router