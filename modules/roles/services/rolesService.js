const rolesRepository = require('../repositories/rolesRepository');

const getRoles = () => {
    return rolesRepository.getRoles();
};

module.exports = {
    getRoles
};