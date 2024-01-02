import React, { Component } from "react";
import Chart from "react-apexcharts";

class App extends Component {
  constructor(props) {
    super(props);

    const isMobile = document.documentElement.clientWidth <= 768; // Adjust the threshold for mobile screens

    this.state = {
      computedValue: isMobile ? document.documentElement.clientWidth - 0 : 700,
      options: {
        chart: {
          id: "line-chart-donations",
        },
        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
        },
        plotOptions: {
          bar: {
            dataLabels: {
              position: "top",
            },
          },
        },
        dataLabels: {
          enabled: !isMobile, // Disable data labels on mobile
        },
      },
      series: [
        {
          name: "Donations",
          data: [
            4000, 5000, 5500, 4000, 5000, 5500, 4000, 5000, 5500, 4000, 5000,
            5500,
          ],
          type: "area",
          fill: {
            color: "#FF0000", // Red background for Donations
          },
        },
        {
          name: "Accepted",
          data: [
            1000, 2000, 2500, 1000, 2000, 2500, 1000, 2000, 2500, 1000, 2000,
            2500,
          ],
          type: "area",
          fill: {
            color: "#0000FF", // Blue background for Accepted
          },
        },
      ],
    };
    // Add event listener for window resize
    window.addEventListener("resize", this.handleResize);
  }

  // Event handler for window resize
  handleResize = () => {
    const isMobile = document.documentElement.clientWidth <= 768;
    this.setState({
      computedValue: isMobile ? document.documentElement.clientWidth - 0 : 700,
    });
  };

  componentWillUnmount() {
    // Remove the event listener when the component is unmounted
    window.removeEventListener("resize", this.handleResize);
  }

  render() {
    return (
      <div className="app">
        <div className="row">
          <div className="line-chart-donations">
            <Chart
              options={this.state.options}
              series={this.state.series}
              type="line"
              width={this.state.computedValue}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
