#!/usr/bin/env node

'use strict';

const program = require('commander');
const config = require('./package');
console.error = (arg1, arg2) => console.warn(arg1?`\x1b[38;5;01m${arg1}\x1b[0m`:'', arg2? arg2:'');

program
  .description(config.description)
  .usage('[options] [command] [argument]')
  .version(config.version)
  .command('init', 'Check config.yml, list.txt, body.(txt|html) and *.(jpg|png|pdf|zip...) as attachments ')
  .command('send', 'Send the letter after running `init` command')
  .on('--help', () => {
    console.log('  Example of config.yml:', '\n');
    console.log('    smtp_host: smtp.provider.com');
    console.log('    smtp_user: username');
    console.log('    smtp_password: 620f921w0212z4');
    console.log('    letter_from: from@provider.com');
    console.log('    letter_subject: this is the subject');
    console.log('\n');
  })
  
  .parse(process.argv);

if (process.argv[2] === 'init') { 
  process.exit();
}

if (process.argv[2] === 'send') { 
  process.exit();
}
