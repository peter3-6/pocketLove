var openId;
const config = require("../../config.js")
const selectMissioned = config.service.selectMissioned,
  selectMissionedByFdId = config.service.selectMissionedByFdId,
  missionedImage = config.service.missionedImage;
var activityId, missionType, fdId, missionType, datas;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    taskDetails: "https://koudaizhilian.oss-cn-beijing.aliyuncs.com/img/taskDetails.jpg",
  },
  //------------------生命周期函数  start-------------------
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    let self = this;
    // console.log(option)
    fdId = option['fdId'];
    missionType = option['missionType'];
    self.setData({
      missionedImage: missionedImage,
      missionType: missionType
    })
    //获取任务信息
    // self.getTaskDetails();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let self = this;
    self.getTaskDetails();
    
   },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },
  /**
   * 用户点击右上角分享
   */
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
  //------------------生命周期函数  end-------------------
  //------------------预览图片  start-------------------
  /*
  预览左侧任务图片
   */
  previewImageLeft() {
    wx.previewImage({
      urls: [missionedImage + '?fdId=' + datas[0].fdId]
    })
  },
  /*
  预览右侧图片
   */
  previewImageRight() {
    wx.previewImage({
      urls: [missionedImage + '?fdId=' + datas[1].fdId]
    })
  },
  //------------------预览图片  end-------------------
  getTaskDetails: function () {
    let self = this;
    let _fdIdNull = fdId == null || fdId == undefined || fdId == '';
    if (_fdIdNull) {
      wx.showModal({
        title: '错误提示',
        content: 'Cannot read property "fdId" of null',
        showCancel:false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.request({
        url: selectMissionedByFdId,
        data: {
          "fdId": fdId
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: "POST",
        success: function (res) {
          // console.log(res.data)
          //1.先判断有没有数据
          //2.判断性别
          //3.根据性别限制显示规则
          let data = res.data;
          let _data = data == null || data == undefined || data == '';
          if (!_data) {
            let dataLeft = res.data[0].fdUser.fdGender == '男' && res.data[0] != null;
            let dataRight = res.data[0].fdUser.fdGender == '女' && res.data[0] != null;
            datas = res.data;
            if (dataLeft) {
              self.setData({
                datas: datas,
                dataLeft: dataLeft,
                dataRight: dataRight
              })
            } else if (dataRight) {
              self.setData({
                datas: datas,
                dataLeft: dataLeft,
                dataRight: dataRight
              })
            }
          }
        },
        fail: function (err) {
          console.log(err)
        }
      })
    }

  }
})