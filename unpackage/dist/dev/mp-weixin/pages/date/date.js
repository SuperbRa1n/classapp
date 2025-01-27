"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      classInfo: [],
      termSwitcher: [],
      selectedTerm: "",
      isTermSet: false,
      timeSlots: [
        "08:00",
        "08:50",
        "10:00",
        "10:50",
        "11:40",
        "13:25",
        "14:15",
        "15:05",
        "16:15",
        "17:05",
        "18:50",
        "19:40",
        "20:30",
        "21:20"
      ],
      days: ["一", "二", "三", "四", "五", "六", "日"]
    };
  },
  onLoad() {
    this.initializeData();
  },
  methods: {
    async initializeData() {
      try {
        const classInfo = common_vendor.index.getStorageSync("classInfo");
        this.classInfo = classInfo ? classInfo : [];
        this.generateTermSwitcher();
        if (!this.isTermSet) {
          this.selectedTerm = this.termSwitcher[0];
          this.isTermSet = true;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/date/date.vue:82", "Error initializing data:", error);
      }
    },
    generateTermSwitcher() {
      const termSet = /* @__PURE__ */ new Set();
      this.classInfo.forEach((item) => {
        if (item.kbList.length > 0) {
          const xnm = item.xsxx.XNMC;
          const xqm = item.xsxx.XQM === "3" ? "秋冬" : "春夏";
          termSet.add(`${xnm}${xqm}`);
        }
      });
      this.termSwitcher = Array.from(termSet).sort((a, b) => {
        const yearA = a.slice(0, 9);
        const yearB = b.slice(0, 9);
        return yearA === yearB ? a.includes("秋冬") ? 1 : -1 : yearB - yearA;
      });
    },
    selectTerm(term) {
      this.selectedTerm = term;
    },
    getClassForTime(dayIndex, timeIndex) {
      var _a;
      const selectedClasses = ((_a = this.classInfo.filter(
        (c) => `${c.xsxx.XNMC}${c.xsxx.XQM === "3" ? "秋冬" : "春夏"}` === this.selectedTerm
      )[0]) == null ? void 0 : _a.kbList) || [];
      return selectedClasses.find(
        (c) => parseInt(c.xqj) === dayIndex + 1 && parseInt(c.jcs.split("-")[0]) === timeIndex + 1
      );
    },
    getClassHeight(dayIndex, timeIndex) {
      const classForThisTime = this.getClassForTime(dayIndex, timeIndex);
      if (classForThisTime) {
        const [start, end] = classForThisTime.jcs.split("-").map(Number);
        return (end - start + 1) * 6;
      }
      return 6;
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
    a: common_vendor.f($data.termSwitcher, (term, index, i0) => {
      return {
        a: common_vendor.t(term),
        b: index,
        c: term === $data.selectedTerm ? 1 : "",
        d: common_vendor.o(($event) => $options.selectTerm(term), index)
      };
    }),
    b: common_vendor.f($data.days, (day, k0, i0) => {
      return {
        a: common_vendor.t(day),
        b: day
      };
    }),
    c: common_vendor.f($data.timeSlots, (time, timeIndex, i0) => {
      return {
        a: common_vendor.t(timeIndex + 1),
        b: common_vendor.t(time),
        c: common_vendor.f($data.days, (day, dayIndex, i1) => {
          return common_vendor.e({
            a: $options.getClassForTime(dayIndex, timeIndex)
          }, $options.getClassForTime(dayIndex, timeIndex) ? {
            b: common_vendor.t($options.getClassForTime(dayIndex, timeIndex).kcmc),
            c: common_vendor.t($options.getClassForTime(dayIndex, timeIndex).cdmc),
            d: $options.getClassHeight(dayIndex, timeIndex) + "vh",
            e: common_vendor.o(($event) => $options.navigateToDetail($options.getClassForTime(dayIndex, timeIndex).kcmc), dayIndex)
          } : {}, {
            f: dayIndex
          });
        }),
        d: timeIndex
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/date/date.js.map
