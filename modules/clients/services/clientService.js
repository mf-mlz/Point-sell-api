const clientsRepository = require('../repositories/clientRepository');

const getAllClients = () => {
    return clientsRepository.getAllClients();
};

const getClient = (data) => {
    return clientsRepository.getClient(data);
};

module.exports = {
    getAllClients, 
    getClient
}