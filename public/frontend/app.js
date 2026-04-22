const API = "http://localhost:3000/api";


function val(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
}

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal");
    if (modal) modal.classList.add("hidden");
});

// ================= NAV =================
function mostrar(id) {
    document.querySelectorAll(".pantalla").forEach(p => p.classList.add("hidden"));
    const pantalla = document.getElementById(id);
    if (pantalla) pantalla.classList.remove("hidden");
}

// ================= MODAL =================
function abrirModal(html = "") {
    const body = document.getElementById("modal-body");
    const modal = document.getElementById("modal");
    if (body) body.innerHTML = html;
    if (modal) modal.classList.remove("hidden");
}

function cerrarModal() {
    const modal = document.getElementById("modal");
    if (modal) modal.classList.add("hidden");
}

// ================= TOAST =================
function showToast(msg, type = "error") {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.innerText = msg;
    toast.className = "toast"; 

    if (type === "success") toast.classList.add("success");
    toast.classList.remove("hidden");

    setTimeout(() => {
        toast.classList.add("hidden");
    }, 3000);
}

// ================= VALIDACIÓN =================
function validarUsuario(data) {
    const soloNumeros = /^\d+$/;
    const soloLetras = /^[a-zA-Z\s]+$/;

    if (!data.cedula || !soloNumeros.test(data.cedula) || data.cedula.length < 6) 
        return { campo: "cedula", msg: "Cédula inválida (min 6 números)" };

    if (!data.nombre || !soloLetras.test(data.nombre) || data.nombre.length < 3) 
        return { campo: "nombre", msg: "Nombre inválido" };

    if (!data.email || !data.email.includes("@")) 
        return { campo: "email", msg: "Email inválido" };

    if (!data.edad || !soloNumeros.test(data.edad) || parseInt(data.edad) < 18 || parseInt(data.edad) > 100) 
        return { campo: "edad", msg: "Edad fuera de rango (18-100)" };

    return null;
}
// ================= AUTH =================
function toggleAuth() {
    document.getElementById("loginBox").classList.toggle("hidden");
    document.getElementById("registerBox").classList.toggle("hidden");
}

async function registrar() {
    const cedula = val("regCedula");
    const nombre = val("regNombre");
    const email = val("regEmail");
    const edad = val("regEdad");

    const errorObj = validarUsuario({ cedula, nombre, email, edad });

    if (errorObj) {
        showToast(errorObj.msg);

        const mapaCampos = {
            cedula: "regCedula",
            nombre: "regNombre",
            email: "regEmail",
            edad: "regEdad"
        };

        const inputEl = document.getElementById(mapaCampos[errorObj.campo]);
        
        if (inputEl) {
            inputEl.classList.add('shake-error');
            setTimeout(() => inputEl.classList.remove('shake-error'), 500);
        }
        return;
    }

    const res = await fetch(`${API}/usuarios/registrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cedula, nombre, email, edad })
    });

    const json = await res.json();
    if (res.ok) {
        showToast("Usuario creado", "success");
        toggleAuth();
    } else {
        showToast(json.mensaje || "Error");
    }
}

async function login() {
    const cedula = val("loginCedula");
    const inputEl = document.getElementById("loginCedula");

    if (!cedula) {
        showToast("Ingresa cédula");
        inputEl.classList.add('shake-error');
        setTimeout(() => inputEl.classList.remove('shake-error'), 500);
        return;
    }

    try {
        const res = await fetch(`${API}/usuarios/listar`);
        const json = await res.json();
        const user = json.resultado.find(u => u.cedula === cedula);

        if (!user) {
            showToast("Usuario no existe");
            inputEl.classList.add('shake-error');
            setTimeout(() => inputEl.classList.remove('shake-error'), 500);
            return;
        }

        showToast("Bienvenido " + user.nombre, "success");
        document.getElementById("auth").classList.add("hidden");
        document.getElementById("app").classList.remove("hidden");
        mostrar("usuarios");
    } catch (e) {
        showToast("Error de conexión");
    }
}

// ================= ELIMINAR / USUARIOS =================
async function abrirEliminarUsuarios() {
    const res = await fetch(`${API}/usuarios/listar`);
    const json = await res.json();
    window.usuariosCache = json.resultado;

    const html = `
        <input id="buscadorEliminar" placeholder="Buscar usuario..." onkeyup="filtrarEliminar()">
        <div id="listaEliminar" style="margin-top: 15px;">
        ${json.resultado.map(u => `
            <div class="card">
                <span>${u.nombre} - ${u.cedula}</span>
                <button onclick="confirmarEliminar('${u.cedula}')" style="background:var(--danger); color:white;">Eliminar</button>
            </div>
        `).join("")}
        </div>
    `;
    abrirModal(html);
}


function confirmarEliminar(cedula) {
    if (confirm("¿Seguro que quieres eliminar este usuario?")) borrarUsuarioPorCedula(cedula);
}

async function borrarUsuarioPorCedula(ced) {
    if (!ced) {
        showToast("Error: No se recibió la cédula");
        return;
    }

    const url = `${API}/usuarios/borrar/${ced}`;
    console.log("Intentando borrar en la URL:", url); 

    try {
        const res = await fetch(url, { 
            method: "DELETE" 
        });
        
        if (res.ok) {
            showToast("Usuario eliminado", "success");
            cerrarModal();
            listarUsuarios();
        } else {
            const errorData = await res.json();
            showToast(errorData.mensaje || "Error al borrar");
        }
    } catch (e) {
        showToast("Error de conexión");
        console.error("Detalle del error:", e);
    }
}

async function crearUsuario() {
    const data = { cedula: val("cedula"), nombre: val("nombre"), email: val("email"), edad: val("edad") };
    const error = validarUsuario(data);
    if (error) return showToast(error);

    const res = await fetch(`${API}/usuarios/registrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    const json = await res.json();
    showToast(json.mensaje, res.ok ? "success" : "error");
}

async function listarUsuarios() {
    const res = await fetch(`${API}/usuarios/listar`);
    const json = await res.json();
    const lista = document.getElementById("listaUsuarios");

    if (!lista) return;

    lista.innerHTML = json.resultado.map(u => {
        const capturas = u.Capturados || [];

        return `
        <div class="card" style="flex-direction: column; align-items: flex-start;">
            <div>
                <b>${u.nombre}</b><br>
                <small style="color: var(--text-muted)">${u.email} • ${u.cedula}</small>
            </div>
            
            <div class="grid-pokemon">
                ${capturas.length > 0 
                    ? capturas.map(c => {
                        const p = c.Pokemon;
                        return `
                            <div class="poke-card">
                                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p ? p.pokeApiId : '0'}.png" alt="${p ? p.nombre : '?'}">
                                <p>${p ? p.nombre : 'Desconocido'}</p>
                                <small>${p ? p.tipo : '-'}</small>
                            </div>
                        `;
                    }).join("") 
                    : '<div class="empty-state">No tiene Pokémon capturados</div>'
                }
            </div>
        </div>
        `;
    }).join("");
}

async function listarPokemon() {
    const res = await fetch(`${API}/pokemon/listar`);
    const json = await res.json();
    abrirModal(`<h3>Pokémon Registrados</h3>` + json.resultado.map(p => `<div class="card">${p.nombre} <b>(${p.tipo})</b> - Poder: ${p.poder}</div>`).join(""));
}

// ================= POKEAPI / CAPTURA =================
async function cargarPokeAPI() {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100");
    const data = await res.json();
    const container = document.getElementById("pokeAPI");
    container.innerHTML = "Cargando...";

    let html = "";
    for (let p of data.results) {
        const poke = await fetch(p.url).then(r => r.json());
        const tipoReal = poke.types[0].type.name;

        html += `
            <div class="card" style="flex-direction:column; align-items:center;">
                <img src="${poke.sprites.front_default}" style="width:80px;">
                <b>${poke.name.toUpperCase()}</b>
                <button onclick="capturar(${poke.id}, '${poke.name}', '${tipoReal}')" style="margin-top:10px;">Capturar</button>
            </div>
        `;
    }
    container.innerHTML = html;
}

async function capturar(id, nombre, tipo) {
    const cedula = val("cedulaC");
    if (!cedula) return showToast("Ingresa cédula del entrenador");

    const res = await fetch(`${API}/capturado/capturar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            pokemonId: id,
            usuarioCedula: cedula,
            nombre: nombre,
            tipo: tipo 
        })
    });

    const json = await res.json();
    showToast(res.ok ? `Capturado: ${nombre}` : json.mensaje, res.ok ? "success" : "error");
}

