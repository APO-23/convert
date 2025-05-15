// === 🎥 Асинхронная конвертация ===
function startConversion() {
  const fileInput = document.querySelector('input[type="file"]');
  const format = document.getElementById('format')?.value;
  const resultDiv = document.getElementById('conversionResult');
  const errorMsg = document.getElementById('errorMessage');
  const counterDisplay = document.getElementById('conversionCounter');

  if (!resultDiv || !errorMsg) return;

  resultDiv.innerHTML = "";
  errorMsg.style.display = "none";

  const isLoggedIn = localStorage.getItem("userEmail") !== null;

  if (!fileInput || !fileInput.files.length) {
    errorMsg.textContent = "Пожалуйста, выберите файл для конвертации.";
    errorMsg.style.display = "block";
    return;
  }

  if (!isLoggedIn) {
    let remaining = parseInt(localStorage.getItem("remainingConversions") || '3');

    if (remaining <= 0) {
      errorMsg.textContent = "Вы исчерпали лимит бесплатных конвертаций. Войдите в аккаунт для продолжения.";
      errorMsg.style.display = "block";
      return;
    }

    remaining--;
    localStorage.setItem("remainingConversions", remaining);

    if (counterDisplay) {
      counterDisplay.textContent = `Осталось ${remaining} конвертации`;
    }

    if (remaining === 0) {
      errorMsg.textContent = "Вы исчерпали лимит бесплатных конвертаций. Войдите в аккаунт для продолжения.";
      errorMsg.style.display = "block";
    }
  }

  const file = fileInput.files[0];
  resultDiv.innerHTML = `<p>Файл "${file.name}" будет сконвертирован в формат <strong>${format?.toUpperCase()}</strong>. (Функционал в разработке)</p>`;
}


document.addEventListener("DOMContentLoaded", function () {
  // === ИНИЦИАЛИЗАЦИЯ ПЕРЕМЕННЫХ ===
  const header = document.querySelector("header");
  const currentPath = window.location.pathname;
  const isMainPage = currentPath.endsWith("index.html") || currentPath === "/";
  let lastScrollTop = 0;

  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const fillFormBtn = document.getElementById("fillFormBtn");
  const conversionCounter = document.getElementById("conversionCounter");

  const authModal = document.getElementById("authModal");
  const closeBtn = document.querySelector(".close");
  const modalTitle = document.getElementById("modalTitle");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const authActionBtn = document.getElementById("authActionBtn");
  const registerBtnAction = document.getElementById("registerBtnAction");

  const toggleToRegister = document.getElementById("toggleToRegister");
  const toggleToLogin = document.getElementById("toggleToLogin");

  const regName = document.getElementById("regname");
  const regEmail = document.getElementById("regEmail");
  const regPass = document.getElementById("regPass");
  const confirmPass = document.getElementById("confirmPass");

  const errorText = document.getElementById("errorText");
  const loginError = document.getElementById("loginError");

  const dobInput = document.getElementById("dob");

  const toggleBtn = document.getElementById("toolsToggle");
  const toolsMenu = document.getElementById("toolsMenu");

  // Ограничение ввода даты рождения
  if (dobInput) {
    dobInput.addEventListener("input", function () {
      let parts = this.value.split("-");
      if (parts.length === 3) {
        parts[0] = parts[0].substring(0, 4);
        this.value = parts.join("-");
      }
    });
  }

  // Переключение пароля
  document.querySelectorAll('.toggle-password').forEach(toggle => {
    toggle.addEventListener('click', function () {
      const input = document.getElementById(this.dataset.target);
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      this.textContent = isPassword ? '🚫' : '👁️';
    });
  });

  // Плавный скролл
  function smoothScroll(targetId) {
    let targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Навигационные кнопки
  const homeBtn = document.getElementById("homeBtn");
  const aboutBtn = document.getElementById("aboutBtn");
  const contactsBtn = document.getElementById("contactsBtn");
  const convertersBtn = document.getElementById("convertersBtn");

  if (homeBtn)
    homeBtn.addEventListener("click", e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

  if (aboutBtn)
    aboutBtn.addEventListener("click", e => {
      e.preventDefault();
      smoothScroll("about");
    });

  if (contactsBtn)
    contactsBtn.addEventListener("click", e => {
      e.preventDefault();
      smoothScroll("contact");
    });

  if (convertersBtn)
    convertersBtn.addEventListener("click", e => {
      e.preventDefault();
      smoothScroll("converters");
    });

  // Скрытие хедера при прокрутке
  if (isMainPage && header) {
    window.addEventListener("scroll", function () {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop <= 0) {
        header.classList.remove("hidden");
      } else if (scrollTop > lastScrollTop) {
        header.classList.add("hidden");
      } else {
        header.classList.remove("hidden");
      }
      lastScrollTop = scrollTop;
    });
  } else if (header) {
    header.classList.remove("hidden");
  }

  // Авторизация
  function updateConversionCounterVisibility() {
    const isLoggedIn = localStorage.getItem("userEmail") !== null;
    if (!conversionCounter) return;

    if (isLoggedIn) {
      conversionCounter.style.display = "none";
    } else {
      const remaining = parseInt(localStorage.getItem("remainingConversions") || "3");
      conversionCounter.style.display = "block";
      conversionCounter.textContent = `Осталось ${remaining} конвертации`;
    }
  }

  function checkLoginStatus() {
    const email = localStorage.getItem("userEmail");
    const isLoggedIn = !!email;

    loginBtn.style.display = isLoggedIn ? "none" : "inline-block";
    registerBtn.style.display = isLoggedIn ? "none" : "inline-block";
    fillFormBtn.style.display = isLoggedIn ? "inline-block" : "none";
    logoutBtn.style.display = isLoggedIn ? "inline-block" : "none";

    updateConversionCounterVisibility();
  }

  // Регистрация
  registerBtnAction.addEventListener("click", function () {
    const name = regName.value.trim();
    const email = regEmail.value.trim();
    const pass = regPass.value.trim();
    const confirm = confirmPass.value.trim();

    errorText.style.display = "none";
    loginError.style.display = "none";

    const forbiddenSymbols = /[<>"'&]/;
    const hasUppercase = /[A-Z]/;
    const hasDigit = /\d/;
    const hasSpecial = /[!@#$%^*()_+=\-{}[\]:;.,?]/;

    if (!email.includes("@gmail.com") || forbiddenSymbols.test(email)) {
      errorText.textContent = 'Email должен содержать @gmail.com и не содержать < > " \' &';
      errorText.style.display = "block";
      return;
    }
    if (pass.length < 8) {
      errorText.textContent = "Пароль должен содержать минимум 8 символов.";
      errorText.style.display = "block";
      return;
    }
    if (forbiddenSymbols.test(pass)) {
      errorText.textContent = 'Пароль не должен содержать символы: < > " \' &';
      errorText.style.display = "block";
      return;
    }
    if (!hasUppercase.test(pass)) {
      errorText.textContent = "Пароль должен содержать хотя бы одну заглавную букву.";
      errorText.style.display = "block";
      return;
    }
    if (!hasDigit.test(pass)) {
      errorText.textContent = "Пароль должен содержать хотя бы одну цифру.";
      errorText.style.display = "block";
      return;
    }
    if (!hasSpecial.test(pass)) {
      errorText.textContent = "Пароль должен содержать хотя бы один специальный символ.";
      errorText.style.display = "block";
      return;
    }
    if (pass !== confirm) {
      errorText.textContent = "Пароли не совпадают!";
      errorText.style.display = "block";
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    users.push({ email, pass });
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("userEmail", email);
    localStorage.setItem("remainingConversions", "3");

    authModal.style.display = "none";
    checkLoginStatus();
  });

  // Вход
  authActionBtn.addEventListener("click", function () {
    const email = document.getElementById("loginEmail").value.trim();
    const pass = document.getElementById("loginPass").value.trim();

    loginError.style.display = "none";

    if (!email.includes("@gmail.com") || pass.length < 8) {
      loginError.textContent = "Неверный формат email или короткий пароль.";
      loginError.style.display = "block";
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let foundUser = users.find(user => user.email === email && user.pass === pass);

    if (foundUser) {
      localStorage.setItem("userEmail", email);
      authModal.style.display = "none";
      checkLoginStatus();
    } else {
      loginError.textContent = "Неверный email или пароль. Зарегистрируйтесь.";
      loginError.style.display = "block";
    }
  });

  // Выход
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("userEmail");
    localStorage.setItem("remainingConversions", "3");
    checkLoginStatus();
  });

  // Окно авторизации
  authModal.style.display = "none";
  loginBtn.addEventListener("click", () => showModal("Вход"));
  registerBtn.addEventListener("click", () => showModal("Регистрация"));

  toggleToRegister.addEventListener("click", e => {
    e.preventDefault();
    showModal("Регистрация");
  });
  toggleToLogin.addEventListener("click", e => {
    e.preventDefault();
    showModal("Вход");
  });

  function showModal(mode) {
    authModal.style.display = "flex";
    modalTitle.innerText = mode;
    loginForm.style.display = mode === "Вход" ? "block" : "none";
    registerForm.style.display = mode === "Регистрация" ? "block" : "none";
    loginError.style.display = "none";
    errorText.style.display = "none";
  }

  closeBtn.addEventListener("click", () => (authModal.style.display = "none"));
  window.addEventListener("click", e => {
    if (e.target === authModal) authModal.style.display = "none";
  });

  // Меню/инструменты
  document.querySelectorAll(".menu-btn").forEach(btn => {
    btn.addEventListener("click", function (event) {
      let menu = this.nextElementSibling;
      menu.style.display = menu.style.display === "block" ? "none" : "block";
      event.stopPropagation();
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".menu").forEach(menu => (menu.style.display = "none"));
  });

  toggleBtn?.addEventListener("click", e => {
    e.stopPropagation();
    toolsMenu.style.display = toolsMenu.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", e => {
if (!toolsMenu.contains(e.target) && e.target !== toggleBtn) {
toolsMenu.style.display = "none";
}
});

checkLoginStatus();

// === Галерея с кнопками и свайпом ===
const gallery = document.querySelector(".gallery");
const leftBtn = document.querySelector(".gallery-btn.left");
const rightBtn = document.querySelector(".gallery-btn.right");

if (gallery && leftBtn && rightBtn) {
const images = gallery.children;
let currentIndex = 0;
const getVisibleCount = () => {
  if (window.innerWidth <= 480) return 1;
  if (window.innerWidth <= 768) return 2;
  return 3;
};

function updateGallery() {
  const visibleCount = getVisibleCount();
  const gap = parseInt(window.getComputedStyle(gallery).gap) || 20;
  const imageWidth = images[0].offsetWidth + gap;
  const maxIndex = Math.max(0, images.length - visibleCount);

  currentIndex = Math.min(currentIndex, maxIndex);
  currentIndex = Math.max(0, currentIndex);

  gallery.style.transform = `translateX(-${currentIndex * imageWidth}px)`;

  leftBtn.disabled = currentIndex === 0;
  rightBtn.disabled = currentIndex >= maxIndex;
}

rightBtn.addEventListener("click", () => {
  const visibleCount = getVisibleCount();
  if (currentIndex < images.length - visibleCount) {
    currentIndex++;
    updateGallery();
  }
});

leftBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateGallery();
  }
});

// Свайп
let touchStartX = 0;
let touchEndX = 0;

gallery.addEventListener(
  "touchstart",
  e => {
    touchStartX = e.changedTouches[0].screenX;
  },
  { passive: true }
);

gallery.addEventListener(
  "touchend",
  e => {
    touchEndX = e.changedTouches[0].screenX;
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (diff > swipeThreshold && currentIndex < images.length - getVisibleCount()) {
      currentIndex++;
      updateGallery();
    } else if (diff < -swipeThreshold && currentIndex > 0) {
      currentIndex--;
      updateGallery();
    }
  },
  { passive: true }
);

window.addEventListener("resize", updateGallery);
updateGallery();
}

// Исправление формы для мобильных устройств
const adjustFormForMobile = () => {
const formContainer = document.querySelector(".form-container");
if (!formContainer) return;
if (window.innerWidth <= 480) {
  document.body.style.paddingTop = "60px";
  header.style.padding = "8px 10px";
  header.style.height = "auto";

  formContainer.style.width = "95%";
  formContainer.style.padding = "15px 10px";

  const inputs = formContainer.querySelectorAll("input, select, textarea");
  inputs.forEach(input => {
    input.style.padding = "8px";
    input.style.fontSize = "14px";
  });
}
};

window.addEventListener("resize", adjustFormForMobile);
adjustFormForMobile();

});