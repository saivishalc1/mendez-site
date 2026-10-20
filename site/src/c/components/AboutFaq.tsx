import { useId, useState } from 'react'
import { m } from 'motion/react'
import { Plus } from 'lucide-react'
import { rich, useLang } from '@shared/i18n'
import { titleLines } from './QuoteParts'
import { Kicker, MaskLines, Rise } from './ui'

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const id = useId()
  return (
    <li className={`faq-item ${open ? 'is-open' : ''}`}>
      <h3>
        <button type="button" aria-expanded={open} aria-controls={`${id}-a`} id={`${id}-q`} onClick={onToggle}>
          <span>{q}</span>
          <Plus className="faq-ic" size={22} strokeWidth={2.5} aria-hidden="true" />
        </button>
      </h3>
      <div className="faq-a" id={`${id}-a`} role="region" aria-labelledby={`${id}-q`} data-open={open}>
        <div>
          <p>{a}</p>
        </div>
      </div>
    </li>
  )
}

export function AboutFaq() {
  const { t } = useLang()
  const ab = t.about
  const f = t.faq
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="about" className="about light" aria-labelledby="about-title">
      <div className="wrap">
        <div className="about-grid">
          <div>
            <Kicker>{ab.kicker}</Kicker>
            <h2 id="about-title" className="sec-title sec-title-md d-cond">
              <MaskLines lines={[rich(ab.title, 'acc')]} />
            </h2>
          </div>
          <div className="about-right">
            <Rise>
              <p className="about-body">{ab.body}</p>
            </Rise>
            <ul className="facts">
              {ab.facts.map((fct, i) => (
                <m.li
                  key={fct.k}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <span className="facts-k d-cond">{fct.k}</span>
                  <span className="facts-v">{fct.v}</span>
                </m.li>
              ))}
            </ul>
          </div>
        </div>

        <div id="faq" className="faq-grid">
          <div>
            <Kicker>{f.kicker}</Kicker>
            <h2 className="sec-title d-cond">
              <MaskLines lines={titleLines(f.title)} />
            </h2>
          </div>
          <ul className="faq-list">
            {f.items.map((it, i) => (
              <FaqItem key={it.q} q={it.q} a={it.a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
