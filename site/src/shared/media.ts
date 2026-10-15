import type { MediaKey } from './content/en'

/** Base-aware path to a file in /public (works on GitHub Pages sub-folders). */
export function publicUrl(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}

/**
 * Client photos from their Facebook page. Only `streetTruck` and `snowTruck` are
 * high resolution (1920px); the rest are 315px squares, so keep them small
 * (gallery tiles, service thumbnails) until the client sends originals.
 */
export const photos: Record<MediaKey, { src: string; sm?: string; w: number; h: number; alt: string; hiRes: boolean }> = {
  streetTruck: { src: publicUrl('img/street-truck.jpg'), sm: publicUrl('img/street-truck-sm.jpg'), w: 1920, h: 1440, alt: 'Mendez-Vasquez dump truck loaded with debris on a Hudson County street', hiRes: true },
  snowTruck: { src: publicUrl('img/snow-truck.jpg'), sm: publicUrl('img/snow-truck-sm.jpg'), w: 1920, h: 1440, alt: 'Mendez-Vasquez demolition and junk removal truck full of debris in the snow', hiRes: true },
  dumpsterSign: { src: publicUrl('img/dumpster-sign.jpg'), w: 315, h: 315, alt: 'Mendez-Vasquez dumpster sign: yard cleanouts, basements, vacant apartments, demolition', hiRes: false },
  jobExcavator: { src: publicUrl('img/job-excavator.jpg'), w: 315, h: 315, alt: 'Mini excavator loading soil into a Mendez-Vasquez truck', hiRes: false },
  truckWhite: { src: publicUrl('img/truck-white.jpg'), w: 315, h: 315, alt: 'White Mendez-Vasquez dump truck parked in a driveway', hiRes: false },
  jobLoaded: { src: publicUrl('img/job-loaded.jpg'), w: 315, h: 315, alt: 'Fully loaded Mendez-Vasquez truck on a residential street', hiRes: false },
  crewStrapping: { src: publicUrl('img/crew-strapping.jpg'), w: 315, h: 315, alt: 'Crew member in a safety-yellow hoodie strapping down a load', hiRes: false },
  truckBack: { src: publicUrl('img/truck-back.jpg'), w: 315, h: 315, alt: 'Back of a loaded Mendez-Vasquez truck with a ladder', hiRes: false },
  crewTwo: { src: publicUrl('img/crew-two.jpg'), w: 315, h: 315, alt: 'Two Mendez-Vasquez crew members in front of their trucks', hiRes: false },
  jobInterior: { src: publicUrl('img/job-interior.jpg'), w: 315, h: 315, alt: 'Crew member inside a room gutted down to the studs', hiRes: false },
}

/**
 * Graded stock video (Pexels, free commercial use). Mood only, never shown as "our work".
 * - dump: excavator bucket dropping debris into a red roll-off dumpster (9s, 1600px)
 * - demo: excavator claw over a pile of interior demolition debris (8s, 1280px)
 * - cityScrub: slow aerial over a snowy, dense NJ/NYC-style town; one continuous move,
 *   keyframe every 6 frames so it can be scrubbed by scroll (10s, 1280px). `mobile` plays normally.
 * - crew: crew in hard hats gutting a room to the studs (7.5s, 1280px)
 * - boxes: cardboard boxes and clutter in a dark dumpster (8s, 1280px)
 */
export const videos = {
  dump: { src: publicUrl('media/dump.mp4'), poster: publicUrl('media/dump-poster.jpg') },
  demo: { src: publicUrl('media/demo.mp4'), poster: publicUrl('media/demo-poster.jpg') },
  cityScrub: { src: publicUrl('media/city-scrub.mp4'), mobile: publicUrl('media/city-m.mp4'), poster: publicUrl('media/city-poster.jpg') },
  crew: { src: publicUrl('media/crew.mp4'), poster: publicUrl('media/crew-poster.jpg') },
  boxes: { src: publicUrl('media/boxes.mp4'), poster: publicUrl('media/boxes-poster.jpg') },
}
