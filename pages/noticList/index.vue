<template>
	<view>
		<uni-list :border="true">
			<!-- 右侧带角标 -->
			<uni-list-chat v-for="(item,index) in dataList" :key="index" :title="item.bt" :clickable="true"
				@click="routerDetail(item.notice_id)" type="notic" :isRead="item.isread" :time="item.fbsj" :status='status'
				:note="'<div>发布单位:'+item['fbdwmc']+'</div><div>发布人:'+item.fbrxm+'</div>'">
				<!-- <view class="example-body">
				<view class="tag-view">
					<uni-tag text="确认" type="success"/>
				</view>
			</view> -->
			</uni-list-chat>
		</uni-list>
	</view>
</template>
<script>
	import {
		searchInterface,
		getCredential
	} from '../../utils';
	export default {
		data() {
			return {
				status: 0,
				dataList: []
			}
		},
		onShow() {
			let condition = {
				"logicalOperate": "and",
				"keyValueList": [{
					"key": "mjdwdm",
					"relationOperator": "=",
					"value": "230000000000",
				},
				{
					"key": "imei",
					"relationOperator": "=",
					"value":uni.getStorageSync('imei')
				},
				{
					"key": "mjjh",
					"relationOperator": "=",
					"value": getCredential().userCredential ? getCredential().userCredential.load.userInfo.jh : ''
				}
				]
			}
			// uni.showLoading({
			// 				title: '正在加载...',
			// 				mask: true
			// 			})
			this.$request('/notice/getNewPoliceNoticeList', searchInterface(condition, false,
				'230000000000-3-0100-56d51bb0e53749b983791e19b10534f8','data'), "POST", "htdz").then(res => {
					console.log(res) 
					// this.dataList = JSON.parse(res.data.dataList[0].fieldValues[0].value).result.list
					// console.log(this.dataList)
					// 打印调用成功回调
				})
			// uni.request({
			// 	method: 'post',
			// 	url: 'http://192.168.104.250:7701/notice/getNewPoliceNoticeList',
			// 	data: {
			// 		"mjdwdm": '230000000000',
			// 		"mjjh": '104529',
			// 		"imei": '864131031213992'
			// 	},
			// 	header: {
			// 		Authorization: '1111'
			// 	},
			// 	dataType: 'json',
			// }).then((response) => {
			// 	console.log(response)
			// }).catch(error => {
			// 	console.log(response)
			// })
		},
		methods: {
			routerDetail(id) {
				uni.navigateTo({
					url: `/pages/noticList/noticDetail?id=${id}`
				})
			}
		}
	}
</script>
<style>
</style>