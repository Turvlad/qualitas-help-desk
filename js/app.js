// app.js
// Comportamiento global: guard de autenticación básico + logout + roles
document.addEventListener("DOMContentLoaded", () => {
  const path = location.pathname.split("/").pop() || "index.html";
  const isLoginPage = path === "" || path === "index.html";

  const token = localStorage.getItem("hd_token");

  // Si no estoy en login y no hay token, regreso a login
  if (!isLoginPage && !token) {
    window.location.href = "index.html";
    return;
  }

  // Si ya hay token y estoy en login, podrías redirigir a registro (opcional)
  if (isLoginPage && token) {
    // Si prefieres siempre mostrar login, deja esto comentado
    // window.location.href = "registro.html";
    // return;
  }

  // Logout: cualquier link que vaya a index.html limpiará la "sesión"
  document.querySelectorAll('a[href$="index.html"]').forEach((a) => {
    a.addEventListener("click", () => {
      // Si quieres que algunas ligas no hagan logout, luego afinamos con data-attrs
      localStorage.removeItem("hd_token");
      localStorage.removeItem("hd_usuario");
    });
  });

  // ===== Usuario actual + rol =====
  let currentUser = null;
  let isAdmin = false;

  const rawUser = localStorage.getItem("hd_usuario");
  if (rawUser) {
    try {
      const u = JSON.parse(rawUser);
      currentUser = u;

      const rol = (u.rol || "").toLowerCase();
      const username = (u.username || "").toLowerCase();

      // Ajusta estos roles/nombres según tu realidad
      const ADMIN_ROLES = ["admin", "administrador", "supervisor"];
      const ADMIN_USERS = ["dturral", "samvasni "];

      if (ADMIN_ROLES.includes(rol) || ADMIN_USERS.includes(username)) {
        isAdmin = true;
      }

      // Pintar nombre visible
      document.querySelectorAll("[data-usuario-nombre]").forEach((el) => {
        el.textContent = u.nombre || u.username || "Usuario";
      });

      // Pintar rol visible (si decides usarlo)
      document.querySelectorAll("[data-usuario-rol]").forEach((el) => {
        el.textContent = u.rol || el.textContent || "";
      });
    } catch (e) {
      console.error("No se pudo leer hd_usuario", e);
    }
  }

  // Exponer global para otros scripts (actividades.js, kpis.js, etc.)
  window.hdCurrentUser = currentUser;
  window.hdIsAdmin = isAdmin;

  // ===== Sidebar según rol =====
  const sidebar = document.querySelector(".sidebar");
  if (sidebar && currentUser) {
    const linkRegistro = sidebar.querySelector(
      'a.nav-link[href="registro.html"]'
    );
    const linkActividades = sidebar.querySelector(
      'a.nav-link[href="actividades.html"]'
    );
    const linkKpis = sidebar.querySelector('a.nav-link[href="kpis.html"]');
    const linkKpisAdmin = sidebar.querySelector(
      'a.nav-link[href="kpis_admin.html"]'
    );

    if (!isAdmin) {
      // Ocultar secciones solo-para-admin
      if (linkKpisAdmin) {
        linkKpisAdmin.classList.add("d-none");
      }

      // Actividades: modo "Mis actividades"
      if (linkActividades) {
        const label = linkActividades.querySelector(".nav-label");
        if (label) label.textContent = "Mis actividades";
      }

      // Si quisieras un modo ultra-simplificado:
      // - podrías ocultar linkActividades también
      // - y dejar solo Registro + Mis KPIs + Perfil
    } else {
      // Admin: aclarar que ve a todos
      if (linkActividades) {
        const label = linkActividades.querySelector(".nav-label");
        if (label) label.textContent = "Actividades colaboradores";
      }
    }
  }
});
