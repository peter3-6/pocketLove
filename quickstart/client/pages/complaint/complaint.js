//
var app = getApp();
var openId, activityId;
const config = require("../../config.js")
const createComplain = config.service.createComplain;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // activityId = app.getActivityId();
    // openId = app.getOpenId();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

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
  formSubmit: function (e) {
    var self = this;
    var value = e.detail.value;
    var complaintContent = value.complaintDescribe
    app.getActivityId(function complaint_form_getActivityId(_data) {
      activityId = _data;
      app.getOpenId(function complaint_form_getOpenId(_data2) {
        openId = _data2;
        wx.request({
          url: createComplain,
          data: {
            "activityId": activityId,
            "openId": openId,
            "complaintContent": complaintContent
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          success: function (res) {
            // console.log(res)
            if (res.data == 1) {
              wx.showModal({
                title: '口袋提示',
                content: '投诉成功',
                showCancel: false,
                success: function (res) { 
                  self.toMyPage();
                }
              })

            } else {
              wx.showModal({
                title: '口袋提示',
                content: '投诉失败',
                showCancel: false,
                success: function (res) { }
              })
            }
          }
        })
      });
    });
  },

  /*
  重置按钮操作
   */
  formReset: function () { },
  toMyPage:function(){
    wx.redirectTo({
      url: '../../pages/my/my',
    })
  }
})