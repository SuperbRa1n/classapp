<template>
	<view v-if="isLogin" class="login">
		<img class="logo" src="../../static/head.jpg">
		<!-- 输入学号密码存储到username和password两个变量中 -->
		<input class="input" @input="getUserName" :value="value" type="text" placeholder="学号" />
		<input class="input" @input="getPassWord" :value="value" type="text" placeholder="密码" />
		<button class="button" type="primary" :loading="isLoading" @click="userLogin()">登录</button>
	</view>
	<view v-if="!isLogin" class="setting">
		<view class="user">
			<img class="logo" src="../../static/head.jpg" />
			<br />
			<text v-if="xm==''" class="xm">{{信息加载中}}</text>
			<text v-else class="xm">{{xm}}</text>
		</view>
		<view class="refresh" style="margin-top: 20rpx">
			<text style="margin-left: 20rpx;">刷新设置</text>
			<view class="refresh-now" @click="getInfo">
				<image src="../../static/refresh.png" style="margin-left: 20rpx; width: 30rpx; height: 30rpx;"></image>
				<text style="margin-left: 10rpx;">立即刷新数据</text>
			</view>
		</view>
		<view class="refresh" style="margin-top: 20rpx">
			<text style="margin-left: 20rpx;">用户设置</text>
			<view class="refresh-now" @click="changeUser">
				<image src="../../static/user.png" style="margin-left: 20rpx; width: 30rpx; height: 30rpx;"></image>
				<text style="margin-left: 10rpx;">切换用户</text>
			</view>
		</view>
		<view class="refresh" style="margin-top: 20rpx">
			<text style="margin-left: 20rpx;">其他</text>
			<view class="refresh-now" @click="displayTiaokuan">
				<image src="../../static/info.png" style="margin-left: 20rpx; width: 30rpx; height: 30rpx;"></image>
				<text style="margin-left: 10rpx;">用户条款</text>
			</view>
			<view class="refresh-now" @click="aboutUs" style="margin-top: -20rpx; padding-top: 30rpx;">
				<image src="../../static/more.png" style="margin-left: 20rpx; width: 30rpx; height: 30rpx;"></image>
				<text style="margin-left: 10rpx;">关于我们</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isLogin: true,
				isLoading: false,
				username: '',
				password: '',
				classData: {},
				gradeData: {},
				xm: '',
				value: '',
				
			}
		},
		onLoad() {
			this.username = uni.getStorageSync('username');
			this.password = uni.getStorageSync('password');
			this.xm = uni.getStorageSync('xm');
			if (this.username != '') {
				this.isLogin = false;
				this.getInfo();
			} else {
				this.isLogin = true;
			}
		},
		methods: {
			userLogin() {
				this.isLoading = true;
				this.getInfo();
				uni.setStorageSync('username', this.username);
				uni.setStorageSync('password', this.password);
			},
			getInfo() {
				uni.request({
					url: 'http://192.168.31.211:5000/class',
					method: 'POST',
					data: {
						"username": this.username,
						"password": this.password
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					success: (res) => {
						this.isLoading = false;
						this.isLogin = false;
						console.log(res.data);
						this.classData = res.data;
						uni.setStorageSync('classData', this.classData);
					},
					fail: (err) => {
						console.log(err);
						this.isLoading = false;
					}
				});
				uni.request({
					url: 'http://192.168.31.211:5000/grade',
					method: "POST",
					data: {
						"username": this.username,
						"password": this.password
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					success: (res) => {
						this.isLoading = false;
						this.isLogin = false;
						console.log(res.data);
						this.gradeData = res.data;
						this.xm = res.data.items[0].xm;
						uni.setStorageSync('xm', this.xm);
						uni.setStorageSync('gradeData', this.gradeData);
					},
					fail: (err) => {
						console.log(err);
						this.isLoading = false;
					}
				});
			},
			getUserName(e) {
				this.username = e.detail.value;
			},
			getPassWord(e) {
				this.password = e.detail.value;
			},
			changeUser() {
				uni.removeStorageSync('username');
				uni.removeStorageSync('password');
				uni.removeStorageSync('xm');
				this.username = '';
				this.password = '';
				this.xm = '';
				this.isLogin = true;
			},
			displayTiaokuan() {
				uni.navigateTo({
					url: '../tiaokuan/tiaokuan'
				});
			},
			aboutUs() {
				uni.navigateTo({
					url: '../about/about'
				});
			}
		},
	}
</script>

<style>
	.login {
		display: block;
		margin-top: 80rpx;
		text-align: center;
	}

	.logo {
		width: 200rpx;
		height: 200rpx;
		display: inline-block;
		margin-top: 20rpx;
	}

	.input {
		width: 90%;
		margin-top: 20rpx;
		border-radius: 5%;
		display: inline-block;
		background-color: #ffffff;
		height: 100rpx;
	}

	.button {
		width: 60%;
		margin-top: 80rpx;
	}
	
	.user {
		display: block;
		text-align: center;
		margin-top: 0rpx;
		background-color: #ffffff;
		border-radius: 5%;
	}
	
	.xm {
		display: inline-block;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		font-size: 40rpx;
		font-family: '思源黑体';
		font-weight: bold;
		color: #4a90e2;
	}
	
	.refresh-now {
		display: block;
		margin-top: 20rpx;
		margin-left: 20rpx;
		margin-right: 20rpx;
		padding-top: 10rpx;
		padding-bottom: 10rpx;
		background-color: #ffffff;
		border-radius: 5%;
	}
</style>