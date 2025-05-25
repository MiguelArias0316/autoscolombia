const apiUrls = {
  usuarios: '/usuarios',
  celdas: '/celdas',
  vehiculos: '/vehiculos'
};

let editingIds = { usuarios: null, celdas: null, vehiculos: null };

function loadAllTables() {
  loadTable('usuarios', 'usuarioTable', ['nombre', 'cedula', 'telefono', 'correo', 'tipoUsuario']);
  loadTable('celdas', 'celdaTable', ['numero', 'tipo']);
  loadTable('vehiculos', 'vehiculoTable', ['placa', 'marca','tipo']);
}

function loadTable(endpoint, tableId, fields) {
  fetch(apiUrls[endpoint])
    .then(res => res.json())
    .then(data => {
      const table = document.getElementById(tableId);
      table.innerHTML = '';
      data.forEach(item => {
        let row = `<tr><td>${item.id}</td>`;
        fields.forEach(f => row += `<td>${item[f]}</td>`);
        if (endpoint === 'celdas') {
          row += `<td>${item.estado}</td>`;
          row += `<td>${item.vehiculoPlaca || '-'}</td>`;
          row += `<td>${item.habilitada ? 'Sí' : 'No'}</td>`;
        }
        row += `<td>
                  <button class="btn btn-warning btn-sm me-1" onclick="editItem('${endpoint}', ${item.id})">Editar</button>
                  <button class="btn btn-danger btn-sm me-1" onclick="deleteItem('${endpoint}', ${item.id})">Eliminar</button>`;
        if (endpoint === 'celdas') {
          if (item.estado === 'libre') {
            row += `<button class="btn btn-success btn-sm me-1" onclick="registrarEntrada(${item.id})">Registrar Entrada</button>`;
          } else {
            row += `<button class="btn btn-primary btn-sm me-1" onclick="registrarSalida(${item.id})">Registrar Salida</button>`;
          }
          row += `<button class="btn btn-secondary btn-sm" onclick="toggleHabilitada(${item.id})">Des/Habilitar</button>`;
        }
        row += `</td></tr>`;
        table.innerHTML += row;
      });
    });
}

function deleteItem(endpoint, id) {
  fetch(`${apiUrls[endpoint]}/${id}`, { method: 'DELETE' })
    .then(() => loadAllTables());
}

function editItem(endpoint, id) {
  fetch(`${apiUrls[endpoint]}`)
    .then(res => res.json())
    .then(data => {
      const item = data.find(x => x.id == id);
      if (endpoint === 'usuarios') {
        document.getElementById('usuarioNombre').value = item.nombre;
        document.getElementById('usuarioCedula').value = item.cedula;
        document.getElementById('usuarioTelefono').value = item.telefono;
        document.getElementById('usuarioCorreo').value = item.correo;
        document.getElementById('usuarioTipo').value = item.tipoUsuario;
        editingIds.usuarios = id;
      }
      // Aquí puedes agregar editItem para celdas y vehículos después
    });
}
document.getElementById('vehiculoForm').addEventListener('submit', e => {
  e.preventDefault();
  const id = editingIds.vehiculos;
  let placa = document.getElementById('vehiculoPlaca').value.trim();
  const marca = document.getElementById('vehiculoMarca').value.trim();
  const tipo = document.getElementById('vehiculoTipo').value;

  // Si es bicicleta y placa está vacía, poner SIN PLACA
  if (tipo === 'bicicleta' && (!placa || placa === '')) {
    placa = 'SIN PLACA';
  }

  const method = id ? 'PUT' : 'POST';
  const url = id ? `${apiUrls.vehiculos}/${id}` : apiUrls.vehiculos;
  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ placa, marca, tipo })
  }).then(() => {
    e.target.reset();
    editingIds.vehiculos = null;
    loadAllTables();
  });
});

document.getElementById('usuarioForm').addEventListener('submit', e => {
  e.preventDefault();
  const id = editingIds.usuarios;
  const nombre = document.getElementById('usuarioNombre').value;
  const cedula = document.getElementById('usuarioCedula').value;
  const telefono = document.getElementById('usuarioTelefono').value;
  const correo = document.getElementById('usuarioCorreo').value;
  const tipoUsuario = document.getElementById('usuarioTipo').value;
  const method = id ? 'PUT' : 'POST';
  const url = id ? `${apiUrls.usuarios}/${id}` : apiUrls.usuarios;
  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, cedula, telefono, correo, tipoUsuario })
  }).then(() => {
    e.target.reset();
    editingIds.usuarios = null;
    loadAllTables();
  });
});

function toggleEstado(id) {
  fetch(`/celdas`)
    .then(res => res.json())
    .then(data => {
      const celda = data.find(c => c.id == id);
      const nuevoEstado = celda.estado === 'libre' ? 'ocupada' : 'libre';
      fetch(`/celdas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      }).then(() => loadAllTables());
    });
}

// Deshabilitar / habilitar celda
function toggleHabilitada(id) {
  fetch(`/celdas`)
    .then(res => res.json())
    .then(data => {
      const celda = data.find(c => c.id == id);
      const nuevoValor = !celda.habilitada;
      fetch(`/celdas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habilitada: nuevoValor })
      }).then(() => loadAllTables());
    });
}

// Submit form celdas
document.getElementById('celdaForm').addEventListener('submit', e => {
  e.preventDefault();
  const id = editingIds.celdas;
  const numero = document.getElementById('celdaNumero').value;
  const tipo = document.getElementById('celdaTipo').value;
  const method = id ? 'PUT' : 'POST';
  const url = id ? `${apiUrls.celdas}/${id}` : apiUrls.celdas;
  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ numero, tipo })
  }).then(() => {
    e.target.reset();
    editingIds.celdas = null;
    loadAllTables();
  });
});

// Editar celda (carga al formulario)
function editItem(endpoint, id) {
  fetch(`${apiUrls[endpoint]}`)
    .then(res => res.json())
    .then(data => {
      const item = data.find(x => x.id == id);
      if (endpoint === 'celdas') {
        document.getElementById('celdaNumero').value = item.numero;
        document.getElementById('celdaTipo').value = item.tipo;
        editingIds.celdas = id;
      }
      if (endpoint === 'usuarios') {
        document.getElementById('usuarioNombre').value = item.nombre;
        document.getElementById('usuarioCedula').value = item.cedula;
        document.getElementById('usuarioTelefono').value = item.telefono;
        document.getElementById('usuarioCorreo').value = item.correo;
        document.getElementById('usuarioTipo').value = item.tipoUsuario;
        editingIds.usuarios = id;
      }
    });
}

function registrarEntrada(celdaId) {
  const placa = prompt('Ingrese la placa del vehículo que ingresa:');
  if (placa) {
    fetch(`/entradas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ celdaId, placa })
    }).then(() => loadAllTables());
  }
}

function registrarSalida(celdaId) {
  fetch(`/salidas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ celdaId })
  }).then(() => loadAllTables());
}

loadAllTables();