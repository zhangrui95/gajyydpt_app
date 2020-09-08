<template>
	<view>
		<wuc-tab @change="changeTab" :tab-list="tabList" textFlex :tabCur.sync="TabCur" tab-class="text-center text-black bg-white"
		 select-class="text-blue">
		</wuc-tab>
		<block v-if="TabCur==0">
			<view class="idcard_title" v-html="routerParams=='人员'?'人口基本信息':'车辆基本信息'">
			</view>
			<view class="content">
				<view class="content_left">
					<block v-if="haveBasicList.length>0">
						<view class="basic_info" v-for="(item,key) in basicContent[0]" :key="key">
							{{key}}:{{item}}
						</view>
					</block>
					<block v-else>
						暂无数据信息
					</block>
				</view>
				<view class="content_right" v-if="haveBasicList.length>0">
					<view class="content_header_left">
						<image class="imageTouXiang" :src="routerParams=='人员'?'../../static/people.png':'../../static/car.png'" mode=""></image>
					</view>
				</view>
			</view>
		</block>
		<block v-else>
			<view class="example-body">
				<view class="tag-view" v-for="(item,index) in haveDataList" :key="item.code">
					<block v-if="item.haveData">
						<uni-tag :class="activeClass == index ? 'active':''" @click="selectTag(item,index)" :text="item.name" />
					</block>
				</view>
			</view>
			<view class="content">
				<view class="content_left">
					<block v-if="haveDataList.length>0">
						<view class="basic_info" v-for="(item,key) in content[0]" :key="key">
							{{key}}:{{item}}
						</view>
					</block>
					<block v-else>
						暂无数据信息
					</block>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				TabCur: 0,
				tabList: [{
					name: '基础信息'
				}, {
					name: '背景信息'
				}],
				content: [],
				basicContent: [],
				haveDataList: [], //判断是否有无背景信息
				haveBasicList: [], //判断有无基本信息
				activeClass: 0,
				routerParams: '' //路由参数
			}
		},
		onShow() {
			let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
			let curRoute = routes[routes.length - 1].route //获取当前页面路由
			let curParam = routes[routes.length - 1].options; //获取路由参数
			this.routerParams = curParam.type
			this.$request('/getDataInfo', {
				"appCode": "hlk-wwhc",
				"devAddress": "192.168.0.1",
				"devId": "A1W56R4G654G65W4H",
				"hphm": curParam.type == '人员' ? "string" : curParam.idCard,
				"hpzl": curParam.type == '人员' ? "string" : '',
				"jybmbh": "76542",
				"jycode": "12345",
				"jysfzh": "622102198510014317",
				"sfzh": curParam.idCard,
				"target": curParam.type == '人员' ? "person" : "car",
				"type": "getQGRKList"
			}, "POST", "middle").then(res => {
				if (res.result) {
					this.basic_info = res.result[0].tags
					let contentMiddle = []
					let basicMiddle = []
					for (let item of res.result[1].tags) {
						if (item.haveData == true) {
							this.haveDataList.push(item)
							contentMiddle.push(item.data[0])
						}
					}
					for (let item of res.result[0].tags) {
						if (item.haveData == true) {
							this.haveBasicList.push(item)
							basicMiddle.push(item.data[0])
						}
					}
					this.content = contentMiddle
					this.basicContent = basicMiddle
				}
			})
		},
		methods: {
			changeTab(e) {},
			selectTag(item, index) {
				this.activeClass = index
				this.content = item.data
			}
		}
	}
</script>

<style lang="less" scoped>
	.idcard_title {
		color: #3EBFDF;
		font-size: 28rpx;
		height: 80rpx;
		line-height: 80rpx;
		background: #F8F8F8;
		padding-left: 20rpx;
	}

	.basic_info {
		font-size: 32rpx;
		color: #9B9FA2;
		margin-top: 4rpx;
	}

	.content {
		display: flex;
		justify-content: space-between;
		padding: 10px;
	}

	.content_header_left {
		height: 200rpx;
		width: 160rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #f6f6f6;

		.imageTouXiang {
			height: 124rpx;
			width: 108rpx;
		}
	}

	.example-body {
		// /* #ifndef APP-PLUS-NVUE */
		display: flex;
		// /* #endif */
		// flex-direction: row;
		// justify-content: flex-start;
		// flex-wrap: wrap;
		padding: 20rpx;
		background: #F8F8F8;
		white-space: nowrap;
		overflow: scroll;
		// padding: 0px;
	}

	.tag-view {
		/* #ifndef APP-PLUS-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
	}

	/deep/ .uni-tag {
		height: 70rpx;
		line-height: 70rpx;
		border-color: #3EBFDF;
		background-color: #3EBFDF;
		margin: 10rpx 15rpx;
	}

	/deep/ .uni-tag--default {
		color: #ffffff;
	}

	.active {
		background-color: #FFFFFF;
	}

	.active /deep/ .uni-tag--default {
		color: #3EC0DF;
	}
</style>
