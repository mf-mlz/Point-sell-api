const clientsRepository = require('../repositories/clientRepository');

const registerClients = (client) => {
    return clientsRepository.registerClients(client);
};

const getAllClients = () => {
    return clientsRepository.getAllClients();
};

const getClient = (data) => {
    return clientsRepository.getClient(data);
};

module.exports = {
    registerClients,
    getAllClients, 
    getClient
}