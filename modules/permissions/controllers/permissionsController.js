const permissionsService = require("../services/permissionsService");
const { createUpdatetAt, verifyData } = require("../../../utils/helpers");
const dotenv = require("dotenv");

dotenv.config();

const registerPermissions = async (req, res) => {
  const requiredFields = ["role_id", "module", "permissions"];
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
  const requiredFields = ["id", "role_id", "module", "permissions"];
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
    console.log(err);

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
    console.log(err);

    res.status(500).json({ error: "Ocurrió un error al Obtener los Permisos" });
  }
};

module.exports = {
  registerPermissions,
  editPermissions,
  deletePermissions,
  getAllPermissions,
  filterPermissions,
};
