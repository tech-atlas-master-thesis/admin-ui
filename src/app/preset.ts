import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

function spreadColor(color: string) {
  return {
    0: '#ffffff',
    50: `{${color}.50}`,
    100: `{${color}.100}`,
    200: `{${color}.200}`,
    300: `{${color}.300}`,
    400: `{${color}.400}`,
    500: `{${color}.500}`,
    600: `{${color}.600}`,
    700: `{${color}.700}`,
    800: `{${color}.800}`,
    900: `{${color}.900}`,
    950: `{${color}.950}`,
  };
}

export const Preset = definePreset(Aura, {
  semantic: {
    primary: spreadColor('teal'),
    surface: spreadColor('stone'),
    colorScheme: {
      dark: {
        primary: spreadColor('teal'),
        surface: spreadColor('stone'),
      },
      light: {
        primary: spreadColor('teal'),
        surface: spreadColor('stone'),
      },
    },
  },
});
