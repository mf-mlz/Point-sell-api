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

const editPermissionsAccess = (name, access) => {
    return permissionsRepository.editPermissionsAccess(name, access);
};

module.exports = {
    registerPermissions,
    editPermissions,
    editPermissionsAccess,
    deletePermissions,
    getAllPermissions,
    filterPermissions,
    getPermissionsByRoleAndModule,
    getModuleAccessByRole
};