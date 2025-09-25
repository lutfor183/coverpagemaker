// Pre-scraped teacher list (sorted A-Z)
const teacherList = [
    { name: 'Dr. A. B. M. Shahidul Islam', designation: 'Professor' }, { name: 'Dr. A. K. M. Kamrul Haque', designation: 'Assistant Professor' }, { name: 'Arafat Rahman', designation: 'Lecturer' }, { name: 'Afsana Aurin', designation: 'Assistant Professor' }, { name: 'Amitav Kundu', designation: 'Assistant Professor' }, { name: 'Anika Binte Ali', designation: 'Lecturer' }, { name: 'Asif-ul-haque', designation: 'Assistant Professor' }, { name: 'Dr. Haripada Bhattacharjee', designation: 'Professor' }, { name: 'Dr. Mahmood Osman Imam', designation: 'Professor' }, { name: 'Dr. Md. Abul Kalam Azad', designation: 'Professor' }, { name: 'Dr. Md. Belayet Hossain', designation: 'Professor' }, { name: 'Mohammad Rashedur Rahman', designation: 'Assistant Professor' }, { name: 'Dr. Md. Mizanur Rahman', designation: 'Professor' }, { name: 'Dr. Md. Nazmul Hossain', designation: 'Associate Professor' }, { name: 'Dr. Md. Ridhwanul Haq', designation: 'Professor' }, { name: 'Fahmida Akhter', designation: 'Professor' }, { name: 'Farhana Zarrin', designation: 'Assistant Professor' }, { name: 'Farjana Yeasmin', designation: 'Assistant Professor' }, { name: 'Md. Iftekharul Islam', designation: 'Assistant Professor' }, { name: 'Md. Omar Faruk', designation: 'Assistant Professor' }, { name: 'Md. Rakib-ul-Hasan', designation: 'Assistant Professor' }, { name: 'Md. Saifullah', designation: 'Associate Professor' }, { name: 'Dr. Mohammad Farijul Islam', designation: 'Professor' }, { name: 'Nusrat J. Chowdhury', designation: 'Assistant Professor' }, { name: 'Dr. Radia Tasmir', designation: 'Associate Professor' }, { name: 'S. M. Nakib-us-Salehin', designation: 'Associate Professor' }, { name: 'Sanita Jannat', designation: 'Assistant Professor' }, { name: 'Sanjida Amin', designation: 'Lecturer' }, { name: 'Sheikh Mohammed Rafi', designation: 'Lecturer' }, { name: 'Dr. Zakir Hossin Bhuiyan', designation: 'Professor' }
].sort((a, b) => a.name.localeCompare(b.name));

const isIndexPage = document.getElementById('cover-form');
const isPreviewPage = document.getElementById('a4-page');

// --- LOGIC FOR INDEX PAGE (index.html) ---
if (isIndexPage) {
    const teacherDropdown = document.getElementById('teacher-list');
    teacherList.forEach(teacher => {
        const option = document.createElement('option');
        option.value = `${teacher.name}|${teacher.designation}`;
        option.textContent = `${teacher.name} (${teacher.designation})`;
        teacherDropdown.appendChild(option);
    });

    isIndexPage.addEventListener('submit', function(event) {
        event.preventDefault();
        const teacherData = document.getElementById('teacher-list').value.split('|');
        const coverData = {
            title: document.getElementById('title').value,
            submittedBy: document.getElementById('submitted-by').value,
            teacherName: teacherData[0],
            teacherDesignation: teacherData[1],
        };
        localStorage.setItem('coverData', JSON.stringify(coverData));
        window.location.href = 'preview.html';
    });
}

// --- LOGIC FOR PREVIEW PAGE (preview.html) ---
if (isPreviewPage) {
    document.addEventListener('DOMContentLoaded', () => {
        const storedData = localStorage.getItem('coverData');
        if (!storedData) {
            alert("No data found. Please fill out the form first.");
            window.location.href = 'index.html';
            return;
        }
        const data = JSON.parse(storedData);

        // Populate elements
        document.querySelector('.title-placeholder').textContent = data.title;
        document.querySelector('.submitted-by-placeholder').textContent = data.submittedBy;
        document.querySelector('.teacher-name-placeholder').textContent = data.teacherName;
        document.querySelector('.teacher-designation-placeholder').textContent = data.teacherDesignation;
        const submissionDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        document.querySelector('.date-placeholder').textContent = submissionDate;

        // Undo stack
        let history = [];
        const MAX_HISTORY = 30;

        function saveState() {
            const state = {};
            document.querySelectorAll('.interactive-element').forEach(el => {
                state[el.id] = {
                    html: el.innerHTML,
                    transform: el.style.transform,
                    width: el.style.width,
                    height: el.style.height
                };
            });
            history.push(state);
            if (history.length > MAX_HISTORY) {
                history.shift(); // Keep history size manageable
            }
        }

        function restoreState(state) {
            if (!state) return;
            for (const id in state) {
                const el = document.getElementById(id);
                if (el) {
                    el.innerHTML = state[id].html;
                    el.style.transform = state[id].transform;
                    el.style.width = state[id].width;
                    el.style.height = state[id].height;
                    // Re-attach interact.js attributes
                    const x = (parseFloat(el.getAttribute('data-x')) || 0);
                    const y = (parseFloat(el.getAttribute('data-y')) || 0);
                    el.style.transform = `translate(${x}px, ${y}px)`;
                }
            }
        }
        
        document.getElementById('undo-btn').addEventListener('click', () => {
             if (history.length > 1) {
                history.pop(); // Remove current state
                restoreState(history[history.length - 1]); // Restore previous state
            } else {
                alert("No more actions to undo.");
            }
        });

        // Initialize element positions
        const initialPositions = {
            'logo-element': { top: '5%', left: '38%', width: '24%', height: '12%' },
            'info-element': { top: '18%', left: '10%', width: '80%', height: '15%' },
            'title-element': { top: '40%', left: '10%', width: '80%', height: '15%' },
            'to-element': { top: '65%', left: '5%', width: '45%', height: '20%' },
            'by-element': { top: '65%', left: '55%', width: '40%', height: '20%' },
            'date-element': { top: '90%', left: '10%', width: '80%', height: '8%' }
        };

        for (const id in initialPositions) {
            const el = document.getElementById(id);
            Object.assign(el.style, initialPositions[id]);
        }
        saveState(); // Save initial layout

        // Make elements interactive
        interact('.interactive-element')
            .draggable({
                listeners: {
                    start(event) { saveState(); },
                    move(event) {
                        const target = event.target;
                        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                        target.style.transform = `translate(${x}px, ${y}px)`;
                        target.setAttribute('data-x', x);
                        target.setAttribute('data-y', y);
                    }
                },
                modifiers: [ interact.modifiers.restrictRect({ restriction: 'parent' }) ]
            })
            .resizable({
                edges: { left: true, right: true, bottom: true, top: true },
                listeners: {
                    start(event) { saveState(); },
                    move(event) {
                        let { x, y } = event.target.dataset;
                        x = (parseFloat(x) || 0); y = (parseFloat(y) || 0);
                        Object.assign(event.target.style, {
                            width: `${event.rect.width}px`,
                            height: `${event.rect.height}px`,
                        });
                        Object.assign(event.target.dataset, { x, y });
                    }
                },
                modifiers: [ interact.modifiers.restrictSize({ min: { width: 100, height: 50 } }) ]
            });

        // Make text editable on double-click
        document.querySelectorAll('.interactive-element > div, .interactive-element > h1').forEach(el => {
            el.addEventListener('dblclick', (e) => {
                const target = e.currentTarget.querySelector('p, h1, h2');
                if(target) {
                    saveState();
                    target.setAttribute('contenteditable', 'true');
                    target.focus();
                    e.currentTarget.parentElement.classList.add('editing');
                    target.addEventListener('blur', () => {
                        target.setAttribute('contenteditable', 'false');
                        e.currentTarget.parentElement.classList.remove('editing');
                    }, { once: true });
                }
            });
        });
        
        // Controls logic
        const a4Page = document.getElementById('a4-page');
        const dateElement = document.getElementById('date-element');
        document.getElementById('toggle-border').addEventListener('change', e => a4Page.classList.toggle('has-border', e.target.checked));
        document.getElementById('toggle-date').addEventListener('change', e => dateElement.classList.toggle('hidden', !e.target.checked));

        // PDF Download logic
        document.getElementById('download-btn').addEventListener('click', () => {
            document.body.classList.add('is-printing');
            const element = document.getElementById('a4-page');
            html2pdf().from(element).set({
                margin: 0,
                filename: 'CoverPage.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 3, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            }).save().then(() => {
                 document.body.classList.remove('is-printing');
            });
        });
    });
}
