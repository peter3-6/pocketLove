var openId;
const app = getApp();
const config = require("../../config.js")
const selectGift = config.service.selectGift
const image = config.service.image,
  selectUserByOpenId = config.service.selectUserByOpenId,
  updateGiftLibrary = config.service.updateGiftLibrary,
  images = image + "?fdId=";
var carts, totalValue, charismata, fdId, _fdId, gift_array = Array(), activityId;
Page({
  data: {
    modal: true,
    // background: "transparent",
    // regCueT: "",
    // regCueB: "",
    images: images,
    exchangeGiftButton: "兑换礼物",
    exchangeGiftToc: "exchange",
    carts: [], // 购物车列表
    hasList: false, // 列表是否有数据
    totalPrice: 0, // 总价，初始为0
    selectAllStatus: false, // 全选状态，默认全选
    obj: {
      name: "hello"
    },
    plus: "/images/plus.png",
    plusTap: "plus",
    myGiftListImg: '/images/myGift.png',
    toIndexPage: "onPullDownRefresh",
    scroll_top: 0,//上拉到一定的高度
    remind: '',//全部加载完的提示
    start: 9,//一次展示多少条数据
    switch: true,//正在加载数据的提示
    deviceHeight: 0,//scroll-view高度
    carts: []//数据列表
  },
  onLoad: function (options) {
    var self = this;
    var res = wx.getSystemInfoSync();
    self.setData({
      deviceHeight: res.windowHeight
    })
  },
  onReady: function () { },
  onShow() {
    var self = this;
    self.initPageData();
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
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    let self = this;
    self.loadMore();
  },
  /*
  下拉刷新
   */
  // onPullDownRefresh: function () {
  //   wx.showNavigationBarLoading() //在标题栏中显示加载
  //   let self = this;
  //   self.initPageData();
  // },
  /*
1.页面初始化数据
 */
  initPageData() {
    var self = this;
    self.getShopGiftList();//获取商城礼物列表
    self.selectUserByOpenId();//获取用户魅力值
    self.startOnloadPage();
  },
  //获取礼物商城礼物列表
  getShopGiftList: function () {
    // var selected = false;
    let self = this;
    wx.request({
      url: selectGift + '?limit=' + 12,
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: res => {
        carts = res.data;
        var id = res.data.fdId;
        self.setData({
          hasList: true,
          carts: carts,
          totalPrice: 0
        });
      },
      fail: err => {
      },
      complete: function () {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  loadMore() {
    var self = this;
    var x = this.data.start;
    if (this.data.remind !== '') {
      this.setData({
        start: x + 9
      });
    } else {
      this.setData({
        switch: false,
        start: x + 9
      });
    }
    x = this.data.start;
    wx.showLoading({
      title: '缘分加载中',
    })
    wx.request({
      url: selectGift + '?limit=' + x,
      data: {},
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
          switch: 'true',
          carts: res.data,
        })
      }
    })
  },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    const index = e.currentTarget.dataset.index; //选择礼物的下标
    let carts = this.data.carts; //礼物列表数据
    const selected = carts[index].selected;
    carts[index].selected = !selected;
    // console.log(carts[index].selected)
    for (let i = 0; i < carts.length; i++) {
      if (carts[i].selected) {
        let flag = true;
        for (let x = 0; x < gift_array.length; x++) {
          if (gift_array[x].fdId == carts[i].fdId) {
            flag = false
          }
        }
        if (flag) {
          gift_array.push(carts[i]);
        }
      } else {
        for (let x = 0; x < gift_array.length; x++) {
          if (gift_array[x].fdId == carts[i].fdId) {
            gift_array.splice(x, 1);
          }
        }
      }
    }
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },
  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;
    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
      if (carts[i].selected) {
        let flag = true;
        for (let x = 0; x < gift_array.length; x++) {
          if (gift_array[x].fdId == carts[i].fdId) {
            flag = false
          }
        }
        if (flag) {
          gift_array.push(carts[i]);
        }
      } else {
        for (let x = 0; x < gift_array.length; x++) {
          if (gift_array[x].fdId == carts[i].fdId) {
            gift_array.splice(x, 1);
          }
        }
      }
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();
  },
  /**
   * 绑定加数量事件
   */
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let fdCount = carts[index].fdCount;
    fdCount = fdCount + 1;
    carts[index].fdCount = fdCount;
    for (let x = 0; x < gift_array.length; x++) {
      if (gift_array[x].fdId == carts[index].fdId) {
        gift_array[x].fdCount = fdCount;
      }
    }
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },
  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    const obj = e.currentTarget.dataset.obj;
    let carts = this.data.carts;
    let fdCount = carts[index].fdCount;
    if (fdCount <= 1) {
      return false;
    }
    fdCount = fdCount - 1;
    // console.log(fdCount)
    carts[index].fdCount = fdCount;
    for (let x = 0; x < gift_array.length; x++) {
      if (gift_array[x].fdId == carts[index].fdId) {
        gift_array[x].fdCount = fdCount;
      }
    }
    // console.log(carts[index].fdCount)
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },
  /**
   * 计算总价
   */
  getTotalPrice() {
    carts = this.data.carts; // 获取购物车列表
    let total = 0;
    for (let i = 0; i < carts.length; i++) { // 循环列表得到每个数据
      if (carts[i].selected) { // 判断选中才会计算价格
        total += carts[i].fdCount * carts[i].conversionRate; // 所有价格加起来
      }
    }
    this.setData({
      carts: carts,
      totalPrice: total.toFixed(0)
    });
    totalValue = (total.toFixed(0))
  },
  /*
  获取个人信息的魅力值
   */
  selectUserByOpenId: function () {
    let self = this;
    if (openId == null || openId == undefined || openId == '') {
      app.getOpenId(function cart_getOpenId(_data) {
        self.selectUserByOpenId_call(_data)
      })
    } else {
      let _data = openId
      self.selectUserByOpenId_call(_data)
    }
  },
  selectUserByOpenId_call(_data) {
    var self = this;
    wx.request({
      url: selectUserByOpenId,
      data: {
        "openId": _data,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: res => {
        // console.log(res.data)
        charismata = res.data.charismata;
        self.setData({
          charismata: charismata,
        })
      },
      fail: err => { },
      complete: function () {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  /*
  点击兑换进行兑换
   */
  exchange() {
    /*选中礼物之后
    *1.魅力值不足的时候，提示魅力值不足
    *2.魅力值足够的时候，再提示是否确认兑换礼物
    */
    let self = this;
    let c = charismata - totalValue;//未选中礼物时，为总魅力值；选中礼物时，为兑换成功后的魅力值
    let i = parseInt(totalValue);
    // console.log(c, charismata, totalValue, i)
    if (totalValue == undefined || totalValue == null || totalValue == '' || i <= 0) {
      wx.showModal({
        title: '口袋提示',
        content: '兑换礼物之前，请选中礼物',
        showCancel: false,
      })
    } else {
      // console.log("1别堆砌怀念让剧情:", c, charismata, i)
      /*
       *又判断一次是否选中礼物，再进行兑换操作
       * c 未选中礼物时，为总魅力值；选中礼物时，为兑换成功后的魅力值
       * charismata 用户的魅力值
       * i 选中礼物的魅力值
       */

      if (charismata < i) {//1.魅力值不足的时候，提示魅力值不足
        // console.log("2变得狗血:", c, charismata, i);
        wx.showModal({
          title: '口袋提示',
          content: '支付的魅力值不足，请前去充值',
          showCancel: false,
        })
      } else if (charismata >= i) {//2.魅力值足够的时候，提示是否确认兑换
        // console.log("3深爱了多年又何必:", c, charismata, i);
        wx.showModal({
          title: '口袋提示',
          content: '是否确认兑换礼物',
          success: function (res) {
            if (res.confirm) {
              self.numExchangeGift(i);
            }
            //  else if (res.cancel) {}
          }
        });
      }
      // if (i > 0) {//如果大于0,说明已经选中礼物啦 --------------------
      //   console.log("变得狗血:", c, charismata, i);
      //   wx.showModal({
      //     title: '提示',
      //     content: '是否确认兑换礼物',
      //     success: function (res) {
      //       if (res.confirm) {
      //         // self.numExchangeGift();
      //       }
      //       //  else if (res.cancel) {}
      //     }
      //   });
      // if (charismata < i) {
      //   console.log("你:", c, charismata, i);

      // }
      // }--------------
      // else if(i < 1){}
      /*
       *直接进行兑换操作
      */
      // if (charismata < i){
      //   console.log("你:", c, charismata, i)
      // }
    }












    // let c = charismata - totalValue;//未选中礼物时，为总魅力值；选中礼物时，为兑换成功后的魅力值
    // let self = this;
    // if (totalValue > 0) {
    //   if (charismata < totalValue) {
    //     wx.showModal({
    //       title: '口袋提示',
    //       content: '支付的魅力值不足，请前去充值',
    //       showCancel: false,
    //     })
    //   } else if (charismata >= totalValue) {
    //     wx.showModal({
    //       title: '提示',
    //       content: '是否确认兑换礼物',
    //       success: function (res) {
    //         if (res.confirm) {
    //           self.numExchangeGift();
    //         }
    //         //  else if (res.cancel) {}
    //       }
    //     });
    //   }
    // } else {
    //   wx.showModal({
    //     title: '口袋提示',
    //     content: '兑换礼物之前，请选中礼物',
    //     showCancel: false,
    //   })
    // }
    /*
     *2018-2-5之前的写法 start
    // if (totalValue > 0) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '是否确认兑换礼物',
    //     success: function (res) {
    //       if (res.confirm) {
    //         if (charismata < totalValue) {
    //           wx.showModal({
    //             title: '口袋提示',
    //             content: '支付的魅力值不足，请前去充值',
    //             showCancel: false,
    //             // success: function (res) {
    //             //   if (res.confirm) {
    //             //     console.log('用户点击确定')
    //             //   }
    //             // }
    //           })
    //         } else if (charismata >= totalValue) {
    //           app.getOpenId(function open_id(_data) {
    //             openId  = _data;
    //             self.numExchangeGift(openId);
    //           });
    //         }
    //       } else if (res.cancel) {}
    //     }
    //   })
    // } else {
    //   wx.showModal({
    //     title: '口袋提示',
    //     content: '兑换礼物之前，请选中礼物',
    //     showCancel: false,
    //   })
    // }
     *2018-2-5之前的写法 end
     */
  },
  /*
  魅力值兑换礼物
   */
  numExchangeGift: function (i) {
    let a;
    let self = this;
    if (a == undefined || a == null || a == '') {
      app.getOpenId(function open_id(a) {
        self.numExchangeGift_call(a, i);
      });
    }
  },
  numExchangeGift_call(a,i) {
    // console.log(a, totalValue, i, gift_array)
    let self = this;
    let dataJson = JSON.stringify(gift_array)
    wx.request({
      url: updateGiftLibrary + '?state=' + 2,
      data: {
        "openId": a,
        "dataJson": dataJson,
        // "state": 2
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (res) {
        // console.log(res)
        let state = res.data;
        if (state > 0) {
          wx.showModal({
            title: '口袋提示',
            content: '兑换成功',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                totalValue = '0';
                self.initPageData();
                self.loadMore();
              }
            }
          })
        } else {
          wx.showModal({
            title: '口袋提示',
            content: '兑换失败',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                totalValue = 0;
                self.initPageData();
                self.loadMore();
              }
            }
          })
        }
      },
      fail: function () { },
      complete: function () {
        totalValue = '0';
        self.initPageData();
        self.loadMore();
      }
    })
  },
  /*
  modal不显示
   */
  noModal() {
    var self = this;
    self.setData({
      modal: true,
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