const app = getApp();
// var activityId, openId, value;
var activityId, openId;
const config = require("../../config.js");
const createMessage = config.service.createMessage;
Page({
  // data: {},
  //----------life cycle start-----------------
  /**
   * 生命周期函数--监听页面显示
   */
  // onShow: function() {
  //   // var self = this;
  //   // self.initUserInfo();
  // },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // var self = this;
    // self.initUserInfo();
  },
  /**
   * 用户点击右上角分享
   */
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
  //----------life cycle end-----------------
  //----------up data start----------------
  bindFormSubmit: function (e) {
    let b = e.detail.formId;
    let self = this;
    let value = e.detail.value.textarea;
    let length = value.length;
    console.log(b, ":", value, ":", length)
    if (value != undefined && value != null && value != '') {
      if (value.length <= 4) {
        wx.showModal({
          title: "口袋提示",
          content: "最少输入5个字",
          showCancel: false,
          success: function (res) { }
        })
      } else if (value.length > 50) {
        wx.showModal({
          title: "口袋提示",
          content: "最多输入50个字",
          showCancel: false,
        })
      } else {
        self.upLeavingAMessage(value);
      }
    } else if (value == '') {
      wx.showModal({
        title: "口袋提示",
        content: "请输入留言内容",
        showCancel: false,
      })
    }
  },
  //----------up data end----------------
  //----------Message request start-------------
  upLeavingAMessage: function (value) {
    // console.log(value)
    let self = this;
    if (openId == null || openId == undefined || openId == "") {
      app.getOpenId(function leaveWord_getA(a) {
        self.upLeavingAMessage_call(a, value)
      });
    } else {
      let a = openId;
      self.upLeavingAMessage_call(a, value)
    }
  },
  upLeavingAMessage_call: function (a, value) {
    let self = this;
    if (activityId == null || activityId == undefined || activityId == "") {
      app.getActivityId(function leaveWord_getG(g) {
        // let g = activityId;
        console.log(a, g, value)
        self.upLeavingAMessage_callback(a, g, value)
      });
    } 
    else {
      let g = activityId;
      self.upLeavingAMessage_callback(a, g, value)
    }
  },
  upLeavingAMessage_callback: function (a, g, value) {
    let self = this;
    // console.log("a:", a, "g", g, "value", value)
    wx.request({
      url: createMessage,
      data: {
        "leavelWord": value,
        "activityId": g,
        "openId": a
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: res => {
        // console.log(res.data)
        let datas = res.data;
        if (res.data > 0) {
          wx.showModal({
            title: "口袋提示",
            content: "留言成功",
            showCancel: false,
            success: function (res) {
              self.back();
            }
          })
        } else {
          wx.showModal({
            title: "口袋提示",
            content: "留言失败，请检查网络后重新提交",
            showCancel: false,
            success: function (res) { }
          })
        }
      },
      fail: err => { },
    })
  },
  bindFormSubmit_call: function () {
    var self = this;
    wx.request({
      url: createMessage,
      data: {
        "leavelWord": value,
        "activityId": activityId,
        "openId": openId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: res => {
        var datas = res.data;
        if (res.data > 0) {
          wx.showModal({
            title: "口袋提示",
            content: "留言成功",
            showCancel: false,
            success: function (res) {
              self.back();
            }
          })
        } else {
          wx.showModal({
            title: "口袋提示",
            content: "留言失败，请检查网络后重新提交",
            showCancel: false,
            success: function (res) { }
          })
        }
      },
      fail: err => { },
    })
  },
  //----------Message request end-------------
  //----------跳转个人中心页面start----------------
  back: function () {
    wx.navigateTo({
      url: '/pages/my/my'
    })
  },
  //----------跳转个人中心页面end----------------
  //----------公共方法start----------------
  //1、初始化用户信息
  //   initUserInfo: function() {
  //     var self = this;
  //     app.init_getOpenId(function leaveWordInitPage_callback(_data) {
  //       self.leaveWordInitPage(_data);
  //     });
  //   },
  //   //2、初始化加载页面默认加载数据
  //   leaveWordInitPage: function(_data) {
  //     let self = this;
  //     if (_data == null || _data == undefined) {
  //       wx.showModal({
  //         title: "口袋提示",
  //         content: "首页获取用户信息失败，请检查网络",
  //         showCancel: false,
  //         success: function(res) {}
  //       })
  //     } else {
  //       openId = _data.openId;
  //       self.leaveWordGetActivityId(openId);
  //     }
  //   },
  //   //----------公共方法end---------------
  // leaveWordGetActivityId: function(openId) {
  //     if (activityId == null || activityId == "") {
  //       app.getActivityId(function index_activityCountDown_getActivityId(_data) {
  //         activityId = _data;
  //       });
  //     }
  //   },
})