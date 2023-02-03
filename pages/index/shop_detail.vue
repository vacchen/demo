<template>
	<view class="poster">
	商品详情页面
		<shareImages ref="canvas" :canvasWidth="canvasWidth" :canvasHeight="canvasHeight" :goodsTitle="goodsTitle"
			:qrSize="qrSize" :qrUrl="qrUrl" @success="shareSuccess">
		</shareImages>
		<view class="button">
			<button :disabled="canvasImages == '' ? false : true" type="primary"
				@click="createsShareImage">生成海报</button>
			<!-- <button :disabled="canvasImages != '' ? false : true" @click="previewHandle">预览海报</button> -->
		</view>
		<button class="submit" @click="saveImg">保存图片</button>
	</view>
</template>

<script>
	import shareImages from '@/components/poster/shareImages.vue'
	export default {
		components: {
			shareImages
		},

		data() {
			return {
				canvasImages: '',
				canvasWidth: 600, // 宽度
				canvasHeight: 864, // 高度
				goodsTitle: '我是这张图片的标题我是这张图片的标题我是这张图片的标', // 商品宣传标题
				qrSize: 100, // 二维码大小
				qrUrl: '我要吃饭了', // 生成二维码的链接
			}
		},
		methods: {
			// 生成分享图片
			createsShareImage() {
				// console.log(this.$refs.canvas)
				this.$refs.canvas.canvasCreate();
			},
			// 预览图片
			previewHandle() {
				uni.previewImage({
					urls: [this.canvasImages],
				});
			},
			// 回调图片地址
			shareSuccess(e) {
				// console.log('地址',e)
				this.canvasImages = e
				console.log(e);
			},
			// 分享
			onShareAppMessage(res) {
				// if (res.from === 'button') {
				//  console.log(res.target)
				// }
				return {
					title: 'canvas图片分享',
					path: this.canvasImages
				}
			},
			saveImg() {
				//url:网络地址

				// 先下载图片
				uni.downloadFile({
					url: this.canvasImages,
					success: (res) => {
						console.log(res)
						// 获取到图片本地地址后再保存图片到相册（因为此方法不支持远程地址）
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: () => {
								uni.showToast({
									title: "保存成功！",
								});
							},
							fail: () => {
								uni.showToast({
									title: "保存失败",
								});
							},
						});
					},
				});


			}

		}
	}
</script>

<style lang="less" scoped>
	.poster {

		// position: fixed;
		// left: 0;
		// top: 0;
		// right: 0;
		// bottom: 0;
		// background-color: rgba(0, 0, 0, 0.5);
		.button {
			position: absolute;
			bottom: 100rpx;
		}
		.submit {
			position: absolute;
			bottom: 0rpx;
		}
	}
</style>
