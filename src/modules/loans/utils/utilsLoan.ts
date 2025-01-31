import type { FormRules } from "naive-ui";

export const rules: (isCreating: boolean) => FormRules = (isCreating) => ({
  amount: {
    required: true,
    message: "El monto es requerido",
    trigger: ["input"],
    type: "number",
  },
  interest_rate: {
    required: true,
    message: "El tipo de interés es requerido",
    trigger: ["input"],
    type: "number",
    min: 1,
    //no menos o igual a 0
    validator: (rule, value) => {
      if (!value) {
        return new Error("El tipo de interés es requerido");
      }
      if (value <= 0) {
        return new Error("El tipo de interés debe ser mayor a 0");
      }
      return true;
    },
  },
  //fixed, reducing
  interest_type: {
    required: true,
    message: "El tipo de interés es requerido",
    trigger: ["input"],
    type: "string",
    validator: (rule, value) => {
      if (!value) {
        return new Error("El tipo de interés es requerido");
      }
      if (value !== "fixed" && value !== "reducing") {
        return new Error("El tipo de interés debe ser 'fixed' o 'reducing'");
      }
      return true;
    },
  },
  payment_frequency: {
    required: true,
    message: "La frecuencia de pago es requerida",
    trigger: ["input"],
    type: "string",
    validator: (rule, value) => {
      if (!value) {
        return new Error("La frecuencia de pago es requerida");
      }
      if (
        value !== "daily" &&
        value !== "weekly" &&
        value !== "biweekly" &&
        value !== "monthly"
      ) {
        return new Error(
          "La frecuencia de pago debe ser 'diaria', 'semanal', 'quincenal' o 'mensual'"
        );
      }
      return true;
    },
  },
  installments_count: {
    required: true,
    message: "El número de cuotas es requerido",
    trigger: ["input"],
    type: "number",
  },
  client_id: {
    required: true,
    message: "El cliente es requerido",
    trigger: ["input"],
    type: "number",
  },
});

export interface InterestType {
  name: string;
  value: string;
}

export const interestTypes = (): InterestType[] =>
  [
    {
      name: "Fijo",
      value: "fixed",
    },
    {
      name: "Reduciendo",
      value: "reducing",
    },
  ] as InterestType[];

export interface PaymentFrequency {
  name: string;
  value: string;
}

export const paymentFrequencies = (): PaymentFrequency[] =>
  [
    {
      name: "Diaria",
      value: "daily",
    },
    {
      name: "Semanal",
      value: "weekly",
    },
    {
      name: "Bimestral",
      value: "biweekly",
    },
    {
      name: "Mensual",
      value: "monthly",
    },
  ] as PaymentFrequency[];
