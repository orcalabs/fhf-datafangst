import numpy as np
import json
from os import listdir, path
from os.path import isfile, join
import xarray
import math

from data_configuration import CONFIG_FILE_NAME

CONFIG_PROPERTY_DOWNSCALED = "downscaled_files"
CSV_HEADER = "datetime,latitude,longitude,wind_direction_10m,wind_speed_10m,air_pressure,air_temperature"
PROCESSED_FILES_REGISTRY_FILE_PATH = "processed_files.json"


def remove_postfix(text, postfix):
    if text.endswith(postfix):
        return text[:-len(postfix)]
    return text


def get_coordinates_catch_area_mapping(filename):
    catch_area_mappings = {}

    with open(filename, "r") as catch_area_mappings_file:
        catch_area_mappings_file.readline()

        for line in catch_area_mappings_file:
            line_array = line.strip().split(",")

            catch_area_mappings[int(line_array[2])] = line_array[3]

    return catch_area_mappings


def data_retriever(filename, repository_path, output_repository_path, catch_area_mapping):
    ds = xarray.open_dataset("{root_path}{file_name}".format(root_path=repository_path, file_name=filename))
    df = ds.to_dataframe()

    # Resample resolution
    step = 1  # Degree
    to_bin = lambda x: np.floor(x / step) * step
    df["latbin"] = df.latitude.map(to_bin)
    df["lonbin"] = df.longitude.map(to_bin)
    binned_data = df.groupby(("latbin", "lonbin")).mean()
    csv_data = binned_data.to_csv(index=False).split("\r\n")
    filename = remove_postfix(filename, "_reduced.nc")

    with open("{root_path}{file_name}_downscaled.csv".format(root_path=output_repository_path, file_name=filename), "w") as output:
        output.write(CSV_HEADER)

        header = csv_data[0].split(",")

        latitude_index = header.index("latitude")
        longitude_index = header.index("longitude")

        wind_speed_x_index = header.index("x_wind_10m") if "x_wind_10m" in header else None
        wind_speed_y_index = header.index("y_wind_10m") if "y_wind_10m" in header else None
        wind_speed_index = header.index("wind_speed_10m") if "wind_speed_10m" in header else None
        wind_direction_index = header.index("wind_direction_10m") if "wind_direction_10m" in header else None
        air_pressure_index = header.index("air_pressure_at_sea_level")
        air_temperature_index = header.index("air_temperature_2m")
        catch_area_mapping_key = 0

        for line in csv_data[1:-1]:  # skip header and empty last line.
            line_array = line.strip().split(",")

            # Skip line where coordinates are on land
            if catch_area_mapping_key not in catch_area_mapping.keys():
                catch_area_mapping_key += 1
                continue

            wind_direction = angle_between_vector((1, 0), (
                float(line_array[wind_speed_x_index]), float(line_array[wind_speed_y_index]))) + 180.0 if wind_speed_x_index and wind_speed_y_index else \
                line_array[wind_direction_index]
            wind_speed = math.sqrt(math.pow(float(line_array[wind_speed_x_index]), 2) + math.pow(float(line_array[wind_speed_y_index]),
                                                                                                 2)) if wind_speed_x_index and wind_speed_y_index else \
                line_array[wind_speed_index]

            output.write("\n{lat},{lon},{wind_direction},{wind_speed},{air_pressure},{air_temperature}".format(lat=line_array[latitude_index],
                                                                                                               lon=line_array[longitude_index],
                                                                                                               wind_direction=wind_direction,
                                                                                                               wind_speed=wind_speed,
                                                                                                               air_pressure=line_array[air_pressure_index],
                                                                                                               air_temperature=line_array[
                                                                                                                   air_temperature_index]))
            catch_area_mapping_key += 1


def angle_between_vector(vector1, vector2):
    sin = vector1[0] * vector2[1] - vector2[0] * vector1[1]
    cos = vector1[0] * vector2[0] + vector1[1] * vector2[1]

    return math.atan2(sin, cos) * (180 / math.pi)


class NetCDFReducer(object):
    def __init__(self):
        self.configuration_file_path = CONFIG_FILE_NAME
        with open(self.configuration_file_path) as default_config:
            self.configuration_file = json.load(default_config)
        self.processed_files = json.load(open(PROCESSED_FILES_REGISTRY_FILE_PATH, 'r')) if isfile(PROCESSED_FILES_REGISTRY_FILE_PATH) else {
            "reduced_files": []}
        self.repository_directory = self.configuration_file["windData"]["windDataRepositoryDirectory"]

        all_files = [f for f in listdir(self.repository_directory) if  # Glob ?
                     (isfile(join(self.repository_directory, f)) and f.endswith("reduced.nc"))]
        self.files_to_process = []

        for file in all_files:
            if "{root_path}{file_name}".format(root_path=self.configuration_file["windData"]["windDataRepositoryDirectory"], file_name=file) not in \
                    self.processed_files[CONFIG_PROPERTY_DOWNSCALED]:
                self.files_to_process.append(file)

    def generate_downscaled_csv_files(self, order_ascending=True):
        if not order_ascending:
            self.files_to_process.reverse()

        catch_area_mappings = get_coordinates_catch_area_mapping(self.configuration_file["windData"]["catchAreaMappingFileName"])

        for i in range(0, len(self.files_to_process)):
            print(self.files_to_process[i])
            self.downscale_data_and_write_to_csv(self.files_to_process[i], self.repository_directory, catch_area_mappings)
            print("processed file {file_number}/{number_of_files}: {file_name}".format(
                file_number=i, number_of_files=len(self.files_to_process), file_name=self.files_to_process[i]))

    def update_processed_files_registry_on_disk(self):
        with open(PROCESSED_FILES_REGISTRY_FILE_PATH, "w") as registry_file:
            json.dump(self.processed_files, registry_file)

    def downscale_data_and_write_to_csv(self, filename, repository_path, catch_area_mapping):
        data_retriever(filename, repository_path, self.configuration_file["windData"]["windDataDownscaledRepositoryPath"], catch_area_mapping)

        self.processed_files[CONFIG_PROPERTY_DOWNSCALED].append(
            "{root_path}{file_name}".format(root_path=self.configuration_file["windData"]["windDataRepositoryDirectory"], file_name=filename))
        self.update_processed_files_registry_on_disk()


if __name__ == '__main__':
    reducer = NetCDFReducer()
    reducer.generate_downscaled_csv_files()