'use strict';

const fs          = require('fs');
const path        = require('path');
const nodemailer  = require('nodemailer');
const red   = s => (`\x1b[38;5;01m${s}\x1b[0m`);
const green = s => (`\x1b[38;5;02m${s}\x1b[0m`);
const fail  = (code, msg)  => console.error(`${red(code)} ${msg}`);
const done  = s => console.log(`${green('✓')} ${s}`);

var transporter, transporterOptions = {}, letterOptions = {}, letterList = [], letterListFail = [], cursor = 0, lockpath, logpath, filelog = [];

const init = (cb, test) => { 

  const cwd = process.cwd();
  const workdirpath = path.resolve(cwd, '.muletter');
  const listpath = path.resolve(cwd, 'list.txt');
  const configpath = path.resolve(cwd, 'config.yml');
  const textpath = path.resolve(cwd, 'body.txt');
  const htmlpath = path.resolve(cwd, 'body.html');
  const attachpath = path.resolve(cwd, 'attachments');
  let config = {}, errors = 0;  

  // create working directory
  if (!fs.existsSync(workdirpath)) {
    fs.mkdirSync(workdirpath);
  }

  lockpath = path.resolve(workdirpath, 'lockfile');
  if (fs.existsSync(lockpath)) {
    fail('ERR', 'A letter is sending');
    process.exit(1);
  }

  if (!fs.existsSync(configpath)) {
    fail('ERR', 'config.yml is missing');
    errors++;
  } else {
    // parse YAML
    let multiple = false;
    fs.readFileSync(configpath, 'utf8').split('\n').forEach(line => {
      let arrayLine = line.split(':');
      if (multiple && (arrayLine[0].indexOf('\t') !== -1 || arrayLine[0].indexOf('  ') !== -1)) {
        config[multiple][arrayLine[0].replace('\t','').trim()] = arrayLine[1].trim();
      } else {
        multiple = false;
        if (arrayLine[0] && arrayLine[1]) {
          let index, value;
          index = arrayLine[0].trim();
          value = arrayLine[1].trim();
          if (value === '') {
            multiple = index;
            config[index] = {}; 
          } else {
            config[index] = value;
          }
        }
      }
    });

    if (!config.letter_from) {
      errors++;
      fail('ERR', '`letter_from` is not defined in config.yml');
    } 

    if (!config.letter_subject) {
      errors++;
      fail('ERR', '`letter_subject` is not defined in config.yml');
    }

    if (!config.smtp_service && !config.smtp_host) {
      errors++;
      fail('ERR', '`smtp_service` or `smtp_host` are not defined in config.yml');
    }
  }

  if (!test) {
    if (!fs.existsSync(listpath)) {
      fail('ERR', 'list.txt is missing');
      errors++;
    }
    else {
      letterList = fs.readFileSync(listpath, 'utf8').trim('\n').split('\n');

      if (letterList.length === 0) {
        fail('ERR', 'list.txt is empty');
        errors++;   
      } else {
        done(`list.txt: ${letterList.slice(0,10)}[...]`);
      }
    }
  }

  if (!fs.existsSync(textpath) && !fs.existsSync(htmlpath)) {
    fail('ERR', 'body.txt or body.html is missing');
    errors++;
  }

  if (fs.existsSync(textpath)) {
    letterOptions.text = fs.createReadStream(textpath, 'utf8');
    done(`body.txt`);
  }

  if (fs.existsSync(htmlpath)) {
    letterOptions.html = fs.createReadStream(htmlpath, 'utf8');
    done(`body.html`);
  }

  if (fs.existsSync(attachpath)) {
    letterOptions.attachments = fs.readdirSync(attachpath).map(file => {
      done('attachment: ' + file);
      return {
        filename: file,
        path: path.resolve(attachpath, file)
      }
    });
  }

  if (errors > 0) {
    process.exit(1);
  }

  // letter options
  letterOptions.from = config.letter_from;
  done(`from: ${letterOptions.from}`);
  letterOptions.subject = config.letter_subject;
  done(`subject: ${letterOptions.subject}`);

  // logpath
  logpath = path.resolve(workdirpath, 'logs.txt');

  // SMTP options
  Object.keys(config).forEach(param => {
    if (param.indexOf('smtp_') !== -1) {
      transporterOptions[param.slice(5)] = config[param];
    }
  });
  if (!test) transporterOptions.pool = true;

  // verify smtp configuration
  transporter = nodemailer.createTransport(transporterOptions);
  console.log('Verifying SMTP...');
  transporter.verify((error, success) => {
    if (error) {
      fail('ERR', error);
      process.exit(1);
    } else {
      done(`SMTP server`);
      // trigger all Signal Events
      process.on('SIGINT', () => { process.exit() });
      process.on('SIGILL', () => { process.exit() });
      process.on('SIGHUP', () => { process.exit() });
      process.on('SIGBREAK', () => { process.exit() });
      process.on('exit', () => {
        if (cursor > 0) {
          let list = letterListFail.concat(letterList.slice(cursor));
          fs.writeFileSync(listpath, list.join('\n'));
          if (filelog.length > 0) {
            fs.writeFileSync(logpath, filelog.join('\n'));
          }
        }
        if (fs.existsSync(lockpath)) fs.unlinkSync(lockpath);
      });
      if (cb) cb();
    }
  });
}

module.exports.init = init;

module.exports.test = (email, cb) => {
  init(() => {
    letterOptions.to = email;
    transporter.sendMail(letterOptions, (error, info) => {
      if (error) {
        fail('ERR', error);
        process.exit(1);
      } else {
        done(`Response: ${info.response}`);
        if (cb) cb();
      }
    })
  }, true);
}

module.exports.send = cb => {
  init(() => {
    const stdin = process.stdin;
    console.log('Send this letter to all address of [list.txt] ? Yes-No[Default]');
    stdin.resume();
    stdin.setEncoding('utf8');
    stdin.on('data', key => {
      if (key.toLowerCase().indexOf('yes') === -1) {
        process.exit();
      }
      fs.writeFileSync(lockpath, '');
      letterList.forEach((email, i) => {
        letterOptions.to = email;
        transporter.sendMail(letterOptions, (error, info) => {
          cursor++;
          if (error) {
            letterListFail.push(email);
            filelog.push(error);
            fail('ERR', error);
          } else {
            done(email);
          }
          if ((cursor === letterList.length) && cb) {
            cb();
          }
        })
      });
    });
  });
}

module.exports.tail = cb => {
  const logspath = path.resolve(process.cwd(), '.muletter/logs.txt');
  if (fs.existsSync(logspath)) {
    console.log(fs.readFileSync(logspath, 'utf8')); 
  }
  if (cb) cb();
}
