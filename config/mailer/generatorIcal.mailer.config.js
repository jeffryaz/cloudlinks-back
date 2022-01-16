const ical = require("ical-generator");
const moment = require("moment");
function getIcal(startDate, endDate) {
  const cal = ical({ domain: "github.com", name: "my first iCal" });
  cal.createEvent({
    start: moment(startDate),
    end: moment(endDate).add(1, "hour"),
    summary: "Example Event",
    description: "It works ;)",
    location: "my room",
    url: "http://sebbo.net/",
  });
  return cal.toString();
}

module.exports = { getIcal };
