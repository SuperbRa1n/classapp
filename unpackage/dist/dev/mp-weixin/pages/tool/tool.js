"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      classInfo: [],
      gradeInfo: [],
      selectedTerm: "",
      termSwitcher: [],
      totalCredit: 0,
      totalGrade: 0,
      yearCredit: 0,
      yearGrade: 0,
      xueqiCredit: 0,
      xueqiGrade: 0,
      totalBaiFenZhi: 0,
      xueqiBaiFenZhi: 0,
      isTermSet: false
    };
  },
  computed: {
    gradeSummary() {
      return [
        { label: "总均绩", value: this.totalGrade.toFixed(2), color: "#E3F2FD" },
        { label: "获得学分", value: this.totalCredit.toFixed(2), color: "#FFF3E0" },
        { label: "学年均绩", value: this.yearGrade.toFixed(2), color: "#E8F5E9" },
        { label: "学年学分", value: this.yearCredit.toFixed(2), color: "#F3E5F5" },
        { label: "学期均绩", value: this.xueqiGrade.toFixed(2), color: "#FFFDE7" },
        { label: "学期学分", value: this.xueqiCredit.toFixed(2), color: "#E1F5FE" },
        { label: "总百分制", value: this.totalBaiFenZhi.toFixed(2), color: "#FFEBEE" },
        { label: "学期百分制", value: this.xueqiBaiFenZhi.toFixed(2), color: "#E0F7FA" }
      ];
    }
  },
  onLoad() {
    this.initializeData();
  },
  methods: {
    async initializeData() {
      try {
        const classInfo = common_vendor.index.getStorageSync("classInfo");
        const gradeInfo = common_vendor.index.getStorageSync("gradeInfo");
        this.classInfo = classInfo ? classInfo : [];
        this.gradeInfo = gradeInfo ? gradeInfo : [];
        common_vendor.index.__f__("log", "at pages/tool/tool.vue:98", "classInfo", this.classInfo);
        common_vendor.index.__f__("log", "at pages/tool/tool.vue:99", "gradeInfo", this.gradeInfo);
        this.generateTermSwitcher();
        if (!this.isTermSet) {
          this.selectedTerm = this.termSwitcher[0];
          this.isTermSet = true;
          this.updateGrades();
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/tool/tool.vue:107", "Error initializing data:", error);
      }
    },
    generateTermSwitcher() {
      const termSet = /* @__PURE__ */ new Set();
      this.classInfo.forEach((item) => {
        if (item.kbList.length > 0) {
          const xnm = item.xsxx.XNMC;
          const xqm = item.xsxx.XQM === "3" ? "秋冬" : "春夏";
          const term = `${xnm}${xqm}`;
          termSet.add(term);
        }
      });
      this.termSwitcher = Array.from(termSet).sort((a, b) => {
        if (a.substring(0, 9) < b.substring(0, 9))
          return 1;
        if (a.substring(0, 9) > b.substring(0, 9))
          return -1;
        return a.substring(9, 11) === "秋冬" ? 1 : -1;
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
            if (course.xqmmc === "1" && this.selectedTerm.substring(9, 11) === "秋冬" || course.xqmmc === "2" && this.selectedTerm.substring(9, 11) === "春夏") {
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
      const xqmTable = { 秋冬: "1", 春夏: "2" };
      return this.gradeInfo.flatMap((item) => item.items || []).filter(
        (course) => course.xnmmc === xnmmc && course.xqmmc === xqmTable[xqmmc]
      ).sort((a, b) => parseFloat(b.bfzcj) - parseFloat(a.bfzcj));
    },
    navigateToDetail(courseName) {
      common_vendor.index.navigateTo({
        url: `/pages/courseDetail/courseDetail?name=${courseName}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($options.gradeSummary, (item, index, i0) => {
      return {
        a: common_vendor.t(item.label),
        b: common_vendor.t(item.value),
        c: index,
        d: item.color
      };
    }),
    b: common_vendor.f($data.termSwitcher, (term, index, i0) => {
      return {
        a: common_vendor.t(term),
        b: index,
        c: term === $data.selectedTerm ? 1 : "",
        d: common_vendor.o(($event) => $options.selectTerm(term), index)
      };
    }),
    c: common_vendor.f($options.getCoursesByTerm($data.selectedTerm), (course, index, i0) => {
      return {
        a: common_vendor.t(course.kcmc),
        b: common_vendor.t(course.bfzcj),
        c: common_vendor.t(course.jd),
        d: common_vendor.t(course.jxbmc),
        e: common_vendor.t(course.xf),
        f: course.bfzcj + "%",
        g: index,
        h: common_vendor.o(($event) => $options.navigateToDetail(course.kcmc), index)
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/tool/tool.js.map
