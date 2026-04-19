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
    headers.set(
      'cookie',
      Array.from(jar.entries())
        .map(([k, v]) => `${k}=${v}`)
        .join('; '),
    );
  }

  const res = await fetch(`${base}${path}`, {
    ...options,
    headers,
    redirect: 'manual',
  });

  const setCookies = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
  for (const sc of setCookies) {
    const p = parseSetCookie(sc);
    if (p) jar.set(p.name, p.value);
  }

  const text = await res.text();
  return { res, text, jar };
}

async function main() {
  const report = {};
  const email = `student${Math.floor(Math.random() * 1000000)}@example.com`;
  const password = 'Test@12345';
  const regNo = `REG${Math.floor(Math.random() * 1000000)}`;
  report.email = email;

  const reg = await request('/api/auth/register', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      name: 'Student Setup Test',
      email,
      password,
      registerNumber: regNo,
      department: 'Information Technology',
      batch: '2027',
      cgpa: '8.7',
    }),
  });
  report.register = reg.res.status;

  const jar = new Map();
  const csrf = await request('/api/auth/csrf', { method: 'GET' }, jar);
  const token = JSON.parse(csrf.text).csrfToken;
  const body = new URLSearchParams({
    csrfToken: token,
    email,
    password,
    callbackUrl: `${base}/student`,
    json: 'true',
  }).toString();

  const login = await request('/api/auth/callback/credentials', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  }, jar);
  report.login = login.res.status;

  const beforeStudent = await request('/student', { method: 'GET' }, jar);
  report.studentBeforeSetup = beforeStudent.res.status;
  report.studentBeforeSetupLocation = beforeStudent.res.headers.get('location') || '';

  const setup = await request('/api/profile', {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ interests: ['SOFTWARE_DEV', 'AI_ML'] }),
  }, jar);
  report.setupProfile = setup.res.status;

  const pages = ['/student', '/student/drives', '/student/applications'];
  for (const p of pages) {
    const r = await request(p, { method: 'GET' }, jar);
    report[`after_${p.replaceAll('/', '_')}`] = r.res.status;
  }

  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
