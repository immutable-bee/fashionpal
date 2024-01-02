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
          id: "line-chart",
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
        yaxis: {
          labels: {
            formatter: function (value) {
              return "$" + value;
            },
          },
        },
        dataLabels: {
          enabled: true, // Set to true to display data labels by default
        },
      },
      series: [
        {
          name: "ALP",
          type: "line",
          data: [6, 8, 10, 6, 8, 10, 6, 8, 10, 6, 8, 10],
        },
        {
          name: "ASP",
          type: "line",
          data: [4, 3, 7, 4, 3, 7, 4, 3, 7, 4, 3, 7],
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
          <div className="line-chart">
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
