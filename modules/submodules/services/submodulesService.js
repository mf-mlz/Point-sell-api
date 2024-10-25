const submodulesRepository = require('../repositories/submodulesRepository');

const registerPermissions = (permission) => {
    return submodulesRepository.registerPermissions(permission);
};

const editPermissions = (permission) => {
    return submodulesRepository.editPermissions(permission);
};

const deletePermissions = (id, updated_at) => {
    return submodulesRepository.deletePermissions(id, updated_at);
};

const getSubModuleByIdModule = (idModule) => {
    return submodulesRepository.getSubModuleByIdModule(idModule);
};

const filterPermissions = (data) => {
    return submodulesRepository.filterPermissions(data);
};

const getPermissionsByRoleAndModule = (userSessionEncrypt) => {
    return submodulesRepository.getPermissionsByRoleAndModule(userSessionEncrypt);
};

const getModuleAccessByRole = (sessionEmployee) => {
    return submodulesRepository.getModuleAccessByRole(sessionEmployee);
};

module.exports = {
    registerPermissions,
    editPermissions,
    deletePermissions,
    getSubModuleByIdModule,
    filterPermissions,
    getPermissionsByRoleAndModule,
    getModuleAccessByRole
};