# CAPTCHA Recognition using Node.js

> Base on Lianzhong CAPTCHA Recognition online [Lianzhong](https://www.jsdati.com/) using Node.js to break CAPTCHA.

## Requirements

This module requires a minimum of Node v6.9.0

## Getting Started
To begin, you'll need to install `captcha-recon`:
``` bash
npm i captcha-recon 
// or yarn add captcha-recon
```
using in Node.js
``` javascript
const Captcha = require('captcha-recon')
const captcha = new Captcha({
  username: '',    // Lianzhong username, see below [Options](## Options)
  password: '',    // Lianzhong password, see below
  type: ''         // CAPTCHA type, see below
}) 

// 1.using local file
const fs = require('fs')
captcha.recon(fs.createReadStream('test.png')).then(result => {
  console.log('recon result', result.value)
  // report ID result.reportId
}).catch(err => {
  console.error('err', err)
})

// 2. using remote images
captcha.recon('https://example.com/test.png').then(result => {
  console.log('recon result', result.value)
  // report ID result.reportId
}).catch(err => {
  console.error('err', err)
})
```

## Options

- `username` Lianzhong username, you should register on the websites [Lianzhong](https://www.jsdati.com/)
- `password`  Lianzhong password, you should register on the websites [Lianzhong](https://www.jsdati.com/)
- `type`   CAPTCHA type, see [Type and Price](https://www.jsdati.com/docs/price)

## API

- captcha.recon(imgSrc, type)
  - `imgSrc` image src or image eadStream
  - `type`   CAPTCHA type
  - return `<Promise>`

The main method to recognition the CAPTCHA.

- captcha.report(reportId)
  - `reportId` CAPTCHA reportId
  - return `<Promise>`

If the recognition result no correct, you can report the result to the Lianzhong, help them to correction the result.