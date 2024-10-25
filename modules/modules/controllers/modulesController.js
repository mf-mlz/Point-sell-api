const modulesService = require("../services/modulesService");
const submodulesService = require("../../submodules/services/submodulesService");
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
    const registermodulesServices = await modulesService.registerPermissions(
      data
    );
    res.status(200).json({ message: registermodulesServices });
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
    const editmodulesServices = await modulesService.editPermissions(data);
    res.status(200).json({ message: editmodulesServices });
  } catch (err) {
    res.status(500).json({ error: "Ocurrió un error al Editar el Permiso" });
  }
};

const deletePermissions = async (req, res) => {
  /* Verificar que el Modulo (Name) no sea Dashboard (Pendiente) */
  const id = req.params.id;
  try {
    const updated_at = createUpdatetAt();
    const deletemodulesServices = await modulesService.deletePermissions(
      id,
      updated_at
    );
    res.status(200).json({ message: deletemodulesServices });
  } catch (err) {
    res.status(500).json({ error: "Ocurrió un error al Eliminar el Permiso" });
  }
};

const getAllModules = async (req, res) => {
  try {
    const arrayModules = [];
    const getAllModulesServices = await modulesService.getAllModules();

    /* Return Array ._nav with Modules BD */
    for (const element of getAllModulesServices) {
      /* Search Children */
      const childrens = await submodulesService.getSubModuleByIdModule(
        element.id
      );

      let obj = {
        name: element.name,
        url: element.url,
        iconComponent: { name: element.iconComponent },
      };

      if (childrens.length > 0) {
        obj.children = childrens;
      }
      arrayModules.push(obj);
    }

    res.status(200).json({ modules: arrayModules });
  } catch (err) {
    res.status(500).json({ error: "Ocurrió un error al Obtener los Permisos" });
  }
};

const getAllModulesAndSubmodules = async (req, res) => {
  try {
    const arrayModules = [];
    const getAllModulesServices = await modulesService.getAllModules();

    /* Return Array ._nav with Modules BD */
    for (const element of getAllModulesServices) {
      /* Search Children */
      const childrens = await submodulesService.getSubModuleByIdModule(
        element.id
      );

      let obj = { name: element.name, type: "Módulo" };

      /* Add Children */
      if (childrens.length > 0) {
        for (const children of childrens) {
          let objChild = {
            name: children.name,
            type: "SubMódulo",
            modulo: children.module,
          };
          arrayModules.push(objChild);
        }
      }
      if (element.name !== "Dashboard") {
        arrayModules.push(obj);
      }
    }

    arrayModules.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    res.status(200).json({ modulesSubmodules: arrayModules });
  } catch (err) {
    res.status(500).json({ error: "Ocurrió un error al Obtener los Modulos" });
  }
};

const fetchModulesAndSubmodules = async () => {
  const arrayModules = [];
  const getAllModulesServices = await modulesService.getAllModules();

  for (const element of getAllModulesServices) {
    const childrens = await submodulesService.getSubModuleByIdModule(
      element.id
    );

    let obj = { name: element.name, type: "Módulo" };

    if (childrens.length > 0) {
      for (const children of childrens) {
        let objChild = {
          name: children.name,
          type: "SubMódulo",
          modulo: children.module,
        };
        arrayModules.push(objChild);
      }
    }

    if (element.name !== "Dashboard") {
      arrayModules.push(obj);
    }
  }

  arrayModules.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  return arrayModules;
};

const filterPermissions = async (req, res) => {
  try {
    const data = req.body;
    const filtermodulesServices = await modulesService.filterPermissions(data);
    res.status(200).json({ permissions: filtermodulesServices });
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
      await modulesService.getPermissionsByRoleAndModule(userSessionEncrypt);
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

    const getModuleAccessByRole = await modulesService.getModuleAccessByRole(
      sessionEmployee
    );
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
  getAllModules,
  getAllModulesAndSubmodules,
  filterPermissions,
  getPermissionsByRoleAndModule,
  getModuleAccessByRole,
  fetchModulesAndSubmodules
};
