import { Clock, Mail, MapPin, MessageSquare, Phone } from 'lucide-react'
import { useLang } from '@shared/i18n'
import { business } from '@shared/business'
import { titleLines } from './QuoteParts'
import { FacebookIcon, Kicker, MaskLines, Rise, Stripe, Wordmark } from './ui'

export function Contact() {
  const { t } = useLang()
  const c = t.contact
  const year = new Date().getFullYear()

  return (
    <footer id="contact" className="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <div className="contact-head">
          <div>
            <Kicker className="on-dark">{c.kicker}</Kicker>
            <h2 id="contact-title" className="sec-title d-cond">
              <MaskLines lines={titleLines(c.title)} />
            </h2>
          </div>
          <Rise className="sec-intro on-dark">
            <p>{c.body}</p>
          </Rise>
        </div>

        <Rise>
          <a href={`tel:${business.phoneE164}`} className="contact-phone d-wide">
            <small>{c.phoneLabel}</small>
            {business.phoneDash}
          </a>
        </Rise>
        <div className="contact-btns">
          <a href={`tel:${business.phoneE164}`} className="btn btn-red">
            <Phone size={18} aria-hidden="true" />
            {t.nav.call}
          </a>
          <a href={`sms:${business.phoneE164}`} className="btn btn-ghost">
            <MessageSquare size={18} aria-hidden="true" />
            {t.nav.text}
          </a>
        </div>
      </div>

      <Stripe className="contact-tape" />

      <div className="wrap">
        <dl className="contact-grid">
          <div>
            <dt className="flabel">
              <Mail size={15} aria-hidden="true" />
              {c.emailLabel}
            </dt>
            <dd>
              <a href={`mailto:${business.email}`}>{business.email}</a>
            </dd>
          </div>
          <div>
            <dt className="flabel">
              <MapPin size={15} aria-hidden="true" />
              {c.addressLabel}
            </dt>
            <dd>
              {business.street}
              <br />
              {business.city}, {business.region} {business.zip}
            </dd>
          </div>
          <div>
            <dt className="flabel">
              <Clock size={15} aria-hidden="true" />
              {c.hoursLabel}
            </dt>
            <dd>{c.hours}</dd>
          </div>
          <div>
            <dt className="flabel">
              <FacebookIcon size={15} />
              {c.facebook}
            </dt>
            <dd>
              <a href={business.facebook} target="_blank" rel="noopener noreferrer">
                facebook.com/Cleanouts2018
              </a>
            </dd>
          </div>
        </dl>

        <div className="foot">
          <Wordmark className="foot-mark" />
          <p className="foot-tag">{t.footer.tagline}</p>
          <p className="foot-legal">
            © {year} {business.name}. {t.footer.rights} {t.footer.credits}
          </p>
        </div>
      </div>
    </footer>
  )
}
