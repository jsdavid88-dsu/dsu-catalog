import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
    // Matcher ensuring admin paths are also processed if needed, or simply not broken.
    // However, since admin is at root /app/admin, it is NOT dynamic. 
    // If we want /admin to work, we should make sure it doesn't conflict.
    // Let's try matching everything BUT static files AND admin.
    matcher: ['/((?!api|_next|admin|.*\\..*).*)']
};
