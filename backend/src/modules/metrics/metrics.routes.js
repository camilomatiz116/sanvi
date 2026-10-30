import { Router } from 'express';
import { trackWhatsAppClick, getStoreMetrics } from './metrics.controller.js';

const router = Router();

router.post('/whatsapp', trackWhatsAppClick);
router.get('/store/:storeId', getStoreMetrics);

export default router;

