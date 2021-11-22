const employee = require('../controllers/employee.controller');

var router = require('express').Router();

router.post('/create', employee.create);
router.get('/get', employee.get);
router.put('/update', employee.update);
router.delete('/delete/:id', employee.delete);

module.exports = router;
