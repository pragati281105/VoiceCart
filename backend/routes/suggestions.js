const { Router } = require('express');
const c = require('../controllers/suggestionController');

const router = Router();

router.get('/history', c.getHistorySuggestions);
router.get('/seasonal', c.getSeasonal);
router.get('/popular', c.getPopularSuggestions);
router.get('/autocomplete', c.getAutocompleteSuggestions);
router.get('/substitutes/:item', c.getSubstituteSuggestions);

module.exports = router;
