// pages/QRCode/QRCode.js
var util = require('../../utils/util.js');
var qrCode = require('../../utils/qrcode.js');
var App = getApp();
Page({
    /**
     * 页面的初始数据
     */

	data: {
		hidden: false,
		text: '向车主展示优惠券二维码',
		select: '',
		user: {},
        type_id: '',
		chars1: [
			{ "id": "1", "name": "京" },
			{ "id": "2", "name": "沪" },
			{ "id": "3", "name": "浙" },
			{ "id": "4", "name": "粤" },
			{ "id": "5", "name": "苏" },
			{ "id": "6", "name": "鲁" },
			{ "id": "7", "name": "晋" },
			{ "id": "34", "name": "吉" },
			{ "id": "8", "name": "冀" },
			{ "id": "9", "name": "豫" },
		],
		chars2: [
			{ "id": "10", "name": "川" },
			{ "id": "11", "name": "渝" },
			{ "id": "12", "name": "辽" },
			{ "id": "13", "name": "黑" },
			{ "id": "14", "name": "皖" },
			{ "id": "15", "name": "鄂" },
			{ "id": "16", "name": "湘" },
			{ "id": "17", "name": "赣" },
			{ "id": "18", "name": "闽" },
		],
		chars3: [
			{ "id": "19", "name": "陕" },
			{ "id": "20", "name": "甘" },
			{ "id": "21", "name": "宁" },
			{ "id": "22", "name": "蒙" },
			{ "id": "23", "name": "津" },
			{ "id": "26", "name": "桂" },
			{ "id": "25", "name": "云" },
			{ "id": "24", "name": "贵" },
		],
		chars4: [
			{ "id": "27", "name": "琼" },
			{ "id": "28", "name": "青" },
			{ "id": "29", "name": "新" },
			{ "id": "30", "name": "藏" },
			{ "id": "31", "name": "使" },
		],
		numbers: [
			{ "id": "100", "name": "0" },
			{ "id": "101", "name": "1" },
			{ "id": "102", "name": "2" },
			{ "id": "103", "name": "3" },
			{ "id": "104", "name": "4" },
			{ "id": "105", "name": "5" },
			{ "id": "106", "name": "6" },
			{ "id": "107", "name": "7" },
			{ "id": "108", "name": "8" },
			{ "id": "109", "name": "9" },
		],
		letters1: [
			{ "id": "50", "name": "A" },
			{ "id": "51", "name": "B" },
			{ "id": "52", "name": "C" },
			{ "id": "53", "name": "D" },
			{ "id": "54", "name": "E" },
			{ "id": "55", "name": "F" },
			{ "id": "56", "name": "G" },
			{ "id": "57", "name": "H" },
			{ "id": "58", "name": "J" },
			{ "id": "59", "name": "K" },
		],
		letters2: [
			{ "id": "60", "name": "L" },
			{ "id": "61", "name": "M" },
			{ "id": "62", "name": "N" },
			{ "id": "63", "name": "P" },
			{ "id": "64", "name": "Q" },
			{ "id": "65", "name": "R" },
			{ "id": "66", "name": "S" },
			{ "id": "67", "name": "T" },
			{ "id": "68", "name": "U" },
			{ "id": "69", "name": "V" },
		],
		letters3: [
			{ "id": "74", "name": "港" },
			{ "id": "75", "name": "澳" },
			{ "id": "70", "name": "W" },
			{ "id": "71", "name": "X" },
			{ "id": "72", "name": "Y" },
			{ "id": "73", "name": "Z" },
			{ "id": "76", "name": "学" },
			{ "id": "77", "name": "领" },
			{ "id": "78", "name": "警" },
			{ "id": "99", "name": "DEL" },
		],
		showChar: true,
		showLetter: false,
		falg: true,
		carNum: '',
		carNumLength: 7,
		disabled: true,
        openSocket:false,
        inset: false,
        move: false,
        quiet: false,
        sigle: false
	},
	onShow: function () {
		let self = this
		wx.getStorage({
			key: 'user',
			success: function (res) {
				let data = res.data
				self.setData({
					user: res.data,
					hidden: true
				})
                self.getPermission(res.data)
			},
			fail: function (err) {
				wx.showToast({
					title: '获取信息失败，请查看网络',
					icon: 'none',
					duration: 2000
				})
			}
		})
	},
	onLoad:function(option){
		let self = this
		wx.getStorage({
			key: 'type_id',
			success: function (res) {
				let data = res.data
				self.setData({
                    type_id: res.data.type_id,
					hidden: true
				})
			},
			fail: function (err) {
				wx.showToast({
					title: '获取信息失败，请查看网络',
					icon: 'none',
					duration: 2000
				})
			}
		})
        if (this.move || this.quiet || this.sigle) {
            // 页面初始化 options为页面跳转所带来的参数
            var size = this.setCanvasSize();//动态设置画布大小
            var initUrl = '请选择二维码方式';
            this.createQrCode(initUrl, "mycanvas", size.w, size.h);
        }
	},
	//适配不同屏幕大小的canvas
	setCanvasSize: function () {
		let size = {};
		try {
			var res = wx.getSystemInfoSync();
			var scale = 750 / 686;//不同屏幕下canvas的适配比例；设计稿是750宽
			var width = res.windowWidth / scale;
			var height = width;//canvas画布为正方形
			size.w = width;
			size.h = height;
		} catch (e) {
			// Do something when catch error
			wx.showToast({
				title: '获取设备信息失败',
				icon: 'none',
				duration: 3000
			})
		}
		return size;
	},
    // 获取页面二维码权限
    getPermission: function (data) {
        let self = this
        let departmentId = data.departmentId
        let cookie = data.token
        wx.request({
            url: App.globalData.host + '/os/v1/shop/powerlist/' + departmentId,
            method: 'GET',
            header: {
                'content-type': 'application/json; charset=utf-8',
                'AdminToken': cookie
            },
            success: function (res) {
                var result = res.data;
                if (result.code == 1 && result.data.length > 0) {
                    self.setData({
                        inset: self.isTicketPer(['车牌输入'], result.data),
                        move: self.isTicketPer(['动态二维码'], result.data),
                        quiet: self.isTicketPer(['静态二维码'], result.data),
                        sigle: self.isTicketPer(['单次扫'], result.data)
                    })
                    if (!self.data.openSocket) {
                        self.moveQrCode()
                    }
                    if (self.isTicketPer(['单次扫'], result.data)) {
                        self.sigleUse()
                    } else if (self.isTicketPer(['静态二维码'], result.data)) {
                        self.quietQrCode()
                    } else if (self.isTicketPer(['动态二维码'], result.data)) {
                        setTimeout(() => {
                            self.clickMove()
                        }, 2000)
                    } else if (self.isTicketPer(['车牌输入'], result.data)) {
                        self.insetPlate()
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: '暂无权限，请先让车场进行分配',
                            showCancel: false,
                            success: function () {
                                wx.redirectTo({
                                    url: '/pages/tickets/tickets',
                                })
                            },
                        })
                    }
                } else {
                    wx.showToast({
                        title: result.message,
                        icon: 'none',
                        duration: 3000
                    })
                }
            },
            fail: function (ee) {
                wx.showToast({
                    title: '获取失败',
                    icon: 'none',
                    duration: 3000
                })
            }
        })
    },
    // 权限
    isTicketPer: function (arraySome, array) {
        let permission = array
        if (permission && permission instanceof Array && permission.length > 0) {
            const hasPermission = permission.some(role => {
                return arraySome.includes(role)
            })
            return hasPermission
        } else {
            return false
        }
    },
	createQrCode: function (url, canvasId, cavW, cavH) {
		//调用插件中的draw方法，绘制二维码图片
		qrCode.api.draw(url, canvasId, cavW, cavH);
		this.canvasToTempImage();
	},
	//获取临时缓存照片路径，存入data中
	canvasToTempImage: function () {
		let that = this;
		wx.canvasToTempFilePath({
			canvasId: 'mycanvas',
			success: function (res) {
				let tempFilePath = res.tempFilePath;
				that.setData({
					imagePath: tempFilePath,
					showImage: true
				});
			},
			fail: function (res) {
				wx.showToast({
					title: '获取失败',
					icon: 'none',
					duration: 3000
				})
			}
		});
	},
	//点击图片进行预览，长按保存分享图片
	previewImg: function (e) {
		let img = this.data.imagePath;
		wx.previewImage({
			current: img, // 当前显示图片的http链接
			urls: [img] // 需要预览的图片http链接列表
		})
	},
	quietQrCode: function () {
		let self = this;
		self.setData({
			select: 0,
			showQrcode: true
		});
        let type_id = self.data.type_id;
        let cookie = self.data.user.token
		wx.request({
            url: App.globalData.host + '/os/v1/ticket/ercode/static/' + type_id,
            method: 'GET',
            header: {
                'content-type': 'application/json; charset=utf-8',
                'AdminToken': cookie
            },
			success: function (res) {
				var result = res.data;
				if (result.code == 1) {
					wx.showToast({
						title: '生成中...',
						icon: 'loading',
					});
					var st = setTimeout(function () {
						let size = self.setCanvasSize();
						//绘制二维码
                        self.createQrCode(result.data.ercode, "mycanvas", size.w, size.h);
						wx.hideToast();
						clearTimeout(st);
					}, 2000);
				} else {
					wx.showToast({
						title: result.message,
						icon: 'none',
						duration: 3000
					})
				}
			},
			fail: function (err) {
				wx.showToast({
					title: '获取失败',
					icon: 'none',
					duration: 3000
				})
			}
		})
	},
	moveQrCode: function () {
		let self = this;
		let type_id = self.data.type_id;
        let cookie = self.data.user.token
		wx.connectSocket({
			url: App.globalData.websocket + type_id,//链接地址
		})
		wx.onSocketOpen(res => {
			self.data.openSocket = true
		})
		// 获取二维码地址
		wx.onSocketMessage(function (data) {
			let res = JSON.parse(data.data)
			wx.hideLoading()
			let size = self.setCanvasSize();
			//绘制二维码
			self.createQrCode(res.ercode, "mycanvas", size.w, size.h);
		})
		//连接失败
		wx.onSocketError(function () {
			self.data.openSocket = false
		});
		wx.onSocketClose(res => {
            self.data.openSocket = false
		})
	},
    clickMove: function () {
        let self = this;
        self.setData({
            select: 1,
            showQrcode: true
        })
        let type_id = self.data.type_id;
        let cookie = self.data.user.token
        wx.request({
            url: App.globalData.host + '/os/v1/ticket/ercode/move/' + type_id,
            method: 'GET',
            header: {
                'content-type': 'application/json; charset=utf-8',
                'AdminToken': cookie
            },
            success: function (res) {
                var result = res.data;
                if (result.code == 1) {
                    wx.showToast({
                        title: '获取中...',
                        icon: 'loading'
                    })
                } else {
                    wx.showToast({
                        title: result.message,
                        icon: 'none',
                        duration: 3000
                    })
                }
            },
            fail: function (err) {
                wx.showToast({
                    title: '获取失败',
                    icon: 'none',
                    duration: 3000
                })
            }
        })
    },
	onHide: function () {
		//关闭websocket
		if (this.data.openSocket) {
            wx.closeSocket()
		}
	},
	onUnload: function () {
        let self = this;
		//关闭websocket
        if (self.data.openSocket) {
            wx.closeSocket({
                success: function (res) {
                    console.log('WebSocket 已关闭！');
                    self.data.openSocket = false
                },
                fail: function (res) {
                    console.log('WebSocket 未关闭！')
                }
            })
			
		}
	},
	// 车牌输入
	insetPlate: function () {
		let self = this;
		self.setData({
			select: 2,
			showQrcode: false,
			flag: true
		});
	},
	// 点击汽油车
	gasCar() {
		let self = this;
		self.setData({
			flag: true,
			carNum: '',
			carNumLength: 7,
			showChar: true,
			showLetter: false,
		});
	},
	// 点击新能源车
	newCar() {
		let self = this;
		self.setData({
			flag: false,
			carNum: '',
			carNumLength: 8,
			showChar: true,
			showLetter: false,
		});
	},
	// 键盘的点击事件
	handleClick(e) {
		let self = this
		// 删除按钮
		if (e.target.dataset.name == 'DEL') {
			let val = self.data.carNum
			self.setData({
				carNum: val.substr(0, val.length - 1)
			})
			if (self.data.carNum.length == 0) {
				self.setData({
					showChar: true,
					showLetter: false,
				})
			}
		} else if (self.data.carNum.length >= self.data.carNumLength) {
			wx.showToast({
				title: '汽油车长度为7,新能源汽车长度为8',
				duration: 3000,
				icon: 'none'
			})
		} else if (self.data.carNum == '') {
			self.setData({
				carNum: e.target.dataset.name,
				showChar: false,
				showLetter: true,
			})
		} else {
			// 不是第一位的时候
			let carNum = self.data.carNum + e.target.dataset.name
			self.setData({
				carNum: carNum
			})
			// 判断长度是否对等
			if (carNum.length == self.data.carNumLength) {
				self.setData({
					disabled: false
				})
			} else {
				self.setData({
					disabled: true
				})
			}
		}
	},
	// 绑定车牌
	bindPlate() {
		let self = this;
		let plate = self.data.carNum
		// 验证第二位是否为英文字母
		let Eng = plate.slice(1, 2)
		if (!Eng.match(/^[A-Z0]{1}$/)) {
			wx.showToast({
				title: '车牌第二位应为英文字母或者字母0',
				icon: 'none',
				duration: 2000
			})
		} else {
			let code = self.data.type_id;
            let cookie = self.data.user.token
			let data_ = { 
                "code": code, 
                "plate": plate, 
                "type": 'INPUT' 
            };
			wx.request({
                url: App.globalData.host + '/os/pv/v1/ticket/bingding',
				method: 'POST',
				data: data_,
                header: {
                    'content-type': 'application/json; charset=utf-8',
                    'AdminToken': cookie
                },
				success: function (res) {
					var result = res.data;
					if (result.code == 1) {
						wx.showToast({
							title: result.message,
							icon: 'none',
							duration: 3000
						})
					} else {
						wx.showToast({
							title: result.message,
							icon: 'none',
							duration: 3000
						})
					}
				},
				fail: function (err) {
					wx.showToast({
						title: '添加失败，请查看网络',
						icon: 'none',
						duration: 3000
					})
				}
			})
		}
	},
	// 单次扫码
	sigleUse() {
		let self = this;
		self.setData({
			select: 3,
			showQrcode: true
		});
		let type_id = self.data.type_id;
        let cookie = self.data.user.token
		wx.request({
            url: App.globalData.host + '/os/v1/ticket/ercode/one/' + type_id,
            method: 'GET',
            header: {
                'content-type': 'application/json; charset=utf-8',
                'AdminToken': cookie
            },
			success: function (res) {
				var result = res.data;
				if (result.code == 1) {
					wx.showToast({
						title: '生成中...',
						icon: 'loading',
					});
					var st = setTimeout(function () {
						let size = self.setCanvasSize();
						//绘制二维码
						self.createQrCode(result.data.ercode, "mycanvas", size.w, size.h);
						wx.hideToast()
						clearTimeout(st);
					}, 2000)
				} else {
					wx.showToast({
						title: result.message,
						icon: 'none',
						duration: 3000
					})
				}
			},
			fail: function (err) {
				wx.showToast({
					title: '获取失败',
					icon: 'none',
					duration: 3000
				})
			}
		})
	}
});