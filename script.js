// ===== STATE =====
let currentPage = 1;
const totalPages = 4;

// ===== LANDING → RESUME TRANSITION =====
const resumeCard = document.getElementById('resumeCard');
const landing = document.getElementById('landing');
const resumeMain = document.getElementById('resumeMain');

resumeCard.addEventListener('click', () => {
    landing.classList.add('fade-out');
    setTimeout(() => {
        landing.style.display = 'none';
        document.body.style.overflow = 'auto';
        resumeMain.classList.remove('hidden');
        resumeMain.classList.add('visible');
        // Show nav and page controls
        setTimeout(() => {
            document.getElementById('resumeNav').classList.add('visible');
            document.getElementById('pageControls').classList.add('visible');
            // Start reveal sequence
            startRevealSequence();
        }, 300);
    }, 800);
});

// ===== REVEAL SEQUENCE WITH TOOLTIPS =====
function startRevealSequence() {
    const activePage = document.querySelector('.page.page-active');
    if (!activePage) return;
    const sections = activePage.querySelectorAll('.reveal-section');
    const tooltipEl = createTooltipElement();

    sections.forEach((section, i) => {
        setTimeout(() => {
            section.classList.add('revealed');
            const tip = section.getAttribute('data-tooltip');
            if (tip) {
                showRevealTooltip(tooltipEl, section, tip);
            }
        }, 400 + i * 600);
    });
}

function createTooltipElement() {
    let el = document.querySelector('.reveal-tooltip');
    if (!el) {
        el = document.createElement('div');
        el.className = 'reveal-tooltip';
        document.body.appendChild(el);
    }
    return el;
}

function showRevealTooltip(el, target, text) {
    const rect = target.getBoundingClientRect();
    el.textContent = text;
    el.style.top = (rect.top + rect.height / 2) + 'px';
    el.style.left = (rect.right + 15) + 'px';

    // Keep tooltip within viewport
    if (rect.right + 200 > window.innerWidth) {
        el.style.left = (rect.left - 15) + 'px';
        el.style.transform = 'translateX(-100%) translateY(-50%)';
    } else {
        el.style.transform = 'translateY(-50%)';
    }

    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2000);
}

// ===== PAGE NAVIGATION =====
const prevBtn = document.getElementById('prevPage');
const nextBtn = document.getElementById('nextPage');
const pageIndicator = document.getElementById('pageIndicator');

function goToPage(num) {
    if (num < 1 || num > totalPages) return;

    const currentEl = document.querySelector('.page.page-active');
    if (currentEl) {
        currentEl.style.animation = 'pageSlideOut 0.4s ease forwards';
        setTimeout(() => {
            currentEl.classList.remove('page-active');
            currentEl.style.display = 'none';
            currentEl.style.animation = '';
            showPage(num);
        }, 400);
    } else {
        showPage(num);
    }
}

function showPage(num) {
    currentPage = num;
    const pages = document.querySelectorAll('.page');
    const target = pages[num - 1];
    if (!target) return;

    target.style.display = 'block';
    target.classList.add('page-active');
    target.style.animation = 'pageSlideIn 0.6s ease forwards';

    // Reveal sections on new page
    const sections = target.querySelectorAll('.reveal-section');
    sections.forEach((s, i) => {
        s.classList.remove('revealed');
        setTimeout(() => s.classList.add('revealed'), 200 + i * 300);
    });

    updatePageControls();
    updateActiveNav(num);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updatePageControls() {
    pageIndicator.textContent = `${currentPage} / ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
nextBtn.addEventListener('click', () => goToPage(currentPage + 1));

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (landing.style.display !== 'none') return;
    if (e.key === 'ArrowRight') goToPage(currentPage + 1);
    if (e.key === 'ArrowLeft') goToPage(currentPage - 1);
});

// ===== NAV LINKS =====
const navLinks = document.querySelectorAll('.nav-link');
const sectionPageMap = { profile: 1, experience: 2, skills: 4, contact: 4 };

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.getAttribute('data-section');
        const page = sectionPageMap[section];
        if (page) goToPage(page);
    });
});

function updateActiveNav(pageNum) {
    navLinks.forEach(l => l.classList.remove('active'));
    const map = { 1: 'profile', 2: 'experience', 3: 'experience', 4: 'skills' };
    const target = map[pageNum];
    navLinks.forEach(l => {
        if (l.getAttribute('data-section') === target) l.classList.add('active');
    });
}

// ===== EXPANDABLE ROLES =====
function toggleRole(header) {
    const details = header.nextElementSibling;
    const isOpen = details.classList.contains('open');

    // Close all others on same page
    const page = header.closest('.page');
    page.querySelectorAll('.role-details.open').forEach(d => {
        d.classList.remove('open');
        d.previousElementSibling.classList.remove('active');
    });

    if (!isOpen) {
        details.classList.add('open');
        header.classList.add('active');
    }
}

// ===== INIT =====
updatePageControls();
