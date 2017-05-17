//index.js
var app = getApp()
Page({
  data: {
    wheight: 0,
    userlist: [],
    isedit: false,
    all_xz: [],
    xz_index: 0,
    newuser: ''
  },
  onLoad: function () {
    var self = this
    //wx.clearStorageSync()
    if (!wx.getStorageSync('all_xz')) {
      console.log('set')
      wx.request({
        url: 'https://apis.sweetui.com/api/xingzuo/xz_all.php',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.setStorageSync('all_xz', res.data.result)
          self.setData({
            all_xz: res.data.result
          })
        }
      })
    } else {
      this.setData({
        all_xz: wx.getStorageSync('all_xz')
      })
    }

    if(wx.getStorageSync('userlist')) {
      this.setData({
        userlist: wx.getStorageSync('userlist')
      })
    }

    this.setData({
      wheight: app.globalData.config.windowHeight,
    })
  },
  edit() {
    this.setData({
      isedit: true
    })
  },
  save() {
    var self = this
    var userlist = wx.getStorageSync('userlist') || []
    if(!this.data.newuser) {
      wx.showModal({
        title: '提示',
        content: '请输入您关心的人的昵称',
        showCancel: false
      })
      return
    }
    if (this.data.newuser.length > 8) {
      wx.showModal({
        title: '提示',
        content: '昵称不要超过8个字符',
        showCancel: false
      })
      return
    }
    userlist.push({
      name: self.data.newuser,
      id: self.data.xz_index,
      xz: self.data.all_xz[self.data.xz_index].astroname
    })
    wx.setStorageSync('userlist', userlist)
    this.setData({
      userlist: userlist,
      newuser: ''
    })
  },
  cancle() {
    this.setData({
      isedit: false
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      newuser: e.detail.value
    })
  },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      xz_index: e.detail.value
    })
  },
  deleteUser(event) {
    var id = event.currentTarget.dataset.id
    var self = this
    var userlist = self.data.userlist
    userlist.splice(id, 1)
    self.setData({
      userlist: userlist
    })
    wx.setStorageSync('userlist', userlist)
  },
  toDetail(event) {
    var id = parseInt(event.target.dataset.xz) + 1
    var name = event.target.dataset.name
    wx.navigateTo({
      url: '../detail/detail?id=' + id + '&name=' + name
    })
  }
})
