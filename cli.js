#!/usr/bin/env node

import minimist from 'minimist'
import moment from 'moment-timezone'
import fetch from 'node-fetch'

const args = minimist(process.argv.slice(2))

if(args.h) {
  let helptext = `Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.`
  process.stdout.write(helptext)
  process.exit()
}

const timezone = args.z || moment.tz.guess()
const latitude = args.n || (-1 * args.s)
const longitude = args.e || (-1 * args.w)

const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&daily=weathercode,precipitation_hours&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=' + timezone)
const data = await response.json()

if (args.j) {
  process.stdout.write(JSON.stringify(data, null, 2))
  process.exit()
}

var day;
if (args.d == null) {
  day = 1
} else {
  day = args.d
}
let day_phrase = ""
if (day > 1) {
  day_phrase = 'in ' + day + ' days.\n'
}
else if (day) {
  day_phrase = 'tomorrow.\n'
}
else {
  day_phrase = 'today.\n'
}

if (data.daily.precipitation_hours[day]) {
  process.stdout.write('You might need your galoshes ' + day_phrase)
} else {
  process.stdout.write('You will not need your galoshes ' + day_phrase)
}