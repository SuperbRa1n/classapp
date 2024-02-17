<template>
	<view class="top-info">
		<text class="info-text" style="left: 5%;">总学分</text>
		<text class="info-value" style="left: 5%;">{{getTotalScore()}}</text>
		<text class="info-text" style="left: 28%;">总均绩</text>
		<text class="info-value" style="left: 28%;">{{getAverageGrade()}}</text>
		<text class="info-text" style="left: 51%;">学分绩</text>
		<text class="info-value" style="left: 51%;">{{(getTotalScore() * getAverageGrade()).toFixed(2)}}</text>
		<text class="info-text" style="left: 74%;">百分制</text>
		<text class="info-value" style="left: 74%;">{{getAverageBFZ()}}</text>
	</view>
	<view class="top-info-2">
		<text class="info-text-2" style="left: 5%;">学期学分</text>
		<text class="info-value-2" style="left: 5%;">{{getTotalScore()}}</text>
		<text class="info-text-2" style="left: 28%;">学期均绩</text>
		<text class="info-value-2" style="left: 28%;">{{getAverageGrade()}}</text>
		<text class="info-text-2" style="left: 51%;">学年学分</text>
		<text class="info-value-2" style="left: 51%;">{{getTotalScore()}}</text>
		<text class="info-text-2" style="left: 74%;">学年均绩</text>
		<text class="info-value-2" style="left: 74%;">{{getAverageGrade()}}</text>
	</view>
	<view class="grade">
		<scroll-view scroll-y="true" >
			<view class="grade-info" v-for="(item, index) in gradeData.items">
				<text class="grade-text">{{item.kcmc}}</text>
				<text class="grade-xf">{{item.xf}}学分</text>
				<text class="grade-jd">{{item.jd}}/{{item.bfzcj}}</text>
				<!-- 根据绩点大小绘制进度条 -->
				<view class="progress" style="position: absolute; left: 5%; top: 60rpx; width: 80%; height: 10rpx; background-color: #f0f0f0;">
					<view class="progress-inner" style="position: absolute; left: 0; top: 0; width: {{item.jd / 5 * 80}}%; height: 10rpx; background-color: #4a90e2;"></view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				classData: uni.getStorageSync('classData'),
				gradeData: uni.getStorageSync('gradeData'),
			}
		},
		methods: {
			getTotalScore() {
				var totalScore = 0;
				var items = this.gradeData.items;
				for (var i = 0; i < items.length; i++) {
					totalScore += parseFloat(items[i].xf);
				}
				return totalScore;
			},
			getAverageGrade() {
				var totalScore = 0;
				var totalGrade = 0;
				var items = this.gradeData.items;
				for (var i = 0; i < items.length; i++) {
					totalScore += parseFloat(items[i].xf);
					totalGrade += parseFloat(items[i].jd) * parseFloat(items[i].xf);
				}
				return (totalGrade / totalScore).toFixed(2);
			},
			getAverageBFZ() {
				var totalScore = 0;
				var totalGrade = 0;
				var items = this.gradeData.items;
				for (var i = 0; i < items.length; i++) {
					totalScore += parseFloat(items[i].xf);
					totalGrade += parseFloat(items[i].bfzcj) * parseFloat(items[i].xf);
				}
				return (totalGrade / totalScore).toFixed(2);
			},
			goGrade() {
				uni.navigateTo({
					url: '/pages/grade/grade'
				});
			},
		}
	}
</script>

<style>
	.top-info {
		background-color: #4a90e2;
		padding-top: 20rpx;
		height: 100rpx;
		position: absolute;
		width: 100%;
	}
	
	.info-text {
		font-size: 18rpx;
		color: #ffffff;
		position: absolute;
		top: 20rpx;
	}
	
	.info-value {
		font-size: 36rpx;
		color: #ffffff;
		position: absolute;
		top: 60rpx;
		font-weight: bold;
	}
	
	.top-info-2 {
		top: 120rpx;
		background-color: #ffffff;
		padding-top: 20rpx;
		height: 100rpx;
		position: absolute;
		width: 100%;
	}
	
	.info-text-2 {
		font-size: 18rpx;
		color: #000000;
		position: absolute;
		top: 20rpx;
	}
	
	.info-value-2 {
		font-size: 36rpx;
		color: #4a90e2;
		position: absolute;
		top: 60rpx;
		font-weight: bold;
	}
	
	.grade {
		margin-top: 260rpx;
		position: absolute;
		width: 90%;
		left: 5%;
	}
	
	.grade-info {
		background-color: #ffffff;
		height: 100rpx;
		position: relative;
		width: 100%;
		top: 10rpx;
		border-radius: 5%;
		margin-bottom: 20rpx;
	}
	
	.grade-text {
		font-size: 18rpx;
		color: #000000;
		position: absolute;
		left: 5%;
		top: 20rpx;
	}
	
	.grade-xf {
		font-size: 18rpx;
		color: #000000;
		position: absolute;
		left: 50%;
		top: 20rpx;
	}
	
	.grade-jd {
		font-size: 18rpx;
		color: #000000;
		position: absolute;
		left: 80%;
		top: 20rpx;
	}
</style>
