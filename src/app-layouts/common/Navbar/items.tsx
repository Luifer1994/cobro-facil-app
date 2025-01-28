import { renderIcon } from "@/utils";
import { h } from "vue";
import { RouterLink } from "vue-router";
import { type MenuMixedOption } from "naive-ui/es/menu/src/interface";
import { validatePermission } from "@/utils/validatePermissions";

export default function getItems(
  mode: "vertical" | "horizontal",
  collapsed: boolean
): MenuMixedOption[] {
  const menuItems: Array<{
    label: string;
    key: string;
    icon: string;
    permission?: string[];
    routeName: string;
  }> = [
    {
      label: "Inicio",
      key: "BlankPage",
      icon: "heroicons:home",
      routeName: "BlankPage"
    },
    {
      label: "Inquilinos",
      key: "tenant",
      icon: "fluent:people-star-48-regular",
      permission: ["tenants-module"],
      routeName: "Tenant-list"
    },
    {
      label: "Planes",
      key: "plans-list",
      icon: "iconoir:dollar-circle",
      permission: ["plans-module"],
      routeName: "plans-list",
    },
    {
      label: "Usuarios",
      key: "user-list",
      icon: "iconoir:user",
      permission: ["users-module"],
      routeName: "user-list"
    },
  ];

  return menuItems
    .filter((item) => !item.permission || validatePermission(item.permission))
    .map((item) => ({
      label: () =>
        h(
          RouterLink,
          {
            to: {
              name: item.routeName,
            },
          },
          { default: () => item.label }
        ),
      key: item.key,
      icon: renderIcon(item.icon),
    }));
}