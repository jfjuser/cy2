// pages/suggestion/suggestion.js
var App = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        user: {},
        images: [
        ],
        uuid: '',
        loading: false
    },
    chooseImg: function () {
        var that = this
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                var tempFilePaths = res.tempFilePaths
                wx.showToast({
                    title: '正在上传...',
                    icon: 'loading',
                    mask: true
                })
                wx.uploadFile({
                    url: App.globalData.host + '/v1/suggestionImg',
                    filePath: tempFilePaths[0],
                    name: 'img',
                    header: {
                        'content-type': 'multipart/form-data',
                        'AdminToken': that.data.user.token
                    },
                    success: function(res){
                        var data = JSON.parse(res.data)
                        if (data.code === 1) {
                            if (that.data.uuid === '') {
                                that.data.uuid += data.data
                            } else {
                                that.data.uuid += ',' + data.data
                            }
                            let images = that.data.images
                            images.push(tempFilePaths[0])
                            that.setData({
                                images: images
                            })
                            wx.hideToast()
                        } else {
                            wx.hideToast()
                            wx.showModal({
                                title: '错误提示',
                                content: '上传图片失败',
                                showCancel: false,
                                success: function (res) { }
                            })
                        }
                    },
                    fail: function() {
                        wx.hideToast()
                        wx.showModal({
                            title: '错误提示',
                            content: '上传图片失败',
                            showCancel: false,
                            success: function (res) { }
                        })  
                    }
                })
            }
        })
    },
    formSubmit: function (e) {
        let that = this
        let obj = e.detail.value
        if (obj.phone === ''){
            wx.showToast({
                title: '手机号不可为空',
                icon: 'none',
                mask: true,
                duration: 4000
            })
        } else if (obj.suggestionSelect === '') {
            wx.showToast({
                title: '反馈类别不可为空',
                icon: 'none',
                mask: true,
                duration: 4000
            })
        } else if (obj.suggestionContant === '') {
            wx.showToast({
                title: '反馈内容不可为空',
                icon: 'none',
                mask: true,
                duration: 4000
            })
        } else if (that.data.images.length < 1) {
            wx.showToast({
                title: '图片不可为空',
                icon: 'none',
                mask: true,
                duration: 4000
            })
        } else {
            wx.showLoading({
                title: '提交中...',
            })
            let data = Object.assign(obj, {
                uuid: that.data.uuid,
                kind: 0,
                type: 3
            })
            wx.request({
                url: App.globalData.host + '/v1/suggestion',
                method: 'POST',
                header: {
                    'content-type': 'application/json; charset=utf-8',
                    'AdminToken': that.data.user.token
                },
                data: data,
                success: function(res) {
                    wx.hideLoading()
                    let data = res.data
                    if (data.code === 1) {
                        wx.showToast({
                            title: data.message,
                            icon: 'success',
                            success: function () {
                                setTimeout(() => {
                                    wx.switchTab({
                                        url: '/pages/me/me'
                                    })  
                                }, 3000)
                            }
                        })
                    } else {
                        wx.showToast({
                            title: data.message,
                            icon: 'none',
                            duration: 2000
                        })
                    }
                },
                fail: function(err) {
                    wx.hideLoading()
                    wx.showModal({
                        title: '错误提示',
                        content: '提交失败',
                        showCancel: false,
                        success: function (res) { }
                    })  
                }
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let that = this
        wx.getStorage({
            key: 'user',
            success: function(res) {
                that.setData({
                    user: res.data
                })
            },
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})