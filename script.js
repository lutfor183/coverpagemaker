// --- Teacher List (Pre-scraped & Sorted) ---
const teacherList=[{name:"Dr. A. B. M. Shahidul Islam",designation:"Professor"},{name:"Dr. A. K. M. Kamrul Haque",designation:"Assistant Professor"},{name:"Arafat Rahman",designation:"Lecturer"},{name:"Afsana Aurin",designation:"Assistant Professor"},{name:"Amitav Kundu",designation:"Assistant Professor"},{name:"Anika Binte Ali",designation:"Lecturer"},{name:"Asif-ul-haque",designation:"Assistant Professor"},{name:"Dr. Haripada Bhattacharjee",designation:"Professor"},{name:"Dr. Mahmood Osman Imam",designation:"Professor"},{name:"Dr. Md. Abul Kalam Azad",designation:"Professor"},{name:"Dr. Md. Belayet Hossain",designation:"Professor"},{name:"Mohammad Rashedur Rahman",designation:"Assistant Professor"},{name:"Dr. Md. Mizanur Rahman",designation:"Professor"},{name:"Dr. Md. Nazmul Hossain",designation:"Associate Professor"},{name:"Dr. Md. Ridhwanul Haq",designation:"Professor"},{name:"Fahmida Akhter",designation:"Professor"},{name:"Farhana Zarrin",designation:"Assistant Professor"},{name:"Farjana Yeasmin",designation:"Assistant Professor"},{name:"Md. Iftekharul Islam",designation:"Assistant Professor"},{name:"Md. Omar Faruk",designation:"Assistant Professor"},{name:"Md. Rakib-ul-Hasan",designation:"Assistant Professor"},{name:"Md. Saifullah",designation:"Associate Professor"},{name:"Dr. Mohammad Farijul Islam",designation:"Professor"},{name:"Nusrat J. Chowdhury",designation:"Assistant Professor"},{name:"Dr. Radia Tasmir",designation:"Associate Professor"},{name:"S. M. Nakib-us-Salehin",designation:"Associate Professor"},{name:"Sanita Jannat",designation:"Assistant Professor"},{name:"Sanjida Amin",designation:"Lecturer"},{name:"Sheikh Mohammed Rafi",designation:"Lecturer"},{name:"Dr. Zakir Hossin Bhuiyan",designation:"Professor"}].sort((a,b)=>a.name.localeCompare(b.name));

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
        const teacherSelect = document.getElementById('teacher-list');
        const teacherValue = teacherSelect.value || " | ";
        const teacherData = teacherValue.split('|');
        const coverData = {
            title: document.getElementById('title').value || "Untitled Document",
            courseName: document.getElementById('course-name').value,
            courseCode: document.getElementById('course-code').value,
            submittedBy: document.getElementById('submitted-by').value.replace(/\n/g, '<br>') || "N/A",
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
                elements: Array.from(document.querySelectorAll('.interactive-element')).map(el => ({
                    id: el.id,
                    transform: el.style.transform,
                    width: el.style.width,
                    height: el.style.height,
                    innerHTML: el.innerHTML,
                    className: el.className
                })),
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
                if (!lastState.elements.find(item => item.id === el.id)) {
                    el.remove();
                }
            });

            lastState.elements.forEach(item => {
                let el = document.getElementById(item.id);
                if (!el) {
                    el = document.createElement('div');
                    el.id = item.id;
                    isPreviewPage.appendChild(el);
                }
                el.style.transform = item.transform;
                el.style.width = item.width;
                el.style.height = item.height;
                el.innerHTML = item.innerHTML;
                el.className = item.className;
            });

            isPreviewPage.className = lastState.pageClassName;
            document.getElementById('toggle-border').checked = lastState.borderChecked;
            document.getElementById('toggle-date').checked = lastState.dateChecked;
            document.getElementById('template-switcher').value = lastState.pageClassName.split(' ').find(c=>c.startsWith('template-'));
            initializeAllElements();
        };

        const formatText = (command, value = null) => {
            document.execCommand(command, false, value);
            saveState();
        };

        const changeFontSize = (direction) => {
            document.execCommand("fontSize", false, "7");
            const fontElements = document.getElementsByTagName("font");
            for (let i = 0, len = fontElements.length; i < len; ++i) {
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
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                if (activeElement) activeElement.classList.remove('selected');
                activeElement = el;
                el.classList.add('selected');
            });
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
        if (courseInfoText) {
            document.querySelector('.course-info-placeholder').innerHTML = courseInfoText;
        } else {
            document.getElementById('course-element').style.display = 'none';
        }
        document.querySelector('.submitted-by-placeholder').innerHTML = data.submittedBy;
        document.querySelector('.teacher-name-placeholder').innerHTML = data.teacherName;
        document.querySelector('.teacher-designation-placeholder').innerHTML = data.teacherDesignation;
        document.querySelector('.date-placeholder').innerHTML = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        
        const initialPositions = { 'logo-element':{top:'5%',left:'38%',width:'24%'}, 'info-element':{top:'18%',left:'10%',width:'80%'}, 'title-element':{top:'33%',left:'10%',width:'80%'}, 'course-element':{top:'48%',left:'10%',width:'80%'}, 'to-element':{top:'60%',left:'5%',width:'45%'}, 'by-element':{top:'60%',left:'55%',width:'40%'}, 'date-element':{top:'90%',left:'10%',width:'80%'} };
        for (const id in initialPositions) { Object.assign(document.getElementById(id).style, initialPositions[id]); }
        
        document.querySelectorAll('.interactive-element').forEach(el => {
            if (el.id !== 'logo-element') {
                const textContent = el.querySelector('.text-content');
                if (textContent) {
                    el.style.height = 'auto'; el.style.height = `${textContent.scrollHeight + 20}px`;
                }
            }
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
            newTextboxCounter++;
            const newEl = document.createElement('div');
            newEl.id = `textbox-${newTextboxCounter}`;
            newEl.className = 'interactive-element';
            newEl.style.cssText = 'top: 45%; left: 30%; width: 40%; height: auto;';
            newEl.innerHTML = '<div class="text-content" style="text-align: center;" contenteditable="true">New Textbox</div>';
            isPreviewPage.appendChild(newEl);
            initializeInteractiveElement(newEl);
            newEl.style.height = `${newEl.querySelector('.text-content').scrollHeight + 20}px`;
            saveState();
        });

        document.onselectionchange = () => {
            const selection = window.getSelection();
            const parent = selection.anchorNode?.parentElement.closest('.text-content');
            if (selection.rangeCount > 0 && selection.toString().length > 0 && parent) {
                const range = selection.getRangeAt(0); const rect = range.getBoundingClientRect();
                const pageRect = isPreviewPage.getBoundingClientRect();
                formatToolbar.style.top = `${rect.top - pageRect.top - formatToolbar.offsetHeight - 5}px`;
                formatToolbar.style.left = `${rect.left - pageRect.left + (rect.width / 2) - (formatToolbar.offsetWidth / 2)}px`;
                formatToolbar.classList.remove('hidden');
            } else {
                formatToolbar.classList.add('hidden');
            }
        };

        formatToolbar.addEventListener('mousedown', (e) => {
            e.preventDefault();
            const button = e.target.closest('button'); if (!button) return;
            const command = button.dataset.command, value = button.dataset.value;
            if (command === 'bold' || command === 'italic') { formatText(command); }
            else if (command === 'increaseFontSize' || command === 'decreaseFontSize') { changeFontSize(command === 'increaseFontSize' ? 'increase' : 'decrease'); }
            else if (command === 'align' && activeElement) { activeElement.querySelector('.text-content').style.textAlign = value; saveState(); }
        });

        interact('.interactive-element').draggable({
            listeners: {
                start: saveState,
                move(event) {
                    const target = event.target;
                    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                    target.style.transform = `translate(${x}px, ${y}px)`;
                    target.setAttribute('data-x', x); target.setAttribute('data-y', y);
                },
                end: saveState
            },
            modifiers: [interact.modifiers.restrictRect({ restriction: 'parent' })]
        }).resizable({
            edges: { left: true, right: true, bottom: true, top: true },
            listeners: {
                start: saveState,
                move(event) {
                    Object.assign(event.target.style, { width: `${event.rect.width}px`, height: `${event.rect.height}px` });
                    if (event.target.id === 'logo-element') {
                        const display = event.target.querySelector('.dimension-display');
                        if (display) { display.textContent = `${Math.round(event.rect.width)}px x ${Math.round(event.rect.height)}px`; }
                    }
                },
                end: saveState
            },
            modifiers: [interact.modifiers.restrictSize({ min: { width: 100, height: 40 } })]
        });
        
        const scalePageToFit=()=>{const c=document.querySelector(".a4-container"),s=c.offsetWidth/794;isPreviewPage.style.setProperty("--page-scale",s<1?s:1)};window.addEventListener("resize",scalePageToFit);scalePageToFit();document.getElementById("download-btn").addEventListener("click",()=>{document.body.classList.add("is-printing");isPreviewPage.style.transform="scale(1)";html2pdf().from(isPreviewPage).set({margin:0,filename:"CoverPage.pdf",image:{type:"jpeg",quality:1},html2canvas:{scale:3,useCORS:!0},jsPDF:{unit:"mm",format:"a4",orientation:"portrait"}}).save().then(()=>{document.body.classList.remove("is-printing");scalePageToFit()})});document.getElementById("toggle-border").addEventListener("change",(e)=>{isPreviewPage.classList.toggle("has-border",e.target.checked);saveState()});document.getElementById("toggle-date").addEventListener("change",(e)=>{document.getElementById("date-element").classList.toggle("hidden",!e.target.checked);saveState()});document.getElementById("template-switcher").addEventListener("change",(e)=>{const c=["template-default","template-formal","template-modern","template-minimal","template-creative"];isPreviewPage.classList.remove(...c);isPreviewPage.classList.add(e.target.value);saveState()});
    });
}
