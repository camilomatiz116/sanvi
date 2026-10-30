import { Router } from 'express';
import { createOrder, getOrderById, getStoreOrders, updateOrderStatus, deleteOrder } from './orders.controller.js';

const router = Router();

router.post('/', createOrder);
router.get('/:id', getOrderById);
router.get('/store/:storeId', getStoreOrders);
router.patch('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder);

export default router;
