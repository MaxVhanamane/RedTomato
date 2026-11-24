import jwt from 'jsonwebtoken';
import { parseCookie } from 'cookie';

/**
 * Parses cookies from incoming request.
 * Works seamlessly with Next.js API routes (req.cookies) and SSR (req.headers.cookie).
 */
export function parseCookies(req) {
  if (!req) return {};
  if (req.cookies && typeof req.cookies === 'object') {
    return req.cookies;
  }
  const cookieHeader = req.headers?.cookie;
  if (typeof cookieHeader === 'string' && cookieHeader.trim().length > 0) {
    try {
      return parseCookie(cookieHeader);
    } catch (e) {
      return {};
    }
  }
  return {};
}

/**
 * Extracts and verifies JWT from cookies, headers, or body.
 */
export function getAuthenticatedUser(req) {
  try {
    const cookies = parseCookies(req);
    let token = cookies?.token;

    if (!token && req?.headers?.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      }
    }

    if (!token && req?.body) {
      token = req.body.tokenVal || req.body.token;
    }

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
}

/**
 * Middleware wrapper requiring valid authentication.
 */
export function requireAuth(handler) {
  return async (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Invalid or missing token' });
    }
    req.user = user;
    return handler(req, res);
  };
}

/**
 * Middleware wrapper requiring admin role.
 */
export function requireAdmin(handler) {
  return async (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden: Admin access required' });
    }
    req.user = user;
    return handler(req, res);
  };
}
