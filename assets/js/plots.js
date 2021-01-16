var apiKey = "KabeYsRnXHxChZ4JxTtz";;

/**
 * Helper function to select stock data
 * Returns an array of values
 * @param {array} rows
 * @param {integer} index
 * index 0 - Date
 * index 1 - Open
 * index 2 - High
 * index 3 - Low
 * index 4 - Close
 * index 5 - Volume
 */
function unpack(rows, index) {
  return rows.map(function(row) {
    return row[index];
  });
}

function getMonthlyData() {
    // Queries the QUANDL API, then upacks the data results and calls `buildTable()`
    
    var queryUrl = `https://www.quandl.com/api/v3/datasets/WIKI/AMZN.json?start_date=2017-01-01&end_date=2018-11-22&collapse=monthly&api_key=${apiKey}`;

    // use d3 to request the json, then parse the data
    d3.json(queryUrl).then(function(data) {
        var dates = data.dataset.data.map(row => row[0]);
        var openPrices = data.dataset.data.map(row => row[1]);
        var highPrices = data.dataset.data.map(row => row[2]);
        var lowPrices = data.dataset.data.map(row => row[3]);
        var closePrices = data.dataset.data.map(row => row[4]);
        var volume = data.dataset.data.map(row => row[5]);

        buildTable(dates, openPrices, highPrices, lowPrices, closePrices, volume);
    });
}

function buildTable(dates, openPrices, highPrices, lowPrices, closingPrices, volume) {
  var table = d3.select("#summary-table");
  var tbody = table.select("tbody");
  var trow;
  for (var i = 0; i < 12; i++) {
    trow = tbody.append("tr");
    trow.append("td").text(dates[i]);
    trow.append("td").text(openPrices[i]);
    trow.append("td").text(highPrices[i]);
    trow.append("td").text(lowPrices[i]);
    trow.append("td").text(closingPrices[i]);
    trow.append("td").text(volume[i]);
  }
}

function buildPlot() {
  var apiKey = "KabeYsRnXHxChZ4JxTtz";
  var url = `https://www.quandl.com/api/v3/datasets/WIKI/AMZN.json?start_date=2017-01-01&end_date=2018-11-22&api_key=${apiKey}`;

  d3.json(url).then(function(data) {

    // @TODO: Grab Name, Stock, Start Date, and End Date from the response json object to build the plots
    var name = data.dataset.name;
    var stock = data.dataset.dataset_code;
    var startDate = data.dataset.start_date;
    var endDate = data.dataset.end_date;
    // Print the names of the columns
    console.log(data.dataset.column_names);
    // Print the data for each day
    console.log(data.dataset.data);

    // @TODO: Unpack the dates, open, high, low, and close prices
    // Use map() to build an array of the the dates
    var dates = data.dataset.data.map(row => [0])
    // Use map() to build an array of the closing prices
    var closingPrices = data.dataset.data.map(row => row[4])

    getMonthlyData();

    // Closing Scatter Line Trace
    var trace1 = {
      type: "scatter",
      mode: "lines",
      name: name,
      x: dates,
      y: closingPrices,
      line: {
        color: "#17BECF"
      }
    };

    // Candlestick Trace
    var trace2 = {
      type:'candlestick',
      name:'candlestick data',
      x: data.dataset.data.map(row => row[0]),
      high: data.dataset.data.map(row => row[2]),
      low: data.dataset.data.map(row => row[3]),
      open: data.dataset.data.map(row => row[1]),
      close: data.dataset.data.map(row => row[4]),
    }

    var data = [trace1, trace2];

    var layout = {
      title: `${stock} closing prices`,
      xaxis: {
        range: [startDate, endDate],
        type: "date"
      },
      yaxis: {
        autorange: true,
        type: "linear"
      },
      showlegend: false
    };

    Plotly.newPlot("plot", data, layout);

  });
}

buildPlot();
