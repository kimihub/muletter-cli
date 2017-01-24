# µLetter
**MuLetter** is a Command Line Interface newsletter for small mailing list

## Minimum requirements

- [Nodejs v4](https://nodejs.org)
- A mailing list

## Install

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


Once `config.yml` is created you should be able to use the `muletter` command in your working directory.

## SMTP Limitations

Using a SMTP server with a standard configuration and your own domain is strongly advised to make sure that your letter will not be seen as a junk mail by free mailbox services like Gmail, Yahoo or Outlook. 

Plus, SMTP of these free services are too limited to send such a number of mails in the same day. 

You'll also have limitations with the SMTP of your registrar or web hosting but it should be enough for a letter with a small frequency and a small mailing list (in most of case, **lower than 500 mails per day**).

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

