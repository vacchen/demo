import config from './config.js'
import http from './http.js'

function pay(payType, merchantOrderNo, amount, desc, _this) {

	let uri = config.payUri
	let params = {
		payType: payType,
		merchantOrderNo: merchantOrderNo,
		amount: amount,
		description: desc,
	}
	
	if(_this.paying) {
		console.log(merchantOrderNo + " is paying ")
		return
	}
	_this.paying = true
	http.post(uri, params, '支付请求中...').then(data => {
		if(data.urlScheme) {
			plus.runtime.openURL(data.urlScheme)
		} else {
			uni.showToast({
				title:'支付失败 ' + data.msg,
				icon: 'none',
				duration: 5000
			})
			//支付失败无需发起查询交易
			_this.paying = false
		}
	}).catch((e) => {
		//下单失败或网络异常，可再次发起下单
		console.log("pay catch error "+JSON.stringify(e))
		_this.paying = false
	}).finally(() => {
	})
}

//orderDate=yyyyMMdd
function query(merchantOrderNo, orderDate, _this, callBack) {

	let uri = config.queryUri
	let params = {
		merchantOrderNo: merchantOrderNo,
		orderDate: orderDate,
	}
	
	http.post(uri, params, '支付查询中...').then(data => {
		if(data.resp === '0000' && data.orderState === '03') {
			uni.showToast({
				title: '支付成功-'+data.amount+'元-'+data.merchantOrderNo,
				icon: 'none',
				duration: 5000
			})
			_this.showPay = false
		} else {
			uni.showToast({
				title: '支付结果:'+(data.msg?data.msg:'支付失败'),
				icon: 'none',
				duration: 5000
			})
		}
		//查询完成后，如失败可再次发起支付
	    _this.paying = false
		callBack(data)
	}).catch((e) => {
		//查询订单失败，可再次发起下单；但查询网络异常，需再次发起查询
		console.log("query catch error "+JSON.stringify(e))
		callBack(e)
	}).finally(() => {
	})
}

module.exports={
	pay:pay,
	query:query,
}