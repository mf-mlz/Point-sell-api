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

const putClients = (data) => {
    return clientsRepository.putClients(data);
};

const deleteClient = (data) => {
    return clientsRepository.deleteClient(data);
};

module.exports = {
    registerClients,
    getAllClients, 
    getClient,
    putClients,
    deleteClient
}