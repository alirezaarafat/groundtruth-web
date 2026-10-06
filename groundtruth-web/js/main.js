/* GroundTruth -- shared page behaviour */

function requireAuthOrRedirect() {
  if (!auth.isLoggedIn()) window.location.href = "login.html";
}

function showMsg(el, text, type = "err") {
  el.textContent = text;
  el.className = `form-msg show ${type}`;
}

/* ---------- login page ---------- */
function initLoginPage() {
  const form = document.getElementById("login-form");
  if (!form) return;
  const msg = document.getElementById("login-msg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value;
    const submitBtn = form.querySelector("button[type=submit]");

    submitBtn.disabled = true;
    submitBtn.textContent = "Signing in…";
    try {
      const data = await Api.login({ email, password });
      auth.setTokens(data.access, data.refresh);
      window.location.href = "dashboard.html";
    } catch (err) {
      showMsg(msg, err.message || "Couldn't sign in. Check your details and try again.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Sign in";
    }
  });
}

/* ---------- register page ---------- */
function initRegisterPage() {
  const form = document.getElementById("register-form");
  if (!form) return;
  const msg = document.getElementById("register-msg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      password: form.password.value,
    };
    const submitBtn = form.querySelector("button[type=submit]");

    submitBtn.disabled = true;
    submitBtn.textContent = "Creating account…";
    try {
      const data = await Api.register(payload);
      auth.setTokens(data.access, data.refresh);
      window.location.href = "dashboard.html";
    } catch (err) {
      showMsg(msg, err.message || "Couldn't create that account. Check the details and try again.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Create account";
    }
  });
}

/* ---------- dashboard page ---------- */
function initDashboardPage() {
  const root = document.getElementById("dash-root");
  if (!root) return;
  requireAuthOrRedirect();

  const nameEl = document.getElementById("dash-name");
  const badgeEl = document.getElementById("dash-badge");
  const areasEl = document.getElementById("dash-areas");
  const categoriesEl = document.getElementById("dash-categories");
  const logoutBtn = document.getElementById("logout-btn");

  logoutBtn.addEventListener("click", () => {
    auth.clear();
    window.location.href = "index.html";
  });

  Api.me()
    .then((user) => {
      nameEl.textContent = user.name || user.email;
      if (user.is_authority) {
        badgeEl.textContent = "Authority";
        badgeEl.style.display = "inline-flex";
      }
    })
    .catch(() => {
      auth.clear();
      window.location.href = "login.html";
    });

  Api.areas()
    .then((areas) => renderList(areasEl, areas, (a) => a.name))
    .catch(() => renderEmpty(areasEl, "Couldn't load areas right now."));

  Api.categories()
    .then((cats) => renderList(categoriesEl, cats, (c) => c.name))
    .catch(() => renderEmpty(categoriesEl, "Couldn't load categories right now."));
}

function renderList(el, items, labelFn) {
  if (!items || !items.length) return renderEmpty(el, "None added yet.");
  el.innerHTML = items
    .map((item) => `<div class="list-item"><span>${escapeHtml(labelFn(item))}</span></div>`)
    .join("");
}

function renderEmpty(el, text) {
  el.innerHTML = `<div class="empty-note">${escapeHtml(text)}</div>`;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", () => {
  initLoginPage();
  initRegisterPage();
  initDashboardPage();
});
