<template>
	<view class="index_container">
		<view class="index_header">
			<view class="header_title_block">
				<view class="wenzi">
					维稳盘查
				</view>
			</view>
			<view class="touxiang" @click="handleClick">
				<image src="../../static/userIcon.png" mode="widthFix"></image>
			</view>
		</view>
		<block v-if="isNotic=='222'">
			<uni-notice-bar @click.native="routerNotic('notic')" showIcon="true" scrollable="true" text="您有新的通知,请及时处理">
			</uni-notice-bar>
		</block>
		<view class="index_content">
			<view class="pancha_block">
				<view class="pancha_left" @click="routerAdd('人员')">
					<view class="img_block">
						<image src="../../static/renyuan.png" mode="widthFix"></image>
					</view>
					<view class="text_block">
						<text class="jiahao">+</text> <text class="wenzi">人员盘查</text>
					</view>
				</view>
				<view class="pancha_right" @click="routerNav('人员')">
					<view class="history_num">
						{{personNum}}
					</view>
					<view class="history_text">
						人员盘查历史
					</view>
				</view>
			</view>
			<view class="pancha_block cheliang">
				<view class="pancha_left" @click="routerAdd('车辆')">
					<view class="img_block">
						<image src="../../static/che.png" mode="widthFix"></image>
					</view>
					<view class="text_block">
						<text class="jiahao">+</text> <text class="wenzi">车辆盘查</text>
					</view>
				</view>
				<view class="pancha_right" @click="routerNav('车辆')">
					<view class="history_num">
						{{carNum}}
					</view>
					<view class="history_text">
						车辆盘查历史
					</view>
				</view>
			</view>
			<view class="point_block">
				<image src="../../static/weizhi.png" mode="widthFix"></image>
				{{blckle}}
			</view>
		</view>
		<!-- 抽屉 -->
		<uni-drawer ref="drawer">
			<view style="padding:32rpx;" class="drawer_container">
				<view class="drawer_userinfo_block">
					<view class="left_name">
						<view class="name">
							{{userinfo?userinfo.load.userInfo.xm:''}}
						</view>
						<view class="addr">
							{{userinfo?userinfo.load.userInfo.jh:''}}
							<!-- 黑龙江哈尔滨市松北区 -->
						</view>
					</view>
					<view class="right_touxiang">
						<image src="../../static/userIconborder.png" mode="widthFix"></image>
					</view>
				</view>
				<view class="opertion_list">
					<uni-list>
						<uni-list-item clickable @click="setBuckle" title="卡口设置" thumb="../../static/weizhi.png" link thumb-size="sm"
						 :rightText="blckle?blckle:''"></uni-list-item>
						<uni-list-item clickable @click="routerNotic" title="通知通告" thumb="../../static/tz.png" link thumb-size="sm">

						</uni-list-item>
						<!-- <uni-list-item title="修改密码" thumb="../../static/mima.png" link thumb-size="sm"></uni-list-item> -->
						<uni-list-item clickable @click="resetData" title="清除缓存" thumb="../../static/qingchu.png" link thumb-size="sm"></uni-list-item>
						<uni-list-item title="检查版本" thumb="../../static/gengxin.png" link thumb-size="sm" :rightText="version"></uni-list-item>
					</uni-list>
				</view>
				<view class="ogOut_block">
					<button type="default" @click="routerLogin">退出系统</button>
				</view>
			</view>
		</uni-drawer>
		<uni-popup id="popupDialog" ref="popupDialog" type="dialog">
			<uni-popup-dialog :type="msgType" title="" content="此操作不会保存当前数据,是否继续?" :before-close="true" @confirm="dialogConfirm"
			 @close="dialogClose" :reset="'否'" :submit="'是'"></uni-popup-dialog>
		</uni-popup>
		<uni-popup id="popupLogout" ref="popupLogout" type="dialog">
			<uni-popup-dialog :type="msgType" title="" content="是否要退出系统?" :before-close="true" @confirm="dialogLogout" @close="dialogClose"
			 :reset="'否'" :submit="'是'"></uni-popup-dialog>
		</uni-popup>
		<uni-popup id="popupUpload" ref="popupUpload" type="dialog">
			<uni-popup-dialog :type="msgType" title="" content="检测到有新版本是否更新?" :before-close="true" @confirm="dialogUpload"
			 @close="dialogClose" :reset="'暂不更新'" :submit="'更新'"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopupDialog from '../../components/uni-popup/uni-popup-dialog.vue';
	import {
		oneLine,
		getCredential
	} from '../../utils';
	var db = require('../../common/db.js')
	var convert = require('xml-js')
	export default {
		data() {
			return {
				msgType: 'warn',
				personNum: 0,
				carNum: 0,
				blckle: '',
				userinfo: getCredential().userCredential,
				updateId: '',
				version: plus.runtime.version,
				isNotic: ''
			}
		},
		components: {
			uniPopupDialog
		},
		onShow() {
			// db.openDB('data')
			db.SelectData(this, 'person', oneLine `
				select count(1) as count  from collectDataTable where dataType=15 and date(createdAt) =  date('now')
			`,
				true)
			db.SelectData(this, 'car', oneLine `
				select count(1) as count from collectDataTable where dataType=16 and date(createdAt) =  date('now')
			`,
				true)
			uni.$on('isRead', (data) => {
				this.isNotic = data;
			})
			// db.closeDB('data')
		},
		onLoad(option) {
			// 初始化升级服务器组件
			// var main = plus.android.runtimeMainActivity();
			// console.log('main', main)
			// var updateApp = plus.android.importClass('com.hylink.wwpc.updateApp');
			// var update = new updateApp();
			// update.checkInit(main)
			var _this = this
			uni.getStorage({
				key: 'buckle',
				success: function(res) {
					console.log('res', res)
					_this.blckle = res.data
				}
			});
			this.blckle = option.type
		},
		methods: {
			dialogClose(done) {
				done()
			},
			dialogLogout(done) {
				plus.runtime.quit();
				// uni.navigateTo({
				// 	url: '/pages/login/index'
				// })
				done()
			},
			dialogUpload(done) {
				this.$request('/Update/api/upgrade/downloadApk.do', {
					fileId: this.updateId,
				}, "POST", "htdz").then(res => {
					// 打印调用成功回调
				})
			},
			dialogConfirm(done) {
				// this.$refs.popupMessage.open()
				// console.log('点击确认');
				// 需要执行 done 才能关闭对话框
				done()
				uni.showLoading({
					title: '清除数据中'
				})
				// db.openDB('data')
				db.deleteTable('collectDataTable')
				db.SelectData(this, 'person', oneLine `
					select count(1) as count  from collectDataTable where dataType=15 and date(createdAt) =  date('now')
				`,
					true)
				db.SelectData(this, 'car', oneLine `
					select count(1) as count from collectDataTable where dataType=16 and date(createdAt) =  date('now')
				`,
					true)
				// db.closeDB('data')
				uni.removeStorageSync('buckle');
				uni.removeStorageSync('buckleId')
				this.blckle = ''
				uni.hideLoading()
			},
			// 退出应用
			routerLogin() {
				this.$refs.drawer.close()
				this.$refs.popupLogout.open()
			},
			resetData() {
				this.$refs.drawer.close()
				this.$refs.popupDialog.open()
			},
			checkVersion() {
				uni.showLoading({
					title: '正在检查更新'
				})
				// 调用sdk检查更新
				var main = plus.android.runtimeMainActivity();
				var updateApp = plus.android.importClass('com.hylink.wwpc.updateApp');
				var update = new updateApp();
				let status = update.checkUpdate(main)
				if (status != 0) {
					uni.hideLoading()
				}
				if (status == 3 || status == 2) {
					uni.showToast({
						'title': '当前已是最新版本',
						icon: 'none'
					})
				} else {
					this.$refs.drawer.close()
					this.$refs.popupUpload.open()
				}
				console.log(status)
				// 原来是对接后台,现在改成对接SDK
				// let xmlBody =
				// 	oneLine `
				// <?xml version="1.0" encoding="utf-8"?>
				// <Root>
				// 	 <PactVersion>4.1</PactVersion>
				// 	 <Req>checkver</Req>
				// 	 <Factory>1111</Factory>
				// 	 <OS>Android2.3</OS>
				// 	 <Mod>XT711</Mod>
				// 	 <Soft>青岛警务通</Soft>
				// 	 <UserName/> 
				// 		<CardNo>ddsssfdd</CardNo> 
				// 	 <Vers>
				// 		 <Ver>
				// 			 <VerType>com.xdja.qdjwt.frame</VerType>
				// 			 <Version>2.371.4.1</Version>
				// 			 <Date>2012-12-01</Date>
				// 		 </Ver>
				// 	 </Vers>
				// </Root>
				// `
				// this.$request('/data/getXml', xmlBody, "POST", "htdz", '',
				// 	'', {
				// 		'Content-Type': 'text/xml',
				// 		'userCredential': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJlYjViOTdiOS0yMGZjLTQ3MWMtYTBhMS1mZTQ2OGJmMjgzYzciLCJpYXQiOjE1OTkwMTQzODYsInN1YiI6IjI0MTgiLCJpc3MiOiJTZWN1cml0eSBDZW50ZXIiLCJkZXBhcnRtZW50Ijp7ImlkIjozNDk3LCJwYXJlbnRJZCI6MzQ5NiwiZGVwdGgiOjIsIm5hbWUiOiLlronovr7luIIiLCJjb2RlIjoiMjMxMjgxMDAwMDAwIn0sImdvdmVybm1lbnQiOltdLCJpZCI6MjQxOCwiaWRDYXJkIjoiMjMwMTA2MTk4ODA1MDcwNDEzIiwicGNhcmQiOiIwMDAxMDAiLCJuYW1lIjoi5rWL6K-VIiwiam9iIjpbeyJjb2RlIjoiMjAwMDAxIiwibmFtZSI6IuawkeitpiJ9XSwiY29udGFjdCI6IjEzNjEzNjAwODMwIiwiaXNBZG1pbiI6MCwiZXhwIjoxNjAxMDg3OTg2fQ.YqL1HRg9iKEwJL89EOz5mX3vwghD7jCxS_3xuTJMQVg'
				// 	}).then(res => {
				// 	let xml =
				// 		`
				// 		<?xml version="1.0" encoding="UTF-8"?>
				// 		<Root>
				// 		 <Req>checkver</Req>
				// 		 <Result>1</Result> //检测到更新时值为 1
				// 		 <ModPower>
				// 		 <![CDATA[com.xdja.jxclient|0|警信|1]]> //apk 中拥有的权限
				// 		 </ModPower>
				// 		 <Msg>无更新版本信息</Msg>
				// 		</Root>`
				// 	var result = convert.xml2json(xml, {
				// 		compact: true
				// 	})
				// 	if (result.Root.Result._text == '1') {
				// 		uni.showToast({
				// 			title: '无更新版本信息',
				// 			icon: 'none'
				// 		})
				// 	} else {
				// 		this.updateId = result.Root.Updates.Update.Files.File.FileId._text
				// 		this.$refs.popupUpload.open()
				// 	}
				// })
			},
			setBuckle() {
				uni.navigateTo({
					url: `/pages/buckle/buckle?type=${this.blckle}`
				})
			},
			routerNotic(params) {
				uni.navigateTo({
					url: `/pages/noticList/index`
				})
				// if (params == 'notic') {
				// 	uni.$emit('isRead', '111');
				// }
			},
			handleClick() {
				this.$refs.drawer.open();
			},
			routerNav(type) {
				uni.navigateTo({
					url: `/pages/personList/index?type=${type}`
				});
			},
			routerAdd(type) {
				// 主要为了测试
				if (uni.getStorageSync('buckle') == '') {
					uni.showToast({
						title: '请先选择卡点',
						icon: 'none'
					})
					return
				}
				uni.navigateTo({
					url: `/pages/personCheck/index?type=${type}`
				});
			}
		}
	}
</script>

<style scoped>
	.index_container {
		height: 100vh;
		background-color: #F8F8F8;
	}

	.index_header {
		height: 25vh;
		width: 100%;
		background: url('~@/static/headBg.png');
		background-position: left;
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	.header_title_block {
		display: flex;
		align-items: center;
		text-align: center;
		justify-content: center;
		height: 180rpx;
		color: #fff;

	}

	.wenzi {
		font-weight: 500;
	}

	.touxiang image {
		width: 15%;
		height: 0;
		height: auto;
		position: absolute;
		top: 60rpx;
		left: 30rpx;
	}

	.pancha_block {
		width: 70%;
		height: 270rpx;
		margin: 0 auto;
		display: flex;
		box-shadow: 0px 0px 38px 0px rgba(194, 194, 194, 0.26);
		border-radius: 18rpx;
		padding: 43rpx;
	}

	.pancha_left {
		flex: 1;
		height: 270rpx;
		background: url('~@/static/orange.png');
		background-position: left;
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	.pancha_left .img_block {
		/* height: 140rpx; */
		text-align: center;
		margin: 24rpx 0;
		display: flex;
		height: 120rpx;
		align-items: center;
		justify-content: center;
	}

	.pancha_left .img_block image {
		width: 120rpx;
		height: 0;
		height: auto;
	}

	.pancha_left .text_block {
		text-align: center;
		color: #fff;
		font-weight: 700;
	}

	.pancha_left .text_block .jiahao {
		font-size: 46rpx;
		font-weight: 600;
	}

	.pancha_left .text_block .wenzi {
		font-size: 40rpx;
		font-weight: 600;
	}

	.pancha_right {
		flex: 1;
		height: 270rpx;
	}

	.pancha_right .history_num {
		color: #10A7D3;
		font-size: 96rpx;
		margin: 24rpx 0 20rpx 0;
		font-weight: 700;
		text-align: center;
	}

	.pancha_right .history_text {
		text-align: center;
		color: #BEBEBE;
		font-family: PingFangSC;

	}

	.cheliang {
		margin-top: 10%;
	}

	.cheliang .pancha_left {
		background: url('~@/static/green.png');
		background-position: left;
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	.point_block {
		display: flex;
		justify-content: center;
		align-items: center;
		color: #11A7D3;
		font-weight: bold;
		margin-top: 10%;
	}

	.point_block image {
		width: 46rpx;
		margin-right: 20rpx;
	}

	/* 抽屉样式 */
	/* .drawer_container{
		position: relative;
	} */
	.drawer_userinfo_block {
		height: 240rpx;
		display: flex;
		align-items: center;
	}

	.drawer_userinfo_block .left_name {
		flex: 3;
	}

	.drawer_userinfo_block .left_name .name {
		font-weight: 700;
		margin-bottom: 12rpx;
	}

	.drawer_userinfo_block .left_name .addr {
		font-size: 32rpx;
		color: #666666;

	}

	.drawer_userinfo_block .right_touxiang {
		flex: 1;
	}

	.drawer_userinfo_block .right_touxiang image {
		width: 100%;
		height: 0;
		height: auto;
	}

	/deep/ .uni-drawer__content {
		width: 75% !important;
	}

	/deep/ .uni-list-item {
		padding-left: 0;
	}

	.ogOut_block {
		position: absolute;
		bottom: 0;
		left: 0;
		/* width: 100%; */
		/* padding: 24rpx 36rpx; */
		width: 100%;
		margin-bottom: 10%;
	}

	.ogOut_block button {
		width: 80%;
		background: #fff;
		border: 2rpx solid #11A7D3;
		color: #11A7D3;
		border-radius: 60rpx;
	}

	uni-button:after {
		border: none;
	}
</style>
