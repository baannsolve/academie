// ============================================
// PARTICULES FLOTTANTES
// ============================================
function createParticles() {
    const container = document.getElementById('particles-container');
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 8 + 4;
        const left = Math.random() * 100;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 10;

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            animation-duration: ${duration}s;
            animation-delay: -${delay}s;
        `;

        container.appendChild(particle);
    }
}

// ============================================
// NAVIGATION AVEC EFFET RIPPLE
// ============================================
function initNavigation() {
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Effet ripple
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const rect = this.getBoundingClientRect();
            ripple.style.left = (e.clientX - rect.left) + 'px';
            ripple.style.top = (e.clientY - rect.top) + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);

            // Changement de section
            document.querySelectorAll('nav a').forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            const sectionId = this.getAttribute('data-section');
            const section = document.getElementById(sectionId);
            section.classList.add('active');

            // Animer les cartes de la section
            animateCards(section);

            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// ============================================
// ANIMATION DES CARTES AU CHARGEMENT
// ============================================
function animateCards(section) {
    const cards = section.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.classList.remove('visible');
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 100);
    });
}

// ============================================
// SUIVI DE PROGRESSION
// ============================================
const viewedElements = new Set();
let totalElements = 0;

function initProgress() {
    totalElements = document.querySelectorAll('.card[data-card-id]').length;
    document.getElementById('total-count').textContent = totalElements;
    loadProgress();
}

function updateProgress() {
    const count = viewedElements.size;
    const percentage = (count / totalElements) * 100;

    document.getElementById('viewed-count').textContent = count;
    document.getElementById('progress-fill').style.width = percentage + '%';

    // Sauvegarder dans localStorage
    localStorage.setItem('viewedElements', JSON.stringify([...viewedElements]));
}

function loadProgress() {
    const saved = localStorage.getItem('viewedElements');
    if (saved) {
        const savedArray = JSON.parse(saved);
        savedArray.forEach(id => viewedElements.add(id));

        // Marquer les cartes comme vues
        viewedElements.forEach(id => {
            const card = document.querySelector(`[data-card-id="${id}"]`);
            if (card) card.classList.add('viewed');
        });

        updateProgress();
    }
}

function toggleProgress() {
    const tracker = document.getElementById('progress-tracker');
    const btn = tracker.querySelector('.minimize-btn');
    tracker.classList.toggle('minimized');
    btn.textContent = tracker.classList.contains('minimized') ? '+' : '−';
}

// ============================================
// CLIC SUR LES CARTES
// ============================================
function initCards() {
    document.querySelectorAll('.card[data-card-id]').forEach(card => {
        card.addEventListener('click', function() {
            const cardId = this.getAttribute('data-card-id');

            // Marquer comme vu
            if (!viewedElements.has(cardId)) {
                viewedElements.add(cardId);
                this.classList.add('viewed');
                updateProgress();
            }

            // Ouvrir le modal avec les details
            openModal(this);
        });
    });
}

// ============================================
// MODAL
// ============================================
function openModal(card) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');

    // Cloner le contenu de la carte
    const content = card.querySelector('.card-content').cloneNode(true);
    modalBody.innerHTML = '';
    modalBody.appendChild(content);

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function initModal() {
    // Fermer avec clic exterieur
    document.getElementById('modal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });

    // Fermer avec Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });
}

// ============================================
// BLOC-NOTES
// ============================================
function toggleNotepad() {
    const notepad = document.getElementById('notepad');
    notepad.classList.toggle('visible');
}

function saveNotes() {
    const notes = document.getElementById('notes-area').value;
    localStorage.setItem('investigation-notes', notes);

    // Feedback visuel
    const btn = document.querySelector('.notepad-save');
    const originalText = btn.textContent;
    btn.textContent = '✓ Sauvegarde !';
    btn.style.background = '#27ae60';

    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 1500);
}

function loadNotes() {
    const saved = localStorage.getItem('investigation-notes');
    if (saved) {
        document.getElementById('notes-area').value = saved;
    }
}

function initNotepad() {
    // Auto-save des notes
    document.getElementById('notes-area').addEventListener('input', function() {
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(saveNotes, 2000);
    });
}

// ============================================
// FORMULAIRE DE THEORIE
// ============================================
function initForm() {
    const form = document.getElementById('theory-form');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Recuperer les donnees
        const theory = {
            suspect: document.getElementById('suspect-choice').value,
            motive: document.getElementById('motive').value,
            evidence: document.getElementById('evidence').value,
            method: document.getElementById('method').value,
            timestamp: new Date().toISOString()
        };

        // Sauvegarder localement
        localStorage.setItem('submitted-theory', JSON.stringify(theory));

        // Afficher confirmation
        this.style.display = 'none';
        document.getElementById('confirmation').classList.add('visible');

        // Effet confetti
        createConfetti();
    });

    // Verifier si theorie deja soumise
    const savedTheory = localStorage.getItem('submitted-theory');
    if (savedTheory) {
        form.style.display = 'none';
        document.getElementById('confirmation').classList.add('visible');
    }
}

// ============================================
// CONFETTI
// ============================================
function createConfetti() {
    const colors = ['#c0392b', '#27ae60', '#f39c12', '#3498db', '#9b59b6'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            z-index: 3000;
            animation: confetti-fall ${Math.random() * 2 + 2}s linear forwards;
        `;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4000);
    }
}

// ============================================
// RACCOURCIS CLAVIER
// ============================================
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        const isTyping = document.activeElement.tagName === 'TEXTAREA' ||
                         document.activeElement.tagName === 'INPUT';

        // N pour ouvrir le bloc-notes
        if (e.key === 'n' && !e.ctrlKey && !e.metaKey && !isTyping) {
            toggleNotepad();
        }

        // Numeros 1-7 pour naviguer
        if (e.key >= '1' && e.key <= '7' && !isTyping) {
            const links = document.querySelectorAll('nav a');
            const index = parseInt(e.key) - 1;
            if (links[index]) links[index].click();
        }
    });
}

// ============================================
// RESET DES DONNEES (pour les tests)
// ============================================
function resetAllData() {
    localStorage.removeItem('viewedElements');
    localStorage.removeItem('investigation-notes');
    localStorage.removeItem('submitted-theory');
    location.reload();
}

// ============================================
// INITIALISATION GLOBALE
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Creer les particules
    createParticles();

    // Initialiser la navigation
    initNavigation();

    // Initialiser le suivi de progression
    initProgress();

    // Initialiser les cartes cliquables
    initCards();

    // Initialiser le modal
    initModal();

    // Initialiser le bloc-notes
    loadNotes();
    initNotepad();

    // Initialiser le formulaire
    initForm();

    // Initialiser les raccourcis clavier
    initKeyboardShortcuts();

    // Animer les cartes de la section active au chargement
    const activeSection = document.querySelector('.section.active');
    if (activeSection) {
        setTimeout(() => animateCards(activeSection), 300);
    }

    console.log('🍃 Enquete Konoha - Site initialise avec succes !');
    console.log('💡 Astuce: Appuyez sur N pour ouvrir le bloc-notes');
    console.log('💡 Astuce: Utilisez les touches 1-7 pour naviguer');
});
