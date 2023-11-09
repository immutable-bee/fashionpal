import { useState, useCallback } from "react";

const useDateRangePicker = (initialRange = "Current Month") => {
  const [selectedRange, setSelectedRange] = useState(initialRange);

  const getRange = useCallback((range) => {
    const today = new Date();
    let start, end;

    switch (range) {
      case "Current Month":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "Previous Month":
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case "Last 30 Days":
        start = new Date(today.setDate(today.getDate() - 30));
        end = new Date();
        break;
      case "Last 60 Days":
        start = new Date(today.setDate(today.getDate() - 60));
        end = new Date();
        break;
      case "Last 90 Days":
        start = new Date(today.setDate(today.getDate() - 90));
        end = new Date();
        break;
      case "Current Year":
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear(), 11, 31);
        break;
      case "All":
        start = new Date(2000, 0, 1);
        end = new Date();
        break;
      default:
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    }

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    return { dateFrom: start, dateTo: end };
  }, []);

  return { selectedRange, setSelectedRange, getRange };
};

export default useDateRangePicker;
