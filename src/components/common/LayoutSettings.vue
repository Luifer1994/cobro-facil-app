<template>
  <div
    class="layout-settings flex items-center justify-center shadow-xl"
    :class="{ open }"
    v-if="userLogged.id"
  >
    <Transition mode="out-in" name="anim">
      <div
        class="open-btn flex items-center justify-center"
        @click="open = true"
        v-if="!open"
        key="btn"
      >
        <Icon :size="24" :name="SettingsIcon"></Icon>
      </div>

      <div class="ls-form flex flex-col" v-else key="form">
        <div class="ls-header flex items-center justify-between">
          <div class="ls-title">Configuraciones</div>
          <div class="ls-icon flex items-center">
            <Icon @click="open = false" :size="20" :name="CloseIcon"></Icon>
          </div>
        </div>
        <n-scrollbar class="ls-main">
          <div class="ls-section ls-color-selection" v-if="userLogged.id">
            <div class="ls-label">Color</div>
            <div class="color-picker-box">
              <n-color-picker
                v-model:value="darkColor"
                :modes="['hex']"
                :show-alpha="false"
                v-if="theme === ThemeEnum.Dark"
              />
              <n-color-picker
                v-model:value="lightColor"
                :modes="['hex']"
                :show-alpha="false"
                v-else
              />
            </div>
            <div class="palette flex justify-around mt-3">
              <n-button
                text
                v-for="color of palette"
                :key="color.light"
                @click="setPrimary(color)"
              >
                <template #icon>
                  <Icon
                    :color="theme === ThemeEnum.Dark ? color.dark : color.light"
                    :size="24"
                    :name="ColorIcon"
                  ></Icon>
                </template>
              </n-button>
            </div>
          </div>

          <div class="ls-section ls-theme-selection">
            <div class="ls-label">Tema</div>
            <div class="flex items-center gap-2">
              <div class="basis-1/2">
                <n-button
                  class="!w-full"
                  @click="theme = ThemeEnum.Light"
                  :type="theme === ThemeEnum.Light ? 'primary' : 'default'"
                >
                  <template #icon>
                    <Icon
                      :name="LightIcon"
                      v-if="theme === ThemeEnum.Light"
                    ></Icon>
                    <Icon :name="LightOutlineIcon" v-else></Icon>
                  </template>
                  Claro
                </n-button>
              </div>
              <div class="basis-1/2">
                <n-button
                  class="!w-full"
                  @click="theme = ThemeEnum.Dark"
                  :type="theme === ThemeEnum.Dark ? 'primary' : 'default'"
                >
                  <template #icon>
                    <Icon
                      :name="DarkIcon"
                      v-if="theme === ThemeEnum.Dark"
                    ></Icon>
                    <Icon :name="DarkOutlineIcon" v-else></Icon>
                  </template>
                  Oscuro
                </n-button>
              </div>
            </div>
          </div>

          <div class="ls-section ls-nav-selection" v-if="userLogged.id">
            <div class="ls-label">
              Barra de navegación
              <span v-if="isMobileView" class="opacity-50 px-1"
                >desktop only</span
              >
            </div>
            <div class="flex items-center gap-2">
              <div class="basis-1/2">
                <n-button
                  class="!w-full"
                  @click="layout = Layout.VerticalNav"
                  :type="layout === Layout.VerticalNav ? 'primary' : 'default'"
                  :disabled="isMobileView"
                >
                  Vertical
                </n-button>
              </div>
              <div class="basis-1/2">
                <n-button
                  class="!w-full"
                  @click="layout = Layout.HorizontalNav"
                  :type="
                    layout === Layout.HorizontalNav ? 'primary' : 'default'
                  "
                  :disabled="isMobileView"
                >
                  Horizontal
                </n-button>
              </div>
            </div>
          </div>
          <div class="ls-section ls-transition-selection" v-if="userLogged.id">
            <div class="ls-label">Transición de rutas</div>
            <div class="ls-input flex justify-between">
              <n-select
                v-model:value="routerTransition"
                :options="transitionOptions"
              ></n-select>
            </div>
          </div>

          <div class="ls-section ls-transition-selection">
            <n-button
              @click="reset"
              class="!w-full"
              :type="theme === ThemeEnum.Dark ? 'primary' : 'default'"
            >
              <span>Restablecer</span>
            </n-button>
          </div>
        </n-scrollbar>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import {
  NColorPicker,
  NButton,
  NSelect,
  NScrollbar,
} from "naive-ui";
import { useThemeStore } from "@/stores/theme";
import Icon from "@/components/common/Icon.vue";
import { Layout, RouterTransition, ThemeEnum } from "@/types/theme.d";
import { useWindowSize } from "@vueuse/core";
import { useAuthStore } from "@/modules/auth/stores/auth";

interface ColorPalette {
  light: string;
  dark: string;
}

type Palette = ColorPalette[];

const SettingsIcon = "carbon:settings-adjust";
const CloseIcon = "carbon:close";
const LightIcon = "ion:sunny";
const DarkIcon = "ion:moon";
const LightOutlineIcon = "ion:sunny-outline";
const DarkOutlineIcon = "ion:moon-outline";
const ColorIcon = "carbon:circle-solid";

const authStore = useAuthStore();
const themeStore = useThemeStore();
const { width: winWidth } = useWindowSize();
const isMobileView = computed<boolean>(() => winWidth.value < 700);
const open = ref(false);
const transitionOptions = [
  {
    label: "Desvanecer",
    value: "fade",
  },
  {
    label: "Desvanecer arriba",
    value: "fade-up",
  },
  {
    label: "Desvanecer abajo",
    value: "fade-bottom",
  },
  {
    label: "Desvanecer izquierda",
    value: "fade-left",
  },
  {
    label: "Desvanecer derecha",
    value: "fade-right",
  },
];
const userLogged = computed(() => authStore.user);

const layout = computed({
  get: () => themeStore.layout,
  set: (val) => themeStore.setLayout(val),
});

const routerTransition = computed({
  get: () => themeStore.routerTransition,
  set: (val) => themeStore.setRouterTransition(val),
});

const theme = computed({
  get: () => themeStore.themeName,
  set: (val) => themeStore.setTheme(val),
});

const darkColor = computed({
  get: () => themeStore.darkPrimaryColor,
  set: (val) => themeStore.setColor(ThemeEnum.Dark, "primary", val),
});

const lightColor = computed({
  get: () => themeStore.lightPrimaryColor,
  set: (val) => themeStore.setColor(ThemeEnum.Light, "primary", val),
});

/* const rtl = computed({
	get: () => themeStore.isRTL,
	set: val => themeStore.setRTL(val)
})

const boxed = computed({
	get: () => themeStore.isBoxed,
	set: val => themeStore.setBoxed(val)
})

const toolbarBoxed = computed({
	get: () => themeStore.isToolbarBoxed,
	set: val => themeStore.setToolbarBoxed(val)
})

const footerShown = computed({
	get: () => themeStore.isFooterShown,
	set: val => themeStore.setFooterShow(val)
}) */

const primaryTenant = computed<string>(() => themeStore.getPrimaryTenant())
const primary = ref<string>("")

watchEffect(() => {
	primary.value = primaryTenant.value ? primaryTenant.value : "#36829A";
});

const palette = ref<Palette>([
  { light: primary.value, dark: primary.value },
  { light: "#052935", dark: "#36829A" },
  { light: "#f03737", dark: "#f03737" },
  { light: "#2995ec", dark: "#2995ec" },
  { light: "#8E64D2FF", dark: "#8E64D2FF" },
]);

function setPrimary(color: ColorPalette) {
  themeStore.setColor(ThemeEnum.Dark, "primary", color.dark);
  themeStore.setColor(ThemeEnum.Light, "primary", color.light);
}

function reset() {
  themeStore.setColor(ThemeEnum.Dark, "primary", primary.value);
  themeStore.setColor(ThemeEnum.Light, "primary", primary.value);
  themeStore.setTheme(ThemeEnum.Light);
  themeStore.setLayout(Layout.VerticalNav);
  themeStore.setRouterTransition(RouterTransition.FadeUp);
  themeStore.setRTL(false);
  themeStore.setBoxed(true);
  themeStore.setToolbarBoxed(true);
  themeStore.setFooterShow(true);
}
</script>

<style scoped lang="scss">
.layout-settings {
  position: fixed;
  right: 10px;
  top: 90%;
  width: 50px;
  height: 50px;
  border-radius: 50px;
  background-color: var(--primary-color);
  color: var(--bg-color);
  transform: translateY(-66%);
  transition: all 0.3s;
  overflow: hidden;
  border: 1px solid transparent;

  .open-btn {
    cursor: pointer;
    width: 100%;
    height: 100%;
    position: absolute;
    will-change: opacity;
  }

  .ls-form {
    position: absolute;
    height: 100%;
    width: 100%;
    will-change: opacity;

    .ls-header {
      border-bottom: var(--border-small-050);
      font-size: 14px;
      text-transform: uppercase;
      font-weight: 700;
      padding: 10px 14px;
      line-height: 1;
      transition: all 0.3s;

      .ls-icon {
        cursor: pointer;
        opacity: 0.6;

        &:hover {
          opacity: 1;
          color: var(--primary-color);
        }
      }
    }

    .ls-main {
      .ls-section {
        padding: 14px 14px 0;
        font-size: 12px;
        display: flex;
        flex-direction: column;

        &:not(:last-child) {
          border-bottom: var(--border-small-050);
        }

        .ls-label {
          font-size: 12px;
          margin-bottom: 8px;
          font-weight: 600;
          color: var(--fg-secondary-color);
        }

        &.ls-color-selection {
          .color-picker-box {
            line-height: 0;

            .n-color-picker {
              height: 28px;

              :deep() {
                .n-color-picker-trigger {
                  .n-color-picker-trigger__fill {
                    left: 5px;
                    right: 5px;
                    top: 5px;
                    bottom: 5px;
                    justify-content: flex-start;
                    line-height: 0;

                    .n-color-picker-checkboard {
                      background: transparent;

                      &::after {
                        background-image: none;
                      }

                      & ~ div {
                        width: 32px;
                        border-radius: var(--border-radius-small);
                        height: 100%;
                      }
                    }

                    .n-color-picker-trigger__value {
                      color: var(--fg-color) !important;
                      margin-left: 44px;
                      font-size: 12px;
                      font-weight: 600;
                      width: initial !important;
                      height: initial !important;
                    }
                  }
                }
              }
            }
          }
        }

        &.ls-boxed-selection {
          .switch-label {
            font-size: 12px;
            font-weight: 600;
            color: var(--fg-secondary-color);
          }
        }

        &.ls-reset-selection {
          a {
            color: var(--fg-secondary-color);
            text-decoration-color: var(--fg-secondary-color);
          }
        }
      }
    }
  }

  &.open {
    width: 230px;
    height: 645px;
    right: 16px;
    border-radius: var(--border-radius);
    max-height: 90vh;
    max-height: 90svh;
    background-color: var(--bg-color);
    color: var(--fg-color);
    border-color: var(--border-color);
  }

  .anim-enter-active,
  .anim-leave-active {
    transition:
      opacity 0.1s var(--bezier-ease),
      transform 0.2s var(--bezier-ease);
  }

  .anim-enter-from,
  .anim-leave-to {
    opacity: 0;
    // transform: translateY(1%);
  }
}

.direction-rtl {
  .layout-settings {
    right: unset;
    left: 10px;

    .ls-form {
      .ls-header {
        direction: rtl;
      }

      :deep() {
        .n-color-picker {
          .n-color-picker-trigger {
            .n-color-picker-trigger__fill {
              .n-color-picker-trigger__value {
                margin-left: unset !important;
                margin-right: 44px;
              }
            }
          }
        }
      }
    }

    &.open {
      right: unset;
      left: 16px;
    }
  }
}
</style>
