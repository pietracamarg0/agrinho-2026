// CONTROLE DE PONTOS E PERSISTÊNCIA LocalStorage
let currentScore = parseInt(localStorage.getItem('ecoScore')) || 0;
document.getElementById('global-score').innerText = currentScore;

// Controle de Estado dos Desafios Concluídos
let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

// 1. SISTEMA DE NAVEGAÇÃO DE ABAS
function switchTab(tabName) {
    // Esconde todas as abas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    // Remove active da nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Ativa a aba atual
    document.getElementById(`aba-${tabName}`).classList.add('active');
    
    // Atualiza estado do botão na nav inferior correspondente
    const navItems = {
        'home': 0, 'sustentabilidade': 1, 'os5rs': 2, 'desafios': 3
    };
    document.querySelectorAll('.nav-item')[navItems[tabName]].classList.add('active');
    window.scrollTo(0, 0);
}

// 2. CARROSSEL DA HOME AUTOMÁTICO
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');

function rotateCarousel() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}
setInterval(rotateCarousel, 4000); // Muda a cada 4 segundos

// 3. EXPANDIR CARDS SUSTENTABILIDADE 101
function toggleTripe(card) {
    card.classList.toggle('expanded');
}

// 4. ACCORDION DOS 5 RS
document.querySelectorAll('.accordion-header').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.parentElement;
        item.classList.toggle('open');
        // Muda o ícone de + para -
        const icon = button.querySelector('span');
        icon.innerText = item.classList.contains('open') ? '−' : '+';
    });
});

// 5. SISTEMA DE DESAFIOS COM CONFETTI E PONTOS
function completeChallenge(taskId, points) {
    if (completedTasks.includes(taskId)) return; // Se já concluiu, ignora

    // Atualiza Pontuação Global
    currentScore += points;
    localStorage.setItem('ecoScore', currentScore);
    document.getElementById('global-score').innerText = currentScore;

    // Salva tarefa concluída
    completedTasks.push(taskId);
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));

    // Atualiza o Visual do Card
    updateChallengeUI(taskId);

    // Efeito de Confetti (Puxado do CDN injetado no HTML)
    confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#A3E4D7', '#E07A5F', '#2D3142']
    });
}

function updateChallengeUI(taskId) {
    const card = document.getElementById(taskId);
    if(card) {
        card.classList.add('done');
        const btn = card.querySelector('.btn-complete');
        btn.innerText = "Concluído! ✓";
        btn.disabled = true;
    }
}

// Inicializa estado das tarefas salvas no LocalStorage ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    completedTasks.forEach(taskId => {
        updateChallengeUI(taskId);
    });
});