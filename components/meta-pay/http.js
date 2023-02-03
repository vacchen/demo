import config from './config.js'
import tool from './tool.js'

const request = (uri, method, params) => {
	
	params = params ? params : {}
    params.merchantNo = config.merchantNo
    params.time = tool.yyyyMMddhhmmss(new Date())
	params.sign = tool.getSign(params, config.key)
	
	let url = config.payUrl + uri
	console.log("url: "+url)
	console.log("req: "+JSON.stringify(params))
	
    return new Promise(function (resolve, reject) {
      uni.request({
        url: url,
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: method,
        data: params,
        success(res) {
			let data = res.data || {}
			console.log("res:"+JSON.stringify(data))
			resolve(data)
        },
        fail(res) {
            uni.showToast({title: '请求失败：网络异常',icon:'none',duration:2000})
			reject({
				resp: 'E026',
				msg: '请求失败：网络异常'
			})
        },
        complete() {
          uni.hideLoading()
        }
      })
    })
}

const get = (uri, params) => {
  return request(uri, 'GET', params)
}

const post = (uri, params, tips) => {
	

	if (tips) {
		uni.showLoading({title:tips})
	}
	
	return request(uri, 'POST', params)
}

module.exports={
	get:get,
	post:post,
}