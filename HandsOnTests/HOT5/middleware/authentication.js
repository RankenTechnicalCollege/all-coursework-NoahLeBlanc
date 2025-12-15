import { auth } from "../auth.js";

// =====================
// Fetch session
// =====================
export async function fetchSession(req) {
  const session = await auth.api.getSession({
    headers: req.headers
  });

  if (!session) {
    throw new Error("No session found");
  }

  return session;
}

// =====================
// Attach session
// =====================
export async function attachSession(req, res, next) {
  try {
    const session = await fetchSession(req);

    req.session = session.session;
    req.user = session.user;

    next();
  } catch (err) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid or expired session"
    });
  }
}

// =====================
// Require authentication
// =====================
export function isAuthenticated(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "You must be logged in"
    });
  }
  next();
}

// =====================
// Require role(s)
// =====================
export function hasRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not logged in" });
    }

    const userRole = req.user.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  };
}
