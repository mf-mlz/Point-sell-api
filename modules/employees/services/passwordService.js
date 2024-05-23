const bcrypt = require('bcrypt');

const hashPassword = async (plainPassword) => {
    const saltRounds = 10;
    try {
        const hash = await bcrypt.hash(plainPassword, saltRounds);
        return hash;
    } catch (err) {
        throw new Error('Error al crear el hash');
    }
};

const verifyPassword = async (plainPassword, storedHash) => {
    try {
        const result = await bcrypt.compare(plainPassword, storedHash);
        return result;
    } catch (err) {
        throw new Error('Error al verificar la contraseña Service');
    }
};

module.exports = {
    hashPassword,
    verifyPassword
};
