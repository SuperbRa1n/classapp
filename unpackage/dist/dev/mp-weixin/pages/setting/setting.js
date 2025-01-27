"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      isLogin: true,
      isLoading: false,
      username: "",
      password: "",
      classData: [],
      gradeData: [],
      xm: "",
      value: "",
      url: "http://124.220.13.16:5000",
      JSESSIONID: ""
    };
  },
  onLoad() {
    this.username = common_vendor.index.getStorageSync("username");
    this.password = common_vendor.index.getStorageSync("password");
    this.xm = common_vendor.index.getStorageSync("xm");
    if (this.username != "") {
      this.isLogin = false;
      this.userLogin();
    } else {
      this.isLogin = true;
    }
  },
  methods: {
    userLogin() {
      this.isLoading = true;
      common_vendor.index.request({
        url: this.url + "/login",
        method: "POST",
        data: {
          "username": this.username,
          "password": this.password
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: (res) => {
          this.isLoading = false;
          this.isLogin = false;
          this.JSESSIONID = res.data.JSESSIONID;
          common_vendor.index.setStorageSync("username", this.username);
          common_vendor.index.setStorageSync("password", this.password);
          common_vendor.index.setStorageSync("JSESSIONID", res.data.JSESSIONID);
          this.classData = [];
          this.gradeData = [];
          var xnmList = ["2030", "2029", "2028", "2027", "2026", "2025", "2024", "2023", "2022", "2021", "2019", "2018"];
          var xqmList = ["3", "12"];
          for (var i = 0; i < xnmList.length; i++) {
            for (var j = 0; j < xqmList.length; j++) {
              this.getInfo(xnmList[i], xqmList[j]);
            }
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/setting/setting.vue:103", err);
          this.isLoading = false;
        }
      });
    },
    getInfo(xnm, xqm) {
      common_vendor.index.request({
        url: this.url + "/class",
        method: "POST",
        data: {
          "JSESSIONID": this.JSESSIONID,
          "xnm": xnm,
          "xqm": xqm
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: (res) => {
          this.isLoading = false;
          this.isLogin = false;
          if (res.data.kbList.length != 0) {
            this.classData.push(res.data);
            common_vendor.index.setStorageSync("classData", this.classData);
            common_vendor.index.__f__("log", "at pages/setting/setting.vue:126", this.classData);
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/setting/setting.vue:131", err);
          this.isLoading = false;
        }
      });
      common_vendor.index.request({
        url: this.url + "/grade",
        method: "POST",
        data: {
          "JSESSIONID": this.JSESSIONID,
          "xnm": xnm,
          "xqm": xqm
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: (res) => {
          this.isLoading = false;
          this.isLogin = false;
          if (res.data.items.length != 0) {
            this.gradeData.push(res.data);
            this.xm = res.data.items[0].xm;
            common_vendor.index.setStorageSync("xm", this.xm);
            common_vendor.index.setStorageSync("gradeData", this.gradeData);
            common_vendor.index.__f__("log", "at pages/setting/setting.vue:154", this.gradeData);
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/setting/setting.vue:158", err);
          this.isLoading = false;
        }
      });
    },
    getUserName(e) {
      this.username = e.detail.value;
    },
    getPassWord(e) {
      this.password = e.detail.value;
    },
    changeUser() {
      common_vendor.index.removeStorageSync("username");
      common_vendor.index.removeStorageSync("password");
      common_vendor.index.removeStorageSync("classData");
      common_vendor.index.removeStorageSync("gradeData");
      common_vendor.index.removeStorageSync("JSESSIONID");
      common_vendor.index.removeStorageSync("xm");
      this.username = "";
      this.password = "";
      this.xm = "";
      this.isLogin = true;
    },
    displayTiaokuan() {
      common_vendor.index.navigateTo({
        url: "../tiaokuan/tiaokuan"
      });
    },
    aboutUs() {
      common_vendor.index.navigateTo({
        url: "../about/about"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.isLogin
  }, $data.isLogin ? {
    b: common_assets._imports_0,
    c: common_vendor.o((...args) => $options.getUserName && $options.getUserName(...args)),
    d: $data.value,
    e: common_vendor.o((...args) => $options.getPassWord && $options.getPassWord(...args)),
    f: $data.value,
    g: $data.isLoading,
    h: common_vendor.o(($event) => $options.userLogin())
  } : {}, {
    i: !$data.isLogin
  }, !$data.isLogin ? common_vendor.e({
    j: common_assets._imports_0,
    k: $data.xm == ""
  }, $data.xm == "" ? {
    l: common_vendor.t(_ctx.信息加载中)
  } : {
    m: common_vendor.t($data.xm)
  }, {
    n: common_assets._imports_1,
    o: common_vendor.o((...args) => $options.userLogin && $options.userLogin(...args)),
    p: common_assets._imports_2,
    q: common_vendor.o((...args) => $options.changeUser && $options.changeUser(...args)),
    r: common_assets._imports_3,
    s: common_vendor.o((...args) => $options.displayTiaokuan && $options.displayTiaokuan(...args)),
    t: common_assets._imports_4,
    v: common_vendor.o((...args) => $options.aboutUs && $options.aboutUs(...args))
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/setting/setting.js.map
