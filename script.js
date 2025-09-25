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

        const saveState = () => { /* ... (This function is unchanged) ... */ };
        const restoreState = () => { /* ... (This function is unchanged) ... */ };
        const formatText = (command, value = null) => { /* ... (This function is unchanged) ... */ };
        const changeFontSize = (direction) => { /* ... (This function is unchanged) ... */ };
        const initializeInteractiveElement = (el) => { /* ... (This function is unchanged) ... */ };
        const initializeAllElements = () => document.querySelectorAll('.interactive-element').forEach(initializeInteractiveElement);

        // --- Initial Page Setup ---
        document.querySelector('.title-placeholder').innerHTML = data.title;
        const courseInfoText = `${data.courseName || ''} ${data.courseCode || ''}`.trim();
        if (courseInfoText) {
            document.querySelector('.course-info-placeholder').innerHTML = courseInfoText;
        } else { document.getElementById('course-element').style.display = 'none'; }
        document.querySelector('.submitted-by-placeholder').innerHTML = data.submittedBy;
        document.querySelector('.teacher-name-placeholder').innerHTML = data.teacherName;
        document.querySelector('.teacher-designation-placeholder').innerHTML = data.teacherDesignation;
        document.querySelector('.date-placeholder').innerHTML = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        
        const initialPositions = { 'logo-element':{top:'5%',left:'38%',width:'24%'}, 'info-element':{top:'18%',left:'10%',width:'80%'}, 'title-element':{top:'33%',left:'10%',width:'80%'}, 'course-element':{top:'48%',left:'10%',width:'80%'}, 'to-element':{top:'60%',left:'5%',width:'45%'}, 'by-element':{top:'60%',left:'55%',width:'40%'}, 'date-element':{top:'90%',left:'10%',width:'80%'} };
        for (const id in initialPositions) { Object.assign(document.getElementById(id).style, initialPositions[id]); }
        
        document.querySelectorAll('.interactive-element .text-content').forEach(el => {
            const parent = el.parentElement; parent.style.height = 'auto'; parent.style.height = `${el.scrollHeight + 20}px`;
        });

        const initialLogoEl = document.getElementById('logo-element');
        const logoRect = initialLogoEl.getBoundingClientRect();
        initialLogoEl.querySelector('.dimension-display').textContent = `${Math.round(logoRect.width)}px x ${Math.round(logoRect.height)}px`;
        
        isPreviewPage.classList.add('template-default', 'has-border');
        initializeAllElements();
        saveState();

        // --- Event Listeners and Interact.js (unchanged from previous correct version) ---
        // NOTE: The rest of the preview page logic remains the same as the last complete version.
        // It includes listeners for undo, add textbox, formatting, interact.js, and download.
        // The responsive scaling function 'scalePageToFit' and its call are the only things removed.
        document.getElementById('undo-btn').addEventListener('click', restoreState);
        document.getElementById('add-textbox-btn').addEventListener('click', ()=>{newTextboxCounter++;const e=document.createElement("div");e.id=`textbox-${newTextboxCounter}`,e.className="interactive-element",e.style.cssText="top: 45%; left: 30%; width: 40%; height: auto;",e.innerHTML='<div class="text-content" style="text-align: center;" contenteditable="true">New Textbox</div>',isPreviewPage.appendChild(e),initializeInteractiveElement(e),e.style.height=`${e.querySelector(".text-content").scrollHeight+20}px`,saveState()});
        document.onselectionchange=()=>{const e=window.getSelection(),t=e.anchorNode?.parentElement.closest(".text-content");if(e.rangeCount>0&&e.toString().length>0&&t){const n=e.getRangeAt(0),o=n.getBoundingClientRect();if(0===o.width){formatToolbar.classList.add("hidden");return}const i=isPreviewPage.getBoundingClientRect();formatToolbar.style.top=`${o.top-i.top-formatToolbar.offsetHeight-5}px`,formatToolbar.style.left=`${o.left-i.left+o.width/2-formatToolbar.offsetWidth/2}px`,formatToolbar.classList.remove("hidden")}else formatToolbar.classList.add("hidden")};
        formatToolbar.addEventListener("mousedown",e=>{e.preventDefault();const t=e.target.closest("button");if(!t)return;const n=t.dataset.command,o=t.dataset.value;"bold"===n||"italic"===n?formatText(n):"increaseFontSize"===n||"decreaseFontSize"===n?changeFontSize("increaseFontSize"===n?"increase":"decrease"):"align"===n&&activeElement&&(activeElement.querySelector(".text-content").style.textAlign=o,saveState())});
        interact(".interactive-element").draggable({listeners:{start:saveState,move(e){const t=e.target,n=(parseFloat(t.getAttribute("data-x"))||0)+e.dx,o=(parseFloat(t.getAttribute("data-y"))||0)+e.dy;t.style.transform=`translate(${n}px, ${o}px)`,t.setAttribute("data-x",n),t.setAttribute("data-y",o)},end:saveState},modifiers:[interact.modifiers.restrictRect({restriction:"parent"})]}).resizable({edges:{left:!0,right:!0,bottom:!0,top:!0},listeners:{start:saveState,move(e){Object.assign(e.target.style,{width:`${e.rect.width}px`,height:`${e.rect.height}px`});if("logo-element"===e.target.id){const t=e.target.querySelector(".dimension-display");t&&(t.textContent=`${Math.round(e.rect.width)}px x ${Math.round(e.rect.height)}px`)}},end:saveState},modifiers:[interact.modifiers.restrictSize({min:{width:100,height:40}})]});
        document.getElementById("download-btn").addEventListener("click",()=>{document.body.classList.add("is-printing"),isPreviewPage.style.transform="scale(1)",html2pdf().from(isPreviewPage).set({margin:0,filename:"CoverPage.pdf",image:{type:"jpeg",quality:1},html2canvas:{scale:3,useCORS:!0},jsPDF:{unit:"mm",format:"a4",orientation:"portrait"}}).save().then(()=>{document.body.classList.remove("is-printing")})});
        document.getElementById("toggle-border").addEventListener("change",e=>{isPreviewPage.classList.toggle("has-border",e.target.checked),saveState()});document.getElementById("toggle-date").addEventListener("change",e=>{document.getElementById("date-element").classList.toggle("hidden",!e.target.checked),saveState()});document.getElementById("template-switcher").addEventListener("change",e=>{const t=["template-default","template-formal","template-modern","template-minimal","template-creative"];isPreviewPage.classList.remove(...t),isPreviewPage.classList.add(e.target.value),saveState()});
    });
}
