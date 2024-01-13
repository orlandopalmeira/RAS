var fs = require('fs');

class Logger {

    constructor(timestamp,info){
        this.time = timestamp
        this.log = info
    }

    addLog() {
        try {
            fs.appendFileSync('log.txt', this.time+"***"+this.log+";\n");
        }catch(err){
            console.log("couldn't log due to "+err)
        }
    }
}

module.exports.Logger = Logger;
