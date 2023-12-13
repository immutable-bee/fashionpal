import React, { Component } from "react";
import Chart from "react-apexcharts";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
              width="1000"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
