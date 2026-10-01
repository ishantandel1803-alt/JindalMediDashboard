// Base URL for the n8n webhook backend. All Health Dashboard workflows are
// published under this prefix (see /docs for the workflow list).
const API_BASE = "https://founders.app.n8n.cloud/webhook/health-dashboard";

async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
  });
  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = { success: false, message: "Unexpected response from server." };
  }
  return { ok: res.ok, status: res.status, data };
}

// --- Session helpers -------------------------------------------------

function saveSession(user, permissions) {
  localStorage.setItem("jhd_user", JSON.stringify(user));
  localStorage.setItem("jhd_permissions", JSON.stringify(permissions));
}

function getSession() {
  const userRaw = localStorage.getItem("jhd_user");
  const permsRaw = localStorage.getItem("jhd_permissions");
  if (!userRaw) return null;
  return { user: JSON.parse(userRaw), permissions: JSON.parse(permsRaw || "{}") };
}

function clearSession() {
  localStorage.removeItem("jhd_user");
  localStorage.removeItem("jhd_permissions");
}

// Redirect target for a role name
function pageForRole(role) {
  switch (role) {
    case "Employee":
      return "employee.html";
    case "Doctor":
      return "doctor.html";
    case "Admin":
      return "admin.html";
    case "Super Admin":
      return "superadmin.html";
    default:
      return "index.html";
  }
}

// Call at the top of every protected page. Redirects to login if there is
// no session, or if the session's role doesn't match what the page expects.
function requireRole(expectedRole) {
  const session = getSession();
  if (!session || session.user.role !== expectedRole) {
    window.location.href = "index.html";
    return null;
  }
  const nameEl = document.getElementById("current-user-name");
  if (nameEl) nameEl.textContent = session.user.name;
  return session;
}

function logout() {
  clearSession();
  window.location.href = "index.html";
}
