// Pre-scraped teacher list to avoid CORS issues and ensure reliability
const teacherList = [
    { name: 'Dr. A. B. M. Shahidul Islam', designation: 'Professor' },
    { name: 'Dr. Md. Mizanur Rahman', designation: 'Professor' },
    { name: 'Dr. Haripada Bhattacharjee', designation: 'Professor' },
    { name: 'Dr. Md. Belayet Hossain', designation: 'Professor' },
    { name: 'Dr. Mahmood Osman Imam', designation: 'Professor' },
    { name: 'Dr. Zakir Hossin Bhuiyan', designation: 'Professor' },
    { name: 'Dr. Mohammad Farijul Islam', designation: 'Professor' },
    { name: 'Dr. Md. Ridhwanul Haq', designation: 'Professor' },
    { name: 'Dr. Md. Abul Kalam Azad', designation: 'Professor' },
    { name: 'Dr. A. K. M. Kamrul Haque', designation: 'Assistant Professor' },
    { name: 'Fahmida Akhter', designation: 'Professor' },
    { name: 'S. M. Nakib-us-Salehin', designation: 'Associate Professor' },
    { name: 'Dr. Md. Nazmul Hossain', designation: 'Associate Professor' },
    { name: 'Md. Saifullah', designation: 'Associate Professor' },
    { name: 'Dr. Radia Tasmir', designation: 'Associate Professor' },
    { name: 'Amitav Kundu', designation: 'Assistant Professor' },
    { name: 'Afsana Aurin', designation: 'Assistant Professor' },
    { name: 'Farhana Zarrin', designation: 'Assistant Professor' },
    { name: 'Nusrat J. Chowdhury', designation: 'Assistant Professor' },
    { name: 'Sanita Jannat', designation: 'Assistant Professor' },
    { name: 'Asif-ul-haque', designation: 'Assistant Professor' },
    { name: 'Farjana Yeasmin', designation: 'Assistant Professor' },
    { name: 'Md. Omar Faruk', designation: 'Assistant Professor' },
    { name: 'Mohammad Rashedur Rahman', designation: 'Assistant Professor' },
    { name: 'Md. Iftekharul Islam', designation: 'Assistant Professor' },
    { name: 'Md. Rakib-ul-Hasan', designation: 'Assistant Professor' },
    { name: 'Sheikh Mohammed Rafi', designation: 'Lecturer' },
    { name: 'Anika Binte Ali', designation: 'Lecturer' },
    { name: 'Sanjida Amin', designation: 'Lecturer' },
    { name: 'Arafat Rahman', designation: 'Lecturer' }
].sort((a, b) => a.name.localeCompare(b.name)); // Sort A-Z by name

// Check which page we are on by looking for a unique element
const isIndexPage = document.getElementById('cover-form');
const isPreviewPage = document.getElementById('a4-page');

// --- LOGIC FOR INDEX PAGE (index.html) ---
if (isIndexPage) {
    // Populate the teacher dropdown menu
    const teacherDropdown = document.getElementById('teacher-list');
    teacherList.forEach(teacher => {
        const option = document.createElement('option');
        // Store both name and designation in the value, separated by a pipe
        option.value = `${teacher.name}|${teacher.designation}`;
        option.textContent = `${teacher.name} (${teacher.designation})`;
        teacherDropdown.appendChild(option);
    });

    // Handle form submission
    document.getElementById('cover-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Get values from the form
        const title = document.getElementById('title').value;
        const submittedBy = document.getElementById('submitted-by').value;
        const teacherData = document.getElementById('teacher-list').value.split('|');
        const teacherName = teacherData[0];
        const teacherDesignation = teacherData[1];
        const template = document.getElementById('template').value;

        // Store data in localStorage to pass to the preview page
        const coverData = {
            title,
            submittedBy,
            teacherName,
            teacherDesignation,
            template
        };
        localStorage.setItem('coverData', JSON.stringify(coverData));

        // Redirect to the preview page
        window.location.href = 'preview.html';
    });
}

// --- LOGIC FOR PREVIEW PAGE (preview.html) ---
if (isPreviewPage) {
    document.addEventListener('DOMContentLoaded', function() {
        // Retrieve data from localStorage
        const storedData = localStorage.getItem('coverData');

        if (!storedData) {
            // If no data, redirect back to the form
            alert("No data found. Please fill out the form first.");
            window.location.href = 'index.html';
            return;
        }

        const data = JSON.parse(storedData);

        // Populate the preview page with the data
        document.querySelector('.title-placeholder').textContent = data.title;
        document.querySelector('.submitted-by-placeholder').textContent = data.submittedBy;
        document.querySelector('.teacher-name-placeholder').textContent = data.teacherName;
        document.querySelector('.teacher-designation-placeholder').textContent = data.teacherDesignation;
        
        // Set current date
        const submissionDate = new Date().toLocaleDateString('en-GB', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
        document.querySelector('.date-placeholder').textContent = submissionDate;

        // Apply the selected template class
        document.getElementById('a4-page').classList.add(data.template);

        // Setup the download button
        const downloadBtn = document.getElementById('download-btn');
        downloadBtn.addEventListener('click', function() {
            const element = document.getElementById('a4-page');
            const opt = {
                margin:       0,
                filename:     'CoverPage-' + data.title.replace(/ /g,"_") + '.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 3, useCORS: true },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            // Use html2pdf library to generate and download the PDF
            html2pdf().from(element).set(opt).save();
        });
    });
}
