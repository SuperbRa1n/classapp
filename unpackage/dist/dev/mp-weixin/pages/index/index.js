"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api = require("../../utils/api.js");
const _sfc_main = {
  data() {
    return {
      username: "",
      password: "",
      checked: false,
      isLoading: false,
      message: ""
    };
  },
  methods: {
    toggleCheckbox() {
      this.checked = !this.checked;
    },
    async handleLoginPress() {
      var _a, _b;
      if (!this.checked) {
        common_vendor.index.showToast({
          title: "请先同意服务条款",
          icon: "none"
        });
        return;
      }
      this.isLoading = true;
      this.message = "正在登录……";
      const data = {
        username: this.username,
        password: this.password
      };
      try {
        common_vendor.index.__f__("log", "at pages/index/index.vue:74", "data", data);
        const res = await common_vendor.index.request({
          url: utils_api.BASE_URL + utils_api.LOGIN,
          method: "POST",
          data,
          header: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/x-www-form-urlencoded"
          }
        });
        if (((_a = res.data) == null ? void 0 : _a.status) === "登录成功") {
          this.message = "登录成功，正在获取课程和成绩信息，请耐心等待……";
          common_vendor.index.setStorageSync("username", this.username);
          common_vendor.index.setStorageSync("password", this.password);
          const JSESSIONID = res.data.JSESSIONID;
          const userInfo = await utils_api.getUserInfo(JSESSIONID);
          common_vendor.index.setStorageSync("userInfo", userInfo);
          const classInfo = await utils_api.getClassInfo(JSESSIONID);
          common_vendor.index.setStorageSync("classInfo", classInfo);
          const gradeInfo = await utils_api.getGradeInfo(JSESSIONID);
          common_vendor.index.setStorageSync("gradeInfo", gradeInfo);
          this.isLoading = false;
        } else {
          common_vendor.index.showModal({
            title: "登录失败",
            content: ((_b = res.data) == null ? void 0 : _b.status) || "未知错误",
            showCancel: false
          });
          this.isLoading = false;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:115", "登录出错:", error);
        common_vendor.index.showToast({
          title: "登录失败，请稍后重试",
          icon: "none"
        });
        this.isLoading = false;
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.username,
    b: common_vendor.o(($event) => $data.username = $event.detail.value),
    c: $data.password,
    d: common_vendor.o(($event) => $data.password = $event.detail.value),
    e: $data.checked
  }, $data.checked ? {} : {}, {
    f: common_vendor.o((...args) => $options.toggleCheckbox && $options.toggleCheckbox(...args)),
    g: $data.isLoading
  }, $data.isLoading ? {} : {}, {
    h: common_vendor.o((...args) => $options.handleLoginPress && $options.handleLoginPress(...args)),
    i: $data.isLoading,
    j: common_vendor.t($data.message)
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
