// --- Data Mocks ---
const mockAgents = [
    {
        id: '1', name: 'Sarah Jenkins', role: 'Enterprise AE', capacity: '75%',
        score: '65', trend: 'negative', status: 'Needs Coaching',
        insight: "Sarah's call quality dropped 12% this week. Primary struggle: Handling pricing objections late in the deal cycle.",
        avatar: 'https://i.pravatar.cc/150?u=1'
    },
    {
        id: '2', name: 'David Chen', role: 'Mid-Market AE', capacity: '90%',
        score: '68', trend: 'negative', status: 'Needs Coaching',
        insight: "Missing key discovery questions in 40% of calls. Rushing to pitch before establishing pain points.",
        avatar: 'https://i.pravatar.cc/150?u=2'
    },
    {
        id: '4', name: 'Elena Rostova', role: 'Enterprise AE', capacity: '60%',
        score: '92', trend: 'positive', status: 'Excelling',
        insight: "Excellent handling of competitor comparisons. Use as a team standard.",
        avatar: 'https://i.pravatar.cc/150?u=4'
    }
];

const mockCoaching = [
    { title: 'Pricing Objections', agent: 'Sarah Jenkins', type: 'kb-assigned', avatar: 'https://i.pravatar.cc/150?u=1' },
    { title: 'Discovery Deep Dive', agent: 'David Chen', type: 'kb-assigned', avatar: 'https://i.pravatar.cc/150?u=2' },
    { title: 'Elevator Pitch Refinement', agent: 'Michael Ross', type: 'kb-assigned', avatar: 'https://i.pravatar.cc/150?u=3' },
    { title: 'Closing Strategies', agent: 'John Smith', type: 'kb-progress', avatar: 'https://i.pravatar.cc/150?u=8' },
    { title: 'Competitor Traps', agent: 'Elena Rostova', type: 'kb-completed', avatar: 'https://i.pravatar.cc/150?u=4' }
];

const mockTasks = [
    { id: 'T-104', name: 'Develop API Endpoints', assignee: '1', date: 'Nov 26, 2024', status: 'Completed' },
    { id: 'T-105', name: 'Onboarding Flow UI', assignee: '2', date: 'Nov 28, 2024', status: 'In Progress' },
    { id: 'T-106', name: 'Build Dashboard Layouts', assignee: '4', date: 'Nov 30, 2024', status: 'Completed' },
    { id: 'T-107', name: 'Optimize Page Load', assignee: '1', date: 'Dec 05, 2024', status: 'Pending' },
    { id: 'T-108', name: 'Cross-Browser Testing', assignee: '2', date: 'Dec 06, 2024', status: 'Pending' }
];

// --- App State ---
let currentTheme = 'light';
let charts = {}; 

// --- Elements ---
const themeToggle = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

// Mobile Menu
const hamburgerBtn = document.getElementById('hamburger-btn');
const sidebar = document.getElementById('sidebar');
const mobileOverlay = document.getElementById('mobile-overlay');

// Views
const navItems = document.querySelectorAll('.nav-item[data-target]');
const viewSections = document.querySelectorAll('.view-section');

// Components
const agentListEl = document.getElementById('agent-list');
const teamTableBody = document.getElementById('team-table-body');
const taskTableBody = document.getElementById('task-table-body');

// Half-Page Profile
const drillDownPanel = document.getElementById('agent-half-page');
const drillDownOverlay = document.getElementById('half-page-overlay');
const closeDrillDownBtn = document.getElementById('close-half-page');

// Modal
const actionModal = document.getElementById('action-modal');
const openModalBtn = document.getElementById('page-assign-nudge');
const closeModalBtns = [document.getElementById('close-modal'), document.getElementById('cancel-modal')];
const confirmModalBtn = document.getElementById('confirm-modal');

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initRouting();
    initMobileMenu();
    renderAgentList();
    renderTeamTable();
    renderTaskTable();
    renderKanban();
    renderCalendar();
    initMainChart();
});

// --- Theme Logic ---
function initTheme() {
    const icon = themeToggle.querySelector('i');
    const text = themeToggle.querySelector('span');

    themeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        htmlEl.setAttribute('data-theme', currentTheme);
        
        if (currentTheme === 'dark') {
            icon.className = 'ph ph-sun';
            text.textContent = 'Light Mode';
            Chart.defaults.color = '#94a3b8';
            Chart.defaults.borderColor = '#334155';
        } else {
            icon.className = 'ph ph-moon';
            text.textContent = 'Dark Mode';
            Chart.defaults.color = '#64748b';
            Chart.defaults.borderColor = '#e2e8f0';
        }
        
        Object.values(charts).forEach(chart => { if(chart) chart.update(); });
    });
}

// --- Mobile Menu Logic ---
function initMobileMenu() {
    const toggleMenu = () => {
        sidebar.classList.toggle('open');
        mobileOverlay.classList.toggle('open');
    };
    if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', toggleMenu);
}

// --- Routing Logic ---
function initRouting() {
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            const targetId = item.getAttribute('data-target');
            viewSections.forEach(view => view.classList.remove('active'));
            
            const targetView = document.getElementById(targetId);
            if (targetView) targetView.classList.add('active');
            
            if(targetId === 'view-performance' && charts.mainLine) {
                charts.mainLine.update();
            }
            
            if(window.innerWidth <= 768) {
                sidebar.classList.remove('open');
                mobileOverlay.classList.remove('open');
            }
        });
    });
}

// --- Render Logic ---
function renderAgentList() {
    if(!agentListEl) return;
    agentListEl.innerHTML = '';
    mockAgents.forEach(agent => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="agent-info">
                <img src="${agent.avatar}" class="avatar" alt="${agent.name}">
                <div>
                    <div class="agent-name">${agent.name}</div>
                    <div class="subtitle">Score: <span class="negative">${agent.score}</span></div>
                </div>
            </div>
            <button class="btn btn-secondary btn-sm btn-pill" onclick="openProfile('${agent.id}')">View</button>
        `;
        agentListEl.appendChild(li);
    });
}

function renderTeamTable() {
    if(!teamTableBody) return;
    teamTableBody.innerHTML = '';
    mockAgents.forEach(agent => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="agent-info">
                    <img src="${agent.avatar}" class="avatar" alt="${agent.name}">
                    <div class="agent-name">${agent.name}</div>
                </div>
            </td>
            <td><span class="subtitle">${agent.role}</span></td>
            <td><strong>${agent.capacity}</strong> booked</td>
            <td class="text-right">
                <button class="btn btn-secondary btn-sm btn-pill" onclick="openProfile('${agent.id}')">Profile Details</button>
            </td>
        `;
        teamTableBody.appendChild(tr);
    });
}

function renderTaskTable() {
    if(!taskTableBody) return;
    taskTableBody.innerHTML = '';
    mockTasks.forEach(task => {
        const tr = document.createElement('tr');
        
        // Find assigned agent safely
        let agentObj = mockAgents.find(a => a.id === task.assignee);
        let assigneeHtml = agentObj 
            ? `<div style="display:flex; align-items:center; gap:0.5rem"><img src="${agentObj.avatar}" class="avatar-sm" style="width:24px;height:24px"><span style="font-size:0.875rem">${agentObj.name}</span></div>` 
            : `<span style="font-size:0.875rem">Unassigned</span>`;

        let badgeClass = 'neutral';
        if(task.status === 'Completed') badgeClass = 'success';
        if(task.status === 'In Progress') badgeClass = 'warning';
        
        tr.innerHTML = `
            <td><strong>${task.name}</strong><br><span style="font-size:0.75rem; color:var(--text-secondary)">${task.id}</span></td>
            <td>${assigneeHtml}</td>
            <td style="font-size:0.875rem">${task.date}</td>
            <td><span class="badge ${badgeClass}">${task.status}</span></td>
            <td class="text-right">
                <button class="btn-icon"><i class="ph ph-dots-three"></i></button>
            </td>
        `;
        taskTableBody.appendChild(tr);
    });
}

function renderKanban() {
    const containers = {
        'kb-assigned': document.getElementById('kb-assigned'),
        'kb-progress': document.getElementById('kb-progress'),
        'kb-completed': document.getElementById('kb-completed')
    };
    if(!containers['kb-assigned']) return;
    Object.values(containers).forEach(c => c.innerHTML = '');

    mockCoaching.forEach(module => {
        const card = document.createElement('div');
        card.className = 'k-card';
        card.innerHTML = `
            <div class="k-card-title">${module.title}</div>
            <div class="k-card-meta">
                <div style="display:flex; align-items:center; gap: 0.5rem">
                    <img src="${module.avatar}" class="avatar" style="border-radius: 50%">
                    <span>${module.agent}</span>
                </div>
            </div>
        `;
        containers[module.type].appendChild(card);
    });
}

function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    if(!grid) return;
    grid.innerHTML = '';
    
    // Nov 2024 logic mock: Starts on Friday (Sun=0, Mon=1, Tue=2, Wed=3, Thu=4) so 5 empty slots
    for(let i=0; i<5; i++) {
        grid.innerHTML += `<div class="cal-day other-month"><span class="cal-date"></span></div>`;
    }
    
    // 30 Days mapping for Nov
    for(let i=1; i<=30; i++) {
        let events = '';
        if(i === 12) events = `<div class="cal-event">Meeting with Arc</div>`;
        if(i === 15) events = `<div class="cal-event">Platform Audit</div>`;
        if(i === 26) events = `<div class="cal-event completed">Develop API Modules</div>`;
        if(i === 28) events = `<div class="cal-event">Onboarding Flow UI</div><div class="cal-event completed">Release V2</div>`;
        if(i === 30) events = `<div class="cal-event completed">Build Dashboards</div>`;
        
        grid.innerHTML += `
        <div class="cal-day">
            <span class="cal-date">${i}</span>
            ${events}
        </div>`;
    }
}

// --- Half-Page Slide-Over Interactions ---
window.openProfile = function(id) {
    const agent = mockAgents.find(a => a.id === id);
    if (!agent) return;

    // We do NOT change the sidebar selection or hide viewSections. 
    // This allows the panel to overlay cleanly on half the screen contextually.

    document.getElementById('page-agent-avatar').src = agent.avatar;
    document.getElementById('page-agent-name').textContent = agent.name;
    document.getElementById('page-agent-role').textContent = agent.role;
    document.getElementById('page-agent-insight').textContent = agent.insight;
    document.getElementById('page-agent-score').textContent = agent.score;
    
    const scoreColor = agent.trend === 'negative' ? 'var(--danger)' : 'white';
    document.getElementById('page-agent-score').style.color = scoreColor;

    drillDownPanel.classList.add('open');
    drillDownOverlay.classList.add('open');
    
    // Initialize specific charts cleanly on demand and re-measure width
    setTimeout(() => {
        initAgentCharts();
    }, 150);
};

const closeProfile = () => {
    drillDownPanel.classList.remove('open');
    drillDownOverlay.classList.remove('open');
};
if(drillDownOverlay) drillDownOverlay.addEventListener('click', closeProfile);
if(closeDrillDownBtn) closeDrillDownBtn.addEventListener('click', closeProfile);

// --- Modal Interactions ---
if (openModalBtn) openModalBtn.addEventListener('click', () => { actionModal.classList.add('open'); });
closeModalBtns.forEach(btn => btn?.addEventListener('click', () => actionModal.classList.remove('open') ));
if (confirmModalBtn) {
    confirmModalBtn.addEventListener('click', () => {
        confirmModalBtn.innerHTML = 'Assigned';
        confirmModalBtn.style.backgroundColor = 'var(--success)';
        setTimeout(() => {
            actionModal.classList.remove('open');
            confirmModalBtn.innerHTML = 'Confirm';
            confirmModalBtn.style.backgroundColor = '';
        }, 800);
    });
}

// --- Chart.js ---
function initMainChart() {
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = '#64748b';
    Chart.defaults.borderColor = '#e2e8f0';

    const canvas = document.getElementById('scoreTrendChart');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, 'rgba(86, 90, 221, 0.3)');
    gradient.addColorStop(1, 'rgba(86, 90, 221, 0)');

    charts.mainLine = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
            datasets: [{
                data: [82, 85, 84, 88, 87, 89, 87],
                borderColor: '#565ADD',
                backgroundColor: gradient,
                borderWidth: 3, tension: 0.4, fill: true,
                pointBackgroundColor: '#565ADD',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { min: 70, max: 100 } }
        }
    });
}

function initAgentCharts() {
    if(charts.agentLine) charts.agentLine.destroy();
    
    const canvasLine = document.getElementById('agentScoreChart');
    if(!canvasLine) return;
    const ctxLine = canvasLine.getContext('2d');
    
    charts.agentLine = new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: ['W1', 'W2', 'W3', 'W4'],
            datasets: [{
                data: [82, 78, 72, 65],
                borderColor: '#ef4444', tension: 0.3, borderWidth: 2,
                pointBackgroundColor: '#ef4444'
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { min: 50, max: 100 } }
        }
    });

    if(charts.agentDonut) charts.agentDonut.destroy();
    const canvasDonut = document.getElementById('winLossChart');
    if(!canvasDonut) return;
    const ctxDonut = canvasDonut.getContext('2d');
    
    charts.agentDonut = new Chart(ctxDonut, {
        type: 'doughnut',
        data: {
            labels: ['Pricing', 'Competitor', 'Timing'],
            datasets: [{
                data: [50, 30, 20],
                backgroundColor: ['#565ADD', '#ef4444', '#f59e0b'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, cutout: '75%',
            plugins: { legend: { position: 'right' } }
        }
    });
}
