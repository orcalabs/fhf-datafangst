"""
    Creates a dataset of averaged monthly wind data using the finer granularity daily wind data value files found in a set repository.
"""

from os import listdir
from os.path import isfile, join
import math
from scipy.constants import convert_temperature

REPOSITORY_FILEPATH = "D:\\data\\FTP\\Data\\Wind\\processed_data\\downscaled_csv\\"
OUTPUT_REPOSITORY_FILEPATH = "D:\\data\\FTP\\Data\\Wind\\processed_data\\monthly_averages\\"
WIND_CSV_HEADER = "datetime,latitude,longitude,wind_direction_10m,wind_speed_10m"
TEMPERATURE_AND_CSV_HEADER = "datetime,latitude,longitude,temperature,air_pressure"
BASE_DATA_FILE_NAME = "met_analysis_1_0km_nordic_"
WIND_SPEED_THRESHOLD = 100
TEMPERATURE_THRESHOLD = convert_temperature(50, 'Celsius', 'Kelvin')
AIR_PRESSURE_THRESHOLD = 150000


def remove_postfix(text, postfix):
    if text.endswith(postfix):
        return text[:-len(postfix)]
    return text


def get_year_and_month_from_filename(filename):
    """
        Assumes filename are of the form
            met_analysis_1_0km_nordic_{full_year}{full_month}{full_day}T{full_hour}Z_downscaled.csv
    """
    postfix_length = 5
    year_and_month = remove_postfix(filename, "Z_downscaled.csv")[len(BASE_DATA_FILE_NAME):-postfix_length]

    return year_and_month


def merge_file_values(files):
    # TODO: average collected files and write to disk
    values = {}
    sector_degree_size = 22.5

    for file in files:
        with open("{root_path}{file_name}".format(root_path=REPOSITORY_FILEPATH, file_name=file), "r") as data_file:
            header = data_file.readline().strip().split(",")

            if "datetime" in header:
                header.remove("datetime")

            wind_speed_index = header.index("wind_speed_10m")
            wind_direction_index = header.index("wind_direction_10m")
            latitude_index = header.index("latitude")
            longitude_index = header.index("longitude")
            temperature_index = header.index("air_temperature")
            air_pressure_index = header.index("air_pressure")
            temperature_and_pressure_key = "temperature_and_pressure"

            for line in data_file:
                line_array = line.strip().split(",")

                key = line_array[latitude_index] + "," + line_array[longitude_index]
                wind_direction = float(line_array[wind_direction_index])
                wind_speed = float(line_array[wind_speed_index]) if float(line_array[wind_speed_index]) < WIND_SPEED_THRESHOLD else 0
                temperature = float(line_array[temperature_index]) if float(line_array[temperature_index]) < TEMPERATURE_THRESHOLD else 0
                air_pressure = float(line_array[air_pressure_index]) if float(line_array[air_pressure_index]) < AIR_PRESSURE_THRESHOLD else 0

                if key not in values.keys():
                    sector_key = math.floor(wind_direction / sector_degree_size)
                    values[key] = {sector_key: (wind_direction, wind_speed, 1), temperature_and_pressure_key: (temperature, air_pressure, 1)}
                else:
                    value = values.get(key)
                    sector_key = math.floor(wind_direction / sector_degree_size)
                    sector = value[sector_key] if sector_key in value.keys() else None
                    sector = (sector[0] + wind_direction, sector[1] + wind_speed, sector[2] + 1) if sector_key in value.keys() else (
                        wind_direction, wind_speed, 1)

                    value[sector_key] = sector
                    value[temperature_and_pressure_key] = (
                        value[temperature_and_pressure_key][0] + temperature, value[temperature_and_pressure_key][1] + temperature,
                        value[temperature_and_pressure_key][2] + 1)
                    values[key] = value

    with open("{root_path}{base_file_name}{year_and_month}_averaged.csv".format(root_path=OUTPUT_REPOSITORY_FILEPATH, base_file_name=BASE_DATA_FILE_NAME,
                                                                                year_and_month=get_year_and_month_from_filename(files[0])), "w") as wind_output:
        with open("{root_path}{base_file_name}{year_and_month}_temp_and_pressure_averaged.csv".format(root_path=OUTPUT_REPOSITORY_FILEPATH,
                                                                                                      base_file_name=BASE_DATA_FILE_NAME,
                                                                                                      year_and_month=get_year_and_month_from_filename(
                                                                                                          files[0])), "w") as temperature_and_pressure_output:
            wind_output.write(WIND_CSV_HEADER)
            temperature_and_pressure_output.write(TEMPERATURE_AND_CSV_HEADER)

            for key, value in values.items():
                temperature_and_pressure_output.write("\n{lat_lon},{temperature},{air_pressure}".format(lat_lon=key,
                                                                                                        temperature=convert_temperature(
                                                                                                            value[temperature_and_pressure_key][0] /
                                                                                                            value[temperature_and_pressure_key][2], 'Kelvin',
                                                                                                            'Celsius'),
                                                                                                        air_pressure=value[temperature_and_pressure_key][1] /
                                                                                                                     value[temperature_and_pressure_key][2]))
                value.pop(temperature_and_pressure_key)

                for sector, wind_values in value.items():
                    if wind_values[1] / wind_values[2] > 100:
                        exit(1)
                    wind_output.write("\n{lat_lon},{wind_direction},{wind_speed}".format(lat_lon=key, wind_direction=wind_values[0] / wind_values[2],
                                                                                         wind_speed=wind_values[1] / wind_values[2]))


class FileParser(object):
    def __init__(self):
        self.files_to_process = [f for f in listdir(REPOSITORY_FILEPATH) if  # Glob ?
                                 (isfile(join(REPOSITORY_FILEPATH, f)) and f.endswith("downscaled.csv"))]

    def generate_monthly_average_csv_files(self):
        if len(self.files_to_process) == 0:
            return

        current_month_files = []
        current_active_month_and_year = get_year_and_month_from_filename(self.files_to_process[0])

        for i in range(0, len(self.files_to_process)):
            current_month = get_year_and_month_from_filename(self.files_to_process[i])
            print(self.files_to_process[i])

            if current_active_month_and_year != current_month:
                merge_file_values(current_month_files)
                print("processed files {file_number_start}-{file_number_end}/{number_of_files}".format(
                    file_number_start=i - len(current_month_files), file_number_end=i, number_of_files=len(self.files_to_process),
                    file_name=self.files_to_process[i]))

                current_active_month_and_year = current_month
                current_month_files = [self.files_to_process[i]]
            else:
                print(self.files_to_process[i])
                current_month_files.append(self.files_to_process[i])
                continue

        if len(current_month_files) > 0:
            merge_file_values(current_month_files)


if __name__ == '__main__':
    reducer = FileParser()
    reducer.generate_monthly_average_csv_files()