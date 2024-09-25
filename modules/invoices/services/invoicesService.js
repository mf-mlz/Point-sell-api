const invoicesRepository = require("../repositories/invoicesRepository");

const registerInvoice = (invoiceData) => {
  return invoicesRepository.registerInvoice(invoiceData);
};

const createInvoice = (invoiceData) => {
  return invoicesRepository.createInvoice(invoiceData);
};

const sendEmail = (data) => {
  return invoicesRepository.sendEmail(data);
};

const downloadInvoice = async (id_invoice) => {
  return invoicesRepository.downloadInvoice(id_invoice);
};

const cancelInvoice = async (data) => {
  return invoicesRepository.cancelInvoice(data);
};

const putStatusInvoice = async (data) => {
  return invoicesRepository.putStatusInvoice(data);
};

const getInvoicesByIdSale = async (data) => {
  return invoicesRepository.getInvoicesByIdSale(data);
};

module.exports = {
  registerInvoice,
  createInvoice,
  sendEmail,
  downloadInvoice,
  cancelInvoice,
  putStatusInvoice,
  getInvoicesByIdSale,
};
