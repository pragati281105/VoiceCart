const { Router } = require('express');
const c = require('../controllers/dishController');
const requireAuth = require('../middleware/auth');

const router = Router();

router.get('/', c.listDishes);
router.get('/recommended', requireAuth, c.recommended);
router.get('/:id', c.getDish);

module.exports = router;
