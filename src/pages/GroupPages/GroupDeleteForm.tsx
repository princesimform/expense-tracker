import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeleteData, groupDataType } from "../../redux/groupSlice";
import { GeneralPropType } from "../../routes/AuthRoutes";
import { useDispatch } from "react-redux";
import FirebaseFileHandling from "../../libs/services/firebase/fileHandling";
import { useSnackbar } from "notistack";
import { AppDispatch } from "../../redux/store";

interface PropType extends GeneralPropType {
  groupData: groupDataType;
}
function GroupDeleteForm({ groupData }: PropType) {
  const [openDialog, setOpenDialog] = useState(false);
  const nevagite = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const deleteGroup = async (groupData: groupDataType) => {
    if (groupData.group_image != null) {
      const response = await FirebaseFileHandling.removeFile(
        groupData.group_image
      );
      console.log(response);
    }
    const response = await dispatch(DeleteData(groupData));

    if (response.payload.status) {
      enqueueSnackbar(response.payload.message, {
        variant: "success",
        autoHideDuration: 3000,
      });
      setOpenDialog(false);
      nevagite("/group");
    } else {
      enqueueSnackbar("Something went wrong", {
        variant: "error",
        autoHideDuration: 3000,
      });
      throw new Error("Something went Wrong");
    }
  };

  return (
    <Box padding={1} border="2px dashed red">
      <Typography variant="h6" fontWeight="bold" textAlign="left">
        Danger Zone
      </Typography>
      <Box margin={1}>
        <Button
          variant="contained"
          fullWidth
          color="error"
          onClick={() => setOpenDialog(true)}
        >
          Delete Group
        </Button>

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Are You Sure?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              We Are Delete Your all transaction which are done in this group
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setOpenDialog(false)}
            >
              Disagree
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => deleteGroup(groupData)}
              autoFocus
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default GroupDeleteForm;
