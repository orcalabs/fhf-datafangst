/*
    *************
        Stored procedure for generating data for the monthly aggregated catch data table.
        Adds data to the aggregated data staging table, which populates data to the actual table through a insert trigger. This is done
        so that we don't have to delete data in the table used in the application, we only update data and insert new values. Data in the
        staging table is deleted after data is propagated to production table.

        Contains commented code at the end for generating aggregate table if it does not exist.
    *************
*/
CREATE OR REPLACE PROCEDURE USP_TRUNCATE_CATCH_DATA_STAGING_TABLE()
    LANGUAGE plpgsql
AS
$$
BEGIN
    TRUNCATE TABLE public.raw_catch_data_staging_table;
END;
$$;
