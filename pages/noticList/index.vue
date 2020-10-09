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
				dataList: [{
					"fbrxm": "张馨蕊",
					"nr": "123",
					"fbdwmc": "黑龙江省",
					"fslx": "1",
					"fbrbm": "33322201",
					"visibale": 1,
					"notice_id": "5fd4fcc10ac74e3bbd6031f828c77f2b",
					"bt": "123",
					"fsdwdj": "1",
					"isread": "1",
					"fbdwbm": "230000000000",
					"fsdwbm": "230000000000",
					"fbsj": "2020-09-28 10:02:18",
					"xhl": 1
				},
				{
					"fbrxm": "张馨蕊",
					"nr": "123",
					"fbdwmc": "黑龙江省",
					"fslx": "1",
					"fbrbm": "33322201",
					"visibale": 1,
					"notice_id": "5fd4fcc10ac74e3bbd6031f828c77f2b",
					"bt": "123",
					"fsdwdj": "1",
					"isread": "0",
					"fbdwbm": "230000000000",
					"fsdwbm": "230000000000",
					"fbsj": "2020-09-28 10:02:18",
					"xhl": 1
				}
				]
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
					"value": "864131031213992"
				},
				{
					"key": "mjjh",
					"relationOperator": "=",
					"value": getCredential().userCredential ? getCredential().userCredential.load.userInfo.jh : ''
				}
				]
			}
			this.$request('/notice/getNewPoliceNoticeList', searchInterface(condition, false,
				'230000000000-3-0100-56d51bb0e53749b983791e19b10534f8'), "POST", "htdz").then(res => {
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