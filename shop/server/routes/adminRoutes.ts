import { Router } from 'express';
import { authenticate, isAdmin } from '../middleware/auth';
import { getAllUsers, deleteUser } from '../controllers/adminController';

const router = Router();


router.use(authenticate);
router.use(isAdmin);

router.get('/users', getAllUsers);      // Получить всех пользователей
router.delete('/users/:id', deleteUser); // Удалить пользователя

export default router;