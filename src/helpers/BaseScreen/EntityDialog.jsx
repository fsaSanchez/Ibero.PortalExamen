import React from "react";
import Dialog from "@mui/material/Dialog";

export const EntityDialog = ({ open, onClose, title, children }) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" disableEscapeKeyDown>
    <div className="p-4">
      <h5 className="text-center fw-bold mb-3">{title}</h5><br></br>
      {children}
    </div>
  </Dialog>
);
