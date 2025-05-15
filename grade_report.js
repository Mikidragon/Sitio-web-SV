class GradeReport {
    constructor() {
        this.grades = {};
        this.students = [];
        this.currentCourse = null;
        this.currentSubject = null;
        this.currentPeriod = null;
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Escuchar cambios en los inputs de calificaciones
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('grade-input')) {
                this.updateStudentAverage(e.target);
                this.updateCourseStats();
            }
        });
    }

    // Cargar estudiantes del curso seleccionado
    async loadStudents() {
        const courseId = document.getElementById('courseSelect').value;
        if (!courseId) return;

        try {
            // Aquí iría la llamada al API para obtener la lista de estudiantes
            const response = await fetch(`/api/students/${courseId}`);
            this.students = await response.json();
            this.renderGradesTable();
        } catch (error) {
            console.error('Error al cargar estudiantes:', error);
            alert('Error al cargar la lista de estudiantes');
        }
    }

    // Renderizar tabla de calificaciones
    renderGradesTable() {
        const tbody = document.getElementById('gradesTableBody');
        tbody.innerHTML = '';

        this.students.forEach((student, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${student.lastName}, ${student.firstName}</td>
                <td>
                    <input type="number" 
                           class="grade-input ser" 
                           data-student="${student.id}" 
                           data-dimension="ser"
                           min="0" 
                           max="100" 
                           value="${this.getGrade(student.id, 'ser')}">
                </td>
                <td>
                    <input type="number" 
                           class="grade-input saber" 
                           data-student="${student.id}" 
                           data-dimension="saber"
                           min="0" 
                           max="100" 
                           value="${this.getGrade(student.id, 'saber')}">
                </td>
                <td>
                    <input type="number" 
                           class="grade-input hacer" 
                           data-student="${student.id}" 
                           data-dimension="hacer"
                           min="0" 
                           max="100" 
                           value="${this.getGrade(student.id, 'hacer')}">
                </td>
                <td>
                    <input type="number" 
                           class="grade-input decidir" 
                           data-student="${student.id}" 
                           data-dimension="decidir"
                           min="0" 
                           max="100" 
                           value="${this.getGrade(student.id, 'decidir')}">
                </td>
                <td class="average" id="average-${student.id}">-</td>
            `;
            tbody.appendChild(row);
        });

        this.updateAllAverages();
    }

    // Obtener calificación almacenada
    getGrade(studentId, dimension) {
        return this.grades[studentId]?.[dimension] || '';
    }

    // Actualizar promedio de un estudiante
    updateStudentAverage(input) {
        const studentId = input.dataset.student;
        const dimension = input.dataset.dimension;
        const value = parseFloat(input.value) || 0;

        // Inicializar grades para este estudiante si no existe
        if (!this.grades[studentId]) {
            this.grades[studentId] = {};
        }

        // Guardar la calificación
        this.grades[studentId][dimension] = value;

        // Calcular promedio
        const weights = {
            ser: 0.15,
            saber: 0.35,
            hacer: 0.35,
            decidir: 0.15
        };

        let average = 0;
        let totalWeight = 0;

        for (const [dim, weight] of Object.entries(weights)) {
            if (this.grades[studentId][dim] !== undefined) {
                average += this.grades[studentId][dim] * weight;
                totalWeight += weight;
            }
        }

        average = totalWeight > 0 ? average / totalWeight : 0;

        // Actualizar el promedio en la tabla
        document.getElementById(`average-${studentId}`).textContent = 
            average.toFixed(2);
    }

    // Actualizar estadísticas del curso
    updateCourseStats() {
        let totalAverage = 0;
        let passedCount = 0;
        let failedCount = 0;
        let studentCount = 0;

        for (const studentId in this.grades) {
            const averageElement = document.getElementById(`average-${studentId}`);
            const average = parseFloat(averageElement.textContent);

            if (!isNaN(average)) {
                totalAverage += average;
                if (average >= 51) passedCount++;
                else failedCount++;
                studentCount++;
            }
        }

        const courseAverage = studentCount > 0 ? totalAverage / studentCount : 0;

        document.getElementById('courseAverage').textContent = 
            courseAverage.toFixed(2);
        document.getElementById('passedCount').textContent = passedCount;
        document.getElementById('failedCount').textContent = failedCount;
    }

    // Guardar calificaciones
    async saveGrades() {
        try {
            const gradeData = {
                courseId: this.currentCourse,
                subjectId: this.currentSubject,
                period: this.currentPeriod,
                grades: this.grades
            };

            // Aquí iría la llamada al API para guardar las calificaciones
            const response = await fetch('/api/grades', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(gradeData)
            });

            if (response.ok) {
                alert('Calificaciones guardadas exitosamente');
            } else {
                throw new Error('Error al guardar las calificaciones');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al guardar las calificaciones');
        }
    }

    // Publicar calificaciones
    async publishGrades() {
        if (confirm('¿Está seguro de publicar las calificaciones? Una vez publicadas, no podrán ser modificadas.')) {
            try {
                await this.saveGrades();
                // Aquí iría la llamada al API para publicar las calificaciones
                const response = await fetch('/api/grades/publish', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        courseId: this.currentCourse,
                        subjectId: this.currentSubject,
                        period: this.currentPeriod
                    })
                });

                if (response.ok) {
                    alert('Calificaciones publicadas exitosamente');
                    window.location.href = 'teacher_panel.html';
                } else {
                    throw new Error('Error al publicar las calificaciones');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al publicar las calificaciones');
            }
        }
    }
}

// Inicializar el sistema de calificaciones
const gradeReport = new GradeReport(); 