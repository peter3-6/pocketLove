const App = getApp();
var openId, MschoolCode;
const config = require("../../config.js")
// const openidUrl = config.service.openidUrl;
const labelList = config.service.labelList;
const updateUser = config.service.updateUser;
const perfectUser = config.service.perfectUser;
var activityId, province, city, county, birthday, school, labelId, fdNumber, s_userLabel, secondValue = 5,school, userLabelArray, constellationArray, current_constellation, current_userLabel, array,objectArray, current_userLabel, signature;
Page({
  data: {
    modalSys: true,
    modal: true,
    multiIndex: [0, 0, 0],
    region: [],
    array: ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天枰座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'],
    // objectArray: [{
    //   id: 0,
    //   name: '白羊座'
    // }, {
    //   id: 1,
    //   name: '金牛座'
    // }, {
    //   id: 2,
    //   name: '双子座'
    // }, {
    //   id: 3,
    //   name: '巨蟹座'
    // }, {
    //   id: 4,
    //   name: '狮子座'
    // }, {
    //   id: 5,
    //   name: '处女座'
    // }, {
    //   id: 6,
    //   name: '天枰座'
    // }, {
    //   id: 7,
    //   name: '天蝎座'
    // }, {
    //   id: 8,
    //   name: '射手座'
    // }, {
    //   id: 9,
    //   name: '摩羯座'
    // }, {
    //   id: 10,
    //   name: '水瓶座'
    // }, {
    //   id: 11,
    //   name: '双鱼座'
    // }],
    index: "",
    userLabel: ""
  },
  onLoad(option) {
   school = option['school'];
   var _school = school == null || school == undefined || school == '';
    var self = this;
    self.setData({
      school: school,
      _school: _school
    });
    self.$wuxPicker = App.Wux().$wuxPicker;
    self.$wuxPickerCity = App.Wux().$wuxPickerCity;
    App.getActivityId(function perfect_init_getActivityId(_data){
      activityId = _data;
      constellationArray = self.data.array;
      //从后台获取标签接口
      wx.request({
        url: labelList, //标签接口
        data: {},
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          var datas = res.data;
          userLabelArray = new Array();
          var userLabel_indexArray = new Array();
          for (var i in datas) {
            userLabel_indexArray[i] = res.data[i].labelId;
            userLabelArray[i] = res.data[i].labelContent;
          }
          self.setData({
            userLabel_index: userLabel_indexArray,
            userLabel: userLabelArray,
          })
          self.setData({
            otherLabel: userLabelArray,
          })
        },
        fail: function (err) { }
      })
    });
  },
  onShow:function(){
    //获取用户信息
    let self = this;
  },
  /*
  底部弹出的学校选择
   */
  onTapCity: function(e) {
    const self = this;
    self.$wuxPickerCity.init('city', {
      title: '请选择学校',
      onChange(value, values, displayValues) {
        self.setData({
          city0: displayValues[0],
          city1: displayValues[1],
          city2: displayValues[2]
        })
        school = displayValues[2];
        MschoolCode = values[2];
      },
    })
  },
  /*
  时间选择器
   */
  bindDateChange: function(e) {
    birthday = e.detail.value
    this.setData({
      date: birthday
    })
  },
  /*
   *触发选择地址的方法
   */
  bindRegionChange: function(e) {
    var self = this;
    var address = e.detail.value
    province = address[0];
    city = address[1];
    county = address[2];
    self.setData({
      region: e.detail.value
    })
  },
  /*
  星座事件
   */
  bindPickerChange: function(e) {
    var self = this;
    fdNumber = e.detail.value
    current_constellation = constellationArray[fdNumber];
    self.setData({
      index: e.detail.value
    })
  },
  /*
  提交表单信息
   */
  formSubmit: function(e) {
    var self = this;
    signature = e.detail.value.signature
    current_userLabel = userLabelArray[labelId];
    if (openId == undefined || openId == null || openId == "" ) {
        App.getUserInfo(function modifyInfo_getOpenId(_data) {
          openId = _data.openId;
          self.updateUser();
        });
      }else{
        self.updateUser();
      }
  },
  /*
  完善信息请求
   */
  updateUser: function() {
    var self = this;
        let _signature = signature != null && signature != undefined && signature != '';//自我描述
    let _province = province != null && province != undefined && province != '';//省
    let _city = city != null && city != undefined && city != '';//市
    let _county = county != null && county != undefined && county != '';//县、区
    let _school = school != null && school != undefined && school != '';//学校
    let _School = school == null && school == undefined && school == '';//学校
    let _current_userLabel = current_userLabel != null && current_userLabel != undefined && current_userLabel != '';
    let _birthday = birthday != null && birthday != undefined && birthday != '';
    let _openId = openId != null && openId != undefined && openId != '';
    let _current_constellation = current_constellation != null && current_constellation != undefined && current_constellation != '';
    let allData = _school && _signature && _province && _city && _county && _current_userLabel && _birthday && _openId && _current_constellation;
    let Data =  _signature && _province && _city && _county && _current_userLabel && _birthday && _openId && _current_constellation && _School ;

    if(allData){
      self.updateUser_call();//有学校
    }else if(Data){
      self.noSchoolUpData_call();//没有学校
    }else{
      wx.showModal({
        title: "口袋提示",
        content: "您的信息没有填写完整  \r\n  请填写完整后再进行提交",
        showCancel: false,
        success: function (res) { }
      })
    }
   
  },
 /*
  在校生完善信息请求
  */
  updateUser_call: function () {
    console.log(MschoolCode)
    var self = this;
    wx.request({
      url: perfectUser,
      data: {
        signature: signature,
        province: province,
        city: city,
        county: county,
        school: school,
        userLabel: current_userLabel,
        birthday: birthday,
        openId: openId,
        constellation: current_constellation,
        schoolCode: MschoolCode
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: res => {
        if (res.data > -1) {
           wx.showModal({
            title: "口袋提示",
            content: "您的信息提交成功",
            showCancel: false,
            success: function (res) { 
              self.toMy();

            }
          })
        } else if (res.data <= -1) {
          
          wx.showModal({
            title: "口袋提示",
            content: "您的信息提交失败，请重新进行提交",
            showCancel: false,
            success: function (res) { }
          })
        } else {
          
          wx.showModal({
            title: "口袋提示",
            content: "您的信息提交失败，请重新进行提交",
            showCancel: false,
            success: function (res) { }
          })
        }
      },
      fail: err => {
        wx.showModal({
          title: "口袋提示",
          content: "您的信息提交失败，请重新进行提交",
          showCancel: false,
          success: function (res) { }
        })
      }
    })
  },
  /*
  *非在校完善信息请求
  */
  noSchoolUpData_call: function () {
    var self = this;
    wx.request({
      url: perfectUser,
      data: {
        signature: signature,
        province: province,
        city: city,
        userLabel: current_userLabel,
        birthday: birthday,
        openId: openId,
        constellation: current_constellation
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: res => {
        console.log(res)
        if (res.data > -1) {
          wx.showModal({
            title: "口袋提示",
            content: "您的信息提交成功",
            showCancel: false,
            success: function (res) { 
              self.toMy();
            }
          })
        } else if (res.data <= -1) {
          wx.showModal({
            title: "口袋提示",
            content: "您的信息提交失败，请重新进行提交",
            showCancel: false,
            success: function (res) { }
          })
        } else {
          wx.showModal({
            title: "口袋提示",
            content: "您的信息提交失败，请重新进行提交",
            showCancel: false,
            success: function (res) { }
          })
        }
      },
      fail: err => {
        wx.showModal({
          title: "口袋提示",
          content: "您的信息提交失败，请重新进行提交",
          showCancel: false,
          success: function (res) { }
        })
      }
    })
  },
  /*
  个人标签事件
   */
  userLabel: function(e) {
    var self = this;
    labelId = s_userLabel = e.detail.value;
    var current_userLabel = userLabelArray[labelId];
    self.setData({
      userLabel_index: s_userLabel
    })
  },
  /*
  跳转到my页面
   */
  toMy: function() {
    wx.redirectTo({
      url: '../../pages/my/my'
    })
  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
      this.onLoad(); 
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
});