const { Router } = require('express');
const c = require('../controllers/itemController');

const router = Router();

router.get('/', c.getItems);
router.get('/search', c.searchItems);
router.post('/', c.createItem);
router.put('/:id', c.updateItem);
router.delete('/:id', c.deleteItem);
router.delete('/', c.clearList);

module.exports = router;
