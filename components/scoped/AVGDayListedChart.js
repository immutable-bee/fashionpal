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
        dataLabels: {
          enabled: true, // Set to true to display data labels by default
        },
      },
      series: [
        {
          name: "AVG Days Listed",
          type: "line",
          data: [60, 66, 56, 55, 62, 58, 69, 72, 59, 58, 55, 51],
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
