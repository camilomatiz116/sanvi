import { Router } from 'express';
import { createOrder, getOrderById, getStoreOrders } from './orders.controller.js';

const router = Router();

router.post('/', createOrder);
router.get('/:id', getOrderById);
router.get('/store/:storeId', getStoreOrders);

export default router;
