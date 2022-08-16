const console = require('console');

function prepare(color, ...logs) {
  const aLogs = [];
  for (const element of logs) {
    aLogs.push(`\x1b${color}`);
    aLogs.push(typeof element === 'object' ? JSON.stringify(element, null, 2) : element);
  }
  aLogs.push('\x1b[0m');
  console.log(...aLogs);
}
const log = {};

log.black = (...logs) => prepare('[30m', ...logs);
log.red = (...logs) => prepare('[31m', ...logs);
log.green = (...logs) => prepare('[32m', ...logs);
log.yellow = (...logs) => prepare('[33m', ...logs);
log.blue = (...logs) => prepare('[34m', ...logs);
log.magenta = (...logs) => prepare('[35m', ...logs);
log.cyan = (...logs) => prepare('[36m', ...logs);
log.white = (...logs) => prepare('[37m', ...logs);

module.exports = log;
