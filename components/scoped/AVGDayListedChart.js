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
    const averageDaysListed = dateGroup.map(
      (group) => props.chartData.statsByGroup[group].averageDaysListed || 0
    );

    return {
      computedValue: this.computeValue(isMobile),
      options: {
        chart: {
          id: "line-chart",
        },
        xaxis: {
          categories: dateGroup,
        },
        yaxis: {
          min: 0,
          labels: {
            formatter: function (value) {
              return value.toFixed(0); // Display one digit after the decimal point
            },
            style: {
              fontSize: "12px", // Adjust the font size as needed
            },
          },
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
