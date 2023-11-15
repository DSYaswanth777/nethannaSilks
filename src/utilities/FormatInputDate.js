
import { format } from "date-fns";

export const formatDateForInput = (isoDate) => {
  if (!isoDate) {
    return ""; // Handle empty date
  }

  const date = new Date(isoDate);

  if (isNaN(date.getTime())) {
    return ""; // Handle invalid date
  }

  return format(date, "dd-MM-yyyy HH:mm:ss a");
};
