const permissionsService = require("../services/permissionsService");
const { createUpdatetAt, verifyData } = require("../../../utils/helpers");
const dotenv = require("dotenv");
const { encryptCrypt } = require("../../../utils/crypto-js");

dotenv.config();

const registerPermissions = async (req, res) => {
  /* Verificar que el Modulo (Name) no sea Dashboard (Pendiente) */
  const requiredFields = ["role_id", "module"];
  const data = req.body;

  const missingField = verifyData(requiredFields, data);
  if (missingField) {
    return res
      .status(400)
      .json({ error: `El campo ${missingField} es requerido` });
  }

  try {
    const registerPermissionsServices =
      await permissionsService.registerPermissions(data);
    res.status(200).json({ message: registerPermissionsServices });
  } catch (err) {
    res.status(500).json({ error: "Ocurrió un error al Registrar el Permiso" });
  }
};

const editPermissions = async (req, res) => {
  /* Verificar que el Modulo (Name) no sea Dashboard (Pendiente) */
  const requiredFields = ["id", "role_id", "module"];
  const data = req.body;

  const missingField = verifyData(requiredFields, data);
  if (missingField) {
    return res
      .status(400)
      .json({ error: `El campo ${missingField} es requerido` });
  }

  try {
    data.updated_at = createUpdatetAt();
    const editPermissionsServices = await permissionsService.editPermissions(
      data
    );
    res.status(200).json({ message: editPermissionsServices });
  } catch (err) {
    res.status(500).json({ error: "Ocurrió un error al Editar el Permiso" });
  }
};

const deletePermissions = async (req, res) => {
  /* Verificar que el Modulo (Name) no sea Dashboard (Pendiente) */
  const id = req.params.id;
  try {
    const updated_at = createUpdatetAt();
    const deletePermissionsServices =
      await permissionsService.deletePermissions(id, updated_at);
    res.status(200).json({ message: deletePermissionsServices });
  } catch (err) {
    res.status(500).json({ error: "Ocurrió un error al Eliminar el Permiso" });
  }
};

const getAllPermissions = async (req, res) => {
  try {
    const getAllPermissionsServices =
      await permissionsService.getAllPermissions();
    res.status(200).json({ permissions: getAllPermissionsServices });
  } catch (err) {
    res.status(500).json({ error: "Ocurrió un error al Obtener los Permisos" });
  }
};

const filterPermissions = async (req, res) => {
  try {
    const data = req.body;
    const filterPermissionsServices =
      await permissionsService.filterPermissions(data);
    res.status(200).json({ permissions: filterPermissionsServices });
  } catch (err) {
    res.status(500).json({ error: "Ocurrió un error al Obtener los Permisos" });
  }
};

const getPermissionsByRoleAndModule = async (req, res) => {
  try {
    let userSessionEncrypt = req.headers["module-role"];
    userSessionEncrypt = userSessionEncrypt
      ? userSessionEncrypt.replace(/['"]+/g, "")
      : null;

    if (!userSessionEncrypt) {
      res.status(401).json({
        status: false,
        message: "La Petición no cuenta con la cabecera de Sesión",
      });
    }

    const getPermissionsByRoleAndModule =
      await permissionsService.getPermissionsByRoleAndModule(
        userSessionEncrypt
      );
    if (!getPermissionsByRoleAndModule) {
      res.status(200).json({
        status: false,
        data: "Sin Permisos Registrados",
      });
    } else {
      res.status(200).json({
        status: true,
        data: encryptCrypt(JSON.stringify(getPermissionsByRoleAndModule)),
      });
    }
  } catch (err) {
    res.status(500).json({ error: "Ocurrió un error al Obtener los Permisos" });
  }
};

const getModuleAccessByRole = async (req, res) => {
  try {
    let sessionEmployee = req.headers["session-employee"];
    sessionEmployee = sessionEmployee
      ? sessionEmployee.replace(/['"]+/g, "")
      : null;

    if (!sessionEmployee) {
      res.status(401).json({
        status: false,
        message: "La Petición no cuenta con la cabecera de Sesión",
      });
    }

    const getModuleAccessByRole =
      await permissionsService.getModuleAccessByRole(sessionEmployee);
    if (!getModuleAccessByRole) {
      res.status(200).json({
        status: false,
        data: "Sin Módulos Registrados",
      });
    } else {
      res.status(200).json({
        status: true,
        data: getModuleAccessByRole,
      });
    }
  } catch (err) {
    res.status(500).json({ error: "Ocurrió un error al Obtener los Módulos" });
  }
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
