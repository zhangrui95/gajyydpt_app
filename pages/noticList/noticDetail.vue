<template>
	<view style="height: 100vh;background-color: #F8F8F8;">
		<view class="buckle_title">
			{{detailInfo.bt}}
		</view>
		<view class="buckle">
			<view class="">
				发布单位
			</view>
			<view class="" style="margin-right: 32rpx;">
				{{detailInfo.fbdwmc}}
			</view>
		</view>
		<view class="buckle">
			<view class="">
				发布人
			</view>
			<view class="" style="margin-right: 32rpx;">
				{{detailInfo.fbrxm}}
			</view>
		</view>
		<!-- 详情 -->
		<view style="margin-top: 40rpx;">
			<view class="buckle">
				<view class="">
					警情详情
				</view>
			</view>
			<view class="buckleDetail">
				<view class="">
					{{detailInfo.nr}}
				</view>
				<view class="content_box">
					<view class="content_img" v-for="(item,index) in detailInfo.base64img" :key="index">
						<!-- <view>{{item[index]}}</view> -->
						<image @click="preview(item)" style="width:100%; height:100% " :src="item.replace(/[\r\n]/g,'')"
						 mode="">
						</image>
						<!-- <uni-icons @click="deletePhoto(index)" class="delete_icon" type="clear" color="red" size="16"></uni-icons> -->
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		searchInterface
	} from '../../utils';
	import {
			base64ToPath
		} from 'image-tools'
	export default {
		data() {
			return {
				detailInfo: {}
			}
		},
		onShow() {
			let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
			var curRoute = routes[routes.length - 1].route //获取当前页面路由
			let curParam = routes[routes.length - 1].options; //获取路由参数
			let condition = {
				"logicalOperate": "and",
				"keyValueList": [{
						"key": "notice_id",
						"relationOperator": "=",
						"value": curParam.id,
					},
					{
						"key": "imei",
						"relationOperator": "=",
						"value": uni.getStorageSync('imei')
					}
				]
			}
			uni.showLoading({
				title: '正在加载...',
				mask: true
			})
			this.$request('/jq/getJqTztgDetail', searchInterface(condition, false,
				'230000000000-3-0100-1099d6f4305f4c0da0986f67b7d8767d', 'data'), "POST", "htdz").then(res => {
				// 打印调用成功回调
				uni.$emit('isRead', '111');
				this.detailInfo = JSON.parse(res.data.dataList[0].fieldValues[0].value).result.data
				// console.log(detailInfo.base64img[0])
			})
			// uni.request({
			// 	method: 'post',
			// 	url: 'http://192.168.104.250:7701/jq/getJqTztgDetail',
			// 	data: {
			// 		"notice_id": curParam.id,
			// 		"imei": '864131031213992'
			// 	},
			// 	header: {
			// 		Authorization: '1111'
			// 	},
			// 	dataType: 'json',
			// }).then((response) => {
			// 	console.log(response)
			// }).catch(error => {
			// 	console.log(response)
			// })
		},
		methods: {
			// 预览
			preview(img) {
				let itemImg = img.replace(/[\r\n]/g,'')
				// uni-app不能直接预览base64
				base64ToPath(itemImg).then(path=>{
					console.log(path)
					uni.previewImage({
						urls: [path],
						longPressActions: {
							success: function(data) {},
							fail: function(err) {}
						}
					});
				})
			},
		}
	}
</script>
<style scoped>
	page {
		background-color: #F8F8F8;
	}
	.buckle_title {
		color: #3EBFDF;
		font-size: 28rpx;
		height: 80rpx;
		line-height: 80rpx;
		background: #F8F8F8;
		padding-left: 20rpx;
	}
	.buckle {
		display: flex;
		justify-content: space-between;
		color: #1A1F25;
		font-size: 28rpx;
		height: 80rpx;
		line-height: 80rpx;
		padding-left: 20rpx;
		background-color: #FFFFFF;
		border-bottom: 1px solid #EDEDED;
	}
	.buckleDetail {
		padding: 10rpx 10rpx 10rpx 20rpx;
		background-color: #FFFFFF;
		color: #1A1F25;
		font-size: 28rpx;
	}
	.content_box {
		display: flex;
		overflow: scroll;
	}
	.content_img {
		height: 200rpx;
		width: 160rpx;
		display: flex;
		flex: 0 0 80px;
		justify-content: center;
		align-items: center;
		background-color: #f6f6f6;
		margin-right: 40rpx;
		position: relative;
		.image {
			height: 68rpx;
			width: 68rpx;
		}
	}
</style>