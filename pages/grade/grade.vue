<template>
  <view class="page-wraper">
    <view class="header">
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
        <text class="info-value-2" style="left: 5%;">{{getXueqiScore()}}</text>
        <text class="info-text-2" style="left: 28%;">学期均绩</text>
        <text class="info-value-2" style="left: 28%;">{{getXueqiAverageGrade()}}</text>
        <text class="info-text-2" style="left: 51%;">学年学分</text>
        <text class="info-value-2" style="left: 51%;">{{getXuenianScore()}}</text>
        <text class="info-text-2" style="left: 74%;">学年均绩</text>
        <text class="info-value-2" style="left: 74%;">{{getXuenianGrade()}}</text>
      </view>
    </view>
    <view class="grade">
      <scroll-view class="scroll" :scroll-y="true" style="height: 100%;" :scroll-with-animation="true">
        <view class="grade-info" v-for="(item, index) in gradeData[getCurIndex()].items">
          <text class="grade-text">{{item.kcmc}}</text>
          <text class="grade-xf">{{item.xf}}学分</text>
          <text class="grade-jd">{{item.jd}}/{{item.bfzcj}}</text>
          <!-- 根据绩点大小绘制进度条 -->
          <view class="progress" style="position: absolute; left: 5%; top: 60rpx; width: 90%; height: 10rpx; background-color: #f0f0f0;">
            <view class="progress-now" :style="'width:' + (item.jd * 20) + '%; height: 10rpx; background-color: #4a90e2; position: absolute; top: 0; left: 0;'"></view>
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="footer">
      <scroll-view class="xueqi" :scroll-x="true" style="width: 100%;">
        <view style="display: flex; flex-direction: row;">
          <view class="xueqi-item" v-for="(item, index) in xueqiList" @click="changeXueqi(index)" :style="'background-color:' + (item == curXueqi ? '#ffffff' : '#4a90e2') + '; color:' + (item == curXueqi ? '#4a90e2' : '#ffffff')">
            <text>{{item}}</text>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
	export default {
		data() {
			return {
				classData: uni.getStorageSync('classData'),
				gradeData: uni.getStorageSync('gradeData'),
        xueqiGrade: [],
        curXueqi: '2023-2024-1',
        xueqi: [],
        xueqiList: [],
			}
		},
    onLoad() {
      // 加载成绩数据
      this.gradeData = uni.getStorageSync('gradeData');
      // 按照百分制成绩进行排序
      for (var i=0; i < this.gradeData.length; i++) {
        this.gradeData[i].items.sort((a, b) => {
          return parseFloat(b.bfzcj) - parseFloat(a.bfzcj);
        });
      }
      this.getXueqiList();
    },
		methods: {
			getTotalScore() {
				var totalScore = 0;
        for (var i = 0; i < this.gradeData.length; i++) {
          for (var j = 0; j < this.gradeData[i].items.length; j++) {
            totalScore += parseFloat(this.gradeData[i].items[j].xf);
          }
        }
				return totalScore;
			},
			getAverageGrade() {
				var totalScore = 0;
				var totalGrade = 0;
        for (var i = 0; i < this.gradeData.length; i++) {
          for (var j = 0; j < this.gradeData[i].items.length; j++) {
            totalScore += parseFloat(this.gradeData[i].items[j].xf);
            totalGrade += parseFloat(this.gradeData[i].items[j].jd) * parseFloat(this.gradeData[i].items[j].xf);
          }
        }
				return (totalGrade / totalScore).toFixed(2);
			},
			getAverageBFZ() {
				var totalScore = 0;
				var totalGrade = 0;
        for (var i = 0; i < this.gradeData.length; i++) {
          for (var j = 0; j < this.gradeData[i].items.length; j++) {
            totalScore += parseFloat(this.gradeData[i].items[j].xf);
            totalGrade += parseFloat(this.gradeData[i].items[j].bfzcj) * parseFloat(this.gradeData[i].items[j].xf);
          }
        }
				return (totalGrade / totalScore).toFixed(2);
			},
			goGrade() {
				uni.navigateTo({
					url: '/pages/grade/grade'
				});
			},
      getXueqiScore() {
        var totalScore = 0;
        var items = this.gradeData[this.getCurIndex()].items;
        for (var i = 0; i < items.length; i++) {
          totalScore += parseFloat(items[i].xf);
        }
        return totalScore;
      },
      getXueqiAverageGrade() {
        var totalScore = 0;
        var totalGrade = 0;
        var items = this.gradeData[this.getCurIndex()].items;
        for (var i = 0; i < items.length; i++) {
          totalScore += parseFloat(items[i].xf);
          totalGrade += parseFloat(items[i].jd) * parseFloat(items[i].xf);
        }
        return (totalGrade / totalScore).toFixed(2);
      },
      getXuenianScore() {
        var totalScore = 0;
        for (var i = 0; i < this.gradeData.length; i++) {
          for (var j = 0; j < this.gradeData[i].items.length; j++) {
            if (this.gradeData[i].items[j].xnmmc == this.gradeData[this.getCurIndex()].items[0].xnmmc) {
              totalScore += parseFloat(this.gradeData[i].items[j].xf);
            }
          }
        }
        return totalScore;
      },
      getXuenianGrade() {
        var totalScore = 0;
        var totalGrade = 0;
        for (var i = 0; i < this.gradeData.length; i++) {
          for (var j = 0; j < this.gradeData[i].items.length; j++) {
            if (this.gradeData[i].items[j].xnmmc == this.gradeData[this.getCurIndex()].items[0].xnmmc) {
              totalScore += parseFloat(this.gradeData[i].items[j].xf);
              totalGrade += parseFloat(this.gradeData[i].items[j].jd) * parseFloat(this.gradeData[i].items[j].xf);
            }
          }
        }
        return (totalGrade / totalScore).toFixed(2);
      },
      getCurXueqi() {
        var date = this.gradeData[0].items[0].dateDigitSeparator;
        var year = date.split('-')[0];
        var month = date.split('-')[1];
        if (parseInt(month) < 9) {
          return (year - 1).toString() + '-' + year + '-2';
        } else {
          return year + '-' + (parseInt(year) + 1).toString() + '-1';
        }
      },
      getCurIndex() {
        var xnm = this.curXueqi.split('-')[0];
        var xqm = (this.curXueqi.split('-')[2] == '1') ? '3' : '12';
        for (var i = 0; i < this.gradeData.length; i++) {
          if (this.gradeData[i].items[0].xnm == xnm && this.gradeData[i].items[0].xqm == xqm) {
            return i;
          }
        }
      },
      getXueqiList() {
        var xueqiList = [];
        for (var i = 0; i < this.gradeData.length; i++) {
          var xnm = this.gradeData[i].items[0].xnm + '-' + (parseInt(this.gradeData[i].items[0].xnm) + 1).toString()
          var xqm = this.gradeData[i].items[0].xqm == '3' ? '1' : '2';
          xueqiList.push(xnm + '-' + xqm);
        }
        this.xueqiList = xueqiList;
      },
      changeXueqi(index) {
        this.curXueqi = this.xueqiList[index];
      },
		}
	}
</script>

<style lang="scss" scoped>
  .page-wraper {
    width: 100%;
    height: 95vh;
  }

  .header {
    position: sticky;
    top: 0;
    height: 20vh;
  }

	.top-info {
		background-color: #4a90e2;
    position: sticky;
    top: 0;
    height: 10vh;
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
		background-color: #ffffff;
    position: sticky;
    top: 0;
    height: 10vh;
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
    position: sticky;
    bottom: 0;
    height: 70vh;

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

  .footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 5vh;
  }

  .xueqi-item {
    width: 200rpx;
    border-radius: 5%;
    font-size: 24rpx;
    height: 5vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
