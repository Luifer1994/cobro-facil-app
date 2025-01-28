import type { FormRules } from "naive-ui";

export const rulesCreateUpdate: (isCreating: boolean) => FormRules = (
  isCreating
) => ({
  id: {
    required: true,
    message: "El dominio es requerido",
    trigger: ["input"],
    type: "string",
  },
  name: {
    required: true,
    message: "El nombre es requerido",
    trigger: ["input"],
    type: "string",
  },
  document_number: {
    required: true,
    message: "El número de documento es requerido",
    trigger: ["input"],
    type: "string",
  },
  address: {
    required: false,
    message: "La dirección es opcional",
    trigger: ["input"],
    type: "string",
  },
  cell_phone: {
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
  email: {
    required: true,
    message: "El correo electrónico es requerido y debe ser un email válido",
    trigger: ["input"],
    type: "email",
  },
  ...(isCreating && {
    logo: {
      required: true,
      message: "El logo es requerido",
      trigger: ["input"],
      type: "object",
    },
  }),
  primary_color: {
    required: true,
    message: "El color primario es opcional",
    trigger: ["input"],
    type: "string",
  },
  secondary_color: {
    required: true,
    message: "El color secundario es opcional",
    trigger: ["input"],
    type: "string",
  },
  document_type_id: {
    required: true,
    message: "El tipo de documento es requerido",
    trigger: ["input"],
    type: "number",
  },
  city_id: {
    required: true,
    message: "La ciudad es requerida",
    trigger: ["input"],
    type: "number",
  },
  plan_id: {
    required: true,
    message: "El plan es requerido",
    trigger: ["input"],
    type: "number",
  },
});


export const rulesChangePlan: () => FormRules = () => ({
  plan_id: {
    required: true,
    message: "El plan es requerido",
    trigger: ["input"],
    type: "number",
  },
});