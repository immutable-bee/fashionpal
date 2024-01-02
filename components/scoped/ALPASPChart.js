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
          id: "line-chart",
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
        yaxis: {
          labels: {
            formatter: function (value) {
              return "$" + value;
            },
          },
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
