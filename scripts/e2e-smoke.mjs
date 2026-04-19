const base = 'https://placement-tracking-system-virid.vercel.app';

const report = {
  base,
};

function parseSetCookie(setCookie) {
  const [pair] = setCookie.split(';');
  const idx = pair.indexOf('=');
  if (idx === -1) return null;
  return { name: pair.slice(0, idx), value: pair.slice(idx + 1) };
}

async function request(path, options = {}, jar = new Map()) {
  const headers = new Headers(options.headers || {});
  if (jar.size > 0) {
    const cookie = Array.from(jar.entries())
      .map(([k, v]) => `${k}=${v}`)
      .join('; ');
    headers.set('cookie', cookie);
  }

  const res = await fetch(`${base}${path}`, {
    ...options,
    headers,
    redirect: options.redirect || 'manual',
  });

  const setCookies = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
  for (const sc of setCookies) {
    const parsed = parseSetCookie(sc);
    if (parsed) jar.set(parsed.name, parsed.value);
  }

  const text = await res.text();
  return { res, text, jar };
}

async function loginWithCredentials(email, password, callbackPath, jar) {
  const csrfResp = await request('/api/auth/csrf', { method: 'GET' }, jar);
  if (!csrfResp.res.ok) {
    return { ok: false, reason: `csrf_failed_${csrfResp.res.status}` };
  }
  const csrf = JSON.parse(csrfResp.text).csrfToken;

  const body = new URLSearchParams({
    csrfToken: csrf,
    email,
    password,
    callbackUrl: `${base}${callbackPath}`,
    json: 'true',
  }).toString();

  const loginResp = await request(
    '/api/auth/callback/credentials',
    {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
      redirect: 'manual',
    },
    jar,
  );

  if (loginResp.res.status !== 200 && loginResp.res.status !== 302) {
    return { ok: false, reason: `login_status_${loginResp.res.status}` };
  }

  return { ok: true };
}

async function main() {
  try {
    const health = await request('/api/health', { method: 'GET' });
    report.health = health.res.ok ? 'pass' : `fail:${health.res.status}`;
    if (health.res.ok) {
      const h = JSON.parse(health.text);
      report.healthDatabase = h.database;
    }

    const studentEmail = `student${Math.floor(Math.random() * 1000000)}@example.com`;
    const studentPassword = 'Test@12345';
    const registerNumber = `REG${Math.floor(Math.random() * 1000000)}`;
    report.studentEmail = studentEmail;

    const reg = await request('/api/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: 'E2E Student',
        email: studentEmail,
        password: studentPassword,
        registerNumber,
        department: 'Information Technology',
        batch: '2027',
        cgpa: '8.2',
      }),
    });

    report.studentRegister = reg.res.ok ? 'pass' : `fail:${reg.res.status}`;
    if (!reg.res.ok) report.studentRegisterBody = reg.text;

    const studentJar = new Map();
    const studentLogin = await loginWithCredentials(studentEmail, studentPassword, '/student', studentJar);
    report.studentLogin = studentLogin.ok ? 'pass' : `fail:${studentLogin.reason}`;

    for (const page of ['/student', '/student/setup', '/student/drives', '/student/applications']) {
      const pageResp = await request(page, { method: 'GET' }, studentJar);
      report[`page_${page.replaceAll('/', '_')}`] = pageResp.res.status === 200 ? 'pass' : `fail:${pageResp.res.status}`;
    }

    const profileGet = await request('/api/profile', { method: 'GET' }, studentJar);
    report.apiProfileGet = profileGet.res.ok ? 'pass' : `fail:${profileGet.res.status}`;
    if (!profileGet.res.ok) report.apiProfileGetBody = profileGet.text;

    const profilePut = await request(
      '/api/profile',
      {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ interests: ['SOFTWARE_DEV', 'AI_ML'] }),
      },
      studentJar,
    );
    report.apiProfilePut = profilePut.res.ok ? 'pass' : `fail:${profilePut.res.status}`;
    if (!profilePut.res.ok) report.apiProfilePutBody = profilePut.text;

    const drives = await request('/api/drives', { method: 'GET' }, studentJar);
    report.apiDrivesGet = drives.res.ok ? 'pass' : `fail:${drives.res.status}`;
    if (drives.res.ok) {
      try {
        const parsed = JSON.parse(drives.text);
        report.drivesCount = Array.isArray(parsed.drives) ? parsed.drives.length : 0;
      } catch {}
    }

    const apps = await request('/api/applications', { method: 'GET' }, studentJar);
    report.apiApplicationsGet = apps.res.ok ? 'pass' : `fail:${apps.res.status}`;
    if (apps.res.ok) {
      try {
        const parsed = JSON.parse(apps.text);
        report.applicationsCount = Array.isArray(parsed.applications) ? parsed.applications.length : 0;
      } catch {}
    }

    const adminJar = new Map();
    const adminLogin = await loginWithCredentials('admin@college.edu', 'Admin@12345', '/admin', adminJar);
    report.adminLogin = adminLogin.ok ? 'pass' : `fail:${adminLogin.reason}`;

    for (const page of ['/admin', '/admin/students', '/admin/companies', '/admin/drives']) {
      const pageResp = await request(page, { method: 'GET' }, adminJar);
      report[`page_${page.replaceAll('/', '_')}`] = pageResp.res.status === 200 ? 'pass' : `fail:${pageResp.res.status}`;
    }

    const analytics = await request('/api/admin/analytics', { method: 'GET' }, adminJar);
    report.apiAdminAnalytics = analytics.res.ok ? 'pass' : `fail:${analytics.res.status}`;
    if (!analytics.res.ok) report.apiAdminAnalyticsBody = analytics.text;

    const adminStudents = await request('/api/admin/students', { method: 'GET' }, adminJar);
    report.apiAdminStudents = adminStudents.res.ok ? 'pass' : `fail:${adminStudents.res.status}`;
    if (!adminStudents.res.ok) report.apiAdminStudentsBody = adminStudents.text;

    console.log(JSON.stringify(report, null, 2));
  } catch (err) {
    report.fatal = String(err?.stack || err);
    console.log(JSON.stringify(report, null, 2));
    process.exitCode = 1;
  }
}

main();
