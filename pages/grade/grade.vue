<template>
  <view class="container">
    <!-- Header Section -->
    <view class="grade-summary">
      <view
        v-for="(item, index) in gradeSummary"
        :key="index"
        class="grade-item"
        :style="{ backgroundColor: item.color }"
      >
        <text class="grade-label">{{ item.label }}</text>
        <text class="grade-value">{{ item.value }}</text>
      </view>
    </view>

    <!-- Term Switcher -->
    <scroll-view scroll-x class="term-summary">
      <view
        v-for="(term, index) in termSwitcher"
        :key="index"
        :class="['term-item', { 'selected-term-item': term === selectedTerm }]"
        @tap="selectTerm(term)"
      >
        <text class="term-label">{{ term }}</text>
        <text class="term-value">
          {{ calculateXueqiGPA(term).toFixed(2) }}/{{ calculateXueqiCredit(term).toFixed(2) }}
        </text>
      </view>
    </scroll-view>

    <!-- Course List -->
    <scroll-view scroll-y class="course-list">
      <view
        v-for="(course, index) in getCoursesByTerm(selectedTerm)"
        :key="index"
        class="course-item"
        @tap="navigateToDetail(course.kcmc)"
      >
        <view class="course-header">
          <text class="course-name">{{ course.kcmc }}</text>
          <text class="course-score">{{ course.bfzcj }} / {{ course.jd }}</text>
        </view>
        <text class="course-info">
          {{ course.jxbmc }} / {{ course.xf }} 学分
        </text>
        <view class="progress-bar-container">
          <view
            class="progress-bar"
            :style="{ width: course.bfzcj + '%' }"
          ></view>
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
      gradeInfo: [],
      selectedTerm: '',
      termSwitcher: [],
      totalCredit: 0,
      totalGrade: 0,
      yearCredit: 0,
      yearGrade: 0,
      xueqiCredit: 0,
      xueqiGrade: 0,
      totalBaiFenZhi: 0,
      xueqiBaiFenZhi: 0,
      isTermSet: false,
    };
  },
  computed: {
    gradeSummary() {
      return [
        {
          label: '总均绩',
          value: this.totalGrade.toFixed(2),
          color: '#E3F2FD',
        },
        {
          label: '获得学分',
          value: this.totalCredit.toFixed(2),
          color: '#FFF3E0',
        },
        {
          label: '学年均绩',
          value: this.yearGrade.toFixed(2),
          color: '#E8F5E9',
        },
        {
          label: '学年学分',
          value: this.yearCredit.toFixed(2),
          color: '#F3E5F5',
        },
        {
          label: '学期均绩',
          value: this.xueqiGrade.toFixed(2),
          color: '#FFFDE7',
        },
        {
          label: '学期学分',
          value: this.xueqiCredit.toFixed(2),
          color: '#E1F5FE',
        },
        {
          label: '总百分制',
          value: this.totalBaiFenZhi.toFixed(2),
          color: '#FFEBEE',
        },
        {
          label: '学期百分制',
          value: this.xueqiBaiFenZhi.toFixed(2),
          color: '#E0F7FA',
        },
      ];
    },
  },
  onLoad() {
    this.initializeData();
  },
  methods: {
    async initializeData() {
      try {
        const classInfo = uni.getStorageSync('classInfo');
        const gradeInfo = uni.getStorageSync('gradeInfo');
        this.classInfo = classInfo ? JSON.parse(classInfo) : [];
        this.gradeInfo = gradeInfo ? JSON.parse(gradeInfo) : [];
        this.generateTermSwitcher();
        if (!this.isTermSet) {
          this.selectedTerm = this.termSwitcher[0];
          this.isTermSet = true;
          this.updateGrades();
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
          const term = `${xnm}${xqm}`;
          termSet.add(term);
        }
      });
      this.termSwitcher = Array.from(termSet).sort((a, b) => {
        if (a.substring(0, 9) < b.substring(0, 9)) return 1;
        if (a.substring(0, 9) > b.substring(0, 9)) return -1;
        return a.substring(9, 11) === '秋冬' ? 1 : -1;
      });
    },
    selectTerm(term) {
      this.selectedTerm = term;
      this.updateGrades();
    },
    updateGrades() {
      const totalItems = [];
      const yearItems = [];
      const xueqiItems = [];
      this.gradeInfo.forEach((item) => {
        const items = item.items || [];
        items.forEach((course) => {
          totalItems.push(course);
          if (course.xnmmc === this.selectedTerm.substring(0, 9)) {
            yearItems.push(course);
            if (
              (course.xqmmc === '1' &&
                this.selectedTerm.substring(9, 11) === '秋冬') ||
              (course.xqmmc === '2' &&
                this.selectedTerm.substring(9, 11) === '春夏')
            ) {
              xueqiItems.push(course);
            }
          }
        });
      });
      this.totalCredit = this.calculateCredit(totalItems);
      this.totalGrade = this.calculateGPA(totalItems);
      this.yearCredit = this.calculateCredit(yearItems);
      this.yearGrade = this.calculateGPA(yearItems);
      this.xueqiCredit = this.calculateCredit(xueqiItems);
      this.xueqiGrade = this.calculateGPA(xueqiItems);
      this.totalBaiFenZhi = this.calculateBaiFenZhi(totalItems);
      this.xueqiBaiFenZhi = this.calculateBaiFenZhi(xueqiItems);
    },
    calculateGPA(grades) {
      let totalCredit = 0;
      let totalGrade = 0;
      grades.forEach((item) => {
        totalCredit += parseFloat(item.xf);
        totalGrade += parseFloat(item.xf) * parseFloat(item.jd);
      });
      return totalGrade / totalCredit;
    },
    calculateCredit(grades) {
      let totalCredit = 0;
      grades.forEach((item) => {
        totalCredit += parseFloat(item.xf);
      });
      return totalCredit;
    },
    calculateBaiFenZhi(grades) {
      let totalCredit = 0;
      let totalGrade = 0;
      grades.forEach((item) => {
        totalCredit += parseFloat(item.xf);
        totalGrade += parseFloat(item.xf) * parseFloat(item.bfzcj);
      });
      return totalGrade / totalCredit;
    },
    calculateXueqiGPA(term) {
      return this.calculateGPA(this.getCoursesByTerm(term));
    },
    calculateXueqiCredit(term) {
      return this.calculateCredit(this.getCoursesByTerm(term));
    },
    getCoursesByTerm(term) {
      const xnmmc = term.substring(0, 9);
      const xqmmc = term.substring(9, 11);
      const xqmTable = { 秋冬: '1', 春夏: '2' };
      return this.gradeInfo
        .flatMap((item) => item.items || [])
        .filter(
          (course) =>
            course.xnmmc === xnmmc && course.xqmmc === xqmTable[xqmmc]
        )
        .sort((a, b) => parseFloat(b.bfzcj) - parseFloat(a.bfzcj));
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
  padding: 16px;
  background-color: #f8f8f8;
}
.grade-summary,
.term-summary {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 16px;
}
.grade-item {
  width: 48%;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 8px;
}
.term-item {
  padding: 10px;
  margin-right: 8px;
  background-color: #f0f0f0;
  border-radius: 8px;
}
.selected-term-item {
  background-color: #E3F2FD;
}
.course-list {
  margin-top: 10px;
}
.course-item {
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 10px;
}
.course-header {
  display: flex;
  justify-content: space-between;
}
.progress-bar-container {
  margin-top: 5px;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  background-color: #74c6f7;
}
</style>
