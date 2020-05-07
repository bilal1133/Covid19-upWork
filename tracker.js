/**
 * /*
 * Available Spots and Summary:
 * Total Cases, Active Cases, Deaths, Recovered, Tested, Critical, Change Ratio %, Summary
 * Historical data:
 * Day, Week, Month, Year, Change per Day, Difference, Summary
 * Regions:
 * World, Regions and Countries
 *
 * Read documentation for more functionality - https://rapidapi.com/Yatko/api/coronavirus-live
 * See all available countries - https://api.quarantine.country/api/v1/summary/latest
 *
 * @format
 */

var countryFeedKey = "pakistan"; //try china, spain, italy, etc.
var countryName = "Pakistan"; //try 中国, España, Italia, etc.
let liveUpdate = true;
function fetchYesterdayData(params) {
  fetch(
    "https://api.quarantine.country/api/v1/spots/month?region=" + countryFeedKey
  ).then((res) => {
    res.json().then((data) => {
      const obj = {
        summary: Object.values(data.data)[1],
      };
      fillPlaceholders(obj);
    });
  });
}

function handleYesterday() {
  document.getElementById("info_label").innerHTML = "Yesterday UPDATES";
  fetchYesterdayData();
  liveUpdate = false;
}

function ready(cb) {
  if (document.readyState !== "loading") {
    cb();
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      cb();
    });
  }
}

function fetchData(url) {
  return fetch(url)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function (payload) {
      return payload["data"] || {};
    });
}

function formatNumber(number, precision, separate, separator, comma) {
  if (!number) {
    return "";
  }

  var re =
      "\\d(?=(\\d{" +
      (separate || 3) +
      "})+" +
      (precision > 0 ? "\\D" : "$") +
      ")",
    num = number.toFixed(Math.max(0, ~~precision));

  return (comma ? num.replace(".", comma) : num).replace(
    new RegExp(re, "g"),
    "$&" + (separator || ",")
  );
}

function fillPlaceholders(data) {
  var i;
  var varEl = document.querySelectorAll("[data-var-placeholder]");

  for (i = 0; i < varEl.length; i++) {
    var placeholder = varEl[i].getAttribute("data-var-placeholder");

    if (placeholder && placeholder != "") {
      switch (placeholder) {
        case "country":
          varEl[i].innerText = countryName;
          break;
      }
    }
  }

  var countryPlaceholderEl = document.querySelectorAll(
    "[data-country-placeholder]"
  );
  for (i = 0; i < countryPlaceholderEl.length; i++) {
    var placeholder = countryPlaceholderEl[i].getAttribute(
      "data-country-placeholder"
    );

    if (placeholder && placeholder != "" && data["summary"][placeholder]) {
      countryPlaceholderEl[i].innerText = parseInt(
        data["summary"][placeholder]
      ).toLocaleString();
    }
  }
  let ratio = formatNumber(
    data["summary"]["recovery_ratio"] * 100,
    2,
    false,
    ",",
    false
  );

  document.getElementById("recovery_ratio").style.width = `${ratio}%`;
  document.getElementById("recovery_ratio").innerHTML = ratio;
  let dRatio = formatNumber(
    data["summary"]["death_ratio"] * 100,
    2,
    false,
    ",",
    false
  );

  document.getElementById("death_ratio").style.width = `${dRatio}%`;
  document.getElementById("death_ratio").innerHTML = dRatio;
}

ready(function () {
  var url =
    "https://api.quarantine.country/api/v1/summary/region?region=" +
    countryFeedKey;
  fetchData(url).then(fillPlaceholders);

  setInterval(function () {
    if (liveUpdate) {
      fetchData(url).then(fillPlaceholders);
    }
  }, 10000);
});
