import Wux from 'utils/wux'; //从wux文件中只加载Wux方法
var config = require('./config')
const openidUrl = config.service.openidUrl,
  createUser = config.service.createUser,
  selectActivityByFdFlag = config.service.selectActivityByFdFlag,
  selectUserByOpenId = config.service.selectUserByOpenId,
  readMessage = config.service.readMessage,
  messageList = config.service.messageList,
  controlMessage = config.service.controlMessage,
  // selectUserByOpenId = config.service.selectUserByOpenId,
  selectGiftLibrary = config.service.selectGiftLibrary;
var openId;
var nickName,
  fdGender,
  userLabel,
  charismata,
  constellation,
  signature,
  setInterval_callBack,
  perfectUserInfo,
  _endCallBack,
  activityId,
  timer;
App({
  //获取默认活动ID
  getActivityId: function (_callBack) {
    var that = this;
    activityId = wx.getStorageSync("activityId");
    if (!that.isBlank(activityId)) {
      _callBack(activityId);
    } else {
      that.findActivityId(_callBack, 0);
    }
  },
  findActivityId: function (_callBack, _count) {
    var that = this
    _count = _count + 1;
    if (_count < 6) {
      // 获取活动id
      wx.request({
        url: selectActivityByFdFlag,
        data: {},
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: "POST",
        success: res => {
          activityId = res.data.fdId;
          // console.log(activityId)
          if (that.isBlank(activityId)) {
            that.findActivityId(_callBack, _count);
          } else {
            try {
              wx.setStorageSync('activityId', activityId)
            } catch (e) { }
            if (typeof _callBack === "function") {
              _callBack(activityId);
            }
          }
        },
        fail: err => {
          // console.log(err)
        }
      })
    } else {
      wx.showModal({
        title: "口袋提示",
        content: "尝试多次获取活动信息失败，请检查网络",
        showCancel: false,
        success: function (res) { }
      })
    }
  },
  //获取当前用户openId
  getOpenId: function (_callBack) {
    var that = this;
    openId = wx.getStorageSync("openId");
    // console.log(openId)
    if (!that.isBlank(openId)) {
      _callBack(openId);
    } else {
      that.findgetOpenId(_callBack, 0);
    }
  },
  findgetOpenId: function (_callBack, _count) {
    var that = this
    _count = _count + 1;
    if (_count < 6) {
      wx.login({
        success: res => {
          wx.request({
            url: openidUrl,
            data: {
              js_code: res.code
            },
            method: 'GET',
            success: res => {
              openId = res.data;
              // console.log(openId)
              if (that.isBlank(openId)) {
                that.findgetOpenId(_callBack, _count);
              } else {
                //-------------------------------
                wx.setStorage({
                  key: "openId",
                  data: openId,
                })
                wx.showLoading({
                  title: '缘分加载中...',
                })
                wx.getUserInfo({
                  success: res => {
                    wx.hideLoading();
                    if (typeof _callBack === "function") {
                      _callBack(openId);
                    }
                    var userInfo = that.globalData.userInfo = res.userInfo;
                    var nickName = userInfo.nickName,
                      gender = userInfo.gender,
                      avatarUrl = userInfo.avatarUrl,
                      city = userInfo.city,
                      country = userInfo.country,
                      language = userInfo.language,
                      province = userInfo.province;
                    let _nickName = nickName == null || nickName == undefined || nickName == '';
                    if (!_nickName) {
                      var data = {
                        openId,
                        nickName,
                        gender,
                        avatarUrl,
                        city,
                        country,
                        language,
                        province
                      }
                      wx.request({
                        url: createUser,
                        data: data,
                        header: {
                          'content-type': 'application/x-www-form-urlencoded'
                        },
                        method: "POST",
                        success: res => { 
                          // console.log(res)
                        },
                        fail: err => { }
                      })
                    }
                    else {
                      wx.showModal({
                        title: '口袋提示',
                        content: '口袋之恋获取不到您的信息，请您在微信客户端完善好信息再进入',
                        showCancel: false,
                        success: function (res) {
                          if (res.confirm) { }
                        }
                      })
                    }
                  },
                })
              }
            }
          })
        }
      })
    } else {
      wx.showModal({
        title: "口袋提示",
        content: "多次尝试获取用户授权信息失败，请检查网络",
        showCancel: false,
        success: function (res) { }
      })
    }
  },
  /*
   * 根据openId，从后台获取用户基本信息
   */
  getUserInfo: function (_callBack) {
    var that = this;
    that.getOpenId(function app_getUserInfo(_openId) {
      openId = _openId;
      wx.request({
        url: selectUserByOpenId,
        data: {
          "openId": openId
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: "POST",
        success: res => {
          that.perfectUserInfo = res.data;
          //判断是否有用户信息
          if (res.data != "") {
            if (typeof _callBack === "function") {
              _callBack(res.data);
            }
          }
        },
        fail: err => { }
      })
    });
  },
  //系统倒计时方法
  cpu_setInterval: function (data, _callBack, _endCallBack) {
    var that = this;
    that.setInterval_callBack = _callBack;
    that._endCallBack = _endCallBack;
    clearInterval(timer);
    timer = setInterval(function () {
      data--;
      let days = (Math.floor(data / 1440 / 60)) > 9 ? (Math.floor(data / 1440 / 60)) : ('0' + (Math.floor(data / 1440 / 60)))
      let hours = (Math.floor((data - days * 1440 * 60) / 3600)) > 9 ? (Math.floor((data - days * 1440 * 60) / 3600)) : ('0' + (Math.floor((data - days * 1440 * 60) / 3600)))
      let minutes = (Math.floor((data - days * 1440 * 60 - hours * 3600) / 60)) > 9 ? (Math.floor((data - days * 1440 * 60 - hours * 3600) / 60)) : ('0' + (Math.floor((data - days * 1440 * 60 - hours * 3600) / 60)));
      let seconds = ((data - days * 1440 * 60 - hours * 3600 - minutes * 60)) > 9 ? ((data - days * 1440 * 60 - hours * 3600 - minutes * 60)) : ('0' + ((data - days * 1440 * 60 - hours * 3600 - minutes * 60)));
      console.log()
      if (typeof that.setInterval_callBack === "function") {
        that.setInterval_callBack(days, hours, minutes, seconds);
      }
      if (data <= 0) {
        if (typeof that._endCallBack === "function") {
          that._endCallBack();
        }
        clearInterval(timer);
      }
    }, 1000)
  },
  onLaunch: function () { },
  //判断参数是否为空
  isBlank: function (obj) {
    return (obj == null || obj == undefined || obj == "");
  },
  onError: msg => { },
  globalData: {
    userInfo: null
  },
  Wux: Wux,
  pageButtonInit: function (obj) {
    obj.setData({
      toIndexPage: 'toHomePage',
    })
  },
  // 根据个人状态进行控制页面跳转
  toHomePage: function () {
    var self = this;
    self.getOpenId(function (_data) {
      openId = _data;
      self.getUserInfo(function app_toHomePage(_data2) {
        self.setUserInfo(_data2);
      });
    });
  },
  setUserInfo: function (_data) {
    var self = this;
    if (_data != null && _data != "") {
      var userFlaga = _data.userFlag;
      //判断用户是否完整
      if (userFlaga == 0) {
        wx.redirectTo({
          url: '../perfect/perfect',
        })
      } else if (userFlaga == 1 || userFlaga == 3) {
        self.toIndexPage();
      } else if (userFlaga == 4) {
        self.toTaskPage();
      }
    }
  },
  /*
跳转到index页面
*/
  toIndexPage: function () {
    wx.redirectTo({
      url: '../../pages/index/index',
    })
  },
  /*
跳转到task页面
 */
  toTaskPage: function () {
    wx.redirectTo({
      url: '../../pages/startTask/startTask',
    })
  },
  /*
跳转到welcome页面
*/
  toWelcomePage: function () {
    wx.navigateTo({
      url: '../../pages/welcome/welcome',
    })
  },
  /*
  系统通知送礼物和对方留言提示消息
   */
  readMessage(obj) {
    var self = this;
    self.getGiftList(obj);
    self.getGiftLibraryList(obj);
    self.upMessage(obj);
    self.controlMessage(obj);
  },
  readMessage_call: function (obj) {
    var self = this;
    self.getGiftList(obj);
    // self.getGiftLibraryList(obj);
    self.upMessage(obj);
    self.controlMessage(obj);

  },
  /*
  礼物消息提示列表
   */
  getGiftList(obj) {
    var self = this;
    wx.showNavigationBarLoading()
    wx.request({
      url: messageList + '?fdType=1',
      data: {
        "openId": openId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (res) {
        var DataS = res.data;
        if (DataS.length >= 1) {
          wx.showModal({
            title: DataS[0].fdTitel,
            content: DataS[0].remindContent,
            showCancel: false,
            success: function (res) { }
          })
        }
      },
      fail: function (err) {
        console.log(err)
      },
      complete() {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
    })
  },
  myGiftList: function () {
    wx.redirectTo({
      url: '../../pages/giveList/giveList'
    })
  },
  /*
 获取礼物列表
  */
  getGiftLibraryList(obj) {
    wx.showNavigationBarLoading()
    var self = this;
    wx.request({
      url: selectGiftLibrary,
      data: {
        openId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: res => {
        var carts = res.data;
        if (carts.length >= 1) {
          obj.setData({
            myGiftListImg: '/images/myGift1.png',
            myGiftListTap: 'yesMyGiftList',
          })
        } else {
          obj.setData({
            myGiftListImg: '/images/myGift.png',
            myGiftListTap: 'noMyGiftList',
          })
        }
      },
      fail: err => { },
      complete: function () {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  /*
  礼物库有礼物的时候进行的事件
   */
  yesMyGiftList: function () {
    wx.redirectTo({ url: '../../pages/giveList/giveList' })
  },
  /*
  礼物库没有礼物的时候进行的事件
   */
  noMyGiftList: function () {
    wx.showModal({
      title: "口袋提示",
      content: '小主,您的礼物库还没礼物呢 \r\n 快去礼物中心兑换礼物吧',
      showCancel: false,
      success: function (res) { }
    })
  },
  /*
   *收到留言消息时，显示收到留言提示
   */
  upMessage: function (obj) {
    var self = this;
    // let activityId = wx.getStorageSync("activityId");
    if (activityId == null || activityId == "") {
      self.getActivityId(function app_upMessage_getActivityId(_data) {
        activityId = _data;
        self.upMessageOpenId_call(obj);
      });
    } else {
      self.upMessageOpenId_call(obj);
    }
  },
  upMessageOpenId_call: function (obj) {
    var self = this;
    //判断openid不为空，根据openid获取用户信息。
    if (openId == null || openId == "") {
      self.getOpenId(function app_upMessageOpenId_call_getOpenId(_data) {
        openId = _data;
        self.upMessage_call(obj);
      });
    } else {
      self.upMessage_call(obj);
    }
  },
  upMessage_call: function (obj) {
    var self = this;
    wx.showNavigationBarLoading()
    wx.request({
      url: messageList + '?fdType=2',
      data: {
        "openId": openId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (res) {
        // console.log(res)
        let DataS = res.data;
        if (DataS.length > 0) {
          let getActivityId = DataS[0].activityId;
          // console.log(getActivityId)
          if (getActivityId != undefined) {
          // if (getActivityId != undefined && getActivityId != null && getActivityId != '') {
            if (activityId == getActivityId) {
              wx.showModal({
                title: DataS[0].fdTitel,
                content: DataS[0].remindContent,
                showCancel: false,
                success: function (res) {
                  obj.setData({
                    messageImg: '/images/liuyan.png',
                    messageTap: 'yesUpMessage',
                  })
                }
              })
            } else {
              obj.setData({
                messageImg: '/images/liuyan1.png',
                messageTap: 'noUpMessage',
              })
            }
          } else {
            obj.setData({
              messageImg: '/images/liuyan1.png',
              messageTap: 'noUpMessage',
            })
          }
        } else {
          obj.setData({
            messageImg: '/images/liuyan1.png',
            messageTap: 'noUpMessage',
          })
        }
      },
      fail: function (err) { },
      complete(e) {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
    })
  },
  /*
  留言列表有留言的时候进行的事件
   */
  yesUpMessage: function () {
    // wx.redirectTo({
    wx.navigateTo({
      url: '../../pages/leaveWord/leaveWord'
    })
  },
  /*
  留言列表没有留言的时候进行的事件
   */
  noUpMessage: function () {
    wx.showModal({
      title: "口袋提示",
      content: '本次活动快结束的时候，会根据你们的默契度开启留言',
      showCancel: false,
      success: function (res) { }
    })
  },
  // 控制留言按钮是否可以进行操作
  controlMessage: function (obj) {
    var self = this;
    // let activityId = wx.getStorageSync("activityId");
    // activityId = wx.getStorageSync("activityId");
    if (activityId == null || activityId == undefined || activityId == "") {
      self.getActivityId(function (_data) {
        activityId = _data;
        self.messageActivityId_callback(obj);
      });
    } else {
      self.messageActivityId_callback(obj);
    }

  },
  messageActivityId_callback: function (obj) {
    var self = this;
    //判断openid不为空，根据openid获取用户信息。
    if (openId == null || openId == "") {
      self.getOpenId(function (_data) {
        openId = _data;
        // console.log("527:",obj)
        self.controlMessage_call(obj);
      });
    } else {
      self.controlMessage_call(obj);
    }
  },
  //判断是否可以进行留言请的请求
  controlMessage_call: function (obj) {
    var self = this;
    wx.request({
      url: controlMessage,
      data: {
        "activityId": activityId,
        "openId": openId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (res) {
        // console.log(res)
        let state = res.data;
        if (state > 0) {
          obj.setData({
            messageImg: '/images/liuyan.png',
            messageTap: 'yesUpMessage',
          })
        } else if (state <= 0) {
          obj.setData({
            messageImg: '/images/liuyan1.png',
            messageTap: 'noUpMessage',
          })
        }
      },
      fail: function (err) {
        console.log(err)
      },
      complete(e) {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
    })
  },
  //获取openid，每个页面只可以调用一次
  init_getOpenId: function (_callBack) {
    var self = this;
    self.getOpenId(function app_initPage_getOpenId(_data) {
      openId = _data;
      if (self.isBlank(openId)) {
        wx.showModal({
          title: "口袋提示",
          content: "多次尝试获取用户授权信息失败，请检查网络",
          showCancel: false,
          success: function (res) { }
        })
      } else {
        self.init_getUserInfo(_callBack, 0);
      }
    });
  },
  init_getUserInfo: function (_callBack, _count) {
    var self = this;
    self.getUserInfo(function app_initPage_getUserInfo(_data) {
      if (_data == null) {
        _count = _count + 1;
        if (_count < 6) {
          self.init_getUserInfo(_callBack, _count);
        } else {
          wx.showModal({
            title: "口袋提示",
            content: "获取用户信息失败，请检查网络",
            showCancel: false,
            success: function (res) { }
          })
        }
      } else {
        if (typeof _callBack === "function") {
          _callBack(_data);
        }
      }
    });
  },
  //--------get D---------
  getD: function (){
    let a = openId;
    let self = this;
    if(a == null || a == undefined || a == ''){
      this.getOpenId(function getD_A(a, ){
        self.getD_call(a)
      })
    }
  },
  getD_call: function (a){
    let self = this;
    wx.request({
      url: selectUserByOpenId,
      data: {
        "openId": a,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        let d = res.data.schoolCode;
        console.log(d)
      },
      fail: function (err) { },
    })
  },
  //发送完成任务的消息
  sendCompleteTaskNews:function(){
    let self = this;
  },
})