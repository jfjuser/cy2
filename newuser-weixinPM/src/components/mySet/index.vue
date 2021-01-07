<template>
  <div class="my-div">
    <div style="position: relative;">
      <div class="tabSetDiv">
        <img
          :src="wxInfo.headImgUrl"
          width="50"
          v-if="wxInfo.openid !== ''"
          style="border-radius:50%;width:75px;height:75px;margin:2.5rem 0 0 1rem;position:relative"
        />
        <!-- wxInfo.headimgurl @/assets/123.jpg -->
        <span
          style="color:#fff;font-size: 16px;position:absolute;top:4rem;left:7rem"
          v-if="wxInfo.openid !== ''"
          >{{ wxInfo.nickName }}</span
        >
        <!-- <span><img src="@/assets/set(2).png" width="25" style="position:absolute;top:2.6rem;left:85%"/></span> -->
        <span
          v-if="wxInfo.openid !== ''"
          style="color:#fff;position:absolute;top:6rem;left:7rem;font-size:0.9rem"
          >{{ wxInfo.country + " " + wxInfo.city }}</span
        >
        <!-- <div class="big-content">
              <div class="small-content" style="text-align:center">
                <div style="width:70px;margin-top:18px">本月出勤</div>
                <div style="width:70px"><span style="font-weight:bold;font-size:16px">24</span>天</div>
              </div>
        </div>-->
      </div>
      <div class="card">
        <Grid :border="false" :column-num="3">
          <GridItem @click="checkStatus">
            <img style="width:50px;height:50px" src="@/assets/add.png" />
            <span class="spanful">考勤组</span>
          </GridItem>
          <GridItem @click="applyFor">
            <img style="width:50px;height:50px" src="@/assets/apply.png" />
            <span class="spanful">考勤申请</span>
          </GridItem>
          <GridItem @click="toInfo">
            <img style="width:50px;height:50px" src="@/assets/message.png" />
            <span class="spanful">通知信息</span>
          </GridItem>
        </Grid>
      </div>

      <CellGroup class="cell">
        <Cell title="个人资料" is-link icon="manager-o" @click="toMine" />
        <!-- <Cell title="意见反馈" is-link @click="feedback"></Cell> -->
        <!-- <Cell title="申请退出公司" is-link icon="info-o" @click="logout"></Cell> -->
        <Cell title="添加新公司" is-link icon="info-o" @click="addNewCompany"></Cell>
      </CellGroup>
      <!-- 退出理由 -->
      <van-dialog
        v-model="isShowLogoutMsg"
        title="退出理由"
        :before-close="userOut"
        show-confirm-button
        show-cancel-button
      >
        <van-field
          v-model.trim="logoutMsg"
          :error-message="logoutErr"
          placeholder="请输入退出理由..."
        />
      </van-dialog>
      <!-- <Popup v-model="isCom"
             position="top"
             style="width:100vw">
        <Button size="large"
                @click="queCom(item)"
                v-for="(item, index) in companyArr"
                :key="index">{{ item.departmentName }}</Button>
        <Button style="color:#3399cc"
                size="large">加入新公司</Button>
      </Popup> -->
    </div>
    <Popup v-model="show" position="top">
      <Cell-group>
        <Cell title="考勤组" :value="groupStatus.groupName" />
        <Cell title="状态" :value="typeFormatter(groupStatus.status)" />
      </Cell-group>
      <Tag style="margin:1rem" mark type="primary" @click.native="goInto"
        >重选考勤组</Tag
      >
    </Popup>
    <tabbar :param="2"></tabbar>
  </div>
</template>
<script src="http://res.wx.qq.com/open/js/jweixin-1.4.0.js"></script>
<script>
import wx from "weixin-js-sdk";
import tabbar from "@/components/tabbar";
import {
  NoticeBar,
  Button,
  Popup,
  Dialog,
  Tag,
  Cell,
  Icon,
  CellGroup,
  Grid,
  Loading,
  GridItem
} from "vant";
import { httpGet, httpPost, httpPut } from "@/utils/restful";
import {
  changeCompany,
  addGroupStatus,
  sweep,
  attendApply,
  requestLogout
} from "@/api/url";
import isOS from "@/utils/isOS";
import { mapGetters, mapActions } from "vuex"; // 引入vuex辅助函数
export default {
  name: "mySet",
  data() {
    return {
      isShowLogoutMsg: false,
      logoutMsg: "",
      logoutErr: "",
      isCom: false,
      companyArr: [],
      isNotice: false,
      show: false,
      groupStatus: {
        groupName: "",
        status: undefined
      },
      default_wxInfo: {
        // 默认值
        city: "",
        country: "",
        headImgUrl: "",
        language: "",
        nickname: "",
        province: "",
        openid: "",
        sex: "", // 1为男
        privilege: []
      }
    };
  },
  components: {
    tabbar,
    Button,
    NoticeBar,
    Cell,
    Icon,
    CellGroup,
    Grid,
    GridItem,
    Loading,
    Popup,
    Tag
  },
  mounted() {},
  mounted() {},
  created() {
    // 检测当前账户是否有加入考勤组
    if (!this.userId) {
      Dialog.alert({
        title: "官方提示",
        message: "为保证其他功能的正常使用，请先完善资料加入考勤组"
      }).then(() => {
        this.$router.replace("/addInfo");
        return;
      });
    } else {
      // 请求获取考勤组信息
      httpGet(attendApply + "/" + this.userId)
        .then(res => {
          if (res.data.rows.length === 0) {
            this.isNotice = false;
          } else {
            this.isNotice = true;
          }
        })
        .catch(() => {});
    }
  },
  computed: {
    ...mapGetters("user", ["wxInfo", "userId", "active"])
  },
  methods: {
    ...mapActions("user", [
      "SaveActive",
      "SaveUserInfo",
      "SaveUserId",
      "LogGout"
    ]),
    // 添加新公司
    addNewCompany () {
      Dialog.confirm({
      title: '提示',
      message: '确定添加新公司吗？会退出当前账号',
    })
      .then(() => {
        // on confirm
        this.SaveUserId('')// 存储信息
        this.SaveUserInfo('')//
        this.SaveActive(0).then(() => {
          this.$router.replace('/addInfo/?tid=1')
        })
      })
      .catch(() => {
        // on cancel
      });
    },
    goInto() {
      Dialog.confirm({
        title: "温馨提示",
        message: "确定更新当前考勤组重新选择？"
      })
        .then(() => {
          this.$router.replace("/addAttend/");
        })
        .catch(() => {});
    },
    // 确定切换公司
    queCom(item) {
      let userId = item.user.id;
      httpGet(addGroupStatus, {
        userId: userId
      })
        .then(res => {
          console.log("确定切换公司", res);

          let form = {
            userName: item.user.userName,
            phone: item.user.phone,
            companyName: item.departmentName,
            depName: item.user.dutyCompanyName
          };
          this.SaveUserInfo(form); // 存储用户信息
          this.SaveUserId(userId); // 存储用户ID
          if (res.data && res.data.status !== undefined) {
            let status = res.data.status;
            switch (status) {
              case 0: //审核中
                this.SaveActive(2);
                this.$router.replace("/addInfo/");
                break;
              case 1: // 成功
                this.SaveActive(3);
                this.$router.replace("/addInfo/");
                break;
              case 2: //失败
                this.SaveActive(1);
                this.$router.replace("/addInfo/");
                break;
              case 3: // 未加入考勤组
                this.SaveActive(1).then(() => {
                  Dialog.alert({
                    // 如果当前用户没有加入考勤组，让其去加入
                    message: "在该公司还未加入考勤组，请尽快申请加入"
                  })
                    .then(() => {
                      this.$router.replace("/addInfo/");
                    })
                    .catch(() => {});
                });
                break;
            }
          }
        })
        .catch(() => {});
    },
    // 查看考勤组状态
    checkStatus() {
      if (this.active < 2) {
        Dialog.alert({
          message: "请完善个人资料并加入考勤组"
        }).then(() => {});
      } else {
        this.show = true;
        // let userId = localStorage.getItem('userid')
        httpGet(addGroupStatus, {
          userId: this.userId
        })
          .then(res => {
            console.log("请完善个人资料", res);
            if (res.data !== null) {
              this.groupStatus = res.data;
            }
          })
          .catch(() => {});
      }
    },
    typeFormatter(num) {
      if (num === 0) return "审核中";
      if (num === 1) return "审核通过";
      if (num === 2) return "审核不通过";
    },
    feedback() {
      // this.$router.replace('/feedback/')
    },
    toInfo() {
      this.$router.replace("/message/");
    },
    applyFor() {
      if (this.active === 3) {
        this.$router.replace("/attendance/");
      } else {
        Dialog.alert({
          message: "加入考勤组后才可使用该功能哦"
        }).then(() => {});
      }
    },
    toMine() {
      this.$router.replace("/mine/");
    },
    // 退出
    userOut(actions, done) {
      if (actions === "confirm") {
        if (this.logoutMsg === "") {
          this.logoutErr = "退出理由不可为空！";
          done(false);
          return;
        } else {
          let openId = this.wxInfo.unicode;
          let appId = this.wxInfo.account;
          let userId = this.userId;
          //  "wx023544aa74a35288"
          //  退出当前绑定的公司状态
          const logLoading = this.$toast.loading({
            mask: true,
            message: "正在申请...",
            position: "bottom",
            duration: 0
          });
          let logMsgs = {
            id: userId,
            remarks: this.logoutMsg
          }
          httpPost(`${requestLogout}`,logMsgs)
            .then(res => {
              console.log("请求申请退出公司成功....", res);
              if (res && res.code === 1) {
                // 重置本地初始数据信息
                // this.logout().then(()=>{
                // })
                this.$dialog.alert({
                  title: "官方提示",
                  message: "申请成功！",
                  messageAlign: "center",
                  showCancelButton: false
                })
                logLoading.clear();
                done();
                this.logoutMsg = ''
              } else {
                this.$dialog.alert({
                  title: "官方提示",
                  message: "申请失败, 服务器没有响应！",
                  messageAlign: "center",
                  showCancelButton: false
                });
                logLoading.clear();
                done();
                this.logoutMsg = ''
              }
            })
            .catch(err => {
              this.$dialog.alert({
                title: "官方提示",
                message: err.message,
                messageAlign: "center",
                showCancelButton: false
              });
              logLoading.clear();
               done();
               this.logoutMsg = ''
            });
        }
      }else{
        done()
      }
    },
    // 退出当前所在公司，切换别的公司
    logout() {
      if (this.userId !== undefined) {
        Dialog.confirm({
          title: "官方提示",
          message: "客官！是否确定申请退出公司？"
        })
          .then(() => {
            this.isShowLogoutMsg = true;
          })
          .catch(() => {});
      } else {
        Dialog.confirm({
          title: "提示",
          message: "你当前没有进入公司考勤组，请前往添加！"
        })
          .then(() => {
            this.$router.replace("/addInfo/");
          })
          .catch(() => {});
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.tabSetDiv {
  background: #3366FF;
  background-size: 100%;
  height: 100vh;
  height: 10rem;
  width: 100vw;
  background-repeat: no-repeat;
}
.spanful {
  line-height: 2rem;
  font-size: 14px;
  color: rgb(139, 139, 139);
}
.cell {
  margin-top: 5vh;
}
.card {
  width: 92vw;
  border-radius: 15%;
  box-shadow: 0 0 12px #ccc;
  margin-left: 4vw;
  // position:absolute;
  // top:4rem;
  margin-top: -2rem;
  height: 7rem;
  background: #fff;
}
.big-content {
  position: absolute;
  right: 2.5rem;
  top: 2.2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  background-color: rgb(79, 130, 246);
  width: 95px;
  height: 95px;
  // box-shadow: 0 0 12px #fff;
}
.small-content {
  border-radius: 50%;
  margin: 0 auto;
  font-size: 13px;
  color: #fff;
  background-color: rgb(93, 135, 248);
  width: 70px;
  // box-shadow:0 0 12px #fff;
  height: 70px;
}
</style>
<style scoped>
.cell >>> .van-icon-info-o,
.van-icon-manager-o,
.van-icon-scan:before {
  color: #1199ee;
}
</style>
