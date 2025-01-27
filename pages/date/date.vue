<template>
  <view class="container">
    <!-- Term Switcher -->
    <scroll-view scroll-x class="term-summary">
      <view v-for="(term, index) in termSwitcher" :key="index" class="term-item"
        :class="{ 'selected-term-item': term === selectedTerm }" @tap="selectTerm(term)">
        <text class="term-label">{{ term }}</text>
      </view>
    </scroll-view>

    <!-- Timetable -->
    <scroll-view scroll-y class="timetable">
      <view class="header-row">
        <view class="time-cell"></view>
        <view v-for="day in days" :key="day" class="day-cell">
          <text class="day-header">{{ day }}</text>
        </view>
      </view>
      <view v-for="(time, timeIndex) in timeSlots" :key="timeIndex" class="row">
        <view class="time-cell">
          <text class="time-index">{{ timeIndex + 1 }}</text>
          <text class="time-label">{{ time }}</text>
        </view>
        <view v-for="(day, dayIndex) in days" :key="dayIndex" class="class-cell">
          <view v-if="getClassForTime(dayIndex, timeIndex)" class="class-block"
            :style="{ height: getClassHeight(dayIndex, timeIndex) + 'vh' }"
            @tap="navigateToDetail(getClassForTime(dayIndex, timeIndex).kcmc)">
            <text class="class-name">
              {{ getClassForTime(dayIndex, timeIndex).kcmc }}
            </text>
            <text class="class-location">
              @{{ getClassForTime(dayIndex, timeIndex).cdmc }}
            </text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      classInfo: [],
      termSwitcher: [],
      selectedTerm: '',
      isTermSet: false,
      timeSlots: [
        '08:00',
        '08:50',
        '10:00',
        '10:50',
        '11:40',
        '13:25',
        '14:15',
        '15:05',
        '16:15',
        '17:05',
        '18:50',
        '19:40',
        '20:30',
        '21:20',
      ],
      days: ['一', '二', '三', '四', '五', '六', '日'],
    };
  },
  onLoad() {
    this.initializeData();
  },
  methods: {
    async initializeData() {
      try {
        const classInfo = uni.getStorageSync('classInfo');
        this.classInfo = classInfo ? classInfo : [];
        this.generateTermSwitcher();
        if (!this.isTermSet) {
          this.selectedTerm = this.termSwitcher[0];
          this.isTermSet = true;
        }
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    },
    generateTermSwitcher() {
      const termSet = new Set();
      this.classInfo.forEach((item) => {
        if (item.kbList.length > 0) {
          const xnm = item.xsxx.XNMC;
          const xqm = item.xsxx.XQM === '3' ? '秋冬' : '春夏';
          termSet.add(`${xnm}${xqm}`);
        }
      });
      this.termSwitcher = Array.from(termSet).sort((a, b) => {
        const yearA = a.slice(0, 9);
        const yearB = b.slice(0, 9);
        return yearA === yearB ? (a.includes('秋冬') ? 1 : -1) : yearB - yearA;
      });
    },
    selectTerm(term) {
      this.selectedTerm = term;
    },
    getClassForTime(dayIndex, timeIndex) {
      const selectedClasses = this.classInfo.filter(
        (c) =>
          `${c.xsxx.XNMC}${c.xsxx.XQM === '3' ? '秋冬' : '春夏'}` ===
          this.selectedTerm
      )[0]?.kbList || [];
      return selectedClasses.find(
        (c) =>
          parseInt(c.xqj) === dayIndex + 1 &&
          parseInt(c.jcs.split('-')[0]) === timeIndex + 1
      );
    },
    getClassHeight(dayIndex, timeIndex) {
      const classForThisTime = this.getClassForTime(dayIndex, timeIndex);
      if (classForThisTime) {
        const [start, end] = classForThisTime.jcs.split('-').map(Number);
        return (end - start + 1) * 6; // 每节课占用 6vh 高度
      }
      return 6;
    },
    navigateToDetail(courseName) {
      uni.navigateTo({
        url: `/pages/courseDetail/courseDetail?name=${courseName}`,
      });
    },
  },
};
</script>

<style>
.container {
  padding: 2vw;
  background-color: #f8f8f8;
}

.term-summary {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  padding: 2vw 0;
  background-color: #fff;
  border-radius: 2vw;
  margin-bottom: 4vw;
}

.term-item {
  padding: 1vw 3vw;
  margin-right: 2vw;
  background-color: #f0f0f0;
  border-radius: 2vw;
  text-align: center;
}

.selected-term-item {
  background-color: #e3f2fd;
}

.term-label {
  font-size: 3vw;
  color: #666;
}

.timetable {
  background-color: #fff;
  border-radius: 2vw;
  padding: 2vw;
  overflow: hidden;
}

.header-row {
  display: flex;
  flex-direction: row;
}

.row {
  display: flex;
  flex-direction: row;
}

.time-cell {
  width: 12vw;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
}

.day-cell {
  width: 12vw;
  justify-content: center;
  align-items: center;
}

.day-header {
  font-size: 4vw;
  font-weight: bold;
}

.class-cell {
  width: 12vw;
  height: 6vh;
  justify-content: center;
  align-items: center;
}

.class-block {
  background-color: #74c6f7;
  border-radius: 1vw;
  padding: 1vw;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 12vw;
}

.class-name {
  font-size: 2.5vw;
  color: #fff;
}

.class-location {
  font-size: 2vw;
  color: #fff;
}

.time-index {
  font-size: 3vw;
  font-weight: bold;
  text-align: center;
}

.time-label {
  font-size: 2.5vw;
  color: #666;
  text-align: center;
}
</style>