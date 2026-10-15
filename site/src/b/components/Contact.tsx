import { motion, useReducedMotion } from 'motion/react'
import { useLang } from '@shared/i18n'
import { business } from '@shared/business'
import { openQuote } from '@shared/useQuote'
import { Arrow, Label, Reveal, Rule, Title, ease } from './ui'

export function Contact() {
  const { t } = useLang()
  const c = t.contact
  const reduce = useReducedMotion()
  const digits = business.phoneDisplay.split('')

  const cols = [
    { k: c.emailLabel, v: business.email, href: `mailto:${business.email}` },
    { k: c.addressLabel, v: `${business.street}\n${business.city}, ${business.region} ${business.zip}` },
    { k: c.hoursLabel, v: c.hours },
    { k: c.facebook, v: 'facebook.com/Cleanouts2018', href: business.facebook, ext: true },
  ]

  return (
    <footer id="contact" aria-labelledby="contact-title" className="on-dark relative bg-ink text-paper">
      <div className="mx-auto max-w-[1440px] px-5 pt-28 pb-32 sm:px-8 lg:px-16 lg:pt-40 lg:pb-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-14">
          <div className="lg:col-span-7">
            <Label>{c.kicker}</Label>
            <Reveal>
              <Title id="contact-title" text={c.title} className="mt-6 text-[3rem] text-paper sm:text-[4rem] lg:text-[clamp(4rem,5.6vw,5.8rem)]" />
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9 lg:pb-3">
            <p className="max-w-[24rem] text-[16px] leading-[1.6] text-paper/70">{c.body}</p>
          </Reveal>
        </div>

        <div className="mt-16 lg:mt-24">
          <p className="mb-3 text-[11px] tracking-[0.24em] text-stone-2 uppercase">{c.phoneLabel}</p>
          <a
            href={`tel:${business.phoneE164}`}
            className="group block w-fit max-w-full"
            aria-label={`${c.phoneLabel}: ${business.phoneDisplay}`}
          >
            <span aria-hidden className="display block overflow-hidden pb-[0.06em] text-[clamp(3rem,13.4vw,12rem)] leading-[0.95] tracking-[-0.035em] whitespace-nowrap text-paper transition-colors duration-500 group-hover:text-rust-soft">
              {digits.map((d, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={reduce ? false : { y: '105%' }}
                  whileInView={{ y: '0%' }}
                  viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                  transition={{ duration: 1.1, ease, delay: i * 0.03 }}
                >
                  {d === ' ' ? ' ' : d}
                </motion.span>
              ))}
            </span>
          </a>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
          <button type="button" onClick={() => openQuote()} className="btn-ink min-h-[58px] px-8">
            {t.hero.primary}
          </button>
          <a href={`sms:${business.phoneE164}`} className="link-u">
            {t.nav.text} <Arrow />
          </a>
        </div>

        <div className="mt-20 lg:mt-28">
          <Rule dark />
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {cols.map((col, i) => (
              <div key={col.k} className={`border-b border-rule-dark py-6 lg:border-b-0 lg:py-8 ${i > 0 ? 'lg:border-l lg:pl-8' : ''} sm:pr-6`}>
                <dt className="text-[11px] tracking-[0.24em] text-stone-2 uppercase">{col.k}</dt>
                <dd className="mt-3 text-[16px] leading-[1.55] whitespace-pre-line text-paper">
                  {col.href ? (
                    <a
                      href={col.href}
                      target={col.ext ? '_blank' : undefined}
                      rel={col.ext ? 'noopener noreferrer' : undefined}
                      className="inline-flex min-h-11 items-center break-all underline decoration-paper/30 underline-offset-[6px] transition-colors hover:decoration-rust-soft"
                    >
                      {col.v}
                    </a>
                  ) : (
                    col.v
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <Rule dark />
        </div>

        <div className="mt-16 flex flex-col gap-6 lg:mt-24 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-serif text-[44px] leading-none tracking-[-0.02em] lg:text-[64px]">{business.short}</p>
            <p className="mt-3 text-[11px] tracking-[0.24em] text-stone-2 uppercase">{t.footer.tagline}</p>
          </div>
          <div className="flex flex-col gap-1 text-[12px] text-stone-2 lg:items-end">
            <p>
              © {new Date().getFullYear()} {business.name}. {t.footer.rights}
            </p>
            <p>{t.footer.credits}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
