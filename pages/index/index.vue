<template>
	<view v-if="{isLogin}" class="login">
		<image class="logo" src="../../static/head.jpg"></image>
		<input class="input" :value="userName" type="number" placeholder="学号"/>
		<input class="input" :value="passWord" type="safe-password" placeholder="密码"/>
		<button class="button" type="primary" :loading="isLoading" @click="userLogin()">登录</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isLogin: true,
				username: '',
				password: '',
				isLoading: false,
			}
		},
		onLoad() {

		},
		methods: {
			userLogin() {
				
			}
		}
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
</style>
