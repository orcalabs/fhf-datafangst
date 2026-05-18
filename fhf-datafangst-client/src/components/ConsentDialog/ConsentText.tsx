import { Link, Stack, Typography } from "@mui/material";
import type { FC } from "react";

export const ConsentText: FC = () => {
  return (
    <Stack spacing={3}>
      <Stack spacing={2}>
        <Typography>
          Noen av tjenestene som DataFangst tilbyr er avhengig av drivstoffdata
          for ditt fartøy for å fungere optimalt. Dette regnes som private data
          og vi trenger derfor ditt samtykke til hvordan appen samler inn og
          benytter disse.
        </Typography>
        <Typography sx={{ fontStyle: "italic", color: "info.main" }}>
          Samtykke er påkrevd for å kunne registrere drivstoffdata.
        </Typography>
      </Stack>
      <Stack spacing={1}>
        <Typography sx={{ fontWeight: "bold" }}>
          Hvilken informasjon registrerer og behandler vi?
        </Typography>
        <Typography>
          Navn, telefonnummer, epost og informasjon om ditt fartøy (for eksempel
          IRCS, MMSI-nummer, IMO-nummer og registreringsnummer) som du har
          registrert i brukerprofilen blir hentet fra BarentsWatch og brukt av
          oss.
        </Typography>
        <Typography>
          Registrert drivstoffdata blir behandlet i kontekst av fartøyet du er
          tilknyttet i BarentsWatch. Vi lagrer ikke data om brukeren som utfører
          selve registreringen.
        </Typography>
      </Stack>
      <Stack spacing={1}>
        <Typography sx={{ fontWeight: "bold" }}>
          Hvordan bruker vi informasjonen vi samler inn?
        </Typography>
        <Typography>
          Drivstoffdata som du registrer gjennom DataFangst sine nettskjema blir
          lagret og brukt til å beregne statistikk og KPIer for dine tokt.
          Dataen brukes også til å forbedre vår modell for estimering av
          drivstofforbruk på turer der reell drivstoffdata ikke er tilgjengelig,
          både for ditt og andres fartøy.
        </Typography>
      </Stack>
      <Stack spacing={1}>
        <Typography sx={{ fontWeight: "bold" }}>
          Hvordan deler vi informasjon vi har samlet inn?
        </Typography>
        <Typography>
          DataFangst deler ikke informasjon om drivstofforbruk som du
          registrerer hos oss til andre utenom partnere innenfor{" "}
          <Link
            target="_blank"
            href="https://www.fhf.no/prosjekter/prosjektbasen/901990/"
          >
            FHF-prosjektet.
          </Link>
        </Typography>
      </Stack>
      <Stack spacing={1}>
        <Typography sx={{ fontWeight: "bold" }}>
          Hvordan lagrer og sikrer vi informasjonen som samles inn?
        </Typography>
        <Typography>
          Informasjonen som lagres lokalt på enheten din, lagres slik at den
          bare er tilgjengelig for DataFangst-appen. Kommunikasjonen med
          BarentsWatch er sikret og krever innlogging med brukernavn og passord.
          All registert drivstoffdata er lagret i vår skytjeneste i Microsoft
          Azure.
        </Typography>
      </Stack>
      <Stack spacing={1}>
        <Typography sx={{ fontWeight: "bold" }}>
          Hvordan kan jeg trekke tilbake samtykket?
        </Typography>
        <Typography>
          Du kan trekke tilbake ditt samtykke ved å velge «Vilkår og personvern»
          fra menyen. Her vil du finne dette skjemaet med tilhørende knapp for å
          trekke tilbake ditt samtykke.
        </Typography>
      </Stack>
    </Stack>
  );
};
