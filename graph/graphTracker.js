/** @format */

google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawVisualization);
google.charts.load("current", { packages: ["line"] });
google.charts.setOnLoadCallback(drawVisualization);

function drawVisualization() {
  let finalData = [];
  fetch(
    "https://api.quarantine.country/api/v1/spots/month?region=" + countryFeedKey
  ).then((res) => {
    res.json().then((data) => {
      for (var single in data.data) {
        let dates = [];
        let month = new Date(single).toLocaleString("default", {
          month: "short",
        });
        let xyz = new Date(single).getUTCDate() + "-" + month;

        dates.push(xyz);
        let x = 0;
        for (var temp in data.data[single]) {
          if (x != 4) {
            dates.push(data.data[single][temp]);
          } else {
            break;
          }
          x++;
        }
        finalData.push(dates);
      }
      ///////////////////////////////////

      var data = new google.visualization.DataTable();
      data.addColumn("string", "Month");
      data.addColumn("number", "Total Cases");
      data.addColumn("number", "Deaths");
      data.addColumn("number", "Recovered");
      data.addColumn("number", "Critical");
      data.addRows(finalData.reverse());

      var options = {
        vAxis: { title: "Numbers" },
        seriesType: "bars",
        series: { 5: { type: "line" } },
        width: data.getNumberOfRows() * 65,
        bar: { groupWidth: 40 },
      };

      var lineChart = new google.charts.Line(
        document.getElementById("chart_div")
      );
      lineChart.draw(data, google.charts.Line.convertOptions(options));

      var barChart = new google.visualization.ComboChart(
        document.getElementById("barChart")
      );
      barChart.draw(data, options);
    });
  });
}

google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);
function drawChart() {
  fetch(
    "https://api.quarantine.country/api/v1/summary/region?region=" +
      countryFeedKey
  ).then((res) => {
    res.json().then((data) => {
      var data = google.visualization.arrayToDataTable([
        ["Task", "Hours per Day"],
        ["critical", data.data.summary.critical],
        ["deaths", data.data.summary.deaths],
        ["recovered", data.data.summary.recovered],
        // ["tested", 244778],
        ["total_cases", data.data.summary.total_cases],
      ]);

      var options = {
        title: "Covid 19",
        width: "100%",
        height: "100%",
        slices: {
          4: { offset: 0.2 },
          12: { offset: 0.3 },
          14: { offset: 0.4 },
          15: { offset: 0.5 },
        },
      };

      var chart = new google.visualization.PieChart(
        document.getElementById("donut_chart")
      );
      chart.draw(data, options);
    });
  });
}
