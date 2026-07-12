/**
 * Central role-permission mapping.
 * Defines what actions each role can perform on each module.
 */
const permissions = {
  FleetManager: {
    vehicles: ["add", "edit", "delete"],
    drivers: ["add", "edit", "delete"],
    trips: [],
    maintenance: ["add", "complete", "delete"],
  },
  Dispatcher: {
    vehicles: [],
    drivers: [],
    trips: ["add", "complete", "delete"],
    maintenance: [],
  },
  SafetyOfficer: {
    vehicles: [],
    drivers: [],
    trips: [],
    maintenance: [],
  },
  Finance: {
    vehicles: [],
    drivers: [],
    trips: [],
    maintenance: [],
  },
};

/**
 * Check if a role has a specific permission on a module.
 * @param {string} role - User role
 * @param {string} module - Module name (vehicles, drivers, trips, maintenance)
 * @param {string} action - Action name (add, edit, delete, complete)
 * @returns {boolean}
 */
export const hasPermission = (role, module, action) => {
  const rolePerms = permissions[role];
  if (!rolePerms) return false;
  const modulePerms = rolePerms[module];
  if (!modulePerms) return false;
  return modulePerms.includes(action);
};

/**
 * Get the user object from localStorage
 */
export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
};

/**
 * Check permission for the currently logged-in user.
 */
export const canCurrentUser = (module, action) => {
  const user = getUser();
  return hasPermission(user.role, module, action);
};
