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
	header = url == '/data/getCheckPointListForClient' ? {
		Authorization: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJiNmQ5ZTFiYi03ZGQ2LTQzMWEtOTYxYy1hMTI0NzkwY2Q4YjAiLCJpYXQiOjE1OTkxODEzMzMsInN1YiI6IjI0MTgiLCJpc3MiOiJTZWN1cml0eSBDZW50ZXIiLCJkZXBhcnRtZW50Ijp7ImlkIjozNDk3LCJwYXJlbnRJZCI6MzQ5NiwiZGVwdGgiOjIsIm5hbWUiOiLlronovr7luIIiLCJjb2RlIjoiMjMxMjgxMDAwMDAwIn0sImdvdmVybm1lbnQiOltdLCJpZCI6MjQxOCwiaWRDYXJkIjoiMjMwMTA2MTk4ODA1MDcwNDEzIiwicGNhcmQiOiIwMDAxMDAiLCJuYW1lIjoi5rWL6K-VIiwiam9iIjpbeyJjb2RlIjoiMjAwMDAxIiwibmFtZSI6IuawkeitpiJ9XSwiY29udGFjdCI6IjEzNjEzNjAwODMwIiwiaXNBZG1pbiI6MCwiZXhwIjoxNjAxMjU0OTMzfQ.bv2L1wKKxFReqeWN2so8Tu4cd_OFMWw5s_u-3g-H9vE'
	} : {
		token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJlYjViOTdiOS0yMGZjLTQ3MWMtYTBhMS1mZTQ2OGJmMjgzYzciLCJpYXQiOjE1OTkwMTQzODYsInN1YiI6IjI0MTgiLCJpc3MiOiJTZWN1cml0eSBDZW50ZXIiLCJkZXBhcnRtZW50Ijp7ImlkIjozNDk3LCJwYXJlbnRJZCI6MzQ5NiwiZGVwdGgiOjIsIm5hbWUiOiLlronovr7luIIiLCJjb2RlIjoiMjMxMjgxMDAwMDAwIn0sImdvdmVybm1lbnQiOltdLCJpZCI6MjQxOCwiaWRDYXJkIjoiMjMwMTA2MTk4ODA1MDcwNDEzIiwicGNhcmQiOiIwMDAxMDAiLCJuYW1lIjoi5rWL6K-VIiwiam9iIjpbeyJjb2RlIjoiMjAwMDAxIiwibmFtZSI6IuawkeitpiJ9XSwiY29udGFjdCI6IjEzNjEzNjAwODMwIiwiaXNBZG1pbiI6MCwiZXhwIjoxNjAxMDg3OTg2fQ.YqL1HRg9iKEwJL89EOz5mX3vwghD7jCxS_3xuTJMQVg'
	}) => {
	return new Promise((resolve, reject) => {
		// let configUrl = JSON.parse(configUrl)
		plus.io.resolveLocalFileSystemURL('_doc/test.json', function(entry) {
				// 可通过entry对象操作test.html文件 
				entry.file(function(file) {
					var fileReader = new plus.io.FileReader();
					fileReader.readAsText(file, 'utf-8');
					fileReader.onloadend = function(evt) {
						configUrl = JSON.parse(evt.target.result);
						uni.getNetworkType({
							success: function(res) {
								if (res.networkType != 'none') {
									uni.setStorageSync('networkType', 'yes')
									if (upLoadType == 'file') {
										uni.uploadFile({
											url: configUrl[urlType] + url, //仅为示例，非真实的接口地址
											filePath: fileAddr,
											name: 'file',
											formData: data
										}).then((response) => {
											setTimeout(function() {
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
											url: configUrl[urlType] + url,
											data: data,
											header: header,
											dataType: 'json',
										}).then((response) => {
											console.log(response)
											setTimeout(function() {
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
					}
				});
			},
			function(e) {
				console.log("Resolve file URL failed: " + e.message);
			});

	});
}
export default request
