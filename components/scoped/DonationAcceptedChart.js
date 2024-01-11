import React, { Component } from "react";
import Chart from "react-apexcharts";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = this.initializeState(props);
    window.addEventListener("resize", this.handleResize);
  }

  initializeState = (props) => {
    const isMobile = document.documentElement.clientWidth <= 768;
    const dateGroup = Object.keys(props.chartData.statsByGroup);
    const donations = dateGroup.map(
      (group) => props.chartData.statsByGroup[group].donations || 0
    );
    const accepted = dateGroup.map(
      (group) => props.chartData.statsByGroup[group].accepted || 0
    );

    return {
      computedValue: this.computeValue(isMobile),
      options: {
        chart: {
          id: "line-chart-donations",
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
          name: "Donations",
          data: donations,
          type: "area",
          fill: {
            color: "#FF0000", // Red background for Donations
          },
        },
        {
          name: "Accepted",
          data: accepted,
          type: "area",
          fill: {
            color: "#0000FF", // Blue background for Accepted
          },
        },
      ],
    };
  };

  computeValue = (isMobile) => {
    return isMobile
      ? document.documentElement.clientWidth - 6
      : document.documentElement.clientWidth * 0.75 > 1500
      ? 1500
      : document.documentElement.clientWidth * 0.75;
  };

  handleResize = () => {
    const isMobile = document.documentElement.clientWidth <= 768;
    this.setState({ computedValue: this.computeValue(isMobile) });
  };

  componentDidUpdate(prevProps) {
    if (this.props.chartData !== prevProps.chartData) {
      this.setState(this.initializeState(this.props));
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
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
              width={this.state.computedValue}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
