var openId;
const app = getApp();
const config = require("../../config.js"),
  countDown = config.service.countDown,
  getOtherUser = config.service.getOtherUser,
  maskingCountDown = config.service.maskingCountDown,
  judge = config.service.judge,
  addTemplateMessage2 = config.service.addTemplateMessage2;
const getToken = config.service.getToken;
var charismata,
  activityId,
  perfectUserInfo,
  openId,
  data, maschingDate, currentdate, userFlaga;
Page({
  data: {
    personalInfo: {
      symbolize: "/images/symbolize.png",
      constellationImg: "/images/constellation.png",
      sex: "/images/sex.png",
      label: "/images/label.png",
      autograph: "/images/autograph.png"
    },
    mask: true,
    Img: "",
    modalImg: "",
    modalBut: "",
    maskImg: true,
    maskImage: "https://koudaizhilian-1254460722.cosbj.myqcloud.com/images/matchingSuccessZ%20.png",
    maskImgTap: "",
    maskCon: "",
    maskC: "",
    disabled: true,
    second: "00",
    sec: "秒",
    minute: "00",
    min: "分",
    hour: "00",
    h: "时",
    day: "00",
    d: "天",
    start: "",
    startDisplay: "none",
    display: "inline-block",
    sex: "/images/sex.png",
    label: "/images/label.png",
    autograph: "/images/autograph.png",
    constellationImg: "/images/constellation.png",
    symbolize: "/images/symbolize.png",
    button: "查看匹配",
    plus: "/images/plus.png",
    plusTap: "plus",
    toIndexPage: "onPullDownRefresh",
  },
  //------------------生命周期函数----开始--监听页面加载---------------------------------
  onLoad: function (options) { },
  onReady: function () {
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
  onShow: function () {
    this.initUserInfo();
  },
  onPullDownRefresh: function () {
    this.initUserInfo();
  },

  //------------------生命周期函数----结束-----------------------------------
  //-------------------公共方法--------开始------------------------------
  //1、初始化用户信息
  initUserInfo: function () {
    var self = this;
    app.init_getOpenId(function indexInitPage_callback(_data) {
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
      userFlaga = _data.userFlag;
      self.maskingCountDown();
      self.userStateOnload();
      self.setUserInfo(_data);
      self.startOnloadPage();
    }
  },
  //-------------------公共方法--------结束------------------------------

  //首页跳转方式包括：1、个人信息完善，跳转到home页面；2、报名成功后，跳转到进行匹配页面；3、已填写匹配信息后，跳转到查看匹配；4、匹配成功后，跳转到开始任务页面
  userStateOnload: function () {
    var that = this;
    //判断用户是否完整
    if (userFlaga == 0) {
      // that.perfect();
    } else if (userFlaga == 1) {
      //that.activityCountDown() //活动倒计时
      // that.toHome();
    } else if (userFlaga == 2) {
      // that.toAPage();
    } else if (userFlaga == 3) {
      // that.toMatchingPage();
    } else if (userFlaga == 4) {
      that.setData({
        mask: true,
        maskImg: true,
        hidden: true,
        // mask: false,
      })
    } else if (userFlaga == 5) {
      // console.log("userFlag == 5")
    }
  },
  /*
  刷新后获取个人数据
   */
  setUserInfo(_data) {
    var self = this;
    self.setData({
      modalHome: true,
      nickName: _data.nickName,
      fdGender: _data.fdGender,
      userLabel: _data.userLabel,
      charismata: _data.charismata,
      constellation: _data.constellation,
      signature: _data.signature,
    })
    if (userFlaga == 4) {
      self.setData({
        mask: true,
        maskImg: true,
        hidden: true,
      })
    }
    let gender = _data.fdGender;
    if (gender == '女') {
      self.setData({
        headImg: "https://koudaizhilian-1254460722.cosbj.myqcloud.com/images/Gender1.jpg"
      })
    } else if (gender == '男') {
      self.setData({
        headImg: "https://koudaizhilian-1254460722.cosbj.myqcloud.com/images/Gender2.jpg"
      })
    } else {
      self.setData({})
    }
  },
  /*
  查看匹配状态
   */
  formSubmit: function (e) {
    let b = e.detail.formId;
    let a = openId;
    let g = activityId;
    let self = this;
    wx.request({
      url: judge,
      data: {
        "openId": openId,
        "activityId": activityId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success(res) {
        let data = res.data;
        if (data > 0) {
          // self.upB(a, b, g)
          self.success();
        } else if (data < 1) {
          self.fail();
        }
      },
      fail: err => { },
      complete:e => {
        // console.log(a,b,g);
        self.upB(a, b, g)
      }
    })
  },
  /*
  匹配成功的交互页面
   */
  matchingSuccess: function () {
    this.setData({
      mask: true,
      maskImg: false,
      maskImage: "https://koudaizhilian-1254460722.cosbj.myqcloud.com/images/matchingSuccessF.png",
      maskImgTap: "matchingSuccessF",
      border: "transparent",
    })
  },
  /*
  匹配失败的要跳转的页面
   */
  matchingFail: function () {
    wx.redirectTo({
      url: '../../pages/index/index'
    })
  },
  /*
  匹配成功，获取对方的信息
   */
  matchingSuccessF: function () {
    var self = this;
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
        var otherUserInfo = res.data;
        if (res.data.fdGender == '女') {
          self.setData({
            _headImg: "https://koudaizhilian-1254460722.cosbj.myqcloud.com/images/Gender1.jpg"
          })
        } else if (res.data.fdGender == '男') {
          self.setData({
            _headImg: "https://koudaizhilian-1254460722.cosbj.myqcloud.com/images/Gender2.jpg"
          })
        } else { }
        self.setData({
          _nickName: res.data.nickName,
          _fdGender: res.data.fdGender,
          _userLabel: res.data.userLabel,
          _charismata: res.data.charismata,
          _signature: res.data.signature,
          _constellation: res.data.constellation,
        })
      },
      fail: err => { }
    })
    self.setData({
      border: "#d0cbd2",
      maskImage: "https://koudaizhilian-1254460722.cosbj.myqcloud.com/images/matchingSuccessZ%20.png",
      maskImgTap: "matchingSuccessZ",
      _charmVue: "魅力值",
      colon: ":",
      _sex: "/images/sex.png",
      _label: "/images/label.png",
      _autograph: "/images/autograph.png",
      _constellationImg: "/images/constellation.png",
      _symbolize: "/images/symbolize.png",
      _border: "#c9c4ca",
    })
  },
  matchingSuccessZ: function () {
    wx.redirectTo({
      url: '../../pages/startTask/startTask',
    })
  },
  /*
  匹配成功的交互效果
   */
  success: function () {
    var self = this;
    self.setData({
      maskButText: "进行查看",
      hidden: true,
      mask: false,
      maskCon: "缘分总是来的那么突如其来,口",
      maskC: "袋之恋把TA送到了你身边，接下来7天就全靠小主自己了哦",
      maskBut: "matchingSuccess", //查看匹配的按钮方法
      Img: "https://koudaizhilian-1254460722.cosbj.myqcloud.com/images/macthSuccess.png"
    })
  },
  /*
  匹配失败显示的交互效果
   */
  fail: function () {
    var self = this;
    self.setData({
      hidden: true,
      mask: false,
      Img: "https://koudaizhilian-1254460722.cosbj.myqcloud.com/images/macthFail.png",
      maskBut: "matchingFail" //查看匹配的按钮方法
    })
  },
  /*
  获取匹配倒计时
   */
  maskingCountDown() {
    var self = this;
    if (activityId == null || activityId == "") {
      app.getActivityId(function matching_maskingCountDown_getActivityId(_data) {
        activityId = _data;
        self.maskingCountDown_call();
      });
    } else {
      self.maskingCountDown_call();
    }
  },
  maskingCountDown_call: function () {
    var self = this;
    wx.request({
      url: maskingCountDown,
      data: {
        "activityId": activityId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (res) {
        data = parseInt(res.data / 1000)
        self.ifMatchCountdown()
      },
      fail: function (err) { }
    })
  },
  /*
  判断倒计时是否结束
   */
  ifMatchCountdown: function () {
    var self = this;
    if (data <= 0) {
      //调用匹配结束倒计时方法
      self.setData({
        disabled: false,
        color: "#fff",
        second: "",
        sec: "",
        minute: "",
        min: "",
        hour: "",
        h: "",
        day: "",
        d: "",
        djsText: "查看匹配",
        start: "可以查看匹配啦",
        startDisplay: "inline-block",
        display: "none",
      });
    } else if (data > 0) {
      self.setData({
        sec: "秒",
        min: "分",
        h: "时",
        d: "天",
        disabled: true,
        color: "#76777b",
        startDisplay: "none",
        display: "inline-block",
        djsText: "查看匹配",
        button: "查看匹配"
      })
      /*匹配倒计时*/
      app.cpu_setInterval(data, function (days, hours, minutes, seconds) {
        self.setData({
          day: days,
          hour: hours,
          minute: minutes,
          second: seconds
        });
      }, function () {
        self.matchCountdownEnd()
      });
    };
  },
  /*
  查看匹配倒计时结束时执行的方法
  */
  matchCountdownEnd() {
    var self = this;
    self.setData({
      disabled: false,
      color: "#fff",
      startDisplay: "inline-block",
      display: "none",
      djsText: "查看匹配",
      button: "查看匹配",
      start: "可以查看匹配啦",
      second: "",
      sec: "",
      minute: "",
      min: "",
      hour: "",
      h: "",
      day: "",
      d: "",
    });
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
  /*
  跳转到完善信息页面
   */
  perfect() {
    wx.redirectTo({
      url: '../../pages/perfect/perfect',
    })
  },
  //跳转到查看匹配
  toAPage: function () {
    wx.redirectTo({
      url: '../../pages/a/a',
    })
  },
  //跳转到查开始任务
  toStartTaskPage: function () {
    wx.redirectTo({
      url: '../../pages/startTask/startTask',
    })
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
跳转到my页面
*/
  toMyPage: function () {
    wx.redirectTo({
      url: '../../pages/my/my',
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
跳转到task页面
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
  // up b to 2018-1-30
  upB: function (a, b, g) {
    let self = this;
    wx.request({
      url: addTemplateMessage2,
      data: {
        'openId': a,
        'form_id': b,
        'activityId': g,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: "POST",
      success: function (res) {
        // console.log(res.data)
      },
      fail: function (err) {
        console.log(err)
      },
    })
  },
})