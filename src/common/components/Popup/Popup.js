import React from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  makeStyles,
} from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: theme.spacing(0, 0, 0, 1),
  },
  title: {
    padding: theme.spacing(1, 0),
  },
}));

export default function Popup({ title, open, onClose, maxWidth, children }) {
  const classes = useStyles();

  return (
    <Dialog fullWidth maxWidth={maxWidth} open={open}>
      <DialogTitle className={classes.header} disableTypography>
        <Typography className={classes.title} variant="h5">
          {title}
        </Typography>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}

Popup.defaultProps = {
  maxWidth: "sm",
};
