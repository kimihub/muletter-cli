'use strict';

const MailDev = require('maildev');
const MuLetter = require('../muletter-cmd.js');
const fs = require('fs');
const cmd = process.argv[2];
const arg = process.argv[3];
var config, body, list, maildev;

config = `
smtp_host: localhost
smtp_port: 1025
smtp_ignoreTLS: true,
letter_from: expeditor@provider.com
letter_subject: letter test
`;

body = `
lorem ipsum doloris
`;

list = `expeditor@provider.com
expeditor2@provider.com
expeditor3@provider.com
expeditor4@provider.com
expeditor2@provider.com
expeditor3@provider.com
expeditor4@provider.com
expeditor2@provider.com
expeditor3@provider.com
expeditor4@provider.com
expeditor2@provider.com
expeditor3@provider.com
expeditor4@provider.com
expeditor2@provider.com
expeditor3@provider.com
expeditor4@provider.com
expeditor2@provider.com
expeditor3@provider.com
expeditor4@provider.com
expeditor2@provider.com
expeditor3@provider.com
expeditor4@provider.com
expeditor2@provider.com
expeditor3@provider.com
expeditor4@provider.com
expeditor2@provider.com
expeditor3@provider.com
expeditor4@provider.com
expeditor2@provider.com
expeditor3@provider.com
expeditor4@provider.com
expeditor2@provider.com
expeditor3@provider.com
expeditor4@provider.com
expeditor2@provider.com
expeditor3@provider.com
expeditor4@provider.com
expeditor2@provider.com
expeditor3@provider.com
expeditor4@provider.com
`;

// add config letter & smtp files
fs.writeFileSync('config.yml', config);
fs.writeFileSync('body.txt', body);
fs.writeFileSync('list.txt', list);

// maildev
maildev = new MailDev({
 outgoingHost: 'localhost',
 outgoingPort: 1025,
});
maildev.listen(() => {
  if (!cmd) process.exit();
  if (cmd === 'test' && arg) {
    maildev.on('new', function(email){
      console.log(email);
      process.exit();
    });
    MuLetter[cmd](arg);
    return;
  } 
  if (cmd === 'tail' || cmd === 'init') {
    MuLetter[cmd](process.exit);
  } else {
    MuLetter[cmd](() => {
      setTimeout(() => {
        maildev.getAllEmail((err, emails) => {
          if (err) return console.log(err);
          console.log('There are %s emails received', emails.length);
          process.exit();
        });
      }, 1000);
    })
  }
});

