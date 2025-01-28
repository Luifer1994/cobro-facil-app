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
    message: "El correo electrónico es requerido y debe ser un email válido",
    trigger: ["input"],
    type: "email",
  },
  role_id: {
    required: true,
    message: "El rol es requerido",
    trigger: ["input"],
    type: "number",
  },
  phone: {
    required: true,
    trigger: ["input"],
    type: "number",
    validator: (rule, value) => {
      if (!value) {
        return new Error("El celular es requerido");
      }
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(value)) {
        return new Error(
          "El celular debe ser numérico con exactamente 10 dígitos"
        );
      }
      return true;
    },
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
