const verifyData = (requiredFields, data) => {
    for (let field of requiredFields) {
        if (!data.hasOwnProperty(field) || data[field] === '' || data[field] === null || data[field] === undefined) {
            return field;
        }
    }
};

const createUpdatetAt = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
    const microseconds = milliseconds + '000';

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${microseconds}`;
}

const createUpdatetAtShort = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

module.exports = {
    verifyData,
    createUpdatetAt,
    createUpdatetAtShort
};