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
      icon: "carbon:dashboard-reference",
      routeName: "BlankPage"
    },
    {
      label: "Inquilinos",
      key: "tenant",
      icon: "fluent-mdl2:home-verify",
      permission: ["tenants-module"],
      routeName: "tenant-list"
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
    {
      label: "Clients",
      key: "client-list",
      icon: "fluent:people-community-16-regular",
      permission: ["clients-module"],
      routeName: "client-list"
    },
    {
      label: "Prestamos",
      key: "loans",
      icon: "hugeicons:money-bag-02",
      permission: ["loans-module"],
      routeName: "loans-list"
    }
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