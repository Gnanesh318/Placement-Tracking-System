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

  const res = await fetch(`${base}${path}`, { ...options, headers, redirect: 'manual' });
  const setCookies = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
  for (const sc of setCookies) {
    const parsed = parseSetCookie(sc);
    if (parsed) jar.set(parsed.name, parsed.value);
  }
  const text = await res.text();
  return { res, text };
}

async function login(email, password, jar) {
  const csrf = await request('/api/auth/csrf', { method: 'GET' }, jar);
  const csrfToken = JSON.parse(csrf.text).csrfToken;
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
  const report = {};
  const email = `student${Math.floor(Math.random() * 1000000)}@example.com`;
  const password = 'Test@12345';
  const regNo = `REG${Math.floor(Math.random() * 1000000)}`;

  await request('/api/auth/register', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      name: 'Relogin Test',
      email,
      password,
      registerNumber: regNo,
      department: 'Information Technology',
      batch: '2027',
      cgpa: '8.6',
    }),
  });

  const jar = new Map();
  await login(email, password, jar);

  const setup = await request('/api/profile', {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ interests: ['SOFTWARE_DEV'] }),
  }, jar);
  report.setupStatus = setup.res.status;

  const before = await request('/student', { method: 'GET' }, jar);
  report.beforeReloginStatus = before.res.status;
  report.beforeReloginLocation = before.res.headers.get('location') || '';

  const freshJar = new Map();
  const relogin = await login(email, password, freshJar);
  report.reloginStatus = relogin.res.status;

  const after = await request('/student', { method: 'GET' }, freshJar);
  report.afterReloginStatus = after.res.status;
  report.afterReloginLocation = after.res.headers.get('location') || '';

  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
