import fs from 'fs';

const base = 'https://placement-tracking-system-virid.vercel.app';
const result = { base };

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
    const parsed = parseSetCookie(sc);
    if (parsed) jar.set(parsed.name, parsed.value);
  }

  const text = await res.text();
  return { status: res.status, text, headers: res.headers };
}

async function login(email, password, callbackPath, jar) {
  const csrf = await request('/api/auth/csrf', { method: 'GET' }, jar);
  const csrfToken = JSON.parse(csrf.text).csrfToken;

  const body = new URLSearchParams({
    csrfToken,
    email,
    password,
    callbackUrl: `${base}${callbackPath}`,
    json: 'true',
  }).toString();

  return request('/api/auth/callback/credentials', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  }, jar);
}

async function run() {
  try {
    const health = await request('/api/health', { method: 'GET' });
    result.health = health.status;

    const studentEmail = `student${Math.floor(Math.random() * 1000000)}@example.com`;
    const studentPassword = 'Test@12345';
    result.studentEmail = studentEmail;

    const register = await request('/api/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: 'Final Check Student',
        email: studentEmail,
        password: studentPassword,
        registerNumber: `REG${Math.floor(Math.random() * 1000000)}`,
        department: 'Information Technology',
        batch: '2027',
        cgpa: '8.3',
      }),
    });
    result.studentRegister = register.status;

    const studentJar = new Map();
    const studentLogin = await login(studentEmail, studentPassword, '/student', studentJar);
    result.studentLogin = studentLogin.status;

    const setup = await request('/api/profile', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ interests: ['SOFTWARE_DEV', 'AI_ML'] }),
    }, studentJar);
    result.profileSetup = setup.status;

    const csrfAgain = await request('/api/auth/csrf', { method: 'GET' }, studentJar);
    const csrfAgainToken = JSON.parse(csrfAgain.text).csrfToken;
    const updateSession = await request('/api/auth/session', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        csrfToken: csrfAgainToken,
        data: { user: { profileCompleted: true } },
      }),
    }, studentJar);
    result.sessionUpdate = updateSession.status;

    const studentPage = await request('/student', { method: 'GET' }, studentJar);
    result.studentPageAfterSetup = studentPage.status;

    const adminJar = new Map();
    const adminLogin = await login('admin@college.edu', 'Admin@12345', '/admin', adminJar);
    result.adminLogin = adminLogin.status;

    const adminPage = await request('/admin', { method: 'GET' }, adminJar);
    result.adminPage = adminPage.status;

    const adminAnalytics = await request('/api/admin/analytics', { method: 'GET' }, adminJar);
    result.adminAnalytics = adminAnalytics.status;

    const bootstrapDisabled = await request('/api/admin/bootstrap?token=bootstrap-9f4c2d1e7a8b6c5d4e3f2a1b', { method: 'POST' });
    result.bootstrapEndpointStatus = bootstrapDisabled.status;
  } catch (err) {
    result.fatal = String(err?.stack || err);
  }

  fs.writeFileSync('final-check.json', JSON.stringify(result, null, 2));
}

run();
