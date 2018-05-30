const fs = require('fs')
const path = require('path')
const isStream = require('is-stream')
const request = require('request')
const _upload = Symbol('_upload')

class Captcha {
	constructor(opts) {
		this.state = {
			user_name: opts.username,
			user_pw: opts.password,
			yzmtype_mark: opts.type || 1013,
		}
	}
	/**
	 * 验证码识别
	 * @param {Stream|String} imgSrc 图片流或图片地址
	 * @param {Int} type 识别类型
	 * @memberof Captcha
	 */
	recon(imageSrc, type) {
		return new Promise((resolve, reject) => {
			if (!this.state.user_name || !this.state.user_pw) {
				return reject(new Error('username and password is required!'))
			}
			if (isStream(imageSrc)) {
				this[_upload]({
					imgSteam: imageSrc
				}).then(res => resolve(res))
					.catch(err => reject(err))
			} else {
				// load img from remote
				request(imageSrc)
					.pipe(fs.createWriteStream(__dirname + '/_1.png'))
					.on('close', () => {
						this[_upload]({
							imgSteam: fs.createReadStream(__dirname + '/_1.png')
						}).then(res => resolve(res))
							.catch(err => reject(err))
					}).on('error', err => {
						reject(err)
					})
			}
		})
	}

	/**
	 * 错误上报
	 * @param {Int} reportID - 识别 ID
	 * @returns 
	 * @memberof Captcha
	 */
	report(reportID) {
		return new Promise((resolve, reject) => {
			if (!this.state.user_name || !this.state.user_pw) {
				return reject(new Error('username and password is required!'))
			}
			if (reportID) return reject(new Error('reportID is required!'))
			request({
				method: 'POST',
				url: 'http://v1-http-api.jsdama.com/api.php?mod=php&act=error',
				formData: {
					'user_name': this.state.user_name,
					'user_pw': this.state.user_pw,
					'yzm_id': reportID,
				},
				headers: {
					'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
					'Content-Type': 'multipart/form-data'
				},
				encoding: 'utf8'
			}, (err, res, body) => {
				if (err) {
					reject(err)
				} else {
					let decodeBody = unescape(body.replace(/\\u/g, '%u'))
					resolve(decodeBody)
				}
			})
		})
	}
	[_upload]({ imgSteam, type = 1013 } = {}) {
		return new Promise((resolve, reject) => {
			request({
				method: 'POST',
				url: 'http://v1-http-api.jsdama.com/api.php?mod=php&act=upload',
				formData: {
					'user_name': this.state.user_name,
					'user_pw': this.state.user_pw,
					'yzmtype_mark': type,
					'upload': imgSteam
				},
				headers: {
					'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
					'Content-Type': 'multipart/form-data'
				},
				encoding: 'utf8'
			}, (err, res) => {
				if (err) {
					reject(err)
				} else {
					const resp = JSON.parse(unescape(res.body.replace(/\\u/g, '%u')))
					// resp.result:true
					if (resp.result) {
						resolve({
							reportID: resp.data.id,
							value: resp.data.val
						})
					} else {
						reject(resp.data)
					}
				}
			})
		})
	}
}

module.exports = Captcha