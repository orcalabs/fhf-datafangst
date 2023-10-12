import { Box, Modal, Typography } from "@mui/material";
import { HistoricLineChart } from "components";
import { FC } from "react";
import { useAppDispatch, useAppSelector } from "store";
import { selectBenchmarkModal } from "store/benchmark";
import { setBenchmarkModal } from "store/benchmark/actions";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    // height: '70%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

export const BenchmarkModal: FC = () => {
    const dispatch = useAppDispatch();
    const benchmarkModal = useAppSelector(selectBenchmarkModal)
    const handleClose = () =>{
        dispatch(setBenchmarkModal(undefined));
    }

    return (
        <Modal
        open={benchmarkModal ? true : false}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} >
          {
          benchmarkModal?.title && 
          <Typography id="modal-modal-title" variant="h1" component="h2">
            {benchmarkModal?.title}
          </Typography>
          }
          {
          benchmarkModal?.description &&
          <Typography id="modal-modal-description" variant="h6" sx={{ mt: 2 }}>
            {benchmarkModal?.description}
          </Typography>
          }
          <HistoricLineChart/>
        </Box>
      </Modal>
    )

}
