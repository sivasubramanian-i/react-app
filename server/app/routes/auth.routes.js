const auth = require('../controllers/auth.controller');
var router = require('express').Router();

router.post('/login', auth.login);
router.post('/register', auth.register);

module.exports = router;
