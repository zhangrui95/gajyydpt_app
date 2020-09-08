<script>
	var db = require('./common/db.js')
	import {
		oneLine
	} from './utils';
	export default {
		onLaunch: function() {
			// 导入uri
			// var Uri = plus.android.importClass("android.net.Uri");
			// let uri = Uri.parse("content://com.ydjw.ua.getCredential")
			// var Activity = plus.android.runtimeMainActivity();
			// var ContentResolver = plus.android.importClass("android.content.ContentResolver");
			// var resolver = Activity.getContentResolver();
			// plus.android.importClass(resolver);
			// var Bundle = plus.android.importClass("android.os.Bundle");
			// var params = new Bundle()
			// console.log(params.putString("messageId", '11111'))
			// params.putString("messageId", '11111'); //消息 ID
			// params.putString("version", '1'); //接口版本号，当前为 1
			// params.putString("appId", "xxx"); //应用标识【应用注册时，由发布系统提供】，非空
			// params.putString("orgId", "xxx"); //归属机构标识【应用注册时，由应用发布系统提供】，非空
			// params.putString("networkAreaCode", "xxx"); //网络区域类型【应用注册时，由应用发布系统提供】，非空
			// params.putString("packageName ", "xxx"); //应用包名，可空
			// var bundle = resolver.call(uri, '', null, params)
			// var messageId = bundle.getString("messageId");
			// var version = bundle.getString("version");
			// var resultCode = bundle.getInt("resultCode");
			// var message = bundle.getString("message");
			// var userCredential = bundle.getString("userCredential");
			// var appCredential = bundle.getString("appCredential");
			// if(resultCode=='0'){
				
			// } else {
				
			// }
			// conosle.log(bundle)
			db.openDB('data')
			db.executeSQL(
				oneLine `
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
				oneLine `
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
			db.closeDB('data')
			// plus.io.requestFileSystem(plus.io.PRIVATE_WWW, function(fs) {
			// 	// 可通过fs操作PRIVATE_WWW文件系统 
			// 	// ......
			// }, function(e) {
			// 	console.log("Request file system failed: " + e.message);
			// });
			// 请求本地文件系统对象
			plus.io.requestFileSystem(
				plus.io.PRIVATE_DOC, // 文件系统中的根目录
				fs => {
					// 创建或打开文件, fs.root是根目录操作对象,直接fs表示当前操作对象
					fs.root.getFile('test.json', {
						create: true // 文件不存在则创建
					}, fileEntry => {
						// 文件在手机中的路径
						console.log(fileEntry.fullPath)
						fileEntry.createWriter(writer => {
							// 写入文件成功完成的回调函数
							writer.onwrite = e => {
								console.log("写入数据成功");
							};
							// 写入数据
							writer.write(JSON.stringify({
								"sid": "c5516ec3-5965-4803-874c-799239049cdb",
								"aqzx": "http://192.168.3.51:8100",
								"middle": "http://192.168.104.245:7100",
								"htdz": "http://192.168.104.245:7005"
							}));
						})
					}, e => {
						console.log("getFile failed: " + e.message);
					});
				},
				e => {
					console.log(e.message);
				}
			);
			console.log('App Launch');
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
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
