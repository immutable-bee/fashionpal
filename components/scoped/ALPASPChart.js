import React, { Component } from "react";
import Chart from "react-apexcharts";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
              width="1000"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
