import Swal from "sweetalert2/dist/sweetalert2.js";

export const Toast = Swal.mixin({
  toast: true,
  position: "top-right",
  iconColor: "white",
  customClass: {
    popup: "colored-toast",
  },
  showConfirmButton: false,
  timer: 1700,
  timerProgressBar: true,
});
