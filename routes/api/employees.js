const express = require('express');
const router = express.Router();
const employeesControllers = require('../../controllers/apiController');

router.route('/')
    .get(employeesControllers.getAllEmployees)
    .post(employeesControllers.createNewEmployee)
    .put(employeesControllers.updateEmployee)
    .delete(employeesControllers.deleteEmployee);

router.route('/:id')
    .get(employeesControllers.getEmployee);

module.exports = router;