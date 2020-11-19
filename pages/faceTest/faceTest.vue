<template>
	<view>
		<view class="rxBox">
			<text class="imgTitle">二代证照片</text>
			<view class="imgBox">
				<image :src="idCardImg ? idCardImg : '../../static/renyuan.png'" class="sfzImg"></image>
			</view>
		</view>
		<view class="rxBox">
			<text class="imgTitle">拍摄照片</text>
			<view class="imgBox" @click="take_photo" v-if="imgData.length == 0">
				<image src="../../static/xj.png" class="pzIcon"></image>
				<text>拍摄照片</text>
			</view>
			<view class="imgBox" v-for="(item,index) in imgData" :key="index" v-if="imgData.length > 0">
				<image class="sfzImg" @longtap="longtap(index)" @click="preview(item.img)" style="width:100%; height:100% " :src="item.img" mode="">
				</image>
			</view>
		</view>
		<view class="bdJg" v-if="(data && data < 60) || data === 0">
			<image src="../../static/error.png" class="bdIcon"></image>
			<text class="bdText" v-if="data === 0 || data < 0">人像比对失败</text>
			<text class="bdText" v-if="data && data < 60 && data > 0">相似度：{{data}}%，不通过</text>
		</view>
		<view class="bdJg"  v-if="data >= 60">
			<image src="../../static/success.png" class="bdIcon"></image>
			<text class="bdTextSuccess">相似度：{{data}}%，通过</text>
		</view>
		<button class="btn" v-if="bdReturn" @click="getBack">完成</button>
	</view>
</template>

<script>
	import {
		pathToBase64
	} from 'image-tools';
	var FaceInit = plus.android.importClass('com.hylink.wwpc.faceutil.FaceContrastUtil');
	var face = new FaceInit();
	var AssetsHelper = plus.android.importClass('com.hylink.wwpc.faceutil.AssetsHelper');
	var Helper = new AssetsHelper();
	export default {
		data() {
			return {
				imgData:[],
				bdReturn:'',
				idCardImg:'',
				data:'',
			}
		},
		onShow() {
			this.myEventManager = plus.android.importClass("com.hylink.wwpc.MyEventManager");
			this.eventManager = this.myEventManager.getMyEventManager();
			//新建监听器
			var _this = this
			this.myListener = plus.android.implements("com.hylink.wwpc.MyListener", {
				onChange: function(event) {
					//导入类  
					plus.android.importClass(event);
					console.log('faceinfo获取返回数据：',event.getData());
					_this.data = parseInt(event.getData());
					_this.bdReturn = _this.data && _this.data > 60 ? 'success' : 'fail';
				}
			});
			this.myListenerSuc = plus.android.implements("com.hylink.wwpc.MyListener", {
				onChange: function(event) {
					//导入类  
					plus.android.importClass(event);
					console.log('isSuc获取返回数据：',event.getData());
				}
			}) 
			this.eventManager.addListener("faceinfo", this.myListener);
			this.eventManager.addListener("isSuc", this.myListenerSuc);
			this.eventManager = null
			this.myEventManager = null
			this.myListener = null
		},
		onHide() {
			this.myEventManager = plus.android.importClass("com.hylink.wwpc.MyEventManager");
			this.eventManager = this.myEventManager.getMyEventManager();
			this.eventManager.removeListener("faceinfo");
			this.eventManager.removeListener("isSuc");
		},
		onLoad:function(option){
			Helper.copyAssetsToDst();
			this.idCardImg = option.idCardImg;
			console.log('idCardImg=====>',idCardImg)
		},
		methods: {
			// 预览
			preview(img) {
				uni.previewImage({
					urls: [img],
					longPressActions: {
						success: function(data) {},
						fail: function(err) {}
					}
				});
			},
			longtap(index) {
				let that = this;
				uni.showModal({
					title: '删除',
					content: '请问是要删除这张照片吗？',
					success: function(res) {
						if (res.confirm) {
							that.imgData.splice(index, 1)
							that.bdReturn = '';
						} else if (res.cancel) {}
					}
				});
			},
			getBack(){
				let pages = getCurrentPages();
				let prevPage = pages[ pages.length - 2 ];  //上一页页面实例
				prevPage.$vm.faceTest = this.bdReturn;  
				uni.navigateBack({ 
					delta: 1
				});
			},
			async uploadData(url) {
				let _this = this
				let baseUrl64;
					await pathToBase64(url)
						.then(base64 => {
							let arrayBuffer = uni.base64ToArrayBuffer(base64);
							let array = new Uint8Array(arrayBuffer);
							var main = plus.android.runtimeMainActivity();
							face.init();
							face.base64Contrast(_this.idCardImg.split(',')[1],base64.split(',')[1]);
							uni.hideLoading();
						})
						.catch(error => {
							console.error(error)
						})
			},
			take_photo() {
				var _this = this
				_this.imgBack = '1'
				uni.chooseImage({
					count: 6, //默认9
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: function(res) {
						uni.showLoading({
						    title: '图片比对中'
						});
						let url =  res.tempFilePaths[0];
						_this.imgData.push({
							img: url
						});
						console.log('url====>',url);
						_this.uploadData(url);
					}
				});
			},
		}
	}
</script>

<style>
	.bdJg{
		position: absolute;
		top: 220px;
		left: 160px;
	}
	.bdIcon{
		width: 60px;
		height: 60px;
		float: left;
	}
	.bdTextSuccess{
		color: #67c23a;
		float: left;
		margin:20px 12px;
	}
	.bdText{
		color: #f0441c;
		float: left;
		margin:20px 12px;
	}
	.rxBox{
		width: calc(100% - 32px);
		overflow: hidden;
		margin: 40px 16px;
	}
	.sfzImg{
		width: 100%;
		height: 100%;
		border-radius: 10px;
	}
	.imgTitle{
		color: #3EBFDF;
		font-size: 14px;
		float: left;
		width: 70px;
	}
	.imgBox{
		background: #ccc;
		height: 190px;
		width: 170px;
		float: left;
		border-radius: 10px;
		margin-left: 16px;
		text-align: center;
	}
	.pzIcon{
		width: 60px;
		height: 50px;
		margin: 50px 55px 10px;
	}
	.btn{
		background: linear-gradient(45deg, #5edbe6, #4480f9);
		border-radius: 100px;
		width: 80%;
		color: #fff;
	}
</style>
