const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const fs = require('fs');
const path = require('path');
const { createUpdatetAtShort } = require('../utils/helpers');
const requestIp = require('request-ip');

const projectRoot = path.resolve(__dirname, '../');
const logDirectory = path.join(projectRoot, 'logs');


const generateLogFileName = () => {

    if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory, { recursive: true });
    }
    const currentDate = createUpdatetAtShort();
    const nameFile = `${currentDate}.log`;
    const logFilePath = path.join(logDirectory, nameFile);

    if (!fs.existsSync(logFilePath)) {
        try {
            fs.writeFileSync(logFilePath, '');
        } catch (err) {
            return err;
        }
    }

    return nameFile;
};


const accessLogStream = rfs.createStream(generateLogFileName, {
    size: "300M",
    interval: '1d',
    path: logDirectory
});

const logFormat = `:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"`;

const requestLogger = morgan(logFormat, {
    stream: accessLogStream,
    immediate: true,
    format: (tokens, req, res) => {
        const clientIp = req.ip || req.connection.remoteAddress || req._remoteAddress || '-';
        return `${clientIp} - ${tokens['remote-user'] || '-'} [${tokens.date(req, res, 'clf')}] "${tokens.method(req, res)} ${tokens.url(req, res)} HTTP/${tokens['http-version'](req, res)}" ${tokens.status(req, res)} ${tokens.res(req, res, 'content-length') || '-'} "${tokens.referrer(req, res) || '-'}" "${tokens['user-agent'](req, res) || '-'}"`;
    }
});

module.exports = {
    requestLogger
};
