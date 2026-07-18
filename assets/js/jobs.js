/* ══════════════════════════════════════════════════════════════
   Svaneeng A/S – jobs.js
   Job-relateret logik: indlæsning, rendering, modal, ansøgning,
   CV-krav og formularvalidering.

   Henter jobdata fra assets/data/jobs.json.
   Skift active: true/false i jobs.json for at vise/skjule opslag.
   Ingen kodeændring er nødvendig for at aktivere/deaktivere et opslag.
   ══════════════════════════════════════════════════════════════ */

// ── CV-KRAV ──────────────────────────────────────────────────
// Stillinger der kræver CV. Listen kan udvides her uden øvrige kodeændringer.
const CV_REQUIRED_POSITIONS = [
  'Byggeleder',
  'Projektleder',
  'Administrativ medarbejder'
];

const CV_HINT_REQUIRED = 'CV er påkrævet for denne stilling. Du kan vedhæfte PDF, DOC eller DOCX. Maks. 10 MB.';
const CV_HINT_OPTIONAL = 'Du kan vedhæfte CV, svendebrev eller kort bilag som PDF, DOC eller DOCX. Maks. 10 MB.';

// Modul-variabel til loaded jobs (bruges af openJobModal)
let loadedJobs = [];

// ── HJÆLPEFUNKTIONER ─────────────────────────────────────────

// Udled by fra adressefelt
function extractCity(address) {
  if (!address) return 'Ukendt by';
  // Forsøg 1: tekst efter komma, fx "Søndervej 4, 2600 Glostrup" → "Glostrup"
  const commaIdx = address.lastIndexOf(',');
  if (commaIdx !== -1) {
    const afterComma = address.slice(commaIdx + 1).trim();
    // Fjern evt. postnummer i starten
    const cityFromComma = afterComma.replace(/^\d{4}\s*/, '').trim();
    if (cityFromComma.length > 0) return cityFromComma;
  }
  // Forsøg 2: tekst efter 4-cifret postnummer, fx "2600 Glostrup" → "Glostrup"
  const zipMatch = address.match(/\b\d{4}\s+(.+)/);
  if (zipMatch && zipMatch[1].trim().length > 0) return zipMatch[1].trim();
  // Fallback: brug hele feltets indhold eller "Ukendt by"
  return address.trim() || 'Ukendt by';
}

// Byg mailemne til intern notifikationsmail
// OBS: Emneformat bygges client-side kun til reference.
// Backend må ikke stole på denne streng – se kommentar ved hidden fields i HTML.
function buildEmailSubject(name, position, address) {
  const city = extractCity(address);
  const pos  = position || 'Uopfordret ansøgning';
  return 'Ansøgning - ' + pos + ' - ' + (name || '') + ' - ' + city;
}

// ── RENDER JOBS ──────────────────────────────────────────────
function renderJobs(jobs) {
  const grid = document.getElementById('jobs-grid');
  if (!grid) return;
  const active = jobs.filter(j => j.active);
  if (active.length === 0) {
    grid.innerHTML = '<div class="jobs-empty"><strong style="display:block;margin-bottom:0.5rem;">Ingen aktive opslag i øjeblikket</strong>Du er altid velkommen til at sende en uopfordret ansøgning – skriv til <a href="mailto:info@svaneeng.dk" style="color:var(--accent);">info@svaneeng.dk</a> eller brug formularen nedenfor.</div>';
    return;
  }
  const pageUrl = 'https://www.svaneeng.dk/#ledige-stillinger';
  const pageUrlEncoded = encodeURIComponent(pageUrl);

  grid.innerHTML = active.map(job => `
    <div class="job-card">
      <div class="job-card-header">
        <div class="job-card-meta">
          <span class="job-card-badge job-card-badge--type">${job.type}</span>
          <span class="job-card-badge job-card-badge--loc">${job.location}</span>
        </div>
        <h3 class="job-card-title">${job.title}</h3>
      </div>
      <p class="job-card-teaser">${job.teaser}</p>
      <div class="job-card-actions">
        <button class="job-btn-details" data-job-id="${job.id}">Læs mere</button>
        <button class="job-btn-apply" data-job-id="${job.id}" data-job-title="${job.title}">Ansøg stillingen →</button>
      </div>
      <div class="job-share">
        <span class="job-share-label">Del opslag:</span>
        <a class="job-share-btn" href="https://www.linkedin.com/sharing/share-offsite/?url=${pageUrlEncoded}" target="_blank" rel="noopener noreferrer" aria-label="Del på LinkedIn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.36 4.26 5.43v6.31zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>
          LinkedIn
        </a>
        <button class="job-share-btn job-share-copy" data-title="${job.title}" aria-label="Kopiér link">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Kopiér link
        </button>
      </div>
    </div>
  `).join('');

  // Bind events efter rendering
  grid.querySelectorAll('.job-btn-details').forEach(btn => {
    btn.addEventListener('click', () => openJobModal(btn.dataset.jobId));
  });
  grid.querySelectorAll('.job-btn-apply').forEach(btn => {
    btn.addEventListener('click', () => applyForJob(btn.dataset.jobTitle));
  });

  // Kopiér link
  grid.querySelectorAll('.job-share-copy').forEach(btn => {
    btn.addEventListener('click', function () {
      const url = pageUrl;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
          const orig = btn.innerHTML;
          btn.textContent = 'Kopieret!';
          setTimeout(() => { btn.innerHTML = orig; }, 2000);
        });
      }
    });
  });
}

// ── JOB MODAL ────────────────────────────────────────────────
function openJobModal(jobId) {
  const job = loadedJobs.find(j => j.id === jobId);
  if (!job) return;
  const modal = document.getElementById('job-modal');
  document.getElementById('job-modal-dept').textContent = job.department;
  document.getElementById('job-modal-title').textContent = job.title;
  document.getElementById('job-modal-meta').innerHTML =
    `<span class="job-card-badge job-card-badge--type">${job.type}</span>` +
    `<span class="job-card-badge job-card-badge--loc">${job.location}</span>`;
  document.getElementById('job-modal-body').innerHTML = `
    <div class="job-modal-section">
      <h3>Om stillingen</h3>
      <p>${job.description}</p>
    </div>
    <div class="job-modal-section">
      <h3>Dine typiske opgaver</h3>
      <ul>${job.tasks.map(t => `<li>${t}</li>`).join('')}</ul>
    </div>
    <div class="job-modal-section">
      <h3>Det vi forventer</h3>
      <ul>${job.requirements.map(r => `<li>${r}</li>`).join('')}</ul>
    </div>
    <div class="job-modal-section">
      <h3>Det Svaneeng tilbyder</h3>
      <ul>${job.offers.map(o => `<li>${o}</li>`).join('')}</ul>
    </div>
  `;
  const applyBtn = document.getElementById('job-modal-apply-btn');
  applyBtn.dataset.jobTitle = job.title;
  applyBtn.onclick = () => { closeJobModal(); applyForJob(job.title); };
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeJobModal() {
  const modal = document.getElementById('job-modal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

// ── AUTO-FILL ANSØGNINGSFORMULAR ─────────────────────────────
function applyForJob(jobTitle) {
  const section = document.getElementById('ansoegning');
  const posSelect = document.getElementById('applicant_position');
  if (posSelect) {
    const opts = Array.from(posSelect.options);
    const match = opts.find(o => o.value === jobTitle);
    if (match) {
      posSelect.value = jobTitle;
    } else {
      const opt = document.createElement('option');
      opt.value = jobTitle;
      opt.textContent = jobTitle;
      posSelect.appendChild(opt);
      posSelect.value = jobTitle;
    }
    updateCvRequirement(jobTitle);
  }
  if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── CV-KRAV: BETINGET OBLIGATORISK ───────────────────────────
function updateCvRequirement(position) {
  const cvInput  = document.getElementById('applicant_cv');
  const cvHint   = document.getElementById('cv-hint');
  const cvBadge  = document.getElementById('cv-required-badge');
  if (!cvInput) return;

  const isRequired = CV_REQUIRED_POSITIONS.includes(position);

  if (isRequired) {
    cvInput.setAttribute('required', '');
    cvInput.setAttribute('data-cv-required', 'true');
    cvInput.classList.add('cv-required');
    if (cvBadge)  cvBadge.classList.add('visible');
    if (cvHint)   cvHint.textContent = CV_HINT_REQUIRED;
  } else {
    cvInput.removeAttribute('required');
    cvInput.setAttribute('data-cv-required', 'false');
    cvInput.classList.remove('cv-required');
    if (cvBadge)  cvBadge.classList.remove('visible');
    if (cvHint)   cvHint.textContent = CV_HINT_OPTIONAL;
  }
}

// ── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {

  // Hent jobdata fra JSON
  fetch('assets/data/jobs.json')
    .then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    })
    .then(function (jobs) {
      loadedJobs = jobs;
      renderJobs(loadedJobs);
    })
    .catch(function () {
      const grid = document.getElementById('jobs-grid');
      if (grid) {
        grid.innerHTML = '<div class="jobs-empty">Stillinger kunne ikke indlæses. Kontakt os gerne direkte på <a href="mailto:info@svaneeng.dk" style="color:var(--accent);">info@svaneeng.dk</a>.</div>';
      }
    });

  // Modal luk-knap
  const jobModalCloseBtn = document.getElementById('job-modal-close');
  if (jobModalCloseBtn) jobModalCloseBtn.addEventListener('click', closeJobModal);

  // Modal backdrop-klik
  const jobModal = document.getElementById('job-modal');
  if (jobModal) {
    jobModal.addEventListener('click', function (e) {
      if (e.target === this) closeJobModal();
    });
  }

  // Stillingsvælger – opdater CV-krav ved ændring
  const positionSelect = document.getElementById('applicant_position');
  if (positionSelect) {
    positionSelect.addEventListener('change', function () {
      updateCvRequirement(this.value);
    });
    // Initialiser korrekt ved sideload (tom stilling = valgfrit)
    updateCvRequirement(positionSelect.value);
  }

  // ── ANSØGNINGSFORMULAR SUBMIT (PLACEHOLDER – BACKEND IKKE KOBLET) ──────────
  // Erstat action="" på <form id="applicationForm"> med backend-endpoint inden go-live.
  // Håndter submit via fetch/POST, så ansøger får inline succesbesked.
  // ──────────────────────────────────────────────────────────────────────────────
  const applicationForm = document.getElementById('applicationForm');
  if (applicationForm) {
    applicationForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name     = document.getElementById('app-name')?.value?.trim();
      const email    = document.getElementById('app-email')?.value?.trim();
      const position = document.getElementById('applicant_position')?.value?.trim();
      const address  = document.getElementById('app-address')?.value?.trim();

      if (!name || !email) {
        alert('Udfyld venligst navn og e-mail.');
        return;
      }

      // CV-validering trin 1 – er CV obligatorisk for denne stilling?
      const cvInput    = document.getElementById('applicant_cv');
      const cvIsRequired = cvInput && cvInput.getAttribute('data-cv-required') === 'true';
      const cvHasFile    = cvInput && cvInput.files && cvInput.files.length > 0;

      if (cvIsRequired && !cvHasFile) {
        const stillingLabel = position || 'denne stilling';
        alert('Ved ansøgning som ' + stillingLabel + ' skal du vedhæfte CV.');
        cvInput.focus();
        return;
      }

      // CV-validering trin 2 – filtype og størrelse (kun hvis fil er valgt)
      if (cvHasFile) {
        const file = cvInput.files[0];
        const allowedTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        const allowedExts = /\.(pdf|doc|docx)$/i;
        const maxSize = 10 * 1024 * 1024; // 10 MB
        if (!allowedTypes.includes(file.type) && !allowedExts.test(file.name)) {
          alert('Kun PDF, DOC eller DOCX er tilladt som CV/bilag.');
          return;
        }
        if (file.size > maxSize) {
          alert('Filen er for stor. Maks. tilladt størrelse er 10 MB.');
          return;
        }
      }

      // Byg mailemne til reference (bruges af backend – se kommentar ved hidden fields)
      const subject = buildEmailSubject(name, position, address);
      console.info('[Svaneeng] Beregnet mailemne (til backend-reference):', subject);

      // PLACEHOLDER: Ingen reel afsendelse – vis bekræftelse
      alert('Tak for din ansøgning, ' + name + '!\nVi vender tilbage hurtigst muligt.');
    });
  }

});
