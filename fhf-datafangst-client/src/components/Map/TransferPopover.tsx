import SwapHorizontalCircleIcon from "@mui/icons-material/SwapHorizontalCircle";
import { Divider, Stack, Typography } from "@mui/material";
import { ErsQuantumType, Tra, TraCatch } from "generated/openapi";
import { FC } from "react";
import { selectVesselsByFiskeridirId, useAppSelector } from "store";
import { dateFormat, kilosOrTonsFormatter, toTitleCase } from "utils";

interface Props {
  transfer: Tra;
}

const textStyle = {
  lineHeight: 1.43,
  fontSize: "0.876rem",
  fontWeight: 400,
};

const sumTraWeight = (catches: TraCatch[]) => {
  return catches.reduce(
    (sum, curr) =>
      curr.catchQuantum === ErsQuantumType.Kg ? sum + curr.livingWeight : sum,
    0,
  );
};

export const TransferPopover: FC<Props> = ({ transfer }) => {
  const weight = sumTraWeight(transfer.catches);
  const vesselsMap = useAppSelector(selectVesselsByFiskeridirId);

  return (
    <Stack sx={{ p: 1, pr: 1.2 }} spacing={1}>
      <Stack direction="row" justifyContent="space-evenly" spacing={1}>
        <SwapHorizontalCircleIcon fontSize="large" sx={{ color: "#BB00FF" }} />
        <Stack>
          <Typography sx={{ ...textStyle, fontWeight: 700 }}>
            Omlasting
          </Typography>
          <Typography sx={textStyle}>
            {dateFormat(
              transfer.reloadingTimestamp ?? transfer.messageTimestamp,
              "d MMM p",
            )}
          </Typography>
        </Stack>
      </Stack>
      <Divider />
      <Stack>
        <Stack
          sx={{ width: "100%" }}
          spacing={1}
          direction="row"
          justifyContent="space-between"
        >
          <Typography sx={{ ...textStyle, color: "#4E4E4E" }}>
            {transfer.reloadToCallSign
              ? "Avgitt: "
              : transfer.reloadFromCallSign
                ? "Mottatt: "
                : "Ukjent giver/mottaker: "}
          </Typography>
          <Typography
            sx={{
              color: "primary.main",
              lineHeight: 1.43,
              fontSize: "0.95rem",
            }}
          >
            {weight ? kilosOrTonsFormatter(weight) : "Ukjent mengde"}
          </Typography>
        </Stack>
        {(transfer.reloadFromFiskeridirVesselId ||
          transfer.reloadToFiskeridirVesselId) && (
          <Stack
            sx={{ width: "100%" }}
            direction="row"
            spacing={1}
            justifyContent="space-between"
          >
            <Typography sx={{ ...textStyle, color: "#4E4E4E" }}>
              {transfer.reloadToCallSign ? "Til: " : "Fra:"}
            </Typography>
            <Typography
              sx={{
                color: "primary.main",
                lineHeight: 1.43,
                fontSize: "0.95rem",
              }}
            >
              {transfer.reloadFromFiskeridirVesselId
                ? toTitleCase(
                    vesselsMap[transfer.reloadFromFiskeridirVesselId].fiskeridir
                      .name,
                  )
                : toTitleCase(
                    vesselsMap[transfer.reloadToFiskeridirVesselId!].fiskeridir
                      .name,
                  )}
            </Typography>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
