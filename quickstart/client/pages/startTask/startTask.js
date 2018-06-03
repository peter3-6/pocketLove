const app = getApp();
var openId,
  activityId;
var userInfoA
var userInfoB
const config = require("../../config.js"),
  getOtherUser = config.service.getOtherUser,
  selectUserApplyByOpenId = config.service.selectUserApplyByOpenId,
  missionCountDown = config.service.missionCountDown,
  missionList = config.service.missionList;
var
  taskData, missionType, missionContent,
  activityId,
  perfectUserInfo,
  openId,
  startTaskDate,
  currentdate,
  t,
  data,
  userFlag;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aaa: "文本信息",
    givingGift: true,
    modal: true,
    maskCon: true,
    background: "transparent",
    taskInfo: {
      symbolize: "/images/symbolize.png",
      sex: "/images/sex.png",
      label: "/images/label.png",
      autograph: "/images/autograph.png",
      constellationImg: "/images/constellation.png",
    },
    userInfoA: {
      nickName: "",
      charismata: "",
      fdGender: "",
      userLabel: "",
      constellation: "",
      signature: ""
    },
    userInfoB: {
      nickName: "",
      charismata: "",
      constellation: "",
      gender: "",
      userLabel: "",
      signature: ""
    },
    headImgA: "",
    headImgB: "",
    mask: true,
    Img: "",
    maskBut: "",
    maskButText: "",
    maskCon: "",
    second: "00",
    sec: "秒",
    minute: "00",
    min: "分",
    hour: "00",
    h: "时",
    day: "00",
    d: "天",
    disabled: true,
    color: "#76777b",
    start: "",
    startDisplay: "none",
    display: "inline-block",
    plus: "/images/plus.png",
    startTash: "开始任务",
    plusTap: "plus",
    startTaskCue: '今天的任务已经送达,小口袋特邀您接受任务',
    toIndexPage: "onPullDownRefresh",
  },
  //------------------生命周期函数----开始--监听页面加载---------------------------------
  onLoad: function (options) { },
  onReady: function () { },
  onHide: function () { },
  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () { },
  onShow: function () {
    this.initUserInfo();
  },
  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    this.initUserInfo();
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
  //------------------生命周期函数----结束-----------------------------------
  //-------------------公共方法--------开始------------------------------
  //1、初始化用户信息
  initUserInfo: function () {
    var self = this;
    app.init_getOpenId(function startTask_initUserInfo_getOpenId(_data) {
      self.indexInitPage(_data);
    });
  },
  //2、初始化加载页面默认加载数据
  indexInitPage: function (_data) {
    let self = this;
    if (_data == null || _data == undefined) {
      wx.showModal({
        title: "口袋提示",
        content: "首页获取用户信息失败，请检查网络",
        showCancel: false,
        success: function (res) { }
      })
    } else {
      openId = _data.openId;
      userFlag = _data.userFlag;
      self.setData({
        headImgA: "https://koudaizhilian-1254460722.cosbj.myqcloud.com/images/gender1.jpg",
        headImgB: "https://koudaizhilian-1254460722.cosbj.myqcloud.com/images/gender2.jpg",
      });
      self.maskContent();
      self.getInfo();
      self.startOnloadPage();
    }
  },
  //-------------------公共方法--------结束------------------------------
  startEnroll: function () {
    var that = this;
    that.setData({
      maskCon: false,
      mask: false,
      Img: "https://koudaizhilian-1254460722.cosbj.myqcloud.com/images/renwuC.png",
      taskImgTap: "toTaskPage",
    })
  },
  /*
  获取任务信息(判断是否有任务信息)
   */
  maskContent: function () {
    var self = this;
    if (activityId == null || activityId == "") {
      app.getActivityId(function (_data) {
        activityId = _data;
        self.maskContent_call();
      });
    } else {
      self.maskContent_call();
    }
  },
  maskContent_call: function () {
    var self = this;
    //获取任务信息
    wx.request({
      url: missionList,
      data: {
        "activityId": activityId,
        "openId": openId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (res) {
        // console.log(res.data)
        var taskDatas = res.data;
        self.setData({
          taskDatas: taskDatas
        })
        //taskDatas如果值为-1，则表明后续没有任务，则跳转到首页
        let length = taskDatas.length;
        if (taskDatas == null || taskDatas == undefined || taskDatas == "") {
          self.setData({
            disabled: true,
            start: "请明天早上八点领取任务",
            startDisplay: "inline-block",
            display: "none",
            sec: "",
            min: "",
            h: "",
            d: "",
          })
        }
        else if (taskDatas === -1){
          self.setData({
            disabled: true,
            start: "本次活动已经结束",
            startDisplay: "inline-block",
            display: "none",
            sec: "",
            min: "",
            h: "",
            d: "",
          })
        }
        // else if (length === 0) {
        //   self.setData({
        //     disabled: true,
        //     start: "本次活动已经结束",
        //     startDisplay: "inline-block",
        //     display: "none",
        //     sec: "",
        //     min: "",
        //     h: "",
        //     d: "",
        //   })
        // }
         else {
          self.missionCountDown() //任务倒计时
        }
      },
      fail: function (err) { }
    })
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
        data = parseInt(ret_obj.data / 1000)
        self.ifTaskCountdown()
      },
      fail: function (err) { }
    })
  },
  /* 
  判断任务倒计时是否结束
   */
  ifTaskCountdown: function () {
    var self = this;
    if (data == -1) { //data为-1时，说明没有任务，返回到首页
      self.toIndexPage();
    } else if (data <= 0) {
      //调用匹配结束倒计时方法
      self.taskCountdownEnd()
    } else if (data > 0) {
      self.setData({
        disabled: true,
        color: "#76777b",
        startDisplay: "none",
        display: "inline-block",
        plus: "/images/plus.png",
        sec: "秒",
        min: "分",
        h: "时",
        d: "天",
      })
      /*任务倒计时*/
      app.cpu_setInterval(data, function (days, hours, minutes, seconds) {
        self.setData({
          day: days,
          hour: hours,
          minute: minutes,
          second: seconds
        });
      }, function () {
        self.taskCountdownEnd()
      });
    };
  },
  /*
  匹配倒计时结束的时候执行
   */
  taskCountdownEnd() {
    var self = this;
    self.setData({
      disabled: false,
      color: "#fff",
      start: "已经开始了",
      startDisplay: "inline-block",
      display: "none",
      plus: "/images/plus.png",
      sec: "",
      min: "",
      h: "",
      d: "",
    });
  },
  /*
  查看任务列表内容信息(已经有任务)
   */
  Content() {
    var self = this;
    // self.maskContent();//判断有没有任务
    wx.request({
      url: missionList,
      data: {
        "activityId": activityId,
        "openId": openId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (res) {
        var taskDatas = res.data;
        if (taskDatas.length <= 0) {
          self.missionCountDown()
        }
        else {
          self.setData({
            maskCon: false,
            mask: false,
            taskDatas: taskDatas,
            Img: "https://koudaizhilian-1254460722.cosbj.myqcloud.com/images/renwuC.png",
            startTaskCueText: "的邮箱进行任务查询吧点击上面的邮吧"
          })
        }
      },
      fail: function (err) {
      }
    })
  },
  /*
  送礼物指示的小贴士消失
   */
  hidden() {
    console.log("送礼物指示的小贴士消失")
    var self = this;
    self.setData({
      modal: true,
      givingGift: true,
    })
  },
  /*
  小贴士：礼物与魅力值可以相互兑换
   */
  exchangeTips() {
    console.log("礼物与魅力值可以相互兑换呦")
    var self = this;
    self.setData({
      modal: false,
      regCueT: "系统小贴士：",
      regCueB: "礼物与魅力值可以相互兑换呦，请点击右下角 + 号里面的礼物按钮，快去兑换吧",
      modalTap: "hidden"
    })
  },
  /*
  获取用户信息
   */
  getInfo: function () {
    var self = this;
    if (activityId == null || activityId == "" || activityId == undefined) {
      app.getActivityId(function (_data) {
        activityId = _data;
        self.getInfo_call();
      });
    } else {
      self.getInfo_call();
    }
  },
  getInfo_call: function () {
    var self = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.request({
      url: selectUserApplyByOpenId,
      data: {
        "openId": openId,
        "activityId": activityId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: res => {
        // console.log(res)
        if (res.data == null || res.data == undefined || res.data == '') {
        } else {
          userInfoA = res.data.fdUser;
          //  userInfoA = res.data;
          userFlag = userInfoA.userFlag;
          // userFlag = res.data;
          if (userInfoA.fdGender === "男") {
            self.setData({
              userInfoB: userInfoA,
            })
          } else {
            self.setData({
              userInfoA: userInfoA,
            })
          }
        }

      },
      fail: err => { },
      complete() {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        self.userStateOnload()
      }
    })
    // 获取匹配的用户信息
    wx.request({
      url: getOtherUser,
      data: {
        "openId": openId,
        "activityId": activityId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: res => {
        // console.log(res)
        userInfoB = res.data
        if (userInfoB.fdGender === "女") {
          self.setData({
            userInfoA: userInfoB
          })
        } else {
          self.setData({
            userInfoB: userInfoB
          })
        }
      },
      fail: err => { },
      complete() {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  //页面加载时，判断用户状态
  //首页跳转方式包括：1、个人信息完善，跳转到home页面；2、报名成功后，跳转到进行匹配页面；3、已填写匹配信息后，跳转到查看匹配；4、匹配成功后，跳转到开始任务页面
  //3、页面加载时，判断用户状态
  userStateOnload: function () {
    var self = this;
    //判断用户是否完整
    if (userFlag == 0) {
    } else if (userFlag == 1) {
      self.toIndexPage();
    } else if (userFlag == 2) {
    } else if (userFlag == 3) {
    } else if (userFlag == 4) {
    } else if (userFlag == 5) {
      self.setData({
        modal: true,
        remindModal: true, //默认true  进行你的浪漫之旅吧
        modalHome: true, //默认false
        hidden: true,
        homeModal: true,
        second: "00",
        sec: "秒",
        minute: "00",
        min: "分",
        hour: "00",
        h: "时",
        day: "00",
        d: "天",
        disabled: true,
        color: "#76777b",
      })
    }
  },
  //点击弹出
  plus: function () {
    if (this.data.isPopping == undefined) {
      let isPopping = true;
      if (isPopping) {
        this.popp();
        this.setData({
          isPopping: false
        })
      } else if (!isPopping) {
        this.takeback();
        this.setData({
          isPopping: true
        })
      }
    } else {
      if (this.data.isPopping) {
        this.popp();
        this.setData({
          isPopping: false
        })
      } else if (!this.data.isPopping) {
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
  任务图片禁用
   */
  taskDisable: function () {
    wx.showModal({
      title: "口袋提示",
      content: '小主，您还不能查看任务',
      showCancel: false,
    })
  },
  /*
  报名图片禁用
   */
  indexDisable: function () {
    wx.showModal({
      title: "口袋提示",
      content: '小主，按钮不可用',
      showCancel: false,
    })
  },
  startOnloadPage: function () {
    app.readMessage(this);
    app.pageButtonInit(this);
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
  /*
跳转到my页面
*/
  toMyPage: function () {
    wx.redirectTo({
      url: '../../pages/my/my',
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
  }
})