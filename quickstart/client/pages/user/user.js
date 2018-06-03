var openId;
const app = getApp()
const config = require("../../config.js")
const openidUrl = config.service.openidUrl
const selectUserByOpenId = config.service.selectUserByOpenId
const userApply = config.service.userApply
const selectActivityByFdFlag = config.service.selectActivityByFdFlag
const countDown = config.service.countDown,
  createUser = config.service.createUser
Page({
  data: {
    disabled: true,
    avatarUrl: "",
    nickName: "",
    userLabel: "",
    signature: ""
  },
  onLoad: function (options) {},
  userImg: function () {
    wx.previewImage({
      urls: [missionedImage + '?fdId=' + datas[1].fdId]
    })
  },
  /*
  加载自己的的详细信息
   */
  getInfo: function () {
    let self = this;
    if (openId == null || openId == undefined || openId == '') {
      app.getOpenId(function user_getOpenId(_data) {
        self.getInfo_call(_data)
      });
    }
  },
  getInfo_call(_data) {
    let self = this;
    wx.showLoading({
      title: '缘分加载中。。。',
      mask: true,
    })
    wx.showNavigationBarLoading()
    wx.request({
      url: selectUserByOpenId,
      data: {
        "openId": _data
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: res => {
        wx.hideLoading()
        let gender = res.data.fdGender;
        if (gender == '女') {
          self.setData({
            headImg: "https://koudaizhilian-1254460722.cosbj.myqcloud.com/images/Gender1.jpg"
          })
        } else if (gender == '男') {
          self.setData({
            headImg: "https://koudaizhilian-1254460722.cosbj.myqcloud.com/images/Gender2.jpg"
          })
        }
        var school = res.data.school,//学校
          nickName = res.data.nickName,//昵称
          fdGender = res.data.fdGender,//性别
          userLabel = res.data.userLabel,//标签
          charismata = res.data.charismata,//魅力值
          constellation = res.data.constellation,//星座
          signature = res.data.signature,//个人描述
          city = res.data.city,//市
          province = res.data.province;//省
        self.setData({
          nickName: nickName,
          userLabel: userLabel,
          signature: signature,
          fdGender: fdGender,
          province: province,
          city: city,
          constellation: constellation,
          school: school,
        })
      },
      fail: err => { },
      complete() {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  onReady: function () { },
  onShow: function () {
    var self = this;
    self.getInfo();
  },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () {
    var self = this;
    self.getInfo();
  },
  onReachBottom: function () { },
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
})