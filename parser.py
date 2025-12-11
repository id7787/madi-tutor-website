import requests
from bs4 import BeautifulSoup
import json

def parse_groups_madi(url):
    """
    Пытается получить список групп с указанной страницы raspisanie.madi.ru.
    Возвращает словарь с факультетами и группами или None в случае ошибки.
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    try:
        print(f"Загружаю страницу: {url}")
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        # Проверяем кодировку
        if response.encoding.lower() != 'utf-8':
            response.encoding = 'utf-8'

        soup = BeautifulSoup(response.text, 'html.parser')
        print("Страница загружена. Ищу данные...")

        # ВАРИАНТ 1: Ищем стандартный HTML-выпадающий список <select>
        group_select = soup.find('select', id=lambda x: x and ('group' in x.lower() or 'id_group' in x))
        if group_select:
            print("Найден выпадающий список (select). Извлекаю группы...")
            groups = []
            for option in group_select.find_all('option'):
                value = option.get('value')
                text = option.get_text(strip=True)
                # Пропускаем пустые значения и заголовки
                if value and value.isdigit() and text:
                    groups.append(text)
            return {"Группы из select": groups} if groups else None

        # ВАРИАНТ 2: Ищем список в JavaScript-переменной или JSON-структуре
        script_tags = soup.find_all('script')
        for script in script_tags:
            if script.string:
                content = script.string
                # Поиск по характерным шаблонам (нужно уточнить)
                if 'groups' in content.lower() or 'групп' in content.lower():
                    print("Найдена JavaScript-переменная с данными групп. Требуется ручной анализ.")
                    # Здесь нужно вручную проанализировать content и найти структуру данных
                    # Для примера выведем первые 500 символов скрипта
                    print("\n[Для отладки] Начало скрипта:")
                    print(content[:500])
                    return {"Инфо": "Данные найдены в JS. Требуется кастомизация парсера."}

        # ВАРИАНТ 3: Ищем таблицу или список ссылок
        print("Выпадающий список не найден. Пытаюсь найти таблицу или список...")
        # Пример поиска по тексту "АТ-" или "групп"
        all_text = soup.get_text()
        import re
        # Ищем коды групп по шаблону (например, "АТ-11б", "ДМ-21")
        potential_groups = re.findall(r'[А-Я]{2,3}-\d{2,3}[а-я]?', all_text)
        if potential_groups:
            unique_groups = sorted(set(potential_groups))
            return {"Группы найденные по шаблону": unique_groups}

        print("Не удалось найти данные стандартными методами.")
        # Сохраняем HTML для визуального анализа
        with open('debug_page.html', 'w', encoding='utf-8') as f:
            f.write(soup.prettify())
        print("Страница для отладки сохранена как 'debug_page.html'. Проверьте структуру вручную.")
        return None

    except requests.exceptions.RequestException as e:
        print(f"Ошибка сети при запросе: {e}")
        return None
    except Exception as e:
        print(f"Неожиданная ошибка: {e}")
        return None

def save_to_datajs(groups_dict, filename='data_groups.js'):
    """Сохраняет найденные группы в формате, похожем на ваш data.js."""
    if not groups_dict:
        print("Нет данных для сохранения.")
        return

    with open(filename, 'w', encoding='utf-8') as f:
        f.write('// Данные, полученные парсером с сайта МАДИ\n')
        f.write('// ВНИМАНИЕ: Это сырые данные. Их нужно вручную разнести по факультетам.\n\n')
        f.write('const parsedGroupsData = ')
        json.dump(groups_dict, f, ensure_ascii=False, indent=2, sort_keys=True)
        f.write(';\n\n')
        f.write('// Пример готовой структуры для вашего data.js:\n')
        f.write('// const facultiesData = {\n')
        f.write('//   "Факультет Автомобильного транспорта": ["АТ-11б", "АТ-12б"],\n')
        f.write('//   "Строительный факультет": ["СТ-11б", "СТ-12б"]\n')
        f.write('// };\n')
    print(f"\nСырые данные сохранены в файл '{filename}'.")

# === ЗАПУСК ПАРСЕРА ===
if __name__ == '__main__':
    target_url = 'https://raspisanie.madi.ru/tplan/r/?task=7'
    result = parse_groups_madi(target_url)

    if result:
        print("\n" + "="*50)
        print("ПАРСЕР НАШЕЛ СЛЕДУЮЩЕЕ:")
        for key, value in result.items():
            print(f"\n{key}:")
            if isinstance(value, list):
                for item in value[:20]:  # Показываем первые 20 элементов
                    print(f"  - {item}")
                if len(value) > 20:
                    print(f"  ... и ещё {len(value) - 20} групп")
            else:
                print(f"  {value}")
        print("="*50)

        # Сохраняем результат
        save_to_datajs(result)
        print("\nСледующие шаги:")
        print("1. Откройте 'data_groups.js' и проверьте данные.")
        print("2. Вручную разнесите группы по факультетам.")
        print("3. Скопируйте готовую структуру 'facultiesData' в ваш основной 'data.js'.")
    else:
        print("\nПарсер не смог извлечь список групп.")