// Данные факультетов и групп
const facultiesData = {
    "Факультет Автомобильного транспорта": ["АТ-11б", "АТ-12б", "АТ-21б", "АТ-22б"],
    "Факультет Дорожных и технологических машин": ["ДМ-11б", "ДМ-12б", "ДМ-21б", "ДМ-22б"],
    "Факультет Экономики и управления": ["ЭУ-11б", "ЭУ-12б", "ЭУ-21б", "ЭУ-22б"],
    "Строительный факультет": ["СТ-11б", "СТ-12б", "СТ-21б", "СТ-22б"]
};

// Данные расписания (упрощённые, для примера)
const scheduleData = {
    "АТ-11б": [
        { day: "Понедельник", time: "9:00-10:30", subject: "Математика", room: "101", teacher: "Иванов И.И." },
        { day: "Понедельник", time: "10:40-12:10", subject: "Физика", room: "203", teacher: "Петров П.П." },
        { day: "Понедельник", time: "12:40-14:10", subject: "Информатика", room: "305", teacher: "Сидоров С.С." },
        
        { day: "Вторник", time: "9:00-10:30", subject: "Химия", room: "104", teacher: "Кузнецова А.И." },
        { day: "Вторник", time: "10:40-12:10", subject: "Математика", room: "201", teacher: "Иванов И.И." },
        
        { day: "Среда", time: "9:00-10:30", subject: "Физика", room: "203", teacher: "Петров П.П." },
        { day: "Среда", time: "10:40-12:10", subject: "Черчение", room: "401", teacher: "Смирнов В.В." },
        
        { day: "Четверг", time: "12:40-14:10", subject: "Математика", room: "101", teacher: "Иванов И.И." },
        { day: "Четверг", time: "14:20-15:50", subject: "Информатика", room: "305", teacher: "Сидоров С.С." },
        
        { day: "Пятница", time: "9:00-10:30", subject: "Физика", room: "203", teacher: "Петров П.П." },
        { day: "Пятница", time: "10:40-12:10", subject: "Химия", room: "104", teacher: "Кузнецова А.И." }
    ],
    "АТ-12б": [
        { day: "Понедельник", time: "9:00-10:30", subject: "Физика", room: "203", teacher: "Петров П.П." },
        { day: "Понедельник", time: "10:40-12:10", subject: "Математика", room: "101", teacher: "Иванов И.И." },
    ]
};

// Данные репетиторов
const tutorsData = {
    "Математика": [
        {
            name: "Иванов Иван Иванович",
            photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
            education: "МАДИ, кафедра высшей математики, к.ф.-м.н.",
            experience: "8 лет",
            contacts: "@ivanov_math",
            platform: "Telegram"
        },
        {
            name: "Смирнова Анна Петровна",
            photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w-400",
            education: "МГУ, механико-математический факультет",
            experience: "5 лет",
            contacts: "+7 (999) 123-45-67",
            platform: "Телефон"
        }
    ],
    "Физика": [
        {
            name: "Петров Петр Сергеевич",
            photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
            education: "МАДИ, кафедра физики, доцент",
            experience: "10 лет",
            contacts: "@petrov_physics",
            platform: "Telegram"
        }
    ],
    "Информатика": [
        {
            name: "Сидоров Сергей Владимирович",
            photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
            education: "МАДИ, кафедра информатики",
            experience: "6 лет",
            contacts: "sidorov_it@mail.ru",
            platform: "Email"
        }
    ],
    "Химия": [
        {
            name: "Кузнецова Алина Игоревна",
            photo: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400",
            education: "РХТУ им. Менделеева, аспирант",
            experience: "4 года",
            contacts: "@chemistry_helper",
            platform: "Telegram"
        }
    ]
};

// Дни недели для отображения
const daysOfWeek = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];