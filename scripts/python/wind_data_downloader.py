import sys
import hashlib
import os
from datetime import datetime
import json
from os.path import isfile
import pandas as pd
import requests
import threddsclient
import xarray
from sqlalchemy import create_engine

from data_configuration import CONFIG_FILE_NAME, CHUNK_SIZE
from netcdf_to_csv_downscaler import NetCDFReducer

CONNECTION_STRING = 'postgresql://{username}:{password}@{host}:{port}/{database}'
TABLE_NAME = 'wind_data_met'
TMP_NETCDF_FILE_NAME = "tmp.nc"
DATA_SOURCE_NEW = "operational"
DATA_SOURCE_OLD = "archive"
HISTORICAL_ARCHIVE_URL = "https://thredds.met.no/thredds/catalog/metpparchivev1/catalog.xml"
OPERATIONAL_ARCHIVE_URL = "https://thredds.met.no/thredds/catalog/metpparchive/catalog.xml"


def tick():
    print('Tick! The time is: %s' % datetime.now())


def md5(fname):
    hash_md5 = hashlib.md5()
    with open(fname, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()


def calculate_distance_to_number(distance_to, num):
    if num > distance_to:
        return num - distance_to
    return distance_to - num


def read_added_files():
    with open("added_files", "r") as infile:
        files = []

        for line in infile:
            if line:
                files.append(line.strip())

        return files


# TODO: HASH FILE NAME, STORE IT, DO SOME DIFF/CHECKSUM THINGY: TODO: FIXME: !IMPORTANT!: Create datetime alla the historical and add it to added_files
def download_netcdf_file_from_met(data_source=DATA_SOURCE_NEW):
    archive_url = None

    if data_source == DATA_SOURCE_NEW:
        print("Traversing operational archive")
        archive_url = OPERATIONAL_ARCHIVE_URL
    elif data_source == DATA_SOURCE_OLD:
        print("Traversing historical archive")
        archive_url = HISTORICAL_ARCHIVE_URL
    else:
        raise ValueError("Invalid data source provided")

    data_catalog = threddsclient.read_url(archive_url)
    # Newest YEAR = operational_data_catalog.flat_references()[0], FRA nyeste år er .flat_references()[0] NYESTE MÅNED
    newest_catalog_ref = \
        data_catalog.flat_references()[0].follow().flat_references()[0].follow().flat_references()[0] if data_source == DATA_SOURCE_NEW else \
        data_catalog.flat_references()[1].follow().flat_references()[0].follow().flat_references()[0]
    download_directory_data = threddsclient.read_url(newest_catalog_ref.url)
    datasets = download_directory_data.datasets[0].datasets
    configuration_file = json.load(open(CONFIG_FILE_NAME)) if isfile(CONFIG_FILE_NAME) else None
    repository_root_path = configuration_file["windData"]["windDataRepositoryDirectory"]
    variables_to_keep = configuration_file["windData"]["windDataVariablesToKeep"]
    existing_files = read_added_files()
    tmp_file_path = "{root_path}{filename}".format(root_path=repository_root_path, filename=TMP_NETCDF_FILE_NAME)

    for year_idx, year in enumerate(data_catalog.flat_references()):
        if year.name == "raw_grid":
            continue
        for month_idx, month in enumerate(data_catalog.flat_references()[year_idx].follow().flat_references()):
            for day_idx, day in enumerate(data_catalog.flat_references()[year_idx].follow().flat_references()[
                                              month_idx].follow().flat_references()):
                date_time = year.name + "-" + month.name + "-" + day.name
                if date_time in existing_files:
                    continue
                datasets = \
                    data_catalog.flat_references()[year_idx].follow().flat_references()[
                        month_idx].follow().flat_references()[
                        day_idx].follow().flat_datasets()
                if datasets:
                    file_index = 0  # Which file to download for that given day
                    distance_in_hours_from_12 = 9999
                    for idx, file in enumerate(datasets):  # List of all files for that given day
                        if "forecast" in file.name or "latest" in file.name:
                            continue

                        timestamp = file.name[file.name.rindex("_") + 1:].replace(".nc", "")
                        # Get hours from timestamp
                        hours = timestamp[9:11]
                        current_distance = calculate_distance_to_number(12, int(hours))
                        if current_distance == 0:
                            file_index = idx
                            break
                        if current_distance < distance_in_hours_from_12:
                            distance_in_hours_from_12 = current_distance
                            file_index = idx

                    # Download!
                    download_url = datasets[file_index].download_url()

                    req = requests.get(download_url)
                    if req.status_code == 200:
                        # Store file
                        print("--\nWriting tmp file to disk with location: {root_path}{file_name}".format(root_path=repository_root_path,
                                                                                                          file_name=TMP_NETCDF_FILE_NAME))
                        with open(tmp_file_path, "wb") as outfile:
                            outfile.write(req.content)
                        file_name = "{file_name}_reduced.nc".format(file_name=datasets[file_index].name[:-3])

                        drop_attributes_and_write_to_disk(data_file_path=tmp_file_path,
                                                          result_file_path="{root_path}{filename}".format(root_path=repository_root_path,
                                                                                                          filename=file_name),
                                                          columns_to_keep=variables_to_keep)

                with open("added_files", "a+") as myfile:
                    myfile.write(date_time + "\n")
                existing_files.append(date_time)

    if os.path.exists("{root_path}{file_name}".format(root_path=repository_root_path, file_name=TMP_NETCDF_FILE_NAME)):
        os.remove("{root_path}{file_name}".format(root_path=repository_root_path, file_name=TMP_NETCDF_FILE_NAME))


def drop_attributes_and_write_to_disk(data_file_path, result_file_path, columns_to_keep):
    ds = xarray.open_dataset(data_file_path)
    columns = ds.variables.keys()
    drop_columns = set()

    for attribute in columns:
        if attribute not in columns_to_keep:
            drop_columns.add(attribute)

    ds = ds.drop_vars(names=drop_columns)
    ds.to_netcdf(path=result_file_path, mode="w", format='NETCDF4')
    print("Columns dropped and updated file written to disk: {file_path}".format(file_path=result_file_path))
    ds.close()


def convert_relevant_netcdf_fields(filename, is_newest=False, is_csv=True):
    ds = xarray.open_dataset(filename)
    if is_newest:
        drop_columns = ["air_pressure_at_sea_level", "air_temperature_2m", "altitude", "cloud_area_fraction",
                        "ensemble_member",
                        "forecast_reference_time", "integral_of_surface_downwelling_shortwave_flux_in_air_wrt_time",
                        "land_area_fraction", "precipitation_amount", "relative_humidity_2m", "projection_lcc"]
    else:
        drop_columns = ["air_pressure_at_sea_level", "air_temperature_2m", "altitude", "cloud_area_fraction",
                        "forecast_reference_time", "integral_of_surface_downwelling_shortwave_flux_in_air_wrt_time",
                        "land_area_fraction", "precipitation_amount", "relative_humidity_2m", "projection_lcc", "x",
                        "y"]
    print("Attempting to drop columns")
    ds = ds.drop(labels=drop_columns)
    df = ds.to_dataframe()
    for col in df.columns:
        print(col)
    ds = None  # Free memory insta
    # Add datetime
    print("date")
    df["date"] = pd.Timestamp(datetime.today().strftime('%Y-%m-%d'))
    print("Lat")
    df["latitude"] = df.round({"latitude": 2})
    print("Lon")
    df["longitude"] = df.round({"longitude": 2})

    print("Writing file: {file} to database".format(file="Nordic model"))
    if is_csv:
        df.to_csv("/data/" + filename)
    else:
        try:
            engine = create_engine(CONNECTION_STRING)
            df.to_sql(TABLE_NAME, engine, if_exists="append", chunksize=CHUNK_SIZE)
        except Exception as e:
            print("Failed to add data from file: {file}".format(file="Nordic model"))
            raise e


if __name__ == '__main__':
    data_source = DATA_SOURCE_NEW if len(sys.argv) < 2 else sys.argv[1]
    reducer = NetCDFReducer()

    download_netcdf_file_from_met(data_source)