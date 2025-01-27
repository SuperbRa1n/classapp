"use strict";
const common_vendor = require("../common/vendor.js");
const BASE_URL = "https://myjw.zeabur.app";
const LOGIN = "/login";
const CLASSINFO = "/class";
const GRADEINFO = "/grade";
const xnmList = ["2030", "2029", "2028", "2027", "2026", "2025", "2024", "2023", "2022", "2021", "2019", "2018"];
const xqmList = ["3", "12"];
const request = (url, data) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: BASE_URL + url,
      method: "POST",
      data,
      header: {
        "Content-Type": "application/json"
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res.data || "Request failed");
        }
      },
      fail: (err) => {
        reject(err || "Request failed");
      }
    });
  });
};
const getClassInfo = async (JSESSIONID) => {
  const result = [];
  for (const xnm of xnmList) {
    for (const xqm of xqmList) {
      const data = {
        JSESSIONID,
        xnm,
        xqm
      };
      try {
        const response = await request(CLASSINFO, data);
        result.push(response);
      } catch (err) {
        common_vendor.index.__f__("error", "at utils/api.js:53", `Error fetching class info for xnm: ${xnm}, xqm: ${xqm}`, err);
      }
    }
  }
  return result;
};
const getGradeInfo = async (JSESSIONID) => {
  const result = [];
  for (const xnm of xnmList) {
    for (const xqm of xqmList) {
      const data = {
        JSESSIONID,
        xnm,
        xqm
      };
      try {
        const response = await request(GRADEINFO, data);
        result.push(response);
      } catch (err) {
        common_vendor.index.__f__("error", "at utils/api.js:73", `Error fetching grade info for xnm: ${xnm}, xqm: ${xqm}`, err);
      }
    }
  }
  return result;
};
const getUserInfo = async (JSESSIONID) => {
  const data = {
    JSESSIONID,
    xnm: xnmList[0],
    xqm: xqmList[0]
  };
  try {
    const response = await request(CLASSINFO, data);
    return {
      name: response.xsxx.XM,
      id: response.xsxx.XH_ID,
      class: response.xsxx.BJMC
    };
  } catch (err) {
    common_vendor.index.__f__("error", "at utils/api.js:94", "Error fetching user info", err);
    throw err;
  }
};
exports.BASE_URL = BASE_URL;
exports.LOGIN = LOGIN;
exports.getClassInfo = getClassInfo;
exports.getGradeInfo = getGradeInfo;
exports.getUserInfo = getUserInfo;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/api.js.map
