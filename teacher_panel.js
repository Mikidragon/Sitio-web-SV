// teacher_panel.js  

// Variables globales  
let teacherId = '';  
let currentTeacher = {};  

// Función para obtener las materias del docente  
async function getSubjects() {  
    try {  
        const response = await fetch('includes/get_subjects.php', {  
            method: 'POST',  
            headers: {  
                'Content-Type': 'application/x-www-form-urlencoded',  
            },  
        });  

        const data = await response.json();  

        if (data.success) {  
            const subjectsList = document.querySelector('.subjects-list');  
            subjectsList.innerHTML = '';  

            data.subjects.forEach(subject => {  
                const subjectElement = document.createElement('div');  
                subjectElement.className = 'subject-item';  
                subjectElement.innerHTML = `  
                    <h3>${subject.subject_name}</h3>  
                    <p>${subject.subject_code}</p>  
                    <p>${subject.grade_level}</p>  
                `;  
                subjectsList.appendChild(subjectElement);  
            });