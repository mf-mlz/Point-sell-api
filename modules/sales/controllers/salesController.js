const salesService = require("../services/salesService");
const { verifyData, createUpdatetAt } = require("../../../utils/helpers");
const jwt = require("jsonwebtoken");

const registerSales = async (req, res) => {
  const requiredFields = [
    "date",
    "payment",
    "dataPayment",
    "employeesId",
    "status",
  ];
  const data = req.body;

  const missingField = verifyData(requiredFields, data);
  if (missingField) {
    return res
      .status(400)
      .json({ error: `El campo ${missingField} es requerido` });
  }

  try {
    const registerSalesService = await salesService.registerSales(data);
    if (registerSalesService > 0) {
      res
        .status(200)
        .json({
          message: "Venta Registrada con Éxito y Stock Actualizado",
          idSale: registerSalesService,
        });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const filterSales = async (req, res) => {
  const data = req.body;
  try {
    delete data.employeeId;
    const salesData = await salesService.getSale(data);
    if (salesData.length > 0) {
      res.status(200).json({
        message: `Se encontraron ${salesData.length} registros`,
        sales: salesData,
      });
    } else {
      res.status(401).json({ message: `No se encontraron registros` });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Ocurrió un error al obtener los registros" });
  }
};

const getAllSales = async (req, res) => {
  try {
    const sales = await salesService.getAllSales();
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSaleInfoCompleteById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ message: "El Id de la Venta es Requerido." });
    }

    const saleInfo = await salesService.getSaleInfoCompleteById(id);
    if (!saleInfo) {
      return res.status(404).json({ message: "La Venta No Existe" });
    }

    res.json(saleInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const putSale = async (req, res) => {
  const requiredFields = [
    "id",
    "date",
    "payment",
    "dataPayment",
    // "customerId",
    "employeesId",
    "status",
  ];
  const data = req.body;

  const missingField = verifyData(requiredFields, data);
  if (missingField) {
    return res
      .status(400)
      .json({ error: `El campo ${missingField} es requerido` });
  }

  const {
    id,
    date,
    totalAmount,
    payment,
    dataPayment,
    customerId,
    employeesId,
    status,
  } = data;

  try {
    data.updated_at = createUpdatetAt();

    const salesEmployeesServices = await salesService.putSale(data);
    res.status(201).json({ message: salesEmployeesServices });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteSale = async (req, res) => {
  const data = req.params.id;

  try {
    const deleteSaleServices = await salesService.deleteSale(data);
    res.status(201).json({ message: deleteSaleServices });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const postSaleDate = async (req, res) => {
  const data = req.body;
  try {
    delete data.employeeId;
    const postSaleDate = await salesService.postSaleDate(data);
    if (postSaleDate.length > 0) {
      res.status(200).json({
        message: `Se encontraron ${postSaleDate.length} registros`,
        sales: postSaleDate,
      });
    } else {
      res.status(200).json({ message: `No se encontraron registros` });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Ocurrió un error al obtener los registros" });
  }
};

module.exports = {
  registerSales,
  filterSales,
  getAllSales,
  putSale,
  deleteSale,
  postSaleDate,
  getSaleInfoCompleteById
};
