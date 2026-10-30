import { Router } from 'express';
import { getStoreMembership, registerMembershipPayment } from './memberships.controller.js';

const router = Router();

router.get('/:storeId', getStoreMembership);
router.post('/pay', registerMembershipPayment);

export default router;

