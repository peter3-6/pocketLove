var openId, school, current, activityId;
const app = getApp();
const config = require("../../config.js")
const userList = config.service.userList,//
  selectUserBySchool = config.service.selectUserBySchool,
  selectUserByOpenId = config.service.selectUserByOpenId,
  messageList = config.service.messageList,
  controlMessage = config.service.controlMessage;
Page({
  data: {
    currentTab: 0,
    plus: "/images/plus.png",
    plusTap: "plus",
    scroll_top: 0,//上拉到一定的高度
    remind: '',//全部加载完的提示
    start: 9,//一次展示多少条数据
    switcha: true,//正在加载数据的提示
    deviceHeight: 0,//scroll-view高度
    worlds: [],//数据列表
    schools: [],//数据列表
    scrollTrue: true,
  },
  onLoad: function () {
    var self = this;
    var res = wx.getSystemInfoSync();
    self.setData({
      deviceHeight: res.windowHeight
    })
  },
  /** 
   * 滑动切换tab 
   */
  bindChange: function (e) {
    var that = this;
    current = e.detail.current;
    that.setData({
      currentTab: current
    });
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  /*
  学校魅力排行
   */
  school() {
    let self = this;
    let a;
    if (a == null || a == undefined || a == '') {
      app.getOpenId(function charm_scool_getA(a) {
        self.school_call(a)
      });
    } else {
      let a = openId;
      self.school_call(a)
    }
  },
  school_call: function (a) {
    let self = this;
    let d;
    if (d == null || d == undefined || d == '') {
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
          let d = res.data.schoolCode;
          self.school_call_back(a, d);
        },
        fail: function (err) { },
      })
    } else {
      let d = schoolCode;
      self.school_call_back(a,d);
    }

  },
  school_call_back: function (a, d) {
    var self = this;
    wx.request({
      url: selectUserBySchool + '?limit=' + 9,
      data: {
        "openId": a,
        "schoolCode": d,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // console.log(res)
        self.setData({
          first: "/images/first.png",
          second: "/images/second.png",
          third: "/images/third.png",
        })
        let schools = res.data;
        //  let length = res.data.length;
        //   if (length < 1){
        //     self.setData({
        //       first: "",
        //       second: "",
        //       third: "",
        //     })
        //   } else if (length == 1){
        //     self.setData({
        //       first: "/images/first.png",
        //       second: "",
        //       third: "",
        //     })
        //   } else if (length == 2){
        //     self.setData({
        //       first: "/images/first.png",
        //       second: "/images/second.png",
        //       third: "",
        //     })
        //   } else if (length >= 3){
        //     self.setData({
        //       first: "/images/first.png",
        //       second: "/images/second.png",
        //       third: "/images/third.png",
        //     })
        //   }
        if (schools.length <= 9) {
          self.setData({
            remind: '没有数据啦...'
          })
        }
        self.setData({
          schools: schools
        })
      },
      fail: function (err) { },
      complete: function () {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  /*
  *学校排行上拉加载
  */
  loadMoreSchool: function () {
    var self = this;
    var j = this.data.start;
    if (this.data.remind !== '') {
      this.setData({
        start: j + 9
      });
    } else {
      this.setData({
        switcha: false,
        start: j + 9
      });
    }
    j = this.data.start;
    if (openId == null || openId == undefined || openId == "") {
      app.getOpenId(function (a) {
        //获取d
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
            let d = res.data.schoolCode;
            //进行上拉加载数据
            wx.request({
              url: selectUserBySchool + '?limit=' + j,
              data: {
                "openId": a,
                "schoolCode":d,
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              method: "POST",
              success: function (res) {
                if (res.data.length <= j) {
                  self.setData({
                    remind: '我也是有底线的...'
                  })
                }
                self.setData({
                  switcha: true,
                  schools: res.data,
                })
              }
            })
          },
          fail: function (err) { },
        }); 
      });
    } else {
      //初始化d
      let a = openId;
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
          let d = res.data.schoolCode;
          //进行上拉加载数据
          wx.request({
            url: selectUserBySchool + '?limit=' + j,
            data: {
              "openId": a,
              "schoolCode": d,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: "POST",
            success: function (res) {
              if (res.data.length <= j) {
                self.setData({
                  remind: '我也是有底线的...'
                })
              }
              self.setData({
                switcha: true,
                schools: res.data,
              })
            }
          })
        },
        fail: function (err) { },
      }) 
    }
  },
  /*
  世界魅力排行
   */
  worlds() {
    var self = this;
    wx.request({
      url: userList + '?limit=' + 9, //世界魅力排行
      // url: userList + '?limit=' + 11, //世界魅力排行
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (res) {
        let Worlds = res.data;
        let length = res.data.length;
        if (length < 1) {
          self.setData({
            first: "",
            second: "",
            third: "",
          })
        } else if (length == 1) {
          self.setData({
            first: "/images/first.png",
            second: "",
            third: "",
          })
        } else if (length == 2) {
          self.setData({
            first: "/images/first.png",
            second: "/images/second.png",
            third: "",
          })
        } else if (length >= 3) {
          self.setData({
            first: "/images/first.png",
            second: "/images/second.png",
            third: "/images/third.png",
          })
        }
        self.setData({
          worlds: Worlds
        })
      },
      fail: function (err) {
        console.log(err)
      },
      complete: function () {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  // 世界排行上拉加载
  loadMoreWorlds: function () {
    var self = this;
    wx.showLoading({
      title: '缘分加载中',
    })
    var x = this.data.start;
    if (this.data.remind !== '') {
      this.setData({
        start: x + 9
      });
    } else {
      this.setData({
        switcha: false,
        start: x + 9
      });
    }
    x = this.data.start;
    wx.request({
      url: userList + '?limit=' + x,
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
          switcha: true,
          worlds: res.data,
        })
      }
    })
  },
  //------------------生命周期函数----开始--监听页面加载---------------------------------
  onShow: function () {
    this.school();
    this.worlds();
    this.startOnloadPage();
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var self = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    var currentA = current;
    if (currentA == 0) {
      self.school();
    } else if (currentA == 1) {
      self.worlds();
    } else if (currentA == undefined || currentA == null) {
      self.school();
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var self = this;
    var currentA = current;
    if (currentA == 0) {
      self.loadMoreSchool();
    } else if (currentA == 1) {
      self.loadMoreWorlds()
    } else if (currentA == undefined || currentA == null) {
      self.loadMoreSchool();
    }
  },
  //------------------生命周期函数----结束-----------------------------------
  //点击弹出
  plus: function () {
    if (this.data.isPopping == undefined) {
      let isPopping = true;
      // console.log(isPopping);
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
跳转到task页面
 */
  toTaskPage: function () {
    wx.redirectTo({
      url: '../../pages/task/task',
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