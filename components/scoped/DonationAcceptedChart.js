import React, { Component } from "react";
import Chart from "react-apexcharts";

class App extends Component {
  constructor(props) {
    super(props);

    const isMobile = window.innerWidth <= 768; // Adjust the threshold for mobile screens

    this.state = {
      computedValue: isMobile ? window.innerWidth - 12 : 700,
      options: {
        chart: {
          id: "line-chart-donations",
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
    const isMobile = window.innerWidth <= 768;
    this.setState({
      computedValue: isMobile ? window.innerWidth - 12 : 700,
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
