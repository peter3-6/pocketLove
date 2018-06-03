var openId, activityId, current;
const config = require("../../config.js");
const missionList = config.service.missionList,
  missionCountDown = config.service.missionCountDown,
  missionedList = config.service.missionedList,
  getToken = config.service.getToken,
  addTemplateMessage3 = config.service.addTemplateMessage3;
var x = 0;
var app = getApp();
Page({
  data: {
    currentTab: 0,
    taskListImg: "../../images/sex.png",
    selectMissions: [],
    selectMissioneds: [],
    plus: "/images/plus.png",
    plusTap: "plus",
    toIndexPage: "onPullDownRefresh",
    toTaskPage: "onPullDownRefresh",
    taskSuccess: true,
    scroll_top: 0,//上拉到一定的高度
    remind: '',//全部加载完的提示
    start: 6,//一次展示多少条数据
    switch: true,//正在加载数据的提示
    deviceHeight: 0,//scroll-view高度
    remindHidden: true,
    // timeA:600000000000000,
  },
  //------------------生命周期函数----开始--监听页面加载---------------------------------
  onLoad: function () {
    var self = this;
    var res = wx.getSystemInfoSync();
    self.setData({
      deviceHeight: res.windowHeight
    })
  },
  /*
  下拉刷新
   */
  onPullDownRefresh: function () {
    this.initUserInfo();
  },
  /**
* 页面上拉触底事件的处理函数
*/
  onReachBottom: function () {
    let self = this;
    self.loadMore();
  },
  /*
  上拉加载
   */
  // onReachBottom: function () { },
  onReady: function () { },
  onShow: function () {
    this.initUserInfo();
  },
  onHide: function () { },
  onUnload: function () { },
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
  //------------------生命周期函数----结束-----------------------------------
  //-------------------公共方法--------开始------------------------------
  //1、初始化用户信息
  initUserInfo: function () {
    var self = this;
    app.init_getOpenId(function task_initUser_callback(_data) {
      self.indexInitPage(_data);
    });
  },
  //2、初始化加载页面默认加载数据
  indexInitPage: function (_data) {
    let self = this;
    if (_data == '' || _data == null || _data == undefined) {
      wx.showModal({
        title: "口袋提示",
        content: "首页获取用户信息失败，请检查网络",
        showCancel: false,
        success: function (res) { }
      })
    } else {
      openId = _data.openId;
      self.getHistoryTaskList();
      self.startOnloadPage();
      self.missionCountDown();//获取任务倒计时
    }
  },
  //-------------------公共方法--------结束------------------------------
  /** 
   * 滑动切换tab 
   */
  bindChange: function (e) {
    var that = this;
    current = e.detail.current
    that.setData({
      currentTab: current
    });
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    current = e.target.dataset.current;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  /*
  获取任务倒计时
   */
  missionCountDown: function () {
    var self = this;
    wx.request({
      url: missionCountDown,
      data: {
        "activityId": activityId,
        "openId": openId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (ret_obj) {
        let datas = parseInt(ret_obj.data / 1000)
        if (datas <= 0) {
          self.getCurrentTask();//获取当前任务
        }
      },
      fail: function (err) { }
    })
  },
  /*
  获取当前任务
   */
  getCurrentTask() {
    let self = this;
    let a;
    let g;
    if (a == '' || a == null || a == undefined) {
      app.getOpenId(function task_getA(a) {
        openId = a;
      });
    }
    if (g == '' || g == null || g == undefined) {
      app.getActivityId(function task_getG(g) {
        activityId = g;
      })
    }
    if (openId && activityId) {
      // console.log(openId, activityId, (openId && activityId))
      self.getCurrentTaskList(openId, activityId);
    }
    // else{
    //   console.log('openId', 'activityId')
    // }
  },
  /*
  获取当前任务列表(以文本的形式展现)
   */
  // getCurrentTaskList: function (openId, activityId) {
  //   var self = this;
  //   wx.request({
  //     url: missionList,
  //     data: {
  //       "activityId": activityId,
  //       "openId": openId
  //     },
  //     header: {
  //       'content-type': 'application/json' // 默认值
  //     },
  //     success: function (res) {
  //       let selectMission = res.data;
  //       console.log(selectMission);
  //       let length = res.data.length;
  //       self.setData({
  //         selectMissions: selectMission,
  //         activityId: activityId,
  //         openId: openId
  //       })
  //     },
  //     fail: function (err) { },
  //   })
  // },
  /*
  获取当前任务列表(以图片的形式展现)
   */
  getCurrentTaskList: function (openId, activityId) {
    let self = this;
    wx.request({
      url: missionList,
      data: {
        "openId": openId,
        "activityId": activityId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (res) {
        let selectMission = res.data;
        self.setData({
          data: selectMission,
        });
      },
      fail: function (res) {
        wx.showModal({
          title: '错误提示',
          content: res,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
    })
  },
  /*
  获取历史任务列表
   */
  getHistoryTaskList: function () {
    wx.showLoading({
      title: '缘分加载中',
    })
    let self = this;
    let a;
    let g;
    if (a == null || a == undefined || a == '') {
      app.getOpenId(function task_geta(a) {
        openId = a;
      });
    }
    if (g == null || g == undefined || g == '') {
      app.getActivityId(function task_getg(g) {
        activityId = g;
      })
    }
    if (openId && activityId) {
      self.getHistoryTaskList_call(openId, activityId);
    }
  },
  getHistoryTaskList_call: function (openId, activityId) {
    let self = this;
    wx.request({
      url: missionedList + '?limit=' + 6,
      data: {
        "openId": openId,
        "activityId": activityId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (res) {
        wx.hideLoading()
        let datas = res.data;
        // console.log(datas)
        self.setData({
          datas: datas
        })
        let length = datas.length;
        if (length == 1) {

        } else if (datas.length <= 6) {
          self.setData({
            // switch: true,
            remindHidden: true,
            remind: '没有数据啦...'
          })
        }
        //任务完成一条的时候直接执行
        // if (datas.length > 0 && datas.length < 2) {
        //   self.setData({
        //     taskSuccess: false,
        //     taskSuccessTap: "noTaskSuccessTap"
        //   }) 
        // } else {
        //   self.setData({
        //     taskSuccess: true
        //   })
        // }

      },
      fail: function (err) { }
    });
    // });
  },
  /*loadMore
  *已完成任务的上拉加载
  */
  loadMore: function () {
    var self = this;
    var x = this.data.start;
    if (this.data.remind !== '') {
      this.setData({
        start: x + 6
      });
    } else {
      this.setData({
        switch: false,
        start: x + 6
      });
    }
    x = this.data.start;
    let openId;
    if (openId == null || openId == undefined || openId == '') {
      app.getOpenId(function (_data) {
        openId = _data;
      });
    }
    let activityId;
    if (activityId == null || activityId == undefined || activityId == '') {
      app.getActivityId(function (_data) {
        activityId = _data;
      });
    }
    // console.log(openId, activityId)
    if (openId && activityId) {
      wx.showLoading({
        title: '缘分加载中',
      })
      wx.request({
        url: missionedList + '?limit=' + x,
        data: {
          "activityId": activityId,
          "openId": openId
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: "POST",
        success: function (res) {
          wx.hideLoading()
          if (res.data.length <= x) {
            self.setData({
              remind: '我也是有底线的...'
            })
          }
          self.setData({
            switch: true,
            datas: res.data,
          })
        }
      });
    }
    // app.getActivityId(function task_getHistoryTaskList_getActivityId(_data) {
    //   activityId = _data;
    //   // wx.showLoading({
    //   //   title: '缘分加载中',
    //   // })
    //   wx.request({
    //     url: missionedList + '?limit=' + x,
    //     data: {
    //       "activityId": activityId,
    //       "openId": openId
    //     },
    //     header: {
    //       'content-type': 'application/x-www-form-urlencoded'
    //     },
    //     success: function (res) {
    //       console.log(res)
    //       wx.hideLoading()
    //       if (res.data.length <= x) {
    //         self.setData({
    //           remind: '我也是有底线的...'
    //         })
    //       }
    //       self.setData({
    //         switch: true,
    //         datas: res.data,
    //       })
    //     },
    //     fail:function(err){

    //     },
    //     complete:function(){
    //       wx.hideLoading()
    //     }
    //   });
    // });
  },
  /*
  消失第一条任务完成的提示层
   */
  noTaskSuccessTap: function () {
    var self = this;
    self.setData({
      taskSuccess: true
    })
  },
  //点击弹出
  plus: function () {
    if (this.data.isPopping == undefined) {
      let isPopping = true;
      if (isPopping) {
        //缩回动画
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
  跳转到my页面
  */
  toMyPage: function () {
    wx.redirectTo({
      url: '../../pages/my/my',
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
  formSubmit: function (e) {
    let self = this;
    let b = e.detail.formId;
    let openId;
    if (openId == null || openId == undefined || openId == '') {
      app.getOpenId(function (_data) {
        openId = _data;
      });
    }
    let activityId;
    if (activityId == null || activityId == undefined || activityId == '') {
      app.getActivityId(function (_data) {
        activityId = _data;
      });
    }
    if (openId && activityId) {
      self.sendpB(openId, activityId, b)
    }
  },
  sendpB: function (openId, activityId, b) {
    // console.log(openId, activityId, b)
    let self = this;
    wx.request({
      url: addTemplateMessage3,
      data: {
        "activityId": activityId,
        "openId": openId,
        'form_id': b,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (res) {
        // console.log("执行：", res);
      },
      fail: function (res) {
        // console.log(res);
      },
      complete: function (res) {
        // console.log("最后：", res);
      }
    })
  },
  detail:function(e){
    setTimeout(function(){
      let fdId = e.currentTarget.dataset.fdid;
      let missionType = e.currentTarget.dataset.missiontype;
      wx.navigateTo({
        url: '/pages/taskDetails/taskDetails?fdId=' + fdId + '&missionType=' + missionType,
        // success:function(res){
        //   console.log(res);
        // }
      })
    },1000);
  }
})