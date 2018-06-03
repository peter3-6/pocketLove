const config = require("../../config.js")
const submit = config.service.submit,
  selectActivityByFdFlag = config.service.selectActivityByFdFlag
var openId, missionNames, activityId, activityConfigureId, missionId, filePaths;
const app = getApp();
const picture = config.service.picture,
  sendMissionTemplate = config.service.sendMissionTemplate;
import weCropper from '../../utils/weCropper.js'
const device = wx.getSystemInfoSync();
const width = device.windowWidth;
const height = device.windowHeight - 50;
var x = 1, y = 1, _x = 0;
Page({
  data: {
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 300) / 2,
        y: (height - 300) / 2,
        width: 300,
        height: 300
      }
    }
  },
  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },
  /*
  确定上传图片
   */
  formSubmit(e) {
    var self = this;
    if (_x > 0) {
      let _y = y++;
      if (_y === 1) {
        self.wecropper.getCropperImage((filePath) => {
          filePaths = filePath;
          if (filePath) {
            self.uploadImg();
          } else {
            wx.showModal({
              title: '口袋提示',
              content: '取图片地址失败，请稍后重试',
              showCancel: false,
              success: function (res) {
                self.upTask();
              }
            })
          }
        })
      }
    } else {
      wx.showModal({
        title: '口袋提示',
        content: '请先上传图片',
        showCancel: false,
        success: function (res) { }
      })
    }
  },
  /*
  上传图片
   */
  uploadImg: function () {
    var self = this;
    var a = wx.uploadFile({
      url: picture,
      filePath: filePaths,
      name: 'imageFile',
      formData: {
        openId: openId,
        missionId: missionId,
        activityId: activityId,
        activityConfigureId: activityConfigureId
      },
      header: {
        "Content-Type": "multipart/form-data"
      },
      success: function (res) {
        console.log(res)
        let data = res.data;
        let _Number = Number;
        console.log(typeof data);
        if ((typeof data) != _Number) {
          let _data = parseInt(data);
          console.log(_data)
          if (_data > 0) {
            self.sendTaskNews()
            wx.showModal({
              title: '口袋提示',
              content: '图片已经成功提交',
              mask: true,
              showCancel: false,
              success: function (res) {
                self.upTask();
              }
            })
          } else {
            wx.showModal({
              title: '口袋提示',
              content: '图片提交失败，请重新提交',
              mask: true,
              showCancel: false,
            })
          }
        } else {
          if (res.data > 0) {
            self.sendTaskNews()
            wx.showModal({
              title: '口袋提示',
              content: '图片已经成功提交',
              mask: true,
              showCancel: false,
              success: function (res) {
                self.upTask();
              }
            })
          } else {
            wx.showModal({
              title: '口袋提示',
              content: '图片提交失败，请重新提交',
              mask: true,
              showCancel: false,
            })
          }
        }
      },
      faii: function (err) {
        wx.showModal({
          title: '口袋提示错误',
          content: err,
          mask: true,
          showCancel: false,
        })
      }
    })
  },
  /*
  选择上传图片
   */
  uploadTap() {
    const self = this;
    _x = x++;
    // console.log(_x)
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const filePath = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值
        self.wecropper.pushOrign(filePath)
      }
    })
  },
  onLoad(option) {
    // console.log(option)
    let self = this;
    if (activityId == null || activityId == undefined || activityId == "") {
      app.getActivityId(function canvas_onLoad_getActivityId(_data) {
        activityId = _data;
        self.init_page(option);
      });
    } else {
      self.init_page(option);
    }
  },
  onShow: function () {
    x = 1, y = 1;
    // _x = 0
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
  init_page: function (option) {
    // console.log(option)
    var self = this;
    activityConfigureId = option['activityConfigureId']
    missionId = option['missionId']
    app.getOpenId(function can_getOpenId(_data) {
      openId = _data;
    });
    const {
      cropperOpt
    } = this.data
    new weCropper(cropperOpt)
      .on('ready', (ctx) => { })
      .on('beforeImageLoad', (ctx) => {
        wx.showToast({
          title: '图片上传中，请稍等...',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        wx.hideToast()
      })
      .on('beforeDraw', (ctx, instance) => { })
      .updateCanvas()
  },
  upTask() {
    var self = this;
    self.task()
  },
  task: function () {
    wx.redirectTo({
      url: '../../pages/task/task'
    })
  },
  //发送模板消息通知的请求
  sendTaskNews: function () {
    let self = this;
    let a, g;
    if (a == null || a == undefined || a == '') {
      app.getOpenId(function (a) {
        openId = a;
      });
    };
    if (g == null || g == undefined || g == '') {
      app.getActivityId(function (g) {
        activityId = g;
      });
    };
    if (openId && activityId) {
      self.sendTaskNews_call(openId, activityId)
    };
  },
  sendTaskNews_call: function (openId, activityId) {
    let self = this;
    wx.request({
      url: sendMissionTemplate,
      data: {
        openId: openId,
        activityId: activityId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        // console.log('完成任务消息，', res)
      },
      fail: function (err) {

      }
    })
  }
})