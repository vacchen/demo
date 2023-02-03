<template>
	<!-- <view v-if="showPay" class="page"> -->
	<uni-popup ref="popup" type="dialog">
		<view class="pay-view">
			<radio-group class="pay-type-group">
				<view class="pay-type" @click="changeTo('wechat')">
					<radio :value="'wechat'" :checked="payType==='wechat'" />
					<image class="pay-type-img" src="@/static/images/wechat.png"></image>
					<text class="pay-type-text">微信支付</text>
				</view>
				<view class="pay-type" @click="changeTo('alipay')">
					<radio :value="'alipay'" :checked="payType==='alipay'" />
					<image class="pay-type-img" src="@/static/images/alipay.png"></image>
					<text class="pay-type-text">支付宝</text>
				</view>
			</radio-group>
			<view class="button">
				<view class="button-pay" @click="payConfirm">
					<text class="button-pay-text">确认付款</text>
				</view>
				<view class="button-cancle" @click="payCancle">
					<text class="button-cancle-text">取消</text>
				</view>
			</view>
		</view>
	</uni-popup>
	<!-- </view> -->
</template>

<script>
	import pay from './pay.js'
	import tool from './tool.js'

	export default {
		components: {},
		data() {
			return {
				showPay: false,
				payType: 'wechat',
				paying: false,
				merchantOrderNo: '',
				orderDate: '',
				amount: 0,
				productDesc: '',
			}
		},
		onLoad() {},
		onShow() {},
		computed: {},
		watch: {},
		methods: {
			changeTo(payType) {
				this.payType = payType;
			},
			pay(merchantOrderNo, amount, productDesc) {
				// this.showPay = true
				this.$refs.popup.open()
				this.merchantOrderNo = merchantOrderNo
				this.orderDate = tool.yyyyMMdd(new Date())
				this.amount = amount
				this.productDesc = productDesc
			},
			async payConfirm() {
				// if (this.loading == true) {
				// 	return;
				// }
				// this.loading = true;

				uni.showLoading({
					title: '支付处理中...'
				});

				 try {
				 // 从开发者服务器创建订单
					// const orderId = await this.createOrder({
					//   productId: this.productId
					// });

					// 请求苹果支付
					 const transaction = await this._iap.requestPayment({
						productid: this.productId,
						manualFinishTransaction: true,
						// username: username + orderId //根据业务需求透传参数，关联用户和订单关系
					});

					// 在此处请求开发者服务器，在服务器端请求苹果服务器验证票据
					await this.validatePaymentResult({
					  orderId: orderId,
					  username: username,
					  transactionReceipt: transaction.transactionReceipt, // 不可作为订单唯一标识
					  transactionIdentifier: transaction.transactionIdentifier
					});

					// 验证成功后关闭订单
					await this._iap.finishTransaction(transaction);

					// 支付成功
				} catch (e) {
					uni.showModal({
						content: e.message,
						showCancel: false
					});
				} finally {
					this.loading = false;
					uni.hideLoading();
				}
			},
			payCancle() {
				if (this.paying) return
				// this.showPay = false
				this.$refs.popup.close()
			},
			query(callBack) {
				//如果还是支付中状态，则可发起查询交易
				//如果未发起支付，则不会查询，亦不会回调
				if (this.paying) {
					pay.query(this.merchantOrderNo, this.orderDate, this, callBack)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: #000000;
		opacity: 0.85;
	}

	.pay-view {
		width: 600rpx;
		height: 400rpx;
		margin-left: 75rpx;
		padding-top: 30rpx;
		background: #f5f5f5;
		border-radius: 10rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.pay-type-group {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.pay-type {
		margin-top: 5rpx;
		width: 400rpx;
		height: 100rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		border-bottom: 1rpx dashed #c4c4c4;
		border-radius: 10rpx;
	}

	.pay-type:active {
		background: #ffffff;
		border-bottom: 1rpx solid #f5f5f5;
	}

	.pay-type-img {
		margin-left: 15rpx;
		width: 50rpx;
		height: 50rpx;
	}

	.pay-type-text {
		margin-left: 15rpx;
		color: #383838;
		font-size: 35rpx;
	}

	.button {
		margin-top: 50rpx;
		display: flex;
		flex-direction: row;
	}

	.button-pay {
		width: 220rpx;
		height: 80rpx;
		background: #fc2b55;
		border-radius: 10rpx;
		display: flex;
		justify-content: center;
		align-items: center;

		.button-pay-text {
			color: #ffffff;
			font-size: 36rpx;
			font-weight: 400;
		}
	}

	.button-pay:active {
		background: #fc8a8c;
	}

	.button-cancle {
		margin-left: 30rpx;
		margin-top: 20rpx;
		width: 120rpx;
		height: 60rpx;
		background: #bdbdbd;
		border-radius: 8rpx;
		display: flex;
		justify-content: center;
		align-items: center;

		.button-cancle-text {
			color: #636363;
			font-size: 32rpx;
			font-weight: 300;
		}
	}

	.button-cancle:active {
		background: #888888;
	}
</style>
