const connection = require("../../../config/database");
const { decryptCrypt, encryptCrypt } = require("../../../utils/crypto-js");

const registerPermissions = (permission) => {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO roles_permissions(role_id, module, permissions) VALUES (?,?,?)";
    const values = [
      permission.role_id,
      permission.module,
      permission.permissions,
    ];

    connection.query(query, values, (error, results) => {
      if (error) return reject("Ocurrió un error al Registrar el Permiso");
      resolve("Permiso Registrado Correctamente");
    });
  });
};

const editPermissions = (permission) => {
  return new Promise((resolve, reject) => {
    const query =
      "UPDATE roles_permissions SET role_id=? , module=? , permissions=?, updated_at=?  WHERE id=?";
    const values = [
      permission.role_id,
      permission.module,
      permission.permissions,
      permission.updated_at,
      permission.id,
    ];

    connection.query(query, values, (error, results) => {
      if (error) return reject("Ocurrió un error al Editar el Permiso");
      resolve("Permiso Editado Correctamente");
    });
  });
};

const deletePermissions = (id, updated_at) => {
  return new Promise((resolve, reject) => {
    const query =
      "UPDATE roles_permissions SET status='Deleted', updated_at=?  WHERE id=?";
    const values = [updated_at, id];

    connection.query(query, values, (error, results) => {
      if (error) return reject("Ocurrió un error al Eliminar el Permiso");
      resolve("Permiso Eliminado Correctamente");
    });
  });
};

const getAllPermissions = () => {
  return new Promise((resolve, reject) => {
    const query = "CALL GetRolesPermissions()";
    connection.query(query, (error, results) => {
      if (error) return reject("Ocurrió un error al Obtener los Permisos");
      resolve(results[0]);
    });
  });
};

const filterPermissions = (data) => {
  return new Promise((resolve, reject) => {
    let keys = "";
    let values = [];

    Object.entries(data).forEach(([key, value]) => {
      values.push("%" + value + "%");
      keys += "roles_permissions." + key + " like ? OR ";
    });

    keys = keys.trim();

    if (keys.endsWith("OR")) {
      keys = keys.substring(0, keys.length - 2);
    }

    const query =
      "SELECT roles_permissions.id, roles_permissions.role_id, roles_permissions.module, roles_permissions.permissions, roles.name as name_rol FROM roles_permissions INNER JOIN roles ON roles_permissions.role_id = roles.id  WHERE " +
      keys +
      "";

    connection.query(query, values, (error, results) => {
      if (error) return reject(error);
      const result = JSON.parse(JSON.stringify(results));
      resolve(result);
    });
  });
};

/* Get Permissions By Role/Module Session */
const getPermissionsByRoleAndModule = async (userSessionEncrypt) => {
  let data = decryptCrypt(userSessionEncrypt);
  const response = await GetPermissionsByRoleAndModuleExecute(data);
  if (!response) {
    return false;
  } else {
    /* Obj Permissions */
    const permissions = process.env.PERMISSIONS.split(",");
    const arrayResponse = response.split(",");

    const filteredPermissionsObject = permissions.reduce((acc, current) => {
      acc[current] = arrayResponse.includes(current) ? true : false;
      return acc;
    }, {});

    return filteredPermissionsObject;
  }
};

/* Call GetPermissionsByRoleAndModule() */
const GetPermissionsByRoleAndModuleExecute = (data) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "CALL GetPermissionsByRoleAndModule(?, ?)",
      [data.role, data.module],
      (error, results) => {
        if (error) return reject(false);
        if (results[0].length > 0) {
          resolve(results[0][0].permissions);
        } else {
          resolve(false);
        }
      }
    );
  });
};

/* Get Modules by Id Role */
const getModuleAccessByRole = async (sessionEmployee) => {
  let data = decryptCrypt(sessionEmployee);
  const response = await getModuleAccessByRoleExecute(data);
  const responseEncrypt = encryptCrypt(JSON.stringify(response));
  return responseEncrypt;
};

/* Call GetModuleAccessByIdRole() */
const getModuleAccessByRoleExecute = (data) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "CALL GetModuleAccessByRole(?)",
      [data.role_name],
      (error, results) => {
        if (error) return reject(false);
        if (results[0].length > 0) {
          resolve(results[0]);
        } else {
          resolve(false);
        }
      }
    );
  });
};

module.exports = {
  registerPermissions,
  editPermissions,
  deletePermissions,
  getAllPermissions,
  filterPermissions,
  getPermissionsByRoleAndModule,
  getModuleAccessByRole,
};
