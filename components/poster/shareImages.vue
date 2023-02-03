<template>
	<view class="share-canvas">
		<canvas :canvas-id="canvasID" :style="{width:canvasWidth+'rpx',height:canvasHeight+'rpx'}"></canvas>
		<view v-if="qrCode == ''">
			<QRCode ref="qrcode" />
		</view>
	</view>
</template>

<script>
	import QRCode from "../qr_code/qrcode.vue"
	var _this;
	export default {
		name: 'canvas-images',
		props: {
			// canvasID 等同于 canvas-id
			canvasID: {
				Type: String,
				default: 'shareCanvas'
			},
			canvasWidth: { // 画布宽度
				Type: 'int',
				default: 375
			},
			canvasHeight: { // 画布高度
				Type: 'int',
				default: 500
			},
			shareImageBg: { // 分享图片
				Type: 'String',
				default: 'https://seopic.699pic.com/photo/50083/9002.jpg_wh1200.jpg'
			},
			qrSize: { // 二维码大小
				Type: 'int',
				default: 100
			},
			qrUrl: { // 生成二维码的链接
				Type: 'String',
				default: '我要吃饭'
			},
			shopImg: { // 商品图
				Type: 'String',
				default: 'https://seopic.699pic.com/photo/50020/9197.jpg_wh1200.jpg'
			},
			codeNum: { // 福码数
				Type: 'String',
				default: '总数：200'
			},
			tip: {
				Type: 'String',
				default: '长按识别二维码'
			},
			price: {
				Type: 'String',
				default: '¥ 37.55'
			},
			goodsName: {
				Type: "String",
				default: '连花清瘟胶囊'
			}
		},
		components: {
			QRCode
		},
		data() {
			return {
				qrCode: '', // 二维码
				shopImgs: "",
				shareImageBgs:''
			}
		},
		mounted() {
			_this = this;
		},
		methods: {
			// 创建二维码
			canvasCreate() {
				_this.$refs.qrcode.make({
						size: _this.qrSize,
						text: _this.qrUrl
					})
					.then(res => {
						// 返回的res与uni.canvasToTempFilePath返回一致
						_this.qrCode = res.tempFilePath;
						_this.onCanvas();
					});
			},
			//同步转换网络图片
			getImgs(type) {
				let imgSrc = type == 'bg' ?  _this.shareImageBg : _this.shopImg
				return new Promise((resolve, reject) => {
					uni.getImageInfo({
						src: imgSrc,
						success: res => {
							resolve(res.path)
						}
					})
				})
			},
			// 画图
			async onCanvas() {
				uni.showLoading({
					title: "分享图片生成中..."
				});

				let widthBg = uni.upx2px(_this.canvasWidth) //背景图高
				let heightBg = uni.upx2px(_this.canvasHeight) //背景图宽

				const ctx = uni.createCanvasContext(_this.canvasID, _this);
				
				// 设置 canvas 背景色
				ctx.fillRect(0, 0, _this.canvasWidth, _this.canvasHeight);
				
				// 背景图片
				_this.shareImageBgs = await _this.getImgs('bg')
				ctx.drawImage(_this.shareImageBgs, 0, 0, widthBg, heightBg);
				
				//商品图
				_this.shopImgs = await _this.getImgs('shop')
				ctx.drawImage(_this.shopImgs, uni.upx2px(120), uni.upx2px(236), uni.upx2px(358), uni.upx2px(358))

				// 二维码
				ctx.drawImage(_this.qrCode, uni.upx2px(30), uni.upx2px(660), uni.upx2px(160), uni.upx2px(160));

				//福码数
				ctx.setFillStyle('#333333')
				ctx.setFontSize(uni.upx2px(22))
				ctx.fillText(_this.codeNum, uni.upx2px(400), uni.upx2px(782))

				//提示
				ctx.setFontSize(uni.upx2px(20))
				ctx.fillText(_this.tip, uni.upx2px(40), uni.upx2px(844))

				//总价
				ctx.setFontSize(uni.upx2px(26))
				ctx.fillText(_this.price, uni.upx2px(206), uni.upx2px(782))

				//商品名
				_this.canvasTextAutoLine(ctx, _this.goodsName, uni.upx2px(206), uni.upx2px(700), uni.upx2px(36), uni
					.upx2px(364), 2)


				// 延迟后渲染至canvas上
				let pic = await _this.setTime(ctx)
				_this.$emit('success', pic);
				_this.qr_code = '';
			},
			canvasTextAutoLine(ctx, content, drawX, drawY, lineHeight, lineMaxWidth, lineNum) {
				let drawTxt = ''; // 当前绘制的内容
				let drawLine = 1; // 第几行开始绘制
				let drawIndex = 0; // 当前绘制内容的索引

				// 判断内容是否可以一行绘制完毕
				if (ctx.measureText(content).width <= lineMaxWidth) {
                    ctx.fillText(content, drawX, drawY);
				} else {
					for (let i = 0; i < content.length; i++) {
						drawTxt += content[i];
						if (ctx.measureText(drawTxt).width >= lineMaxWidth) {
							if (drawLine >= lineNum) {
								ctx.fillText(content.substring(drawIndex, i) + '..', drawX, drawY);
								break;
							} else {
								ctx.fillText(content.substring(drawIndex, i + 1), drawX, drawY);
								drawIndex = i + 1;
								drawLine += 1;
								drawY += lineHeight;
								drawTxt = '';
							}
						} else {
							// 内容绘制完毕，但是剩下的内容宽度不到lineMaxWidth
							if (i === content.length - 1) {
								ctx.fillText(content.substring(drawIndex), drawX, drawY);
							}
						}
					}
				}

			},
			// 彻底改成同步 防止拿到的图片地址为空
			setTime(ctx) {
				return new Promise((resole, err) => {
					setTimeout(() => {
						ctx.draw(false, async () => {
							let pic = await _this.getNewPic();
							resole(pic)
						});
					}, 600)
				})
			},
			// 获取新的图片地址
			getNewPic() {
				return new Promise((resolve, errs) => {
					setTimeout(() => {
						uni.canvasToTempFilePath({
							canvasId: _this.canvasID,
							quality: 1,
							complete: (res) => {
								// 在H5平台下，tempFilePath 为 base64
								// 关闭showLoading
								uni.hideLoading();
								//  储存海报地址  也是分享的地址
								resolve(res.tempFilePath)
							}
						}, _this);
					}, 200)
				})
			},
		},
		mounted() {
			_this = this;
		}
	}
</script>
<style lang="less" scoped>
	.share-canvas {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		top: 100rpx;
	}
</style>
