const app = getApp();
const config = require("../../config.js")
const selectUserByOpenId = config.service.selectUserByOpenId,
  applyCountDown = config.service.applyCountDown,
  addTemplateMessage = config.service.addTemplateMessage;
Page({
  data: {
    welcomeImg: "http://koudaizhilian-1254460722.cosbj.myqcloud.com/images/wwlcome6.jpg"
  },
  //----------生命周期 start ----------
  onLoad: function () {
    /*
    一、在欢迎页面（welcome.wxml）的操作
    1.先发请求获取下activityId
    2.把activityId缓存到本地
    3.取出本地的activityId清除掉
    4.清除掉的activityId为undefined
    二、在报名页面（index.wxml）的操作
    5.在报名页面activityId为undefined时再重新发送请求获取下activityId
    */
    // 1.先发请求获取下activityId
    app.getActivityId(function welcome_getE(activityId) {
      //  2.把activityId缓存到本地
      try {
        wx.setStorageSync('activityId', activityId);
        //3.取出本地的activityId清除掉
        try {
          var activityId = wx.getStorageSync('activityId')
          if (activityId) {
            //清除掉activityId
            try {
              // wx.clearStorageSync();
              wx.removeStorageSync('activityId')
            } catch (e) { }
          }
        } catch (e) { }
      } catch (e) { }
    });
  },
  onShow: function () {
    wx.showShareMenu({
      withShareTicket: true
    })

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
  //----------生命周期 end----------
  //查看宣传片
  butVio: function () {
    let self = this;
    console.log("进入宣传片页面");
    wx.navigateTo({
      url: '/pages/video/video?id=1',
    })
  },
  //
  startSign: function () {
    let self = this;
    self.getUInFo();
  },
  //获取当前用户的信息
  getUInFo: function () {
    let self = this;
    let a;
    let _a = a == null || a == '' || a == undefined || a == 'null' || a == 'undefined';
    if (_a) {
      app.getOpenId(function(a){
        self.getUInFo_call(a);
      });
    } else {
      wx.showModal({
        title: '错误提示',
        content: '获取不到用户数据',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  getUInFo_call:function(a){
    let self = this;
    wx.request({
      url: selectUserByOpenId,
      data: {
        "openId": a,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success:function(res){
        let data = res.data;
        let _data = data == null || data == '' || data == undefined || data == 'null' || data == 'undefined';
        if(!_data){
          let userFlag = data.userFlag;
          let _userFlag = userFlag == null || userFlag == '' || userFlag == undefined || userFlag == 'null' || userFlag == 'undefined';
          if (userFlag == 3 || userFlag == 4){
            self.toIndexPage();
          } else {
            //执行活动报名时间查询
            self.getRegTime();
          }
        }else{
          // console.log("获取不到用户信息");
          self.getRegTime();
        }
      },
      fail:function(err){
        wx.showModal({
          title: '错误提示',
          content: err,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    })
  },
  getRegTime: function () {
    let self = this;
    let e;
    if (e == '' || e == null || e == undefined) {
      app.getActivityId(function (e) {
        self.getRegTime_call(e)
      });
    }
  },
  getRegTime_call: function (e) {
    let self = this;
    wx.request({
      url: applyCountDown,
      data: {
        "activityId": e,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      }, 
      method: "POST",
      success: function (res) {
        let data = res.data;
        if (data <= 60) {
          wx.showToast({
            title: '报名已截止',
            icon: 'none',
            duration: 2000,
            mask: true
          })
        } else {
          self.toIndexPage();
        }
      },
      fail: function (err) {
        wx.showModal({
          title: '错误提示',
          content: err,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    })
  },
  //Jump to the index page
  toIndexPage:function(){
    let self = this;
    wx.redirectTo({
      url: '../../pages/index/index'
    })
  }
})