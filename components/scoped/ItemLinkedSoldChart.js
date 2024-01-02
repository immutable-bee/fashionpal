import React, { Component } from "react";
import Chart from "react-apexcharts";

class App extends Component {
  constructor(props) {
    super(props);

    const isMobile = document.documentElement.clientWidth <= 614; // Adjust the threshold for mobile screens
    this.state = {
      computedValue: isMobile ? document.documentElement.clientWidth - 6 : 700,
      options: {
        chart: {
          id: "basic-bar",
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
          name: "Listed",
          data: [720, 960, 400, 560, 720, 960, 400, 560, 720, 960, 400, 560],
        },
        {
          name: "Sold",
          data: [640, 80, 320, 400, 640, 80, 320, 400, 640, 80, 320, 400],
        },
      ],
    };

    // Add event listener for window resize
    window.addEventListener("resize", this.handleResize);
  }

  // Event handler for window resize
  handleResize = () => {
    const isMobile = document.documentElement.clientWidth <= 614;
    this.setState({
      computedValue: isMobile ? document.documentElement.clientWidth - 10 : 700,
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
