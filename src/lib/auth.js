import { cookies } from 'next/headers';
import { verifyToken } from './jwt';

/**
 * Gets the current admin session from HttpOnly cookies.
 * Compatible with Next.js 15 async cookies API.
 */
export async function getAdminSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('veeradmin_token')?.value;
    if (!token) {
      return null;
    }
    return verifyToken(token);
  } catch (error) {
    console.error('Error fetching admin session:', error);
    return null;
  }
}
