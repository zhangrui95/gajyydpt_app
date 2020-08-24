<template>
	<view class="index_container">
		<view class="index_header">
			<view class="header_title_block">
				<view class="wenzi">
					维稳盘查
				</view>
			</view>
			<view class="touxiang" @click="handleClick">
				<image src="../../static/userIcon.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="index_content">
			<view class="pancha_block">
				<view class="pancha_left">
					<view class="img_block">
						<image src="../../static/renyuan.png" mode="widthFix"></image>
					</view>
					<view class="text_block">
						<text class="jiahao">+</text> <text class="wenzi">人员核查</text>
					</view>
				</view>
				<view class="pancha_right">
					<view class="history_num">
						12
					</view>
					<view class="history_text">
						人员核查历史
					</view>
				</view>
			</view>
			<view class="pancha_block cheliang">
				<view class="pancha_left">
					<view class="img_block">
						<image src="../../static/che.png" mode="widthFix"></image>
					</view>
					<view class="text_block">
						<text class="jiahao">+</text> <text class="wenzi">车辆核查</text>
					</view>
				</view>
				<view class="pancha_right">
					<view class="history_num">
						12
					</view>
					<view class="history_text">
						车辆核查历史
					</view>
				</view>
			</view>
			<view class="point_block">
				<image src="../../static/weizhi.png" mode="widthFix"></image>
				火车站卡口
			</view>
		</view>
		<!-- 抽屉 -->
		<uni-drawer ref="drawer" width="80%">
			<view style="padding:32rpx;" class="drawer_container">
				<view class="drawer_userinfo_block">
					<view class="left_name">
						<view class="name">
							张三
						</view>
						<view class="addr">
							黑龙江哈尔滨市松北区
						</view>
					</view>
					<view class="right_touxiang">
						<image src="../../static/userIconborder.png" mode="widthFix"></image>
					</view>
				</view>
				<view class="opertion_list">
					<uni-list>
						<uni-list-item title="卡口设置" thumb="../../static/weizhi.png" thumb-size="lg" rightText="火车站卡口"></uni-list-item>
						<uni-list-item title="修改密码" thumb="../../static/mima.png" thumb-size="lg"></uni-list-item>
						<uni-list-item title="清除缓存" thumb="../../static/qingchu.png" thumb-size="lg"></uni-list-item>
						<uni-list-item title="检查版本" thumb="../../static/gengxin.png" thumb-size="lg" rightText="v1.0.0.1"></uni-list-item>
					</uni-list>
				</view>
				<view class="ogOut_block">
					<button type="default">退出登录</button>
				</view>
			</view>
		</uni-drawer>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			handleClick() {
				this.$refs.drawer.open();
			}
		}
	}
</script>

<style scoped>
	.index_container {
		height: 100vh;
		background-color: #F8F8F8;
	}

	.index_header {
		height: 25vh;
		width: 100%;
		background: url('~@/static/headBg.png');
		background-position: left;
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	.header_title_block {
		display: flex;
		align-items: center;
		text-align: center;
		justify-content: center;
		height: 180rpx;
		color: #fff;

	}

	.wenzi {
		font-weight: 500;
	}

	.touxiang image {
		width: 15%;
		position: absolute;
		top: 30rpx;
		left: 20rpx;
	}

	.pancha_block {
		width: 70%;
		height: 270rpx;
		margin: 0 auto;
		display: flex;
		box-shadow: 0px 0px 38px 0px rgba(194, 194, 194, 0.26);
		border-radius: 18rpx;
		padding: 43rpx;
	}

	.pancha_left {
		flex: 1;
		height: 270rpx;
		background: url('~@/static/orange.png');
		background-position: left;
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	.pancha_left .img_block {
		/* height: 140rpx; */
		text-align: center;
		margin: 24rpx 0;
		display: flex;
		height: 120rpx;
		align-items: center;
		justify-content: center;
	}

	.pancha_left .img_block image {
		width: 120rpx;
	}

	.pancha_left .text_block {
		text-align: center;
		color: #fff;
		font-weight: 700;
	}

	.pancha_left .text_block .jiahao {
		font-size: 46rpx;
		font-weight: 600;
	}

	.pancha_left .text_block .wenzi {
		font-size: 40rpx;
		font-weight: 600;
	}

	.pancha_right {
		flex: 1;
		height: 270rpx;
	}

	.pancha_right .history_num {
		color: #10A7D3;
		font-size: 96rpx;
		margin: 24rpx 0 20rpx 0;
		font-weight: 700;
		text-align: center;
	}

	.pancha_right .history_text {
		text-align: center;
		color: #BEBEBE;
		font-family: PingFangSC;

	}

	.cheliang {
		margin-top: 10%;
	}

	.cheliang .pancha_left {
		background: url('~@/static/green.png');
		background-position: left;
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	.point_block {
		display: flex;
		justify-content: center;
		align-items: center;
		color: #11A7D3;
		font-weight: bold;
		margin-top: 10%;
	}

	.point_block image {
		width: 46rpx;
		margin-right: 20rpx;
	}

	/* 抽屉样式 */
	/* .drawer_container{
		position: relative;
	} */
	.drawer_userinfo_block {
		height: 240rpx;
		display: flex;
		align-items: center;
	}

	.drawer_userinfo_block .left_name {
		flex: 3;
	}

	.drawer_userinfo_block .left_name .name {
		font-weight: 700;
		margin-bottom: 12rpx;
	}

	.drawer_userinfo_block .left_name .addr {
		font-size: 32rpx;
		color: #666666;

	}

	.drawer_userinfo_block .right_touxiang {
		flex: 1;
	}

	.drawer_userinfo_block .right_touxiang image {
		width: 100%;
	}

	/deep/ .uni-drawer__content {
		width: 80%;
	}

	/deep/ .uni-list-item {
		padding-left: 0;
	}
	.ogOut_block{
		position: absolute;
		bottom: 0;
		left: 0;
		/* width: 100%; */
		/* padding: 24rpx 36rpx; */
		width: 100%;
		margin-bottom: 10%;
	}
	.ogOut_block button{
		width: 80%;
		background: #fff;
		border:2rpx solid #11A7D3;
		color: #11A7D3;
		border-radius: 60rpx;
	}
	uni-button:after{
		border: none;
	}
</style>
