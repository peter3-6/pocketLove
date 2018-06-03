var openId;
var activityId;
const app = getApp();
const config = require("../../config.js")
const openidUrl = config.service.openidUrl,
  createUser = config.service.createUser,
  selectUserByOpenId = config.service.selectUserByOpenId,
  messageList = config.service.messageList,
  controlMessage = config.service.controlMessage;
Page({
  data: {
    charm: "魅力值",
    userInfo: {},
    hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hidden: true,
    plus: "/images/plus.png",
    plusTap: "plus",
    toIndexPage: "onPullDownRefresh"
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var self = this;
    self.startOnloadPage();
    self.getINFO(); //获取用户信息
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let self = this;
    self.getINFO(); //获取用户信息
    self.startOnloadPage();
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
  /*
  获取用户信息
   */
  getINFO: function () {
    var self = this;
    if (openId == undefined || openId == null || openId == "") {
      app.getOpenId(function my_getINFO_getOpenId(_data) {
        openId = _data;
        // console.log(openId);
        self.getINFO_call();
      });
    } else {
      self.getINFO_call();
    }
  },
  getINFO_call: function () {
    var self = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.showLoading({
      title: '寻找缘分中...',
    })
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
        wx.hideLoading();
        let $openId = res.data.openId;
        // console.log(res, $openId);
        try {
          wx.setStorageSync('openId', $openId);
        } catch (e) {}
        var gender = res.data.fdGender;
        if (gender == '女') {
          self.setData({
            hasUserInfo: true,
            headImg: "https://koudaizhilian-1254460722.cosbj.myqcloud.com/images/gender1.jpg"
          })
        } else if (gender == '男') {
          self.setData({
            hasUserInfo: true,
            headImg: "https://koudaizhilian-1254460722.cosbj.myqcloud.com/images/gender2.jpg"
          })
        } else {
          self.setData({
          })
        }
        self.setData({
          charismata: res.data.charismata,
          nickName: res.data.nickName,
          constellation: res.data.constellation,
        })
      },
      fail: err => {
        console.log(err)
      },
      complete() {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  complaint: function () {
    wx.navigateTo({
      url: '../../pages/complaint/complaint',
    })
  },
  gift: function () {
    wx.navigateTo({
      url: '../../pages/giveList/giveList',
    })
  },
  user: function () {
    wx.navigateTo({
      url: '../../pages/user/user',
    })
  },
  userInfo: function () {
    wx.navigateTo({
      url: '../../pages/user/user',
    })
  },
  // 获取用户信息
  // getUserInfo:function(){
  //   let self = this;
  //   if(openId == null || openId == undefined || openId == ''){
  //     app.getOpenId(function my_getOpenId(_data){
  //       self.getUserInfo_call(_data)
  //       console.log(_data)
  //     });
  //   }
  // },
  // getUserInfo_call: function (_data) {
  //   var self = this;
  //   wx.login({
  //     success: res => {
  //       wx.request({
  //         url: openidUrl,
  //         data: {
  //           js_code: res.code,
  //         },
  //         method: 'GET',
  //         success: res => {
  //           openId = res.data;
  //           wx.getUserInfo({
  //             success: res => {
  //               var userInfo = app.globalData.userInfo = res.userInfo
  //               var nickName = userInfo.nickName,
  //                 gender = userInfo.gender,
  //                 avatarUrl = userInfo.avatarUrl,
  //                 city = userInfo.city,
  //                 country = userInfo.country,
  //                 language = userInfo.language,
  //                 province = userInfo.province
  //               var data = {
  //                 openId,
  //                 nickName,
  //                 gender,
  //                 avatarUrl,
  //                 city,
  //                 country,
  //                 language,
  //                 province
  //               }
  //               wx.request({
  //                 url: createUser,
  //                 data: data,
  //                 header: {
  //                   'content-type': 'application/x-www-form-urlencoded'
  //                 },
  //                 method: "POST",
  //                 success: res => {
  //                   console.log(res)
  //                 },
  //                 fail: err => { },
  //                 complete: function () {
  //                   self.getINFO();
  //                 }
  //               })
  //               // this.setData({
  //               //   userInfo: res.userInfo,
  //               //   hasUserInfo: true
  //               // })
  //             }
  //           })
  //         }
  //       })
  //     }
  //   })
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true,
  //   })
  // },
  //关于版本号
  aboutSystem: function () {
    wx.redirectTo({
      url: '../../pages/about/about'
    })
  },
  modalOk: function () {
    this.setData({
      hidden: true
    })
  },
  abc: function () {
    this.setData({
      hidden: false
    })
  },
  /*
跳转到my页面
*/
  toMyPage: function () {
    wx.redirectTo({
      url: '../../pages/my/my',
    })
  },
  //点击弹出
  plus: function () {
    if (this.data.isPopping == undefined) {
      let isPopping = true;
      // console.log(isPopping);
      if (isPopping) {
        //缩回动画
        // console.log("缩回动画")
        this.popp();
        this.setData({
          isPopping: false
        })
      } else if (!isPopping) {
        //弹出动画
        this.takeback();
        this.setData({
          isPopping: true
        })
      }
    } else {
      if (this.data.isPopping) {
        //缩回动画
        // console.log("缩回动画")
        this.popp();
        this.setData({
          isPopping: false
        })
      } else if (!this.data.isPopping) {
        //弹出动画
        this.takeback();
        this.setData({
          isPopping: true
        })
      }
    }
  },
  //弹出动画
  popp: function () {
    //plus顺时针旋转
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationcollect = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationcollectA = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })

    var animationcollectC = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationTranspond = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationcollectB = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationInput = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var giveList = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(180).step();
    animationcollect.translate(38, 3).rotateZ(0).opacity(1).step();
    animationTranspond.translate(76, 3).rotateZ(0).opacity(1).step();
    animationcollectA.translate(266, 3).rotateZ(0).opacity(1).step();
    animationcollectC.translate(114, 3).rotateZ(0).opacity(1).step();
    animationInput.translate(152, 3).rotateZ(0).opacity(1).step();
    animationcollectB.translate(190, 3).rotateZ(0).opacity(1).step();
    giveList.translate(228, 3).rotateZ(0).opacity(1).step();
    this.setData({
      animPlus: animationPlus.export(),
      animCollect: animationcollect.export(),
      animTranspond: animationTranspond.export(),
      animationcollectA: animationcollectA.export(),
      animationcollectC: animationcollectC.export(),
      animInput: animationInput.export(),
      animationcollectB: animationcollectB.export(),
      giveList: giveList.export(),
    })
  },
  //收回动画
  takeback: function () {
    //plus逆时针旋转
    var animationcollectA = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationcollectC = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationcollect = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationTranspond = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationcollectB = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationInput = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var giveList = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(0).step();
    animationcollect.translate(0, 0).rotateZ(0).opacity(0).step();
    animationcollectA.translate(0, 0).rotateZ(0).opacity(0).step();
    animationcollectC.translate(0, 0).rotateZ(0).opacity(0).step();
    animationTranspond.translate(0, 0).rotateZ(0).opacity(0).step();
    animationcollectB.translate(0, 0).rotateZ(0).opacity(0).step();
    animationInput.translate(0, 0).rotateZ(0).opacity(0).step();
    giveList.translate(0, 0).rotateZ(0).opacity(0).step();
    this.setData({
      animPlus: animationPlus.export(),
      animCollect: animationcollect.export(),
      animTranspond: animationTranspond.export(),
      animationcollectA: animationcollectA.export(),
      animationcollectC: animationcollectC.export(),
      animInput: animationInput.export(),
      animationcollectB: animationcollectB.export(),
      giveList: giveList.export(),
    })
  },
  /*
跳转到task页面
 */
  toTaskPage: function () {
    wx.redirectTo({
      url: '../../pages/task/task',
    })
  },
  /*
跳转到排行榜页面
*/
  toCharmPage: function () {
    wx.redirectTo({
      url: '../../pages/charm/charm',
    })
  },
  yesMyGiftList: function () {
    app.yesMyGiftList();
  },
  noMyGiftList: function () {
    app.noMyGiftList();
  },
  yesUpMessage: function () {
    app.yesUpMessage();
  },
  noUpMessage: function () {
    app.noUpMessage();
  },
  toHomePage: function () {
    app.toHomePage();
  },
  //4、开始初始化本页面内容
  startOnloadPage: function () {
    app.readMessage(this);
    app.pageButtonInit(this);
  },
  //清理缓存
  clearCache: function () {
    let self = this;
    try {
      wx.clearStorageSync();
      self.getINFO();
      app.getActivityId(function (activityId) {
        // console.log(activityId);
        try {
          wx.setStorageSync('activityId', activityId);
        } catch (e) { }
      })
    } catch (e) {}
  },
  gengxin:function(){
    // const innerAudioContext = wx.createInnerAudioContext()
    // innerAudioContext.autoplay = true
    // innerAudioContext.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
    // innerAudioContext.onPlay(() => {
    //   console.log('开始播放')
    // })
    // innerAudioContext.onError((res) => {
    //   console.log(res.errMsg)
    //   console.log(res.errCode)
    // })
    // wx.startRecord({
    //   success: function (res) {
    //     console.log(res)
    //     var tempFilePath = res.tempFilePath
    //     wx.playVoice({
    //       filePath: tempFilePath,
    //       complete: function () {
    //       }
    //     })
    //   }
    // })
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      updateManager.applyUpdate()
    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
    })
  }
})