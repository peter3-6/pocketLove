var app = getApp();
var openId;
const config = require("../../config.js")
const readMessage = config.service.readMessage,
  messageList = config.service.messageList
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageModal: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var self = this;
    app.getOpenId(function (_data) {
      openId = _data;
      self.upMessageList();
    });
    
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.upMessageList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

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
  /*
  获取消息
   */
  upMessageList() {
    var self = this;
    wx.showNavigationBarLoading()
    wx.request({
      url: messageList,
      data: {
        // "activityId": activityId,
        "openId": openId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function(res) {
        console.log(res) //
        var datas = res.data;
        console.log(datas[0])
        self.setData({
          datas: datas
        })
      },
      fail: function(err) {
        console.log(err)
      },
      complete() {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
    })
  },
  /*
  礼物内容详情
   */
  datasList() {
    var self = this;
    self.setData({
      messageModal: false,
      messageTap: 'noModal'
    })
  },
  /*
  隐藏消失层
   */
  noModal() {
    var self = this;
    self.setData({
      messageModal: true,
    })
  }
})