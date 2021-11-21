const ical = require('ical-generator');
const moment = require('moment');
const cal = ical({ domain: 'github.com', name: 'my first iCal' });
function getIcal(startDate, endDate) {
    cal.createEvent({
        start: moment(startDate),
        end: moment(endDate).add(1, 'hour'),
        summary: 'Example Event',
        description: 'It works ;)',
        location: 'my room',
        url: 'http://sebbo.net/'
    });
    return cal.toString();
}

module.exports = { getIcal };