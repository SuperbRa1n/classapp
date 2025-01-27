<template>
	<view class="container">
	  <image src="https://tannin-1316822731.cos.ap-nanjing.myqcloud.com/2024-07-06-%E5%9B%BE%E7%89%871.png" class="logo" />
	  <text class="title">登录界面</text>
	  <input 
		class="input" 
		placeholder="学号" 
		v-model="username" 
	  />
	  <input 
		class="input" 
		placeholder="学校通行证密码" 
		v-model="password" 
		password 
	  />
	  <view class="checkbox-container">
		<view class="checkbox" @tap="toggleCheckbox">
		  <view v-if="checked" class="checked-box"></view>
		</view>
		<text>同意 免责声明、隐私政策等服务条款</text>
	  </view>
	  <button 
		class="button" 
		@tap="handleLoginPress" 
		:disabled="isLoading"
	  >
		<block v-if="isLoading">
		  <text>登录中...</text>
		</block>
		<block v-else>
		  <text>登录</text>
		</block>
	  </button>
	  <view>
		<text>{{ message }}</text>
	  </view>
	</view>
  </template>
  
  <script>
  import { getClassInfo, getGradeInfo, getUserInfo, BASE_URL, LOGIN } from '@/utils/api.js';
  
  export default {
	data() {
	  return {
		username: '',
		password: '',
		checked: false,
		isLoading: false,
		message: '',
	  };
	},
	methods: {
	  toggleCheckbox() {
		this.checked = !this.checked;
	  },
	  async handleLoginPress() {
		if (!this.checked) {
		  uni.showToast({
			title: '请先同意服务条款',
			icon: 'none',
		  });
		  return;
		}
		this.isLoading = true;
		this.message = '正在登录……';
  
		const data = {
		  username: this.username,
      password: this.password,
		};
  
		try {
      console.log('data', data)
		  const res = await uni.request({
			url: BASE_URL + LOGIN,
			method: 'POST',
			data,
			header: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/x-www-form-urlencoded',
			},
		  });
  
		  if (res.data?.status === '登录成功') {
			this.message = '登录成功，正在获取课程和成绩信息，请耐心等待……';
  
			// 存储用户名和密码
			uni.setStorageSync('username', this.username);
			uni.setStorageSync('password', this.password);
  
			const JSESSIONID = res.data.JSESSIONID;
  
			// 获取用户信息、课程信息和成绩信息
			const userInfo = await getUserInfo(JSESSIONID);
			uni.setStorageSync('userInfo', userInfo);
  
			const classInfo = await getClassInfo(JSESSIONID);
			uni.setStorageSync('classInfo', classInfo);
  
			const gradeInfo = await getGradeInfo(JSESSIONID);
			uni.setStorageSync('gradeInfo', gradeInfo);
  
			this.isLoading = false;
		  } else {
			// 登录失败处理
			uni.showModal({
			  title: '登录失败',
			  content: res.data?.status || '未知错误',
			  showCancel: false,
			});
			this.isLoading = false;
		  }
		} catch (error) {
		  console.error('登录出错:', error);
		  uni.showToast({
			title: '登录失败，请稍后重试',
			icon: 'none',
		  });
		  this.isLoading = false;
		}
	  },
	},
  };
  </script>
  
  <style>
  .container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 20px;
	background-color: #fff;
	height: 100vh;
  }
  .logo {
	width: 100%;
	height: 100px;
	margin-bottom: 20px;
  }
  .title {
	font-size: 20px;
	margin-bottom: 20px;
  }
  .input {
	width: 100%;
	padding: 10px;
	margin-bottom: 20px;
	border: 1px solid #ccc;
	border-radius: 5px;
  }
  .checkbox-container {
	display: flex;
	align-items: center;
	margin-bottom: 20px;
  }
  .checkbox {
	width: 20px;
	height: 20px;
	border: 1px solid #ccc;
	margin-right: 10px;
	justify-content: center;
	align-items: center;
  }
  .checked-box {
	width: 14px;
	height: 14px;
	background-color: #000;
  }
  .button {
	background-color: #007BFF;
	color: #fff;
	padding: 10px 20px;
	border-radius: 5px;
	text-align: center;
	margin-bottom: 20px;
  }
  </style>
  