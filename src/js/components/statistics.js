import AbstractComponent from "./abstract-component.js";
import moment from "moment";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";

const DEFAULT_DATE_VALUE = [moment(Date.now()).format(`DD MMM`), moment(Date.now()).add(7, `days`).format(`DD MMM`)];

class Statistics extends AbstractComponent {
  constructor() {
    super();
    this._tasks = [];
    this._sortedTasks = [];
    this._defaultDate = DEFAULT_DATE_VALUE;

    this._daysChartCtx = this.getElement().querySelector(`.statistic__days`);
    this._tagsChartCtx = this.getElement().querySelector(`.statistic__tags`);
    this._colorChartCtx = this.getElement().querySelector(`.statistic__colors`);

    this._daysChart = null;
    this._tagsChart = null;
    this._colorChart = null;

    this._flatpickerInput = flatpickr(this.getElement().querySelector(`.statistic__period-input`), {
      allowInput: false,
      mode: `range`,
      defaultDate: this._defaultDate,
      dateFormat: `d M`,
      locale: {
        rangeSeparator: ` - `
      }
    });
    this._onDateInputChange();
  }

  getTemplate() {
    return `<section class="statistic container">
      <div class="statistic__line">
        <div class="statistic__period">
          <h2 class="statistic__period-title">Task Activity DIAGRAM</h2>

          <div class="statistic-input-wrap">
            <input
              class="statistic__period-input"
              type="text"
              placeholder="${this._defaultDate.join(` - `)}"
            />
          </div>

          <p class="statistic__period-result">
            In total for the specified period
            <span class="statistic__task-found">0</span> tasks were fulfilled.
          </p>
        </div>
        <div class="statistic__line-graphic">
          <canvas class="statistic__days" width="550" height="150"></canvas>
        </div>
      </div>

      <div class="statistic__circle">
        <div class="statistic__tags-wrap">
          <canvas class="statistic__tags" width="400" height="300"></canvas>
        </div>
        <div class="statistic__colors-wrap">
          <canvas class="statistic__colors" width="400" height="300"></canvas>
        </div>
      </div>
    </section>`;
  }

  hide() {
    this.getElement().classList.add(`visually-hidden`);
    this._clearCharts(this._daysChart, this._tagsChart, this._colorChart);
  }

  show(tasks, isDateChange = false) {
    if (tasks.length === 0) {
      this._setVisibility(`add`, this._daysChartCtx, this._tagsChartCtx, this._colorChartCtx);
      this.getElement().querySelector(`.statistic__task-found`).textContent = tasks.length;
      return;
    } else {
      this._setVisibility(`remove`, this._daysChartCtx, this._tagsChartCtx, this._colorChartCtx);
    }

    if (!isDateChange) {
      this._flatpickerInput.clear();
      this.getElement().querySelector(`.statistic__period-input`).value = this._defaultDate.join(` - `);
    }

    this._tasks = isDateChange ? this._tasks : tasks.filter(({isArchive}) => isArchive);
    this._sortedTasks = tasks.filter(({isArchive}) => isArchive);

    this.getElement().classList.remove(`visually-hidden`);
    this.getElement().querySelector(`.statistic__task-found`).textContent = this._sortedTasks.length;

    this._createDaysChart();
    this._createTagsChart();
    this._createColorChart();
  }

  _createLineChart(container, labels, chartData) {
    return new Chart(container, {
      plugins: [ChartDataLabels],
      type: `line`,
      data: {
        labels,
        datasets: [{
          data: chartData,
          backgroundColor: `transparent`,
          borderColor: `#000000`,
          borderWidth: 1,
          lineTension: 0,
          pointRadius: 8,
          pointHoverRadius: 8,
          pointBackgroundColor: `#000000`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 8
            },
            color: `#ffffff`
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              display: false
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }],
          xAxes: [{
            ticks: {
              fontStyle: `bold`,
              fontColor: `#000000`
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }]
        },
        legend: {
          display: false
        },
        layout: {
          padding: {
            top: 10
          }
        },
        tooltips: {
          enabled: false
        }
      }
    });
  }

  _createPieChart(name, container, labels, chartData, colors = false) {
    return new Chart(container, {
      plugins: [ChartDataLabels],
      type: `pie`,
      data: {
        labels,
        datasets: [{
          data: chartData,
          backgroundColor: colors ? colors : [`#ff3cb9`, `#ffe125`, `#0c5cdd`, `#000000`, `#31b55c`]
        }]
      },
      options: {
        plugins: {
          datalabels: {
            display: false
          }
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const allData = data.datasets[tooltipItem.datasetIndex].data;
              const tooltipData = allData[tooltipItem.index];
              const total = allData.reduce((acc, it) => acc + parseFloat(it));
              const tooltipPercentage = Math.round((tooltipData / total) * 100);
              return `${tooltipData} TASKS — ${tooltipPercentage}%`;
            }
          },
          displayColors: false,
          backgroundColor: `#ffffff`,
          bodyFontColor: `#000000`,
          borderColor: `#000000`,
          borderWidth: 1,
          cornerRadius: 0,
          xPadding: 15,
          yPadding: 15
        },
        title: {
          display: true,
          text: `DONE BY: ${name.toUpperCase()}`,
          fontSize: 16,
          fontColor: `#000000`
        },
        legend: {
          position: `left`,
          labels: {
            boxWidth: 15,
            padding: 25,
            fontStyle: 500,
            fontColor: `#000000`,
            fontSize: 13
          }
        }
      }
    });
  }

  _createDaysChart() {
    const dayChartLabels = [...new Set(this._sortedTasks
      .map(({dueDate}) => moment(dueDate).format(`DD MMM`)))]
      .sort((a, b) => a > b ? 1 : -1);
    const dayChartData = dayChartLabels.reduce((acc, label) => {
      const filteredByLabelTasks = this._sortedTasks.filter(({dueDate}) => moment(dueDate).format(`DD MMM`) === label);
      const labelData = filteredByLabelTasks.length;

      acc.push(labelData);
      return acc;
    }, []);

    this._daysChart = this._createLineChart(this._daysChartCtx, dayChartLabels, dayChartData);
  }

  _createTagsChart() {
    const tagsChartLabels = [...new Set(this._sortedTasks.reduce((acc, {tags}) => [...acc, ...tags], []))];
    const tagsChartData = tagsChartLabels.reduce((acc, label) => {
      const tagCount = this._sortedTasks.filter(({tags}) => tags.has(label)).length;

      acc.push(tagCount);
      return acc;
    }, []);

    this._tagsChart = this._createPieChart(`tags`, this._tagsChartCtx, tagsChartLabels, tagsChartData);
  }

  _createColorChart() {
    const colorChartLabels = [...new Set(this._sortedTasks.reduce((acc, {color}) => [...acc, color], []))];
    const colorChartData = colorChartLabels.reduce((acc, label) => {
      const colorCount = this._sortedTasks.filter(({color}) => color === label).length;

      acc.push(colorCount);
      return acc;
    }, []);

    this._colorChart = this._createPieChart(`color`, this._colorChartCtx, colorChartLabels, colorChartData, colorChartLabels);
  }

  _clearCharts(...charts) {
    charts.forEach((chart) => {
      if (chart) {
        chart.destroy();
      }
    });
  }

  _onDateInputChange() {
    this.getElement().querySelector(`.statistic__period-input`).addEventListener(`change`, () => {
      const dateItems = this.getElement().querySelector(`.statistic__period-input`).value.split(` - `);

      if (dateItems.length === 1) {
        return;
      }

      const dateValues = dateItems.map((date) => moment(date, `DD MMM`));
      const sortedByDateTasks = this._tasks.filter(({dueDate}) => moment(dueDate).isBetween(...dateValues, null, `[]`));

      this._clearCharts(this._daysChart, this._tagsChart, this._colorChart);
      this.show(sortedByDateTasks, true);
    });
  }

  _makeDateFromValue(dateValues, format) {
    return dateValues.map((date) => moment(date, format));
  }

  _setVisibility(operation, ...elems) {
    switch (operation) {
      case `add`:
        elems.forEach((elem) => {
          elem.classList.add(`visually-hidden`);
        });
        break;
      case `remove`:
        elems.forEach((elem) => {
          elem.classList.remove(`visually-hidden`);
        });
        break;
    }
  }
}

export default Statistics;
