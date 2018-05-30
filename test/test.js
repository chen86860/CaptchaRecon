const Captcha = require('captcha-rec')
const captcha = new Captcha({
  username: '',    // Lianzhong username
  password: '',    // Lianzhong password
  type: ''         // CAPTCHA type
}) 

// 1.using local file
const fs = require('fs')
captcha.recon(fs.createReadStream('test.png')).then(result => {
  console.log('recon result', result.value)
  // report ID: result.reportId
}).catch(err => {
  console.error('err', err)
})

// 2. using remote images
captcha.recon('https://example.com/test.png').then(result => {
  console.log('recon result:', result.value)
  // report ID: result.reportId
}).catch(err => {
  console.error('err', err)
})