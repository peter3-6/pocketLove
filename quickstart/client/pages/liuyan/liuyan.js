const app = getApp();
var openId
const config = require("../../config.js");
const openidUrl = config.service.openidUrl
const createMessage = config.service.createMessage,
  selectManageMessage = config.service.selectManageMessage,
  selectActivityByFdFlag = config.service.selectActivityByFdFlag
var activityId
Page({
  data: {},
  //--------------------------------生命周期开始----------------------------
  onLoad: function() {},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.request({
      url: selectManageMessage,
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: res => {
        console.log(res)
        var datas = res.data;
        this.setData({
        datas: datas
        })
      },
      fail: err => {},
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
var self = this;
    self.getSelectManageMessage()//获取留言列表
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {


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
  onPullDownRefresh: function() {
    var self = this;
    self.getSelectManageMessage()//获取留言列表
  },
  onReachBottom: function() {

  },
  //--------------------------------生命周期结束----------------------------
  /*
  提交留言操作
   */
  formSubmit: function(e) {
    var self = this;
    var leavelWord = e.detail.value["radio-group"];
    wx.request({
      url: createMessage,
      data: {
        "leavelWord": leavelWord,
        "activityId": activityId,
        "openId": openId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: res => {
        var datas = res.data;
        self.setData({
          datas: datas
        })
        self.back()
      },
      fail: err => {

      },
    })
  },
  back: function() {
    wx.navigateTo({
      url: '/pages/my/my'
    })
  },
  // 获取留言列表
  getSelectManageMessage:function(){
    var self = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.request({
      url: selectManageMessage,
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: res => {
        console.log(res)
        var datas = res.data;
        self.setData({
          datas: datas
        })
      },
      fail: err => {

      },
      complete() {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  }
})