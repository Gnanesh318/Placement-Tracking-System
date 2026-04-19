const base = 'https://placement-tracking-system-virid.vercel.app';

function parseSetCookie(setCookie) {
  const [pair] = setCookie.split(';');
  const idx = pair.indexOf('=');
  if (idx === -1) return null;
  return { name: pair.slice(0, idx), value: pair.slice(idx + 1) };
}

async function request(path, options = {}, jar = new Map()) {
  const headers = new Headers(options.headers || {});
  if (jar.size > 0) {
    headers.set('cookie', Array.from(jar.entries()).map(([k, v]) => `${k}=${v}`).join('; '));
  }

  const res = await fetch(`${base}${path}`, {
    ...options,
    headers,
    redirect: 'manual',
  });

  const setCookies = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
  for (const sc of setCookies) {
    const parsed = parseSetCookie(sc);
    if (parsed) jar.set(parsed.name, parsed.value);
  }

  const text = await res.text();
  return { res, text };
}

async function login(email, password, jar) {
  const csrfResp = await request('/api/auth/csrf', { method: 'GET' }, jar);
  const csrfToken = JSON.parse(csrfResp.text).csrfToken;
  const body = new URLSearchParams({
    csrfToken,
    email,
    password,
    callbackUrl: `${base}/student`,
    json: 'true',
  }).toString();

  return request('/api/auth/callback/credentials', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  }, jar);
}

async function main() {
  const email = `student${Math.floor(Math.random() * 1000000)}@example.com`;
  const password = 'Test@12345';
  const report = { email };

  await request('/api/auth/register', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      name: 'Session Update Test',
      email,
      password,
      registerNumber: `REG${Math.floor(Math.random() * 1000000)}`,
      department: 'Information Technology',
      batch: '2027',
      cgpa: '8.4',
    }),
  });

  const jar = new Map();
  const loginResp = await login(email, password, jar);
  report.loginStatus = loginResp.res.status;

  const before = await request('/student', { method: 'GET' }, jar);
  report.beforeStatus = before.res.status;
  report.beforeLocation = before.res.headers.get('location') || '';

  const setup = await request('/api/profile', {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ interests: ['SOFTWARE_DEV'] }),
  }, jar);
  report.setupStatus = setup.res.status;

  const stale = await request('/student', { method: 'GET' }, jar);
  report.afterSetupBeforeSessionUpdateStatus = stale.res.status;
  report.afterSetupBeforeSessionUpdateLocation = stale.res.headers.get('location') || '';

  const csrfAgain = await request('/api/auth/csrf', { method: 'GET' }, jar);
  const csrfTokenAgain = JSON.parse(csrfAgain.text).csrfToken;

  const sessionUpdate = await request('/api/auth/session', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      csrfToken: csrfTokenAgain,
      data: {
        user: {
          profileCompleted: true,
        },
      },
    }),
  }, jar);

  report.sessionUpdateStatus = sessionUpdate.res.status;

  const after = await request('/student', { method: 'GET' }, jar);
  report.afterSessionUpdateStatus = after.res.status;
  report.afterSessionUpdateLocation = after.res.headers.get('location') || '';

  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
