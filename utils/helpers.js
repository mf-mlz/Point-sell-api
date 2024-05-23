const verifyData = (requiredFields, data) => {
    for (let field of requiredFields) {
        if (!data.hasOwnProperty(field) || data[field] === '' || data[field] === null || data[field] === undefined) {
            return field;
        }
    }
};

module.exports = {
    verifyData
};