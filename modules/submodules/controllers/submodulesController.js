const submodulesService = require("../services/submodulesService");
const { createUpdatetAt, verifyData } = require("../../../utils/helpers");
const { encryptCrypt } = require("../../../utils/crypto-js");

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
    const registersubmodulesServices =
      await submodulesService.registerPermissions(data);
      return res.status(200).json({ message: registersubmodulesServices });
  } catch (err) {
    return res.status(500).json({ error: "Ocurrió un error al Registrar el Permiso" });
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
    const editsubmodulesServices = await submodulesService.editPermissions(
      data
    );
    return res.status(200).json({ message: editsubmodulesServices });
  } catch (err) {
    return res.status(500).json({ error: "Ocurrió un error al Editar el Permiso" });
  }
};

const deletePermissions = async (req, res) => {
  /* Verificar que el Modulo (Name) no sea Dashboard (Pendiente) */
  const id = req.params.id;
  try {
    const updated_at = createUpdatetAt();
    const deletesubmodulesServices =
      await submodulesService.deletePermissions(id, updated_at);
      return res.status(200).json({ message: deletesubmodulesServices });
  } catch (err) {
    return res.status(500).json({ error: "Ocurrió un error al Eliminar el Permiso" });
  }
};

const getSubModuleByIdModule = async (req, res) => {
  try {
    const idModule = req.params.idModule;
    const getAllSubModulesServices = await submodulesService.getSubModuleByIdModule(idModule);
    return res.status(200).json({ submodules: getAllSubModulesServices });
  } catch (err) {
    return res.status(500).json({ error: "Ocurrió un error al Obtener los Permisos" });
  }
};

const filterPermissions = async (req, res) => {
  try {
    const data = req.body;
    const filtersubmodulesServices =
      await submodulesService.filterPermissions(data);
      return res.status(200).json({ permissions: filtersubmodulesServices });
  } catch (err) {
    return res.status(500).json({ error: "Ocurrió un error al Obtener los Permisos" });
  }
};

const getPermissionsByRoleAndModule = async (req, res) => {
  try {
    let userSessionEncrypt = req.headers["module-role"];
    userSessionEncrypt = userSessionEncrypt
      ? userSessionEncrypt.replace(/['"]+/g, "")
      : null;

    if (!userSessionEncrypt) {
      return res.status(401).json({
        status: false,
        message: "La Petición no cuenta con la cabecera de Sesión",
      });
    }

    const getPermissionsByRoleAndModule =
      await submodulesService.getPermissionsByRoleAndModule(
        userSessionEncrypt
      );
    if (!getPermissionsByRoleAndModule) {
      return res.status(200).json({
        status: false,
        data: "Sin Permisos Registrados",
      });
    } else {
      return res.status(200).json({
        status: true,
        data: encryptCrypt(JSON.stringify(getPermissionsByRoleAndModule)),
      });
    }
  } catch (err) {
    return res.status(500).json({ error: "Ocurrió un error al Obtener los Permisos" });
  }
};

const getModuleAccessByRole = async (req, res) => {
  try {
    let sessionEmployee = req.headers["session-employee"];
    sessionEmployee = sessionEmployee
      ? sessionEmployee.replace(/['"]+/g, "")
      : null;

    if (!sessionEmployee) {
      return res.status(401).json({
        status: false,
        message: "La Petición no cuenta con la cabecera de Sesión",
      });
    }

    const getModuleAccessByRole =
      await submodulesService.getModuleAccessByRole(sessionEmployee);
    if (!getModuleAccessByRole) {
      return res.status(200).json({
        status: false,
        data: "Sin Módulos Registrados",
      });
    } else {
      return res.status(200).json({
        status: true,
        data: getModuleAccessByRole,
      });
    }
  } catch (err) {
    return res.status(500).json({ error: "Ocurrió un error al Obtener los Módulos" });
  }
};

module.exports = {
  registerPermissions,
  editPermissions,
  deletePermissions,
  getSubModuleByIdModule,
  filterPermissions,
  getPermissionsByRoleAndModule,
  getModuleAccessByRole,
};
