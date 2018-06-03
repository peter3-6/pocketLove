var openId, current, activityId, constellationArray, fdGenderArray, _fdGender, userLabelArray, school, province, current_constellation, city, county, birthday, s_userLabel, labelId, signature, current_userLabel, schoolCode;
const App = getApp();
const config = require("../../config.js")
const labelList = config.service.labelList;
const updateUser = config.service.updateUser;
const getToken = config.service.getToken;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    modalSys: true,
    currentTab: 0,
    region: [],
    array: ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天枰座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'],
    gender: ['男', '女'],
    // objectArray: [{
    //   id: 0,
    //   name: '白羊座'
    // }, {
    //   id: 1,
    //   name: '金牛座'
    // }, {
    //   id: 2,
    //   name: '双子座'
    // }, {
    //   id: 3,
    //   name: '巨蟹座'
    // }, {
    //   id: 4,
    //   name: '狮子座'
    // }, {
    //   id: 5,
    //   name: '处女座'
    // }, {
    //   id: 6,
    //   name: '天枰座'
    // }, {
    //   id: 7,
    //   name: '天蝎座'
    // }, {
    //   id: 8,
    //   name: '射手座'
    // }, {
    //   id: 9,
    //   name: '摩羯座'
    // }, {
    //   id: 10,
    //   name: '水瓶座'
    // }, {
    //   id: 11,
    //   name: '双鱼座'
    // }],
    index: "",
    userLabel: ""
  },
  //------------------------------ 生命周期 start-----------------------------
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var self = this;
    self.$wuxPicker = App.Wux().$wuxPicker;
    self.$wuxPickerCity = App.Wux().$wuxPickerCity;
    App.getActivityId(function perfect_init_getActivityId(_data) {
      activityId = _data;
      constellationArray = self.data.array;
      fdGenderArray = self.data.gender;
      //从后台获取标签接口
      wx.request({
        url: labelList, //标签接口
        data: {},
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          // console.log(res)
          var datas = res.data;
          userLabelArray = new Array();
          var userLabel_indexArray = new Array();
          for (var i in datas) {
            userLabel_indexArray[i] = res.data[i].labelId;
            userLabelArray[i] = res.data[i].labelContent;
          }
          self.setData({
            userLabel_index: userLabel_indexArray,
            userLabel: userLabelArray,
          })
        },
        fail: function (err) { }
      })
    });
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { },
  //------------------------------ 生命周期 end-----------------------------
  //------------------------------ tap切换 start-----------------------------
  /** 
   * 滑动切换tab 
   */
  bindChange: function (e) {
    var that = this;
    current = e.detail.current;
    that.setData({
      currentTab: current
    });
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    current = e.target.dataset.current;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  //------------------------------ tap切换 end-----------------------------
  //------------------------------ 自定义方法 start-----------------------------
  /*
 底部弹出的学校选择
  */
  onTapCity: function (e) {
    const self = this;
    self.$wuxPickerCity.init('city', {
      // title: '请选择学校',
      onChange(value, values, displayValues) {
        self.setData({
          city0: displayValues[0],
          city1: displayValues[1],
          city2: displayValues[2]
        })
        school = displayValues[2];
        schoolCode = values[2];
      },
    })
  },
  /*
 时间选择器
  */
  bindDateChange: function (e) {
    birthday = e.detail.value;
    this.setData({
      date: birthday
    })
  },
  /*
   *触发选择地址的方法
   */
  bindRegionChange: function (e) {
    var self = this;
    var address = e.detail.value
    province = address[0];
    city = address[1];
    county = address[2];
    self.setData({
      region: e.detail.value
    })
  },
  /*
  星座事件
   */
  bindPickerChange: function (e) {
    var self = this;
    let fdNumber = e.detail.value;
    let i = parseInt(fdNumber)
    current_constellation = constellationArray[i];
    self.setData({
      index: e.detail.value
    })
  },
  // 性别
  fdGender: function (e) {
    var self = this;
    let fd_gender = e.detail.value;
    let i = parseInt(fd_gender)
    _fdGender = fdGenderArray[i];
    self.setData({
      genderIndex: e.detail.value
    })
  },
  /*
个人标签事件
 */
  userLabel: function (e) {
    var self = this;
    let labelId = s_userLabel = e.detail.value;
    let i = parseInt(labelId);
    current_userLabel = userLabelArray[i];
    self.setData({
      userLabel_index: s_userLabel
    })
  },
  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    this.onLoad();
  },
  onShareAppMessage: function () {
    return {
      title: '口袋之恋',
      path: '/pages/welcome/welcome',
      imageUrl: '/images/logo.jpg',
      success(res) {
        withShareTicket: true
      },
    }
  },
  /*
modal不显示
 */
  noModal() {
    var self = this;
    self.setData({
      modalSys: true,
    })
  },
  /*
跳转到index页面
 */
  toIndex: function () {
    wx.redirectTo({
      url: '../../pages/index/index',
    })
  },
  //------------------------------ 自定义方法 end-----------------------------
  //------------------------------ 提交信息请求 start-----------------------------
  /*
  提交表单信息
   */
  formSubmit: function (e) {//
    var self = this;
    var currentA = current;
    signature = e.detail.value.signature
    if (currentA == 0) {
      if (openId == undefined || openId == null || openId == "") {
        App.getOpenId(function per_callback(_data) {
          self.updateUser(_data);
        });
      } else {
        self.updateUser();
      }
    } else if (currentA == 1) {
      if (openId == undefined || openId == null || openId == "") {
        App.getOpenId(function per_callback(_data) {
          self.noSchoolUpData(_data);
        });
      } else {
        self.noSchoolUpData();
      }
    } else if (currentA == undefined || currentA == null || currentA == '') {
      if (openId == undefined || openId == null || openId == "") {
        App.getOpenId(function per_callback(_data) {
          self.updateUser(_data);
        });
      } else {
        self.updateUser();
      }
    }
  },
  /*
  在校生完善信息
   */
  updateUser: function (_data) {
    var self = this;
    let Gender = _fdGender != null && _fdGender != undefined && _fdGender != '';
    let _signature = signature != null && signature != undefined && signature != '';//自我描述
    let _province = province != null && province != undefined && province != '';//省
    let _city = city != null && city != undefined && city != '';//市
    let _county = county != null && county != undefined && county != '';//县、区
    let _school = school != null && school != undefined && school != '';//学校
    let _current_userLabel = current_userLabel != null && current_userLabel != undefined && current_userLabel != '';
    let _birthday = birthday != null && birthday != undefined && birthday != '';
    let _openId = _data != null && _data != undefined && _data != '';
    let _current_constellation = current_constellation != null && current_constellation != undefined && current_constellation != '';
    let allData = Gender && _school && _signature && _province && _city && _county && _current_userLabel && _birthday && _openId && _current_constellation;
    if (allData) {
      self.updateUser_call(_data);
    } else {
      wx.showModal({
        title: "口袋提示",
        content: "您的信息没有填写完整  \r\n  请填写完整后再进行提交",
        showCancel: false,
        success: function (res) { }
      })
    }
  },
  /*
  在校生完善信息请求
  */
  updateUser_call: function (_data) {
    console.log(county, city, province, schoolCode)
    var self = this;
    wx.request({
      url: updateUser,
      data: {
        fdGender: _fdGender,
        signature: signature,
        province: province,
        city: city,
        county: county,
        school: school,
        userLabel: current_userLabel,
        birthday: birthday,
        openId: _data,
        constellation: current_constellation,
        schoolCode: schoolCode,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: res => {
        if (res.data > -1) {
          self.setData({
            modalSys: false,
            modalTap: "toIndex",
          })
        } else if (res.data <= -1) {
          self.setData({
            modalSys: true,
            modalTap: "noModal",
          });
          wx.showModal({
            title: "口袋提示",
            content: "您的信息提交失败，请重新进行提交",
            showCancel: false,
            success: function (res) { }
          })
        } else {
          self.setData({
            modalSys: true,
            modalTap: "noModal",
          });
          wx.showModal({
            title: "口袋提示",
            content: "您的信息提交失败，请重新进行提交",
            showCancel: false,
            success: function (res) { }
          })
        }
      },
      fail: err => {
        wx.showModal({
          title: "口袋提示",
          content: "您的信息提交失败，请重新进行提交",
          showCancel: false,
          success: function (res) { }
        })
      }
    })
  },
  /*
  *非在校完胜信息
  */
  noSchoolUpData: function (_data) {
    var self = this;
    let Gender = _fdGender != null && _fdGender != undefined && _fdGender != '';
    let _signature = signature != null && signature != undefined && signature != '';//自我描述
    let _province = province != null && province != undefined && province != '';//省
    let _city = city != null && city != undefined && city != '';//市
    let _county = county != null && county != undefined && county != '';//县、区
    let _current_userLabel = current_userLabel != null && current_userLabel != undefined && current_userLabel != '';
    let _birthday = birthday != null && birthday != undefined && birthday != '';
    let _openId = _data != null && _data != undefined && _data != '';
    let _current_constellation = current_constellation != null && current_constellation != undefined && current_constellation != '';
    let allData = Gender && _signature && _province && _city && _county && _current_userLabel && _birthday && _openId && _current_constellation;
    if (allData) {
      self.noSchoolUpData_call(_data);
    } else {
      wx.showModal({
        title: "口袋提示",
        content: "您的信息没有填写完整，请填写完整后再进行提交",
        showCancel: false,
        success: function (res) { }
      })
    }
  },
  /*
  *非在校完善信息请求
  */
  noSchoolUpData_call: function (_data) {
    var self = this;
    wx.request({
      url: updateUser,
      data: {
        fdGender: _fdGender,
        signature: signature,
        province: province,
        city: city,
        county: county,
        userLabel: current_userLabel,
        birthday: birthday,
        openId: _data,
        constellation: current_constellation
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: res => {
        // console.log(res)
        if (res.data > -1) {
          self.setData({
            modalSys: false,
            modalTap: "toIndex",
          })
        } else if (res.data <= -1) {
          self.setData({
            modalSys: true,
            modalTap: "noModal",
          });
          wx.showModal({
            title: "口袋提示",
            content: "您的信息提交失败，请重新进行提交",
            showCancel: false,
            success: function (res) { }
          })
        } else {
          self.setData({
            modalSys: true,
            modalTap: "noModal",
          });
          wx.showModal({
            title: "口袋提示",
            content: "您的信息提交失败，请重新进行提交",
            showCancel: false,
            success: function (res) { }
          })
        }
      },
      fail: err => {
        wx.showModal({
          title: "口袋提示",
          content: "您的信息提交失败，请重新进行提交",
          showCancel: false,
          success: function (res) { }
        })
      }
    })
  },
  //------------------------------ 提交信息请求 end-----------------------------
})