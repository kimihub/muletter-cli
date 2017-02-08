#!/usr/bin/env node

'use strict';
const MuletterCmd   = require('./muletter-cmd');
const MuletterHelp  = require('./muletter-help');
const cmd = process.argv[2];
const arg = process.argv[3];

// no cmd or option
if (!cmd) {
  console.log(MuletterHelp.main);
  process.exit();
}

// output help option
if (['-h', '--help'].indexOf(cmd) !== -1) {
  console.log(MuletterHelp.main);
  process.exit();
}

// output version option
if (['-V', '--version'].indexOf(cmd) !== -1) {
  console.log(MuletterHelp.version);
  process.exit();
}

if ('init' === cmd) {

  if (arg) {
    console.log(MuletterHelp.init);
    process.exit(); 
  }

  MuletterCmd.init(process.exit);

}

if ('test' === cmd) { 

  if (!arg) {
    console.log(MuletterHelp.test);
    process.exit();
  }

  MuletterCmd.test(arg, process.exit);
  
}

if ('send' === cmd) {
  
  if (arg) {
    console.log(MuletterHelp.send);
    process.exit(); 
  }

  MuletterCmd.send(process.exit);

}

if ('tail' === cmd) {
  
  if (arg) {
    console.log(MuletterHelp.tail);
    process.exit(); 
  }

  MuletterCmd.tail(process.exit);

}

// output help arg[cmd]
if ('help' === cmd) {
  
  if (!arg || !MuletterHelp[arg]) {
    console.log(MuletterHelp.main);
    process.exit();
  } 

  console.log(MuletterHelp[arg]);
  process.exit();

}
