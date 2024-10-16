const connection = require("../../../config/database");

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
    const query =
      "CALL GetRolesPermissions()";
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
      values.push("%"+ value +  "%");
      keys += "roles_permissions." + key + " like ? OR ";
    });

    keys = keys.trim();

    if (keys.endsWith("OR")) {
      keys = keys.substring(0, keys.length - 2);
    }

    const query =
      "SELECT roles_permissions.id, roles_permissions.role_id, roles_permissions.module, roles_permissions.permissions, roles.name as role_name FROM roles_permissions INNER JOIN roles ON roles_permissions.role_id = roles.id  WHERE " + keys + "";
    
    connection.query(query, values, (error, results) => {
      if (error) return reject(error);
      const result = JSON.parse(JSON.stringify(results));
      resolve(result);
    });
  });
};

module.exports = {
  registerPermissions,
  editPermissions,
  deletePermissions,
  getAllPermissions,
  filterPermissions
};
