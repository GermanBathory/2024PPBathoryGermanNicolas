//------CLASES---------

class Vehiculo {
    id = 0;
    modelo = "";
    anoFab = 0;
    velMax = 0;

    constructor(id, modelo, anoFab, velMax) {
        this.id = id;
        this.modelo = modelo;
        this.anoFab = anoFab;
        this.velMax = velMax;
    }

    toString() {
        return `ID: ${this.id}, Modelo: ${this.modelo}, Año Fabricacion: ${this.anoFab}, 
        Velocidad Maxima: ${this.velMax}, `;
    }
}

class Aereo extends Vehiculo {
    altMax = 0;
    autonomia = 0;

    constructor(id, modelo, anoFab, velMax, altMax, autonomia) {
        super(id, modelo, anoFab, velMax);
        this.altMax = altMax;
        this.autonomia = autonomia;
    }

    toString() {
        return `Aereo: ` + super.toString() + `Altura Maxima: ${this.altMax}, 
        Autonomia: ${this.autonomia}`;
    }
}

class Terrestre extends Vehiculo {
    cantPue = 0;
    cantRue = 0;

    constructor(id, modelo, anoFab, velMax, cantPue, cantRue) {
        super(id, modelo, anoFab, velMax);
        this.cantPue = cantPue;
        this.cantRue = cantRue;
    }

    toString() {
        return `Terrestre: ` + super.toString() + `Cantidad Puertas: ${this.cantPue}, 
        Cantidad Ruedas: ${this.cantRue}`;
    }
}


let js = JSON.parse(`[
    {"id":14, "modelo":"Ferrari F100", "anoFab":1998, "velMax":400, "cantPue":2, "cantRue":4},
    {"id":51, "modelo":"Dodge Viper", "anoFab":1991, "velMax":266, "cantPue":2, "cantRue":4},
    {"id":67, "modelo":"Boeing CH-47 Chinook", "anoFab":1962, "velMax":302, "altMax":6, "autonomia":1200},
    {"id":666, "modelo":"Aprilia RSV 1000 R", "anoFab":2004, "velMax":280, "cantPue":0, "cantRue":2},
    {"id":872, "modelo":"Boeing 747-400", "anoFab":1989, "velMax":988, "altMax":13, "autonomia":13450},
    {"id":742, "modelo":"Cessna CH-1 SkyhookR", "anoFab":1953, "velMax":174, "altMax":3, "autonomia":870}
    ]`);

let arrayDeObjetos = js.map(item => {
    if (item.altMax !== undefined) {
        return new Aereo(item.id, item.modelo, item.anoFab, item.velMax, item.altMax, item.autonomia);
    } else {
        return new Terrestre(item.id, item.modelo, item.anoFab, item.velMax, item.cantPue, item.cantRue);
    }
});



//------SETEO DE FORMULARIOS--------------//


let vehiculosDatos = arrayDeObjetos;


function mostrarVehiculos(vehiculos = vehiculosDatos) {

    let tablaBody = document.querySelector('#vehiculoTabla tbody');
    tablaBody.innerHTML = '';

    vehiculos.forEach(vehiculo => {

        let fila = document.createElement('tr');

        fila.insertCell().textContent = vehiculo.id;
        fila.insertCell().textContent = vehiculo.modelo;
        fila.insertCell().textContent = vehiculo.anoFab;
        fila.insertCell().textContent = vehiculo.velMax;

        if ('altMax' in vehiculo) {
            fila.insertCell().textContent = vehiculo.altMax;
            fila.insertCell().textContent = vehiculo.autonomia;
            fila.insertCell().textContent = '-';
            fila.insertCell().textContent = '-';

        } else if ('cantPue' in vehiculo) {
            fila.insertCell().textContent = '-';
            fila.insertCell().textContent = '-';
            fila.insertCell().textContent = vehiculo.cantPue;
            fila.insertCell().textContent = vehiculo.cantRue;
        }

        tablaBody.appendChild(fila);
    });

    tablaBody.querySelectorAll('tr').forEach(fila => {
        fila.addEventListener('click', function () {
            let celdaId = parseInt(fila.cells[0].textContent);
            let vehiculo = vehiculosDatos.find(vehiAux => vehiAux.id === celdaId);

            document.getElementById('id').value = vehiculo.id;
            document.getElementById('tipo').value = vehiculo.altMax !== undefined ? 'aereo' : 'terrestre';
            document.getElementById('modelo').value = vehiculo.modelo;
            document.getElementById('anoFab').value = vehiculo.anoFab;
            document.getElementById('velMax').value = vehiculo.velMax;
            document.getElementById('altMax').value = vehiculo.altMax || '';
            document.getElementById('autonomia').value = vehiculo.autonomia || '';
            document.getElementById('cantPue').value = vehiculo.cantPue || '';
            document.getElementById('cantRue').value = vehiculo.cantRue || '';
        });
    });

    cambiarVisibilidadColumnas();
}


function filtrarVehiculos(filtro) {
    let vehiculosFiltrados = [];
    if (filtro === "todos") {
        vehiculosFiltrados = vehiculosDatos.filter(vehiculo => vehiculo.id !== undefined);
    } else if (filtro === "aereo") {
        vehiculosFiltrados = vehiculosDatos.filter(vehiculo => vehiculo.cantPue === undefined);
    } else {
        vehiculosFiltrados = vehiculosDatos.filter(vehiculo => vehiculo.altMax === undefined);
    }
    return vehiculosFiltrados;
}

function filtrarVehiculosEnTabla() {
    let filtro = document.querySelector('#filtro').value;
    let vehiculosFiltrados = filtrarVehiculos(filtro);
    mostrarVehiculos(vehiculosFiltrados);
}


function cambiarVisibilidadColumnas() {
    let columnas = ['id', 'modelo', 'anoFab', 'velMax', 'altMax', 'autonomia', 'cantPue', 'cantRue'];
    columnas.forEach((col, index) => {
        let checkbox = document.getElementById(`${col}Chk`);
        let th = document.getElementById(`th-${col}`);
        let chequeado = checkbox.checked;

        th.classList.toggle('hidden', !chequeado);

        document.querySelectorAll(`td:nth-child(${index + 1})`).forEach(td => {
            td.classList.toggle('hidden', !chequeado);
        });
    });
}


function calcularVelocidadPromedio() {
    let filtro = document.getElementById('filtro').value;
    let vehiculosFiltrados = filtrarVehiculos(filtro);
    if (vehiculosFiltrados.length > 0) {
        let totalVelocidades = vehiculosFiltrados.reduce((sum, vehiAux) => sum + vehiAux.velMax, 0);
        let promedioVelocidad = (totalVelocidades / vehiculosFiltrados.length).toFixed(2);
        document.getElementById('promedioVelocidad').value = promedioVelocidad;
    } else {
        document.getElementById('promedioVelocidad').value = 'No hay datos';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('th').forEach(th => {
        th.addEventListener('click', () => {
            let columna = th.id.replace('th-', '');
            ordenarCeldas(columna);
        });
    });
});

function ordenarCeldas(columna) {
    let tipo;
    if (['modelo'].includes(columna)) {
        tipo = 'string';
    } else {
        tipo = 'number';
    }
    let filtro = document.getElementById('filtro').value;
    let vehiculosFiltrados = filtrarVehiculos(filtro);
    vehiculosFiltrados.sort((a, b) => {
        if (tipo === 'number') {
            return a[columna] - b[columna];
        } else {
            return a[columna].localeCompare(b[columna]);
        }
    });
    mostrarVehiculos(vehiculosFiltrados);
}


validarInputs();

function validarTipoEnAbm() {
    let tipo = document.getElementById('tipo');
    let altMax = document.getElementById('altMax');
    let autonomia = document.getElementById('autonomia');
    let cantPue = document.getElementById('cantPue');
    let cantRue = document.getElementById('cantRue');

    if (tipo.value === 'aereo') {
        altMax.disabled = false;
        autonomia.disabled = false;
        cantPue.disabled = true;
        cantRue.disabled = true;
        if (cantPue.value || cantRue.value) {
            cantPue.value = '';
            cantRue.value = '';
        }
    } else if (tipo.value === 'terrestre') {
        altMax.disabled = true;
        autonomia.disabled = true;
        cantPue.disabled = false;
        cantRue.disabled = false;
        if (altMax.value || autonomia.value) {
            altMax.value = '';
            autonomia.value = '';
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    let tipo = document.getElementById('tipo');
    tipo.addEventListener('change', (event) => {
        validarTipoEnAbm(event);
    });
    tipo.dispatchEvent(new Event('change'));
});



//---------ABM------------------------------//


document.getElementById("btnAlta").addEventListener("click", function (event) {
    event.preventDefault();

    let tipo = document.getElementById('tipo').value;
    let modelo = document.getElementById('modelo').value;
    let anoFab = parseInt(document.getElementById('anoFab').value);
    let velMax = parseInt(document.getElementById('velMax').value);
    let altMax = parseInt(document.getElementById('altMax').value);
    let autonomia = parseInt(document.getElementById('autonomia').value);
    let cantPue = parseInt(document.getElementById('cantPue').value);
    let cantRue = parseInt(document.getElementById('cantRue').value);
    let prom = document.getElementById("promedioVelocidad");
    let filtro = document.getElementById('filtro');
    let idUnico = generarIdUnico();

    if (tipo === 'aereo') {
        if (!validarAtributoVacio(modelo, anoFab, velMax, altMax, autonomia)) {
            alert(`No pueden quedar campos vacíos y deben ser mayores 0`);
            return;
        } else if (anoFab <= 1885) {
            alert(`Año de fabricacion debe ser mayor a 1885`);
            return;
        } else if (altMax === 0) {
            alert(`Altura debe ser mayor 0`);
            return;
        }
        let nuevoAereo = new Aereo(idUnico, modelo, anoFab, velMax, altMax, autonomia);
        vehiculosDatos.push(nuevoAereo);
        alert('Aereo agregado correctamente');
    } else if (tipo === 'terrestre') {
        if (!validarAtributoVacio(modelo, anoFab, velMax, cantPue, cantRue)) {
            alert(`No pueden quedar campos vacíos y deben ser mayores 0 (Puertas puede ser 0)`);
            return;
        } else if (anoFab <= 1885) {
            alert(`Año de fabricacion debe ser mayor a 1885`);
            return;
        }
        let nuevoTerrestre = new Terrestre(idUnico, modelo, anoFab, velMax, cantPue, cantRue);
        vehiculosDatos.push(nuevoTerrestre);
        alert('Terrestre agregado correctamente');
    }

    mostrarVehiculos();
    cambiarVisibilidadColumnas();

    formDatos.style.display = "block";
    formAbm.style.display = "none";
    prom.value = "";
    filtro.value = 'todos';
});



document.getElementById("btnModificar").addEventListener("click", function (event) {
    event.preventDefault();

    let id = parseInt(document.getElementById('id').value);
    let tipo = document.getElementById('tipo').value;
    let modelo = document.getElementById('modelo').value;
    let anoFab = parseInt(document.getElementById('anoFab').value);
    let velMax = parseInt(document.getElementById('velMax').value);
    let altMax = parseInt(document.getElementById('altMax').value);
    let autonomia = parseInt(document.getElementById('autonomia').value);
    let cantPue = parseInt(document.getElementById('cantPue').value);
    let cantRue = parseInt(document.getElementById('cantRue').value);
    let prom = document.getElementById("promedioVelocidad");
    let filtro = document.getElementById('filtro');

    let index = vehiculosDatos.findIndex(vehiAux => vehiAux.id === id);
    if (index !== -1) {
        if (tipo === 'aereo') {
            if (!validarAtributoVacio(modelo, anoFab, velMax, altMax, autonomia)) {
                alert(`No pueden quedar campos vacíos y deben ser mayores a 0`);
                return;
            } else if (anoFab <= 1885) {
                alert(`Año de fabricacion debe ser mayor a 1885`);
                return;
            } else if (altMax === 0) {
                alert(`Altura debe ser mayor 0`);
                return;
            }
            vehiculosDatos[index] = new Aereo(id, modelo, anoFab, velMax, altMax, autonomia);
        } else if (tipo === 'terrestre') {
            if (!validarAtributoVacio(modelo, anoFab, velMax, cantPue, cantRue)) {
                alert(`No pueden quedar campos vacíos y deben ser mayores a 0 (Puertas puede ser 0)`);
                return;
            } else if (anoFab <= 1885) {
                alert(`Año de fabricacion debe ser mayor a 1885`);
                return;
            } else if (cantPue < 0) {
                alert(`Puertas debe ser 0 o mayor`);
            }
            vehiculosDatos[index] = new Terrestre(id, modelo, anoFab, velMax, cantPue, cantRue);
        }
        alert('Vehiculo modificado correctamente');
        mostrarVehiculos();
        formDatos.style.display = "block";
        formAbm.style.display = "none";
        prom.value = "";
        filtro.value = 'todos';

    } else {
        alert('El vehiculo con el ID especificado no existe.');
    }
});



document.getElementById("btnBaja").addEventListener("click", function (event) {
    event.preventDefault();
    let prom = document.getElementById("promedioVelocidad");
    let filtro = document.getElementById('filtro');
    let id = parseInt(document.getElementById('id').value);
    let newVehiculosDatos = vehiculosDatos.filter(vehiAux => vehiAux.id !== id);
    if (newVehiculosDatos.length < vehiculosDatos.length) {
        vehiculosDatos = newVehiculosDatos;
        alert('Vehiculo eliminado correctamente');
        mostrarVehiculos();
        formDatos.style.display = "block";
        formAbm.style.display = "none";
        prom.value = "";
        filtro.value = 'todos';
    } else {
        alert('El vehiculo con el ID especificado no existe.');
    }
});



//-----FUNCIONALIDAD FORMULARIOS--------


function manejarForms() {

    filtrarVehiculosEnTabla();

    let formDatos = document.getElementById('formDatos');
    let formAbm = document.getElementById('formAbm');
    let btnAgregar = document.getElementById('btnAgregar');
    let btnAbmC = document.getElementById('btnCancelar');
    let btnAlta = document.getElementById('btnAlta');
    let btnMod = document.getElementById('btnModificar');
    let btnBaja = document.getElementById('btnBaja');
    let tabBody = document.querySelector('#vehiculoTabla tbody');
    let prom = document.getElementById("promedioVelocidad");
    let txtId = document.getElementById('id');
    let txtModelo = document.getElementById('modelo');
    let txtAnoFab = document.getElementById('anoFab');
    let txtVelMax = document.getElementById('velMax');
    let txtAltMax = document.getElementById('altMax');
    let txtAutonomia = document.getElementById('autonomia');
    let txtCantPue = document.getElementById('cantPue');
    let txtCantRue = document.getElementById('cantRue');
    let filtro = document.getElementById('filtro');


    btnAbmC.addEventListener("click", (event) => {
        event.preventDefault();
        mostrarVehiculos(vehiculosDatos);
        formDatos.style.display = "block";
        formAbm.style.display = "none";
        filtro.value = "todos";
    });

    btnAgregar.addEventListener("click", (event) => {
        formAbm.style.display = "block";
        formDatos.style.display = "none";
        btnAlta.classList.replace('hidden', 'visible');
        btnBaja.classList.replace('visible', 'hidden');
        btnMod.classList.replace('visible', 'hidden');
        txtId.value = "";
        txtModelo.value = "";
        txtAnoFab.value = "";
        txtVelMax.value = "";
        txtAltMax.value = "";
        txtAutonomia.value = "";
        txtCantPue.value = "";
        txtCantRue.value = "";
        validarTipoEnAbm(event);
    });

    tabBody.addEventListener("dblclick", (event) => {
        formAbm.style.display = "block";
        formDatos.style.display = "none";
        btnMod.classList.replace('hidden', 'visible');
        btnBaja.classList.replace('hidden', 'visible');
        btnAlta.classList.replace('visible', 'hidden');
        validarTipoEnAbm(event);
    });

    document.querySelector('#botonCalcular').addEventListener('click', calcularVelocidadPromedio);

    document.querySelector('#filtro').addEventListener('change', (event) => {
        filtrarVehiculosEnTabla(event);
        prom.value = "";
    });

    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', cambiarVisibilidadColumnas);
    });
}


//---VALIDACIONES---

function validarAtributoVacio(atributo1, atributo2, atributo3, atributo4, atributo5) {
    if (atributo1 === '' || atributo1 === null || isNaN(atributo2) || atributo2 === null ||
        atributo2 === 0 || isNaN(atributo3) || atributo3 === null || atributo3 === 0 ||
        isNaN(atributo4) || atributo4 === null || atributo4 < 0 || atributo5 === 0 ||
        atributo5 === null || isNaN(atributo5)) {
        return false;
    }
    return true;
}

function generarIdUnico() {
    let idUsados = vehiculosDatos.map(item => item.id);
    let maxId = Math.max(...idUsados, 0);
    return maxId + 1;
}

function validarSoloLetras(valInput) {
    valInput.addEventListener('input', function (event) {
        let valor = event.target.value;
        let regexLetras = /^[A-Za-z]*$/;
        if (!regexLetras.test(valor)) {
            event.target.value = valor.replace(/[^a-zA-Z]/g, '');
        }
    });
}

function validarSoloNumerosEnteros(valInput) {
    valInput.addEventListener('input', function (event) {
        let valor = event.target.value;
        let regexNumEnt = /^\d*$/;
        if (isNaN(valor) || !regexNumEnt.test(valor)) {
            event.target.value = valor.slice(0, -1);
        }
    });
}


function validarInputs() {
    let modeloInput = document.getElementById('modelo');
    let anoFabInput = document.getElementById('anoFab');
    let velMaxInput = document.getElementById('velMax');
    let altMaxInput = document.getElementById('altMax');
    let autonomiaInput = document.getElementById('autonomia');
    let cantPueInput = document.getElementById('cantPue');
    let cantRueInput = document.getElementById('cantRue');

    validarSoloLetras(modeloInput);
    validarSoloNumerosEnteros(anoFabInput);
    validarSoloNumerosEnteros(velMaxInput);
    validarSoloNumerosEnteros(altMaxInput);
    validarSoloNumerosEnteros(autonomiaInput);
    validarSoloNumerosEnteros(cantPueInput);
    validarSoloNumerosEnteros(cantRueInput);
}


window.addEventListener("load", manejarForms);