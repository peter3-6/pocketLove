const config = require("../../config.js")
var activityId, missionId, activityConfigureId;
let upTaskImg = config.service.upTaskImg + "?fdId=";//图片
Page({
  data: {
    cue: "*请选择图片",
    IMG: "",
    images: upTaskImg,
  },
  onLoad: function (options) {
    // console.log(options)
    let self = this;
    let upTask = options['missionName'];
    let imgPath = options['imgPath'];
    // console.log(imgPath)
    let if_imgPath = imgPath == null || imgPath == undefined || imgPath == '' || imgPath == 'null' || imgPath == 'undefined';
    // let if_imgPath = imgPath == null || imgPath == undefined || imgPath == '' || imgPath == 'null';
    activityConfigureId = options['activityConfigureId'];
    missionId = options['missionId'];
    self.setData({
      missionName: upTask,
      fdId: missionId,
      if_imgPath: if_imgPath
    })
  },
  onReady: function () { },
  onShow: function () { },
  onPullDownRefresh: function () { },
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
  formSubmit: function () {
    wx.redirectTo({
      url: '../canvas/canvas' + '?activityConfigureId=' + activityConfigureId + '&missionId=' + missionId
    })
  },
  //预览图片任务(赞赏功能)
  clickImg: function () {
    let self = this;
    let imgUrls = upTaskImg + missionId;
    wx.previewImage({
      current: imgUrls[0],
      urls: [imgUrls], 
    })
  },
})