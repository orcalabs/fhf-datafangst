/*
    *************

    *************
*/
CREATE OR REPLACE PROCEDURE usp_update_monthly_catch_table_with_weather_values()
    LANGUAGE plpgsql
AS
$$
BEGIN
    UPDATE monthly_aggregated_grouped_catch_data AS A
    SET temperatur = coalesce(B.temperature, 0),
        lufttrykk  = coalesce(B.air_pressure, 101325.0)
    FROM monthly_averaged_temperature_and_air_pressure AS B
    WHERE A.fangstfelt = B.catch_area_id
      AND A.dato = B.datetime;

    UPDATE monthly_aggregated_grouped_catch_data
    SET temperatur = 0,
        lufttrykk  = 101325.0
    WHERE temperatur IS NULL
      AND lufttrykk IS NULL;
END;
$$;