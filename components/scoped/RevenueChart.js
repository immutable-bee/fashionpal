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
          id: "bar-chart",
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
              return (
                "$" +
                value.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              );
            },
          },
        },
        plotOptions: {
          bar: {
            dataLabels: {
              position: "top", // You can change the position as needed
              formatter: function (val) {
                return (
                  "$" +
                  val.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                );
              },
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return (
              "$" +
              val.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            );
          },
          offsetY: -20, // Adjust the offset as needed
          style: {
            fontSize: "12px",
            colors: ["#304758"],
          },
        },
      },
      series: [
        {
          name: "Revenue",
          data: [
            4000, 5500, 2600, 4000, 5500, 2600, 4000, 5500, 2600, 4000, 5500,
            2600,
          ],
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
          <div className="bar-chart">
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
