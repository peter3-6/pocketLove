const config = require("../../config.js");
const selectMessageByOpenId = config.service.selectMessageByOpenId;
const app = getApp();
Page({
  data: { },
  //---------- life cycle start----------------
  onShow: function () {
    let self = this;
    self.initPageData();
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
  onPullDownRefresh: function () {
    let self = this;
    self.initPageData();
  },
  onReachBottom: function () {

  },
  //---------- life cycle end----------------
  //--------Initialize the page data -----------
  initPageData() {
    let self = this;
    self.getA()
  },
  //------------get data a--------------
  getA: function () {
    let self = this;
    let a;
    if (a == null || a == undefined || a == '') {
      app.getOpenId(function getA_call(a) {
        self.getG(a)
      });
    }
  },
  //------------get data g------------
  getG: function (a) {
    let self = this;
    let g;
    if (g == null || g == undefined || g == '') {
      app.getActivityId(function getG_call(g) {
        self.getMessagesList(a, g);
      });
    }
  },
  //-------------get a list of messages-----------
  getMessagesList: function (a, g) {
    let self = this;
    wx.request({
      url: selectMessageByOpenId,
      data: {
        "openId": a,
        "activityId": g,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: res => {
      let  datas = res.data
        this.setData({
          datas: datas
        })
      },
      fail: err => {
        console.log(err)
      },
      complete() {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
    })
  },
})