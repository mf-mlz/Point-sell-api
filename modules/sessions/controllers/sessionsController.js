const sessionsService = require("../services/sessionsService");

/* Guardar sesión de usuario */
const saveSession = async (req, res) => {
  try {
    const { employee_id, session_id } = req.body;

    if (!employee_id || !session_id) {
      return res
        .status(400)
        .json({
          error: "Los campos 'employee_id' y 'session_id' son requeridos",
        });
    }

    const result = await sessionsService.saveSession(employee_id, session_id);
    if (result) {
      return res.status(200).json({ message: "Sesión guardada con éxito" });
    } else {
      return res.status(500).json({ error: "Error al guardar la sesión" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Ocurrió un error en el servidor" });
  }
};

/* Obtener sesión por ID de empleado */
const findSessionByEmployeeId = async (req, res) => {
  try {
    const { employee_id } = req.params;

    if (!employee_id) {
      return res
        .status(400)
        .json({ error: "El parámetro 'employee_id' es requerido" });
    }

    const result = await sessionsService.findSessionByEmployeeId(employee_id);
    
    if (result.length > 0) {
      return res.status(200).json({ session: result[0] });
    } else {
      return res.status(404).json({ message: "Sesión no encontrada" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Ocurrió un error en el servidor" });
  }
};

/* Eliminar sesión por ID de empleado */
const deleteSessionByEmployeeId = async (req, res) => {
  try {
    const { employee_id } = req.params;

    if (!employee_id) {
      return res
        .status(400)
        .json({ error: "El parámetro 'employee_id' es requerido" });
    }

    const result = await sessionsService.deleteSessionByEmployeeId(employee_id);
    if (result) {
      return res
        .status(200)
        .json({ message: "Sesión eliminada correctamente" });
    } else {
      return res.status(500).json({ error: "Error al eliminar la sesión" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Ocurrió un error en el servidor" });
  }
};

module.exports = {
  saveSession,
  findSessionByEmployeeId,
  deleteSessionByEmployeeId,
};
