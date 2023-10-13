import { Box, Modal, Typography } from "@mui/material";
import { HistoricLineChart } from "components/Graphs/HistoricLineChart";
import { FC } from "react";
import { useAppDispatch, useAppSelector } from "store";
import { selectBenchmarkModal } from "store/benchmark";
import { setBenchmarkModal } from "store/benchmark/actions";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  bgcolor: "primary.light",
  border: "2px solid #000",
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
    <Modal
      open={!!benchmarkModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {benchmarkModal?.title && (
          <Typography id="modal-modal-title" variant="h1" color="text.secondary" component="h2">
            {benchmarkModal?.title}
          </Typography>
        )}
        {benchmarkModal?.description && (
          <Typography id="modal-modal-description" variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            {benchmarkModal?.description}
          </Typography>
        )}
        <HistoricLineChart />
      </Box>
    </Modal>
  );
};
