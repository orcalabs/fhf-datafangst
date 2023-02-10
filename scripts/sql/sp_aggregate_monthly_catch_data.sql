/*
    *************
        Stored procedure for generating data for the monthly aggregated catch data table.
        Adds data to the aggregated data staging table, which populates data to the actual table through a insert trigger. This is done
        so that we don't have to delete data in the table used in the application, we only update data and insert new values. Data in the
        staging table is deleted after data is propagated to production table.
    *************
*/
CREATE OR REPLACE PROCEDURE aggregate_monthly_catch_data()
    LANGUAGE plpgsql
AS
$$
BEGIN
    INSERT INTO fangstanalyse.public.monthly_aggregated_grouped_catch_data_staging_table(rundvekt,
                                                                                         fangstfelt,
                                                                                         art,
                                                                                         dato,
                                                                                         lengdekode,
                                                                                         kvalitetkode,
                                                                                         redskap)
    select source.rundvekt,
           source.fangstfelt,
           source.art_kode,
           source.date,
           source.lengdekode,
           source.kvalitetkode,
           source.redskap_kode
    from (
             select CAST(sum(rundvekt) AS INT)             AS rundvekt,
                    fangstfelt,
                    CAST(art_kode AS TEXT),
                    date_trunc('MONTH', timestamp_landing) AS date,
                    CAST(kvalitetkode AS INT),
                    CAST(redskap_kode AS INT),
                    CAST(lengdekode AS INT)
             from reduced_catch_data
             WHERE rundvekt IS NOT NULL
               AND rundvekt > 0
               AND timestamp_landing IS NOT NULL
               -- Only the data for the last 3 years are updated, so we ignore older data.
               AND date_part('YEAR', timestamp_landing) > date_part('YEAR', CURRENT_DATE) - 3
             group by date_trunc('MONTH', timestamp_landing), fangstfelt, art_kode, kvalitetkode, lengdekode, redskap_kode
         ) as source;

    TRUNCATE TABLE public.monthly_aggregated_grouped_catch_data_staging_table;
END;
$$;