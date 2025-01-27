export const BASE_URL = 'https://myjw.zeabur.app';

export const LOGIN = '/login';

export const CLASSINFO = '/class';

export const GRADEINFO = '/grade';

export const CODE = '/get_code';

export const DEFAULT_AVATAR = 'https://one.fjsmu.edu.cn/tp_up/resource/image/common/userpic.png';

export const xnmList = ['2030', '2029', '2028', '2027', '2026', '2025', '2024', '2023', '2022', '2021', '2019', '2018'];

export const xqmList = ['3', '12'];

const request = (url, data) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + url,
      method: 'POST',
      data: data,
      header: {
        'Content-Type': 'application/json',
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res.data || 'Request failed');
        }
      },
      fail: (err) => {
        reject(err || 'Request failed');
      },
    });
  });
};

export const getClassInfo = async (JSESSIONID) => {
  const result = [];
  for (const xnm of xnmList) {
    for (const xqm of xqmList) {
      const data = {
        JSESSIONID: JSESSIONID,
        xnm: xnm,
        xqm: xqm,
      };
      try {
        const response = await request(CLASSINFO, data);
        result.push(response);
      } catch (err) {
        console.error(`Error fetching class info for xnm: ${xnm}, xqm: ${xqm}`, err);
      }
    }
  }
  return result;
};

export const getGradeInfo = async (JSESSIONID) => {
  const result = [];
  for (const xnm of xnmList) {
    for (const xqm of xqmList) {
      const data = {
        JSESSIONID: JSESSIONID,
        xnm: xnm,
        xqm: xqm,
      };
      try {
        const response = await request(GRADEINFO, data);
        result.push(response);
      } catch (err) {
        console.error(`Error fetching grade info for xnm: ${xnm}, xqm: ${xqm}`, err);
      }
    }
  }
  return result;
};

export const getUserInfo = async (JSESSIONID) => {
  const data = {
    JSESSIONID: JSESSIONID,
    xnm: xnmList[0],
    xqm: xqmList[0],
  };
  try {
    const response = await request(CLASSINFO, data);
    return {
      name: response.xsxx.XM,
      id: response.xsxx.XH_ID,
      class: response.xsxx.BJMC,
    };
  } catch (err) {
    console.error('Error fetching user info', err);
    throw err;
  }
};
