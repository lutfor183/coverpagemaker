// --- Teacher List (Re-scraped & Capitalized) ---
const teacherList = [
    { name: 'DR. A. B. M. SHAHIDUL ISLAM', designation: 'Professor' }, { name: 'DR. MD. MIZANUR RAHMAN', designation: 'Professor' },
    { name: 'DR. HARIPADA BHATTACHARJEE', designation: 'Professor' }, { name: 'DR. MD. BELAYET HOSSAIN', designation: 'Professor' },
    { name: 'DR. MAHMOOD OSMAN IMAM', designation: 'Professor' }, { name: 'DR. ZAKIR HOSSIN BHUIYAN', designation: 'Professor' },
    { name: 'DR. MOHAMMAD FARIJUL ISLAM', designation: 'Professor' }, { name: 'DR. MD. RIDHWANUL HAQ', designation: 'Professor' },
    { name: 'DR. MD. ABUL KALAM AZAD', designation: 'Professor' }, { name: 'FAHMIDA AKHTER', designation: 'Professor' },
    { name: 'S. M. NAKIB-US-SALEHIN', designation: 'Associate Professor' }, { name: 'DR. MD. NAZMUL HOSSAIN', designation: 'Associate Professor' },
    { name: 'MD. SAIFULLAH', designation: 'Associate Professor' }, { name: 'DR. RADIA TASMIR', designation: 'Associate Professor' },
    { name: 'DR. A. K. M. KAMRUL HAQUE', designation: 'Assistant Professor' }, { name: 'AMITAV KUNDU', designation: 'Assistant Professor' },
    { name: 'AFSANA AURIN', designation: 'Assistant Professor' }, { name: 'FARHANA ZARRIN', designation: 'Assistant Professor' },
    { name: 'NUSRAT J. CHOWDHURY', designation: 'Assistant Professor' }, { name: 'SANITA JANNAT', designation: 'Assistant Professor' },
    { name: 'ASIF-UL-HAQUE', designation: 'Assistant Professor' }, { name: 'FARJANA YEASMIN', designation: 'Assistant Professor' },
    { name: 'MD. OMAR FARUK', designation: 'Assistant Professor' }, { name: 'MOHAMMAD RASHEDUR RAHMAN', designation: 'Assistant Professor' },
    { name: 'MD. IFTEKHARUL ISLAM', designation: 'Assistant Professor' }, { name: 'MD. RAKIB-UL-HASAN', designation: 'Assistant Professor' },
    { name: 'SHEIKH MOHAMMED RAFI', designation: 'Lecturer' }, { name: 'ANIKA BINTE ALI', designation: 'Lecturer' },
    { name: 'SANJIDA AMIN', designation: 'Lecturer' }, { name: 'ARAFAT RAHMAN', designation: 'Lecturer' }
].sort((a, b) => a.name.localeCompare(b.name));

const isIndexPage = document.getElementById('cover-form');
const isPreviewPage = document.getElementById('a4-page');

// --- LOGIC FOR INDEX PAGE (index.html) ---
if (isIndexPage) {
    const teacherInput = document.getElementById('teacher-input');
    const teacherSuggestions = document.getElementById('teacher-suggestions');
    const teacherDataInput = document.getElementById('teacher-data');

    teacherInput.addEventListener('input', () => {
        const query = teacherInput.value.toUpperCase();
        teacherSuggestions.innerHTML = '';
        if (query.length < 2) {
            teacherSuggestions.style.display = 'none';
            return;
        }
        const filtered = teacherList.filter(t => t.name.toUpperCase().includes(query));
        if (filtered.length > 0) {
            filtered.forEach(teacher => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.innerHTML = `<div class="name">${teacher.name}</div><div class="designation">${teacher.designation}</div>`;
                item.addEventListener('click', () => {
                    teacherInput.value = teacher.name;
                    teacherDataInput.value = `${teacher.name}|${teacher.designation}`;
                    teacherSuggestions.style.display = 'none';
                });
                teacherSuggestions.appendChild(item);
            });
            teacherSuggestions.style.display = 'block';
        } else {
            teacherSuggestions.style.display = 'none';
        }
    });
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.autocomplete-container')) {
            teacherSuggestions.style.display = 'none';
        }
    });

    isIndexPage.addEventListener('submit', function(event) {
        event.preventDefault();
        const teacherValue = teacherDataInput.value || " | ";
        const teacherData = teacherValue.split('|');
        const coverData = {
            title: document.getElementById('title').value || "Untitled Document",
            courseName: document.getElementById('course-name').value,
            courseCode: document.getElementById('course-code').value,
            submittedBy: document.getElementById('submitted-by').value.replace(/\n/g, '<br>') || "N/A",
            teacherName: teacherData[0].trim(),
            teacherDesignation: teacherData[1].trim(),
        };
        localStorage.setItem('coverData', JSON.stringify(coverData));
        window.location.href = 'preview.html';
    });
}

// --- LOGIC FOR PREVIEW PAGE (preview.html) ---
if (isPreviewPage) {
    document.addEventListener('DOMContentLoaded', () => {
        const data = JSON.parse(localStorage.getItem('coverData'));
        if (!data) {
            alert("No data found. Please fill out the form first.");
            window.location.href = 'index.html';
            return;
        }

        const formatToolbar = document.getElementById('format-toolbar');
        let activeElement = null;
        let history = [];
        let newTextboxCounter = 0;

        const saveState = () => {
            const state = {
                elements: Array.from(document.querySelectorAll('.interactive-element')).map(el => ({ id: el.id, transform: el.style.transform, width: el.style.width, height: el.style.height, innerHTML: el.innerHTML, className: el.className })),
                pageClassName: isPreviewPage.className,
                borderChecked: document.getElementById('toggle-border').checked,
                dateChecked: document.getElementById('toggle-date').checked
            };
            history.push(JSON.stringify(state));
        };

        const restoreState = () => {
            if (history.length <= 1) return;
            history.pop();
            const lastState = JSON.parse(history[history.length - 1]);
            document.querySelectorAll('.interactive-element').forEach(el => {
                if (!lastState.elements.find(item => item.id === el.id)) el.remove();
            });
            lastState.elements.forEach(item => {
                let el = document.getElementById(item.id);
                if (!el) { el = document.createElement('div'); el.id = item.id; isPreviewPage.appendChild(el); }
                el.style.transform = item.transform; el.style.width = item.width; el.style.height = item.height;
                el.innerHTML = item.innerHTML; el.className = item.className;
            });
            isPreviewPage.className = lastState.pageClassName;
            document.getElementById('toggle-border').checked = lastState.borderChecked;
            document.getElementById('toggle-date').checked = lastState.dateChecked;
            document.getElementById('template-switcher').value = lastState.pageClassName.split(' ').find(c => c.startsWith('template-'));
            initializeAllElements();
        };

        const formatText = (command) => { document.execCommand(command, false, null); saveState(); };

        const changeFontSize = (direction) => {
            document.execCommand("fontSize", false, "7");
            const fontElements = document.getElementsByTagName("font");
            for (let i = 0; i < fontElements.length; ++i) {
                if (fontElements[i].size == "7") {
                    const parent = fontElements[i].parentElement;
                    const currentSize = parseFloat(window.getComputedStyle(parent).fontSize);
                    const newSize = direction === 'increase' ? currentSize + 1 : Math.max(8, currentSize - 1);
                    fontElements[i].removeAttribute("size");
                    fontElements[i].style.fontSize = newSize + "px";
                }
            }
            saveState();
        };
        
        const initializeInteractiveElement = (el) => {
            el.addEventListener('click', (e) => { e.stopPropagation(); if (activeElement) activeElement.classList.remove('selected'); activeElement = el; el.classList.add('selected'); });
            const textContent = el.querySelector('.text-content');
            if (textContent) {
                textContent.addEventListener('dblclick', () => { textContent.setAttribute('contenteditable', 'true'); textContent.focus(); });
                textContent.addEventListener('blur', () => { textContent.setAttribute('contenteditable', 'false'); saveState(); });
            }
        };

        const initializeAllElements = () => document.querySelectorAll('.interactive-element').forEach(initializeInteractiveElement);

        // --- Initial Page Setup ---
        document.querySelector('.title-placeholder').innerHTML = data.title;
        const courseInfoText = `${data.courseName || ''} ${data.courseCode || ''}`.trim();
        if (courseInfoText) { document.querySelector('.course-info-placeholder').innerHTML = courseInfoText; } 
        else { document.getElementById('course-element').style.display = 'none'; }
        document.querySelector('.submitted-by-placeholder').innerHTML = data.submittedBy;
        document.querySelector('.teacher-name-placeholder').innerHTML = data.teacherName;
        document.querySelector('.teacher-designation-placeholder').innerHTML = data.teacherDesignation;
        document.querySelector('.date-placeholder').textContent = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        
        const initialPositions = { 'logo-element':{top:'5%',left:'38%',width:'24%'}, 'info-element':{top:'18%',left:'10%',width:'80%'}, 'title-element':{top:'33%',left:'10%',width:'80%'}, 'course-element':{top:'48%',left:'10%',width:'80%'}, 'to-element':{top:'60%',left:'5%',width:'45%'}, 'by-element':{top:'60%',left:'55%',width:'40%'}, 'date-element':{top:'90%',left:'10%',width:'80%'} };
        for (const id in initialPositions) { Object.assign(document.getElementById(id).style, initialPositions[id]); }
        
        document.querySelectorAll('.interactive-element').forEach(el => {
            if (el.id !== 'logo-element') { const textContent = el.querySelector('.text-content'); if (textContent) { el.style.height = 'auto'; el.style.height = `${textContent.scrollHeight + 20}px`; } }
        });

        const initialLogoEl = document.getElementById('logo-element');
        const logoRect = initialLogoEl.getBoundingClientRect();
        initialLogoEl.querySelector('.dimension-display').textContent = `${Math.round(logoRect.width)}px x ${Math.round(logoRect.height)}px`;
        
        isPreviewPage.classList.add('template-default', 'has-border');
        initializeAllElements();
        saveState();

        // --- Event Listeners ---
        document.getElementById('undo-btn').addEventListener('click', restoreState);
        document.getElementById('add-textbox-btn').addEventListener('click', () => {
            newTextboxCounter++; const newEl = document.createElement('div'); newEl.id = `textbox-${newTextboxCounter}`;
            newEl.className = 'interactive-element'; newEl.style.cssText = 'top: 45%; left: 30%; width: 40%; height: auto;';
            newEl.innerHTML = '<div class="text-content" style="text-align: center;" contenteditable="true">New Textbox</div>';
            isPreviewPage.appendChild(newEl); initializeInteractiveElement(newEl);
            newEl.style.height = `${newEl.querySelector('.text-content').scrollHeight + 20}px`; saveState();
        });

        document.onselectionchange = () => {
            const selection = window.getSelection(); const parent = selection.anchorNode?.parentElement.closest('.text-content');
            if (selection.rangeCount > 0 && selection.toString().length > 0 && parent) {
                const range = selection.getRangeAt(0); const rect = range.getBoundingClientRect();
                const pageRect = isPreviewPage.getBoundingClientRect();
                formatToolbar.style.top = `${rect.top - pageRect.top - formatToolbar.offsetHeight - 5}px`;
                formatToolbar.style.left = `${rect.left - pageRect.left + (rect.width / 2) - (formatToolbar.offsetWidth / 2)}px`;
                formatToolbar.classList.remove('hidden');
            } else { formatToolbar.classList.add('hidden'); }
        };

        formatToolbar.addEventListener('mousedown', (e) => {
            e.preventDefault(); const button = e.target.closest('button'); if (!button) return;
            const command = button.dataset.command, value = button.dataset.value;
            if (command === 'bold' || command === 'italic') { formatText(command); }
            else if (command === 'increaseFontSize' || command === 'decreaseFontSize') { changeFontSize(command === 'increaseFontSize' ? 'increase' : 'decrease'); }
            else if (command === 'align' && activeElement) { activeElement.querySelector('.text-content').style.textAlign = value; saveState(); }
        });

        interact('.interactive-element').draggable({
            listeners: { start: saveState, move(event) { const target = event.target, x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx, y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy; target.style.transform = `translate(${x}px, ${y}px)`; target.setAttribute('data-x', x); target.setAttribute('data-y', y); }, end: saveState },
            modifiers: [interact.modifiers.restrictRect({ restriction: 'parent' })]
        }).resizable({
            edges: { left: true, right: true, bottom: true, top: true },
            listeners: {
                start: saveState, move(event) { Object.assign(event.target.style, { width: `${event.rect.width}px`, height: `${event.rect.height}px` }); if (event.target.id === 'logo-element') { const display = event.target.querySelector('.dimension-display'); if (display) { display.textContent = `${Math.round(event.rect.width)}px x ${Math.round(event.rect.height)}px`; } } }, end: saveState
            },
            modifiers: [interact.modifiers.restrictSize({ min: { width: 100, height: 40 } })]
        });
        
        document.getElementById('download-btn').addEventListener('click', () => { document.body.classList.add('is-printing'); html2pdf().from(isPreviewPage).set({ margin: 0, filename: "CoverPage.pdf", image: { type: 'jpeg', quality: 1 }, html2canvas: { scale: 3, useCORS: true }, jsPDF: { unit: "mm", format: "a4", orientation: "portrait" } }).save().then(() => { document.body.classList.remove("is-printing"); }); });
        document.getElementById('toggle-border').addEventListener('change', (e) => { isPreviewPage.classList.toggle('has-border', e.target.checked); saveState(); });
        document.getElementById('toggle-date').addEventListener('change', (e) => { document.getElementById('date-element').classList.toggle('hidden', !e.target.checked); saveState(); });
        document.getElementById('template-switcher').addEventListener('change', (e) => { const c = ['template-default', 'template-formal', 'template-modern', 'template-minimal', 'template-creative']; isPreviewPage.classList.remove(...c); isPreviewPage.classList.add(e.target.value); saveState(); });
    });
}
