import openpyxl

input_file = r"C:\Users\חדש\PycharmProjects\PythonProject\logs.txt.xlsx"
N = int(input("Enter the number of top errors to return: "))

"""פיצול קובץ Excel גדול לחתיכות קטנות באמצעות yield"""
def split_large_excel_file(input_file, chunk_size=100000):


    wb = openpyxl.load_workbook(input_file)
    sheet = wb.active

    rows = []  # רשימה שתאחסן את השורות הנוכחיות

    # עבור כל שורה בגליון
    for i, row in enumerate(sheet.iter_rows(values_only=True)):
        rows.append(row)
        if len(rows) == chunk_size:
            yield rows
            rows = []  # ניקוי הרשימה להכנה לחתיכה הבאה

    # אם יש שורות שנשארו לאחר סיום הלולאה (חתיכה אחרונה)
    if rows:
        yield rows

    """פונקציה לחילוץ ערך ה-Error מתוך המחרוזת"""

def extract_error_value(error_string):
    if isinstance(error_string, str) and 'Error:' in error_string:
        return error_string.split('Error: ')[1]
    return None

"""פונקציה לעדכון מונה השגיאות במילון"""
def update_error_count(error_value, error_count):
    if error_value:
        if error_value in error_count:
            error_count[error_value] += 1
        else:
            error_count[error_value] = 1

def read_excel(input_file, N):
    error_count = {}  # המילון הכולל של כל השגיאות

    for idx, part in enumerate(split_large_excel_file(input_file, 100000)):

        chunk_error_count = {}  # מילון שגיאות לחתיכה הנוכחית
        for row in part:
            error_value = extract_error_value(row[0])
            update_error_count(error_value, chunk_error_count)

        for error, count in chunk_error_count.items():
            error_count[error] = error_count.get(error, 0) + count

    print("Total error counts for the entire file:", error_count)

    # מיון בסדר יורד
    sorted_errors = sorted(error_count.items(), key=lambda x: x[1], reverse=True)
    print("Sorted errors:", sorted_errors)
    # קבלת הN שגיאות הנפוצות
    top_errors = sorted_errors[:N]
    print(f"\nTop {N} most common errors:")
    for error, count in top_errors:
        print(f"Error: {error}, Count: {count}")

    return top_errors

def main():
    thefinalNerror = read_excel(input_file, N)
    print(thefinalNerror)

main()

