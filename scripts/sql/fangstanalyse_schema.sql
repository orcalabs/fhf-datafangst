create schema public;

comment on schema public is 'standard public schema';

alter schema public owner to postgres;

create table if not exists optimized_catch_data
(
	index bigint not null
		constraint optimized_catch_data_pkey
			primary key,
	rundvekt integer,
	fangstfelt text,
	art text,
	dato timestamp,
	lengdekode bigint,
	kvalitet_kode bigint,
	redskap bigint
);

alter table optimized_catch_data owner to postgres;

create table if not exists reduced_catch_data
(
	rundvekt double precision,
	fangstfelt text,
	art_kode integer,
	epoch_landing double precision,
	lengdekode integer,
	kvalitetkode integer,
	redskap_kode integer,
	dokument_versjonsnummer integer,
	dokument_versjonstidspunkt text,
	dokumentnummer bigint,
	linjenummer bigint,
	fartoy_navn text,
	fartoy_kommune text,
	art text,
	kvalitet text,
	redskap text,
	lengdegruppe text,
	timestamp_landing timestamp,
	pk_reduced_catch_data serial not null
		constraint reduced_catch_data_pk
			primary key,
	year integer,
	month integer,
	year_and_month text,
	constraint reduced_dokumentnummer_linjenummer_unique_constraint
		unique (dokumentnummer, linjenummer)
);

alter table reduced_catch_data owner to postgres;

create unique index if not exists reduced_catch_data_pk_reduced_catch_data_uindex
	on reduced_catch_data (pk_reduced_catch_data);

create index if not exists reduced_catch_data_detailed_query_index
	on reduced_catch_data (year_and_month, fangstfelt, art_kode, lengdekode, kvalitetkode, redskap_kode);

create table if not exists raw_catch_data
(
	index bigint,
	dokumentnummer bigint,
	dokumenttype_kode bigint,
	dokumenttype text,
	dokument_versjonsnummer bigint,
	dokument_salgsdato text,
	dokument_versjonstidspunkt text,
	salgslag_id bigint,
	salgslag_kode bigint,
	salgslag text,
	mottaker_id double precision,
	mottakernasjonalitet_kode text,
	mottakernasjonalitet text,
	mottaksstasjon text,
	landingskommune_kode double precision,
	landingskommune text,
	landingsfylke_kode double precision,
	landingsfylke text,
	landingsnasjon_kode text,
	landingsnasjon text,
	produksjonsanlegg text,
	produksjonskommune_kode double precision,
	produksjonskommune text,
	"mottakende_fartøy_reg.merke" text,
	mottakende_fartøy_rkal text,
	mottakende_fartøytype_kode double precision,
	"mottakende_fart.type" text,
	"mottakende_fartøynasj._kode" text,
	"mottakende_fart.nasj" text,
	fisker_id double precision,
	fiskerkommune_kode double precision,
	fiskerkommune text,
	fiskernasjonalitet_kode text,
	fiskernasjonalitet text,
	fartøy_id double precision,
	registreringsmerke_seddel text,
	radiokallesignal_seddel text,
	fartøynavn text,
	fartøytype_kode bigint,
	fartøytype text,
	"kvotefartøy_reg.merke" text,
	besetning double precision,
	fartøykommune_kode double precision,
	fartøykommune text,
	fartøyfylke_kode double precision,
	fartøyfylke text,
	fartøynasjonalitet_kode text,
	fartøynasjonalitet text,
	fartøynasjonalitet_gruppe text,
	største_lengde double precision,
	lengdegruppe_kode double precision,
	lengdegruppe text,
	bruttotonnasje_1969 double precision,
	bruttotonnasje_annen double precision,
	byggeår double precision,
	ombyggingsår double precision,
	motorkraft double precision,
	motorbyggeår double precision,
	fangstår bigint,
	siste_fangstdato text,
	kvotetype_kode bigint,
	kvotetype text,
	redskap_kode bigint,
	redskap text,
	redskapgruppe_kode bigint,
	redskapgruppe text,
	redskaphovedgruppe_kode bigint,
	redskaphovedgruppe text,
	fangstfelt_kode bigint,
	"kyst/hav_kode" bigint,
	hovedområde_kode bigint,
	hovedområde text,
	lon_hovedområde double precision,
	lat_hovedområde double precision,
	lokasjon_kode bigint,
	lon_lokasjon double precision,
	lat_lokasjon double precision,
	sone_kode text,
	sone text,
	områdegruppering_kode text,
	områdegruppering text,
	hovedområde_fao_kode bigint,
	hovedområde_fao text,
	"nord/sør_for_62_grader_nord" text,
	fangstdagbok_nummer double precision,
	fangstdagbok_turnummer double precision,
	landingsdato text,
	landingsklokkeslett text,
	landingsmåned_kode bigint,
	landingsmåned text,
	landingstidspunkt text,
	dellanding_signal bigint,
	neste_mottaksstasjon text,
	forrige_mottakstasjon text,
	linjenummer bigint,
	artfdir_kode bigint,
	artfdir text,
	art_kode bigint,
	art text,
	artgruppe_kode bigint,
	artgruppe text,
	arthovedgruppe_kode bigint,
	arthovedgruppe text,
	art_fao_kode text,
	art_fao text,
	produkttilstand_kode bigint,
	produkttilstand text,
	konserveringsmåte_kode bigint,
	konserveringsmåte text,
	landingsmåte_kode bigint,
	landingsmåte text,
	kvalitet_kode bigint,
	kvalitet text,
	størrelsesgruppering_kode bigint,
	anvendelse_kode double precision,
	anvendelse text,
	anvendelse_hovedgruppe_kode double precision,
	anvendelse_hovedgruppe text,
	antall_stykk double precision,
	bruttovekt double precision,
	produktvekt double precision,
	produktvekt_over_kvote double precision,
	rundvekt_over_kvote double precision,
	rundvekt double precision,
	enhetspris_for_kjøper double precision,
	beløp_for_kjøper double precision,
	enhetspris_for_fisker double precision,
	beløp_for_fisker double precision,
	støttebeløp double precision,
	lagsavgift double precision,
	inndradd_fangstverdi double precision,
	etterbetaling double precision,
	fangstverdi double precision,
	oppdateringstidspunkt text,
	lok text,
	pk_raw_catch_data bigserial not null
		constraint raw_catch_data_pk
			primary key,
	constraint dokumentnummer_linjenummer_unique_constraint
		unique (dokumentnummer, linjenummer)
);

alter table raw_catch_data owner to postgres;

create index if not exists ix_raw_catch_data_index
	on raw_catch_data (index);

create unique index if not exists raw_catch_data_pk_raw_catch_data_uindex
	on raw_catch_data (pk_raw_catch_data);

create trigger suppress_redundant_raw_updates
	before update
	on raw_catch_data
	for each row
	execute procedure suppress_redundant_updates_trigger();

create table if not exists raw_catch_data_staging_table
(
	index bigint,
	dokumentnummer bigint,
	dokumenttype_kode bigint,
	dokumenttype text,
	dokument_versjonsnummer bigint,
	dokument_salgsdato text,
	dokument_versjonstidspunkt text,
	salgslag_id bigint,
	salgslag_kode bigint,
	salgslag text,
	mottaker_id double precision,
	mottakernasjonalitet_kode text,
	mottakernasjonalitet text,
	mottaksstasjon text,
	landingskommune_kode double precision,
	landingskommune text,
	landingsfylke_kode double precision,
	landingsfylke text,
	landingsnasjon_kode text,
	landingsnasjon text,
	produksjonsanlegg text,
	produksjonskommune_kode double precision,
	produksjonskommune text,
	"mottakende_fartøy_reg.merke" text,
	mottakende_fartøy_rkal text,
	mottakende_fartøytype_kode double precision,
	"mottakende_fart.type" text,
	"mottakende_fartøynasj._kode" text,
	"mottakende_fart.nasj" text,
	fisker_id double precision,
	fiskerkommune_kode double precision,
	fiskerkommune text,
	fiskernasjonalitet_kode text,
	fiskernasjonalitet text,
	fartøy_id double precision,
	registreringsmerke_seddel text,
	radiokallesignal_seddel text,
	fartøynavn text,
	fartøytype_kode bigint,
	fartøytype text,
	"kvotefartøy_reg.merke" text,
	besetning double precision,
	fartøykommune_kode double precision,
	fartøykommune text,
	fartøyfylke_kode double precision,
	fartøyfylke text,
	fartøynasjonalitet_kode text,
	fartøynasjonalitet text,
	fartøynasjonalitet_gruppe text,
	største_lengde double precision,
	lengdegruppe_kode double precision,
	lengdegruppe text,
	bruttotonnasje_1969 double precision,
	bruttotonnasje_annen double precision,
	byggeår double precision,
	ombyggingsår double precision,
	motorkraft double precision,
	motorbyggeår double precision,
	fangstår bigint,
	siste_fangstdato text,
	kvotetype_kode bigint,
	kvotetype text,
	redskap_kode bigint,
	redskap text,
	redskapgruppe_kode bigint,
	redskapgruppe text,
	redskaphovedgruppe_kode bigint,
	redskaphovedgruppe text,
	fangstfelt_kode bigint,
	"kyst/hav_kode" bigint,
	hovedområde_kode bigint,
	hovedområde text,
	lon_hovedområde double precision,
	lat_hovedområde double precision,
	lokasjon_kode bigint,
	lon_lokasjon double precision,
	lat_lokasjon double precision,
	sone_kode text,
	sone text,
	områdegruppering_kode text,
	områdegruppering text,
	hovedområde_fao_kode bigint,
	hovedområde_fao text,
	"nord/sør_for_62_grader_nord" text,
	fangstdagbok_nummer double precision,
	fangstdagbok_turnummer double precision,
	landingsdato text,
	landingsklokkeslett text,
	landingsmåned_kode bigint,
	landingsmåned text,
	landingstidspunkt text,
	dellanding_signal bigint,
	neste_mottaksstasjon text,
	forrige_mottakstasjon text,
	linjenummer bigint,
	artfdir_kode bigint,
	artfdir text,
	art_kode bigint,
	art text,
	artgruppe_kode bigint,
	artgruppe text,
	arthovedgruppe_kode bigint,
	arthovedgruppe text,
	art_fao_kode text,
	art_fao text,
	produkttilstand_kode bigint,
	produkttilstand text,
	konserveringsmåte_kode bigint,
	konserveringsmåte text,
	landingsmåte_kode bigint,
	landingsmåte text,
	kvalitet_kode bigint,
	kvalitet text,
	størrelsesgruppering_kode bigint,
	anvendelse_kode double precision,
	anvendelse text,
	anvendelse_hovedgruppe_kode double precision,
	anvendelse_hovedgruppe text,
	antall_stykk double precision,
	bruttovekt double precision,
	produktvekt double precision,
	produktvekt_over_kvote double precision,
	rundvekt_over_kvote double precision,
	rundvekt double precision,
	enhetspris_for_kjøper double precision,
	beløp_for_kjøper double precision,
	enhetspris_for_fisker double precision,
	beløp_for_fisker double precision,
	støttebeløp double precision,
	lagsavgift double precision,
	inndradd_fangstverdi double precision,
	etterbetaling double precision,
	fangstverdi double precision,
	oppdateringstidspunkt text,
	lok text
);

alter table raw_catch_data_staging_table owner to postgres;

create table if not exists monthly_aggregated_grouped_catch_data
(
	rundvekt integer,
	fangstfelt text,
	art text,
	dato timestamp,
	lengdekode integer,
	kvalitetkode integer,
	redskap integer,
	year integer,
	month integer,
	temperatur double precision,
	lufttrykk double precision,
	constraint monthly_aggregated_catch_data_unique_constraint
		unique (dato, fangstfelt, art, redskap, kvalitetkode, lengdekode)
);

alter table monthly_aggregated_grouped_catch_data owner to postgres;

create index if not exists monthly_aggregated_grouped_catch_data_year_month_index
	on monthly_aggregated_grouped_catch_data (year, month);

create trigger suppress_redundant_raw_updates
	before update
	on monthly_aggregated_grouped_catch_data
	for each row
	execute procedure suppress_redundant_updates_trigger();

create table if not exists monthly_aggregated_grouped_catch_data_staging_table
(
	rundvekt integer,
	fangstfelt text,
	art text,
	dato timestamp,
	lengdekode integer,
	kvalitetkode integer,
	redskap integer
);

alter table monthly_aggregated_grouped_catch_data_staging_table owner to postgres;

create table if not exists monthly_averaged_temperature_and_air_pressure_staging_table
(
	datetime timestamp,
	catch_area_id text,
	temperature double precision,
	air_pressure double precision
);

alter table monthly_averaged_temperature_and_air_pressure_staging_table owner to postgres;

create table if not exists monthly_averaged_temperature_and_air_pressure
(
	pk serial not null
		constraint monthly_averaged_temperature_and_air_pressure_by_catch_area_pk
			primary key,
	datetime timestamp,
	catch_area_id text,
	temperature double precision,
	air_pressure double precision
);

alter table monthly_averaged_temperature_and_air_pressure owner to postgres;

create unique index if not exists monthly_averaged_temperature_and_air_pressure_by_catch_area_pk_
	on monthly_averaged_temperature_and_air_pressure (pk);

create unique index if not exists monthly_averaged_temperature_and_air_pressure_by_catch_area_dat
	on monthly_averaged_temperature_and_air_pressure (datetime, catch_area_id);

create trigger suppress_redundant_raw_updates
	before update
	on monthly_averaged_temperature_and_air_pressure
	for each row
	execute procedure suppress_redundant_updates_trigger();

create table if not exists monthly
(
	sum bigint,
	fangstfelt text,
	art text,
	dato timestamp,
	lengdekode integer,
	kvalitetkode integer,
	redskap integer,
	year integer,
	month integer,
	temperatur double precision,
	lufttrykk double precision
);

alter table monthly owner to postgres;

create or replace function add_new_data_to_raw_catch_data_table() returns trigger
	language plpgsql
as $$
BEGIN
    INSERT INTO public.raw_catch_data AS target(dokumentnummer,
                                                dokumenttype_kode,
                                                dokumenttype,
                                                dokument_versjonsnummer,
                                                dokument_salgsdato,
                                                dokument_versjonstidspunkt,
                                                salgslag_id,
                                                salgslag_kode,
                                                salgslag,
                                                mottaker_id,
                                                mottakernasjonalitet_kode,
                                                mottakernasjonalitet,
                                                mottaksstasjon,
                                                landingskommune_kode,
                                                landingskommune,
                                                landingsfylke_kode,
                                                landingsfylke,
                                                landingsnasjon_kode,
                                                landingsnasjon,
                                                produksjonsanlegg,
                                                produksjonskommune_kode,
                                                produksjonskommune,
                                                "mottakende_fartøy_reg.merke",
                                                mottakende_fartøy_rkal,
                                                mottakende_fartøytype_kode,
                                                "mottakende_fart.type",
                                                "mottakende_fartøynasj._kode",
                                                "mottakende_fart.nasj",
                                                fisker_id,
                                                fiskerkommune_kode,
                                                fiskerkommune,
                                                fiskernasjonalitet_kode,
                                                fiskernasjonalitet,
                                                fartøy_id,
                                                registreringsmerke_seddel,
                                                radiokallesignal_seddel,
                                                fartøynavn,
                                                fartøytype_kode,
                                                fartøytype,
                                                "kvotefartøy_reg.merke",
                                                besetning,
                                                fartøykommune_kode,
                                                fartøykommune,
                                                fartøyfylke_kode,
                                                fartøyfylke,
                                                fartøynasjonalitet_kode,
                                                fartøynasjonalitet,
                                                fartøynasjonalitet_gruppe,
                                                største_lengde,
                                                lengdegruppe_kode,
                                                lengdegruppe,
                                                bruttotonnasje_1969,
                                                bruttotonnasje_annen,
                                                byggeår,
                                                ombyggingsår,
                                                motorkraft,
                                                motorbyggeår,
                                                fangstår,
                                                siste_fangstdato,
                                                kvotetype_kode,
                                                kvotetype,
                                                redskap_kode,
                                                redskap,
                                                redskapgruppe_kode,
                                                redskapgruppe,
                                                redskaphovedgruppe_kode,
                                                redskaphovedgruppe,
                                                fangstfelt_kode,
                                                "kyst/hav_kode",
                                                hovedområde_kode,
                                                hovedområde,
                                                lon_hovedområde,
                                                lat_hovedområde,
                                                lokasjon_kode,
                                                lon_lokasjon,
                                                lat_lokasjon,
                                                sone_kode,
                                                sone,
                                                områdegruppering_kode,
                                                områdegruppering,
                                                hovedområde_fao_kode,
                                                hovedområde_fao,
                                                "nord/sør_for_62_grader_nord",
                                                fangstdagbok_nummer,
                                                fangstdagbok_turnummer,
                                                landingsdato,
                                                landingsklokkeslett,
                                                landingsmåned_kode,
                                                landingsmåned,
                                                landingstidspunkt,
                                                dellanding_signal,
                                                neste_mottaksstasjon,
                                                forrige_mottakstasjon,
                                                linjenummer,
                                                artfdir_kode,
                                                artfdir,
                                                art_kode,
                                                art,
                                                artgruppe_kode,
                                                artgruppe,
                                                arthovedgruppe_kode,
                                                arthovedgruppe,
                                                art_fao_kode,
                                                art_fao,
                                                produkttilstand_kode,
                                                produkttilstand,
                                                konserveringsmåte_kode,
                                                konserveringsmåte,
                                                landingsmåte_kode,
                                                landingsmåte,
                                                kvalitet_kode,
                                                kvalitet,
                                                størrelsesgruppering_kode,
                                                anvendelse_kode,
                                                anvendelse,
                                                anvendelse_hovedgruppe_kode,
                                                anvendelse_hovedgruppe,
                                                antall_stykk,
                                                bruttovekt,
                                                produktvekt,
                                                produktvekt_over_kvote,
                                                rundvekt_over_kvote,
                                                rundvekt,
                                                enhetspris_for_kjøper,
                                                beløp_for_kjøper,
                                                enhetspris_for_fisker,
                                                beløp_for_fisker,
                                                støttebeløp,
                                                lagsavgift,
                                                inndradd_fangstverdi,
                                                etterbetaling,
                                                fangstverdi,
                                                oppdateringstidspunkt,
                                                lok)
    VALUES (NEW.dokumentnummer,
            new.dokumenttype_kode,
            new.dokumenttype,
            new.dokument_versjonsnummer,
            new.dokument_salgsdato,
            new.dokument_versjonstidspunkt,
            new.salgslag_id,
            new.salgslag_kode,
            new.salgslag,
            new.mottaker_id,
            new.mottakernasjonalitet_kode,
            new.mottakernasjonalitet,
            new.mottaksstasjon,
            new.landingskommune_kode,
            new.landingskommune,
            new.landingsfylke_kode,
            new.landingsfylke,
            new.landingsnasjon_kode,
            new.landingsnasjon,
            new.produksjonsanlegg,
            new.produksjonskommune_kode,
            new.produksjonskommune,
            new."mottakende_fartøy_reg.merke",
            new.mottakende_fartøy_rkal,
            new.mottakende_fartøytype_kode,
            new."mottakende_fart.type",
            new."mottakende_fartøynasj._kode",
            new."mottakende_fart.nasj",
            new.fisker_id,
            new.fiskerkommune_kode,
            new.fiskerkommune,
            new.fiskernasjonalitet_kode,
            new.fiskernasjonalitet,
            new.fartøy_id,
            new.registreringsmerke_seddel,
            new.radiokallesignal_seddel,
            new.fartøynavn,
            new.fartøytype_kode,
            new.fartøytype,
            new."kvotefartøy_reg.merke",
            new.besetning,
            new.fartøykommune_kode,
            new.fartøykommune,
            new.fartøyfylke_kode,
            new.fartøyfylke,
            new.fartøynasjonalitet_kode,
            new.fartøynasjonalitet,
            new.fartøynasjonalitet_gruppe,
            new.største_lengde,
            new.lengdegruppe_kode,
            new.lengdegruppe,
            new.bruttotonnasje_1969,
            new.bruttotonnasje_annen,
            new.byggeår,
            new.ombyggingsår,
            new.motorkraft,
            new.motorbyggeår,
            new.fangstår,
            new.siste_fangstdato,
            new.kvotetype_kode,
            new.kvotetype,
            new.redskap_kode,
            new.redskap,
            new.redskapgruppe_kode,
            new.redskapgruppe,
            new.redskaphovedgruppe_kode,
            new.redskaphovedgruppe,
            new.fangstfelt_kode,
            new."kyst/hav_kode",
            new.hovedområde_kode,
            new.hovedområde,
            new.lon_hovedområde,
            new.lat_hovedområde,
            new.lokasjon_kode,
            new.lon_lokasjon,
            new.lat_lokasjon,
            new.sone_kode,
            new.sone,
            new.områdegruppering_kode,
            new.områdegruppering,
            new.hovedområde_fao_kode,
            new.hovedområde_fao,
            new."nord/sør_for_62_grader_nord",
            new.fangstdagbok_nummer,
            new.fangstdagbok_turnummer,
            new.landingsdato,
            new.landingsklokkeslett,
            new.landingsmåned_kode,
            new.landingsmåned,
            new.landingstidspunkt,
            new.dellanding_signal,
            new.neste_mottaksstasjon,
            new.forrige_mottakstasjon,
            new.linjenummer,
            new.artfdir_kode,
            new.artfdir,
            new.art_kode,
            new.art,
            new.artgruppe_kode,
            new.artgruppe,
            new.arthovedgruppe_kode,
            new.arthovedgruppe,
            new.art_fao_kode,
            new.art_fao,
            new.produkttilstand_kode,
            new.produkttilstand,
            new.konserveringsmåte_kode,
            new.konserveringsmåte,
            new.landingsmåte_kode,
            new.landingsmåte,
            new.kvalitet_kode,
            new.kvalitet,
            new.størrelsesgruppering_kode,
            new.anvendelse_kode,
            new.anvendelse,
            new.anvendelse_hovedgruppe_kode,
            new.anvendelse_hovedgruppe,
            new.antall_stykk,
            new.bruttovekt,
            new.produktvekt,
            new.produktvekt_over_kvote,
            new.rundvekt_over_kvote,
            new.rundvekt,
            new.enhetspris_for_kjøper,
            new.beløp_for_kjøper,
            new.enhetspris_for_fisker,
            new.beløp_for_fisker,
            new.støttebeløp,
            new.lagsavgift,
            new.inndradd_fangstverdi,
            new.etterbetaling,
            new.fangstverdi,
            new.oppdateringstidspunkt,
            new.lok)
    ON CONFLICT (dokumentnummer, linjenummer)
        DO UPDATE
        SET dokumentnummer                = excluded.dokumentnummer,
            dokumenttype_kode             = excluded.dokumenttype_kode,
            dokumenttype                  = excluded.dokumenttype,
            dokument_versjonsnummer       = excluded.dokument_versjonsnummer,
            dokument_salgsdato            = excluded.dokument_salgsdato,
            dokument_versjonstidspunkt    = excluded.dokument_versjonstidspunkt,
            salgslag_id                   = excluded.salgslag_id,
            salgslag_kode                 = excluded.salgslag_kode,
            salgslag                      = excluded.salgslag,
            mottaker_id                   = excluded.mottaker_id,
            mottakernasjonalitet_kode     = excluded.mottakernasjonalitet_kode,
            mottakernasjonalitet          = excluded.mottakernasjonalitet,
            mottaksstasjon                = excluded.mottaksstasjon,
            landingskommune_kode          = excluded.landingskommune_kode,
            landingskommune               = excluded.landingskommune,
            landingsfylke_kode            = excluded.landingsfylke_kode,
            landingsfylke                 = excluded.landingsfylke,
            landingsnasjon_kode           = excluded.landingsnasjon_kode,
            landingsnasjon                = excluded.landingsnasjon,
            produksjonsanlegg             = excluded.produksjonsanlegg,
            produksjonskommune_kode       = excluded.produksjonskommune_kode,
            produksjonskommune            = excluded.produksjonskommune,
            "mottakende_fartøy_reg.merke" = excluded."mottakende_fartøy_reg.merke",
            mottakende_fartøy_rkal        = excluded.mottakende_fartøy_rkal,
            mottakende_fartøytype_kode    = excluded.mottakende_fartøytype_kode,
            "mottakende_fart.type"        = excluded."mottakende_fart.type",
            "mottakende_fartøynasj._kode" = excluded."mottakende_fartøynasj._kode",
            "mottakende_fart.nasj"        = excluded."mottakende_fart.nasj",
            fisker_id                     = excluded.fisker_id,
            fiskerkommune_kode            = excluded.fiskerkommune_kode,
            fiskerkommune                 = excluded.fiskerkommune,
            fiskernasjonalitet_kode       = excluded.fiskernasjonalitet_kode,
            fiskernasjonalitet            = excluded.fiskernasjonalitet,
            fartøy_id                     = excluded.fartøy_id,
            registreringsmerke_seddel     = excluded.registreringsmerke_seddel,
            radiokallesignal_seddel       = excluded.radiokallesignal_seddel,
            fartøynavn                    = excluded.fartøynavn,
            fartøytype_kode               = excluded.fartøytype_kode,
            fartøytype                    = excluded.fartøytype,
            "kvotefartøy_reg.merke"       = excluded."kvotefartøy_reg.merke",
            besetning                     = excluded.besetning,
            fartøykommune_kode            = excluded.fartøykommune_kode,
            fartøykommune                 = excluded.fartøykommune,
            fartøyfylke_kode              = excluded.fartøyfylke_kode,
            fartøyfylke                   = excluded.fartøyfylke,
            fartøynasjonalitet_kode       = excluded.fartøynasjonalitet_kode,
            fartøynasjonalitet            = excluded.fartøynasjonalitet,
            fartøynasjonalitet_gruppe     = excluded.fartøynasjonalitet_gruppe,
            største_lengde                = excluded.største_lengde,
            lengdegruppe_kode             = excluded.lengdegruppe_kode,
            lengdegruppe                  = excluded.lengdegruppe,
            bruttotonnasje_1969           = excluded.bruttotonnasje_1969,
            bruttotonnasje_annen          = excluded.bruttotonnasje_annen,
            byggeår                       = excluded.byggeår,
            ombyggingsår                  = excluded.ombyggingsår,
            motorkraft                    = excluded.motorkraft,
            motorbyggeår                  = excluded.motorbyggeår,
            fangstår                      = excluded.fangstår,
            siste_fangstdato              = excluded.siste_fangstdato,
            kvotetype_kode                = excluded.kvotetype_kode,
            kvotetype                     = excluded.kvotetype,
            redskap_kode                  = excluded.redskap_kode,
            redskap                       = excluded.redskap,
            redskapgruppe_kode            = excluded.redskapgruppe_kode,
            redskapgruppe                 = excluded.redskapgruppe,
            redskaphovedgruppe_kode       = excluded.redskaphovedgruppe_kode,
            redskaphovedgruppe            = excluded.redskaphovedgruppe,
            fangstfelt_kode               = excluded.fangstfelt_kode,
            "kyst/hav_kode"               = excluded."kyst/hav_kode",
            hovedområde_kode              = excluded.hovedområde_kode,
            hovedområde                   = excluded.hovedområde,
            lon_hovedområde               = excluded.lon_hovedområde,
            lat_hovedområde               = excluded.lat_hovedområde,
            lokasjon_kode                 = excluded.lokasjon_kode,
            lon_lokasjon                  = excluded.lon_lokasjon,
            lat_lokasjon                  = excluded.lat_lokasjon,
            sone_kode                     = excluded.sone_kode,
            sone                          = excluded.sone,
            områdegruppering_kode         = excluded.områdegruppering_kode,
            områdegruppering              = excluded.områdegruppering,
            hovedområde_fao_kode          = excluded.hovedområde_fao_kode,
            hovedområde_fao               = excluded.hovedområde_fao,
            "nord/sør_for_62_grader_nord" = excluded."nord/sør_for_62_grader_nord",
            fangstdagbok_nummer           = excluded.fangstdagbok_nummer,
            fangstdagbok_turnummer        = excluded.fangstdagbok_turnummer,
            landingsdato                  = excluded.landingsdato,
            landingsklokkeslett           = excluded.landingsklokkeslett,
            landingsmåned_kode            = excluded.landingsmåned_kode,
            landingsmåned                 = excluded.landingsmåned,
            landingstidspunkt             = excluded.landingstidspunkt,
            dellanding_signal             = excluded.dellanding_signal,
            neste_mottaksstasjon          = excluded.neste_mottaksstasjon,
            forrige_mottakstasjon         = excluded.forrige_mottakstasjon,
            linjenummer                   = excluded.linjenummer,
            artfdir_kode                  = excluded.artfdir_kode,
            artfdir                       = excluded.artfdir,
            art_kode                      = excluded.art_kode,
            art                           = excluded.art,
            artgruppe_kode                = excluded.artgruppe_kode,
            artgruppe                     = excluded.artgruppe,
            arthovedgruppe_kode           = excluded.arthovedgruppe_kode,
            arthovedgruppe                = excluded.arthovedgruppe,
            art_fao_kode                  = excluded.art_fao_kode,
            art_fao                       = excluded.art_fao,
            produkttilstand_kode          = excluded.produkttilstand_kode,
            produkttilstand               = excluded.produkttilstand,
            konserveringsmåte_kode        = excluded.konserveringsmåte_kode,
            konserveringsmåte             = excluded.konserveringsmåte,
            landingsmåte_kode             = excluded.landingsmåte_kode,
            landingsmåte                  = excluded.landingsmåte,
            kvalitet_kode                 = excluded.kvalitet_kode,
            kvalitet                      = excluded.kvalitet,
            størrelsesgruppering_kode     = excluded.størrelsesgruppering_kode,
            anvendelse_kode               = excluded.anvendelse_kode,
            anvendelse                    = excluded.anvendelse,
            anvendelse_hovedgruppe_kode   = excluded.anvendelse_hovedgruppe_kode,
            anvendelse_hovedgruppe        = excluded.anvendelse_hovedgruppe,
            antall_stykk                  = excluded.antall_stykk,
            bruttovekt                    = excluded.bruttovekt,
            produktvekt                   = excluded.produktvekt,
            produktvekt_over_kvote        = excluded.produktvekt_over_kvote,
            rundvekt_over_kvote           = excluded.rundvekt_over_kvote,
            rundvekt                      = excluded.rundvekt,
            enhetspris_for_kjøper         = excluded.enhetspris_for_kjøper,
            beløp_for_kjøper              = excluded.beløp_for_kjøper,
            enhetspris_for_fisker         = excluded.enhetspris_for_fisker,
            beløp_for_fisker              = excluded.beløp_for_fisker,
            støttebeløp                   = excluded.støttebeløp,
            lagsavgift                    = excluded.lagsavgift,
            inndradd_fangstverdi          = excluded.inndradd_fangstverdi,
            etterbetaling                 = excluded.etterbetaling,
            fangstverdi                   = excluded.fangstverdi,
            oppdateringstidspunkt         = excluded.oppdateringstidspunkt,
            lok                           = excluded.lok
    WHERE excluded.dokument_salgsdato IS NOT NULL
      AND excluded.dokument_versjonsnummer > target.dokument_versjonsnummer;

    -- Clear staging table after inserting new and updated data to raw data table
--     DELETE
--     FROM fangstanalyse.public.raw_catch_data_staging_table
--     WHERE 1 = 1;

    RETURN NEW;
END;
$$;

alter function add_new_data_to_raw_catch_data_table() owner to postgres;

create trigger raw_catch_data_upsert_trigger
	after insert
	on raw_catch_data_staging_table
	for each row
	execute procedure add_new_data_to_raw_catch_data_table();

create or replace function propagate_data_to_reduced_catch_data_table() returns trigger
	language plpgsql
as $$
BEGIN
    /*
    *************
        Insert new records.
    *************
    */
    INSERT INTO fangstanalyse.public.reduced_catch_data(rundvekt,
                                                        fangstfelt,
                                                        art_kode,
                                                        epoch_landing,
                                                        timestamp_landing,
                                                        lengdekode,
                                                        kvalitetkode,
                                                        redskap_kode,
                                                        dokument_versjonsnummer,
                                                        dokument_versjonstidspunkt,
                                                        dokumentnummer,
                                                        linjenummer,
                                                        fartoy_navn,
                                                        fartoy_kommune,
                                                        art,
                                                        kvalitet,
                                                        redskap,
                                                        lengdegruppe,
                                                        year,
                                                        month,
                                                        year_and_month)
    VALUES (COALESCE(new.rundvekt, 0),
            COALESCE(new.lok, '0000'),
            COALESCE(CAST(new.artfdir_kode AS integer), 0),
            EXTRACT(epoch from to_timestamp(CONCAT(new.landingsdato, new.landingsklokkeslett), 'dd.MM.YYYYHH24:MI:SS')),
            TO_TIMESTAMP(CONCAT(new.landingsdato, new.landingsklokkeslett), 'dd.MM.YYYYHH24:MI:SS'),
            COALESCE(CAST(new.lengdegruppe_kode AS integer), 0),
            COALESCE(CAST(new.kvalitet_kode AS integer), 0),
            COALESCE(CAST(new.redskapgruppe_kode AS integer), 0),
            COALESCE(CAST(new.dokument_versjonsnummer AS integer), 0),
            COALESCE(new.dokument_versjonstidspunkt, ''),
            COALESCE(new.dokumentnummer, 0),
            COALESCE(CAST(new.linjenummer AS integer), 0),
            COALESCE(new.fartøynavn, ''),
            COALESCE(new.fartøykommune, ''),
            COALESCE(new.artfdir, ''),
            COALESCE(new.kvalitet, ''),
            COALESCE(new.redskap, ''),
            COALESCE(new.lengdegruppe, ''),
            EXTRACT(YEAR from to_timestamp(CONCAT(new.landingsdato, new.landingsklokkeslett), 'dd.MM.YYYYHH24:MI:SS')),
            EXTRACT(MONTH from to_timestamp(CONCAT(new.landingsdato, new.landingsklokkeslett), 'dd.MM.YYYYHH24:MI:SS')),
            CONCAT(EXTRACT(YEAR from to_timestamp(CONCAT(new.landingsdato, new.landingsklokkeslett), 'dd.MM.YYYYHH24:MI:SS')), '-',
                   EXTRACT(MONTH from to_timestamp(CONCAT(new.landingsdato, new.landingsklokkeslett), 'dd.MM.YYYYHH24:MI:SS'))))
    ON CONFLICT (dokumentnummer, linjenummer)
        DO UPDATE
        SET rundvekt                   = excluded.rundvekt,
            fangstfelt                 = excluded.fangstfelt,
            art_kode                   = excluded.art_kode,
            epoch_landing              = excluded.epoch_landing,
            lengdekode                 = excluded.lengdekode,
            kvalitetkode               = excluded.kvalitetkode,
            redskap_kode               = excluded.redskap_kode,
            dokument_versjonsnummer    = excluded.dokument_versjonsnummer,
            dokument_versjonstidspunkt = excluded.dokument_versjonstidspunkt,
            dokumentnummer             = excluded.dokumentnummer,
            linjenummer                = excluded.linjenummer,
            fartoy_navn                = excluded.fartoy_navn,
            fartoy_kommune             = excluded.fartoy_kommune,
            art                        = excluded.art,
            kvalitet                   = excluded.kvalitet,
            redskap                    = excluded.redskap,
            lengdegruppe               = excluded.lengdegruppe,
            year                       = excluded.year,
            month                      = excluded.month,
            year_and_month             = excluded.year_and_month;

    RETURN NEW;
END;
$$;

alter function propagate_data_to_reduced_catch_data_table() owner to postgres;

create trigger propagate_changes_on_raw_catch_data_insert_trigger
	after insert or update
	on raw_catch_data
	for each row
	execute procedure propagate_data_to_reduced_catch_data_table();

create or replace function generate_monthly_aggregated_catch_data() returns trigger
	language plpgsql
as $$
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
                                                                           redskap)
    VALUES (new.rundvekt,
            new.fangstfelt,
            new.art,
            new.dato,
            new.lengdekode,
            new.kvalitetkode,
            new.redskap)
    ON CONFLICT (dato, fangstfelt, art, redskap, kvalitetkode, lengdekode)
        DO UPDATE
        SET rundvekt     = excluded.rundvekt,
            fangstfelt   = excluded.fangstfelt,
            art          = excluded.art,
            dato         = excluded.dato,
            lengdekode   = excluded.lengdekode,
            kvalitetkode = excluded.kvalitetkode,
            redskap      = excluded.redskap;

    RETURN NEW;
END;
$$;

alter function generate_monthly_aggregated_catch_data() owner to postgres;

create trigger monthly_aggregated_catch_data_upsert_trigger
	after insert
	on monthly_aggregated_grouped_catch_data_staging_table
	for each row
	execute procedure generate_monthly_aggregated_catch_data();

create or replace procedure aggregate_monthly_catch_data()
	language plpgsql
as $$
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
               AND timestamp_landing IS NOT NULL
               -- Only the data for the last 3 years are updated, so we ignore older data.
               AND date_part('YEAR', timestamp_landing) > date_part('YEAR', CURRENT_DATE) - 3
             group by date_trunc('MONTH', timestamp_landing), fangstfelt, art_kode, kvalitetkode, lengdekode, redskap_kode
         ) as source;

    TRUNCATE TABLE public.monthly_aggregated_grouped_catch_data_staging_table;
END;
$$;

alter procedure aggregate_monthly_catch_data() owner to postgres;

create or replace procedure usp_truncate_catch_data_staging_table()
	language plpgsql
as $$
BEGIN
    TRUNCATE TABLE public.raw_catch_data_staging_table;
END;
$$;

alter procedure usp_truncate_catch_data_staging_table() owner to postgres;

create or replace function upsert_monthly_aggregated_catch_records_from_staging_table() returns trigger
	language plpgsql
as $$
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
$$;

alter function upsert_monthly_aggregated_catch_records_from_staging_table() owner to postgres;

create trigger monthly_aggregated_catch_data_staging_table_upsert_trigger
	after insert
	on monthly_aggregated_grouped_catch_data_staging_table
	for each row
	execute procedure upsert_monthly_aggregated_catch_records_from_staging_table();

create or replace procedure usp_truncate_temperature_and_air_pressure_staging_table()
	language plpgsql
as $$
BEGIN
    TRUNCATE TABLE public.monthly_averaged_temperature_and_air_pressure_staging_table;
END;
$$;

alter procedure usp_truncate_temperature_and_air_pressure_staging_table() owner to postgres;

create or replace function add_new_data_to_weather_data_table() returns trigger
	language plpgsql
as $$
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

alter function add_new_data_to_weather_data_table() owner to postgres;

create trigger weather_data_staging_upsert_trigger
	after insert
	on monthly_averaged_temperature_and_air_pressure_staging_table
	for each row
	execute procedure add_new_data_to_weather_data_table();

create or replace procedure usp_update_monthly_catch_table_with_weather_values()
	language plpgsql
as $$
BEGIN
    UPDATE monthly_aggregated_grouped_catch_data AS A
    SET temperatur = coalesce(B.temperature, 0),
        lufttrykk  = coalesce(B.air_pressure, 101325.0)
    FROM monthly_averaged_temperature_and_air_pressure AS B
    WHERE A.fangstfelt = B.catch_area_id
      AND A.dato = B.datetime;

    UPDATE monthly_aggregated_grouped_catch_data
    SET temperatur = 0,
        lufttrykk  = 1013.250
    WHERE temperatur IS NULL
      AND lufttrykk IS NULL;
END;
$$;

alter procedure usp_update_monthly_catch_table_with_weather_values() owner to postgres;

