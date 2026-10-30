import { Router } from 'express';
import { getAllStores, getStoreBySlug, createStore, updateStore } from './stores.controller.js';

const router = Router();

router.get('/', getAllStores);
router.get('/:slug', getStoreBySlug);
router.post('/register', createStore);
router.put('/:id', updateStore);

export default router;

