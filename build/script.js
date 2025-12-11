document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const facultySelect = document.getElementById('faculty');
    const groupSelect = document.getElementById('group');
    const loadScheduleBtn = document.getElementById('loadSchedule');
    const currentGroupEl = document.getElementById('currentGroup');
    const weekDaysContainer = document.getElementById('weekDays');
    const semesterTable = document.getElementById('semesterTable');
    const tutorsModal = document.getElementById('tutorsModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalSubject = document.getElementById('modalSubject');
    const tutorsList = document.getElementById('tutorsList');
    const closeModalBtn = document.querySelector('.close-modal');
    const viewButtons = document.querySelectorAll('.view-btn');
    const weekView = document.getElementById('weekView');
    const semesterView = document.getElementById('semesterView');
    
    // Переменные состояния
    let currentGroup = null;
    let currentSchedule = [];
    let comments = JSON.parse(localStorage.getItem('madiComments') || '{}');
    
    // Инициализация факультетов
    function initFaculties() {
        facultySelect.innerHTML = '<option value="">Выберите факультет</option>';
        
        for (const faculty in facultiesData) {
            const option = document.createElement('option');
            option.value = faculty;
            option.textContent = faculty;
            facultySelect.appendChild(option);
        }
    }
    
    // Обработчик выбора факультета
    facultySelect.addEventListener('change', function() {
        const faculty = this.value;
        
        groupSelect.innerHTML = '<option value="">Выберите группу</option>';
        groupSelect.disabled = !faculty;
        loadScheduleBtn.disabled = true;
        
        if (faculty && facultiesData[faculty]) {
            facultiesData[faculty].forEach(group => {
                const option = document.createElement('option');
                option.value = group;
                option.textContent = group;
                groupSelect.appendChild(option);
            });
            
            groupSelect.disabled = false;
        }
    });
    
    // Обработчик выбора группы
    groupSelect.addEventListener('change', function() {
        loadScheduleBtn.disabled = !this.value;
    });
    
    // Загрузка расписания
    loadScheduleBtn.addEventListener('click', function() {
        currentGroup = groupSelect.value;
        
        if (!currentGroup || !scheduleData[currentGroup]) {
            alert('Расписание для выбранной группы пока не доступно');
            return;
        }
        
        currentSchedule = scheduleData[currentGroup];
        currentGroupEl.textContent = currentGroup;
        
        // Показать расписание
        renderWeekView();
        renderSemesterView();
        
        // Показать комментарии для группы
        showGroupComments();
    });
    
    // Рендеринг вида "Неделя"
    function renderWeekView() {
        weekDaysContainer.innerHTML = '';
        
        // Группируем занятия по дням
        const groupedByDay = {};
        
        currentSchedule.forEach(lesson => {
            if (!groupedByDay[lesson.day]) {
                groupedByDay[lesson.day] = [];
            }
            groupedByDay[lesson.day].push(lesson);
        });
        
        // Создаем карточки для каждого дня
        daysOfWeek.forEach(day => {
            if (groupedByDay[day]) {
                const dayCard = document.createElement('div');
                dayCard.className = 'day-card';
                
                let lessonsHTML = '';
                groupedByDay[day].forEach(lesson => {
                    lessonsHTML += `
                        <div class="lesson-item" data-subject="${lesson.subject}">
                            <div class="lesson-time">${lesson.time}</div>
                            <div class="lesson-subject">${lesson.subject}</div>
                            <div class="lesson-details">
                                <span>${lesson.room}</span>
                                <span>${lesson.teacher}</span>
                                <button class="help-btn" onclick="showTutors('${lesson.subject}')">
                                    <i class="fas fa-question-circle"></i>
                                </button>
                            </div>
                        </div>
                    `;
                });
                
                dayCard.innerHTML = `
                    <div class="day-header">${day}</div>
                    <div class="lessons-list">${lessonsHTML}</div>
                `;
                
                weekDaysContainer.appendChild(dayCard);
            }
        });
    }
    
    // Рендеринг вида "Семестр"
    function renderSemesterView() {
        semesterTable.innerHTML = '';
        
        currentSchedule.forEach(lesson => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${lesson.day}</td>
                <td>${lesson.time}</td>
                <td>${lesson.subject}</td>
                <td>${lesson.room}</td>
                <td>${lesson.teacher}</td>
                <td>
                    <button class="help-btn" onclick="showTutors('${lesson.subject}')">
                        <i class="fas fa-question-circle"></i> Помощь
                    </button>
                </td>
            `;
            
            semesterTable.appendChild(row);
        });
    }
    
    // Показ репетиторов для предмета
    window.showTutors = function(subject) {
        modalSubject.textContent = `Репетиторы по предмету: ${subject}`;
        
        if (tutorsData[subject] && tutorsData[subject].length > 0) {
            let tutorsHTML = '';
            
            tutorsData[subject].forEach(tutor => {
                tutorsHTML += `
                    <div class="tutor-card">
                        <div class="tutor-header">
                            <img src="${tutor.photo}" alt="${tutor.name}" class="tutor-avatar">
                            <div class="tutor-info">
                                <h4>${tutor.name}</h4>
                                <div class="tutor-education">${tutor.education}</div>
                                <span class="tutor-experience">Опыт: ${tutor.experience}</span>
                            </div>
                        </div>
                        <div class="tutor-contacts">
                            <a href="#" class="contact-link">
                                <i class="fas fa-paper-plane"></i>
                                ${tutor.contacts} (${tutor.platform})
                            </a>
                        </div>
                    </div>
                `;
            });
            
            tutorsList.innerHTML = tutorsHTML;
        } else {
            tutorsList.innerHTML = `
                <div class="comment-placeholder">
                    <p><i class="fas fa-search"></i></p>
                    <p>Пока нет репетиторов по этому предмету</p>
                    <p>Вы можете стать первым!</p>
                </div>
            `;
        }
        
        tutorsModal.classList.add('active');
        modalOverlay.classList.add('active');
    };
    
    // Закрытие модального окна
    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    function closeModal() {
        tutorsModal.classList.remove('active');
        modalOverlay.classList.remove('active');
    }
    
    // Переключение вида расписания
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const view = this.dataset.view;
            
            // Обновляем активные кнопки
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Показываем выбранный вид
            weekView.classList.remove('active-view');
            semesterView.classList.remove('active-view');
            
            if (view === 'week') {
                weekView.classList.add('active-view');
            } else {
                semesterView.classList.add('active-view');
            }
        });
    });
    
    // Комментарии для группы
    function showGroupComments() {
        const container = document.getElementById('commentsContainer');
        const groupComments = comments[currentGroup] || [];
        
        if (groupComments.length === 0) {
            container.innerHTML = `
                <div class="comment-placeholder">
                    <p><i class="fas fa-comment-slash"></i></p>
                    <p>Пока нет комментариев для этой группы</p>
                    <p>Нажмите на предмет, чтобы добавить комментарий</p>
                </div>
            `;
        } else {
            let commentsHTML = '';
            groupComments.forEach(comment => {
                commentsHTML += `
                    <div class="lesson-item">
                        <div class="lesson-subject">${comment.subject}</div>
                        <div class="lesson-details">
                            <span><i class="fas fa-calendar"></i> ${comment.date}</span>
                        </div>
                        <p style="margin-top: 0.5rem;">${comment.text}</p>
                    </div>
                `;
            });
            container.innerHTML = commentsHTML;
        }
    }
    
    // Обработчик клика на предмет для добавления комментария
    document.addEventListener('click', function(e) {
        const lessonItem = e.target.closest('.lesson-item[data-subject]');
        
        if (lessonItem && currentGroup) {
            const subject = lessonItem.dataset.subject;
            const commentText = prompt(`Добавить комментарий к предмету "${subject}":`);
            
            if (commentText && commentText.trim() !== '') {
                // Инициализируем комментарии для группы, если их нет
                if (!comments[currentGroup]) {
                    comments[currentGroup] = [];
                }
                
                // Добавляем новый комментарий
                comments[currentGroup].push({
                    subject: subject,
                    text: commentText.trim(),
                    date: new Date().toLocaleDateString('ru-RU')
                });
                
                // Сохраняем в localStorage
                localStorage.setItem('madiComments', JSON.stringify(comments));
                
                // Обновляем отображение комментариев
                showGroupComments();
                
                alert('Комментарий сохранён!');
            }
        }
    });
    
    // Инициализация приложения
    initFaculties();
    
    // Автовыбор для демонстрации (можно удалить)
    setTimeout(() => {
        facultySelect.value = "Факультет Автомобильного транспорта";
        facultySelect.dispatchEvent(new Event('change'));
        
        setTimeout(() => {
            groupSelect.value = "АТ-11б";
            loadScheduleBtn.disabled = false;
            loadScheduleBtn.click();
        }, 100);
    }, 500);
});