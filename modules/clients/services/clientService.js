const clientRepository = require('../repositories/clientRepository');

exports.getAllClients = () => {
    return clientRepository.getAllClients();
};