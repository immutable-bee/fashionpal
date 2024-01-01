import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const App = () => {
  const [computedValue, setComputedValue] = useState(calculateChartWidth());

  const options = {
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    },
  };

  const series = [
    {
      name: "Items Listed",
      data: [900, 1200, 500, 700, 900, 1200, 500, 700, 900, 1200, 500, 700],
    },
    {
      name: "Items Sold",
      data: [800, 100, 400, 500, 800, 100, 400, 500, 800, 100, 400, 500],
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      const newWidth = calculateChartWidth();
      if (newWidth !== computedValue) {
        setComputedValue(newWidth);
      }
    };

    // Initial setup
    handleResize();

    // Add event listener to window resize
    window.addEventListener("resize", handleResize);

    return () => {
      // Cleanup the event listener on component unmount
      window.removeEventListener("resize", handleResize);
    };
  }, [computedValue]);

  function calculateChartWidth() {
    const isMobile = window.innerWidth <= 768;
    return isMobile ? window.innerWidth - 12 : 700;
  }

  return (
    <div className="app">
      <div className="row">
        <div className="mixed-chart">
          <Chart
            options={options}
            series={series}
            type="bar"
            width={computedValue}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
