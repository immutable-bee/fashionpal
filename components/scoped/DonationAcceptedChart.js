import React, { Component } from "react";
import Chart from "react-apexcharts";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
              width="1000"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
