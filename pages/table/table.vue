<template>
  <view>
    <view class="table">
      <view class="table-header">
        <view v-for="(item, index) in time" class="time" :style="'top: ' + ((index + 1) * 6).toString() + 'vh;'">
          <text style="font-size: 12rpx;">{{item}}</text>
          <text style="font-size: 24rpx; font-weight: bold;">{{index + 1}}</text>
        </view>
        <view v-for="(item, index) in week" class="time" :style="'left: ' + ((index + 1) * 12).toString() + 'vw;'">
          <text>{{item}}</text>
        </view>
      </view>
      <view class="table-content">
        <view v-for="(item, index) in classData[getCurIndex()].kbList" class="table-item"
              :style="'height: ' + ((parseFloat(item.jcs.split('-')[1]) - parseFloat(item.jcs.split('-')[0]) + 1) * 6).toString() + 'vh;'
                        + 'top: ' + ((parseFloat(item.jcs.split('-')[0]) - 1) * 6).toString() + 'vh;'
                        + 'left: ' + ((parseFloat(item.xqj) - 1) * 12).toString() + 'vw;'
                        + 'background-color: ' + colorDict[item.kcmc] + ';'">
          <text style="color: #000000; font-size: 10rpx; text-align: center;">{{item.kcmc}}\n @{{item.cdmc}}</text>
        </view>
      </view>
      <view class="table-footer">
        <scroll-view class="xueqi" :scroll-x="true" style="width: 100%;">
          <view style="display: flex; flex-direction: row;">
            <view class="xueqi-item" v-for="(item, index) in xueqiList" @click="changeXueqi(index)" :style="'background-color:' + (item != curXueqi ? '#ffffff' : '#4a90e2') + '; color:' + (item != curXueqi ? '#4a90e2' : '#ffffff')">
              <text>{{item}}</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      classData: uni.getStorageSync('classData'),
      gradeData: uni.getStorageSync('gradeData'),
      curXueqi: '2023-2024-2',
      time: ['08:10', '09:00', '10:00', '10:55', '11:45', '12:35', '14:55', '15:45', '16:40', '17:30', '19:00', '19:50', '20:40', '21:45'],
      week: ['一', '二', '三', '四', '五', '六', '日'],
      colorList: ['#F9CEEF', '#CCF3EE', '#97C4B8', '#9ADCFF', '#FFF89A', '#FFB2A6', '#D0A2F7', '#F875AA', '#00A9FF', '#E48F45', '#99BC85', '#D2DE32', '#99FFCD', '#B4D4FF'],
      colorDict: {},
      xueqiList: [],
    }
  },
  onLoad() {
    this.classData = uni.getStorageSync('classData');
    this.curXueqi = this.getCurXueqi();
    this.changeColor();
    this.getXueqiList();
  },
  methods: {
    getCurXueqi() {
      var date = this.classData[0].sjkList[0].dateDigitSeparator;
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
      for (var i = 0; i < this.classData.length; i++) {
        if (this.classData[i].kbList[0].xnm == xnm && this.classData[i].kbList[0].xqm == xqm) {
          return i;
        }
      }
    },
    getXueqiList() {
      var xueqiList = [];
      for (var i = 0; i < this.classData.length; i++) {
        var xnm = this.classData[i].kbList[0].xnm + '-' + (parseInt(this.classData[i].kbList[0].xnm) + 1).toString()
        var xqm = this.classData[i].kbList[0].xqm == '3' ? '1' : '2';
        xueqiList.push(xnm + '-' + xqm);
      }
      this.xueqiList = xueqiList;
    },
    changeXueqi(index) {
      this.curXueqi = this.xueqiList[index];
      this.changeColor();
    },
    changeColor() {
      for (var i = 0; i < this.classData[this.getCurIndex()].kbList.length; i++) {
        if (this.colorDict[this.classData[this.getCurIndex()].kbList[i].kcmc] == undefined) {
          this.colorDict[this.classData[this.getCurIndex()].kbList[i].kcmc] = this.colorList[i % this.colorList.length];
        }
      }
    }
  }
}
</script>



<style scoped lang="scss">
  .time {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 12vw;
    height: 6vh;
    border-radius: 5%;
    position: absolute;
  }

  .table-content {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 6vh;
    left: 12vw;
    width: 85vw;
    height: 85vh;
    overflow: auto;
  }

  .table-item {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 12vw;
    border-radius: 5%;
  }

  .table-footer {
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
