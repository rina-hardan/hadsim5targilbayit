import pandas as pd
from datetime import datetime
import os
excel_file = r"C:\Users\חדש\PycharmProjects\PythonProject\time_series.xlsx"
csv_file = r"C:\Users\חדש\PycharmProjects\PythonProject\time_series.csv"
output_dir = r"C:\Users\חדש\PycharmProjects\PythonProject\split_files"
final_output = r"C:\Users\חדש\PycharmProjects\PythonProject\final_aggregated.csv"
date_column = "timestamp"
parquet_file=r"C:\Users\חדש\Downloads\time_series.parquet"
finalMerge_file = r"C:\Users\חדש\PycharmProjects\PythonProject\final_merged_output.csv"


# ממירה קובץ Excel לקובץ CSV אם הוא לא קיים כבר
def convert_excel_to_csv(excel_file_path, csv_file_path):
        if not os.path.exists(csv_file_path):
            df = pd.read_excel(excel_file_path, engine='openpyxl')
            df.to_csv(csv_file_path, index=False)
        else:
            print("CSV file already exists, skipping conversion.")

 # בודקת את פורמט התאריך בעמודת תאריך ומסירה שורות עם תאריכים לא תקינים
def check_date_column_format(csv_file, date_column, date_format="%Y-%m-%d %H:%M:%S"):
    df = pd.read_csv(csv_file)

    # חיפוש תאריכים לא תקינים ומחיקת השורות
    invalid_indexes = []  # רשימה לשמירת אינדקסים של שורות עם תאריכים לא תקינים

    # בודקים אם כל הערכים בעמודת התאריך תואמים לפורמט הצפוי
    for index, timestamp in enumerate(df[date_column]):
        if not check_date_format(timestamp, date_format):
            invalid_indexes.append(index)

    # מחיקת שורות עם תאריכים לא תקינים
    df = df.drop(invalid_indexes)

    # הדפסת התוצאות
    if invalid_indexes:
        print(f"Removed {len(invalid_indexes)} rows with invalid timestamps.")
    else:
        print("All timestamps are valid!")

    # שמירת הקובץ אחרי מחיקת השורות הלא תקינות
    df.to_csv(csv_file, index=False)
    print(f"File with valid timestamps has been saved to {csv_file}")

# בודקת אם המחרוזת תואמת לפורמט התאריך הצפוי
def check_date_format(timestamp, date_format="%Y-%m-%d %H:%M:%S"):
    try:
        datetime.strptime(timestamp, date_format)
        return True
    except ValueError:
        return False

  # מסירה כפילויות בעמודת תאריך ושומרת שורה אחת עבור כל timestamp
def remove_duplicates(csv_file, date_column="timestamp"):
    # קריאה לקובץ ה-CSV
    df = pd.read_csv(csv_file)

    # הסרת כפילויות בעמודת timestamp ושמירה על שורה אחת בלבד עבור כל timestamp
    df_unique = df.drop_duplicates(subset=[date_column], keep='first')  # 'first' שומר את השורה הראשונה ומסיר את השאר

    # שמירה לקובץ CSV חדש עם הנתונים ללא כפילויות
    df_unique.to_csv(csv_file, index=False)
    print(f"Duplicate rows based on timestamp have been removed. The cleaned file has been saved to {csv_file}.")

 # ממלא ערכים חסרים בעמודת value עם הערך הממוצע
def fill_missing_with_median(csv_file, value_column="value"):
    # קריאת קובץ ה-CSV
    df = pd.read_csv(csv_file)

    df[value_column] = pd.to_numeric(df[value_column], errors='coerce')
    df[value_column] = df[value_column].replace("", float('nan'))
    median_value = df[value_column].median()
    df[value_column] = df[value_column].fillna(median_value)

    print(f"Missing values in '{value_column}' column have been filled with the median value: {median_value}")
    df.to_csv(csv_file, index=False)

 # מפעילה סדרת בדיקות על הקובץ (פורמט תאריך, הסרת כפילויות, מילוי ערכים חסרים)
def validate(csv_file):
    check_date_column_format(csv_file, "timestamp")
    remove_duplicates(csv_file)
    fill_missing_with_median(csv_file)

# מחלק את קובץ ה-CSV לקבצים יומיים, מחושב ממוצע שעתי לכל יום
def split_csv_by_day(csv_file, date_column="timestamp", value_column="value"):
    df = pd.read_csv(csv_file)
    df[date_column] = pd.to_datetime(df[date_column])

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for date, group in df.groupby(df[date_column].dt.date):  # קיבוץ לפי תאריך בלבד
        group["timestamp"] = group[date_column].dt.strftime("%Y-%m-%d %H:00:00")  # עיגול לשעה
        hourly_avg = group.groupby("timestamp")[value_column].mean().reset_index()  # חישוב ממוצע שעתי
        hourly_avg[value_column] = hourly_avg[value_column].round(1)  # עיגול למקום עשרוני אחד

        output_path = os.path.join(output_dir, f"data_{date}.csv")
        hourly_avg.to_csv(output_path, index=False)  # שמירה לקובץ

# מחשבת ממוצע שעתי עבור כל קובץ CSV בתיקייה
def calculate_hourly_average(input_dir, date_column="timestamp", value_column="value", output_file=None,print_results=True):
    all_data = []

    for file in os.listdir(input_dir):
        if file.endswith(".csv"):
            file_path = os.path.join(input_dir, file)
            df = pd.read_csv(file_path)
            df[date_column] = pd.to_datetime(df[date_column])
            df["timestamp"] = df[date_column].dt.strftime("%Y-%m-%d %H:00:00")
            hourly_avg = df.groupby("timestamp")[value_column].mean().reset_index()
            all_data.append(hourly_avg)

    final_df = pd.concat(all_data, ignore_index=True)
    final_df.index += 1
    final_df[value_column] = final_df[value_column].round(1)
    if print_results:
        print(final_df.to_string(index=True))
    else:
        if output_file:
            final_df.to_csv(output_file, index=False)
            print(f"Results have been saved to {output_file}")

# ממזגת נתונים מקובץ Parquet עם קובץ CSV, יוצרת ממוצע משולב ומייצאת לקובץ

def merge_parquet_csv(parquet_file, csv_file, output_file):

    df_parquet = pd.read_parquet(parquet_file, columns=['timestamp', 'mean_value'])
    df_parquet['timestamp'] = pd.to_datetime(df_parquet['timestamp'])

    df_csv = pd.read_csv(csv_file)
    df_csv['timestamp'] = pd.to_datetime(df_csv['timestamp'])

    df_merged = pd.merge(df_csv, df_parquet, on='timestamp', how='left')  # left join לפי CSV
    df_merged['mean_value'] = df_merged['mean_value'].fillna(0)

    df_merged['combined_average'] = ((df_merged['mean_value'] + df_merged['value']) / 2)

    df_merged[['timestamp', 'combined_average']].to_csv(output_file, index=False)
    print(f"Results have been saved to {output_file}")

def main(csv_file):
     convert_excel_to_csv(excel_file, csv_file)
     print(f"Excel file has been converted to CSV and saved as {csv_file}")
     validate(csv_file)
     calculate_hourly_average(output_dir, output_file=final_output, print_results=False)
     split_csv_by_day(csv_file)
     merge_parquet_csv(parquet_file, final_output, finalMerge_file)

main(csv_file)


