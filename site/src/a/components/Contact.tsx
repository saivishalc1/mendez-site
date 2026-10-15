import { ArrowUpRight, Clock, Mail, MapPin, MessageSquare, Phone } from 'lucide-react'
import { useLang } from '@shared/i18n'
import { business } from '@shared/business'
import { Kicker, Reveal, Tape, Title } from './ui'

export function Contact() {
  const { t } = useLang()
  const c = t.contact
  const tel = `tel:${business.phoneE164}`
  const sms = `sms:${business.phoneE164}`
  return (
    <section id="contact" aria-labelledby="contact-title" className="surface-dark bg-ink text-bone">
      <div className="hazard" aria-hidden />
      <Tape reverse words={[...t.hero.badges, t.nav.quote]} className="h-[58px] text-[26px] md:h-[78px] md:text-[36px]" />
      <div className="wrap pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-8">
            <Kicker>{c.kicker}</Kicker>
            <Title id="contact-title" text={c.title} className="mt-6 text-[clamp(56px,8vw,128px)]" />
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-4">
            <p className="max-w-[24rem] text-[18px] leading-[1.6] text-[#c9c7bf]">{c.body}</p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-14 md:mt-20">
          <p className="label text-[11px] text-stone">{c.phoneLabel}</p>
          <a href={tel} className="giant-phone display group mt-3 flex items-end justify-between gap-4 text-vis" aria-label={`${t.nav.call} ${business.phoneDisplay}`}>
            <span className="leading-[0.86] whitespace-nowrap underline decoration-transparent decoration-[0.04em] underline-offset-[0.08em] transition-[text-decoration-color] duration-300 group-hover:decoration-vis">
              {business.phoneDisplay}
            </span>
            <ArrowUpRight className="mb-[0.06em] hidden h-[0.42em] w-[0.42em] flex-none transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2 md:block" strokeWidth={2.2} aria-hidden />
          </a>
        </Reveal>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={tel} className="btn btn-vis sm:min-w-[180px]">
            <Phone size={18} aria-hidden /> {t.nav.call}
          </a>
          <a href={sms} className="btn btn-ghost sm:min-w-[180px]">
            <MessageSquare size={18} aria-hidden /> {t.nav.text}
          </a>
        </div>

        <dl className="mt-16 grid gap-px overflow-hidden rounded-[3px] bg-line sm:grid-cols-2 lg:grid-cols-4 md:mt-24">
          <div className="bg-ink py-6 sm:pr-6 lg:py-8">
            <dt className="label flex items-center gap-2 text-[11px] text-stone">
              <Mail size={14} className="text-vis" aria-hidden /> {c.emailLabel}
            </dt>
            <dd className="mt-3">
              <a href={`mailto:${business.email}`} className="text-[17px] font-semibold break-all hover:text-vis">
                {business.email}
              </a>
            </dd>
          </div>
          <div className="bg-ink py-6 sm:px-6 lg:py-8">
            <dt className="label flex items-center gap-2 text-[11px] text-stone">
              <MapPin size={14} className="text-vis" aria-hidden /> {c.addressLabel}
            </dt>
            <dd className="mt-3 text-[17px] leading-[1.5] font-semibold">
              <address className="not-italic">
                {business.street}
                <br />
                {business.city}, {business.region} {business.zip}
              </address>
            </dd>
          </div>
          <div className="bg-ink py-6 sm:pr-6 lg:px-6 lg:py-8">
            <dt className="label flex items-center gap-2 text-[11px] text-stone">
              <Clock size={14} className="text-vis" aria-hidden /> {c.hoursLabel}
            </dt>
            <dd className="mt-3 text-[17px] font-semibold">{c.hours}</dd>
          </div>
          <div className="bg-ink py-6 sm:px-6 lg:py-8">
            <dt className="label text-[11px] text-stone">{c.facebook}</dt>
            <dd className="mt-3">
              <a href={business.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-[17px] font-semibold hover:text-vis">
                facebook.com/Cleanouts2018 <ArrowUpRight size={17} aria-hidden />
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

export function Footer() {
  const { t } = useLang()
  return (
    <footer className="surface-dark overflow-hidden bg-ink pb-24 text-bone md:pb-10">
      <div className="wrap">
        <p className="footer-mark display -mx-[0.02em] leading-[0.8] whitespace-nowrap select-none" aria-hidden>
          MENDEZ-VASQUEZ
        </p>
        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 text-[13px] text-stone md:flex-row md:items-center md:justify-between">
          <p className="label text-[11px] text-vis">{t.footer.tagline}</p>
          <p>
            © {new Date().getFullYear()} {business.name}. {t.footer.rights} {t.footer.credits}
          </p>
        </div>
      </div>
    </footer>
  )
}
