<template>
	<view class="scan">
       <van-button round type="info" icon="scan"  class="scanclick" @click="clickRequest"></van-button>
     </view>
</template>

<script>
	export default {
		data () {
			return {
				task: ''
			}
		},
		methods: {
			onLoad() {
			            // 进入这个页面的时候创建websocket连接【整个页面随时使用】
			            this.connectSocketInit();
			        },
			connectSocketInit() {
			                // 创建一个this.socketTask对象【发送、接收、关闭socket都由这个对象操作】
			                this.socketTask = uni.connectSocket({
			                    // 【非常重要】必须确保你的服务器是成功的,如果是手机测试千万别使用ws://127.0.0.1:9099【特别容易犯的错误】
			                    url: "wss://beta.cytingchechang.com/ws/INOUTLISTEN",
			                    success(data) {
			                        console.log("websocket连接成功");
			                    },
			                });
			 
			                // 消息的发送和接收必须在正常连接打开中,才能发送或接收【否则会失败】
			                this.socketTask.onOpen((res) => {
			                    console.log("WebSocket连接正常打开中...！");
			                    this.is_open_socket = true;
			                    // 注：只有连接正常打开中 ，才能正常成功发送消息
			                    this.socketTask.send({
			                        data: "11111",
			                        async success() {
			                            console.log("消息发送成功");
			                        },
			                    });
			                    // 注：只有连接正常打开中 ，才能正常收到消息
			                    this.socketTask.onMessage((res) => {
			                        console.log("收到服务器内容：" + res.data);
			                    });
			                })
			                // 这里仅是事件监听【如果socket关闭了会执行】
			                this.socketTask.onClose(() => {
			                    console.log("已经被关闭了")
			                })
			            },
			            // 关闭websocket【离开这个页面的时候执行关闭】
			            closeSocket() {
			                this.socketTask.close({
			                    success(res) {
			                        this.is_open_socket = false;
			                        console.log("关闭成功", res)
			                    },
			                    fail(err) {
			                        console.log("关闭失败", err)
			                    }
			                })
			            },
			            clickRequest() {
			                if (this.is_open_socket) {
			                    // websocket的服务器的原理是:发送一次消息,同时返回一组数据【否则服务器会进去死循环崩溃】
			                    this.socketTask.send({
			                        data: "11111",
			                        async success() {
			                            console.log("消息发送成功");
			                        },
			                    });
			                }
			            },
		  connectSocketInit1() {
		  			// 创建一个this.socketTask对象【发送、接收、关闭socket都由这个对象操作】
		  			this.task = uni.connectSocket({
		  				// 【非常重要】必须确保你的服务器是成功的,如果是手机测试千万别使用ws://127.0.0.1:9099【特别容易犯的错误】
		  				// url: 'wss://'+this.$api.sellerWebsocket+'/'+this.userinfo.id,
		  				url: 'wss://beta.cytingchechang.com/ws/AIINOUTPUSH',
		  				success(data) {
		  					console.log("websocket连接成功");
							console.log(data)
		  				},
		  			});
		  			// 消息的发送和接收必须在正常连接打开中,才能发送或接收【否则会失败】
		  			uni.onSocketOpen(function(res) {
		  				console.log('WebSocket连接已打开！');
		  			});
		  			uni.onSocketMessage(function(res) {
		  				console.log('收到服务器内容：' + res.data);
		  				// 语音播放 start
		  				// const innerAudioContext = uni.createInnerAudioContext();
		  				// innerAudioContext.autoplay = true;
		  				// innerAudioContext.src = 'https://wzs1.oss-cn-beijing.aliyuncs.com/music.mp3';
		  				// innerAudioContext.onPlay(() => {
		  				// 	console.log('开始播放');
		  				// });
		  				// innerAudioContext.onError((res) => {
		  				// 	console.log(res.errMsg);
		  				// 	console.log(res.errCode);
		  				// });
		  				//语音播放 end
		  
		  			});
		  			// 这里仅是事件监听【如果socket关闭了会执行】
		  			uni.onSocketClose(function(res) {
		  				console.log('WebSocket 已关闭！');
		  			});
		  		},
		  		// 关闭websocket【必须在实例销毁之前关闭,否则会是underfined错误】
		  	beforeDestroy() {
		  		this.closeSocket();
		  	},
		  	// 关闭websocket【离开这个页面的时候执行关闭】
		  		closeSocket() {
		  			this.socketTask.close({
		  				success(res) {
		  					this.is_open_socket = false;
		  					console.log("关闭成功", res)
		  				},
		  				fail(err) {
		  					console.log("关闭失败", err)
		  				}
		  			})
		  		}
	    }
	}
</script>

<style>
	.scan, .scanclick{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
		justify-content: center;
	}
	.scanclick button{
		width: 300rpx;
		margin-top: 200rpx;
		height: 300rpx;
	}
	.scanclick .van-icon{
		font-size: 120rpx !important;
	}
	.scan .tit{
		width: 100%;
		color: #909399;
		font-size: 32rpx;
		text-align: center;
		margin: 40rpx 0;
	}
</style>
