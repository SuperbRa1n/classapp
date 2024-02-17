<template>
	<view class="top-info" @click="goGrade">
		<text class="info-text" style="left: 5%;">总学分</text>
		<text class="info-value" style="left: 5%;">{{getTotalScore()}}</text>
		<text class="info-text" style="left: 28%;">平均绩点</text>
		<text class="info-value" style="left: 28%;">{{getAverageGrade()}}</text>
		<text class="info-text" style="left: 51%;">学分绩</text>
		<text class="info-value" style="left: 51%;">{{(getTotalScore() * getAverageGrade()).toFixed(2)}}</text>
		<text class="info-text" style="left: 74%;">百分制</text>
		<text class="info-value" style="left: 74%;">{{getAverageBFZ()}}</text>
		<image src="../../static/right.png" style="width: 60rpx; height: 60rpx; position: absolute; right: 0%; top: 40rpx;"></image>
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
			}
		}
	}
</script>

<style>
	.top-info {
		margin-top: 40rpx;
		background-color: #ffffff;
		padding-top: 20rpx;
		height: 100rpx;
		position: absolute;
		width: 100%;
	}
	
	.info-text {
		font-size: 18rpx;
		color: #808080;
		position: absolute;
		top: 20rpx;
	}
	
	.info-value {
		font-size: 36rpx;
		color: #000000;
		position: absolute;
		top: 60rpx;
	}
</style>
