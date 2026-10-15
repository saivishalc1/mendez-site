// Capture a page one screen at a time (so scroll reveals fire) and report console errors + failed requests.
// Usage: tools/chrome.sh <port>, then
//   node --experimental-websocket walk.mjs <url> <width> <height> <outprefix> <port>
import { writeFileSync } from 'node:fs'
const [url, w, h, prefix, port = '9333'] = process.argv.slice(2)
const t = (await (await fetch('http://127.0.0.1:${port}/json')).json()).find((x) => x.type === 'page')
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r))
let id = 0; const p = new Map(); const errors = []; const failed = []
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (p.has(d.id)) { p.get(d.id)(d); p.delete(d.id) }
  if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception?.description?.slice(0, 200))
  if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') errors.push(d.params.args.map((a) => a.value ?? a.description).join(' ').slice(0, 200))
  if (d.method === 'Network.responseReceived' && d.params.response.status >= 400) failed.push(d.params.response.status + ' ' + d.params.response.url)
  if (d.method === 'Network.loadingFailed' && !d.params.canceled) failed.push('FAIL ' + d.params.errorText) }
const send = (method, params = {}) => new Promise((r) => { const i = ++id; p.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
const ev = async (e) => (await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true })).result.result?.value
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
await send('Runtime.enable'); await send('Network.enable')
await send('Emulation.setDeviceMetricsOverride', { width: +w, height: +h, deviceScaleFactor: 1, mobile: +w < 700 })
await send('Page.navigate', { url }); await sleep(4500)
const H = await ev('document.documentElement.scrollHeight'); let n = 0
for (let y = 0; y < H; y += +h) {
  await ev(`window.scrollTo(0, ${y})`); await sleep(1400)
  const r = await send('Page.captureScreenshot', { format: 'jpeg', quality: 62 })
  writeFileSync(`${prefix}-${String(n++).padStart(2, '0')}.jpg`, Buffer.from(r.result.data, 'base64'))
}
console.log('screens:', n, 'height:', H, '| errors:', errors.length ? errors.join(' || ') : 'none', '| failed:', failed.length ? failed.join(' || ') : 'none')
process.exit(0)
