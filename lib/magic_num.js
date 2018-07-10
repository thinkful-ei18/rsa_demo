const Promise = require('bluebird')
const Crypto = Promise.promisifyAll(require('crypto'))

class MagicNumber{
    constructor(){
        this.counter = 0
        this.MAX_COUNTER = 9999
    }
    async generateMagicNumberAsync(algorithm, length){
        // error checking
        if(typeof algorithm !== 'string' || typeof length !== 'number'){
            throw new Error('parameters type no match')
        }
        let salt = null
        let result = null
        try{
            // get static random salt from Node build in crypto library with length
            salt = await this._getSaltAsync(length)
            const time = (new Date()).getTime()
            const raw = salt.toString('hex').concat(time)
            const shasum = Crypto.createHash(algorithm)
            shasum.update(raw)
            result = await shasum.digest('hex')
        }catch(err){
            throw err
        }
        result = result.concat(this.counter)
        this._increaseCounter()
        return result
    }
    
    async _getSaltAsync(length){
        return Crypto.randomBytes(length)
    }

    _increaseCounter(){
        if(this.counter < this.MAX_COUNTER){
            this.counter ++
        }else{
            this.counter = 0
        }
    }

    getCounter(){
        return this.counter
    }

    resetCounter(){
        this.counter = 0
    }
    
}

module.exports = MagicNumber



// const MagicShow = new MagicNumber()

// async function runTime(){
//     try{
//         for(let i = 0 ; i< 10; i ++){
//             MagicShow.generateMagicNumberAsync('sha256',16)
//         }
//     }
//     catch(err){
//         throw err
//     }
// }

// runTime()



