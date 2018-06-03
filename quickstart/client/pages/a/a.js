const app = getApp();
var data, province, city, county, school, _school, fdNumber, activityId, current, checkedState, currentOpenId, AschoolCode;
const config = require("../../config.js");
const selectUserByOpenId = config.service.selectUserByOpenId,
  addUserApply = config.service.addUserApply;
const getToken = config.service.getToken,
  sendApplyTemplate = config.service.sendApplyTemplate;
Page({
  data: {
    currentTab: 0,
    checked: false,
    region: [],
    addessModal: true,
    conditionModal: true,
    upSchoolTap: "formSubmit",
  },
  onLoad: function () {
    this.$wuxPicker = app.Wux().$wuxPicker;
    this.$wuxPickerCity = app.Wux().$wuxPickerCity;
    this.initPage();
  },
  onShow: function () {
    this.initPage();
  },
  onReady: function () { },
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
  initPage: function () {
    let self = this;
    //获取本次活动ID
    if (activityId == null || activityId == "") {
      app.getActivityId(function a_initPage_getActivityId(_data) {
        activityId = _data;
        app.getOpenId(function (_data2) {
          currentOpenId = _data2;
        });
      });
    } else {
      app.getOpenId(function (_data) {
        currentOpenId = _data;
      });
    }
  },
  /*
  复选框
   */
  checkboxChange: function (e) {
    checkedState = e.detail.value;
    var self = this;
    //判断是否扩大范围的UI显示
    if (checkedState == "address") {
      self.setData({
        addessModal: false
      })
    } else {
      self.setData({
        addessModal: true
      })
    }
  },
  /*
  进行城市匹配
   */
  formSubmit(e) {
    let b = e.detail.formId;
    let _b = b == null || b == undefined || b == '';
    if (!_b) {
      try {
        wx.setStorageSync('b', b)
      } catch (e) { }
    }
    var self = this;
    var currentA = current;
    if (currentA == 0) {
      self.schoolAgreement() //匹配学校时学校一致的效果层
    } else if (currentA == 1) {
      if (city == undefined || city == null || city == '') {
        self.setData({
          addessText: "*温馨提示：请把地址选择完整"
        })
      } else {
        self.addess(); //地址匹配
      }
    } else if (currentA == undefined || currentA == null) {
      //判断匹配条件的学校是否填写
      self.schoolAgreement();
    }
  },
  /*
  匹配学校时学校一致的效果层
   */
  schoolAgreement() {
    var self = this;
    if (checkedState == null || checkedState == undefined || checkedState == '') {
      wx.showModal({
        title: '小贴士',
        content: '是否尝试扩大匹配范围，扩大范围后可能匹配上的Ta为非在校学生',
        cancelText: "否",
        cancelColor: "#4dca33",
        confirmText: "是",
        success: function (res) {
          if (res.confirm) {
            checkedState = "address";
            self.setData({
              addessModal: false,
              checked: true,
              upSchoolTap: "cityMethod",
            })
          } else if (res.cancel) {
            let a = (school == undefined || school == null || school == '');
            if (!a) {
              self.schoolMethod(); //进行学校匹配
            } else {
              wx.showModal({
                title: '口袋提示',
                content: '请选择匹配学校',
                showCancel: false,
                // success: function (res) {
                //   if (res.confirm) { }
                // }
              })
            }
          }
        }
      })
    } else {
      self.cityMethod();
    }
  },
  /*
  判断扩大范围时的城市选项是否为空
   */
  cityMethod() {
    var self = this;
    if (checkedState == "address") {
      if (city == undefined || city == null || city == '') {
        self.setData({
          schoolText: "*温馨提示：请把城市选择完整",
        })
      } else {
        self.expand() //扩大匹配范围
      }
    } else {
      self.schoolMethod();
    }
  },
  /*
  扩大匹配范围
   */
  expand() {
    var self = this;
    wx.request({
      url: addUserApply,
      data: {
        "openId": currentOpenId,
        "activityId": activityId,
        "city": city,
        "school": school,
        "schoolCode": AschoolCode,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: res => {
        let _data = res.data;
        if (_data > -1) {
          //报名及扩大范围的消息通知
          try {
            let b = wx.getStorageSync('b')
            let a = currentOpenId;
            if (b) {
              self.upAandB(a, b);
            }
          } catch (e) { }
          //匹配条件提交成功
          self.upMateConditionSuccess();
        } else {
          //匹配条件提交失败
          self.upMateConditionFail();
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  /**
  进行城市匹配
  */
  addess() {
    var self = this;
    wx.request({
      url: addUserApply,
      data: {
        "openId": currentOpenId,
        "activityId": activityId,
        "city": city
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: res => {
        let _data = res.data;
        if (_data > -1) {
          // 报名及城市匹配的消息通知
          try {
            let b = wx.getStorageSync('b');
            let a = currentOpenId;
            if (b) {
              self.upAandB(a, b);
            }
          } catch (e) { }
          //匹配条件提交成功
          self.upMateConditionSuccess();
        } else {
          //匹配条件提交失败
          self.upMateConditionFail();
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  /*
  学校匹配事件
   */
  schoolMethod: function () {
    var self = this;
    self.schoolMatching();
  },
  /*
  学校匹配事件
   */
  schoolMatching: function () {
    // console.log(AschoolCode)
    var self = this;
    wx.request({
      url: addUserApply,
      data: {
        "openId": currentOpenId,
        "activityId": activityId,
        "school": school,
        "schoolCode": AschoolCode,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: res => {
        let _data = res.data;
        if (_data > -1) {
          //报名及学校匹配的消息通知
          try {
            let b = wx.getStorageSync('b')
            let a = currentOpenId;
            if (b) {
              self.upAandB(a, b);
            }
          } catch (e) { }
          //匹配条件提交成功
          self.upMateConditionSuccess();
        } else {
          //匹配条件提交失败
          self.upMateConditionFail();
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },
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
  /*
   *触发选择地址的方法
   */
  bindRegionChange: function (e) {
    var that = this;
    var address = e.detail.value
    province = address[0];
    city = address[1];
    county = address[2];
    var region = e.detail.value;
    that.setData({
      region: region,
    })
  },
  /*
  底部弹出的学校选择
   */
  onTapCity: function (e) {
    const that = this;
    that.$wuxPickerCity.init('city', {
      title: '请选择学校',
      onChange(value, values, displayValues) {
        that.setData({
          city0: displayValues[0],
          city1: displayValues[1],
          city2: displayValues[2]
        })
        school = displayValues[2];
        AschoolCode = values[2];
      },
    })
  },
  /*
  效果层消失
   */
  hidden() {
    var self = this;
    self.setData({
      conditionModal: true,
    })
  },
  /*
  匹配条件提交成功的交互层
   */
  upMateConditionSuccess() {
    var self = this;
    self.setData({
      conditionModal: false,
      conditionModalTap: "toIndex"
    })
  },
  /*
  匹配条件提交失败的交互层
   */
  upMateConditionFail() {
    var self = this;
    self.setData({
      conditionModal: false,
      regCueT: "小贴士：",
      regCueB: "你的匹配条件提交失败，请尝试重新提交",
      conditionModalTap: "hidden",
    })
  },
  /*
  报名成功后的事件
   */
  toIndex: function () {
    wx.redirectTo({
      url: '../../pages/index/index',
    })
  },
  //send parameter a and b
  upAandB: function (a, b) {
    console.log(a,b);
    let self = this;
    wx.request({
      url: sendApplyTemplate,
      data: {
        'openId': a,
        'form_id': b
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
      },
      fail: function (err) { },
      complete: function (res) { },
    })
  },
})