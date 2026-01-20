import { definePreset } from '@primeuix/themes';
import { Preset, ColorScheme } from '@primeuix/themes/types';
import Aura from '@primeuix/themes/aura';

export const preset: Preset = definePreset(Aura, {
  semantic: {
    fms: {
      color1: '#546b7d',
      color2: '#00ab5f',
    },
  },
  colorScheme: {
  },
  components: {
    toolbar: {
      css: () => `
.p-toolbar {
  flex-wrap: nowrap;
}
`
    },
    megamenu: {
      css: () => `
.p-megamenu-vertical .p-megamenu-root-list {
  flex-wrap: nowrap;
  scrollbar-width: none;
}
.p-megamenu-vertical .p-megamenu-root-list::-webkit-scrollbar {
  display: none;
}
.p-megamenu-item .p-megamenu-item-active, .p-megamenu-item .p-focus {

}
`
    },
    buttongroup: {
      css: () => `
.p-buttongroup p-button:not(:last-child) .p-button, .p-buttongroup p-button:not(:last-child) .p-button:hover {
  border-right: solid 1px var(--p-fms-color1);
}
`
    }
  },
});