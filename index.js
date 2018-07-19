#!/usr/bin/env node
const cliTable = require('cli-table3');
const whoshome = require('whoshome')();
const _ = require('lodash');

whoshome.then(function (people) {
  printTable(people);
}).catch(function (err) {
  console.log(err);
});


function printTable(people) {
  const wifiHeader = ['hostname', 'ip', 'uptime', 'tx', 'rx', 'quality'];

  let wifiPeople = _(people)
      .filter((p) => typeof p.wifi != 'undefined')
      .map((person) =>
           _.map(['hostname', 'ip', 'wifi.uptime', 'wifi.tx', 'wifi.rx', 'wifi.quality'], (keyPath) => _.get(person, keyPath)))
      .value();

  let wiredPeople = _(people)
      .filter((p) => typeof p.wifi == 'undefined')
      .map((person) =>
           _.map(['hostname', 'ip'], (keyPath) => _.get(person, keyPath)))
      .map((arr) => _.concat(arr, ['', '', '', '']))
      .value();

  let table = new cliTable({head: wifiHeader, chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''}});
  wifiPeople.forEach((p) => table.push(p));
  wiredPeople.forEach((p) => table.push(p));
  console.log(table.toString());
}
