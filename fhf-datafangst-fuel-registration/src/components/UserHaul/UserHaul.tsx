import { Button, Divider, Stack, Typography } from "@mui/material";
import type { FC } from "react";
import { useEffect } from "react";
import theme from "~/app/theme";
import { LocalLoadingProgress } from "~/components";
import { useAppDispatch, useAppSelector } from "~/store";
import {
  abortUserHaul,
  getActiveUserHaul,
  getUserHauls,
  selectActiveUserHaul,
  selectActiveUserHaulLoading,
  selectUserHaulsDesc,
  selectUserHaulsLoading,
  startUserHaul,
  stopUserHaul,
} from "~/store/userHaul";
import { dateFormat } from "~/utils";

export const UserHaul: FC = () => {
  const dispatch = useAppDispatch();

  const hauls = useAppSelector(selectUserHaulsDesc);
  const haulsLoading = useAppSelector(selectUserHaulsLoading);
  const activeHaul = useAppSelector(selectActiveUserHaul);
  const activeHaulLoading = useAppSelector(selectActiveUserHaulLoading);

  useEffect(() => {
    dispatch(getUserHauls({}));
    dispatch(getActiveUserHaul({}));
  }, []);

  if (haulsLoading && activeHaulLoading) {
    return <LocalLoadingProgress color={theme.palette.primary.main} />;
  }

  const onStartHaul = () => {
    dispatch(
      startUserHaul({
        config: {
          test: 1,
          name: "foobar",
          nested: {
            foo: 10,
            bar: "baz",
          },
        },
        fuelLiterStart: 10_000,
      }),
    );
  };

  const onStopHaul = () => {
    dispatch(
      stopUserHaul({
        fuelLiterEnd: 1_000,
      }),
    );
  };

  const onAbortHaul = () => {
    dispatch(abortUserHaul({}));
  };

  return (
    <Stack spacing={4}>
      {activeHaulLoading ? (
        <LocalLoadingProgress color={theme.palette.primary.main} />
      ) : activeHaul ? (
        <Stack direction="row">
          <Button variant="contained" onClick={onStopHaul}>
            Stop Hal
          </Button>
          <Button variant="contained" onClick={onAbortHaul}>
            Avbryt Hal
          </Button>
        </Stack>
      ) : (
        <Stack>
          <Button variant="contained" onClick={onStartHaul}>
            Start Hal
          </Button>
        </Stack>
      )}

      <Divider sx={{ bgcolor: "text.secondary", mb: 2, mx: 4 }} />

      {haulsLoading ? (
        <LocalLoadingProgress color={theme.palette.primary.main} />
      ) : hauls && hauls.length > 0 ? (
        <Stack spacing={2}>
          {hauls.map((v) => (
            <Stack
              key={v.id}
              sx={{ border: "1px solid gray", borderRadius: 2, padding: 1 }}
            >
              <Typography>
                {dateFormat(v.startTs, "dd.MM.yyyy HH:mm")} -{" "}
                {dateFormat(v.endTs, "dd.MM.yyyy HH:mm")}
              </Typography>
              <Typography>
                {v.startFuelLiter} - {v.endFuelLiter}
              </Typography>
              <Typography>{JSON.stringify(v.config)}</Typography>
            </Stack>
          ))}
        </Stack>
      ) : (
        <Typography sx={{ pl: 1, fontStyle: "italic" }}>
          Ingen registrerte hal
        </Typography>
      )}
    </Stack>
  );
};
