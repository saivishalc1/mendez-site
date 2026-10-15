import type { Lang } from '@shared/i18n'

/** The few UI strings this direction needs that the shared content files don't have. */
const strings = {
  en: {
    skip: 'Skip to content',
    continue: 'Continue',
    step1: 'Step 1 of 2',
    step2: 'Step 2 of 2',
    drop: 'or drop them here',
    preview: 'Your message',
  },
  es: {
    skip: 'Saltar al contenido',
    continue: 'Continuar',
    step1: 'Paso 1 de 2',
    step2: 'Paso 2 de 2',
    drop: 'o suéltelas aquí',
    preview: 'Su mensaje',
  },
} satisfies Record<Lang, Record<string, string>>

export function local(lang: Lang) {
  return strings[lang]
}
