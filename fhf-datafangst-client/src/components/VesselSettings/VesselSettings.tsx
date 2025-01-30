import {
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import theme from "app/theme";
import { UpdateVessel } from "generated/openapi";
import { FC, ReactNode, useState } from "react";
import {
  selectLoggedInVessel,
  updateVessel,
  useAppDispatch,
  useAppSelector,
} from "store";
import { numberInputLimiter } from "utils";

const inYearsRange = (year: number | null | undefined) => {
  if (year && year >= 1940 && year <= new Date().getFullYear()) {
    return year;
  }

  return "";
};

const years = Array.from(
  Array(new Date().getFullYear() - 1939),
  (_, i) => i + 1940,
);

export const VesselSettings: FC = () => {
  const dispatch = useAppDispatch();
  const vessel = useAppSelector(selectLoggedInVessel);
  const initialForm: UpdateVessel = {
    enginePower: vessel?.fiskeridir.enginePower ?? null,
    engineBuildingYear: vessel?.fiskeridir.engineBuildingYear ?? null,
    auxiliaryEnginePower: vessel?.fiskeridir.auxiliaryEnginePower ?? null,
    auxiliaryEngineBuildingYear:
      vessel?.fiskeridir.auxiliaryEngineBuildingYear ?? null,
    boilerEnginePower: vessel?.fiskeridir.boilerEnginePower ?? null,
    boilerEngineBuildingYear: vessel?.fiskeridir.boilerEnginePower ?? null,
    serviceSpeed: vessel?.fiskeridir.serviceSpeed ?? null,
    degreeOfElectrification: vessel?.fiskeridir.degreeOfElectrification ?? null,
  };
  const [form, setForm] = useState<UpdateVessel>(initialForm);

  // Set if form is changed. It will not validate values, so setting a field to
  // its original value will also count as a form being dirty.
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const handleFormChange = (value: string | number, key: string) => {
    setForm((form) => ({ ...form, [key]: value ? Number(value) : null }));
    setIsDirty(true);
  };

  return (
    <>
      <Stack sx={{ p: 1, pb: 2 }}>
        <Typography variant="h5">Tekniske spesifikasjoner</Typography>
        <Typography sx={{ color: theme.palette.grey[500] }}>
          Verdiene som oppgis brukes til å estimere drivstofforbruket til
          fartøyet.
        </Typography>
      </Stack>
      <Stack
        sx={{ p: 1, width: 400, "& .MuiTextField-root": { width: 120 } }}
        spacing={2}
      >
        <SettingsEntry name={"Hovedmotor, kraft (hk)"}>
          <TextField
            size="small"
            hiddenLabel
            variant="outlined"
            value={form.enginePower ?? ""}
            onKeyDown={numberInputLimiter}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleFormChange(event.target.value, "enginePower");
            }}
          />
        </SettingsEntry>
        <SettingsEntry name={"Hovedmotor, byggeår"}>
          <YearSelect
            value={form.engineBuildingYear}
            onChange={(e) => {
              handleFormChange(e.target.value, "engineBuildingYear");
            }}
          />
        </SettingsEntry>
        <SettingsEntry name={"Hjelpemotor, kraft (hk)"}>
          <TextField
            size="small"
            hiddenLabel
            variant="outlined"
            value={form.auxiliaryEnginePower ?? ""}
            onKeyDown={numberInputLimiter}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleFormChange(e.target.value, "auxiliaryEnginePower");
            }}
          />
        </SettingsEntry>
        <SettingsEntry name={"Hjelpemotor, byggeår"}>
          <YearSelect
            value={form.auxiliaryEngineBuildingYear}
            onChange={(e) => {
              handleFormChange(e.target.value, "auxiliaryEngineBuildingYear");
            }}
          />
        </SettingsEntry>
        <SettingsEntry name={"Boiler engine, kraft (hk)"}>
          <TextField
            size="small"
            hiddenLabel
            variant="outlined"
            value={form.boilerEnginePower ?? ""}
            onKeyDown={numberInputLimiter}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleFormChange(e.target.value, "boilerEnginePower");
            }}
          />
        </SettingsEntry>
        <SettingsEntry name={"Boiler engine, byggeår"}>
          <YearSelect
            value={form.boilerEngineBuildingYear}
            onChange={(e) => {
              handleFormChange(e.target.value, "boilerEngineBuildingYear");
            }}
          />
        </SettingsEntry>
        <SettingsEntry name={"Service-fart (knop)"}>
          <TextField
            size="small"
            hiddenLabel
            variant="outlined"
            value={form.serviceSpeed ?? ""}
            onKeyDown={numberInputLimiter}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleFormChange(e.target.value, "serviceSpeed");
            }}
          />
        </SettingsEntry>
        <SettingsEntry name={"Elektrifiseringsgrad (%)"}>
          <Slider
            sx={{
              width: 120,
              borderRadius: 0,
              "& .MuiSlider-track": {
                borderRadius: 0,
              },
              "& .MuiSlider-thumb": {
                width: 15,
                height: 15,
              },
              "& .MuiSlider-valueLabel": {},
            }}
            min={0}
            max={100}
            step={10}
            valueLabelDisplay="auto"
            valueLabelFormat={(v, _) => `${v}%`}
            value={form.degreeOfElectrification ?? 0}
            onChange={(_, v) =>
              handleFormChange(v as number, "degreeOfElectrification")
            }
          />
        </SettingsEntry>
        <Stack
          direction="row"
          spacing={1}
          sx={{ pt: 3 }}
          justifyContent="space-between"
        >
          <Button
            color="success"
            variant="contained"
            sx={{ width: 150 }}
            disabled={!isDirty}
            onClick={() => {
              dispatch(updateVessel(form));
              setIsDirty(false);
            }}
          >
            Lagre
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setForm(initialForm);
              setIsDirty(false);
            }}
          >
            Reset
          </Button>
        </Stack>
      </Stack>
    </>
  );
};

interface SelectProps {
  value: number | null | undefined;
  onChange: (e: SelectChangeEvent<number>) => void;
}

const YearSelect: FC<SelectProps> = ({ value, onChange }) => {
  return (
    <Select
      size="small"
      sx={{ width: 120 }}
      MenuProps={{
        transitionDuration: 0,
        sx: { height: 500, width: 400, zIndex: 3000 },
      }}
      displayEmpty
      value={inYearsRange(value)}
      renderValue={(selected) => {
        if (
          !selected ||
          selected < 1940 ||
          selected > new Date().getFullYear()
        ) {
          return <em>---</em>;
        }

        return selected;
      }}
      onChange={onChange}
    >
      {years.map((year) => (
        <MenuItem key={year} value={year} sx={{ justifyContent: "center" }}>
          {year}
        </MenuItem>
      ))}
    </Select>
  );
};

interface SettingsEntryProps {
  name: string;
  children: ReactNode;
}
const SettingsEntry: FC<SettingsEntryProps> = ({ name, children }) => {
  return (
    <Stack
      direction="row"
      spacing={3}
      alignItems="center"
      justifyContent="space-between"
    >
      <Typography>{name}</Typography>
      {children}
    </Stack>
  );
};
