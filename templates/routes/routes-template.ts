import { Router } from 'express';
import { replace_hereController } from '../controllers';

const router = Router();

router.get('/', replace_hereController.search);
router.get('/search', replace_hereController.search);
router.get('/:id', replace_hereController.get);

router.post('/', replace_hereController.create);

router.delete('/:id', replace_hereController.deleteReplace_Here);

router.patch('/', replace_hereController.update);
router.patch('/:id', replace_hereController.update);

export default router;