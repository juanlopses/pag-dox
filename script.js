const audio = new Audio('https://cloudkuimages.guru/uploads/audios/6817f8e88e7ec.mp3');
const { jsPDF } = window.jspdf;

// GSAP Animations
gsap.from('h1', { opacity: 0, y: -50, duration: 1, ease: 'power3.out' });
gsap.from('#dniInput', { opacity: 0, x: -100, duration: 1, delay: 0.5, ease: 'power3.out' });
gsap.from('#searchBtn', { opacity: 0, x: 100, duration: 1, delay: 0.7, ease: 'power3.out' });

// Particle Animation
function createParticles() {
  const particleCount = 50;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    document.body.appendChild(particle);
    gsap.set(particle, {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    });
    animateParticle(particle);
  }
}

function animateParticle(particle) {
  gsap.to(particle, {
    y: '+=100',
    opacity: Math.random(),
    duration: Math.random() * 5 + 5,
    ease: 'linear',
    onComplete: () => {
      gsap.set(particle, { y: -10, x: Math.random() * window.innerWidth });
      animateParticle(particle);
    }
  });
}

createParticles();

// API Fetch
async function fetchData() {
  const dni = document.getElementById('dniInput').value;
  if (!/^\d{8}$/.test(dni)) {
    alert('Por favor, ingrese un DNI válido de 8 dígitos.');
    return;
  }

  // Show loading
  const loading = document.getElementById('loading');
  gsap.to(loading, { opacity: 1, duration: 0.5, onStart: () => loading.classList.remove('hidden') });

  try {
    const response = await fetch(`https://daku.lat/api/reniec?dni=${dni}`);
    const data = await response.json();

    if (data.estado && data.datos) {
      // Update UI with data
      document.getElementById('photo').src = `data:image/jpeg;base64,${data.datos.foto}`;
      document.getElementById('dni').textContent = data.datos.dni;
      document.getElementById('nombreCompleto').textContent = data.datos.nombreCompleto;
      document.getElementById('nombre').textContent = data.datos.nombre;
      document.getElementById('apellidoP').textContent = data.datos.apellidoP;
      document.getElementById('apellidoM').textContent = data.datos.apellidoM;
      document.getElementById('fechaNacimiento').textContent = data.datos.fechaDeNacimiento;
      document.getElementById('direccion').textContent = data.datos.direccion;
      document.getElementById('ubigeo').textContent = data.datos.ubigeoReniec;

      // Show result with animations
      const result = document.getElementById('result');
      result.classList.remove('hidden');
      gsap.from('#photo', { scale: 0, rotation: 360, duration: 1, ease: 'back.out(1.7)' });
      gsap.from('.result-item', { 
        opacity: 0, 
        x: () => Math.random() * 200 - 100, 
        duration: 0.8, 
        stagger: 0.1, 
        ease: 'power3.out' 
      });
      gsap.from('#downloadJsonBtn', { opacity: 0, y: 50, duration: 1, delay: 0.5, ease: 'power3.out' });
      gsap.from('#downloadPdfBtn', { opacity: 0, y: 50, duration: 1, delay: 0.7, ease: 'power3.out' });
    } else {
      alert('No se encontraron datos para el DNI ingresado.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Ocurrió un error al consultar la API.');
  } finally {
    // Hide loading
    gsap.to(loading, { opacity: 0, duration: 0.5, onComplete: () => loading.classList.add('hidden') });
  }
}

// Download JSON
function downloadJson() {
  const data = {
    dni: document.getElementById('dni').textContent,
    nombreCompleto: document.getElementById('nombreCompleto').textContent,
    nombre: document.getElementById('nombre').textContent,
    apellidoP: document.getElementById('apellidoP').textContent,
    apellidoM: document.getElementById('apellidoM').textContent,
    fechaDeNacimiento: document.getElementById('fechaNacimiento').textContent,
    direccion: document.getElementById('direccion').textContent,
    ubigeoReniec: document.getElementById('ubigeo').textContent
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `reniec_${data.dni}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Download PDF
function downloadPdf() {
  const data = {
    dni: document.getElementById('dni').textContent,
    nombreCompleto: document.getElementById('nombreCompleto').textContent,
    nombre: document.getElementById('nombre').textContent,
    apellidoP: document.getElementById('apellidoP').textContent,
    apellidoM: document.getElementById('apellidoM').textContent,
    fechaDeNacimiento: document.getElementById('fechaNacimiento').textContent,
    direccion: document.getElementById('direccion').textContent,
    ubigeoReniec: document.getElementById('ubigeo').textContent
  };

  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Consulta RENIEC', 20, 20);
  doc.setFontSize(12);
  doc.text(`DNI: ${data.dni}`, 20, 40);
  doc.text(`Nombre Completo: ${data.nombreCompleto}`, 20, 50);
  doc.text(`Nombre: ${data.nombre}`, 20, 60);
  doc.text(`Apellido Paterno: ${data.apellidoP}`, 20, 70);
  doc.text(`Apellido Materno: ${data.apellidoM}`, 20, 80);
  doc.text(`Fecha de Nacimiento: ${data.fechaDeNacimiento}`, 20, 90);
  doc.text(`Dirección: ${data.direccion}`, 20, 100);
  doc.text(`Ubigeo: ${data.ubigeoReniec}`, 20, 110);

  // Add photo
  const photo = document.getElementById('photo');
  const imgData = photo.src;
  doc.addImage(imgData, 'JPEG', 140, 40, 40, 40);

  doc.save(`reniec_${data.dni}.pdf`);
}

// Event Listeners
document.getElementById('searchBtn').addEventListener('click', () => {
  audio.play();
  fetchData();
});

document.getElementById('downloadJsonBtn').addEventListener('click', () => {
  audio.play();
  downloadJson();
});

document.getElementById('downloadPdfBtn').addEventListener('click', () => {
  audio.play();
  downloadPdf();
});

document.getElementById('dniInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    audio.play();
    fetchData();
  }
});
