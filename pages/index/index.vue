<template>
	<view class="content">
		<u-cell-group>
			<u-cell-item v-for="(item,index) in dataList" :key="index" :arrow="false">
				<view class="u-flex" style="text-align: left;" @click.stop="onDetail">
					<image :src="item.img" mode="aspectFill"
						style="width: 100rpx;height: 100rpx;border-radius: 8rpx;margin-right: 20rpx;"></image>
					<view class="u-flex-1">
						<view class="u-font-30">{{item.name}}</view>
						<view class="u-flex u-row-between">
							<text style="color: #FA3534">￥{{item.price}}</text>
							<button class="uni-button" @click.stop="addCart(item, index)">
								<uni-icons type="plusempty" size="15"></uni-icons>
							</button>
						</view>
					</view>
				</view>
			</u-cell-item>
		</u-cell-group>
		<view class="cart-box" id="cart">
			<uni-badge class="uni-badge-left-margin" :text="count" absolute="rightTop" size="small">
				<uni-icons type="cart-filled" size="50" @click="onShop"></uni-icons>
			</uni-badge>
		</view>
		<ParabalaBall ref="Ball"></ParabalaBall>
	</view>
</template>

<script>
	import ParabalaBall from '@/components/gu-parabola-ball/ParabolaBall.vue'
	export default {
		components: {
			ParabalaBall
		},
		data() {
			return {
				count: 0,
				endLocation: {},
				shopData: [], //存储数据
				dataList: [{
						id: 1,
						gid: 47,
						type: '老百姓大药房',
						name: "莲花清瘟",
						img: "../../static/logo.png",
						gsId: 72,
						price: 37.55,
						number: 0,
						stock: 193,
						selected: false
					},
					{
						id: 2,
						gid: 45,
						type: '老百姓大药房',
						name: "生脉饮",
						img: "../../static/logo.png",
						gsId: 65,
						price: 22.95,
						number: 0,
						stock: 77,
						selected: false
					},
					{
						id: 3,
						gid: 45,
						type: '老百姓大药房',
						name: "六叶地黄丸",
						img: "../../static/logo.png",
						gsId: 65,
						price: 43.56,
						number: 0,
						stock: 77,
						selected: false
					},
					{
						id: 4,
						gid: 31,
						type: '怡心大药房',
						name: "丽珠得乐",
						img: "../../static/logo.png",
						gsId: 50,
						price: 22.44,
						number: 0,
						stock: 78,
						selected: false
					},
					{
						id: 5,
						gid: 35,
						type: '怡心大药房',
						name: "三九胃泰",
						img: "../../static/logo.png",
						gsId: 56,
						price: 33.45,
						number: 0,
						stock: 97,
						selected: false
					},
					{
						id: 6,
						gid: 35,
						type: '怡心大药房',
						name: "金花液体钙",
						img: "../../static/logo.png",
						gsId: 56,
						price: 346.77,
						number: 0,
						stock: 97,
						selected: false
					}
				],
				indexList: [],
				storageData: []
			}
		},
		onLoad() {
			this.$nextTick(() => {
				uni.createSelectorQuery().select('#cart').boundingClientRect(res => {
					const {
						windowTop
					} = uni.getSystemInfoSync()
					this.endLocation = {
						x: res.left + uni.upx2px(120) / 2,
						// #ifdef H5
						y: res.top + windowTop,
						// #endif
						// #ifndef H5
						y: res.top,
						// #endif
					}
				}).exec()
			})

		},
		methods: {
			onDetail() {
				uni.navigateTo({
					url: '/pages/index/shop_detail'
				})
			},
			onShop() {
				uni.switchTab({
					url: '/pages/index/shop'
				})
			},
			addCart(item, index) {
				// #ifdef H5item
				// const {
				// 	windowTop
				// } = uni.getSystemInfoSync()
				// detail.y += windowTop
				// // #endif
				// this.$refs.Ball.showBall({
				// 	start: detail,
				// 	end: this.endLocation
				// }).then(() => {
				this.count++
				this.indexList.push(index)
				let obj = {};
				this.indexList.forEach(element => {
					if (obj[element]) {
						obj[element]++;
					} else {
						obj[element] = 1;
					}
				});
				if (this.shopData.find(info => info.id === item.id)) {
					// this.shopData.push(item)
				} else {
					this.shopData.push(item)
				}
				uni.setStorageSync('shopData', this.shopData)
				uni.setStorageSync('total', obj)
				// })
			}

		}
	}
</script>

<style lang="scss">
	.content {
		padding: 20px 10px;
		box-sizing: border-box;
	}

	.cart-box {
		position: fixed;
		z-index: 10;
		right: 40rpx;
		bottom: 40rpx;
	}

	.u-flex {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 10px;
	}

	.u-flex-1 {
		flex: 1;
	}

	uni-image {
		width: 55px;
		height: 55px;
	}

	.u-font-30 {
		color: #909399;
		font-size: 16px;
	}

	.uni-button {
		line-height: 23px;
		height: 23px;
		width: 35px;
		font-size: 13px;
		padding: 0;
		color: #fff;
		background-color: #007aff !important;
		border-radius: 5px;
		cursor: pointer;
		position: relative;
		box-sizing: border-box;
		text-align: center;
		margin: 0;
	}

	.uniui-plusempty {
		color: #fff !important;
	}

	.u-row-between {
		display: flex;
		justify-content: space-between;
	}
</style>
