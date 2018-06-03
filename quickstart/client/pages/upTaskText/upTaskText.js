const app = getApp();
var missionNames, activityId, openId, _i = 1;
const config = require("../../config.js")
const submit = config.service.submit,
  addTemplateMessage2 = config.service.addTemplateMessage2,
  sendMissionTemplate = config.service.sendMissionTemplate,
  upTaskImg = config.service.upTaskImg + "?fdId=";//图片
var missionId, activityConfigureId, upTaskT, missionContent, activityId, missionType, _j = 1;
Page({
  data: {
    modal: true,
    fixed: false,
    textarea: "",
    cue: "*请上传",
    cueCue: "文本",
    upTask: true,
    upTaskImg: upTaskImg
  },
  onLoad: function (option) {
    console.log(option)
    let self = this;
    let imgPath = option['imgPath'];
    let if_imgPath = imgPath == null || imgPath == undefined || imgPath == '' || imgPath == 'null' || imgPath == 'undefined';
    // let if_imgPath = imgPath == null || imgPath == undefined || imgPath == '' || imgPath == 'null';
    let upTask = option['missionName'];
    activityConfigureId = option['activityConfigureId'];
    missionId = option['missionId'];
    missionType = option['missionType'];
    console.log(imgPath, upTask, activityConfigureId, missionId, missionType)
    self.setData({
      missionName: upTask,
      missionId: missionId,
      if_imgPath: if_imgPath
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    _i = 1;
    app.getOpenId(function (_data) {
      openId = _data;
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    _i = 1;
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
    let i = _i++;
    let tomorrowB = e.detail.formId;
    var self = this;
    var value = e.detail.value;
    missionContent = value.upTask;
    var length = missionContent.length;
    if (i === 1) {
      if (length <= 2) {
        _i = 1
        // console.log(_i)
        wx.showModal({
          title: "口袋提示",
          content: "请您提交大于2个字的内容",
          showCancel: false,
        })
      } else {
        self.submit()
      }
    }
  },
  formReset: function () {
    wx.redirectTo({
      url: '../../pages/startTask/startTask',
    })
  },
  toTask: function () {
    wx.redirectTo({
      url: '../../pages/task/task'
    })
  },
  // startTask() {
  //   // console.log("startTask")
  //   wx.redirectTo({
  //     url: '../startTask/startTask?matchingState=3',
  //   })
  // },
  /*
  提交文本任务
   */
  submit() {
    var self = this;
    let a;
    if (a == null || a == undefined || a == '') {
      app.getOpenId(function (a) {
        openId = a;
      });
    }
    let g;
    if (g == null || g == undefined || g == '') {
      app.getActivityId(function (g) {
        activityId = g;
      });
    }
    if (openId && activityId) {
      self.submit_call(openId, activityId)
    }
  },
  submit_call: function (openId, activityId) {
    var self = this;
    wx.request({
      url: submit,
      data: {
        missionContent: missionContent,
        openId: openId,
        activityId: activityId,
        activityConfigureId: activityConfigureId,
        missionId: missionId,
        missionType: missionType,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        let data = res.data;
        if (data >= 1) {
          self.sendTaskNews();
          wx.showModal({
            title: '口袋提示',
            content: '恭喜你提交成功',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                self.toTask();
              }
            }
          })
        } else if (data == -2) {
          wx.showModal({
            title: '口袋提示',
            content: '任务不可以重复提交',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                self.toTask();//跳转到任务查询页面
              }
            }
          })
        } else {
          wx.showModal({
            title: '口袋提示',
            content: '任务提交失败，请重新提交任务',
            showCancel: false,
            success: function (res) {
              if (res.confirm) { }
            }
          })
        }
      },
      fail: err => { }
    })
  },
  /*
  modal不显示
   */
  // noModal() {
  //   var self = this;
  //   self.setData({
  //     modal: true,
  //   })
  // },
  upTask() {
    var self = this;
    self.startTask()
  },
  /*
 小贴士消失
   */
  // hidden() {
  //   var self = this;
  //   self.setData({
  //     modal: true,
  //     givingGift: true,
  //   })
  // },
  //发送模板消息通知的请求
  sendTaskNews: function () {
    let self = this;
    //sendMissionTemplate
    let a, g;
    if (a == null || a == undefined || a == '') {
      app.getOpenId(function (a) {
        openId = a;
      });
    };
    if (g == null || g == undefined || g == '') {
      app.getActivityId(function (g) {
        activityId = g;
      });
    };
    console.log(a, g, openId, activityId)
    if (openId && activityId) {
      self.sendTaskNews_call(openId, activityId)
    };
  },
  sendTaskNews_call: function (openId, activityId) {
    let self = this;
    wx.request({
      url: sendMissionTemplate,
      data: {
        openId: openId,
        activityId: activityId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        // console.log('完成任务消息，',res)
      },
      fail: function (err) {

      }
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