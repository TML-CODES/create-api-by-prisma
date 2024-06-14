import { Router } from 'express';
import { {name}Controller } from '../controllers';

const router = Router();

router.get('/search', {name}Controller.search);
router.get('/:id', {name}Controller.get);

router.post('/', {name}Controller.create);

router.delete('/:id', {name}Controller.delete{Name});

router.patch('/:id', {name}Controller.update);

export default router;