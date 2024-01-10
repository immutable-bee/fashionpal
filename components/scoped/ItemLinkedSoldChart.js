import React, { Component } from "react";
import Chart from "react-apexcharts";

class App extends Component {
  constructor(props) {
    super(props);

    const isMobile = document.documentElement.clientWidth <= 768;
    const { chartData } = this.props;

    const dateGroup = Object.keys(chartData.statsByGroup);
    const totalItemsListed = dateGroup.map(
      (group) => chartData.statsByGroup[group].donations || 0
    );
    const totalItemsSold = dateGroup.map(
      (group) => chartData.statsByGroup[group].totalItemsSold || 0
    );

    this.state = {
      computedValue: isMobile
        ? document.documentElement.clientWidth - 6
        : document.documentElement.clientWidth * 0.75 > 1500
        ? 1500
        : document.documentElement.clientWidth * 0.75,
      options: {
        chart: {
          id: "basic-bar",
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
          name: "Listed",
          data: totalItemsListed,
        },
        {
          name: "Sold",
          data: totalItemsSold,
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
