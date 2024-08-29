import { Box, Modal, Typography } from "@mui/material";
import { HistoricLineChart } from "components";
import { FC } from "react";
import {
  selectBenchmarkModal,
  setBenchmarkModal,
  useAppDispatch,
  useAppSelector,
} from "store";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  bgcolor: "white",
  borderRadius: 2,
  border: 0,
  boxShadow: 24,
  p: 4,
};

export const BenchmarkModal: FC = () => {
  const dispatch = useAppDispatch();
  const benchmarkModal = useAppSelector(selectBenchmarkModal);
  const handleClose = () => {
    dispatch(setBenchmarkModal(undefined));
  };

  return (
    <Modal open={!!benchmarkModal} onClose={handleClose}>
      <Box sx={style}>
        {benchmarkModal?.title && (
          <Typography color="primary.main" variant="h2">
            {benchmarkModal?.title}
          </Typography>
        )}
        {benchmarkModal?.description && (
          <Typography variant="h6" sx={{ my: 1 }}>
            {benchmarkModal?.description}
          </Typography>
        )}
        {benchmarkModal && <HistoricLineChart {...benchmarkModal.dataset} />}
      </Box>
    </Modal>
  );
};
