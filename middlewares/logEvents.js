const {format} = require('date-fns');
const {v4: uuid} = require('uuid');

const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');



const logEvents = async (message)=>{
    const dateTime = `${format(new Date(), 'yyyy/MM/dd \t HH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    console.log(logItem);

    try {
        if(!fs.existsSync(path.join(__dirname,'..', 'logs'))){
            await fsPromises.mkdir(path.join(__dirname, '..',  'logs'));
        }
        await fsPromises.appendFile(path.join(__dirname,'..',  'logs', 'eventLog.txt'), logItem);
    } catch (error) {
        console.log(error);
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`);
    console.log(req.method, req.path);
    next();
}

module.exports = {logger, logEvents};