<template>
	<view class="page">
		<!-- <pay ref="pay"></pay> -->
		<view class="pay-view">
			<view class="product-view">
				<text class="product-text1">商品：</text>
				<input class="product-amt" v-model="productDesc"/>
			</view>
			<view class="product-view">
				<text class="product-text1">金额：</text>
				<input class="product-amt" type="digit" v-model="amount"/>
				<text class="product-text2">元</text>
			</view>
			<view class="button-pay" @click="goToPay">去支付</view>
		</view>
	</view>
</template>

<script>
	
	// import pay from "@/components/meta-pay/pay.vue"
	
	export default {
		// components: { pay },
		data() {
			return {
				merchantOrderNo: '',
				amount: '0.01',
				productDesc: '20年茅台酒',
			}
		},
		onLoad() {
		},
		onShow() {
			
			//适当的位置做一次订单结果查询
			if(this.$refs.pay) {
				this.$refs.pay.query(function(resp) {
					console.log('query order resp:'+JSON.stringify(resp))
				})
			}
		},
		methods: {
			randomNum(n) {
				var t=''
				for(var i=0;i<n;i++) { 
					t += Math.floor(Math.random()*10)
				}
				return t
			},
            goToPay() {
				this.merchantOrderNo = 'MON'+this.randomNum(8)
				this.$refs.pay.pay(this.merchantOrderNo, this.amount, this.productDesc)
            },
		}
	}
</script>

<style lang="scss" scoped>
	
	.page {
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 750rpx;
	}
	
	.pay-view {
		width: 600rpx;
		height: 350rpx;
		margin: 0 auto;
		margin-top: 300rpx;
		padding-top: 30rpx;
		background: #f5f5f5;
		border-radius: 10rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.product-view {
		display: flex;
		flex-direction: row;
		width: 600rpx;
		height: 100rpx;
		
		.product-text1 {
			width: 200rpx;
			height: 60rpx;
			line-height: 60rpx;
			text-align: right;
		}
		.product-amt {
			width: 270rpx;
			height: 60rpx;
			text-align: right;
			padding-right: 15rpx;
			background: #ffffff;
			border-radius: 1rpx;
		}
		.product-text2 {
			margin-left: 20rpx;
			height: 60rpx;
			line-height: 60rpx;
			width: 100rpx;
		}
	}
	
	.button-pay {
		margin-top: 20rpx;
		width: 220rpx;
		height: 80rpx;
		background: #fc2b55;
		border-radius: 10rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #ffffff;
		font-size: 36rpx;
		font-weight: 400;
	}
	.button-pay:active {
		background: #fc8a8c;
	}
	
</style>
