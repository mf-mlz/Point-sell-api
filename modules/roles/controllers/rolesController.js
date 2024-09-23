const rolesService = require('../services/rolesService');
const { verifyData, createUpdatetAt } = require('../../../utils/helpers');
const fs = require('fs');
const path = require('path');   

const getRoles = async (req, res) => {
    try {
        const roles = await rolesService.getRoles();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getRoles
};