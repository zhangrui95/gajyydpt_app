<template>
	<view style="height: calc(100vh - 44px);background-color: #F8F8F8;">
		<view>
			<uni-nav-bar right-text="完成" @clickRight="clickRight" status-bar="true" color="#fff" @clickLeft="clickLeft"
			 background-color="#45AFDF" left-icon="back" title="卡扣设置"></uni-nav-bar>
		</view>
		<view class="buckle_title">
			卡点信息
		</view>
		<view class="buckle_info">
			<text class="title">卡点名称</text>
			<input v-if="networkType=='no'" class="uni-input" v-model="buckle" name="name" placeholder="请输入" />
			<!-- <input v-else class="uni-input" v-model="buckle" name="name" placeholder="请输入" /> -->
			<block v-if="array.length>0">
				<picker class="picker" @change="bindPickerChange" :value="index" :range="array" range-key="checkpoint_name">
					<view style="width: auto;" class="uni-input" v-html="this.index==-1||this.index===''?'请选择':array[index].checkpoint_name"></view>
				</picker>
			</block>
		</view>
		<view class="buckle_content" v-if="array.length>0&&(this.index>=0&&(this.index!==undefined&&this.index!==''))">
			<view class="buckle_children">
				管辖单位:{{array[this.index].checkpoint_unit_text}}
			</view>
			<view class="buckle_children">
				卡点类型:{{array[this.index].checkpoint_level_text}}
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
				array: [],
				buckle: '',
				index: -1,
				networkType: uni.getStorageSync('networkType')
			}
		},
		onShow() {
			console.log(11111111111112312)
			var _this = this
			let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
			let curRoute = routes[routes.length - 1].route //获取当前页面路由
			let curParam = routes[routes.length - 1].options; //获取路由参数
			if (this.networkType == 'no') {
				this.buckle = curParam.type == 'undefined' ? '' : curParam.type
				console.log(curParam.type)
			} else {
				// 拼接移动警务参数
				// messageId = getuuid();
				// 
				this.$request('/data/getCheckPointListForClient', searchInterface(), "POST", "htdz").then(res => {
					console.log(res)
					if(res.code==200){
						_this.array = res.data.list
						let nameList = []
						for (let item of res.data.list) {
							nameList.push(item.checkpoint_name)
						}
						console.log(res.data.list)
						this.index = curParam.type == 'undefined' ? '' : nameList.indexOf(curParam.type)
					} else {
						uni.showToast({
							title: res.message,
							icon:'none'
						})
					}
					// if (res.data) {
					// 	_this.array = res.data.list
					// }
					
				})

			}

		},
		onLoad(option) {




		},
		methods: {
			// 下拉框值改变
			bindPickerChange: function(e) {
				console.log(e)
				this.index = e.detail.value
			},
			clickLeft() {
				uni.navigateBack({
					delta: 1
				})
			},
			clickRight() {
				var type = ''
				if (this.networkType == 'no') {
					if (!this.buckle) {
						uni.showToast({
							title: '请输入卡点名称',
							icon: 'none'
						})
						return
					}
					uni.setStorage({
						key: 'buckle',
						data: this.buckle,
						success: function() {}
					});
					type = this.buckle
				} else {
					if (this.index == -1) {
						uni.showToast({
							title: '请输入卡点名称',
							icon: 'none'
						})
						return
					}
					uni.setStorage({
						key: 'buckle',
						data: this.array[this.index].checkpoint_name,
						success: function() {}
					});
					uni.setStorage({
						key: 'buckleId',
						data: this.array[this.index].id,
						success: function() {}
					});
					type = this.array[this.index].checkpoint_name
				}

				uni.showToast({
					title: '设置成功'
				})

				var _this = this
				setTimeout(function() {
					uni.navigateTo({
						url: `/pages/index/index?type=${type}`
					})
				}, 400)
			}
		}
	}
</script>

<style scoped>
	.buckle_title {
		color: #3EBFDF;
		font-size: 28rpx;
		height: 80rpx;
		line-height: 80rpx;
		background: #F8F8F8;
		padding-left: 20rpx;
	}

	.buckle_info {
		color: #1A1F25;
		font-size: 28rpx;
		height: 80rpx;
		line-height: 80rpx;
		background: #fff;
		padding-left: 20rpx;
	}

	.uni-input {
		display: inline-block;
		font-size: 28rpx;
		color: #CCCCCC;
		overflow: inherit;
		margin-left: 40rpx;
		width: calc(100% - 160rpx);
	}

	.buckle_content {
		display: flex;
		justify-content: start;
		height: 200rpx;
		background: #eeee;
		padding: 20rpx 0 0 20rpx;
		margin-top: 40rpx;
		background-color: #ffff;
	}

	.buckle_children {
		width: 50%;
		font-size: 32rpx;
	}

	.picker {
		display: inline-block;
	}
</style>
