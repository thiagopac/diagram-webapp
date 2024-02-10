
import * as log from 'loglevel';
const prefix = require('loglevel-plugin-prefix');

prefix.reg(log);
prefix.apply(log, {
  format(level: string, name: any, timestamp: any) {
    return `[${timestamp}] ${level} ${name}:`;
  }
});

export function getLogger(service: string) {
  const ret = log.getLogger(service);
  ret.setLevel('INFO');
  return ret;
}
