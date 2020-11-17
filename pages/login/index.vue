<template>
	<view class="login_container">
		<view class="title_container">
			<view class="img_container">
				<image src="../../static/jh.png" mode="widthFix" class="title_img"></image>
			</view>
			<view class="text_container">
				<text>维稳盘查</text>
			</view>
			<view class="setting" v-if="setting" @click="updateSetting">
				<image class="image" src="../../static/setting.png"></image>
			</view>
		</view>
		<view v-if="setting" class="content_container">
			<view class="login_block">
				<view class="login_block_form">
					<form @submit="formSubmit">
						<view class="uni-form-item uni-column marBottom">
							<view class="icon_input">
								<view class="iconBlock">
									<image src="../../static/zh.png" mode="widthFix" class="icons"></image>
								</view>
								<view class="inputBlock">
									<input class="uni-input" name="username" placeholder="请输入用户名" />
								</view>

							</view>
						</view>
						<view class="uni-form-item uni-column marBottom">
							<view class="icon_input">
								<view class="iconBlock">
									<image src="../../static/mm.png" mode="widthFix" class="icons"></image>
								</view>
								<view class="inputBlock">
									<input class="uni-input" name="password" password="true" placeholder="请输入密码" />
								</view>

							</view>
						</view>
						<view class="uni-list">
							<label>
								<checkbox value="cb" /><text style="font-size: 32rpx;color: #3EC0DF;">记住密码</text>
							</label>
						</view>
						<view class="uni-btn-v">
							<button form-type="submit" class="loginBtn">登录</button>
						</view>
					</form>
				</view>
			</view>
		</view>
		<view v-else class="settingInput">
			<view>
				<text class="title">地址</text>
				<input class="inputSetting" v-model="address" name="address" placeholder="请输入" />
			</view>
			<view style="margin-top: 20rpx;">
				<text class="title">端口</text>
				<input class="inputSetting" v-model="port" name="port" placeholder="请输入" />
			</view>
			<view class="drawer_footer">
				<button @click="updateSetting('确定')" style="background: linear-gradient(#3AC7DE, #548DE4);" type="default" class="drawer_btn">
					确定
				</button>
				<button @click="updateSetting" style="background: linear-gradient(#FFBF32, #F88C56);margin-left: 80rpx;" type="default"
				 class="drawer_btn">
					取消
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	import MD5 from 'md5-es'
	var graceChecker = require("../../common/graceChecker.js");
	export default {
		data() {
			return {
				setting: true,
				port: '',
				address: ''
			}
		},
		methods: {
			updateSetting(type) {
				console.log(type)
				if (type == '确定') {
					console.log(123123)
					//定义表单规则
					var rule = [{
							name: "address",
							checkType: "notnull",
							checkRule: "",
							errorMsg: "请输入地址"
						},
						{
							name: "address",
							checkType: "reg",
							checkRule: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
							errorMsg: "请输入正确的ip地址"
						},
						{
							name: "port",
							checkType: "notnull",
							checkRule: "",
							errorMsg: "请输入端口"
						},
						{
							name: "port",
							checkType: "reg",
							checkRule: /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
							errorMsg: "请输入正确的端口"
						},
					];
					//进行表单检查
					var formData = {
						address: this.address,
						port: this.port
					};
					var checkRes = graceChecker.check(formData, rule);
					if (checkRes) {
						uni.showToast({
							title: '设置成功'
						})
						var that = this
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
											sid: 'c5516ec3-5965-4803-874c-799239049cdb',
											aqzx: `http://192.168.3.51:8100`, // 安全中心地址
											hddz: `http://${that.address}:${that.port}`, // 维稳盘查
											middle: `http://192.168.104.245:7005`
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
					} else {
						uni.showToast({
							title: graceChecker.error,
							icon: "none"
						});
						return
					}

					// 拷贝
					// plus.io.resolveLocalFileSystemURL("_doc/test.json", function(entry) {
					// 	entry.copyTo('_www/static',null, function() {
					// 		console.log('拷贝成功')
					// 	}, function(e) {
					// 		console.log('拷贝失败', e)
					// 	});
					// }, function(e) {
					// 	alert("Resolve file URL failed: " + e.message);
					// });
					// 拷贝
					// plus.io.resolveLocalFileSystemURL('_doc/test.json', function(entry) {
					// 	console.log(entry.fullPath)
					// 	plus.io.resolveLocalFileSystemURL("_www/", function(root) {
					// 		console.log(root.fullPath)
					// 		entry.copyTo(root, 'test.json', function(entry) {
					// 				console.log("New Path: " + entry.fullPath);
					// 			},
					// 			function(e) {
					// 				console.log("错1误" + JSON.stringify(e));
					// 			});
					// 	})
					// })
				}
				this.setting = !this.setting

			},
			formSubmit(e) {
				//定义表单规则
				var rule = [{
						name: "username",
						checkType: "notnull",
						checkRule: "",
						errorMsg: "请输入用户名"
					},
					{
						name: "password",
						checkType: "notnull",
						checkRule: "",
						errorMsg: "请输入密码"
					},
				];
				//进行表单检查
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				if (checkRes) {
					this.$request('/api/login', {
						"username": e.detail.value.username,
						"password": MD5.hash(e.detail.value.password),
						"sid": "94d6b5c3-068d-40ad-aa94-73c1e25e9035"
					}, "POST", "aqzx").then(res => {
						// 打印调用成功回调
						if (res.data) {
							uni.showToast({
								title: '登录成功',
								icon: "none",
								position: 'center',
							});
							setTimeout(function() {
								uni.navigateTo({
									url: '/pages/map/map'
								})
							}, 400)

						} else {
							if (res.error.code == '401') {
								uni.showToast({
									title: res.error.text,
									icon: "none",
									position: 'center'
								});
							}
						}
					})
				} else {
					uni.showToast({
						title: graceChecker.error,
						icon: "none",
						position: 'center'
					});
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.content {

		width: 100vw;
		height: 100vh;
		background-size: 100% 100%;
	}

	/* 框架定义组件的样式改变 */
	.uni-input-placeholder {
		color: #ccc;
	}

	.inputSetting {
		display: inline-block;
		font-size: 14px;
		color: #7B7B7B;
		overflow: inherit;
		background-color: #f4f4f4;
		margin-left: 40rpx;
		height: 80rpx;
		border-radius: 10rpx;
		padding-left: 20rpx;
		width: 400rpx;
	}

	.uni-btn-v {
		width: 100%;
	}

	.loginBtn {
		overflow: inherit;
		line-height: 2.2;
		background-color: #2943AB;
		color: #fff;
		box-shadow: 0px 5px 15px 0px #eee;
	}

	/* 自己写的样式 */
	.login_container {
		background-color: #fff;
		height: 100vh;
	}

	.title_container {
		height: 380rpx;
		background: url('../../static/headBg.png');
		padding: 40rpx 0;
		background-size: 100% 100%;
	}

	.title_container .img_container {
		text-align: center;
	}

	.title_container .img_container .title_img {
		height: 0;
		width: 20%;
		height: auto
	}

	.text_container {
		text-align: center;
		color: #FFFFFF;
		font-family: 宋体;
		letter-spacing: 20rpx;
		font-weight: 500;
		padding-left: 20rpx;
		font-size: 50rpx;
	}

	.content_container {
		position: relative;

	}

	.content_container .login_block {
		background-color: #fff;
		width: 90vw;
		height: 35vh;
		margin: 0 auto;
		position: absolute;
		top: 40rpx;
		left: calc((100vw - 90vw) / 2);
		border-radius: 15rpx;
		box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.05);
	}

	.content_container .login_block .login_block_form {
		margin: 50rpx;
	}

	.icon_input {
		height: 70rpx;
		display: flex;
		border-bottom: 3rpx solid #f2f2f2;
	}

	.iconBlock {
		flex: 1;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.inputBlock {
		flex: 5;
		align-items: center;
		justify-content: center;
	}

	.iconBlock .icons {
		width: 30%;
		height: 0;
		height: auto
	}

	.marBottom {
		margin-bottom: 32rpx;
	}

	.setting {
		position: absolute;
		top: 60rpx;
		right: 60rpx;

		.image {
			height: 20px;
			width: 20px;
		}
	}

	.uni-list {
		margin-bottom: 16rpx;
		text-align: right;
	}

	/deep/ uni-checkbox .uni-checkbox-input {
		height: 30rpx;
		width: 30rpx;
	}

	/deep/ uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked {
		background: #3EC0DF;
	}

	.settingInput {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 60px;

		.title {
			color: #7B7B7B;
			font-size: 32rpx;
		}

		.drawer_footer {
			position: absolute;
			bottom: 120rpx;
			display: flex;

			.drawer_btn {
				padding: 0 56rpx
			}
		}
	}
</style>
