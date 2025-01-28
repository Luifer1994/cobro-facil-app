import type { FormRules } from "naive-ui";

export const rules: (isCreating: boolean) => FormRules = (isCreating) => ({
    name: {
        required: true,
        message: "El nombre es requerido",
        trigger: ["input"],
        type: "string",
    },
    email: {
        required: true,
        message: "El correo es requerido",
        trigger: ["input"],
        type: "email",
    },
    role_id: {
        required: true,
        message: "El rol es requerido",
        trigger: ["input"],
        type: "number",
    },
    ...(isCreating && {
        password: {
            required: true,
            message: "La contraseña es requerida",
            trigger: ["input"],
            type: "string",
        },
    }),
});