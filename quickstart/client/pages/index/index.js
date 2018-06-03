const app = getApp();//
const config = require("../../config.js")
const activityCountDown = config.service.activityCountDown;
const applyCountDown = config.service.applyCountDown,
  missionCountDown = config.service.missionCountDown,
  getActivityEndTime = config.service.getActivityEndTime,
  selectUserByOpenId = config.service.selectUserByOpenId,
  createUser = config.service.createUser,
  addTemplateMessage = config.service.addTemplateMessage;
var openId,
  nickName,
  fdGender,
  userLabel,
  charismata,
  constellation,
  signature,
  activityId,
  perfectUserInfo,
  enrollState,
  userFlag,
  remindId,
  t,
  userFlaga,
  datas,
  Datas,
  signEnd_countDown_date, //后台获取报名结束倒计时值
  activity_countDown_date, //后台获取活动倒计时值
  startTask_countDown_date,
  form_id,//可以查看匹配的formId
  perfectFormId;//可以报名的formId
Page({
  data: {
    remindModal: true, //默认true  进行你的浪漫之旅吧
    button: "参与任务",
    regCueT: "欢迎来到口袋之恋，下面请跟随我们进行你的浪漫之旅吧",
    regCueB: "首先来完善一下您的个人信息吧",
    modalCueImg: "/images/album.png",
    modalTap: "modalTap",
    modal: true,
    modalHome: false, //默认false
    personalInfo: {
      symbolize: "/images/symbolize.png",
      constellationImg: "/images/constellation.png",
      sex: "/images/sex.png",
      label: "/images/label.png",
      autograph: "/images/autograph.png"
    },
    userInfo: {
      nickName: "",
      charismata: "",
      fdGender: "",
      userLabel: "",
      signature: "",
    },
    constellation: "",
    hidden: true,
    modalImg: "",
    modalBut: "",
    homeModal: true,
    // 活动信息
    activityContent: "",
    ctivityName: "",
    activityRule: "",
    beginApplyTime: "",
    beginTime: "",
    endtime: "",
    second: '00',
    sec: "秒",
    minute: '00',
    min: "分",
    hour: '00',
    h: "时",
    day: '00',
    d: "天",
    disabled: true,
    color: "#76777b",
    start: "",
    startDisplay: "none",
    display: "inline-block",
    button: "报名",
    plus: "/images/plus.png",
    plusTap: "plus",
    givingGift: true,
    myGiftListImg: '/images/myGift.png',
    toIndexPage: "onPullDownRefresh"
  },
  //------------------生命周期函数----开始--监听页面---------------------------------
  onLoad: function (option) {
    // var self = this;
    // console.log("onLoad", option);
    // form_id = option['form_id'];
    // perfectFormId = option['perfectFormId'];
    // // console.log(form_id)
    // //1.先判断执行哪个消息模板
    // //2.再判断有没有对应的formId
    // let _form_id = form_id == null || form_id == undefined || form_id == '';
    // let _perfectFormId = perfectFormId == null || perfectFormId == undefined || perfectFormId == '';

    // if (!_form_id) {
    //     try {
    //     wx.setStorageSync('form_id', form_id)
    //   } catch (e) {}
    //   // wx.setStorage({
    //   //   key: "form_id",
    //   //   data: form_id
    //   // })
    //   // self.viewMatching(form_id);
    // }
    // if (!_perfectFormId) {
    //   try {
    //     wx.setStorageSync('perfectFormId', perfectFormId)
    //   } catch (e) {}
    //   // wx.setStorage({
    //   //   key: "perfectFormId",
    //   //   data: perfectFormId
    //   // })
    //   // self.canSignUp(perfectFormId);
    // }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initUserInfo();
    wx.showShareMenu({
      withShareTicket: true
    })
    // wx.getStorage({
    //   key: 'perfectFormId',
    //   success: function (res) {
    //     console.log("getStorage",res.data)
    //   }
    // })
  },
  /*
  下拉刷新
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
  },//秋风落叶,满地是殇
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
      self.getActivityEnd();
      self.setUserInfo(_data);
    }
  },
  //-------------------公共方法--------结束------------------------------
  //-------------------获取活动结束时间--------start------------------------------
  getActivityEnd: function () {//
    //1.先获取活动结束状态
    //2.根据活动结束状态进行判断调取活动开始倒计时或显示活动结束状态
    var self = this;
    if (activityId == null || activityId == undefined || activityId == "") {
      app.getActivityId(function index_activityCountDown_getActivityId(_data) {
        activityId = _data;
        self.getActivityEnd_call();
      });
    } else {
      self.getActivityEnd_call();
    }
  },
  getActivityEnd_call: function () {
    var self = this;
    wx.request({
      url: getActivityEndTime,
      data: {
        "activityId": activityId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (ret_obj) {
        let data = ret_obj.data;
        data = 100;
        if (data > 0) {
          self.activityCountDown();
        } else {
          self.setData({
            djsText: "活动开始",
            modalHome: true,
            modal: true,
            color: "#76777b",
            startDisplay: "inline-block",
            display: "none",
            start: "当前状态已经结束",
            sec: "",
            min: "",
            h: "",
            d: "",
          })
        }
      },
      fail: function (err) { }
    })
  },
  //-------------------获取活动结束时间--------end------------------------------
  //2、设置用户信息
  setUserInfo: function (_data) {
    var self = this;
    self.getMyInfo = _data;
    if (_data == null || _data == "") {
      //初次进入没有用户信息
      self.setData({
        modalHome: false, //默认false
      })
    } else {
      self.setData({
        modalHome: true, //默认false
        nickName: _data.nickName,
        fdGender: _data.fdGender,
        userLabel: _data.userLabel,
        charismata: _data.charismata,
        constellation: _data.constellation,
        signature: _data.signature,
      })
      let gender = _data.fdGender;
      if (gender == '女') {
        self.setData({
          headImg: "https://koudaizhilian-1254460722.cosbj.myqcloud.com/images/Gender1.jpg"
        })
      } else if (gender == '男') {
        self.setData({
          headImg: "https://koudaizhilian-1254460722.cosbj.myqcloud.com/images/Gender2.jpg"
        })
      }
    }
    self.userStateOnload(userFlaga);
  },
  /*
  点击报名触发的事件
   */
  formSubmit(e) {
    var self = this;
    let b = e.detail.formId;
    self.indexUpB(b);
    // self.toA();
  },
  //注册信息
  perfect: function () {
    var self = this;
    clearTimeout(t);
    self.setData({
      modal: true,
    })
    wx.redirectTo({
      url: '../perfectInfo/perfectInfo',
    })
  },
  /*
 点击欢迎层的效果事件
   */
  modalTap: function () {
    var self = this;
    if (openId == null || openId == undefined || openId == '') {
      app.getOpenId(function modalTap_openId(_data) {
        self.modalTap_call(_data);
      });
    } else {
      let _data = openId;
      self.modalTap_call(_data);
    }
  },
  modalTap_call: function (_data) {
    let self = this;
    wx.request({
      url: selectUserByOpenId,
      data: {
        "openId": _data
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (e) {
        let data = e.data;
        if (data == null || data == undefined || data == '') {
          wx.showModal({
            title: '口袋提示',
            content: '授权已过期,是否重新授权',
            cancelText: '否',
            confirmText: '是',
            success: function (res) {
              if (res.confirm) {
                wx.getUserInfo({
                  success: function (res) {
                    let userInfo = res.userInfo;
                    let nickName = userInfo.nickName,
                    // let nickName = '',
                      gender = userInfo.gender,
                      avatarUrl = userInfo.avatarUrl,
                      city = userInfo.city,
                      country = userInfo.country,
                      language = userInfo.language,
                      province = userInfo.province;
                    console.log(nickName)
                    let _nickName = nickName == null || nickName == undefined || nickName == '';
                    if (!_nickName) {
                      let data = {
                        "openId": _data,
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
                          let data = res.data;
                          let statusCode = res.statusCode;
                          if (data > 0 && statusCode == 200) {
                            self.perfect();
                          }
                        },
                        fail: err => { }
                      })
                    }
                    // else{
                    //   wx.showModal({
                    //     title: '口袋提示',
                    //     content: '获取不到你的微信昵称，请先在微信设置里修改或完善昵称',
                    //   })
                    // }
                  }
                });
              }else if(res.cancel){
                wx.showModal({
                  title: '123',
                  content: '123',
                })
              }
            }
          })
        } else {
          let userFlag = data.userFlag;
          let openId = data.openId;
          let nickName = data.nickName;
          let _userFlag = userFlag == null || userFlag == undefined || userFlag == '';
          let _openId = openId == null || openId == undefined || openId == '';
          let _nickName = nickName == null || nickName == undefined || nickName == '';
          if ((userFlag == 0) && !_openId && !_nickName) {
            self.setData({
              modalHome: true,
            })
            self.perfect();
          }
          else {
            let _data = e.data;
            let gender = _data.fdGender;
            if (gender == '女') {
              self.setData({
                headImg: "https://koudaizhilian-1254460722.cosbj.myqcloud.com/images/Gender1.jpg"
              })
            } else if (gender == '男') {
              self.setData({
                headImg: "https://koudaizhilian-1254460722.cosbj.myqcloud.com/images/Gender2.jpg"
              })
            }
            wx.hideLoading();
            self.setData({
              nickName: _data.nickName,
              fdGender: _data.fdGender,
              userLabel: _data.userLabel,
              charismata: _data.charismata,
              constellation: _data.constellation,
              signature: _data.signature,
              modalHome: true,
            })
          }
        }

      },
      fail: function () { }
    });
  },
  /*
  跳转到提交匹配条件页面
   */
  toA() {
    wx.redirectTo({
      url: '../../pages/a/a',
    })
  },
  //跳转到查看匹配
  toMatchingPage: function () {
    wx.redirectTo({
      url: '../../pages/matching/matching',
    })
  },
  //跳转到查开始任务
  toStartTaskPage: function () {
    wx.redirectTo({
      url: '../../pages/startTask/startTask',
    })
  },
  //页面加载时，判断用户状态
  //首页跳转方式包括：1、个人信息完善，跳转到home页面；2、报名成功后，跳转到进行匹配页面；3、已填写匹配信息后，跳转到查看匹配；4、匹配成功后，跳转到开始任务页面
  //3、页面加载时，判断用户状态
  userStateOnload: function (_userFlaga) {
    var self = this;
    if (self.getMyInfo == null || self.getMyInfo == "" || self.getMyInfo == undefined) {
      app.toWelcomePage();
    } else {
      //判断用户是否完整
      if (_userFlaga == 0) {
        self.setData({
          modalHome: false,
        })
        self.perfect();
      } else if (_userFlaga == 1) { } else if (_userFlaga == 2) {

      } else if (_userFlaga == 3) {
        if (signEnd_countDown_date == null || signEnd_countDown_date == undefined) {
          let activityId;
          if (activityId == null || activityId == undefined || activityId == '') {
            app.getActivityId(function (activityId) {
              wx.request({
                url: applyCountDown,
                data: {
                  "activityId": activityId
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                method: "POST",
                success: function (res) {
                  // console.log(res)
                  let signEnd_countDown_date = parseInt(res.data / 1000);
                  if (signEnd_countDown_date <= 0) {
                    self.toMatchingPage();
                  }
                }
              });
            });
          }
        } else if (signEnd_countDown_date <= 0) {
          self.toMatchingPage();
        }
      } else if (_userFlaga == 4) {
        self.toStartTaskPage();
      } else if (_userFlaga == 5) {
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
      self.startOnloadPage();
    }
  },
  /*
  禁用报名按钮
   */
  disabled: function () {
    var self = this;
    self.setData({
      disabled: true,
    })
  },
  /*
  获取活动倒计时
   */
  activityCountDown() {
    var self = this;
    if (activityId == null || activityId == "") {
      app.getActivityId(function index_activityCountDown_getActivityId(_data) {
        activityId = _data;
        self.activityCountDown_call();
      });
    } else {
      self.activityCountDown_call();
    }
  },
  activityCountDown_call: function () {
    var self = this;
    wx.request({
      url: activityCountDown,
      data: {
        "activityId": activityId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (ret_obj) {
        // console.log("活动开始",ret_obj.data)
        activity_countDown_date = parseInt(ret_obj.data / 1000);
        if (activity_countDown_date <= 0) {
          if (userFlaga != 1) {
            self.setData({
              modal: true,
              disabled: true,
              color: "#76777b",
            });
          } else {
            //调用报名结束倒计时方法
            self.setData({
              modal: true,
              // disabled: true,
              disabled: false,
              color: "#76777b",
              startDisplay: "none",
              display: "inline-block",
              djsText: "报名结束",
              button: "报名"
            });
          }
          self.signUpEndTime(); //报名结束倒计时
        } else {
          activity_countDown_date = parseInt(ret_obj.data / 1000)
          self.setData({
            modalHome: true,
            modal: true,
            disabled: true,
            color: "#76777b",
            startDisplay: "none",
            display: "inline-block",
            djsText: "活动开始",
            button: "报名",
          })
          /*报名倒计时*/
          app.cpu_setInterval(activity_countDown_date, function (days, hours, minutes, seconds) {
            //设置倒计时时间
            self.setData({
              day: days,
              hour: hours,
              minute: minutes,
              second: seconds
            });
            // console.log("activity_countDown_date",activity_countDown_date)
          }, function () {
            self.setData({
              modalHome: true,
              disabled: false,
              color: "#76777b",
              startDisplay: "none",
              display: "inline-block",
              djsText: "报名结束",
              button: "报名"
            });
            // wx.getStorage({
            //   key: 'perfectFormId',
            //   success: function (res) {
            //     console.log("res.data",res.data);
            //     var perfectFormId = res,data;
            //     console.log("活动开始倒计时", perfectFormId)
            // self.canSignUp(perfectFormId)//可以进行报名的模板消息
            //   }
            // })

            self.signUpEndTime() //报名结束倒计时
          });
        };
        self.button_handler(); //判断按钮状态
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  //倒计时结束时，修改以下信息
  setDataByRemind: function () {
    var self = this;
    self.setData({
      modalHome: true,
      modal: true,
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
      start: "已经开始了",
      startDisplay: "inline-block",
      display: "none",
      djsText: "活动开始",
    });
  },
  //报名结束倒计时
  signUpEndTime: function () {
    var self = this;
    if (app.isBlank(activityId)) {
      app.getActivityId(function index_signUpEndTime_getActivityId(_data) {
        activityId = _data;
        self.signUpEndTime_call();
      });
    } else {
      self.signUpEndTime_call();
    }

  },
  //报名结束倒计时请求操作
  signUpEndTime_call: function () {
    var self = this;
    wx.request({
      url: applyCountDown,
      data: {
        "activityId": activityId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (ret_obj) {
        // console.log("报名结束",ret_obj.data)
        signEnd_countDown_date = parseInt(ret_obj.data / 1000)
        if (signEnd_countDown_date > 0) {
          /*报名倒计时*/
          self.setData({
            modalHome: true,
            modal: true,
            color: "#76777b",
            djsText: "报名结束",
            sec: "秒",
            min: "分",
            h: "时",
            d: "天",
          });
          app.cpu_setInterval(signEnd_countDown_date, function (days, hours, minutes, seconds) {
            //设置倒计时时间
            self.setData({
              day: days,
              hour: hours,
              minute: minutes,
              second: seconds
            });

          },
            function () {
              //               wx.getStorage({
              //   key: 'form_id',
              //   success: function (res) {
              //     console.log("res.data",res.data)
              //   }
              // })
              //报名倒计时结束，发送模板消息通知2018-1-18
              // console.log("倒计时结束，发送模板消息通", form_id)
              // let _form_id = form_id == null || form_id == undefined || form_id == '';
              // if (!_form_id) {
              //   self.viewMatching(form_id);
              // }
              //1.倒计时为<=0执行的方法
              //2.判断报名返回的data的值进行选择性挑专  
              if (userFlaga === 3) {
                self.toMatchingPage();
              } else {
                self.setData({
                  disabled: true,
                });
              }
            });
        } else if (signEnd_countDown_date <= 0) {

          /*报名倒计时*/
          self.setData({
            modalHome: true,
            modal: true,
            color: "#76777b",
            startDisplay: "inline-block",
            display: "none",
            start: "当前状态已经结束",
            sec: "",
            min: "",
            h: "",
            d: "",
          });
          if (signEnd_countDown_date === 1) {
          } else {
            self.setData({
              disabled: true,
              // background: 'red'
            })
          }
        }
      }
    })
  },
  //获取消息信息列表，在首页进行列表显示
  systemMessageRemind(_title, _content) {
    var self = this;
    self.setData({
      // remindModal: false,
      remindTitle: _title,
      remindContent: _content,
      remindModalTap: "hidden",
      // txet: "textBut",
    })
  },
  /*
送礼物指示的小贴士消失
 */
  hidden() {
    var self = this;
    self.setData({
      modal: true,
      givingGift: true,
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
  送礼物指示的小贴士消失
   */
  hidden() {
    // console.log("送礼物指示的小贴士消失")
    var self = this;
    self.setData({
      modal: true,
      givingGift: true,
    })
  },

  /*
  隐藏消息提示层
   */
  noGivingGiftTap: function () {
    var self = this;
    self.setData({
      givingGift: true,
    })
  },
  //对按钮是否可用的进行的控制
  button_handler: function () {
    if (userFlaga != 1) {
      this.setData({
        disabled: true,
      })
    } else {
      if (activity_countDown_date <= 0 && signEnd_countDown_date > 0) {
        this.setData({
          disabled: false,
        })
      }
    }
  },
  /*
  获取任务倒计时控制页面跳转
   */
  getStartTaskCountDown: function () {
    var self = this;
    if (activityId == null || activityId == "") {
      app.getActivityId(function index_getStartTaskCountDown_getActivityId(_data) {
        activityId = _data;
        self.getStartTaskCountDown_call();
      });
    } else {
      self.getStartTaskCountDown_call();
    }
  },
  getStartTaskCountDown_call: function () {
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
      success: function (res) {
        startTask_countDown_date = parseInt(res.data / 1000);
        if (startTask_countDown_date > 0) {
          self.toStartTaskPage();
        } else if (startTask_countDown_date <= 0) {
        }
      },
      fail: function (err) { }
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
  //向服务器端传输b
  indexUpB: function (b) {
    let self = this, openId;
    if (openId == null || openId == undefined || openId == '') {
      app.getOpenId(function welcome(a) {
        self.indexUpB_call(a, b)
      });
    } else {
      a = openId;
      self.indexUpB_call(a, b)
    }
  },
  indexUpB_call: function (a, b) {
    // console.log(a, b)
    let self = this;
    wx.request({
      url: addTemplateMessage,
      data: {
        "openId": a,
        "form_id": b,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (res) {
        console.log(res)
      },
      fail: function (err) {

      },
      complete:function(){
        self.toA();
      }
    })
  },
})