import { env } from '$env/dynamic/private';
import type { Cookies } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

export function is_logged_in(cookies: Cookies) {
    const token = cookies.get('gamedex_auth_token');
    if(!token) return false;

    try {
        const data = jwt.verify(token, env.JWT_SECRET, { maxAge: env.JWT_DURATION ??  14 * 24 * 60 * 60 });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (data as any)?.data?.authenticated !== undefined && (data as any).data.authenticated === true;
    } catch(err) {
        return false;
    }
}