import { useSnackbar } from "notistack";

// This component ensures that `useSnackbar` is initialized.
let snackbarRef;

export const SnackbarUtilitiesConfigurator = () => {
  snackbarRef = useSnackbar();
  return null;
};

export const SnackbarUtilities = {
  toast(msg, variant = "default", autoHideDuration = 3000) {
    if (snackbarRef) {
      snackbarRef.enqueueSnackbar(msg, { variant, autoHideDuration });
    }
  },
  success(msg) {
    this.toast(msg, "success");
  },
  error(msg) {
    console.log(msg);
    this.toast(msg, "error");
  },
  info(msg) {
    this.toast(msg, "info");
  },
  warning(msg) {
    this.toast(msg, "warning");
  },
};
