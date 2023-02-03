<template>
	<view class="container">
		<pay ref="pay"></pay>
		<car-list ref="mycar" :carList="carList" @allSelBtn="allSelBtn" @selShop="selShop" @selGoods="selGoods"
			@jsCars="jsCars" @jsbtn="jsbtn" @delbtn="delbtn" @changeNum="changeNum"></car-list>
	</view>
</template>

<script>
	import carList from '@/components/car-list/car-list.vue'
	import pay from "@/components/meta-pay/pay.vue"
	export default {
		components: {
			carList,
			pay
		},
		data() {
			return {
				maskTitle: '',
				carList: []
			}
		},
		onLoad() {
			let data = uni.getStorageSync('shopData')
			let total = uni.getStorageSync('total')
			data.forEach((item, index) => {
				item.number = total[index]
			})
			this.carList = data
		},
		onShow() {

		},
		methods: {
			confirm: function() { //确定按钮
				console.log('您点击了确定按钮');
			},
			cancel: function() { //取消按钮
				console.log('您点击了取消按钮');
			},
			selGoods: function(carList) {
				var that = this;
				that.carList = carList;
			},
			selShop: function(carList) {
				var that = this;
				that.carList = carList;
			},
			allSelBtn: function(carList) {
				var that = this;
				that.carList = carList;
			},
			randomNum(n) {
				var t=''
				for(var i=0;i<n;i++) { 
					t += Math.floor(Math.random()*10)
				}
				return t
			},
			jsCars: function(ids) { //结算按钮
				// var that = this;
				// console.log(ids);
				// var that = this;
				/* 
				 跳转结算页面
				*/
				this.merchantOrderNo = 'MON' + this.randomNum(8)
				this.$refs.pay.pay(this.merchantOrderNo, this.amount, this.productDesc)
			},
			delbtn: function(ids, list) { //删除按钮
				var that = this;
				/* 
				 请求接口数据

				*/
				for (let i = 0; i < list.length; i++) {
					for (let k = 0; k < list[i].glist.length; k++) {
						if (list[i].glist[k].selected == true) {
							list[i].glist.splice(k, 1);
							k--
						}
					}
					if (list[i].glist.length == 0) { //若当前店铺商品删除完，删除当前店铺
						list.splice(i, 1);
						i--
					}
				}
				that.carList = list;

				that.$refs.mycar.getAllMount(list); //计算价格展示
			},
			changeNum: function(number, carList, gIndex, price, id, type) {
				var that = this;
				/* 
				 请求接口数据

				*/
				if (type == 0) {
					console.log(number)
					carList[gIndex].number = number - 1;
				} else {
					carList[gIndex].number = number + 1;
				}
				console.log(carList)
				that.carList = carList;
				that.$refs.mycar.getAllMount(carList); //计算价格展示
			}
		},
		onReachBottom() {

		},
		onShareAppMessage() {

		}
	}
</script>

<style scoped>
	page {
		background: #f5f5f5;
	}

	view,
	textarea,
	input,
	text,
	button {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
		font-size: 28rpx;
		font-family: "微软雅黑";
	}

	.uni-checkbox-input {
		border-radius: 50% !important;
	}

	.container {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		background: #f5f5f5;
		overflow: hidden;
	}

	.line1 {
		overflow: hidden;
		text-overflow: ellipsis;
		display: box;
		display: -webkit-box;
		line-clamp: 1;
		box-orient: vertical;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		word-break: break-all;
		/* 英文换行问题 */
	}

	.line2 {
		overflow: hidden;
		text-overflow: ellipsis;
		display: box;
		display: -webkit-box;
		line-clamp: 2;
		box-orient: vertical;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-all;
		/* 英文换行问题 */
	}

	.centerboth {
		display: flex;
		display: -webkit-flex;
		align-items: center;
		-webkit-align-items: center;
		justify-content: center;
		-webkit-justify-content: center;
	}

	.clearfix:after {
		content: "";
		display: block;
		visibility: hidden;
		height: 0;
		clear: both;
	}

	.clearfix {
		zoom: 1;
	}

	image {
		padding: 0;
		margin: 0;
	}

	textarea {
		width: 300rpx;
		height: 75rpx;
		display: block;
		position: relative;
		font-size: 28rpx;
	}

	button::after {
		border: none;
	}

	input:-ms-input-placeholder {
		color: #808080;
	}

	car-list {
		width: 100%;
	}
</style>
