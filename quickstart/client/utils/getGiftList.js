const config = require("../config.js")
const selectGift = config.service.selectGift
function getGifts(pageindex, callbackcount, callback) {
  wx.request({
    url: selectGift,
    data: {},
    method: 'GET',
    header: { 'content-Type': 'application/json' },
    success: function (res) {
      console.log(res)
      if (res.statusCode == 200) {
        callback(res.data);
      }
    }
  })
}

module.exports = {
  getGifts: getGifts
}  