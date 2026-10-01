// Tests Next's production integration using a LOCAL fake API; it does not test PHP/WordPress.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';

const site = JSON.parse(readFileSync('wordpress/examples/site.json', 'utf8'));
const page = JSON.parse(readFileSync('wordpress/examples/sample-api-response.json', 'utf8'));
let pageState = 'ok';
let siteState = 'ok';
let heading = 'Published API integration fixture';
let pageReads = 0;
const api = createServer((request, response) => {
  response.setHeader('Content-Type', 'application/json');
  if (request.url.endsWith('/site')) {
    response.statusCode = siteState === 'ok' ? 200 : 503;
    response.end(JSON.stringify(siteState === 'ok' ? site : { code: 'unavailable' }));
  } else {
    pageReads++;
    response.statusCode = pageState === 'ok' || pageState === 'invalid' ? 200 : pageState === 'missing' || pageState === 'wrong-endpoint' ? 404 : 503;
    response.end(JSON.stringify(pageState === 'ok' ? { ...page, hero: { ...page.hero, heading } } : pageState === 'missing' ? { code: 'trackier_page_not_found' } : pageState === 'invalid' ? { incomplete: true } : { code: 'rest_no_route' }));
  }
});
await new Promise((resolve) => api.listen(3981, '127.0.0.1', resolve));
const secret = randomBytes(32).toString('hex');
const app = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3982'], { env: { ...process.env, CONTENT_MODE: 'wordpress', SITE_URL: 'http://localhost:3982', SITE_INDEXABLE: 'false', WP_API_BASE_URL: 'http://127.0.0.1:3981/wp-json/trackier/v1/', WP_REVALIDATE_SECONDS: '300', REVALIDATE_SECRET: secret }, stdio: ['ignore', 'pipe', 'pipe'] });
let log = '';
app.stdout.on('data', (data) => { log += data; });
app.stderr.on('data', (data) => { log += data; });
const base = 'http://127.0.0.1:3982';
async function refresh() {
  assert.equal((await fetch(base + '/api/react/revalidate/', { method: 'POST', headers: { Authorization: `Bearer ${secret}` } })).status, 200);
}
try {
  let ready = false;
  for (let i = 0; i < 60; i++) {
    try { await fetch(base + '/react-assets/foundation.svg'); ready = true; break; } catch { await new Promise((resolve) => setTimeout(resolve, 250)); }
  }
  assert.ok(ready, log);
  await refresh();
  let response = await fetch(base + '/react-demo/');
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Published API integration fixture/);
  const reads = pageReads;
  heading = 'Freshly edited API fixture';
  response = await fetch(base + '/react-demo/');
  assert.match(await response.text(), /Published API integration fixture/);
  assert.equal(pageReads, reads, 'public cache should reuse the API response');
  assert.equal((await fetch(base + '/api/react/revalidate/', { method: 'POST', headers: { Authorization: 'Bearer incorrect' } })).status, 401);
  await refresh();
  response = await fetch(base + '/react-demo/');
  assert.match(await response.text(), /Freshly edited API fixture/);
  for (const [state, status] of [['missing', 404], ['wrong-endpoint', 500], ['outage', 500], ['invalid', 500]]) {
    pageState = state; await refresh();
    response = await fetch(base + '/react-demo/');
    assert.equal(response.status, status, state);
    assert.doesNotMatch(await response.text(), /One website\./, 'must never silently return mock content');
  }
  pageState = 'ok'; siteState = 'outage'; await refresh();
  assert.equal((await fetch(base + '/react-demo/')).status, 500);
  console.log('PASS: WordPress mode, public cache, authenticated refresh, missing content 404, bad endpoint/API/schema failures 500, no mock fallback, shared content failure.');
} catch (error) { console.error(log); throw error; }
finally { app.kill('SIGTERM'); await new Promise((resolve) => api.close(resolve)); }
