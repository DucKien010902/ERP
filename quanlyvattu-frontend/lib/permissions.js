export function hasPermission(permissions = [], permission) {
  if (!permission) return true;
  if (!Array.isArray(permissions)) return false;
  return permissions.includes(permission);
}

export function hasAnyPermission(permissions = [], required = []) {
  if (!required || !required.length) return true;
  return required.some((permission) => hasPermission(permissions, permission));
}
