<template>
	<template>
		<view>
			<view class="content">
				<homePage v-if="currentPage == 0"/>
				<monitorPage v-if="currentPage == 1"/>
				<fundPage v-if="currentPage == 2"/>
				<stragePage v-if="currentPage == 3"/>
				<myPage v-if="currentPage == 4" />
			</view>
			<view class="tabbar" :style="{'padding-bottom': paddingBottomHeight + 'rpx'}">
			<!-- <view class="tabbar"> -->
				<view class="tabbar-item" v-for="(item, index) in list" :key="index" @click="tabbarChange(index)">
					<image class="item-img" :src="item.icon_a" v-if="currentPage == index"></image>
					<image class="item-img" :src="item.icon" v-else></image>
					<view class="item-name" :class="{'tabbarActive': currentPage == index}" v-if="item.text">{{item.text}}
					</view>
				</view>
			</view>
		</view>
	</template>
</template>

<script>
	export default {
		props: {
			pagePath: null
		},
		data() {
			return {
				page: 'contact',
				showPage: false,
				containerHeight: 400,
				tabbar: [{
						"pagePath": "/pages/index/index",
						"iconPath": "static/tabBar/index.png", //未选中tab图标路径
						"selectedIconPath": "static/tabBar/index_active.png", //选中tab图标路径
						"text": "首页",
					},
					{
						"pagePath": "/pages/mine/mine",
						"iconPath": "static/tabBar/mine.png", //未选中tab图标路径
						"selectedIconPath": "static/tabBar/mine_active.png", //选中tab图标路径
						"text": "个人中心",
					}
				]
			};
		},
		onLoad() {
			console.log(this.pagePath)
		},
		methods: {
			changeTab(item) {
				let currentPage = item.pagePath;
				uni.showLoading({
					title: '正在加载...'
				})
				uni.redirectTo({
					url: currentPage,
					success: (e) => {
						uni.hideLoading();
					},
					fail: (e) => {
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.uni-tabbar {
		position: fixed;
		bottom: 0;
		z-index: 999;
		width: 100%;
		height: 6%;
		display: flex;
		justify-content: space-around;
		
		padding: 7rpx 0;
		box-sizing: border-box;
		background-color: #fff;
		box-shadow: 0px 10px 20px 0px rgba(75, 51, 100, 0.05);
 
		.uni-tabbar__item {
			display: flex;
			flex-direction: column;
			.uni-tabbar__bd { // tabBar单项
				.uni-tabbar__icon { // tabBar图标
					width: 54rpx;
					height: 83rpx;
					img {
						width: 100%;
						height: 100%;
					}
				}
			}
 
			.uni-tabbar__label { // tabBar文字
				font-size: 22rpx;
				font-family: $PF-SC-Rfamily;
				font-weight: 400;
				color: #D8DCE7;
				text-align: center;
				&.active {
					background-image: linear-gradient(to right,#1CFDF1, #B330FF);
					background-image: -moz-linear-gradient(to right, #1CFDF1, #B330FF);
					background-image: -webkit-linear-gradient(to right, #1CFDF1, #B330FF);
					background-image: -ms-linear-gradient(to right, #1CFDF1, #B330FF);
					font-size: 22rpx;
					-webkit-background-clip: text;
					-moz-background-clip: text;
					background-clip: text;
					box-decoration-break: clone;
					-webkit-box-decoration-break: clone;
					-moz-box-decoration-break: clone;
					color: transparent;
					position: relative;
				}
			}
		}
 
		// .uni-tabbar__icon {
		// 	height: 42upx;
		// 	line-height: 42upx;
		// 	text-align: center;
		// }
 
		.icon {
			display: inline-block;
		}
 
		// .uni-tabbar__label {
		// 	line-height: 24upx;
		// 	font-size: 24upx;
		// 	color: #999;
 
		// 	&.active {
		// 		color: #1ca6ec;
		// 	}
		// }
	}
</style>
