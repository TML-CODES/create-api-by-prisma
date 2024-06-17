const { Router } = require('express');
const { replace_hereController } = require('../controllers');

const router = Router();

router.get('/search', replace_hereController.search);
router.get('/:id', replace_hereController.get);

router.post('/', replace_hereController.create);

router.delete('/:id', replace_hereController.deleteReplace_Here);

router.patch('/:id', replace_hereController.update);

module.exports = router;