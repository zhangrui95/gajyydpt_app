<template>
	<view class="person_container">
		<view>
			<uni-nav-bar status-bar="true" color="#fff" @clickRight="clickRight" @clickLeft="clickLeft"
				background-color="#45AFDF" left-icon="back" right-icon="camera" :title="params=='人员'?'人员核查':'车辆核查'">
			</uni-nav-bar>
		</view>
		<block v-if="isNotic=='222'">
			<uni-notice-bar @click.native="routerNotic('notic')" showIcon="true" scrollable="true" text="您有新的通知,请及时处理">
			</uni-notice-bar>
		</block>
		<view class="idcard_title" v-html="params=='人员'?'二代身份证采集':'车辆采集'">

		</view>
		<view v-if="params=='人员'" class="idcard_info">
			<text class="title">身份证号</text>
			<input class="uni-input" @input="inputChange" v-model="idCard" name="name" placeholder="请输入" />
		</view>
		<view v-else class="">
			<view class="idcard_info">
				<view class="">
					<text class="title">车牌号码</text>
					<input class="uni-input" @input="inputChange" v-model="idCard" name="name" placeholder="请输入" />
				</view>
			</view>
			<view class="idcard_info">
				<view class="" style="margin-top: 20rpx;">
					<text class="title">号牌种类</text>
					<block v-if="array.length>0">
						<picker class="picker" @change="bindPickerChange" :value="index" :range="array" range-key="name">
							<view style="width: auto;" class="uni-input">{{array[index].name}}</view>
						</picker>
					</block>
				</view>
			</view>
		</view>
		<view class="content_info">
			<view class="content_header">
				<view class="content_header_left">
					<image class="imageTouXiang" :src="idCardImg" mode="">
					</image>
				</view>
				<view class="content_header_right">
					<view class="name" v-html="params=='人员'?'姓名:'+name+'':'车身颜色:'+name+''"></view>
					<view class="">
						<text v-html="params=='人员'?'性别:'+sex+'':'车辆品牌:'+sex+''"></text>
						<text style="margin-left: 40rpx;" v-html="params=='人员'?'民族:'+nation+'':'车辆类型:'+nation+''">{}</text>
					</view>
					<view v-if="params=='人员'" class="">
						<text>出生:{{time}}</text>
					</view>
					<view v-else>

					</view>
				</view>

			</view>
			<view v-if="params=='人员'" class="content_address">
				住址: {{address}}
			</view>
			<view v-else>
				<view class="content_address">
					VIN码: {{pinCard}}
				</view>
				<view class="content_address">
					所属人:{{userName}}
				</view>
				<view class="content_address">
					联系方式:{{tel}}
				</view>
				<view class="content_address">
					发动机号:{{engine}}
				</view>
				<view class="content_address">
					备注:{{remark}}
				</view>
			</view>
			<view class="example-body" style="padding: 0;">
				<view class="tag-view" style="margin: 10rpx 0 0 0" v-for="item in tags" :key="item.code">
					<uni-tag :type="item.property=='111001'?'error':'success'" :text="item.text" />
				</view>
			</view>
			<view class="content_footer" v-if="params=='人员'">
				<button class="btn" style="flex: 1;" type="default" @click="routerCheck">在线核查</button>
				<!-- <button class="btn" type="default">人像比对</button> -->
			</view>
			<view class="content_footer" v-if="params=='车辆'">
				<button class="btn" style="flex: 1;" type="default" @click="routerCheck">在线核查</button>
			</view>
		</view>
		<!-- 车辆特有添加人员 -->
		<view v-if="params=='车辆'" class="idcard_title">
			添加人员
		</view>
		<view v-if="params=='车辆'" class="real_info">
			<view class="content_box">
				<view class="content_img" @click="routerPerson">
					<image class="image" src="../../static/add.png" mode=""></image>
				</view>
				<view @longtap="deletePerson(index)" class="addPerson" v-for="(item,index) in personData" :key="index">
					<image class="image" :src="item.idCardImg" mode="">
					</image>
					<view>
						<view class="person_name">
							{{item.name}}
						</view>
						<view class="person_card">
							{{item.idCard}}
						</view>
					</view>
					<!-- <uni-icons @click="deletePhoto(index)" class="delete_icon" type="clear" color="red" size="16"></uni-icons> -->
				</view>
			</view>
		</view>
		<view class="idcard_title">
			写实
		</view>
		<view class="real_info">
			<view class="title">
				照片
			</view>
			<view class="content_box">
				<view class="content_img" @click="take_photo">
					<image class="image" src="../../static/add.png" mode=""></image>
				</view>
				<view class="content_img" v-for="(item,index) in imgData" :key="index">
					<!-- <view>{{item[index]}}</view> -->
					<image @longtap="longtap(index)" @click="preview(item.img)" style="width:100%; height:100% " :src="item.img"
						mode="">
					</image>
					<!-- <uni-icons @click="deletePhoto(index)" class="delete_icon" type="clear" color="red" size="16"></uni-icons> -->
				</view>

			</view>
		</view>
		<view class="idcard_info" style="border-top: 1px solid #EDEDED;">
			<text class="title">写实</text>
			<input class="uni-input" v-model="real" name="name" placeholder="请输入" />
		</view>
		<view class="idcard_title">
			快速输入
		</view>
		<view class="example-body">
			<view class="tag-view" v-for="item in dictArr" :key="item.content">
				<uni-tag @click="addReal(item.content)" :text="item.content" />
			</view>
		</view>
		<view class="submit">
			<button type="default" @click="submit" class="submitBtn">
				完成
			</button>
		</view>
		<uni-popup id="popupDialog" ref="popupDialog" type="dialog">
			<uni-popup-dialog title="" content="此操作不会保存当前的数据,是否继续?" :before-close="true" @confirm="dialogConfirm"
				@close="dialogClose" :reset="'否'" :submit="'是'"></uni-popup-dialog>
		</uni-popup>
		<!-- <uni-popup id="popupDelete" ref="popupDelete" type="dialog">
			<uni-popup-dialog title="" content="是否要删除此图片?" :before-close="true" @confirm="dialogDelete" @close="dialogClose"
			 :reset="'否'" :submit="'是'"></uni-popup-dialog>
		</uni-popup> -->
	</view>
</template>

<script>
	import uniPopupDialog from '../../components/uni-popup/uni-popup-dialog.vue';
	import moment from 'moment'
	import {
		oneLine,
		searchInterface,
		getCredential,
		writeFile
	} from '../../utils';
	var graceChecker = require("../../common/graceChecker.js");
	var db = require('../../common/db.js')
	export default {
		data() {
			return {
				array: [],
				tags: [], //人员标签
				insertTags: {}, //标签拼接
				personData: [], // 添加人员的数据
				dictArr: [],
				imgIndex: 0,
				params: '',
				source: '',
				index: 1,
				idCard: '',
				imgData: [],
				real: '',
				name: '',
				sex: '',
				nation: '',
				time: '',
				type: '',
				pinCard: '',
				userName: '',
				tel: '',
				engine: '',
				remark: '',
				address: '',
				idCardImg: '',
				Runarguments: '',
				IdentificationType: '',
				isNotic: ''
			}
		},
		onShow() {
			let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
			var curRoute = routes[routes.length - 1].route //获取当前页面路由
			let curParam = routes[routes.length - 1].options; //获取路由参数
			uni.$on('isRead', (data) => {
				this.isNotic = data;
			})
			if (curParam.type == '车辆') {
				this.idCardImg = '../../static/car.png'
				uni.$on("handClickBack", res => {
					if (res) {
						this.personData.push(res.info)
						// 清除监听
						uni.$off('handClickBack');
					}

				})
				uni.$on("IdentificationType", res => {
					if (res) {
						this.IdentificationType = ''
						// 清除监听
						uni.$off('IdentificationType');
					}
				
				})
				let reg =
					/^(([\u4e00-\u9fa5]{1}[A-Z]{1})[-]?|([wW][Jj][\u4e00-\u9fa5]{1}[-]?)|([a-zA-Z]{2}))([A-Za-z0-9]{5}|[DdFf][A-HJ-NP-Za-hj-np-z0-9][0-9]{4}|[0-9]{5}[DdFf])$/
				if (reg.test(this.idCard)) {
					this.getPersonOrCarTags()
				}
			} else {
				this.idCardImg = '../../static/people.png'
				let reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
				uni.$on("IdentificationType", res => {
					if (res) {
						this.IdentificationType = res.IdentificationType
						// 清除监听
						uni.$off('IdentificationType');
					}

				})
				// 身份证号验证通过
				if (reg.test(this.idCard)) {
					this.getPersonOrCarTags()
				}
				var main = plus.android.runtimeMainActivity();
				var NfcInit = plus.android.importClass('com.hylink.wwpc.interfaceActivity');
				var Intent = plus.android.importClass("android.content.Intent")
				var nfc = new NfcInit();
				setTimeout(() => {
					nfc.test(main, Intent);
				}, 800)
				var _this = this
				// 监听NFC
				plus.globalEvent.addEventListener('newintent', function () {
					if (JSON.parse(plus.runtime.arguments).extra_nfc_TAG_HANDLE == _this.Runarguments) {
						return
					} else {
						setTimeout(() => {
							_this.Runarguments = ''
							nfc.nfccreate(main.getIntent())
						}, 100)
					}
					_this.Runarguments = JSON.parse(plus.runtime.arguments).extra_nfc_TAG_HANDLE
				}, false);
			}

		},
		onHide() {
			uni.$off('handClickBack');
			this.myEventManager = plus.android.importClass("com.hylink.wwpc.MyEventManager");
			this.eventManager = this.myEventManager.getMyEventManager();
			this.eventManager.removeListener("onShow");
		},
		onUnload: function () {
			console.log('卸载组件')
			this.eventManager = this.myEventManager.getMyEventManager();
			this.eventManager.removeListener("onShow");
		},
		onLoad: function (option) {
			this.params = option.type
			this.source = option.source
			uni.setNavigationBarTitle({
				title: `${option.type}核查`
			})
			if (option.type == '人员') {

				// 打开数据库,执行查询语句
				db.openDB('dict')
				db.SelectDict(this, 't_sys_label', 'type', '15')
				db.closeDB('dict')
				this.myEventManager = plus.android.importClass("com.hylink.wwpc.MyEventManager");
				this.eventManager = this.myEventManager.getMyEventManager();
				//新建监听器
				var _this = this
				this.myListener = plus.android.implements("com.hylink.wwpc.MyListener", {
					onChange: function (event) {
						//导入类  
						plus.android.importClass(event);
						//获取数据
						if (_this.idCard == JSON.parse(event.getData()).cardNo) {
							return
						}
						_this.idCard = JSON.parse(event.getData()).cardNo
						_this.time = JSON.parse(event.getData()).birth
						_this.address = JSON.parse(event.getData()).address
						_this.nation = JSON.parse(event.getData()).ethnicity
						_this.name = JSON.parse(event.getData()).name
						_this.sex = JSON.parse(event.getData()).sex
						uni.$emit("IdentificationType", {
							"IdentificationType": "intelligent"
						})
						_this.getPersonOrCarTags()
					}
				})
				this.eventManager.addListener("onShow", this.myListener);
				this.eventManager = null
				this.myEventManager = null
				this.myListener = null

			}
			if (option.type == '车辆') {
				db.openDB('dict')
				// 写实信息
				db.SelectDict(this, 't_sys_code', 'pid', '139')
				// 号牌种类
				db.SelectDict(this, 't_sys_label', 'type', '16')
				if (option.formData) {
					this.personData.push(JSON.parse(option.formData))
				}
				db.closeDB('dict')
			}
		},
		components: {
			uniPopupDialog
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
			longtap(index) {
				let that = this;
				uni.showModal({
					title: '删除',
					content: '请问是要删除这张照片吗？',
					success: function (res) {
						if (res.confirm) {
							that.imgData.splice(index, 1)
						} else if (res.cancel) { }
					}
				});
			},
			deletePerson(index) {
				let that = this;
				uni.showModal({
					title: '删除',
					content: '请问要删除此项？',
					success: function (res) {
						if (res.confirm) {
							that.personData.splice(index, 1)
						} else if (res.cancel) { }
					}
				});
			},
			// 预览
			preview(img) {
				uni.previewImage({
					urls: [img],
					longPressActions: {
						success: function (data) { },
						fail: function (err) { }
					}
				});
			},
			// 验证是否保存
			dialogConfirm(done) {
				uni.navigateBack({
					delta: 1
				})
				done()
			},
			// dialogDelete(done) {
			// 	done()
			// },
			dialogClose(done) {
				done()
			},
			// 下拉框值改变
			bindPickerChange: function (e) {
				this.index = e.detail.value
				// this.getPersonOrCarTags()
			},
			// 输入框值改变
			inputChange(e) {
				let reg = this.params == '人员' ?
					/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/ :
					/^(([\u4e00-\u9fa5]{1}[A-Z]{1})[-]?|([wW][Jj][\u4e00-\u9fa5]{1}[-]?)|([a-zA-Z]{2}))([A-Za-z0-9]{5}|[DdFf][A-HJ-NP-Za-hj-np-z0-9][0-9]{4}|[0-9]{5}[DdFf])$/
				// 身份证号验证通过
				if (reg.test(e.detail.value)) {
					this.IdentificationType = ''
					this.getPersonOrCarTags()
				}
			},
			getPersonOrCarTags() {
				// old params 
				// {
				// 	"appCode": "hlk-wwhc",
				// 	"devAddress": "192.168.0.1",
				// 	"devId": "A1W56R4G654G65W4H",
				// 	"hphm": this.params == '人员' ? "string" : this.idCard,
				// 	"hpzl": this.params == '人员' ? "string" : '',
				// 	"jybmbh": "76542",
				// 	"jycode": "12345",
				// 	"jysfzh": "622102198510014317",
				// 	"jyxm": "朱万",
				// 	"locationId": "230000000000",
				// 	"name": "string",
				// 	"sfzh": this.idCard,
				// 	"target": this.params == '人员' ? "person" : "car",
				// 	"type": this.params == '人员' ? "getQGRKList" : "QueryJDC",
				// }
				let condition = {
					"logicalOperate": "and",
					"keyValueList": [{
						"key": "appCode",
						"relationOperator": "=",
						"value": "'hlk-wwhc'"
					},
					{
						"key": "devAddress",
						"relationOperator": "=",
						"value": "192.168.0.1"
					},
					{
						"key": "devId",
						"relationOperator": "=",
						"value": "A1W56R4G654G65W4H"
					},
					{
						"key": "hphm",
						"relationOperator": "=",
						"value": this.params == '人员' ? "string" : this.idCard
					},
					{
						"key": "hpzl",
						"relationOperator": "=",
						"value": this.params == '人员' ? "string" : ''
					},
					{
						"key": "jybmbh",
						"relationOperator": "=",
						"value": getCredential().userCredential ? getCredential().userCredential.load.userInfo.jh : ''
					}, {
						"key": "jycode",
						"relationOperator": "=",
						"value": getCredential().userCredential ? getCredential().userCredential.load.userInfo.jh : ''
					},
					{
						"key": "jysfzh",
						"relationOperator": "=",
						"value": getCredential().userCredential ? getCredential().userCredential.load.userInfo.sfzh : ''
					}, {
						"key": "jyxm",
						"relationOperator": "=",
						"value": getCredential().userCredential ? getCredential().userCredential.load.userInfo.xm : ''
					},
					{
						"key": "locationId",
						"relationOperator": ">",
						"value": "230000000000"
					}, {
						"key": "name",
						"relationOperator": "=",
						"value": "string"
					},
					{
						"key": "sfzh",
						"relationOperator": "=",
						"value": this.idCard
					}, {
						"key": "target",
						"relationOperator": "=",
						"value": this.params == '人员' ? "person" : "car",
					},
					{
						"key": "type",
						"relationOperator": "=",
						"value": this.params == '人员' ? "getQGRKList" : "QueryJDC"
					}
					]

				}
				this.$request('/getTagsInfo', searchInterface(condition, false,
					'230000000000-3-0100-f63ed79512254e3e926fe7556a975089'), "POST", "middle").then(res => {
						this.insertTags = res
						// 打印调用成功回调
						if (res.data) {
							let value = JSON.parse(res.data.dataList[0].fieldValues[0].value)
							if (this.IdentificationType == 'intelligent') {
								this.tags = value.tags
								this.idCardImg = value.infos[0].XP ? 'data:image/jpg;base64,' + value.infos[0].XP : this.params == '人员' ?
									'../../static/people.png' : '../../static/car.png'
								return
							}
							let SFZ = value.infos[0].SFZH ? value.infos[0].SFZH : ''
							this.name = this.params == '人员' ? (value.infos[0].XM ? value.infos[0].XM : '') : (value.infos[0]
								.CSYS ? value.infos[0].CSYS : '')
							this.sex = this.params == '人员' ? (parseInt(SFZ.substr(16, 1)) % 2 == 1 ? '男' : '女') : (value.infos[0].CLPP1 ?
								value.infos[0].CLPP1 : '')
							this.nation = this.params == '人员' ? (value.infos[0].MZ ? value.infos[0].MZ : '') : (value.infos[
								0].CLLX ? value.infos[0].CLLX : '')
							this.idCardImg = value.infos[0].XP ? 'data:image/jpg;base64,' + value.infos[0].XP : this.params == '人员' ?
								'../../static/people.png' : '../../static/car.png'
							this.time = SFZ.substring(6, 10) + "-" + SFZ.substring(10, 12) + "-" + SFZ.substring(12, 14)
							this.address = value.infos[0].ZZXZ ? value.infos[0].ZZXZ : ''
							this.pinCard = value.infos[0].CLSBDH ? value.infos[0].CLSBDH : '',
								this.userName = value.infos[0].JDCSYR ? value.infos[0].JDCSYR : '',
								this.tel = value.infos[0].LXFS ? value.infos[0].LXFS : '',
								this.engine = value.infos[0].FDJH ? value.infos[0].FDJH : ''
							this.remark = value.infos[0].bz ? value.infos[0].bz : ''
							this.tags = value.tags
						}
					})
			},
			// 返回
			clickLeft() {
				let reg = this.params == '人员' ?
					/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/ :
					/^(([\u4e00-\u9fa5]{1}[A-Z]{1})[-]?|([wW][Jj][\u4e00-\u9fa5]{1}[-]?)|([a-zA-Z]{2}))([A-Za-z0-9]{5}|[DdFf][A-HJ-NP-Za-hj-np-z0-9][0-9]{4}|[0-9]{5}[DdFf])$/
				if (this.idCard == '' || (!reg.test(this.idCard))) {
					uni.navigateBack({
						delta: 1
					})
				} else {
					this.$refs.popupDialog.open()
				}

			},
			// OCR识别
			clickRight() {
				if (!plus.runtime.isApplicationExist({
					"pname": "com.xdja.zdsb"
				})) {
					uni.showToast({
						title: '当前手机没有安装OCR组件,需要去应用中心进行安装',
						icon: 'none'
					})
					return;
				}
				var _this = this
				var main = plus.android.runtimeMainActivity();
				var Intent = plus.android.importClass("android.content.Intent"); //导入包
				var intent = this.params == '人员' ? new Intent("com.xdja.zdsb.sfzsb.action") : new Intent(
					"com.xdja.zdsb.cpsb.action"); //连接action
				intent.putExtra("packagename", "com.hylink.wwpc"); //拼接参数
				if (this.params == '人员') {
					intent.putExtra("sfzbs", 0);
				}
				main.startActivityForResult(intent, 11);
				main.onActivityResult = function (requestCode, resultCode, data) {
					if (resultCode == '-1') {
						if (requestCode == 11) {
							if (_this.params == '人员') {
								var sfzh = data.getStringExtra("sfzh"); //获取身份证号
								var json = data.getStringExtra("json") ? JSON.parse(data.getStringExtra("json")) : {};
								var xm = json.xm; //获取姓名
								var xb = json.xb; //获取性别
								var mz = json.mz; //获取民族
								var csrq = json.csrq; //获取出生日期
								var csdz = json.csdz; // 获取出生地址
							} else {
								var sfzh = data.getStringExtra("number"); //车牌号
							}
							_this.idCard = sfzh
							if (_this.params == '人员') {
								_this.name = xm
								_this.sex = xb
								_this.nation = mz
								_this.time = csrq
								_this.address = csdz
							}
							uni.$emit("IdentificationType", {
								"IdentificationType": "intelligent"
							})
						}
					} else {
						uni.showToast({
							title: '识别失败',
							icon: 'none'
						})
					}
				};
			},
			// 添加写实
			addReal(name) {
				this.real = this.real + name + ';'
			},
			// 添加人员
			routerPerson() {
				uni.navigateTo({
					url: `/pages/personCheck/index?type=人员&source=cl`
				})
			},
			// 调用摄像头
			take_photo() {
				var _this = this
				uni.chooseImage({
					count: 6, //默认9
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: function (res) {
						for (let file of res.tempFilePaths) {
							_this.imgData.push({
								img: file
							})
							// _this.$request('/data/FilePicupload', {}, "POST", "htdz", 'file', file).then(res => {
							// 	// 打印调用成功回调
							// 	if (res.data) {
							// 		let data = JSON.parse(res.data)
							// 		_this.imgData.push({
							// 			img: data.result
							// 		})
							// 	}
							// })
						}
						// 上传到图片服务器

					}
				});
			},
			// 插入人员
			insertPerson(formData, type, optargetId) {
				let insertTags = JSON.parse(this.insertTags.data.dataList[0].fieldValues[0].value)
				let checkException = '0'
				checkException = insertTags.tags[0].property == '111001' ? '1' : '0'
				let data = {
					...formData,
					insertTags
				}
				// db.openDB('data')
				db.insertData(this, type, oneLine`
				INSERT INTO collectDataTable ( optargetId, policeIdcard, data, dataType, isUpload, checkException,createdAt )
				VALUES
					(
					'${optargetId}',
					'${this.idCard}',
					'${JSON.stringify(data)}',
					'${this.params == '车辆' ? 16 : 15}',
					'0',
					${checkException},
					'${moment().format('YYYY-MM-DD HH:mm:ss')}')
						`)
				// db.closeDB('data')
			},
			// 填写表单
			submit(e) {
				//定义表单规则
				var rule = [{
					name: "idCard",
					checkType: "notnull",
					checkRule: "",
					errorMsg: this.params == '人员' ? "身份证号不能为空" : "车牌号码不能为空"
				},
				{
					name: "idCard",
					checkType: "reg",
					checkRule: this.params == '人员' ?
						/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/ : /^(([\u4e00-\u9fa5]{1}[A-Z]{1})[-]?|([wW][Jj][\u4e00-\u9fa5]{1}[-]?)|([a-zA-Z]{2}))([A-Za-z0-9]{5}|[DdFf][A-HJ-NP-Za-hj-np-z0-9][0-9]{4}|[0-9]{5}[DdFf])$/,
					errorMsg: this.params == '人员' ? "请输入正确的身份证号" : "请输入正确的车牌号码"
				}
				];
				//进行表单检查
				var formData = {
					idCard: this.idCard,
					imgData: this.imgData,
					real: this.real,
					name: this.name,
					sex: this.sex,
					nation: this.nation,
					address: this.address,
					time: this.time,
					type: this.type,
					pinCard: this.pinCard,
					userName: this.userName,
					tel: this.tel,
					engine: this.engine,
					remark: this.remark,
					idCardImg: this.idCardImg,
					licensePlateTypeCode: this.params == '人员' ? '' : this.array[this.index].code,
					licensePlateType: this.params == '人员' ? '' : this.array[this.index].name,
					personData: this.personData
				};
				var checkRes = graceChecker.check(formData, rule);
				if (checkRes) {
					let idCard = '230221199602154813'
					let optargetId = idCard + moment().format('YYYYMMDDHHmmssSSS')
					if (this.source == 'cl') {
						this.insertPerson(formData, 'addPerson', optargetId)
						/* 使用这种方式跳转不刷新 */
						uni.navigateBack({
							delta: 1,
							success: function () {
								uni.$emit("handClickBack", {
									info: {
										...formData,
										optargetId: optargetId
									}
								});
							}
						})
					} else {
						this.insertPerson(formData, 'custom', optargetId)
					}
				} else {
					uni.showToast({
						title: graceChecker.error,
						icon: "none"
					});
				}
			},
			// 删除照片
			// deletePhoto(index) {
			// 	this.$refs.popupDelete.open()
			// },
			routerCheck() {
				// if(this.idCard=='){}
				let reg = this.params == '人员' ?
					/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/ :
					/^(([\u4e00-\u9fa5]{1}[A-Z]{1})[-]?|([wW][Jj][\u4e00-\u9fa5]{1}[-]?)|([a-zA-Z]{2}))([A-Za-z0-9]{5}|[DdFf][A-HJ-NP-Za-hj-np-z0-9][0-9]{4}|[0-9]{5}[DdFf])$/
				if (this.idCard == '') {
					uni.showToast({
						title: this.params == '人员' ? '请输入身份证号' : '请输入车牌号码',
						icon: "none"
					})
				} else if (!reg.test(this.idCard)) {
					uni.showToast({
						title: this.params == '人员' ? '请输入正确的身份证号' : '请输入正确的车牌号码',
						icon: "none"
					})
				} else {
					uni.navigateTo({
						url: `/pages/onlineCheck/onlineCheck?idCard=${this.idCard}&type=${this.params}`
					})
				}

			}
		},
	}
</script>

<style scoped lang="less">
	.person_container {
		height: 100vh;
		background-color: #F8F8F8;

		/deep/ .uni-tag {
			border: 1px solid #C2C2C2;
			border-radius: 4px;
		}

		/deep/ .uni-tag--default {
			color: #A4A4A4;
		}

		.customizeBar {
			height: var(--status-bar-height);
			width: 100%;
		}

		.picker {
			display: inline-block;
		}

		.uni-nav-bar-text {
			font-size: 32rpx;
			font-weight: 700;
		}

		.example-body {
			/* #ifndef APP-PLUS-NVUE */
			display: flex;
			/* #endif */
			flex-direction: row;
			justify-content: flex-start;
			flex-wrap: wrap;
			padding: 20rpx;
		}

		.tag-view {
			/* #ifndef APP-PLUS-NVUE */
			display: flex;
			/* #endif */
			flex-direction: column;
			margin: 10rpx 15rpx;
			justify-content: center;
		}

		.idcard_title {
			color: #3EBFDF;
			font-size: 28rpx;
			height: 80rpx;
			line-height: 80rpx;
			background: #F8F8F8;
			padding-left: 20rpx;
		}

		.idcard_info {
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

		.content_info {
			background: #fff;
			margin-top: 40rpx;
			padding: 40rpx;

			.content_header {
				display: flex;

				.content_header_left {
					height: 200rpx;
					width: 160rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					background-color: #f6f6f6;
					margin-right: 50rpx;

					.imageTouXiang {
						height: 124rpx;
						width: 108rpx;
					}
				}

				.content_header_right {
					font-size: 32rpx;
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					justify-content: space-between;
				}
			}

			.content_address {
				margin-top: 40rpx;
				font-size: 32rpx;
			}

			.content_footer {
				display: flex;
				margin-top: 40rpx;

				.btn {
					background-color: #45AFDF;
					color: #fff;
					border-radius: 0;
					padding: 0 60rpx;
				}
			}
		}

		.submit {
			margin-top: 40rpx;

			.submitBtn {
				background-color: #4E9AE3;
				border-radius: 60rpx;
				color: #fff;
				margin: 20rpx;
			}
		}

		.real_info {
			background-color: #fff;
			padding: 20rpx 0 40rpx 40rpx;

			.content_box {
				display: flex;
				overflow: scroll;
			}

			.title {
				margin-bottom: 20rpx;
			}

			.image {
				height: 68rpx;
				width: 68rpx;
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

				// .delete_icon {
				// 	top: 0rpx;
				// 	position: absolute;
				// 	right: 0rpx;
				// }
			}
		}

		.addPerson {
			padding: 0 10rpx 0 10rpx;
			display: flex;
			height: 200rpx;
			background: #eee;
			align-items: center;
			margin-right: 40rpx;

			.image {
				height: 200rpx;
				width: 160rpx;
				margin-right: 18rpx;
			}

			.person_name {
				color: #4e9ae3;
			}

			.person_card {
				font-size: 24rpx;
			}
		}
	}
</style>