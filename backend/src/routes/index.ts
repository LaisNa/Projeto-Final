import { Router } from "express";

import publicRouter from './routes';
import privateRoutes from './privateRoutes';

const router = Router();

router.use('/', publicRouter);
router.use('/', privateRoutes);

export default router;
