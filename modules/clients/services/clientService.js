const clientRepository = require('../repositories/clientRepository');

const getAllClients = () => {
    return clientRepository.getAllClients();
};


module.exports = {
    getAllClients
}