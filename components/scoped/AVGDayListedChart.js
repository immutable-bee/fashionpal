import React, { Component } from "react";
import Chart from "react-apexcharts";

class App extends Component {
  constructor(props) {
    super(props);

    const isMobile = document.documentElement.clientWidth <= 768; // Adjust the threshold for mobile screens

    const { chartData } = this.props;

    const dateGroup = Object.keys(chartData.statsByGroup);
    const averageDaysListed = dateGroup.map(
      (group) => chartData.statsByGroup[group].averageDaysListed || 0
    );

    this.state = {
      computedValue: isMobile
        ? document.documentElement.clientWidth - 6
        : document.documentElement.clientWidth * 0.75 > 1500
        ? 1500
        : document.documentElement.clientWidth * 0.75,
      options: {
        chart: {
          id: "line-chart",
        },
        xaxis: {
          categories: dateGroup,
        },
        plotOptions: {
          bar: {
            dataLabels: {
              position: "top",
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
      },
      series: [
        {
          name: "AVG Days Listed",
          type: "line",
          data: averageDaysListed,
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
      computedValue: isMobile
        ? document.documentElement.clientWidth - 6
        : document.documentElement.clientWidth * 0.75 > 1500
        ? 1500
        : document.documentElement.clientWidth * 0.75,
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
