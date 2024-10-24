const permissionsRepository = require('../repositories/permissionsRepository');

const registerPermissions = (permission) => {
    return permissionsRepository.registerPermissions(permission);
};

const editPermissions = (permission) => {
    return permissionsRepository.editPermissions(permission);
};

const deletePermissions = (id, updated_at) => {
    return permissionsRepository.deletePermissions(id, updated_at);
};

const getAllPermissions = () => {
    return permissionsRepository.getAllPermissions();
};

const filterPermissions = (data) => {
    return permissionsRepository.filterPermissions(data);
};

const getPermissionsByRoleAndModule = (userSessionEncrypt) => {
    return permissionsRepository.getPermissionsByRoleAndModule(userSessionEncrypt);
};

const getModuleAccessByRole = (sessionEmployee) => {
    return permissionsRepository.getModuleAccessByRole(sessionEmployee);
};

module.exports = {
    registerPermissions,
    editPermissions,
    deletePermissions,
    getAllPermissions,
    filterPermissions,
    getPermissionsByRoleAndModule,
    getModuleAccessByRole
};