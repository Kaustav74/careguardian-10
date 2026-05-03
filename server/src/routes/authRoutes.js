const validate = require('../middleware/validate');
const { signupSchema, loginSchema } = require('../validators/authValidators');
const express = require('express');
const { signup, login, me } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/register', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.get('/me', auth, me);

module.exports = router;
