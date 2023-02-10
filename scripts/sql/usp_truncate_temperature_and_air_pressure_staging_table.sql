/*
    *************
        Stored procedure for truncating temperature and air pressure staging table.
    *************
*/
CREATE OR REPLACE PROCEDURE usp_truncate_temperature_and_air_pressure_staging_table()
    LANGUAGE plpgsql
AS
$$
BEGIN
    TRUNCATE TABLE public.monthly_averaged_temperature_and_air_pressure_staging_table;
END;
$$;
