require('dotenv').config();
const moment = require('moment');
const fs = require('fs');
const csv = require('csv');
const PATH = './logs.csv';

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const stringifier = csv.stringify();
const writableStream = fs.createWriteStream(PATH, {encoding: 'utf-8'});
stringifier.pipe(writableStream);
let count = 0;

// Set range for log getting.
const startTime = moment('2018-10-01T00:00:00+09:00');
const endTime = moment('2018-10-30T23:59:59+09:00');

client.calls.each({
    startTimeBefore: endTime.utc().format(),
    startTimeAfter: startTime.utc().format()
}, call => {
    let output = {};
    output.start_time = moment(call.startTime).utcOffset(+9).format("YYYY-MM-DD HH:mm:ss");
    output.end_time = moment(call.endTime).utcOffset(+9).format("YYYY-MM-DD HH:mm:ss");
    output.duration = call.duration;
    output.from = call.from;
    output.to = call.to;
    output.status = call.status;
    output.price = Math.abs(call.price);
    console.log(++count);
    stringifier.write(output);
});