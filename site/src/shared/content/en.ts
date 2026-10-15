/**
 * English copy. `*word*` marks the one accent word per headline (rendered by rich()).
 * The Spanish file must match this shape exactly, or the build fails.
 */
export type JobId = 'basement' | 'yard' | 'apartment' | 'demolition' | 'junk' | 'other'
export type LoadId = 'quarter' | 'half' | 'threeq' | 'full' | 'unsure'
export type MediaKey =
  | 'streetTruck'
  | 'snowTruck'
  | 'dumpsterSign'
  | 'jobExcavator'
  | 'truckWhite'
  | 'jobLoaded'
  | 'crewStrapping'
  | 'truckBack'
  | 'crewTwo'
  | 'jobInterior'

export const en = {
  meta: {
    title: 'Mendez-Vasquez LLC | Cleanouts, Junk Removal & Demolition in Union City, NJ',
    description:
      'Basement, yard and apartment cleanouts, junk removal and demolition across Hudson County, NJ. Send photos for a free quote. Licensed & insured. Se habla español. (201) 723-2298.',
  },
  nav: {
    services: 'Services',
    work: 'Our work',
    process: 'How it works',
    areas: 'Areas',
    faq: 'FAQ',
    quote: 'Free quote',
    call: 'Call',
    text: 'Text us',
    menu: 'Menu',
    close: 'Close',
    language: 'Español',
    languageShort: 'ES',
  },
  hero: {
    eyebrow: 'Union City · Hudson County, NJ',
    /** Each direction uses its own headline; lines are rendered as separate rows. */
    headlines: {
      a: ['You point.', '*We haul.*'],
      b: ['Make room for', '*what’s next.*'],
      c: ['We clear', 'it all out.', '*Fast.*'],
    },
    lede: 'Basements, yards, vacant apartments and full demolition. Send a few photos and get a price, with no site visit needed.',
    primary: 'Get a free quote from photos',
    primaryShort: 'Free quote',
    secondary: 'Call or text',
    badges: ['Licensed & insured', 'Se habla español', 'Open 7 days'],
    scroll: 'Scroll',
  },
  statement: {
    kicker: 'Why people call us',
    text: 'The basement nobody has opened in years. The apartment the last tenant left full. The yard after the storm. You don’t need a plan, just a phone. We show up with the truck, the crew and the muscle, and we leave it *swept clean.*',
  },
  services: {
    kicker: 'Services',
    title: 'Whatever’s in the way, *it goes.*',
    intro: 'One crew, one truck, one price. We load, haul and dispose of it properly, so you never touch a thing.',
    cta: 'Quote this job',
    items: [
      {
        id: 'basement' as JobId,
        name: 'Basement cleanouts',
        blurb: 'Years of storage, boxes, old furniture and water-damaged stuff, carried up and out.',
        includes: ['Boxes & storage', 'Old furniture', 'Flood & water damage', 'Shelving & debris'],
        media: 'jobLoaded' as MediaKey,
      },
      {
        id: 'yard' as JobId,
        name: 'Yard cleanouts',
        blurb: 'Branches, soil, broken fences, old sheds and everything piled up out back.',
        includes: ['Brush & branches', 'Soil & rubble', 'Fences & sheds', 'Storm cleanup'],
        media: 'jobExcavator' as MediaKey,
      },
      {
        id: 'apartment' as JobId,
        name: 'Vacant apartments',
        blurb: 'Tenant left it full? We empty the unit fast so you can paint, list and rent again.',
        includes: ['Move-out leftovers', 'Furniture & mattresses', 'Kitchen & closets', 'Broom-swept finish'],
        media: 'crewStrapping' as MediaKey,
      },
      {
        id: 'demolition' as JobId,
        name: 'Demolition',
        blurb: 'Interior gut-outs down to the studs, plus the debris hauled away the same visit.',
        includes: ['Kitchens & baths', 'Drywall & plaster', 'Flooring & tile', 'Debris haul-away'],
        media: 'jobInterior' as MediaKey,
      },
      {
        id: 'junk' as JobId,
        name: 'Junk removal',
        blurb: 'A single couch or a whole house: appliances, mattresses, electronics and more.',
        includes: ['Appliances', 'Mattresses', 'Electronics', 'Single items'],
        media: 'truckBack' as MediaKey,
      },
    ],
  },
  process: {
    kicker: 'How it works',
    title: 'Three steps. *Zero* heavy lifting.',
    steps: [
      { n: '01', title: 'Send photos', body: 'Snap the space and send it by text, WhatsApp or the form. Tell us the town.' },
      { n: '02', title: 'Get your price', body: 'We look at how much truck space it takes and send you a clear price. No surprises at pickup.' },
      { n: '03', title: 'We haul it all', body: 'The crew loads everything, hauls it away and sweeps up. You just point.' },
    ],
  },
  work: {
    kicker: 'Our work',
    title: 'Real jobs. *Real trucks.*',
    body: 'No stock photos here: these are our crews and our trucks on jobs around Hudson County.',
    items: [
      { media: 'streetTruck' as MediaKey, caption: 'Loaded and strapped on a brownstone block' },
      { media: 'snowTruck' as MediaKey, caption: 'Rain, snow or shine' },
      { media: 'jobInterior' as MediaKey, caption: 'Interior gut-out down to the studs' },
      { media: 'jobExcavator' as MediaKey, caption: 'Yard regrade with excavator assist' },
      { media: 'crewTwo' as MediaKey, caption: 'The crew' },
      { media: 'truckWhite' as MediaKey, caption: 'Fleet ready to roll' },
      { media: 'jobLoaded' as MediaKey, caption: 'A full cleanout, one trip' },
      { media: 'dumpsterSign' as MediaKey, caption: 'Debris & junk removal, fully licensed & insured' },
    ],
  },
  quote: {
    kicker: 'Free quote',
    title: 'Send photos. *Get a price.*',
    sub: 'No site visit needed. Most quotes come back fast.',
    jobLabel: 'What are we hauling?',
    jobs: [
      { id: 'basement' as JobId, label: 'Basement' },
      { id: 'yard' as JobId, label: 'Yard' },
      { id: 'apartment' as JobId, label: 'Apartment' },
      { id: 'demolition' as JobId, label: 'Demolition' },
      { id: 'junk' as JobId, label: 'Junk items' },
      { id: 'other' as JobId, label: 'Other' },
    ],
    loadLabel: 'About how much?',
    loads: [
      { id: 'quarter' as LoadId, label: '¼ truck', hint: 'A few items', fill: 0.25 },
      { id: 'half' as LoadId, label: '½ truck', hint: 'One room', fill: 0.5 },
      { id: 'threeq' as LoadId, label: '¾ truck', hint: 'Basement', fill: 0.75 },
      { id: 'full' as LoadId, label: 'Full truck', hint: 'Whole unit', fill: 1 },
      { id: 'unsure' as LoadId, label: 'Not sure', hint: 'We’ll tell you', fill: 0 },
    ],
    photosLabel: 'Photos',
    photosHint: 'Add a few photos of the space. They stay on your phone until you send.',
    addPhotos: 'Add photos',
    addMore: 'Add more',
    removePhoto: 'Remove photo',
    nameLabel: 'Your name',
    phoneLabel: 'Phone',
    townLabel: 'Town or ZIP',
    whenLabel: 'When?',
    whenOptions: ['As soon as possible', 'This week', 'Next week', 'Just pricing for now'],
    notesLabel: 'Anything else?',
    notesPlaceholder: 'Stairs, parking, building access, heavy items…',
    submit: 'Get my free quote',
    sending: 'Sending…',
    required: 'Required',
    phoneInvalid: 'Enter a phone number we can text',
    chooseTitle: 'Almost done. How should we reply?',
    chooseBody: 'Your request is written for you. Pick an app, then attach your photos in the chat.',
    viaText: 'Send by text',
    viaWhatsApp: 'Send on WhatsApp',
    viaEmail: 'Send by email',
    back: 'Edit request',
    successTitle: 'Got it. We’re on it.',
    successBody: 'We’ll text you back with a price. Need it sooner? Call us.',
    error: 'Something went wrong. Please call or text us instead.',
    privacy: 'We only use your number to send your quote.',
    messageIntro: 'Hi Mendez-Vasquez! Quote request from your website:',
    messageJob: 'Job',
    messageLoad: 'Size',
    messageTown: 'Town',
    messageWhen: 'When',
    messageName: 'Name',
    messagePhone: 'Phone',
    messageNotes: 'Notes',
    messagePhotos: 'I’ll attach photos here.',
  },
  takes: {
    kicker: 'What we take',
    title: 'If it fits on the truck, *it’s gone.*',
    yes: ['Furniture & mattresses', 'Appliances', 'Boxes & clutter', 'Construction debris', 'Yard waste & soil', 'Electronics', 'Carpet & flooring', 'Sheds & fences'],
    noTitle: 'What we can’t take',
    no: ['Paint & chemicals', 'Propane tanks', 'Asbestos', 'Medical waste'],
    noNote: 'Not sure? Send a photo and ask.',
  },
  areas: {
    kicker: 'Areas we serve',
    title: 'Based in Union City. *All over Hudson County.*',
    body: 'Brownstone stairs, tight streets and no-parking zones are our everyday. If you’re nearby and not on the list, ask anyway.',
    towns: ['Union City', 'West New York', 'North Bergen', 'Weehawken', 'Guttenberg', 'Hoboken', 'Jersey City', 'Secaucus', 'Bayonne'],
  },
  about: {
    kicker: 'Who we are',
    title: 'A local crew with *our name on the truck.*',
    body: 'Mendez-Vasquez LLC is a local crew out of Union City. We answer our own phone, we speak English and Spanish, and every truck that shows up at your door has our name and number on the side. That’s our promise that the job gets done right.',
    facts: [
      { k: 'Licensed & insured', v: 'In New Jersey' },
      { k: 'English & Spanish', v: 'Se habla español' },
      { k: 'Open 7 days', v: 'Call or text anytime' },
    ],
  },
  faq: {
    kicker: 'FAQ',
    title: 'Good *questions.*',
    items: [
      { q: 'How do you price a job?', a: 'By how much space it takes in the truck and how hard it is to reach. Send photos and we’ll give you a clear price before we start.' },
      { q: 'Do I need to be there?', a: 'Not always. For vacant units and yards, many people let us in and leave. Just tell us how we get access.' },
      { q: 'Can you carry stuff down stairs and out of basements?', a: 'Yes. Walk-ups, basements and tight hallways are most of what we do in Hudson County.' },
      { q: 'Do you do demolition too?', a: 'Yes: interior gut-outs like kitchens, bathrooms, drywall and flooring, with the debris hauled away.' },
      { q: 'Are you licensed and insured?', a: 'Yes, we’re fully licensed and insured.' },
      { q: '¿Hablan español?', a: 'Sí. Llámenos o mándenos un texto en español.' },
    ],
  },
  contact: {
    kicker: 'Contact',
    title: 'Ready when *you are.*',
    body: 'Call, text or send photos. We answer seven days a week.',
    phoneLabel: 'Call or text',
    emailLabel: 'Email',
    addressLabel: 'Based in',
    hoursLabel: 'Hours',
    hours: 'Open 7 days',
    facebook: 'Facebook',
  },
  footer: {
    tagline: 'Cleanouts · Junk removal · Demolition',
    rights: 'All rights reserved.',
    credits: 'Some video: Pexels.',
  },
}

export type Content = typeof en
