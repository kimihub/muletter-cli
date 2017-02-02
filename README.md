# µLetter
**MuLetter** is a Command Line Interface newsletter for small mailing list

## Requirements

- [Nodejs v4](https://nodejs.org)
- SMTP server

## Install or Update

First of all, you must install `muletter` as a global module to create the `muletter` command on your system.

    npm install -g muletter

or

    npm install -g git+https://github.com/kimihub/muletter


## Configuration

For each mailing list you want to manage you have to create a working directory and put inside a file named `config.yml` with your SMTP server and letter configuration.

Note that if already you use [MuList](https://github.com/kimihub/mulist) to manage your mailing list, the existing working directory can be the same for MuLetter. In that case, you just have to to fill your existing `config.yml` file.

Example of `config.yml`:

    smtp_user: username
    smtp_password: password
    smtp_host: smtp.hostname.com
    smtp_ssl: true
    letter_from: letter name <username@hostname.com>
    letter_subject: subject letter

If you use a service included in [nodemailer-wellknown](https://github.com/nodemailer/nodemailer-wellknown) module you can simply fill `smtp_service` instead of 'smtp_host' and 'smtp_ssl':

    smtp_user: username
    smtp_password: password
    smtp_service: Godaddy
    letter_from: letter name <username@hostname.com>
    letter_subject: subject letter


Once `config.yml` is created you should be able to use the `muletter` command in your working directory.

## SMTP Limitations

Using a SMTP server with a standard configuration is strongly advised to make sure that your letter to not be seen as a junk mail. 

SMTP of free mailbox services are too limited to send such a number of mails in the same day. But some of them should be enough for a letter with a low frequency and a small mailing list.

Example of SMTP you can use freely :

- gmail.com (lower than 500 mails per day)
- gandi.net (5 mails per minute, the other ones are queued and sent later)
- godaddy.com (1000 mails per day)

## Mailing List, Body, Attachments

The mailing list, body and attachments must be in the working directory named `list.txt`, `body.txt` (or `body.html`) and `attachments/*.*`.

For the body you can use html syntax with mail limitations. You have to put all attachments in the sub-directory `attachments`.

Example of `list.txt`:

    user@host1.com
    user2@host2.com
    user3@host3.com
    ...

## Commands usage help

    $ muletter

    Usage: muletter [options] [command] [argument]
    Commands 
      init              Check config.yml list.txt body.txt attachments
      test   <email>    Send the letter to <email>
      send              Send the letter to list.txt
      help   [command]  Output usage information of [command]
      [...]

