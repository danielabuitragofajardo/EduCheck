// EduCheck - Utilidades compartidas para el frontend
const EduCheck = {
  API_BASE: "",

  storageKey: "educheck_user",

  getUser: function () {
    try {
      const raw = sessionStorage.getItem(EduCheck.storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  setUser: function (user) {
    sessionStorage.setItem(EduCheck.storageKey, JSON.stringify(user));
  },

  clearUser: function () {
    sessionStorage.removeItem(EduCheck.storageKey);
  },

  login: async function (username, password) {
    const res = await fetch(EduCheck.API_BASE + "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ username: username, password: password })
    });
    const data = await res.json().catch(function () { return null; });
    if (!res.ok) {
      throw new Error((data && data.message) ? data.message : "Credenciales inválidas");
    }
    EduCheck.setUser(data);
    return data;
  },

  logout: async function () {
    try {
      await fetch(EduCheck.API_BASE + "/api/auth/logout", { method: "POST", credentials: "same-origin" });
    } catch (e) { }
    EduCheck.clearUser();
  },

  me: async function () {
    const res = await fetch(EduCheck.API_BASE + "/api/auth/me", { method: "GET", credentials: "same-origin" });
    if (!res.ok) {
      EduCheck.clearUser();
      throw new Error("Sesión no válida");
    }
    const user = await res.json();
    EduCheck.setUser(user);
    return user;
  },

  get: async function (path) {
    const res = await fetch(EduCheck.API_BASE + path, { method: "GET", credentials: "same-origin" });
    if (res.status === 401) {
      EduCheck.clearUser();
      window.location.href = "/";
      throw new Error("Sesión no válida");
    }
    if (!res.ok) {
      let msg = "Error en la consulta";
      try { const d = await res.json(); msg = d.message || msg; } catch (e) { }
      throw new Error(msg);
    }
    return res.json();
  },

  post: async function (path, body) {
    const res = await fetch(EduCheck.API_BASE + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(body)
    });
    if (res.status === 401) {
      EduCheck.clearUser();
      window.location.href = "/";
      throw new Error("Sesión no válida");
    }
    if (!res.ok) {
      let msg = "Error en la operación";
      try { const d = await res.json(); msg = d.message || msg; } catch (e) { }
      throw new Error(msg);
    }
    return res.json();
  },

  put: async function (path, body) {
    const res = await fetch(EduCheck.API_BASE + path, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(body)
    });
    if (res.status === 401) {
      EduCheck.clearUser();
      window.location.href = "/";
      throw new Error("Sesión no válida");
    }
    if (!res.ok) {
      let msg = "Error en la operación";
      try { const d = await res.json(); msg = d.message || msg; } catch (e) { }
      throw new Error(msg);
    }
    return res.json();
  },

  remove: async function (path) {
    const res = await fetch(EduCheck.API_BASE + path, { method: "DELETE", credentials: "same-origin" });
    if (res.status === 401) {
      EduCheck.clearUser();
      window.location.href = "/";
      throw new Error("Sesión no válida");
    }
    if (!res.ok) {
      let msg = "Error en la operación";
      try { const d = await res.json(); msg = d.message || msg; } catch (e) { }
      throw new Error(msg);
    }
    return null;
  },

  // Usuarios
  getUsers: function () { return EduCheck.get("/api/users"); },
  createUser: function (data) { return EduCheck.post("/api/users", data); },
  updateUser: function (id, data) { return EduCheck.put("/api/users/" + id, data); },
  deleteUser: function (id) { return EduCheck.remove("/api/users/" + id); },

  // Visitas
  getVisitors: function () { return EduCheck.get("/api/visitors"); },
  createVisitor: function (data) { return EduCheck.post("/api/visitors", data); },
  exitVisitor: function (id) { return EduCheck.put("/api/visitors/" + id + "/exit", {}); },

  // Equipos
  getEquipment: function () { return EduCheck.get("/api/equipment"); },
  createEquipment: function (data) { return EduCheck.post("/api/equipment", data); },
  assignEquipment: function (id, idUsuario) { return EduCheck.put("/api/equipment/" + id + "/assign", { idUsuario: idUsuario }); },
  registerEquipmentIngress: function (id) { return EduCheck.put("/api/equipment/" + id + "/ingress", {}); },
  registerEquipmentExit: function (id) { return EduCheck.put("/api/equipment/" + id + "/exit", {}); },
  getEquipmentMovements: function (id) { return EduCheck.get("/api/equipment/" + id + "/movements"); },

  // Motivos de visita
  getMotivos: function () { return EduCheck.get("/api/motivos"); },
  createMotivo: function (data) { return EduCheck.post("/api/motivos", data); },
  deleteMotivo: function (id) { return EduCheck.remove("/api/motivos/" + id); },

  // Movimientos de acceso (personas)
  getAccessMovements: function () { return EduCheck.get("/api/access"); },
  registerAccessMovement: function (data) { return EduCheck.post("/api/access", data); },

  // Reportes
  getReportsUsers: function () { return EduCheck.get("/api/reports/users"); },
  getReportsVisits: function () { return EduCheck.get("/api/reports/visits"); },
  getReportsMovements: function () { return EduCheck.get("/api/reports/movements"); },
  getReportsAccess: function () { return EduCheck.get("/api/access"); }
};

// Inicialización por página
document.addEventListener("DOMContentLoaded", function () {
  const page = document.body ? document.body.getAttribute("data-page") : null;
  if (page === "main") {
    EduCheck.initMain();
  } else if (page === "login") {
    EduCheck.initLogin();
  } else if (page === "admin") {
    EduCheck.initAdmin();
  } else if (page === "vigilante") {
    EduCheck.initVigilante();
  }
});

EduCheck.initLogin = async function () {
  const form = document.getElementById("login-form");
  const errorEl = document.getElementById("login-error");
  const userEl = document.getElementById("login-user");
  const passwordEl = document.getElementById("login-password");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const username = userEl ? userEl.value.trim() : "";
      const password = passwordEl ? passwordEl.value : "";
      if (errorEl) errorEl.textContent = "";
      try {
        const user = await EduCheck.login(username, password);
        window.location.href = user.rol === "ADMIN" ? "/admin.html" : "/vigilante.html";
      } catch (err) {
        if (errorEl) errorEl.textContent = err.message || "No se pudo iniciar sesión";
      }
    });
  }
};

EduCheck.initMain = async function () {
  const user = EduCheck.getUser();
  const userInfo = document.getElementById("user-info");
  const logoutBtn = document.getElementById("logout-btn");
  const menuAdminBtn = document.getElementById("menu-admin-btn");
  const menuVigilanteBtn = document.getElementById("menu-vigilante-btn");
  const sideAdmin = document.getElementById("side-admin");
  const sideVigilante = document.getElementById("side-vigilante");

  if (!user) {
    window.location.href = "/";
    return;
  }

  if (userInfo) userInfo.textContent = (user.nombreCompleto || "") + " (Rol: " + (user.rol || "") + ")";

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async function () {
      await EduCheck.logout();
      window.location.href = "/";
    });
  }

  const toggleAdmin = function () {
    const open = sideAdmin.style.display === "block";
    sideAdmin.style.display = open ? "none" : "block";
    const arrow = menuAdminBtn ? menuAdminBtn.querySelector(".arrow") : null;
    if (arrow) arrow.textContent = open ? "▸" : "▾";
  };
  const toggleVigilante = function () {
    const open = sideVigilante.style.display === "block";
    sideVigilante.style.display = open ? "none" : "block";
    const arrow = menuVigilanteBtn ? menuVigilanteBtn.querySelector(".arrow") : null;
    if (arrow) arrow.textContent = open ? "▸" : "▾";
  };
  if (menuAdminBtn) menuAdminBtn.addEventListener("click", toggleAdmin);
  if (menuVigilanteBtn) menuVigilanteBtn.addEventListener("click", toggleVigilante);

  EduCheck.loadMainDashboard();
};

EduCheck.goAdminPanel = function () { window.location.href = "/admin.html"; };
EduCheck.goToLogin = function () { window.location.href = "/"; };
EduCheck.goAdminUsers = function () { window.location.href = "/admin.html"; };
EduCheck.goAdminReports = function () { window.location.href = "/admin.html"; };
EduCheck.goVigilanteView = function () { window.location.href = "/vigilante.html"; };
EduCheck.goVigilanteTab = function (tab) {
  try { sessionStorage.setItem("educheck_pending_tab", tab); } catch (e) { }
  window.location.href = "/vigilante.html";
};

EduCheck.loadMainDashboard = async function () {
  const cardTotal = document.getElementById("card-total");
  const cardAprendices = document.getElementById("card-aprendices");
  const cardInstructores = document.getElementById("card-instructores");
  const cardFuncionarios = document.getElementById("card-funcionarios");
  const cardVisitantes = document.getElementById("card-visitantes");

  try {
    const movements = await EduCheck.getAccessMovements();
    const users = await EduCheck.getUsers();
    const visitors = await EduCheck.getVisitors();

    EduCheck.lastMovements = movements;
    EduCheck.lastUsers = users;

    const userById = {};
    users.forEach(function (u) { if (u.idUsuario) userById[u.idUsuario] = u; });

    let aprenices = 0;
    let instructores = 0;
    let funcionarios = 0;
    movements.forEach(function (m) {
      const u = userById[m.idUsuario];
      if (!u) return;
      if (u.tipoUsuario === "APRENDIZ") aprenices++;
      else if (u.tipoUsuario === "INSTRUCTOR") instructores++;
      else if (u.tipoUsuario === "FUNCIONARIO") funcionarios++;
    });

    if (cardTotal) cardTotal.textContent = movements.length;
    if (cardAprendices) cardAprendices.textContent = aprenices;
    if (cardInstructores) cardInstructores.textContent = instructores;
    if (cardFuncionarios) cardFuncionarios.textContent = funcionarios;
    if (cardVisitantes) cardVisitantes.textContent = visitors ? visitors.length : 0;

    const container = document.getElementById("movements-table");
    if (container) {
      let html = "<table><thead><tr>" +
        "<th>ID</th><th>Usuario</th><th>Tipo</th><th>Fecha</th><th>Estado</th><th>Observación</th>" +
        "</tr></thead><tbody>";
      movements.forEach(function (m) {
        const u = userById[m.idUsuario];
        html += "<tr>" +
          "<td>" + (m.idMovimiento ? m.idMovimiento.substring(0, 8) : "") + "</td>" +
          "<td>" + (u ? (u.nombreCompleto || u.numeroDocumento || "-") : (m.idUsuario ? m.idUsuario.substring(0, 8) : "-")) + "</td>" +
          "<td>" + (m.tipo || "-") + "</td>" +
          "<td>" + (m.fechaHora || "-") + "</td>" +
          "<td>" + (u && u.estado ? u.estado : "-") + "</td>" +
          "<td>" + (m.observacion || "-") + "</td>" +
          "</tr>";
      });
      html += "</tbody></table>";
      container.innerHTML = html;
    }
  } catch (e) { }
};

EduCheck.getUserByIdForFilters = function (idUsuario) {
  const users = EduCheck.lastUsers || [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].idUsuario === idUsuario) return users[i];
  }
  return null;
};

EduCheck.getFilteredMovements = function (hora, usuario, tipo, estado) {
  const movements = EduCheck.lastMovements || [];
  const users = EduCheck.lastUsers || [];
  const userById = {};
  users.forEach(function (u) { if (u.idUsuario) userById[u.idUsuario] = u; });
  let filtered = movements;
  if (tipo) filtered = filtered.filter(function (m) { return (m.tipo || "") === tipo; });
  if (estado) filtered = filtered.filter(function (m) { const u = userById[m.idUsuario]; return u && (u.estado || "") === estado; });
  if (usuario) filtered = filtered.filter(function (m) { const u = userById[m.idUsuario]; const name = u ? (u.nombreCompleto || u.numeroDocumento || "") : (m.idUsuario || ""); return String(name).toLowerCase().indexOf(String(usuario).toLowerCase()) >= 0; });
  if (hora) filtered = filtered.filter(function (m) { return String(m.fechaHora || "").toLowerCase().indexOf(String(hora).toLowerCase()) >= 0; });
  return filtered;
};

EduCheck.applyMovementFilters = function () {
  const filtered = EduCheck.getFilteredMovements(
    (document.getElementById("mov-hora") || {}).value || "",
    (document.getElementById("mov-usuario") || {}).value || "",
    (document.getElementById("mov-tipo") || {}).value || "",
    (document.getElementById("mov-estado") || {}).value || ""
  );
  const container = document.getElementById("movements-table");
  let html = "<table><thead><tr>" +
    "<th>ID</th><th>Usuario</th><th>Tipo</th><th>Fecha</th><th>Estado</th><th>Observación</th>" +
    "</tr></thead><tbody>";
  filtered.forEach(function (m) {
    const u = EduCheck.getUserByIdForFilters(m.idUsuario);
    html += "<tr>" +
      "<td>" + (m.idMovimiento ? m.idMovimiento.substring(0, 8) : "") + "</td>" +
      "<td>" + (u ? (u.nombreCompleto || u.numeroDocumento || "-") : (m.idUsuario ? m.idUsuario.substring(0, 8) : "-")) + "</td>" +
      "<td>" + (m.tipo || "-") + "</td>" +
      "<td>" + (m.fechaHora || "-") + "</td>" +
      "<td>" + (u && u.estado ? u.estado : "-") + "</td>" +
      "<td>" + (m.observacion || "-") + "</td>" +
      "</tr>";
  });
  html += "</tbody></table>";
  if (container) container.innerHTML = html;
};


EduCheck.initAdmin = async function () {
  const user = EduCheck.getUser();
  if (!user || user.rol !== "ADMIN") {
    window.location.href = "/";
    return;
  }

  const infoEl = document.getElementById("user-info");
  if (infoEl) infoEl.textContent = user.nombreCompleto + " (Rol: " + user.rol + ")";

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async function () {
      await EduCheck.logout();
      window.location.href = "/";
    });
  }

  EduCheck.loadAdminUsers();
  EduCheck.loadAdminReports();
};

EduCheck.loadAdminUsers = async function () {
  try {
    const users = await EduCheck.getUsers();
    const container = document.getElementById("users-table");
    if (!container) return;
    let html = "<table><thead><tr>" +
      "<th>ID</th><th>Rol</th><th>Tipo</th><th>Tipo Doc.</th><th>Documento</th><th>Nombre</th><th>Estado</th><th>Acciones</th>" +
      "</tr></thead><tbody>";
    users.forEach(function (u) {
      html += "<tr>" +
        "<td>" + (u.idUsuario ? u.idUsuario.substring(0, 8) : "") + "</td>" +
        "<td>" + (u.rol || "") + "</td>" +
        "<td>" + (u.tipoUsuario || "") + "</td>" +
        "<td>" + (u.tipoDocumento || "") + "</td>" +
        "<td>" + (u.numeroDocumento || "") + "</td>" +
        "<td>" + (u.nombreCompleto || "") + "</td>" +
        "<td>" + (u.estado || "") + "</td>" +
        "<td>" +
          "<button class='btn' onclick='EduCheck.editUser(\"" + u.idUsuario + "\")'>Editar</button> " +
          "<button class='btn btn-danger' onclick='EduCheck.actionDeleteUser(\"" + u.idUsuario + "\")'>Eliminar</button>" +
        "</td>" +
      "</tr>";
    });
    html += "</tbody></table>";
    container.innerHTML = html;
  } catch (e) { }
};

EduCheck.editUser = async function (id) {
  try {
    const user = await EduCheck.get("/api/users/" + id);
    const form = document.getElementById("user-form");
    document.getElementById("user-id").value = user.idUsuario || "";
    document.getElementById("user-rol").value = user.rol || "USUARIO";
    document.getElementById("user-tipo").value = user.tipoUsuario || "APRENDIZ";
    document.getElementById("user-tipo-doc").value = user.tipoDocumento || "";
    document.getElementById("user-documento").value = user.numeroDocumento || "";
    document.getElementById("user-nombre").value = user.nombreCompleto || "";
    document.getElementById("user-estado").value = user.estado || "ACTIVO";
    document.getElementById("user-password").value = user.password || "";
  } catch (e) { alert(e.message); }
};

EduCheck.saveUser = async function () {
  const data = {
    rol: document.getElementById("user-rol").value,
    tipoUsuario: document.getElementById("user-tipo").value,
    tipoDocumento: document.getElementById("user-tipo-doc").value,
    numeroDocumento: document.getElementById("user-documento").value,
    nombreCompleto: document.getElementById("user-nombre").value,
    estado: document.getElementById("user-estado").value,
    password: document.getElementById("user-password").value
  };
  const id = document.getElementById("user-id").value;
  try {
    if (id) {
      await EduCheck.updateUser(id, data);
    } else {
      await EduCheck.createUser(data);
    }
    document.getElementById("user-form").reset();
    document.getElementById("user-id").value = "";
    await EduCheck.loadAdminUsers();
  } catch (e) { alert(e.message); }
};

EduCheck.actionDeleteUser = async function (id) {
  if (!confirm("¿Eliminar usuario?")) return;
  try {
    await EduCheck.deleteUser(id);
    await EduCheck.loadAdminUsers();
  } catch (e) { alert(e.message); }
};

EduCheck.loadAdminReports = async function () {
  const usersBtn = document.getElementById("report-users");
  const visitsBtn = document.getElementById("report-visits");
  const movementsBtn = document.getElementById("report-movements");
  const accessBtn = document.getElementById("report-access");
  const container = document.getElementById("reports-table");
  if (!container) return;

  if (usersBtn) usersBtn.addEventListener("click", async function () {
    try { container.innerHTML = JSON.stringify(await EduCheck.getReportsUsers()); } catch (e) { alert(e.message); }
  });
  if (visitsBtn) visitsBtn.addEventListener("click", async function () {
    try { container.innerHTML = JSON.stringify(await EduCheck.getReportsVisits()); } catch (e) { alert(e.message); }
  });
  if (movementsBtn) movementsBtn.addEventListener("click", async function () {
    try { container.innerHTML = JSON.stringify(await EduCheck.getReportsMovements()); } catch (e) { alert(e.message); }
  });
  if (accessBtn) accessBtn.addEventListener("click", async function () {
    try { container.innerHTML = JSON.stringify(await EduCheck.getReportsAccess()); } catch (e) { alert(e.message); }
  });
};

EduCheck.initVigilante = async function () {
  const user = EduCheck.getUser();
  if (!user || (user.rol !== "ADMIN" && user.rol !== "VIGILANTE")) {
    window.location.href = "/";
    return;
  }

  const infoEl = document.getElementById("user-info");
  if (infoEl) infoEl.textContent = user.nombreCompleto + " (Rol: " + user.rol + ")";

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async function () {
      await EduCheck.logout();
      window.location.href = "/";
    });
  }

  const pendingTab = sessionStorage.getItem("educheck_pending_tab");
  if (pendingTab) {
    const pendingBtn = document.querySelector('.tab[data-tab="' + pendingTab + '"]');
    const pendingSection = document.getElementById("tab-" + pendingTab);
    if (pendingBtn && pendingSection) {
      document.querySelectorAll(".tab").forEach(function (t) { t.classList.remove("active"); });
      document.querySelectorAll("main section").forEach(function (s) { s.style.display = "none"; });
      pendingBtn.classList.add("active");
      pendingSection.style.display = "block";
    }
    sessionStorage.removeItem("educheck_pending_tab");
  }

  EduCheck.loadVigilanteVisitas();
  EduCheck.loadVigilanteEquipos();
  EduCheck.loadVigilanteMovimientos();
  EduCheck.loadVigilanteMotivos();
  EduCheck.loadVigilanteAccess();
};

EduCheck.exitVisit = async function (id) {
  try {
    await EduCheck.exitVisitor(id);
    await EduCheck.loadVigilanteVisitas();
  } catch (e) { alert(e.message); }
};

EduCheck.loadVigilanteVisitas = async function () {
  const container = document.getElementById("visits-table");
  if (!container) return;

  try {
    const visits = await EduCheck.getVisitors();
    const motivoSelect = document.getElementById("visit-motivo");
    if (motivoSelect) {
      const motivos = await EduCheck.getMotivos();
      let options = "<option value=''>SELECCIONAR MOTIVO</option>";
      motivos.forEach(function (m) {
        options += "<option value='" + m.idMotivoVisita + "'>" + (m.nombre || "") + "</option>";
      });
      motivoSelect.innerHTML = options;
    }
    let html = "<table><thead><tr>" +
      "<th>ID</th><th>Nombre</th><th>Documento</th><th>Motivo</th><th>Fecha ingreso</th><th>Hora ingreso</th><th>Hora salida</th><th>Acción</th>" +
      "</tr></thead><tbody>";
    visits.forEach(function (v) {
      html += "<tr>" +
        "<td>" + (v.idVisitante ? v.idVisitante.substring(0, 8) : "") + "</td>" +
        "<td>" + (v.nombreCompleto || "") + "</td>" +
        "<td>" + (v.numeroDocumento || "") + "</td>" +
        "<td>" + (v.idMotivoVisita || "-") + "</td>" +
        "<td>" + (v.fechaIngreso || "-") + "</td>" +
        "<td>" + (v.horaIngreso || "-") + "</td>" +
        "<td>" + (v.horaSalida || "-") + "</td>" +
        "<td><button class='btn' onclick=\"EduCheck.exitVisit('" + v.idVisitante + "')\">Registrar salida</button></td>" +
      "</tr>";
    });
    html += "</tbody></table>";
    container.innerHTML = html;
  } catch (e) { }
};

EduCheck.loadVigilanteEquipos = async function () {
  const container = document.getElementById("equipment-table");
  const userSelect = document.getElementById("equipment-user-id");
  if (!container) return;

  try {
    const equipment = await EduCheck.getEquipment();
    let html = "<table><thead><tr>" +
      "<th>ID</th><th>Tipo</th><th>Serial</th><th>Marca</th><th>Usuario</th><th>Estado</th><th>Acciones</th>" +
      "</tr></thead><tbody>";
    equipment.forEach(function (eq) {
      const usuario = eq.idUsuario ? eq.idUsuario.substring(0, 8) : "SIN ASIGNAR";
      html += "<tr>" +
        "<td>" + (eq.idEquipo ? eq.idEquipo.substring(0, 8) : "") + "</td>" +
        "<td>" + (eq.tipo || "") + "</td>" +
        "<td>" + (eq.serial || "") + "</td>" +
        "<td>" + (eq.marca || "") + "</td>" +
        "<td>" + usuario + "</td>" +
        "<td>" + (eq.estado || "") + "</td>" +
        "<td>" +
          "<button class='btn' onclick=\"EduCheck.actionEquipmentIngress('" + eq.idEquipo + "')\">Ingreso</button> " +
          "<button class='btn' onclick=\"EduCheck.actionAssignEquipment('" + eq.idEquipo + "')\">Asignar</button> " +
          "<button class='btn' onclick=\"EduCheck.actionEquipmentExit('" + eq.idEquipo + "')\">Salida</button> " +
          "<button class='btn' onclick=\"EduCheck.showEquipmentMovements('" + eq.idEquipo + "')\">Historial</button>" +
        "</td>" +
      "</tr>";
    });
    html += "</tbody></table>";
    container.innerHTML = html;

    const assignEquipmentSelect = document.getElementById("assign-equipment-id");
    const assignUserSelect = document.getElementById("assign-user-id");
    const equipmentUserSelect = document.getElementById("equipment-user-id");

    if (assignEquipmentSelect) {
      let options = "<option value=''>SELECCIONAR EQUIPO</option>";
      equipment.forEach(function (eq) {
        options += "<option value='" + eq.idEquipo + "'>" + (eq.tipo || "") + " - " + (eq.serial || "") + "</option>";
      });
      assignEquipmentSelect.innerHTML = options;
    }
  } catch (e) { }

  try {
    const users = await EduCheck.getUsers();
    const assignUserSelect2 = document.getElementById("assign-user-id");
    const equipmentUserSelect2 = document.getElementById("equipment-user-id");
    if (assignUserSelect2) {
      let options = "<option value=''>SELECCIONAR USUARIO</option>";
      users.forEach(function (u) {
        if (u.rol === "ADMIN" || u.rol === "VIGILANTE") return;
        options += "<option value='" + u.idUsuario + "'>" + (u.nombreCompleto || "") + " (" + u.tipoUsuario + ")</option>";
      });
      assignUserSelect2.innerHTML = options;
    }
    if (equipmentUserSelect2) {
      let options = "<option value=''>SIN ASIGNAR</option>";
      users.forEach(function (u) {
        if (u.rol === "ADMIN" || u.rol === "VIGILANTE") return;
        options += "<option value='" + u.idUsuario + "'>" + (u.nombreCompleto || "") + " (" + u.tipoUsuario + ")</option>";
      });
      equipmentUserSelect2.innerHTML = options;
    }
  } catch (e) { }
};

EduCheck.actionEquipmentIngress = async function (id) {
  try { await EduCheck.registerEquipmentIngress(id); await EduCheck.loadVigilanteEquipos(); } catch (e) { alert(e.message); }
};

EduCheck.actionEquipmentExit = async function (id) {
  try { await EduCheck.registerEquipmentExit(id); await EduCheck.loadVigilanteEquipos(); } catch (e) { alert(e.message); }
};

EduCheck.actionAssignEquipment = async function (id) {
  const userId = document.getElementById("assign-user-id") ? document.getElementById("assign-user-id").value : null;
  if (!userId) { alert("Debe seleccionar un usuario"); return; }
  try { await EduCheck.assignEquipment(id, userId); await EduCheck.loadVigilanteEquipos(); } catch (e) { alert(e.message); }
};

EduCheck.showEquipmentMovements = async function (id) {
  const container = document.getElementById("movements-equipment");
  if (!container) return;
  try {
    const movements = await EduCheck.getEquipmentMovements(id);
    let html = "<table><thead><tr><th>ID</th><th>Tipo</th><th>Usuario</th><th>Fecha</th><th>Observación</th></tr></thead><tbody>";
    movements.forEach(function (m) {
      html += "<tr><td>" + (m.idMovimiento ? m.idMovimiento.substring(0, 8) : "") + "</td><td>" + (m.tipo || "") + "</td><td>" + (m.idUsuario ? m.idUsuario.substring(0, 8) : "-") + "</td><td>" + (m.fechaHora || "-") + "</td><td>" + (m.observacion || "-") + "</td></tr>";
    });
    html += "</tbody></table>";
    container.innerHTML = html;
  } catch (e) { }
};

EduCheck.loadVigilanteMovimientos = async function () {
  const container = document.getElementById("movements-all");
  if (!container) return;
  try {
    const movements = await EduCheck.getReportsMovements();
    let html = "<table><thead><tr><th>ID</th><th>Equipo</th><th>Usuario</th><th>Tipo</th><th>Fecha</th><th>Observación</th></tr></thead><tbody>";
    movements.forEach(function (m) {
      html += "<tr><td>" + (m.idMovimiento ? m.idMovimiento.substring(0, 8) : "") + "</td><td>" + (m.idEquipo ? m.idEquipo.substring(0, 8) : "-") + "</td><td>" + (m.idUsuario ? m.idUsuario.substring(0, 8) : "-") + "</td><td>" + (m.tipo || "") + "</td><td>" + (m.fechaHora || "-") + "</td><td>" + (m.observacion || "-") + "</td></tr>";
    });
    html += "</tbody></table>";
    container.innerHTML = html;
  } catch (e) { }
};

EduCheck.loadVigilanteMotivos = async function () {
  const container = document.getElementById("motivos-table");
  if (!container) return;

  try {
    const motivos = await EduCheck.getMotivos();
    let html = "<table><thead><tr><th>ID</th><th>Nombre</th><th>Descripción</th><th>Acción</th></tr></thead><tbody>";
    motivos.forEach(function (m) {
      html += "<tr><td>" + (m.idMotivoVisita ? m.idMotivoVisita.substring(0, 8) : "") + "</td><td>" + (m.nombre || "") + "</td><td>" + (m.descripcion || "") + "</td><td><button class='btn btn-danger' onclick=\"EduCheck.actionDeleteMotivo('" + m.idMotivoVisita + "')\">Eliminar</button></td></tr>";
    });
    html += "</tbody></table>";
    container.innerHTML = html;
  } catch (e) { }
};

EduCheck.actionDeleteMotivo = async function (id) {
  if (!confirm("¿Eliminar motivo?")) return;
  try { await EduCheck.deleteMotivo(id); await EduCheck.loadVigilanteMotivos(); } catch (e) { alert(e.message); }
};

EduCheck.loadVigilanteAccess = async function () {
  const container = document.getElementById("access-table");
  if (!container) return;
  try {
    const movements = await EduCheck.getAccessMovements();
    let html = "<table><thead><tr><th>ID</th><th>Usuario</th><th>Tipo</th><th>Fecha</th><th>Observación</th></tr></thead><tbody>";
    movements.forEach(function (m) {
      html += "<tr><td>" + (m.idMovimiento ? m.idMovimiento.substring(0, 8) : "") + "</td><td>" + (m.idUsuario ? m.idUsuario.substring(0, 8) : "-") + "</td><td>" + (m.tipo || "") + "</td><td>" + (m.fechaHora || "-") + "</td><td>" + (m.observacion || "-") + "</td></tr>";
    });
    html += "</tbody></table>";
    container.innerHTML = html;
  } catch (e) { }

  try {
    const users = await EduCheck.getUsers();
    const select = document.getElementById("access-user-id");
    if (select) {
      let options = "<option value=''>SELECCIONAR</option>";
      users.forEach(function (u) {
        if (u.rol === "ADMIN" || u.rol === "VIGILANTE") return;
        options += "<option value='" + u.idUsuario + "'>" + (u.nombreCompleto || "") + " (" + (u.numeroDocumento || "") + ")</option>";
      });
      select.innerHTML = options;
    }
  } catch (e) { }
};

EduCheck.saveVisit = async function (e) {
  if (e) e.preventDefault();
  const data = {
    nombreCompleto: document.getElementById("visit-nombre").value,
    tipoDocumento: document.getElementById("visit-tipo-doc").value,
    numeroDocumento: document.getElementById("visit-documento").value,
    idMotivoVisita: document.getElementById("visit-motivo").value ? document.getElementById("visit-motivo").value : null
  };
  try {
    await EduCheck.createVisitor(data);
    document.getElementById("visit-form").reset();
    await EduCheck.loadVigilanteVisitas();
  } catch (err) { alert(err.message); }
};

EduCheck.saveEquipment = async function (e) {
  if (e) e.preventDefault();
  const data = {
    tipo: document.getElementById("equipment-tipo").value,
    serial: document.getElementById("equipment-serial").value,
    marca: document.getElementById("equipment-marca").value,
    idUsuario: document.getElementById("equipment-user-id").value ? document.getElementById("equipment-user-id").value : null
  };
  try {
    await EduCheck.createEquipment(data);
    document.getElementById("equipment-form").reset();
    await EduCheck.loadVigilanteEquipos();
  } catch (err) { alert(err.message); }
};

EduCheck.saveAccess = async function (e) {
  if (e) e.preventDefault();
  const data = {
    idUsuario: document.getElementById("access-user-id").value,
    tipo: document.getElementById("access-tipo").value,
    observacion: document.getElementById("access-observacion").value
  };
  try {
    await EduCheck.registerAccessMovement(data);
    document.getElementById("access-form").reset();
    await EduCheck.loadVigilanteAccess();
  } catch (err) { alert(err.message); }
};

EduCheck.saveMotivo = async function (e) {
  if (e) e.preventDefault();
  const data = { nombre: document.getElementById("motivo-nombre").value, descripcion: document.getElementById("motivo-descripcion").value };
  try {
    await EduCheck.createMotivo(data);
    document.getElementById("motivo-form").reset();
    await EduCheck.loadVigilanteMotivos();
  } catch (err) { alert(err.message); }
};

EduCheck.assignSelectedEquipment = async function () {
  const id = document.getElementById("assign-equipment-id") ? document.getElementById("assign-equipment-id").value : null;
  const userId = document.getElementById("assign-user-id") ? document.getElementById("assign-user-id").value : null;
  if (!id) { alert("Debe seleccionar un equipo"); return; }
  if (!userId) { alert("Debe seleccionar un usuario"); return; }
  try {
    await EduCheck.assignEquipment(id, userId);
    await EduCheck.loadVigilanteEquipos();
  } catch (err) { alert(err.message); }
};
