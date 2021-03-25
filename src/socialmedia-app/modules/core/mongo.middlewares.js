import { verifyToken, verifyAdminToken } from './middlewares/auth.middleware';
import { AuthSanitizer } from '../auth/middlewares/auth.sanitizer.middleware';

const Middleware = {
  verifyToken,
  verifyAdminToken,
  AuthSanitizer
}


export default Middleware;
