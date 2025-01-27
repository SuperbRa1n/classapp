"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      classData: common_vendor.index.getStorageSync("classData"),
      gradeData: common_vendor.index.getStorageSync("gradeData"),
      curXueqi: "2023-2024-2",
      time: ["08:10", "09:00", "10:00", "10:55", "11:45", "12:35", "14:55", "15:45", "16:40", "17:30", "19:00", "19:50", "20:40", "21:45"],
      week: ["一", "二", "三", "四", "五", "六", "日"],
      colorList: ["#F9CEEF", "#CCF3EE", "#97C4B8", "#9ADCFF", "#FFF89A", "#FFB2A6", "#D0A2F7", "#F875AA", "#00A9FF", "#E48F45", "#99BC85", "#D2DE32", "#99FFCD", "#B4D4FF"],
      colorDict: {},
      xueqiList: []
    };
  },
  onLoad() {
    this.classData = common_vendor.index.getStorageSync("classData");
    this.curXueqi = this.getCurXueqi();
    this.changeColor();
    this.getXueqiList();
  },
  methods: {
    getCurXueqi() {
      var date = this.classData[0].sjkList[0].dateDigitSeparator;
      var year = date.split("-")[0];
      var month = date.split("-")[1];
      if (parseInt(month) < 9) {
        return (year - 1).toString() + "-" + year + "-2";
      } else {
        return year + "-" + (parseInt(year) + 1).toString() + "-1";
      }
    },
    getCurIndex() {
      var xnm = this.curXueqi.split("-")[0];
      var xqm = this.curXueqi.split("-")[2] == "1" ? "3" : "12";
      for (var i = 0; i < this.classData.length; i++) {
        if (this.classData[i].kbList[0].xnm == xnm && this.classData[i].kbList[0].xqm == xqm) {
          return i;
        }
      }
    },
    getXueqiList() {
      var xueqiList = [];
      for (var i = 0; i < this.classData.length; i++) {
        var xnm = this.classData[i].kbList[0].xnm + "-" + (parseInt(this.classData[i].kbList[0].xnm) + 1).toString();
        var xqm = this.classData[i].kbList[0].xqm == "3" ? "1" : "2";
        xueqiList.push(xnm + "-" + xqm);
      }
      this.xueqiList = xueqiList;
    },
    changeXueqi(index) {
      this.curXueqi = this.xueqiList[index];
      this.changeColor();
    },
    changeColor() {
      for (var i = 0; i < this.classData[this.getCurIndex()].kbList.length; i++) {
        if (this.colorDict[this.classData[this.getCurIndex()].kbList[i].kcmc] == void 0) {
          this.colorDict[this.classData[this.getCurIndex()].kbList[i].kcmc] = this.colorList[i % this.colorList.length];
        }
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.time, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: common_vendor.t(index + 1),
        c: common_vendor.s("top: " + ((index + 1) * 6).toString() + "vh;")
      };
    }),
    b: common_vendor.f($data.week, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: common_vendor.s("left: " + ((index + 1) * 12).toString() + "vw;")
      };
    }),
    c: common_vendor.f($data.classData[$options.getCurIndex()].kbList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.kcmc),
        b: common_vendor.t(item.cdmc),
        c: common_vendor.s("height: " + ((parseFloat(item.jcs.split("-")[1]) - parseFloat(item.jcs.split("-")[0]) + 1) * 6).toString() + "vh;top: " + ((parseFloat(item.jcs.split("-")[0]) - 1) * 6).toString() + "vh;left: " + ((parseFloat(item.xqj) - 1) * 12).toString() + "vw;background-color: " + $data.colorDict[item.kcmc] + ";")
      };
    }),
    d: common_vendor.f($data.xueqiList, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: common_vendor.o(($event) => $options.changeXueqi(index)),
        c: common_vendor.s("background-color:" + (item != $data.curXueqi ? "#ffffff" : "#4a90e2") + "; color:" + (item != $data.curXueqi ? "#4a90e2" : "#ffffff"))
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e0750a17"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/table/table.js.map
