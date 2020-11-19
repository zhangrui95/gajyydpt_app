/**
请求封装
url: 上传的地址 如 /abc
data: 上传的参数 如 {a:1,b:2}
type: 上传的方式 如 get post
urlType: 调用接口的地址前缀 和配置文件保持一致
upLoadType: 如果是file代表上传文件不是调用接口
file: 上传的本地路径
*/
import {
	getUserToken
} from '../utils';
var configUrl = {}
// http请求凭证(请求头配置)
// 统一认证 获取 应用凭证和用户凭证(base64字符串) 需要使用URlencode编码一下
// appCredential 应用凭证
// userCredential  用户凭证
// Content-Type: application/json;charset=UTF-8
var token =
	'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIyMzUwZDBiZC1kMTZhLTRhOTItYTEwZC1kOWNmN2NhMTBjOWQiLCJpYXQiOjE1OTkwMTkwMjAsInN1YiI6IjFhNjZiNWRjLWQ0YzMtNGUxNC05NGU1LWNmOTVmM2ZhNWVmYiIsImlzcyI6IlNlY3VyaXR5IENlbnRlciIsImRlcGFydG1lbnQiOnsiaWQiOiJiNjg2MWE1Zi0wMDY4LTQzZjUtYTM0MS1iZGI5MjE3M2Y2OWMiLCJwYXJlbnRJZCI6IjlhMmMwZmI0LWRlMzMtNDdjYy1hN2NkLWYzYmIyMWQyMDUzOSIsImRlcHRoIjozLCJuYW1lIjoi5Y2X5bKX5YiG5bGAIiwiY29kZSI6IjIzMDEwMzAwMDAwMCJ9LCJpZCI6IjFhNjZiNWRjLWQ0YzMtNGUxNC05NGU1LWNmOTVmM2ZhNWVmYiIsImlkQ2FyZCI6IjIzMTExOTE5ODUwMjI1NDU2OSIsInBjYXJkIjoiNzc4ODgwMDEiLCJuYW1lIjoi5Y2X5bKX5rCR6K2mIiwiam9iIjpbeyJjb2RlIjoiMjAwMDA5IiwibmFtZSI6Iui0oueJqeawkeitpiJ9XSwiY29udGFjdCI6IjEzMzMzMzMzMzMzIiwiaXNBZG1pbiI6MCwiYXBwTmFtZSI6Iua2ieahiOi0oueJqSIsImV4cCI6MTYwMTA5MjYyMH0.jjp2rci6WQCZ0yO8U_O6zKKOEoDn4pzCpZ-wAp7MvH4'
const request = (url = '', data = {}, type = 'GET', urlType = '', upLoadType = '', fileAddr,
	header = {
		'Content-Type': 'application/json;charset=UTF-8',
		'appCredential': encodeURIComponent(uni.getStorageSync('appCredential')),
		'userCredential': encodeURIComponent(uni.getStorageSync('userCredential'))
	}) => {
	return new Promise((resolve, reject) => {
		uni.getNetworkType({
			success: function (res) {
				let requestUrl = ''
				let resourceList = uni.getStorageSync('resourceList') ? JSON.parse(uni.getStorageSync('resourceList')) : ''
				switch (url) {
					case '/data/getCheckPointListForClient':
						requestUrl = resourceList.find((item) => item.resourceId ==
							'230000000000-3-0100-f84f1a0e5f1044a9bad306345ba17bf9').resourceAddress
						break;
					case '/getDataInfo':
						requestUrl = resourceList.find((item) => item.resourceId ==
							'230000000000-3-0100-b4e0d2be5dd147e49adc8e6ae4addac2').resourceAddress
						break;
					case '/getTagsInfo':
						requestUrl = resourceList.find((item) => item.resourceId ==
							'230000000000-3-0100-f63ed79512254e3e926fe7556a975089').resourceAddress
						break;
					case '/save':
						requestUrl = resourceList.find((item) => item.resourceId ==
							'230000000000-3-0600-2d85c929e85d4d21bd7c43f5ea0bf135').resourceAddress
						break;
					case '/jq/getJqTztgDetail':
						requestUrl = resourceList.find((item) => item.resourceId ==
							'230000000000-3-0100-1099d6f4305f4c0da0986f67b7d8767d').resourceAddress
						break;
					case '/notice/getNewPoliceNoticeList':
						requestUrl = resourceList.find((item) => item.resourceId ==
							'230000000000-3-0100-56d51bb0e53749b983791e19b10534f8').resourceAddress
						break;
					case '/ishasList':
						requestUrl = resourceList.find((item) => item.resourceId ==
							'230000000000-3-0100-6f2a953fcdec475b997fb2e39ff4fc23').resourceAddress
						break;
					case '/uploadGps':
						requestUrl = resourceList.find((item) => item.resourceId ==
							'230000000000-3-0100-dea86786075d41c796859bbabb5f4d78').resourceAddress
						break;
					default:
						requestUrl = urlType + url;
						break;
				}
				if (res.networkType != 'none') {
					uni.setStorageSync('networkType', 'yes')
					if (upLoadType == 'file') {
						uni.uploadFile({
							url: requestUrl, //仅为示例，非真实的接口地址
							filePath: fileAddr,
							name: 'file',
							formData: data
						}).then((response) => {
							setTimeout(function () {
								uni.hideLoading();
							}, 200);
							let [error, res] = response;
							resolve(res);
						}).catch(error => {
							let [err, res] = error;
							reject(err)
						});
					} else {
						uni.request({
							method: type,
							url: requestUrl,
							data: data,
							header: header,
							dataType: 'json',
						}).then((response) => {
							setTimeout(function () {
								uni.hideLoading();
							}, 200);
							let [error, res] = response;
							resolve(res.data);
						}).catch(error => {
							let [err, res] = error;
							reject(err)
						})
					}
				} else {
					uni.setStorageSync('networkType', 'no')
					uni.showToast({
						title: '网络异常,请检查网络',
						icon: 'none'
					})
				}
			}
		})
		// let configUrl = JSON.parse(configUrl)
		// 原始模式是从配置文件中读取地址,现在采用寻址的方式
		// plus.io.resolveLocalFileSystemURL('_doc/test.json', function(entry) {
		// 		// 可通过entry对象操作test.html文件 
		// 		entry.file(function(file) {
		// 			var fileReader = new plus.io.FileReader();
		// 			fileReader.readAsText(file, 'utf-8');
		// 			fileReader.onloadend = function(evt) {
		// 				configUrl = JSON.parse(evt.target.result);
		// 			}
		// 		});
		// 	},
		// 	function(e) {
		// 		console.log("Resolve file URL failed: " + e.message);
		// 	});

	});
}
export default request
