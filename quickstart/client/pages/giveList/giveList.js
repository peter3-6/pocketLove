const app = getApp();
var userFlag;
const config = require("../../config.js");
const selectGift = config.service.selectGift;
const image = config.service.image,
  reviseGiftLibrary = config.service.reviseGiftLibrary,
  images = image + '?fdId=',
  // selectUserByOpenId = config.service.selectUserByOpenId,
  // messageList = config.service.messageList,
  selectGiftLibrary = config.service.selectGiftLibrary,
  selectUserByOpenId = config.service.selectUserByOpenId,
  givtGift = config.service.givtGift;
var _gift_array = new Array(), activityId, amount, totalValue, charismata, fdId, _fdId, stateb, statea, addThisValue, minusThisValue, thisValue, openId, userFlag, dataJson;
Page({
  data: {
    modal: true,
    images: images,
    exchangeGiftButton: "赠送",
    exchangeGiftToc: "give",
    carts: [], // 购物车列表
    hasList: false, // 列表是否有数据
    totalPrice: 0, // 总价，初始为0
    obj: {
      name: "hello"
    },
    plus: "/images/plus.png",
    plusTap: "plus",
    toIndexPage: "onPullDownRefresh"
  },
  onLoad: function (options) {
    // this.startOnloadPage();
  },
  onShow() {
    var self = this;
    self.selectGiftLibrary();
    self.startOnloadPage();
    self.selectUserFlag()
    self.give_button_status();
  },
  selectList(e) {
    const index = e.currentTarget.dataset.index; //选择礼物的下标
    var carts = this.data.carts; //礼物列表数据
    const selected = carts[index].selected;
    carts[index].selected = !selected;
    this.setData({
      carts: carts
    });
    // this.getTotalPrice();
  },
  /**
   * 绑定加数量事件
   */
  addCount(e) {
    //取出点击的礼物下标
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let _currentAmount = carts[index].currentAmount;
    if (_currentAmount >= carts[index].amount) {
      //提示礼物数量已到上限
      wx.showModal({
        title: "口袋提示",
        content: "礼物数量已到上限,您可以使用魅力值兑换增加礼物数量",
        showCancel: false,
        success: function (res) { }
      })
    } else {
      carts[index].currentAmount = _currentAmount + 1;
      this.setData({
        carts: carts
      });
      // this.getTotalPrice();
    }
  },
  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    const obj = e.currentTarget.dataset
    let carts = this.data.carts;
    let _currentAmount = carts[index].currentAmount;
    if (_currentAmount <= 1) {
      wx.showModal({
        title: "口袋提示",
        content: "要兑换的礼物数量也是有底线的",
        showCancel: false,
        success: function (res) { }
      })
      return false;
    }
    _currentAmount = _currentAmount - 1;
    carts[index].currentAmount = _currentAmount;
    this.setData({
      carts: carts
    });
    // this.getTotalPrice();
  },
  /*
   * 输入值变化时调用
   */
  bindinputTap: function (e) {
    var _value = e.detail.value;
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let _currentAmount = _value;
    if (_currentAmount > carts[index].amount) {
      //提示礼物数量已到上限
      wx.showModal({
        title: "口袋提示",
        content: "礼物数量已到上限,您可以使用魅力值兑换增加礼物数量",
        showCancel: false,
        success: function (res) {

        }
      })
      carts[index].currentAmount = carts[index].amount;
      this.setData({
        carts: carts
      });
      return false;
    }
    if (_currentAmount < 1) {
      wx.showModal({
        title: "口袋提示",
        content: "礼物数量已经是最少数量",
        showCancel: false,
        success: function (res) { }
      })
      carts[index].currentAmount = 1;
      this.setData({
        carts: carts
      });
      return false;
    }
    carts[index].currentAmount = _currentAmount;
    this.data.carts = carts;
    this.setData({
      carts: carts
    });
  },
  //获取礼物列表
  selectGiftLibrary() {
    wx.showNavigationBarLoading()
    let self = this;
    let a;
    if (a == undefined || a == null || a == '') {
      app.getOpenId(function giveList_getOpenId(a) {
        self.selectGiftLibrary_call(a);
      });
    }
  },
  selectGiftLibrary_call: function (a) {
    let self = this;
    wx.request({
      url: selectGiftLibrary,
      data: {
        'openId': a
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: res => {
        let carts = res.data;
        for (let i = 0; i < carts.length; i++) {
          carts[i]["currentAmount"] = carts[i]["amount"];
        }
        self.setData({
          hasList: true,
          carts: carts,
          totalPrice: 0
        });
      },
      fail: err => { },
      complete: function () {
        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh(); //停止下拉刷新
      }
    })
  },
  selectUserFlag: function () {
    let self = this;
    if (openId == null || openId == undefined || openId == '') {
      app.getOpenId(function (a) {
        openId = a;
        self.selectUserFlag_call(openId);
      });
    } else {
      self.selectUserFlag_call(openId);
    }
  },
  selectUserFlag_call: function (openId) {
    let self = this;
    wx.request({
      url: selectUserByOpenId,
      data: {
        'openId': openId,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (res) {
         userFlag = res.data.userFlag;
      }
    })
  },
  /*
  赠送礼物
  1.先获取用户的状态，再提示
   */
  give() {
    let self = this;
    console.log(userFlag)
    if (userFlag != 4) {
      wx.showModal({
        title: '口袋提示',
        content: '情侣任务还未开始，情侣任务开始后再来送Ta礼物',
        showCancel: false,
        success: function (res) { }
      })
    } else {
      var gift_array = Array();
      var giftCount_flag = false;
      let carts = this.data.carts;
      for (let i = 0; i < carts.length; i++) {
        if (carts[i].selected) {
          giftCount_flag = true;
          gift_array.push(carts[i]);
        }
      }
      if (giftCount_flag) {
        wx.showModal({
          title: '口袋提示',
          content: '赠送礼物给Ta',
          cancelText: "否",
          confirmText: "是",
          confirmColor: "#faa0ea",
          success: function (res) {
            if (res.confirm) {
              if (activityId == null || activityId == "" || activityId == undefined) {
                app.getActivityId(function (_data) {
                  activityId = _data;
                  self.give_call(gift_array);
                });
              } else {
                self.give_call(gift_array);
              }
            } else if (res.cancel) { }
          }
        })
      } else {
        wx.showModal({
          title: '口袋提示',
          content: '送Ta礼物之前，先选中礼物哦',
          showCancel: false,
          success: function (res) { }
        })
      }
    }
  },
  give_call: function (gift_array) {
    console.log(gift_array);
    let dataJson = JSON.stringify(gift_array);
    let self = this;
    wx.request({
      url: givtGift,
      data: {
        "dataJson": dataJson,
        "activityId": activityId,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (res) {
        let data = res.data;
        if (data > 0) {
          wx.showModal({
            title: "口袋提示",
            content: "礼物赠送成功",
            showCancel: false,
            success: function (res) { }
          })
        } else if (data < 1) {
          wx.showModal({
            title: "口袋提示",
            content: "礼物赠送失败",
            showCancel: false,
            success: function (res) { }
          })
        }
      },
      fail: function (err) { },
      complete: function () {
        self.selectGiftLibrary();
      }
    })
  },
  /*
  礼物兑换魅力值
   */
  exchange() {
    var self = this;
    var gift_array = Array();
    var giftCount_flag = false;
    let carts = this.data.carts;
    // console.log(carts)
    for (let i = 0; i < carts.length; i++) {
      if (carts[i].selected) {
        giftCount_flag = true;
        gift_array.push(carts[i]);
      }
    }
    if (giftCount_flag) {
      wx.showModal({
        title: "口袋提示",
        content: '确定用礼物兑换魅力值',
        cancelText: "否",
        confirmText: "是",
        // confirmColor: "#faa0ea",
        success: function (res) {
          res.confirm;
          if (res.confirm) {
            if (openId == null || openId == undefined || openId == "") {
              app.getOpenId(function (_data) {
                openId = _data;
                self.exchange_call(gift_array);
              });
            } else {
              self.exchange_call(gift_array);
            }
          } else if (res.cancel) { }
        }
      })
    } else {
      wx.showModal({
        title: "口袋提示",
        content: "兑换魅力值时，先选中礼物哦",
        showCancel: false,
        success: function (res) { }
      })
    }
  },
  exchange_call: function (gift_array) {
    let self = this;
    let dataJson = JSON.stringify(gift_array)
    // console.log(gift_array)
    wx.request({
      url: reviseGiftLibrary,
      data: {
        "openId": openId,
        "dataJson": dataJson,
        "state": 1
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (res) {
        let state = res.data;
        if (state > 0) {
          wx.showModal({
            title: "口袋提示",
            content: "恭喜您，兑换魅力值成功",
            showCancel: false,
            success: function (res) {
              self.selectGiftLibrary();
              var giftCount_flag = false;
            }
          })
        } else {
          wx.showModal({
            title: "口袋提示",
            content: "兑换魅力值失败",
            showCancel: false,
            success: function (res) {
              self.selectGiftLibrary();
              var giftCount_flag = false;
            }
          })
        }
      },
      fail: function (err) {
        wx.showModal({
          title: "口袋提示",
          content: "兑换魅力值失败，请检查网络",
          showCancel: false,
          success: function (res) { }
        })
      },
      complete: function () {
        self.selectGiftLibrary();
        var giftCount_flag = false;
      }
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
  /*
  跳转到礼物库页面
   */
  // toCart() {
  //   var self = this;
  //   self.setData({
  //     modal: true,
  //   })
  //   wx.redirectTo({
  //     url: '../cart/cart'
  //   })
  // },
  /*
  下拉刷新
   */
  onPullDownRefresh: function () {
    var self = this;
    self.selectGiftLibrary();
    self.startOnloadPage();
    self.give_button_status();
  },
  onReachBottom: function () {

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
  give_button_status: function () {
    var self = this;
    //获取本次活动用户openid和用户信息
    app.getOpenId(function giveList_onReachBottom_getOpenId(_data) {
      openId = _data;
      //判断openid不为空，根据openid获取用户信息。
      app.getUserInfo(function giveList_onReachBottom_getUserInfo(_data) {
        self.setUserInfo(_data);
      });
    });
  },
  setUserInfo: function (_data) {
    let self = this;
    // console.log(_data)
    // userFlag = _data.userFlag;
    if (_data.userFlag == 4) {
      self.setData({
        giveBackground: "#883f9e",
      });
    } else {
      self.setData({
        giveBackground: "",
      });
    }
  },
  /*
  兑换或赠送成功执行的操作
   */
  // successReduce() {
  //   var self = this;
  //   console.log(gift_array)
  //   for (let i = 0; i < gift_array.length; i++) {
  //     amount = gift_array[i].amount - thisValue;
  //     gift_array[i].amount = amount;
  //     console.log(" gift_array[i].amount:" + gift_array[i].amount)
  //     self.setData({
  //       modal: true,
  //     })
  //   }
  // },
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
  }
})