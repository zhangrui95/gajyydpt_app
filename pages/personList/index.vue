<template>
	<view>
		<!-- 上方展示 -->
		<view>
			<uni-nav-bar status-bar="true" color="#fff" @clickRight="clickRight" @clickLeft="clickLeft"
				background-color="#45AFDF" left-icon="back" right-text="筛选" :title="params=='人员'?'人员核查历史':'车辆核查历史'">
			</uni-nav-bar>
		</view>
		<view class="view_header">
			<view class="">盘查总数: {{checkCount}}</view>
			<view class="">异常总数: {{checkExceptionCount}}</view>
			<view class="">今日盘查数:{{checkToday}}</view>
			<view class="">今日异常数:{{checkExceptionToady}}</view>
		</view>
		<block v-if="isNotic=='222'">
			<uni-notice-bar @click.native="routerNotic('notic')" showIcon="true" scrollable="true" text="您有新的通知,请及时处理">
			</uni-notice-bar>
		</block>
		<uni-list :border="true">
			<!-- 右侧带角标 -->
			<uni-list-chat v-for="(item,index) in dataList" :key="index"
				:title="params=='人员'?'姓名:'+item.data.name:item.data['idCard']" :status="item.checkException"
				:avatar="item.data.idCardImg?item.data.idCardImg:params=='人员'?'../../static/people.png':'../../static/car.png'"
				:note="params=='人员'?'<div>身份证号:'+item.data['idCard']+'</div><div>采集时间:'+item.createdAt+'</div>':'<div>人员数量:'+item.data['personData'].length+'</div><div>采集时间:'+item.createdAt+'</div>'">
				<view class='rxbd' v-if="item.data['faceTest']"> 人像比对:<text :class="item.data['faceTest'] && item.data['faceTest'] == 'success' ? 'bdjg' : 'bdjgError'">{{item.data['faceTest'] && item.data['faceTest'] == 'success' ? '通过' : '失败'}}</text></view>
				<view v-if="item.isUpload==0" class="chat-custom-right">
					<uni-icons @click="uploadData(item,item.optargetId)" type="cloud-upload-filled" color="#FF6C00" size="26">
					</uni-icons>
				</view>
			</uni-list-chat>
		</uni-list>
		<view class="noList" v-if="!dataList || dataList.length == 0">
			<image class="noListImg" src="../../static/noList.png"></image>
			<view class="noListText">暂无核查历史</view>
		</view>
		<!-- <uni-load-more :status="status" :icon-size="16" :content-text="contentText" /> -->
		<uni-drawer mode="right" ref="drawerFilter">
			<view style="padding:80rpx 20rpx 0 20rpx;" class="drawer_container">
				<view class="drawer_userinfo_block">
					<uni-search-bar ref="searchBar" v-model="search" cancelText="" placeholder="请输入"></uni-search-bar>
				</view>
				<view class="title">
					状态:
				</view>
				<view class="">
					<radio-group @change="radioChange" class="sunui-radio-group">
						<label v-for="(item,index) in radio" :key="index" class="sunui-radio-label"
							:class="item.checked ? 'sunui-radio-checkd' : ''">
							<radio :value="item.value" :checked="item.checked" />
							<text>{{item.name}}</text>
						</label>
					</radio-group>
				</view>
				<view class="title">
					时间:
				</view>
				<view class="uni-list-cell-db">
					<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
						<view class="uni-input">{{date}}</view>
					</picker>
					<view>一</view>
					<picker mode="time" :value="time" start="09:01" end="21:01" @change="bindTimeChange">
						<view class="uni-input">{{time}}</view>
					</picker>
					<view class="">
						至
					</view>
				</view>
				<view class="uni-list-cell-db">
					<picker mode="date" :value="date1" :start="startDate" :end="endDate" @change="bindDateChange1">
						<view class="uni-input">{{date1}}</view>
					</picker>
					<view>一</view>
					<picker mode="time" :value="time1" start="09:01" end="21:01" @change="bindTimeChange1">
						<view class="uni-input">{{time1}}</view>
					</picker>
					<view style="visibility: hidden;" class="">
						至
					</view>
				</view>
				<view class="drawer_footer">
					<button @click="searchSubmit" style="background: linear-gradient(#3AC7DE, #548DE4);" type="default"
						class="drawer_btn">
						搜索
					</button>
					<button @click="resetSubmit" style="background: linear-gradient(#FFBF32, #F88C56);margin-left: 80rpx;"
						type="default" class="drawer_btn">
						重置
					</button>
				</view>
			</view>
		</uni-drawer>
	</view>
</template>

<script>
	var db = require('../../common/db.js')
	import {
		pathToBase64
	} from 'image-tools'
	import {
		getPatrolInquiriesJson,
		operationInterface,
		convertImgToBase64,
		oneLine
	} from '../../utils/index.js'

	function getDate(type) {
		const date = new Date();

		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();

		if (type === 'start') {
			year = year - 60;
		} else if (type === 'end') {
			year = year + 2;
		}
		month = month > 9 ? month : '0' + month;;
		day = day > 9 ? day : '0' + day;

		return `${year}-${month}-${day}`;
	}
	export default {

		data() {
			return {
				// status: 'more',
				// contentText: {
				// 	contentdown: '上拉加载更多',
				// 	contentrefresh: '加载中',
				// 	contentnomore: '没有更多了'
				// },
				time: '00:00',
				date: getDate({
					format: true
				}),
				time1: new Date().getHours() + ':' + new Date().getMinutes(),
				date1: getDate({
					format: true
				}),
				search: '',
				startDate: getDate('start'),
				endDate: getDate('end'),
				params: '',
				dataList: [],
				checkCount: 0,
				checkExceptionCount: 0,
				checkToday: 0,
				checkExceptionToady: 0,
				radioValue: '0',
				imgData: [], // 网络路径
				isNotic: '',
				radio: [{
					name: '全部',
					value: '0',
					checked: true
				}, {
					name: '正常',
					value: '1',
					checked: false
				}, {
					name: '异常',
					value: '2',
					checked: false
				}]
			}
		},
		onShow() {
			// db.openDB('data')
			this.selectList('noSearch')
			// 盘查总数
			db.SelectCheck(this, oneLine`select count(1) as checkCount from collectDataTable where dataType=${this.params == '车辆' ? 16 : 15}`,
				'checkCount')
			// 异常总数
			db.SelectCheck(this, oneLine`select count(1) as checkExceptionCount from collectDataTable where dataType=${this.params == '车辆' ? 16 : 15} and checkException!=0`,
				'checkExceptionCount')
			// 今日盘查数
			db.SelectCheck(this, oneLine`select count(1) as checkToday from collectDataTable where dataType=${this.params == '车辆' ? 16 : 15} and date(createdAt) =  date('now')`,
				'checkToday')
			// 今日异常数
			db.SelectCheck(this, oneLine`select count(1) as checkExceptionToady from collectDataTable where dataType=${this.params == '车辆' ? 16 : 15} and date(createdAt) =  date('now') and checkException!=0`,
				'checkExceptionToady')
			// db.closeDB('data')
			uni.$on('isRead', (data) => {
				this.isNotic = data;
			})
		},
		onLoad: function (option) {
			this.params = option.type
			uni.setNavigationBarTitle({
				title: `${option.type}盘查历史`
			})
		},
		methods: {
			routerNotic(params) {
				if (params == 'notic') {
					uni.navigateTo({
						url: `/pages/noticList/index`
					})
					// uni.$emit('isRead', '111');
				}
			},
			selectList(type) {
				let search = this.search ? this.search.value : ''
				db.SelectData(this, 'person', oneLine`
				SELECT
					data,
					createdAt,
					isUpload,
					optargetId,
					checkException 
				FROM
					collectDataTable 
				WHERE
					dataType = ${this.params == '车辆' ? 16 : 15}
					${this.radioValue == '0' || this.radioValue == '' ? 'and 1=1' : this.radioValue == '1' ? 'AND checkException = 0' : 'AND checkException = 1'}
					${type == 'noSearch' ? 'AND date(createdAt) =  date("now")' : `AND data LIKE '%${search}%' 
					AND createdAt BETWEEN '${this.date} ${this.time}:00'
					AND '${this.date1} ${this.time1}:59'`}
					ORDER BY createdAt desc
				`,
					false)
			},
			searchSubmit() {
				// db.openDB('data')
				this.selectList()
				// db.closeDB('data')
				this.$refs.drawerFilter.close();
			},
			resetSubmit() {
				if (this.search.value) {
					this.$refs.searchBar.clear()
				}
				this.search = ''
				this.radio = [{
					name: '全部',
					value: '0',
					checked: true
				}, {
					name: '正常',
					value: '1',
					checked: false
				}, {
					name: '异常',
					value: '2',
					checked: false
				}]
				this.radioValue = '0'
				this.time = '00:00'
				this.date = getDate({
					format: true
				})
				this.time1 = new Date().getHours() + ':' + new Date().getMinutes()
				this.date1 = getDate({
					format: true
				})
				// db.openDB('data')
				this.selectList('noSearch')
				// db.closeDB('data')
				this.$refs.drawerFilter.close();
			},
			clickRight() {
				this.$refs.drawerFilter.open();
			},
			async uploadData(data, optargetId) {
				let _this = this
				console.log('data.imgData', data.data.imgData)
				for (let item of data.data.imgData) {
					// console.log('item', item)
					await pathToBase64(item.img)
						.then(base64 => {
							_this.imgData.push({
								img: base64
							})
						})
						.catch(error => {
							console.error(error)
						})
					// 不采用上传图片的方式了  移动警务三类网络不支持上传图片
					// await _this.$request('/data/FilePicupload', {}, "POST", "htdz", 'file', item.img).then(res => {
					// 	// 打印调用成功回调
					// 	if (res.data) {
					// 		let data = JSON.parse(res.data)
					// 		console.log(data)
					// 		_this.imgData.push({
					// 			img: data.result
					// 		})
					// 	}
					// })

				}
				console.log(_this.imgData)
				data.data.imgData = _this.imgData
				console.log(getPatrolInquiriesJson(data, this.params))
				uni.showLoading({
							title: '正在加载...',
							mask: true
						})
				this.$request('/save', operationInterface(getPatrolInquiriesJson(data, this.params),
					'230000000000-3-0600-2d85c929e85d4d21bd7c43f5ea0bf135'), "POST", "htdz").then(res => {
						console.log(res)
						if (res.code == 200) {
							// 将本条数据更新
							// db.openDB('data')
							db.updataSql(
								`UPDATE collectDataTable SET isUpload = '1' WHERE optargetId = '${optargetId}'`)
							this.selectList()
							// db.closeDB('data')
							uni.showToast({
								title: '上传成功'
							});
						} else {
							uni.showToast({
								title: '上传失败',
								icon: 'none'
							});
						}
					})
			},
			clickLeft() {
				uni.navigateBack({
					delta: 1
				})

			},
			radioChange(e) {
				for (let i = 0, len = this.radio.length; i < this.radio.length; i++) {
					this.radio[i].value == e.detail.value ? this.radio[i].checked = true : this.radio[i].checked = false;
				}
				// 循环并没有更新到视图层上,使用VUE方法强制渲染
				this.$forceUpdate();
				this.radioValue = e.detail.value
			},
			bindDateChange: function (e) {
				this.date = e.detail.value
			},
			bindTimeChange: function (e) {
				this.time = e.detail.value
			},
			bindDateChange1: function (e) {
				this.date1 = e.detail.value
			},
			bindTimeChange1: function (e) {
				this.time1 = e.detail.value
			}
		}
	}
</script>

<style lang="less" scoped>
	.rxbd{
		margin-left: 10px;
		color: #999;
		font-size: 12px;
		position: absolute;
		bottom: 10px;
		right: 10px;
	}
	.view_header {
		display: flex;
		font-size: 10px;
		align-items: center;
		justify-content: space-around;
		color: #9B9FA2;
		height: 40px;
		background: #F8F8F8;
	}

	/deep/ .uni-searchbar__cancel {
		padding-left: 0;
	}

	/deep/ .uni-searchbar {
		padding: 0;
	}

	/deep/ .uni-drawer__content {
		width: 75% !important;
	}

	/deep/ .uni-searchbar__box {
		border: none;
		background: #F4F4F4;
		justify-content: start
	}
	.bdjg{
		font-size: 12px;
		color: #49c316;
		height: 24px;
		line-height: 24px;
	}
	.bdjgError{
		font-size: 12px;
		color: #EE0A24;
		height: 24px;
		line-height: 24px;
	}
	.sunui-radio-group,
	.sunui-checkbox-group {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.sunui-radio-group radio,
	.sunui-checkbox-group checkbox {
		display: none;
	}

	.sunui-radio-label {
		font-size: .7em;
		padding: 20rpx 48rpx;
		margin: 12upx;
		margin-left: 0;
		text-align: center;
		background-color: #eee;
		border-radius: 5upx;
		color: #A8A9AD;
	}

	.sunui-radio-checkd {
		color: #fff;
		background-color: #11A8D3;
	}

	.title {
		margin: 20rpx 0 0;
		font-size: 32rpx;
	}

	.uni-input {
		background: #F4F4F4;
		padding: 20rpx;
		color: #A8A9AD;
		border-radius: 12rpx;
	}

	.uni-list-cell-db {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 20rpx;
	}

	.drawer_footer {
		position: absolute;
		bottom: 20rpx;
		display: flex;

		.drawer_btn {
			padding: 0 56rpx
		}
	}
	.noListImg{
		width: 200px;
		height: 123px;
	}
	.noList{
		text-align: center;
		font-size: 14px;
		color: #999;
		padding:50px 0;
	}
</style>