const { Router } = require('express');
const c = require('../controllers/authController');
const requireAuth = require('../middleware/auth');

const router = Router();

router.post('/register',   c.register);
router.post('/resend-otp', c.resendOtp);
router.post('/verify-otp', c.verifyOtp);
router.post('/login',      c.login);
router.get('/me',          requireAuth, c.getMe);


module.exports = router;
