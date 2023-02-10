/*
    *************

    *************
*/

CREATE OR REPLACE FUNCTION add_new_data_to_weather_data_table()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
BEGIN
    INSERT INTO public.monthly_averaged_temperature_and_air_pressure AS target(datetime, catch_area_id, temperature, air_pressure)
    VALUES (new.datetime,
            new.catch_area_id,
            new.temperature,
            new.air_pressure)
    ON CONFLICT (datetime, catch_area_id)
        DO UPDATE
        SET datetime      = excluded.datetime,
            catch_area_id = excluded.catch_area_id,
            temperature   = excluded.temperature,
            air_pressure  = excluded.air_pressure;

    RETURN NEW;
END;
$$;


/*
*************
    Create the triggers.
*************
*/

--  Prevents reduntant updates on raw data table and staging table
DROP TRIGGER IF EXISTS suppress_redundant_raw_updates ON fangstanalyse.public.monthly_averaged_temperature_and_air_pressure;
CREATE TRIGGER suppress_redundant_raw_updates
    BEFORE UPDATE
    ON
        fangstanalyse.public.monthly_averaged_temperature_and_air_pressure
    FOR EACH ROW
EXECUTE FUNCTION suppress_redundant_updates_trigger();

-- Updates record if it already exists and there is newer data in the inserted record.
DROP TRIGGER IF EXISTS weather_data_staging_upsert_trigger ON fangstanalyse.public.monthly_averaged_temperature_and_air_pressure_staging_table;
CREATE TRIGGER weather_data_staging_upsert_trigger
    AFTER INSERT
    ON
        fangstanalyse.public.monthly_averaged_temperature_and_air_pressure_staging_table
    FOR EACH ROW
EXECUTE PROCEDURE add_new_data_to_weather_data_table();
