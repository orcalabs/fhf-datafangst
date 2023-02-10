/*
    *************
        Creates triggers that adds new and updated records from the raw catch data staging table (raw_catch_data_staging_table) to
        the full raw catch data table (raw_catch_data) and the reduced column count catch table (reduced_catch_data) after insert, before clearing the staging table.
    *************
*/
CREATE OR REPLACE FUNCTION upsert_monthly_aggregated_catch_records_from_staging_table()
    RETURNS TRIGGER AS
$BODY$
BEGIN
    /*
    *************
        Insert new records.
    *************
    */
    INSERT INTO fangstanalyse.public.monthly_aggregated_grouped_catch_data(rundvekt,
                                                                           fangstfelt,
                                                                           art,
                                                                           dato,
                                                                           lengdekode,
                                                                           kvalitetkode,
                                                                           redskap,
                                                                           year,
                                                                           month)
    VALUES (new.rundvekt,
            new.fangstfelt,
            new.art,
            new.dato,
            new.lengdekode,
            new.kvalitetkode,
            new.redskap,
            DATE_PART('YEAR', new.dato),
            DATE_PART('MONTH', new.dato))
    ON CONFLICT (dato, fangstfelt, art, redskap, kvalitetkode, lengdekode)
        DO UPDATE
        SET rundvekt     = excluded.rundvekt,
            fangstfelt   = excluded.fangstfelt,
            art          = excluded.art,
            dato         = excluded.dato,
            lengdekode   = excluded.lengdekode,
            kvalitetkode = excluded.kvalitetkode,
            redskap      = excluded.redskap,
            year         = excluded.year,
            month        = excluded.month;

    RETURN NEW;
END;
$BODY$
    language plpgsql;


--  Prevents reduntant updates on raw data table
DROP TRIGGER IF EXISTS suppress_redundant_raw_updates ON fangstanalyse.public.monthly_aggregated_grouped_catch_data;
CREATE TRIGGER suppress_redundant_raw_updates
    BEFORE UPDATE
    ON
        fangstanalyse.public.monthly_aggregated_grouped_catch_data
    FOR EACH ROW
EXECUTE FUNCTION suppress_redundant_updates_trigger();

-- Updates record if it already exists and there is newer data in the inserted record.
DROP TRIGGER IF EXISTS monthly_aggregated_catch_data_staging_table_upsert_trigger ON fangstanalyse.public.monthly_aggregated_grouped_catch_data_staging_table;
CREATE TRIGGER monthly_aggregated_catch_data_staging_table_upsert_trigger
    AFTER INSERT
    ON
        fangstanalyse.public.monthly_aggregated_grouped_catch_data_staging_table
    FOR EACH ROW
EXECUTE PROCEDURE upsert_monthly_aggregated_catch_records_from_staging_table();