const bcrypt = require('bcrypt');
/* Key ECDSA (ES256) */

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
        console.log("verifyPassword>>",plainPassword);
        if (valiInclude(plainPassword)) {
            return [result, true];
        } else {
            return [result, false];
        }
    } catch (err) {
        throw new Error('Error al verificar la contraseña Service');
    }
};

function valiInclude(cadena) {
    return cadena.includes(process.env.TEMP_PASS);
}

module.exports = {
    hashPassword,
    verifyPassword
};
