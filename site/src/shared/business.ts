/**
 * Business facts. Everything here comes from the public Facebook page
 * (facebook.com/Cleanouts2018) and the lettering on their trucks.
 * Anything not on those sources is listed in LAUNCH-TODO.md.
 */
export const business = {
  name: 'Mendez-Vasquez LLC',
  short: 'Mendez-Vasquez',
  phoneDisplay: '(201) 723-2298',
  phoneDash: '201-723-2298',
  phoneE164: '+12017232298',
  whatsapp: '12017232298', // confirm the crew uses WhatsApp on this number
  email: 'mendezvasquez.llc@gmail.com',
  street: '1511 Summit Ave #3',
  city: 'Union City',
  region: 'NJ',
  zip: '07087',
  facebook: 'https://www.facebook.com/Cleanouts2018/',
}

/**
 * Optional form backend (Formspree, Basin, etc.). When empty, the quote form
 * hands the request to text / WhatsApp / email instead of posting it.
 */
export const FORM_ENDPOINT = ''
