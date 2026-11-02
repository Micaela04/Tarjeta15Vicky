/* ═══════════════════════════════════════════════════════════════
   MIS 15 CAMILA - Frontend JavaScript
   Modules: Welcome, Countdown, Scroll Animations, Gallery,
            Modals, RSVP, Photo Upload, Music Player
   ═══════════════════════════════════════════════════════════════ */

// ══════════════════════════════════════════════════════════════
// CONFIGURATION
// ══════════════════════════════════════════════════════════════

const CONFIG = {
  // ★ IMPORTANTE: Reemplazá esta URL con la URL de tu Google Apps Script Web App
  // Instrucciones en README.md
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxsvcrz4ftDmYl442pZyLWaGHHnvt3svTPKD29IGHOQvZ1kLamK0qkbcdIEOeIIh0BK/exec',


  // Fecha del evento: 15 de Enero de 2027, 21:30 hs (Argentina UTC-3)
  EVENT_DATE: new Date('2027-01-15T21:30:00-03:00'),

  // Máximo de archivos por subida
  MAX_FILES: 10,

  // Tamaño máximo por archivo (5 MB)
  MAX_FILE_SIZE: 5 * 1024 * 1024,
};

// ══════════════════════════════════════════════════════════════
// 1. WELCOME SCREEN CONTROLLER — SPRITE ENVELOPE ANIMATION
// ══════════════════════════════════════════════════════════════

(function initWelcomeScreen() {
  document.body.classList.add('no-scroll');

  const introScreen = document.getElementById('intro-screen');
  const envelopeButton = document.getElementById('envelope-button');
  const tapText = document.getElementById('tap-text');
  const mainContent = document.getElementById('main-content');

  envelopeButton.addEventListener('click', () => {
    envelopeButton.disabled = true;
    envelopeButton.classList.add('opening');
    tapText.classList.add('hidden');

    envelopeButton.addEventListener('animationend', () => {
    introScreen.classList.add('fade-out');
    mainContent.style.display = 'block';
    document.body.classList.remove('no-scroll');
    tryPlayMusic();

    setTimeout(() => {
      introScreen.style.display = 'none';
    }, 700);
    }, { once: true });
  });
})();

// ══════════════════════════════════════════════════════════════
// 2. COUNTDOWN TIMER
// ══════════════════════════════════════════════════════════════

(function initCountdown() {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');

  function updateCountdown() {
    const now = new Date();
    const diff = CONFIG.EVENT_DATE - now;

    if (diff <= 0) {
      daysEl.textContent = '0';
      hoursEl.textContent = '0';
      minutesEl.textContent = '0';
      secondsEl.textContent = '0';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = days;
    hoursEl.textContent = hours;
    minutesEl.textContent = minutes;
    secondsEl.textContent = seconds;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();

// ══════════════════════════════════════════════════════════════
// 3. SCROLL ANIMATIONS (IntersectionObserver)
// ══════════════════════════════════════════════════════════════

(function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Only animate once
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach((el) => observer.observe(el));
})();

// ══════════════════════════════════════════════════════════════
// 4. GALLERY
// ══════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════
// 5. MODALS CONTROLLER
// ══════════════════════════════════════════════════════════════

(function initModals() {
  // Como Llegar modal
  const btnComoLlegar = document.getElementById('btn-como-llegar');
  const modalMapa = document.getElementById('modal-mapa');

  // Sobre Virtual modal
  const btnSobre = document.getElementById('btn-sobre-virtual');
  const modalSobre = document.getElementById('modal-sobre');

  function openModal(modal) {
    modal.classList.add('active');
    document.body.classList.add('no-scroll');
  }

  function closeModal(modal) {
    modal.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  // Open handlers
  if (btnComoLlegar && modalMapa) {
    btnComoLlegar.addEventListener('click', () => openModal(modalMapa));
  }

  if (btnSobre && modalSobre) {
    btnSobre.addEventListener('click', () => openModal(modalSobre));
  }

  // Close handlers (close button + backdrop click)
  document.querySelectorAll('.modal').forEach((modal) => {
    const closeBtn = modal.querySelector('.modal-close');
    const backdrop = modal.querySelector('.modal-backdrop');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(modal));
    }

    if (backdrop) {
      backdrop.addEventListener('click', () => closeModal(modal));
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.active').forEach((modal) => {
        closeModal(modal);
      });
    }
  });

  // Copy buttons
  document.querySelectorAll('.btn-copy').forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> ¡Copiado!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.classList.remove('copied');
        }, 2000);
      }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> ¡Copiado!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.classList.remove('copied');
        }, 2000);
      });
    });
  });
})();

// ══════════════════════════════════════════════════════════════
// 6. RSVP FORM HANDLER (→ Google Sheets)
// ══════════════════════════════════════════════════════════════

(function initRSVP() {
  const form = document.getElementById('rsvp-form');
  const submitBtn = document.getElementById('rsvp-submit');
  const successDiv = document.getElementById('rsvp-success');
  const errorDiv = document.getElementById('rsvp-error');
  const attendanceInputs = form ? form.querySelectorAll('input[name="asistencia"]') : [];
  const peopleSelect = document.getElementById('rsvp-cantidad');
  const dietGroup = document.getElementById('rsvp-diet-group');
  const dietContainer = document.getElementById('rsvp-diet-container');
  const addDietBtn = document.getElementById('rsvp-add-diet');
  const guestCountGroup = document.getElementById('rsvp-cantidad-group');
  const nombreGroup = document.getElementById('rsvp-nombre-group');
  const apellidoGroup = document.getElementById('rsvp-apellido-group');
  const telefonoGroup = document.getElementById('rsvp-telefono-group');
  const mensajeGroup = document.getElementById('rsvp-mensaje-group');

  const initialDietSelect = dietContainer.querySelector('.diet-select');
  
  if (initialDietSelect) {
    initialDietSelect.addEventListener('change', updateDietUI);
  }

  if (!form) return;

  const dietOptionsMarkup = [
    '<option value="Ninguno">Ninguno</option>',
    '<option value="Vegano">Vegano</option>',
    '<option value="Vegetariano">Vegetariano</option>',
    '<option value="Celíaco">Celíaco</option>',
    '<option value="Diabético">Diabético</option>',
    '<option value="Hipertenso">Hipertenso</option>',
    '<option value="Intolerante a la lactosa">Intolerante a la lactosa</option>',
  ].join('');

  function createDietRow() {
    const row = document.createElement('div');
    row.className = 'diet-item rsvp-diet-row';
    row.innerHTML = `
      <select class="form-select diet-select" name="restricciones">
        ${dietOptionsMarkup}
      </select>
      <input type="text" class="form-input diet-name is-hidden" placeholder="Nombre de la persona" autocomplete="off" />
    `;

    const select = row.querySelector('.diet-select');
    select.addEventListener('change', () => {
      updateDietUI();
    });
    return row;
  }

  function getAttendanceValue() {
    const selected = form.querySelector('input[name="asistencia"]:checked');
    return selected ? selected.value : '';
  }

  function ensureDietRowsWithinLimit(peopleCount) {
    const rows = Array.from(dietContainer.querySelectorAll('.diet-item'));

    if (rows.length === 0) {
      dietContainer.appendChild(createDietRow());
      return;
    }

    if (rows.length > peopleCount) {
      rows.slice(peopleCount).forEach((row) => row.remove());
    }
  }

  function updateDietUI() {
    const peopleCount = parseInt(peopleSelect.value, 10);
    ensureDietRowsWithinLimit(peopleCount);

    const rows = Array.from(dietContainer.querySelectorAll('.diet-item'));
    rows.forEach((row) => {
      const dietSelect = row.querySelector('.diet-select');
      const nameInput = row.querySelector('.diet-name');
      if (!nameInput || !dietSelect) return;

      if (peopleCount > 1 && dietSelect.value !== 'Ninguno') {
        nameInput.classList.remove('is-hidden');
      } else {
        nameInput.classList.add('is-hidden');
        nameInput.value = '';
      }
    });

    if (peopleCount > 1 && rows.length < peopleCount) {
      addDietBtn.style.display = 'inline-block';
    } else {
      addDietBtn.style.display = 'none';
    }
  }

  function updateAttendanceUI() {
    const attendance = getAttendanceValue();
    const attending = attendance === 'si';

    if (guestCountGroup) guestCountGroup.style.display = attending ? 'block' : 'none';
    if (dietGroup) dietGroup.style.display = attending ? 'block' : 'none';

    const alwaysVisible = [nombreGroup, apellidoGroup, telefonoGroup, mensajeGroup];
    alwaysVisible.forEach((group) => {
      if (group) group.style.display = 'block';
    });

    if (attending) {
      updateDietUI();
    }
  }

  function getDietValue() {
    const peopleCount = parseInt(peopleSelect.value, 10);
    const rows = Array.from(dietContainer.querySelectorAll('.diet-item'));
    const dietPairs = [];

    rows.forEach((row, index) => {
      const dietSelect = row.querySelector('.diet-select');
      const nameInput = row.querySelector('.diet-name');
      if (!dietSelect) return;

      const diet = dietSelect.value;
      if (diet === 'Ninguno') return;

      if (peopleCount === 1) {
        dietPairs.push(diet);
        return;
      }

      const personName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : `Persona ${index + 1}`;
      dietPairs.push(`${personName} - ${diet}`);
    });

    return dietPairs.length ? dietPairs.join(', ') : 'Ninguno';
  }

  function validateDietRowsIfNeeded() {
    const attendance = getAttendanceValue();
    if (attendance !== 'si') return true;

    const peopleCount = parseInt(peopleSelect.value, 10);
    if (peopleCount <= 1) return true;

    const rows = Array.from(dietContainer.querySelectorAll('.diet-item'));
    for (const row of rows) {
      const dietSelect = row.querySelector('.diet-select');
      const nameInput = row.querySelector('.diet-name');
      if (!dietSelect || !nameInput) continue;

      if (dietSelect.value !== 'Ninguno' && !nameInput.value.trim()) {
        shakeElement(row);
        nameInput.focus();
        return false;
      }
    }

    return true;
  }

  attendanceInputs.forEach((input) => {
    input.addEventListener('change', updateAttendanceUI);
  });

  if (peopleSelect) {
    peopleSelect.addEventListener('change', updateDietUI);
  }

  if (addDietBtn) {
    addDietBtn.addEventListener('click', () => {
      const peopleCount = parseInt(peopleSelect.value, 10);
      const rows = dietContainer.querySelectorAll('.diet-item');

      if (rows.length >= peopleCount) {
        addDietBtn.style.display = 'none';
        return;
      }

      dietContainer.appendChild(createDietRow());
      updateDietUI();
    });
  }

  // Initial form state
  updateAttendanceUI();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      // Si el formulario no es válido (faltan campos required), 
      // le decimos al navegador que muestre los mensajes de error nativos
      form.reportValidity(); 
      return; // Detenemos la ejecución aquí, no se envía nada
    }

    // Validate attendance selection
    const asistencia = form.querySelector('input[name="asistencia"]:checked');
    if (!asistencia) {
      shakeElement(form.querySelector('.rsvp-pills'));
      return;
    }

    // Validate name
    const nombre = form.querySelector('#rsvp-nombre').value.trim();
    if (!nombre) {
      shakeElement(form.querySelector('#rsvp-nombre').parentElement);
      return;
    }

    const apellido = form.querySelector('#rsvp-apellido').value.trim();
    if (!apellido) {
      shakeElement(form.querySelector('#rsvp-apellido').parentElement);
      return;
    }

    if (!validateDietRowsIfNeeded()) {
      return;
    }

    const asistenciaValue = asistencia.value;
    const isAttending = asistenciaValue === 'si';

    // Gather form data
    const formData = {
      action: 'rsvp',
      nombre: nombre,
      apellido: apellido,
      cantidad: isAttending ? (form.querySelector('#rsvp-cantidad').value || '1') : '0',
      telefono: form.querySelector('#rsvp-telefono').value.trim(),
      asistencia: asistenciaValue,
      restricciones: isAttending ? getDietValue() : 'Ninguno',
      mensaje: form.querySelector('#rsvp-mensaje').value.trim(),
    };

    // UI: loading state
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';
    submitBtn.disabled = true;

    try {
      if (CONFIG.APPS_SCRIPT_URL === 'TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI') {
        // Demo mode: simulate success
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log('[DEMO] RSVP data:', formData);
      } else {
        const response = await fetch(CONFIG.APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(formData),
        });
        // Note: mode 'no-cors' returns opaque response, so we assume success
      }

      // Show success
      form.style.display = 'none';
      successDiv.style.display = 'block';
      errorDiv.style.display = 'none';
    } catch (error) {
      console.error('RSVP Error:', error);
      errorDiv.style.display = 'block';
      btnText.style.display = 'inline';
      btnLoader.style.display = 'none';
      submitBtn.disabled = false;
    }
  });
})();

// ══════════════════════════════════════════════════════════════
// 7. PHOTO UPLOAD HANDLER (→ Google Drive)
// ══════════════════════════════════════════════════════════════

(function initPhotoUpload() {
  const uploadBtn = document.getElementById('btn-upload-photos');
  const fileInput = document.getElementById('photo-input');
  const progressDiv = document.getElementById('upload-progress');
  const progressFill = document.getElementById('upload-progress-fill');
  const statusText = document.getElementById('upload-status');
  const successDiv = document.getElementById('upload-success');

  if (!uploadBtn || !fileInput) return;

  uploadBtn.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    // Validate file count
    if (files.length > CONFIG.MAX_FILES) {
      alert(`Podés subir un máximo de ${CONFIG.MAX_FILES} fotos a la vez.`);
      fileInput.value = '';
      return;
    }

    // Validate file sizes
    const oversized = files.filter((f) => f.size > CONFIG.MAX_FILE_SIZE);
    if (oversized.length > 0) {
      alert('Algunas imágenes superan los 5 MB. Intentá con imágenes más pequeñas.');
      fileInput.value = '';
      return;
    }

    // Show progress
    uploadBtn.style.display = 'none';
    progressDiv.style.display = 'block';
    successDiv.style.display = 'none';

    let uploaded = 0;
    const total = files.length;

    for (const file of files) {
      try {
        statusText.textContent = `Subiendo ${uploaded + 1} de ${total}...`;
        progressFill.style.width = `${(uploaded / total) * 100}%`;

        const base64Data = await fileToBase64(file);

        const payload = {
          action: 'upload',
          fileName: file.name,
          mimeType: file.type,
          data: base64Data,
        };

        if (CONFIG.APPS_SCRIPT_URL === 'TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI') {
          // Demo mode
          await new Promise((resolve) => setTimeout(resolve, 800));
          console.log(`[DEMO] Upload: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
        } else {
          await fetch(CONFIG.APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(payload),
          });
        }

        uploaded++;
        progressFill.style.width = `${(uploaded / total) * 100}%`;
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        statusText.textContent = `Error al subir ${file.name}. Continuando...`;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        uploaded++;
      }
    }

    // Complete
    progressDiv.style.display = 'none';
    successDiv.style.display = 'block';

    // Reset after 4 seconds
    setTimeout(() => {
      successDiv.style.display = 'none';
      uploadBtn.style.display = 'inline-block';
      progressFill.style.width = '0%';
      fileInput.value = '';
    }, 4000);
  });

  /**
   * Converts a File object to a Base64 string (without the data URI prefix)
   */
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Remove "data:image/...;base64," prefix
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
})();

// ══════════════════════════════════════════════════════════════
// 8. MUSIC PLAYER
// ══════════════════════════════════════════════════════════════

let musicIsPlaying = false;

function tryPlayMusic() {
  const audio = document.getElementById('bg-music');
  const btn = document.getElementById('play-pause-btn');
  const icon = document.getElementById('music-icon');

  if (!audio || !btn) return;

  // Check if audio source exists
  const source = audio.querySelector('source');
  if (!source || !source.src || source.src.includes('musica.mp3')) {
    // Only show button if the file actually loads
    audio.addEventListener('canplaythrough', () => {
      btn.style.display = 'flex';
    }, { once: true });

    // Try loading
    audio.load();
  }

  // Try auto-play
  audio.play().then(() => {
    musicIsPlaying = true;
    btn.style.display = 'flex';
    icon.className = 'fas fa-pause';
  }).catch(() => {
    // Auto-play blocked, show play button
    musicIsPlaying = false;
    btn.style.display = 'flex';
    icon.className = 'fas fa-play';
  });
}

(function initMusicPlayer() {
  const btn = document.getElementById('play-pause-btn');
  const audio = document.getElementById('bg-music');
  const icon = document.getElementById('music-icon');

  if (!btn || !audio) return;

  btn.addEventListener('click', () => {
    if (musicIsPlaying) {
      audio.pause();
      icon.className = 'fas fa-play';
      musicIsPlaying = false;
    } else {
      audio.play().then(() => {
        icon.className = 'fas fa-pause';
        musicIsPlaying = true;
      }).catch((err) => {
        console.warn('Cannot play audio:', err);
      });
    }
  });
})();

// ══════════════════════════════════════════════════════════════
// UTILITY: Shake animation for validation
// ══════════════════════════════════════════════════════════════

function shakeElement(el) {
  if (!el) return;
  el.style.animation = 'none';
  el.offsetHeight; // Trigger reflow
  el.style.animation = 'shake 0.5s ease';
  setTimeout(() => {
    el.style.animation = '';
  }, 500);
}

// Add shake keyframes dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);
