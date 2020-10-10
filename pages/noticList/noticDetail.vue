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
			</view>
		</view>
	</view>
</template>

<script>
	import {
		searchInterface
	} from '../../utils';
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
						"value": plus.device.imei
					}
				]
			}
			uni.showLoading({
							title: '正在加载...',
							mask: true
						})
			this.$request('/jq/getJqTztgDetail', searchInterface(condition, false,
				'230000000000-3-0100-1099d6f4305f4c0da0986f67b7d8767d','data'), "POST", "htdz").then(res => {
				// 打印调用成功回调
				uni.$emit('isRead', '111');
				this.detailInfo = JSON.parse(res.data.dataList[0].fieldValues[0].value).result.data
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
</style>
