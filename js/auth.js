// auth.js
// Lógica de UX para el login + mock de autenticación
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const user = document.getElementById("username");
  const pwd = document.getElementById("password");
  const toggle = document.getElementById("togglePwd");
  const errorMsg = document.getElementById("loginErrorMsg");

  // Si no estamos en la página de login, no hacemos nada
  if (!form || !user || !pwd || !toggle) return;

  // ===== Lista de usuarios de prueba (admins + normales) =====
  // Aquí agregas/quitas los usuarios que pueden iniciar sesión
  const USERS = [
    {
      username: "dturral",
      password: "1234",
      nombre: "David Turral",
      rol: "Admin", // será admin por rol y por username
    },
    {
      username: "samvasni",
      password: "1234",
      nombre: "Samuel Díaz",
      rol: "supervisor", // también será admin por rol
    },
    {
      username:"dgarciab",
      password:"1234",
      nombre:"Daniela García",
      rol:"Colaborador",

    },
    {
      username: "gbocanegra",
      password: "1234",
      nombre: "Gustavo Bocanegra",
      rol: "Colaborador", // usuario normal
    },
    {
      username: "ivonne",
      password: "1234",
      nombre: "Ivonne",
      rol: "Colaborador", // usuario normal
    },
  ];

  // --- Toggle de contraseña accesible ---
  toggle.addEventListener("click", () => {
    const isHidden = pwd.type === "password";
    pwd.type = isHidden ? "text" : "password";

    const icon = toggle.querySelector("i");
    if (icon) {
      icon.classList.toggle("bi-eye", !isHidden);
      icon.classList.toggle("bi-eye-slash", isHidden);
    }

    toggle.setAttribute("aria-pressed", String(isHidden));
    toggle.setAttribute(
      "aria-label",
      isHidden ? "Ocultar contraseña" : "Mostrar contraseña"
    );

    pwd.focus({ preventScroll: true });
  });

  // --- Mock de autenticación (sin backend real por ahora) ---
  function fakeLogin(usuario, password) {
    const u = USERS.find(
      (x) => x.username === usuario && x.password === password
    );

    if (!u) {
      throw new Error("CREDENCIALES_INVALIDAS");
    }

    // Lo que regresa simula la respuesta de un backend
    return {
      token: "dummy-token-123",
      username: u.username,
      nombre: u.nombre,
      rol: u.rol,
    };
  }

  function setLoading(isLoading) {
    const elements = form.querySelectorAll("button, input");
    elements.forEach((el) => (el.disabled = isLoading));
  }

  // --- Manejo de submit del formulario ---
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    form.classList.add("was-validated");
    if (!form.checkValidity()) return;

    const usuario = user.value.trim();
    const password = pwd.value.trim();

    if (errorMsg) {
      errorMsg.classList.add("d-none");
      errorMsg.textContent = "";
    }

    setLoading(true);

    try {
      // Más adelante esto se cambia por fetch('/api/auth/login', ...)
      const data = fakeLogin(usuario, password);

      // Guardar "sesión" en localStorage
      localStorage.setItem("hd_token", data.token);
      localStorage.setItem(
        "hd_usuario",
        JSON.stringify({
          username: data.username,
          nombre: data.nombre,
          rol: data.rol,
        })
      );

      // Redirigir a la primera pantalla interna real
      window.location.href = "registro.html";
    } catch (err) {
      console.error(err);
      if (errorMsg) {
        errorMsg.textContent = "Usuario o contraseña incorrectos.";
        errorMsg.classList.remove("d-none");
      } else {
        alert("Usuario o contraseña incorrectos.");
      }
    } finally {
      setLoading(false);
    }
  });

  // UX: marcar campo inválido hasta que el usuario lo toque
  form.querySelectorAll("input[required]").forEach((inp) => {
    inp.addEventListener("input", () => inp.classList.remove("is-invalid"), {
      once: true,
    });
  });

  // Foco inicial suave
  window.requestAnimationFrame(
    () => user && user.focus({ preventScroll: true })
  );
});
