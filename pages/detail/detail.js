//detail.js
var util = require('../../utils/util.js')
var app = getApp()

Page({
  data: {
    res: '',
    wheight: 0,
    name: ''
  },
  onLoad(option) {
    this.setData({
      wheight: app.globalData.config.windowHeight,
      name: option.name
    })
    wx.setNavigationBarTitle({
      title: option.name + '的星座运势'
    })
    wx.showNavigationBarLoading()
    this.resData(option.id)
  },
  resData(id) {
    var today = util.formatTime(new Date())
    var self = this
    wx.request({
      url: 'https://apis.sweetui.com/api/xingzuo/fortune.php',
      data: {
        astroid: id,
        date: today
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        wx.hideNavigationBarLoading()
        if (res.data.status == '0') {
          self.setData({
            res: res.data.result
          })
        }
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: this.data.name + '的今日星座运势',
      path: '/pages/detail/detail?id=' + this.data.res.astroid + '&name=' + this.data.name,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})