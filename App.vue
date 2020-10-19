<script>
	var db = require('./common/db.js')
	import {
		oneLine,
		getuuid,
		writeFile,
		getPatrolInquiriesJson,
		operationInterface,
		searchInterface
	} from './utils';
	import {
		pathToBase64
	} from 'image-tools'
	export default {
		onLaunch: function () {
			plus.device.getInfo({
				success: (e) => {
					uni.setStorageSync('imei', e.imei)
				}
			})
			db.openDB('data')
			db.executeSQL(
				oneLine`
				CREATE TABLE if not exists [policeInfoTable] (
				  [id] INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
				  [policeIdcard] VARCHAR2(18), 
				  [policeName] VARCHAR2(20), 
				  [password] VARCHAR2(20), 
				  [otherData] VARCHAR2(20000), 
				  [token] VARCHAR2(200), 
				  [isRemeber] VARCHAR2
			)`
			)
			db.executeSQL(
				oneLine`
					CREATE TABLE if not exists [collectDataTable] (
					  [optargetId] varchar(255), 
					  [policeIdcard] varchar(255), 
					  [data] varchar(50000), 
					  [dataType] integer, 
					  [isUpload] integer, 
					  [relationId] varchar(255), 
					  [createdAt] datetime, checkException bool, IsSDFinish VARCHAR2 default 0);
				)`
			)
			// db.closeDB('data')
			// uni.navigateTo({
			// 	url: `pages/index/index`
			// })
			writeFile('开始进行统一认证')
			var receiver;
			var that = this
			var main = plus.android.runtimeMainActivity(); //获取activity    
			receiver = plus.android.implements('io.dcloud.android.content.BroadcastReceiver', {
				onReceive: function (context, intent) { //实现onReceiver回调函数    
					// alert(1);   
					// 接收到了广播
					console.log('我接收到了广播')
					that.unifiedCertification()
					main.unregisterReceiver(receiver); //取消监听    
				}
			});
			var IntentFilter = plus.android.importClass('android.content.IntentFilter');
			var Intent = plus.android.importClass('android.content.Intent');
			var filter = new IntentFilter();
			filter.addAction("com.ydjw.ua.ACTION_LOGIN"); //监听扫码广播    
			main.registerReceiver(receiver, filter); //注册监听
			this.unifiedCertification()

			// conosle.log(bundle)

			// plus.io.requestFileSystem(plus.io.PRIVATE_WWW, function(fs) {
			// 	// 可通过fs操作PRIVATE_WWW文件系统 
			// 	// ......
			// }, function(e) {
			// 	console.log("Request file system failed: " + e.message);
			// });
			// 请求本地文件系统对象
			// plus.io.requestFileSystem(
			// 	plus.io.PRIVATE_DOC, // 文件系统中的根目录
			// 	fs => {
			// 		// 创建或打开文件, fs.root是根目录操作对象,直接fs表示当前操作对象
			// 		fs.root.getFile('test.json', {
			// 			create: true // 文件不存在则创建
			// 		}, fileEntry => {
			// 			// 文件在手机中的路径
			// 			console.log(fileEntry.fullPath)
			// 			fileEntry.createWriter(writer => {
			// 				// 写入文件成功完成的回调函数
			// 				writer.onwrite = e => {
			// 					// console.log("写入数据成功");
			// 				};
			// 				// 写入数据
			// 				writer.write(JSON.stringify({
			// 					"sid": "c5516ec3-5965-4803-874c-799239049cdb",
			// 					"aqzx": "http://192.168.3.51:8100",
			// 					"middle": "http://192.168.104.245:7100",
			// 					"htdz": "http://192.168.104.245:7005"
			// 				}));
			// 			})
			// 		}, e => {
			// 			console.log("getFile failed: " + e.message);
			// 		});
			// 	},
			// 	e => {
			// 		console.log(e.message);
			// 	}
			// );
			console.log('App Launch');
		},
		onShow: function () {
			// this.getNotice()
			this.time = setInterval(this.uploadData, 120000)
			this.timeGetNotice = setInterval(this.getNotice, 120000)
		},
		onHide: function () {
			clearInterval(this.time)
			clearInterval(this.timeGetNotice)
			console.log('App Hide');
		},
		methods: {
			unifiedCertification() {
				let appId = '230000000000-3-1-8ac0185c24494028bbfd1df50385c220'; // 注册应用的时候获取到的
				var Uri = plus.android.importClass("android.net.Uri");
				let uri = Uri.parse("content://com.ydjw.ua.getCredential") //与统一认证建立连接
				var Activity = plus.android.runtimeMainActivity(); // 创建activity
				var resolver = Activity.getContentResolver();
				plus.android.importClass(resolver);
				var Bundle = plus.android.importClass("android.os.Bundle");
				var params = new Bundle()
				var paramsMessageId = getuuid() // 32位编码
				params.putString("messageId", paramsMessageId); //消息 ID
				params.putString("version", '1'); //接口版本号，当前为 1
				params.putString("appId", appId); //应用标识【应用注册时，由发布系统提供】，非空
				params.putString("orgId", "230000000000"); //归属机构标识【应用注册时，由应用发布系统提供】，非空
				params.putString("networkAreaCode", "3"); //网络区域类型【应用注册时，由应用发布系统提供】，非空
				params.putString("packageName", "com.hylink.wwpc"); //应用包名，可空
				writeFile(
					`传递参数为:packageName:com.hylink.wwpc\nmessageId:${paramsMessageId}\nversion:1\nappId:${appId}\norgId:230000000000\nnetworkAreaCode:3`,
					'开始统一认证')
				var bundle = resolver.call(uri, '', null, params)
				var message = bundle.getString("message")
				if (bundle == null) {
					writeFile('bundle为空获取票据失败', '统一认证返回信息')
					// throw Error('获取票据失败')
				} else {
					var resultCode = bundle.getInt('resultCode')
					console.log('resultCode', resultCode)
					if (resultCode == '-5') {
						return;
					}
					var messageId = bundle.getString("messageId");
					if (paramsMessageId == messageId) {
						var userCredential = bundle.getString("userCredential");
						var appCredential = bundle.getString("appCredential");
						uni.setStorageSync('appCredential', appCredential)
						uni.setStorageSync('userCredential', userCredential)
						console.log(appCredential, userCredential)
						writeFile(`获取票据成功`, '统一认证返回信息')
						// uni.navigateTo({
						// 	url: `/index/index/index`
						// })
						var personId = JSON.parse(userCredential).credential.load.userInfo.userId
						console.log(personId)
						// 登录成功服务统计对接
						var main = plus.android.runtimeMainActivity();
						var Statistics = plus.android.importClass('com.hylink.wwpc.sdkStatic');
						var statistics = new Statistics()
						statistics.getStatistics(main, personId)
						statistics.stopStatistics(main)
						// 寻址
						var Uri = plus.android.importClass("android.net.Uri");
						let uri = Uri.parse("content://com.ydjw.rsb.getResourceAddress")
						// var ContentResolver = plus.android.importClass("android.content.ContentResolver");
						var resolver = Activity.getContentResolver();
						plus.android.importClass(resolver);
						var Bundle = plus.android.importClass("android.os.Bundle");
						var params = new Bundle()
						let paramsMessageId = getuuid()
						params.putString("appCredential", appCredential); //消息 ID
						params.putString("version", "1"); //应用版本号
						params.putString("messageId", paramsMessageId); //messageId
						var bundleXz = resolver.call(uri, '', null, params)
						if (bundleXz == null) {
							writeFile(`获取应用资源地址失败,bundle为空`)
							// throw Error('获取应用资源地址失败,bundle为空')
						} else {
							var messageId = bundleXz.getString("messageId")
							var resourceList = bundleXz.getString("resourceList")
							console.log(messageId, resourceList)
							if (paramsMessageId == messageId) {
								var resultCode = bundleXz.getInt("resultCode")
								if (resultCode == 0) {
									// 寻址成功
									// uni.showToast({
									// 	title: '寻址成功'
									// })
									uni.setStorageSync('resourceList', resourceList)
									// writeFile(`资源:${resourceList}\n返回码:${resultCode}`)
								} else {
									// writeFile(`资源:${resourceList}\n返回码:${resultCode}`, '寻址失败')
								}
							}
						}

					}
				}
			},
			getNotice() {
				let condition = {
					"logicalOperate": "and",
					"keyValueList": [{
						"key": "imei",
						"relationOperator": "=",
						"value": uni.getStorageSync('imei'),
					}]
				}
				console.log('uuid', plus.device.uuid)
				this.$request('/ishasList', searchInterface(condition, false,
					'230000000000-3-0100-6f2a953fcdec475b997fb2e39ff4fc23', 'data'), "POST", "htdz").then(res => {
						// 打印调用成功回调
						let hasData = JSON.parse(res.data.dataList[0].fieldValues[0].value).result.hasNotice
						console.log(hasData)
						if (res.code == 200) {
							if (hasData) {
								uni.$emit('isRead', '222');
							} else {
								uni.$emit('isRead', '111');
							}
						}
					})
			},
			async upload(data) {
				let _this = this
				let imgData = []
				if (data.length == 0) {
					return
				}
				for (let item of data) {
					for (let value of item.data.imgData) {
						// console.log('item', item)
						await pathToBase64(value.img)
							.then(base64 => {
								imgData.push({
									img: base64
								})
							})
							.catch(error => {
								console.error(error)
							})

					}
					item.data.imgData = imgData
					let dataType = item.dataType == 15 ? '人员' : '车辆'
					console.log(operationInterface(getPatrolInquiriesJson(item, dataType)))
					this.$request('/save', operationInterface(getPatrolInquiriesJson(item, dataType),
						'230000000000-3-0600-2d85c929e85d4d21bd7c43f5ea0bf135'), "POST", "htdz").then(res => {
							console.log(res)
							if (res.code == 200) {
								// 将本条数据更新
								// db.openDB('data')
								db.updataSql(
									`UPDATE collectDataTable SET isUpload = '1' WHERE optargetId = '${item.optargetId}'`)
								// db.closeDB('data')
							} else { }
						}).catch(err => {
							console.log(err)
						})
				}

			},
			uploadData() {
				db.SelectData(this, 'person', oneLine`
				SELECT
					data,
					createdAt,
					isUpload,
					optargetId,
					checkException,
					dataType
				FROM
					collectDataTable 
				WHERE isUpload = 0
				`,
					false, (data) => {
						this.upload(data)
					})
			}
		}
	};
</script>

<style>
	/* 解决头条小程序组件内引入字体不生效的问题 */
	/* #ifdef MP-TOUTIAO */
	@font-face {
		font-family: uniicons;
		src: url('/static/uni.ttf');
	}

	/* #endif */
</style>