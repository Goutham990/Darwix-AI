// --- Data Mocks ---
const mockAgents = [
    {
        id: '1',
        name: 'Sarah Jenkins',
        role: 'Enterprise AE',
        score: '65',
        trend: 'negative',
        status: 'Needs Coaching',
        insight: "Sarah's call quality dropped 12% this week. Primary struggle: Handling pricing objections late in the deal cycle.",
        avatar: 'https://i.pravatar.cc/150?u=1'
    },
    {
        id: '2',
        name: 'David Chen',
        role: 'Mid-Market AE',
        score: '68',
        trend: 'negative',
        status: 'Needs Coaching',
        insight: "Missing key discovery questions in 40% of calls. Rushing to pitch before establishing pain points.",
        avatar: 'https://i.pravatar.cc/150?u=2'
    },
    {
        id: '3',
        name: 'Michael Ross',
        role: 'Sales Development',
        score: '71',
        trend: 'negative',
        status: 'Needs Coaching',
        insight: "Low conversion on cold outreach. Needs to refine the 30-second elevator pitch.",
        avatar: 'https://i.pravatar.cc/150?u=3'
    },
    {
        id: '4',
        name: 'Elena Rostova',
        role: 'Enterprise AE',
        score: '92',
        trend: 'positive',
        status: 'Excelling',
        insight: "Excellent handling of competitor comparisons. Use as a team standard.",
        avatar: 'https://i.pravatar.cc/150?u=4'
    },
    {
        id: '5',
        name: 'Marcus Johnson',
        role: 'SMB Sales Exec',
        score: '88',
        trend: 'positive',
        status: 'On Target',
        insight: "Consistent pipeline generation. Above average call volumes.",
        avatar: 'https://i.pravatar.cc/150?u=5'
    }
];

const mockCoaching = [
    { title: 'Pricing Objections', agent: 'Sarah Jenkins', type: 'Assigned', avatar: 'https://i.pravatar.cc/150?u=1' },
    { title: 'Discovery Deep Dive', agent: 'David Chen', type: 'Assigned', avatar: 'https://i.pravatar.cc/150?u=2' },
    { title: 'Elevator Pitch Refinement', agent: 'Michael Ross', type: 'Assigned', avatar: 'https://i.pravatar.cc/150?u=3' },
    { title: 'Closing Strategies', agent: 'John Smith', type: 'In Progress', avatar: 'https://i.pravatar.cc/150?u=8' },
    { title: 'Active Listening', agent: 'Lisa Wong', type: 'In Progress', avatar: 'https://i.pravatar.cc/150?u=9' },
    { title: 'Competitor Traps', agent: 'Elena Rostova', type: 'Completed', avatar: 'https://i.pravatar.cc/150?u=4' }
];


// --- App State ---
let currentTheme = 'light';
let charts = {}; // Store chart instances

// --- Elements ---
const themeToggle = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

// Views
const navItems = document.querySelectorAll('.nav-item');
const viewSections = document.querySelectorAll('.view-section');

// Components
const agentListEl = document.getElementById('agent-list');
const teamTableBody = document.getElementById('team-table-body');

const drillDownPanel = document.getElementById('agent-drill-down');
const drillDownOverlay = document.getElementById('drill-down-overlay');
const closeDrillDownBtn = document.getElementById('close-drill-down');

const actionModal = document.getElementById('action-modal');
const openModalBtn = document.getElementById('open-action-panel');
const closeModalBtns = [document.getElementById('close-modal'), document.getElementById('cancel-modal')];
const confirmModalBtn = document.getElementById('confirm-modal');


// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initRouting();
    renderAgentList();
    renderTeamTable();
    renderKanban();
    initMainChart();
});

// --- Theme Logic ---
function initTheme() {
    const icon = themeToggle.querySelector('i');
    const text = themeToggle.querySelector('span');

    themeToggle.addEventListener('click', () => {
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
        
        // Update charts to match theme
        Object.values(charts).forEach(chart => {
            if(chart) chart.update();
        });
    });
}

// --- Routing Logic ---
function initRouting() {
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            const targetId = item.getAttribute('data-target');
            
            viewSections.forEach(view => {
                view.classList.remove('active');
            });
            
            const targetView = document.getElementById(targetId);
            if (targetView) {
                targetView.classList.add('active');
                
                // Redraw chart to fix canvas size issues on display:block
                if(targetId === 'view-performance' && charts.mainLine) {
                    charts.mainLine.update();
                }
            }
        });
    });
}


// --- Render Logic ---
function renderAgentList() {
    if(!agentListEl) return;
    agentListEl.innerHTML = '';
    // Only show top 3 needing coaching for the dashboard view
    mockAgents.slice(0, 3).forEach(agent => {
        const li = document.createElement('li');
        li.className = 'agent-list-item';
        li.innerHTML = `
            <div class="agent-info">
                <img src="${agent.avatar}" class="avatar" alt="${agent.name}">
                <div>
                    <div class="agent-name">${agent.name}</div>
                    <div class="subtitle">Score: <span class="negative">${agent.score}</span></div>
                </div>
            </div>
            <button class="btn btn-secondary" onclick="openProfile('${agent.id}')">View</button>
        `;
        agentListEl.appendChild(li);
    });
}

function renderTeamTable() {
    if(!teamTableBody) return;
    teamTableBody.innerHTML = '';
    mockAgents.forEach(agent => {
        const tr = document.createElement('tr');
        
        let statusBadge = '';
        if(agent.status === 'Needs Coaching') statusBadge = '<span class="badge danger">Needs Coaching</span>';
        else if(agent.status === 'Excelling') statusBadge = '<span class="badge success">Excelling</span>';
        else statusBadge = '<span class="badge neutral">On Target</span>';

        tr.innerHTML = `
            <td>
                <div class="agent-cell">
                    <img src="${agent.avatar}" class="avatar" alt="${agent.name}">
                    ${agent.name}
                </div>
            </td>
            <td><span class="subtitle">${agent.role}</span></td>
            <td>42%</td>
            <td><span class="${agent.trend}">${agent.score}</span></td>
            <td>${statusBadge}</td>
            <td>
                <button class="btn btn-secondary" style="padding: 0.4rem 0.8rem" onclick="openProfile('${agent.id}')">Profile</button>
            </td>
        `;
        teamTableBody.appendChild(tr);
    });
}

function renderKanban() {
    const containers = {
        'Assigned': document.getElementById('kb-assigned'),
        'In Progress': document.getElementById('kb-progress'),
        'Completed': document.getElementById('kb-completed')
    };

    if(!containers['Assigned']) return; // safety

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
                <i class="ph ph-dots-three" style="font-size: 1.2rem; cursor:pointer;"></i>
            </div>
        `;
        containers[module.type].appendChild(card);
    });
}

// --- Interactions ---
window.openProfile = function(id) {
    const agent = mockAgents.find(a => a.id === id);
    if (!agent) return;

    // Populate Data
    document.getElementById('agent-avatar').src = agent.avatar;
    document.getElementById('agent-name').textContent = agent.name;
    document.getElementById('modal-agent-name').textContent = agent.name;
    document.getElementById('agent-insight').textContent = agent.insight;

    // Open Panel
    drillDownPanel.classList.add('open');
    drillDownOverlay.classList.add('open');

    // Init sub charts
    initAgentCharts();
};

const closeProfile = () => {
    drillDownPanel.classList.remove('open');
    drillDownOverlay.classList.remove('open');
};

drillDownOverlay.addEventListener('click', closeProfile);
closeDrillDownBtn.addEventListener('click', closeProfile);

// Modal Logic
openModalBtn.addEventListener('click', () => {
    actionModal.classList.add('open');
});

closeModalBtns.forEach(btn => btn.addEventListener('click', () => {
    actionModal.classList.remove('open');
}));

confirmModalBtn.addEventListener('click', () => {
    // Mock Assignment
    confirmModalBtn.innerHTML = '<i class="ph ph-check"></i> Assigned';
    confirmModalBtn.style.backgroundColor = 'var(--success)';
    
    setTimeout(() => {
        actionModal.classList.remove('open');
        confirmModalBtn.innerHTML = 'Confirm & Assign';
        confirmModalBtn.style.backgroundColor = '';
        closeProfile(); // close profile too
    }, 1000);
});

// --- Chart.js ---
function initMainChart() {
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = '#64748b';
    Chart.defaults.borderColor = '#e2e8f0';
    const primaryColor = '#565ADD';

    const canvas = document.getElementById('scoreTrendChart');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(86, 90, 221, 0.2)');
    gradient.addColorStop(1, 'rgba(86, 90, 221, 0)');

    charts.mainLine = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Avg Team Score',
                data: [82, 85, 84, 88, 87, 89, 87.5],
                borderColor: primaryColor,
                backgroundColor: gradient,
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: primaryColor
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: false, min: 70, max: 100 }
            }
        }
    });
}

function initAgentCharts() {
    // Score Line Chart
    if(charts.agentLine) charts.agentLine.destroy();
    
    const canvasLine = document.getElementById('agentScoreChart');
    if(!canvasLine) return;
    const ctxLine = canvasLine.getContext('2d');
    
    charts.agentLine = new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Score',
                data: [82, 78, 72, 65],
                borderColor: '#ef4444', // Danger color for drop
                tension: 0.3,
                borderWidth: 2,
                pointBackgroundColor: '#ef4444'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { min: 50, max: 100 } }
        }
    });

    // Win Loss Donut
    if(charts.agentDonut) charts.agentDonut.destroy();
    
    const canvasDonut = document.getElementById('winLossChart');
    if(!canvasDonut) return;
    const ctxDonut = canvasDonut.getContext('2d');
    
    charts.agentDonut = new Chart(ctxDonut, {
        type: 'doughnut',
        data: {
            labels: ['Price Overview', 'Competitor Comparison', 'Feature Gaps', 'Timing'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: [
                    '#565ADD', // Primary
                    '#ef4444', // Danger
                    '#f59e0b', // Warning
                    '#94a3b8'  // Secondary
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: { position: 'right', labels: { boxWidth: 12, font: {family: "'Inter', sans-serif"} } }
            }
        }
    });
}
