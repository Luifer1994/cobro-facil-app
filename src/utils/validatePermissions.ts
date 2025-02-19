import { useAuthStore } from "@/modules/auth/stores/auth";

/**
 * Capture permissions the useAuthStore and decode base64.
 * 
 * @returns Array of permissions
 */
export const permissions = (): string[] => {
    const user = useAuthStore().user;
    if (user && user.permissions) {
        const permissions = user.permissions;
        const decode = atob(permissions);
        const parse = JSON.parse(decode);
        return parse;
    }
    return [];
};

/**
 * Capture roles the useAuthStore and decode base64.
 * 
 * @returns Strung of role.
 */
export const userRole = (): string => {
    const user = useAuthStore().user;
    if (user && user.roles) {
        const role = user.roles;
        const decode = atob(role);
        const parse = JSON.parse(decode);
        return parse[0];
    }
    return "";
};

/**
 * Function to validate if the user has permission.
 * 
 * @param permission 
 * @returns Boolean
 */
export const validatePermission = (permission: string[]): boolean => {
    const userPermissions = permissions();
    const hasPermission = userPermissions.some((p) => permission.includes(p));
    return hasPermission;
}