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
  address: {
    required: false,
    message: "La dirección es requerida",
    trigger: ["input"],
    type: "string",
  },
  document: {
    required: true,
    message: "El documento es requerido",
    trigger: ["input"],
    type: "string",
    validator: (rule, value) => {
      if (!value) {
        return new Error("El documento es requerido");
      }
      if (value.length > 20) {
        return new Error("El documento no puede tener más de 20 caracteres");
      }
      return true;
    },
  },
  document_type_id: {
    required: true,
    message: "El tipo de documento es requerido",
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
  }
});
