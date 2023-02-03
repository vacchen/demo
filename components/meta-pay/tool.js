import { sha256 } from './sha256.min.js';

function randomNum(n){ 
	var t=''
	for(var i=0;i<n;i++){ 
		t+=Math.floor(Math.random()*10)
	} 
	return t
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function yyyyMMdd(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('') 

}

function yyyyMMddhhmmss(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('')  + [hour, minute, second].map(formatNumber).join('')
}

function getSign(params, key) {
	//使用sha256进行签名
	let signSrc = ""
	signSrc+=("merchantNo="+params.merchantNo)
	if(params.merchantOrderNo) signSrc+=("&merchantOrderNo="+params.merchantOrderNo)
	if(params.amount) signSrc+=("&amount="+params.amount)
	if(params.orderDate) signSrc+=("&orderDate="+params.orderDate)
	signSrc+=("&time="+params.time)
	signSrc+=("&key="+key)
	return sha256(signSrc)
}


module.exports = {
  randomNum:randomNum,
  yyyyMMdd:yyyyMMdd,
  yyyyMMddhhmmss:yyyyMMddhhmmss,
  getSign: getSign,
}