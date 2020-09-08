//获取token
export const getUserToken = () => {
	// return sessionStorage.getItem('userToken') || '123123';
};
// 去掉模板字符串的换号
export const oneLine = (template, ...expressions) => {
	let result = template.reduce((prev, next, i) => {
		let expression = expressions[i - 1];
		return prev + expression + next;
	});

	result = result.replace(/(\n\s*)/g, " ");
	result = result.trim();

	return result;
}
// 上传信息
export const getPatrolInquiriesJson = (data, target) => {
	console.log(data)
	// {
	// 	"data": {
	// 		"idCard": "230221199602154813",
	// 		"imgData": [],
	// 		"real": "身份信息不完整本人与身份证不符",
	// 		"name": "陈亮",
	// 		"sex": "男",
	// 		"nation": "汉族",
	// 		"time": "1996-02-15",
	// 		"type": "",
	// 		"pinCard": "pin12934648",
	// 		"userName": "陈亮",
	// 		"tel": "手机号",
	// 		"engine": "Height9807",
	// 		"personData": []
	// 	},
	// 	"createdAt": "2020-09-02 08:40:47",
	// 	"isUpload": 0,
	// 	"optargetId": "23022119960215481320200902084047725",
	// 	"checkException": 0
	// }
	var locationId = ''
	var locationName = ''
	console.log(uni.getStorageSync('networkType'))
	if (uni.getStorageSync('networkType') == 'yes') {
		locationName = uni.getStorageSync('buckle')
		locationId = uni.getStorageSync('buckleId')
		// uni.getStorage({
		// 	key: 'buckleId',
		// 	success: function(res) {
		// 		console.log(res.data)
		// 		locationId = res.data;
		// 	}
		// });
	} else {
		locationName = uni.getStorageSync('buckle')
	}
	return {
		"optargetId": data.optargetId, //档案编号 生成规则 身份证号+当前日期精确到毫秒
		"dataType": target == '人员' ? 15 : 16,
		"checkException": data.checkException, //true 异常， false 正常
		"locationInfo": {
			"latitude": 0.0,
			"longitude": 0.0,
			"checkTime": new Date(data.createdAt).getTime(),
			"policeName": "policeName",
			"policeIdcard": "policeIdcard",
			"policeCode": "policeCode",
			"policeUnitCode": "policeUnitCode",
			"policeUnit": "policeUnit",
			"policeAreaCode": "policeAreaCode",
			"policeArea": "policeArea",
			"locationId": locationId, //卡口编号
			"locationName": locationName, //卡口名称
			"imei": plus.device.imei,
			"cid": "cid"
		},
		"idcardInfo": target == '人员' ? {
			"name": data.data.name,
			"sex": data.data.sex,
			"nation": data.data.nation,
			"idcard": data.data.idCard,
			"address": data.data.address,
			"birth": data.data.time,
			"photo": ""
		} : {},
		"idcardCompareInfo": target == '人员' ? data.data.insertTags : {},
		"carInfo": target == '车辆' ? {
			"licensePlateType": data.data.licensePlateType, //号牌种类
			"licensePlateTypeCode": data.data.licensePlateTypeCode, //号牌种类编码
			"licensePlateNo": data.data.idCard, //车牌号码
			"color": data.data.name, //车身颜色
			"colorCode": "", //车身颜色编码
			"model": "", //型号
			"brand": data.data.sex, //品牌
			"vinCode": data.data.pinCard, //VIN码
			"owner": data.data.userName, //车辆所有人
			"ownerTel": data.data.tel, //所有人联系方式
			"performState": "", //执行状态(不清楚)
			"isRoadside": false, //(不清楚)
			"abnormalState": false, //是否异常(不清楚)
			"photoPath": [], //车辆照片
			"remark": data.data.remark, //备注信息
			"engineNumber": data.data.engine //发动机号
		} : {},
		"carCompareInfo": target == '车辆' ? data.data.insertTags : {},
		"carRelateds": target == '车辆' ? data.data.personData.map(item => ({
			optargetId: item.optargetId
		})) : [],
		"paintRealInfo": { //写实信息
			"text": data.data.real,
			"photoPath": data.data.imgData.map(item => item.img),
		}
	}
}
