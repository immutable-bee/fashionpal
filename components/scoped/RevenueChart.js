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
    const revenue = dateGroup.map(
      (group) => props.chartData.statsByGroup[group].revenue || 0
    );

    return {
      computedValue: this.computeValue(isMobile),
      options: {
        chart: {
          id: "basic-bar",
          toolbar: {
            show: false,
          },
        },
        xaxis: {
          categories: dateGroup,
        },
        plotOptions: {
          bar: {
            dataLabels: {
              position: "top",
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
        yaxis: {
          min: 0,
          labels: {
            formatter: function (value) {
              const formattedValue = value.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
              const roundedValue = parseFloat(formattedValue).toFixed(0);
              return "$" + roundedValue; // Display one digit after the decimal point
            },
          },
        },
        dataLabels: {
          enabled: false,
          offsetY: -20,
          style: {
            fontSize: "12px",
            colors: ["#304758"],
          },
        },
      },
      series: [
        {
          name: "Revenue",
          data: revenue,
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
