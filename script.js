// Variables globales
let alumnos = JSON.parse(localStorage.getItem('alumnos')) || [];
let editingId = null;

// Datos de clima para las ciudades
const ciudades = {
    'Posadas': { 
        temp: 28, 
        desc: 'Despejado', 
        icon: '☀️', 
        humidity: 65, 
        wind: 12, 
        feels: 30 
    },
    'Corrientes': { 
        temp: 30, 
        desc: 'Parcialmente nublado', 
        icon: '⛅', 
        humidity: 70, 
        wind: 15, 
        feels: 33 
    },
    'Buenos Aires': { 
        temp: 22, 
        desc: 'Nublado', 
        icon: '☁️', 
        humidity: 75, 
        wind: 20, 
        feels: 21 
    }
};

// Función para mostrar secciones
function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remover clase active de todos los links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    document.getElementById(sectionId).classList.add('active');
    
    // Activar el link correspondiente
    event.target.classList.add('active');

    // Si es la sección de listado, renderizar los alumnos
    if (sectionId === 'listado') {
        renderAlumnos();
    }
}

// Función para actualizar la fecha
function updateDate() {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const fecha = new Date().toLocaleDateString('es-AR', options);
    document.getElementById('currentDate').textContent = fecha;
}

// Función para seleccionar ciudad
function selectCity(ciudad) {
    // Remover clase active de todos los botones
    document.querySelectorAll('.city-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Activar el botón clickeado
    event.target.classList.add('active');

    // Obtener los datos de la ciudad
    const data = ciudades[ciudad];
    
    // Actualizar el nombre de la ciudad con su provincia/país
    let nombreCompleto = ciudad;
    if (ciudad === 'Posadas') {
        nombreCompleto = 'Posadas, Misiones';
    } else if (ciudad === 'Corrientes') {
        nombreCompleto = 'Corrientes, Corrientes';
    } else if (ciudad === 'Buenos Aires') {
        nombreCompleto = 'Buenos Aires, Argentina';
    }
    
    // Actualizar la información del clima
    document.getElementById('cityName').textContent = nombreCompleto;
    document.getElementById('temperature').textContent = data.temp + '°C';
    document.getElementById('description').textContent = data.desc;
    document.getElementById('weatherIcon').textContent = data.icon;
    document.getElementById('humidity').textContent = data.humidity + '%';
    document.getElementById('wind').textContent = data.wind + ' km/h';
    document.getElementById('feelsLike').textContent = data.feels + '°C';
}

// Validación y envío del formulario
document.getElementById('alumnoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;
    const fields = ['nombre', 'apellido', 'email', 'telefono', 'curso', 'fechaNacimiento'];
    
    // Validar cada campo
    fields.forEach(field => {
        const input = document.getElementById(field);
        const error = document.getElementById(field + 'Error');
        
        // 🔽 BLOQUE CORRECTOR (evita errores si falta el span)
        if (!input.value.trim()) {
            input.classList.add('error');
            if (error) error.style.display = 'block';
            isValid = false;
        } else {
            input.classList.remove('error');
            if (error) error.style.display = 'none';
        }
    });

    // Validación específica de email
    const email = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email.value && !emailRegex.test(email.value)) {
        email.classList.add('error');
        emailError.textContent = 'Email inválido';
        emailError.style.display = 'block';
        isValid = false;
    }

    // Si el formulario es válido, guardar el alumno
    if (isValid) {
        const alumno = {
            id: editingId || Date.now(),
            nombre: document.getElementById('nombre').value.trim(),
            apellido: document.getElementById('apellido').value.trim(),
            email: document.getElementById('email').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            curso: document.getElementById('curso').value,
            fechaNacimiento: document.getElementById('fechaNacimiento').value
        };

        if (editingId) {
            // Si estamos editando, actualizar el alumno existente
            const index = alumnos.findIndex(a => a.id === editingId);
            alumnos[index] = alumno;
            editingId = null;
        } else {
            // Si es nuevo, agregarlo al array
            alumnos.push(alumno);
        }

        // Guardar en localStorage
        localStorage.setItem('alumnos', JSON.stringify(alumnos));
        
        // Mostrar mensaje de éxito
        document.getElementById('successMsg').style.display = 'block';
        setTimeout(() => {
            document.getElementById('successMsg').style.display = 'none';
        }, 3000);

        // Limpiar el formulario
        this.reset();
    }
});

// Función para renderizar alumnos por curso
function renderAlumnos() {
    const container = document.getElementById('alumnosContainer');
    const cursos = ['Desarrollo Web', 'Diseño Gráfico', 'Marketing Digital', 'Administración'];
    
    container.innerHTML = '';

    // Si no hay alumnos, mostrar mensaje
    if (alumnos.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">No hay alumnos cargados aún.</p>';
        return;
    }

    // Renderizar cada curso con sus alumnos
    cursos.forEach(curso => {
        const alumnosCurso = alumnos.filter(a => a.curso === curso);
        
        if (alumnosCurso.length > 0) {
            const section = document.createElement('div');
            section.className = 'curso-section';
            
            const pluralAlumnos = alumnosCurso.length !== 1 ? 's' : '';
            
            section.innerHTML = `
                <div class="curso-header">${curso} (${alumnosCurso.length} alumno${pluralAlumnos})</div>
                <div class="alumnos-grid">
                    ${alumnosCurso.map(alumno => `
                        <div class="alumno-card">
                            <div class="alumno-name">${alumno.nombre} ${alumno.apellido}</div>
                            <div class="alumno-info">📧 ${alumno.email}</div>
                            <div class="alumno-info">📱 ${alumno.telefono}</div>
                            <div class="alumno-info">🎂 ${new Date(alumno.fechaNacimiento).toLocaleDateString('es-AR')}</div>
                            <div class="alumno-actions">
                                <button class="btn btn-edit" onclick="editarAlumno(${alumno.id})">Editar</button>
                                <button class="btn btn-delete" onclick="eliminarAlumno(${alumno.id})">Eliminar</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            container.appendChild(section);
        }
    });
}

// Función para eliminar alumno
function eliminarAlumno(id) {
    if (confirm('¿Está seguro de eliminar este alumno?')) {
        alumnos = alumnos.filter(a => a.id !== id);
        localStorage.setItem('alumnos', JSON.stringify(alumnos));
        renderAlumnos();
    }
}

// Función para editar alumno
function editarAlumno(id) {
    const alumno = alumnos.find(a => a.id === id);
    
    if (alumno) {
        editingId = id;
        
        // Llenar el formulario con los datos del alumno
        document.getElementById('nombre').value = alumno.nombre;
        document.getElementById('apellido').value = alumno.apellido;
        document.getElementById('email').value = alumno.email;
        document.getElementById('telefono').value = alumno.telefono;
        document.getElementById('curso').value = alumno.curso;
        document.getElementById('fechaNacimiento').value = alumno.fechaNacimiento;
        
        // Cambiar a la sección de cargar alumno
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        
        document.getElementById('cargar').classList.add('active');
        document.querySelector('[onclick="showSection(\'cargar\')"]').classList.add('active');
        
        // Scroll al inicio de la página
        window.scrollTo(0, 0);
    }
}

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar fecha inicial
    updateDate();
    
    // Actualizar fecha cada minuto
    setInterval(updateDate, 60000);

});
