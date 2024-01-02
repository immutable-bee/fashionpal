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
      },
      series: [
        {
          name: "Items Listed",
          data: [900, 1200, 500, 700, 900, 1200, 500, 700, 900, 1200, 500, 700],
        },
        {
          name: "Items Sold",
          data: [800, 100, 400, 500, 800, 100, 400, 500, 800, 100, 400, 500],
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
          <div className="mixed-chart">
            <Chart
              options={this.state.options}
              series={this.state.series}
              type="bar"
              width={this.state.computedValue}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
