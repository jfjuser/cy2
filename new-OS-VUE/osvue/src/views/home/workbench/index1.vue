<template>
    <div class="app-container">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="16" :lg="16" class="header line2">
          <el-row :gutter="20" >
            <el-col v-if="themeType === 3 ? false : true" :span="12">
              <div class="left box-shadow">
                <div class="info flex-center">
                  <div class="text-center underline" @click="goAgentHome" title="点击前往会员">
                    <span style="padding-bottom: 5px;">积分</span>
                    <p><count-to class="num" :endVal="integralNum" :duration="1500"></count-to></p>
                  </div>
                  <!-- <el-button type="primary" size="medium">签到</el-button> -->
                  <el-button type="primary" @click="goMessage" style="margin-left: 6%" title="我的建议">反馈</el-button>
                  </div>
                <div class="ricon flex-center"><img src="@/assets/workbench/integral.png"></div>
              </div>
            </el-col>
            <el-col v-if="themeType === 3 ? false : true" :span="12">
              <div class="right text-center box-shadow">
                <div class="info flex-center">
                  <div>
                    应用楼栋数
                    <p><count-to class="num" :endVal="buildingNums.buildingNum" :duration="1500"></count-to></p>
                  </div>
                  <div class="underline" @click="goAreaManage">
                    <span style="padding-bottom: 5px;">房屋模板数</span>
                    <p><count-to class="num" :endVal="buildingNums.buildingTemplateNum" :duration="1500"></count-to></p>
                  </div>
                </div>
                <div class="ricon flex-center"><img src="@/assets/workbench/building.png"></div>
              </div>
            </el-col>
            <el-col :span="24" class="main line1" v-if="themeType === 3 ? false : true">
              <el-carousel :interval="4000" type="card" height="300px">
                <el-carousel-item v-for="(item, i) in imgList" :key="i">
                  <img :src="item.img"/>
                </el-carousel-item>
              </el-carousel>
            </el-col>
            <el-col :span="24" class="main">
              <section class="record">
                <div class="title text-center" v-if="themeType === 3 ? false : true">更多信息</div>
                <div style="width:50vw" class="box box-shadow">
                  <div class="item" @click="goUserData(recordNums.company)">
                    <div class="name flex-center">未审核的{{themeType === 3 ? '家长' : '账户数'}}</div>
                    <div class="count flex-center"><count-to :endVal="recordNums.company" :duration="1500"></count-to></div>
                  </div>
                  <div class="item" @click="goUserManage(userQuery, recordNums.user)">
                    <div class="name flex-center">未审核的{{themeType === 3 ? '学生': '用户数'}}</div>
                    <div class="count flex-center"><count-to :endVal="recordNums.user" :duration="1500"></count-to></div>
                  </div>
                  <div v-if="themeType === 3 ? false : true" class="item" @click="goUserManage(unvisitorsQuery, recordNums.unvisitors)">
                    <div class="name flex-center">未审核的访客数</div>
                    <div class="count flex-center"><count-to :endVal="recordNums.unvisitors" :duration="1500"></count-to></div>
                  </div>
                  <div   v-if="themeType === 3 ? false : true" class="item" @click="goUserManage(visitorsQuery, recordNums.visitors)">
                    <div class="name flex-center">已审核的访客数</div>
                    <div class="count flex-center"><count-to :endVal="recordNums.visitors" :duration="1500"></count-to></div>
                  </div>
                </div>
              </section>
            </el-col>
          </el-row>
        </el-col>
        <el-col :xs="24" :sm="8" :lg="8" class="main">
          <el-row :gutter="20">
            <el-col v-if="themeType === 3 ? false : true" :span="24">
              <section class="letters box-shadow">
                <div class="title">
                  <div>
                    <img src="@/assets/workbench/news.png" class="simg">
                    快报
                  </div>
                </div>
                <ul>
                  <li class="item" v-for="(item, index) in messagelist" :key="index">
                      <div class="text single-line">{{item.title}}</div>
                      <div class="time">{{timeFormatter(item.createAt)}}</div>
                  </li>
                </ul>
                <div class="nulldata" v-if="messagelist.length==0">暂无数据</div>
              </section>
            </el-col>
            <el-col :span="24" class="line1">
              <section class="letters box-shadow notify">
                <div class="title">
                  <div>
                    <img src="@/assets/workbench/news.png" class="simg">
                    {{themeType === 3 ? '' : '物业'}}通知栏
                  </div>
                  <i class="el-icon-plus add" @click="addNotify" title="添加"></i>
                </div>
                <ul>
                  <li class="item-notify" v-for="(item, index) in noticelist" :key="index">
                      <el-popover
                      placement="left-start"
                      width="400"
                      trigger="hover">
                        <template v-for="(detail, i) in item.list">
                          <div :key="i">
                            <div>名称:<span style="color:#909399;">{{detail.name}}</span></div>
                            <div>内容:<span style="color:#909399;">{{detail.text}}</span></div>
                            <p v-if="item.list.length != i+1"></p>
                          </div>
                        </template>
                        <div slot="reference" class="box">
                          <div class="text single-line">{{item.title}}</div>
                          <div class="del" @click.stop="delNotify(item.id)"><i class="el-icon-close" title="删除"></i></div>
                        </div>
                      </el-popover>
                  </li>
                </ul>
                <!-- <div class="pagination text-center">
                  <el-pagination
                    small
                    layout="prev, pager, next"
                    page-size="5"
                    :total="2">
                  </el-pagination>
                </div> -->
                <div class="nulldata" v-if="noticelist.length==0">暂无数据</div>
              </section>
            </el-col>
            <el-col style="margin-top: 120px">
              <section class="note box-shadow">
                <div class="title">
                  <div>
                    <img src="@/assets/workbench/note.png" class="simg">
                    便签
                  </div>
                  <i class="el-icon-plus add" @click="addNote" title="添加"></i>
                </div>
                <div style="overflow: hidden;">
                  <div class="nulldata" v-if="notelist.length==0">请点击右上角添加</div>
                  <transition-group name="el-fade-in" tag="div">
                    <template v-for="(item, index) in notelist">
                        <div class="item" @click="lookNote(item.text, item)" :key="index" :title="item.text">
                            <span class="single-line">{{item.text}}</span>
                            <div class="del" @click.stop="del(item.id)"><i class="el-icon-close" title="删除"></i></div>
                        </div>
                    </template>
                  </transition-group>
                </div>
              </section>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-dialog
        title="便签"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
          <el-input
          type="textarea"
          :rows="6"
          placeholder="请输入内容,内容不能为空(限制200字)"
          autofocus
          :maxlength="maxlength"
          v-model.trim="textarea">
          </el-input>
          <div class="word-limit">{{textareaLength}}/{{maxlength}}</div>
          <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false, textarea = '', addVisible = false, editorVisible = false">取 消</el-button>
              <el-button type="primary" :loading = "createLoading" @click="createNote" v-if="addVisible">创 建</el-button>
              <el-button type="primary" :loading = "updateLoading" @click="editorNote" v-if="editorVisible">保 存</el-button>
          </span>
      </el-dialog>
      <el-dialog
        title="物业通知"
        :visible.sync="dialogVisibleNotify"
        width="40%"
        :before-close="handleClose">
          <el-form ref="NotifyForm" :model="notifyForm" label-width="80px" label-position="left" class="notifyForm">
            <el-form-item
              label="标题"
              prop="title"
              :rules="{
                required: true, message: '标题不能为空', trigger: 'blur'
              }"
            >
              <el-input placeholder="请输入标题(限制8字)" v-model.trim="notifyForm.title" maxlength="8" show-word-limit></el-input>
            </el-form-item>
            <div class="text-right" style="padding-bottom: 10px"><el-button @click="addDetail">新增内容</el-button></div>
            <template v-for="(item, i) in notifyForm.list">
              <el-form-item
                :label="i===0?'名称':`名称${i}`"
                :key="item.key"
                :prop="'list.' + i + '.name'"
                placeholder="请输入名称"
                :rules="{
                  required: true, message: '名称不能为空', trigger: 'blur'
                }"
              >
                <div class="namebox">
                  <el-input v-model.trim="item.name" placeholder="请输入名称"></el-input>
                  <el-button type="danger" plain @click.prevent="removeDetail(item)" v-if="notifyForm.list.length != 1" class="del">删除</el-button>
                </div>
              </el-form-item>
              <el-form-item
                :label="i===0?'内容':`内容${i}`"
                :key="i"
                :prop="'list.' + i + '.text'"
                :rules="{
                  required: true, message: '内容不能为空', trigger: 'blur'
                }"
              >
                <el-input
                  type="textarea"
                  :rows="3"
                  :placeholder="`请输入内容(限制${maxlengthNotify}字)`"
                  :maxlength="maxlengthNotify"
                  show-word-limit
                  v-model.trim="item.text">
                </el-input>
              </el-form-item>
            </template>
          </el-form>
          <el-alert
            title="全体业主将会收到下发的物业通知"
            type="warning"
            :closable="false">
          </el-alert>
          <span slot="footer" class="dialog-footer">
              <el-button type="text" class="fl" @click="dialogVisibleModel = true">查看示例</el-button>
              <el-button @click="cencelNotify">取 消</el-button>
              <el-button type="primary" :loading = "createLoading" @click="createNotify">添 加</el-button>
          </span>
      </el-dialog>
      <el-dialog title="物业通知示例" append-to-body width="30%" :visible.sync="dialogVisibleModel">
        <el-form label-width="80px" label-position="left">
          <el-form-item label="标题" required>
            <el-input disabled value="停电通知"></el-input>
          </el-form-item>
          <el-form-item label="名称" required>
            <el-input disabled value="深圳xxx物业服务中心"></el-input>
          </el-form-item>
          <el-form-item label="内容" required>
            <el-input
            disabled
            type="textarea"
            :rows="3"
            value="由于供电局施工需要，计划在2014年5月20日14:00—18:00进行停电施工，请各住户做好停电前的各项准备工作，防止设备电源线路出现故障。不便之处敬请谅解！"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- <el-dialog
        title="我们的菜单改版啦！"
        :visible.sync="showGuide"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="25%">
        <div>欢迎使用新菜单。</div>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" @click="handleIgnore" :disabled="disabledTip">不再提醒{{timeNum === 0 ? '' : `（${timeNum}）`}}</el-button>
            <guide-button><el-button @click="dialogVisibleGuide = false">下一步</el-button></guide-button>
        </span>
      </el-dialog> -->
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getRecord, getPoint, getMessageIsYUN, getNoteList, updateNoteList, insertNoteList, aiNotify } from '@/api/url'
import { httpGet, httpPut, httpPost, httpDelete } from '@/utils/restful'
import CountTo from 'vue-count-to'
// import GuideButton from '@/components/GuideButton'
import { timeFormatter } from '@/utils/formatter.js'
// import adv1 from '@/assets/face/face-home-adv.jpg'
// import adv2 from '@/assets/face/face-home-adv2.jpg'
// import adv3 from '@/assets/face/face-home-adv3.jpg'
import a from '@/assets/a.jpg'
import b from '@/assets/b.jpg'
import c from '@/assets/c.jpg'

export default {
  components: {
    CountTo
  },
  data () {
    return {
      recordNums: {
        visitors: 0,
        unvisitors: 0,
        company: 0,
        user: 0
      },
      buildingNums: {
        buildingNum: 0,
        buildingTemplateNum: 0
      },
      integralNum: 0,
      timeFormatter: timeFormatter,
      messagelist: [],
      messageLimit: 5,
      // 便签
      notelist: [],
      getNoteLimit: 4,
      dialogVisible: false,
      addVisible: false,
      editorVisible: false,
      createLoading: false,
      updateLoading: false,
      textarea: '',
      itemdata: '',
      maxlength: 200,
      // 跳转参数
      userQuery: {
        is_check: 2,
        type: 0
      },
      unvisitorsQuery: {
        is_check: 2,
        type: 1
      },
      visitorsQuery: {
        is_check: 1,
        type: 1
      },
      imgList: [
        {img: a},
        {img: b},
        {img: c}
      ],
      // 通知
      noticelist: [],
      dialogVisibleNotify: false,
      maxlengthNotify: 80,
      notifyForm: {
        title: '',
        departmentId: this.$store.getters.departmentId,
        list: [{
          name: '',
          text: ''
        }]
      },
      dialogVisibleModel: false,
      dialogVisibleGuide: true,
      timeNum: 3,
      disabledTip: true
    }
  },
  computed: {
    textareaLength () {
      return this.textarea.length || 0
    },
    ...mapGetters([
      'themeType'
    ]),
    version () {
      return this.$store.getters.version
    },
    showGuide () {
      // 是否不再提醒 && 是否人脸平台 && 是否新版本 && 是否显示
      if (!window.localStorage.getItem('firstShowGuideN') && this.$store.getters.type === 1 && this.$store.getters.version === 1 && this.dialogVisibleGuide) {
        this.countdown()
        // 显示新版本帮助
        return true
      } else {
        return false
      }
    }
  },
  mounted () {
    this.getAll()
    this.getMessageIsYUN()
    this.getaiNotify()
    this.getNote()
  },
  methods: {
    // "不再提醒"倒计时
    countdown () {
      if (!this.disabledTip) return
      const timer = window.setInterval(() => {
        this.timeNum--
        if (this.timeNum <= 0) {
          window.clearInterval(timer)
          this.disabledTip = false
        }
      }, 1000)
    },
    // 设置不再提醒
    handleIgnore () {
      window.localStorage.setItem('firstShowGuideN', 1)
      this.dialogVisibleGuide = false
    },
    getAll () {
      let getRecordHttp = httpGet(getRecord + '/' + this.$store.getters.departmentId)
      let data = {departmentId: this.$store.getters.departmentId, type: this.$store.getters.type, unionId: 0}
      let getPointHttp = httpGet(getPoint, data)

      Promise.all([getRecordHttp, getPointHttp]).then(values => {
        let [recordRes, pointRes] = values
        if (recordRes.code === 1) {
          this.recordNums.visitors = recordRes.data.isCheckVisitorNumber || 0
          this.recordNums.unvisitors = recordRes.data.unCheckVisitorNumber || 0
          this.recordNums.company = recordRes.data.unCheckDutyCompanyNumber || 0
          this.recordNums.user = recordRes.data.unCheckAiUserNumber || 0
          this.buildingNums.buildingNum = recordRes.data.buildingNumber || 0
          this.buildingNums.buildingTemplateNum = recordRes.data.buildingTemplateNumber || 0
        }
        // 获取积分
        if (pointRes.code === 1) {
          this.integralNum = pointRes.data.restPoints
        }
      })
    },
    // getRecord () {
    //   httpGet(getRecord + '/' + this.$store.getters.departmentId)
    //     .then(res => {
    //       if (res.code === 1) {
    //         let data = res.data
    //         this.recordNums.visitors = data.isCheckVisitorNumber || 0
    //         this.recordNums.unvisitors = data.unCheckVisitorNumber || 0
    //         this.recordNums.company = data.unCheckDutyCompanyNumber || 0
    //         this.recordNums.user = data.unCheckAiUserNumber || 0
    //         this.buildingNums.buildingNum = data.buildingNumber || 0
    //         this.buildingNums.buildingTemplateNum = data.buildingTemplateNumber || 0
    //       }
    //     }).catch(() => {})
    // },
    // 获取积分
    // getPoint () {
    //   let data = {departmentId: this.$store.getters.departmentId, type: this.$store.getters.type, unionId: 0}
    //   httpGet(getPoint, data)
    //     .then(res => {
    //       if (res.code === 1) {
    //         this.integralNum = res.data.restPoints
    //       }
    //     }).catch(() => {})
    // },
    goAgentHome () {
      this.$router.push({path: '/vip'})
    },
    goAreaManage () {
      if (this.buildingNums.buildingTemplateNum === 0) return
      this.$router.push({path: '/faceDistinguish/areaManage'})
    },
    goMessage () {
      this.$router.push({path: 'basicSetting/message'})
    },
    // 获取快报
    getMessageIsYUN () {
      httpGet(getMessageIsYUN, {limit: this.messageLimit, offset: 1})
        .then(res => {
          if (res.code === 1) {
            this.messagelist = res.data.rows
          }
        }).catch(() => {})
    },
    // 便签
    getNote () {
      let data = {departmentId: Number(this.$store.getters.departmentId), limit: this.getNoteLimit, offset: 1, userId: Number(this.$store.getters.userId)}
      httpGet(getNoteList, data)
        .then(res => {
          if (res.code === 1) {
            if (res.data.rows) {
              this.notelist = res.data.rows
            } else {
              this.notelist = []
            }
          }
        }).catch(() => {})
    },
    lookNote (val, item) {
      this.itemdata = item
      this.textarea = val
      this.dialogVisible = true
      this.editorVisible = true
    },
    addNote () {
      if (this.notelist.length >= this.getNoteLimit) {
        this.$message({
          message: `便签不能超过${this.getNoteLimit}条！`,
          type: 'warning'
        })
        return
      }
      this.dialogVisible = true
      this.addVisible = true
    },
    del (id) {
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          id: id,
          isDelete: 0
        }
        httpPut(updateNoteList, data).then(res => {
          this.getNote()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {})
      }).catch(() => {})
    },
    createNote () {
      if (!this.textarea && this.textarea === '') {
        return
      }
      this.createLoading = true
      let data = {departmentId: Number(this.$store.getters.departmentId), text: this.textarea, userId: Number(this.$store.getters.userId)}
      httpPost(insertNoteList, data)
        .then(res => {
          this.getNote()
          this.dialogVisible = false
          setTimeout(() => { this.createLoading = false }, 300)
          this.addVisible = false
          this.textarea = ''
          this.$message({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
        })
        .catch(() => {
          this.createLoading = false
        })
    },
    editorNote () {
      if (!this.textarea && this.textarea === '') {
        return
      }
      this.updateLoading = true
      let data = {
        departmentId: Number(this.$store.getters.departmentId),
        id: this.itemdata.id,
        text: this.textarea,
        updateAt: this.itemdata.updateAt,
        userId: Number(this.$store.getters.userId)
      }
      httpPut(updateNoteList, data)
        .then(res => {
          this.getNote()
          this.dialogVisible = false
          setTimeout(() => { this.updateLoading = false }, 300)
          this.editorVisible = false
          this.textarea = ''
          this.$message({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
        })
        .catch(() => {
          this.updateLoading = false
        })
    },
    handleClose (done) {
      this.$confirm('确认放弃修改？')
        .then(_ => {
          done()
          this.dialogVisible = false
          this.addVisible = false
          this.editorVisible = false
          this.textarea = ''
          this.cencelNotify()
        })
    },
    // 跳转
    goUserData (num) {
      if (!num || num === 0) {
        return
      }
      this.$router.push({path: 'faceDistinguish/userData?from=home'})
    },
    goUserManage (listQuery, num) {
      if (!num || num === 0) {
        return
      }
      let query = JSON.stringify(listQuery)
      this.$router.push({path: `faceDistinguish/userManage?from=home&listQuery=${query}`})
    },
    // 获取物业通知栏
    cencelNotify () {
      this.dialogVisibleNotify = false
      this.$refs.NotifyForm.resetFields()
    },
    // 查
    getaiNotify () {
      httpGet(aiNotify + '/' + this.$store.getters.departmentId)
        .then(res => {
          if (res.code === 1) {
            this.noticelist = res.data.slice(0, 5)
          }
        }).catch(() => {})
    },
    addNotify () {
      this.dialogVisibleNotify = true
    },
    // 增
    createNotify () {
      this.$refs.NotifyForm.validate((valid) => {
        if (valid) {
          // console.log(this.notifyForm)
          this.createLoading = true
          httpPost(aiNotify, this.notifyForm)
            .then(res => {
              this.getaiNotify()
              this.dialogVisibleNotify = false
              this.$refs.NotifyForm.resetFields()
              setTimeout(() => { this.createLoading = false }, 300)
              this.$message({
                message: res.message,
                type: 'success',
                duration: 4 * 1000
              })
            })
            .catch(() => {
              this.createLoading = false
            })
        }
      })
    },
    // 删
    delNotify (id) {
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        httpDelete(aiNotify + '/' + id).then(res => {
          this.getaiNotify()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {})
      }).catch(() => {})
    },
    // 输入框增删
    addDetail () {
      this.notifyForm.list.push({
        name: '',
        text: '',
        key: Date.now()
      })
    },
    removeDetail (item) {
      let index = this.notifyForm.list.indexOf(item)
      if (index !== -1) {
        this.notifyForm.list.splice(index, 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.fc-blue {
  color: #409EFF
}
.app-container {
  padding: 30px;
}
ul, li {
  list-style:none;
  margin:0;
  padding:0;
  border:0;
  outline:0;
}
.box-shadow {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.num {
  font-size: 30px;
  font-weight: bold;
}
.underline:hover span {
  box-shadow: 0 -1px #fff inset;
  cursor: pointer;
}
.header {
  display: flex;
  margin-bottom: 50px;
  .left, .right {
    width: 100%;
    height: 200px;
    border-radius: 8px;
    color: #fff;
    display: flex;
    overflow: hidden;
    font-size: 17px;
    .info {
      // flex: 1;
      width: 70%;
      div:first-of-type {
        margin-right: 50px;
      }
    }
    .ricon {
      flex: 1;
    }
  }
  .left {
    margin-right: 50px;
    .info {
      background: linear-gradient(10deg, #3277ff,#004ce4);
    }
    .ricon {
      background: linear-gradient(110deg, #3277ff,#004ce4);
    }
  }
  .right {
    .info {
      background: linear-gradient(10deg, #696aff,#4c3bdf);
    }
    .ricon {
      background: linear-gradient(110deg, #696aff,#4c3bdf);
    }
  }
}
.main {
  overflow: hidden;
  .simg {
    width: 16px;
    vertical-align: middle;
    font-size: 0;
    margin-right: 5px;
  }
  section {
    background-color: #fff;
  }
  .nulldata {
    text-align: center;
    line-height: 80px;
    color: #909399;
    font-size: 14px;
  }
  .left {
    width: 60%;
    display: inline-block;
  }
  // 更多信息
  .record {
    margin-bottom: 30px;
    background-color: #eeeeee;
    .title {
      letter-spacing: 2px;
      padding-bottom: 20px;
    }
    .box {
      display: flex;
      overflow: hidden;
      border-radius: 8px;
      background-color: #fff;
      .item {
        flex: 1;
        &:hover .name {
          opacity: .9;
        }
        &:hover .count {
          background-color: #F2F6FC
        }
        .name {
          color: #fff;
          background-color: #587fff;
          height: 60px;
        }
        .count {
          height: 80px;
          font-size: 18px;
        }
      }
    }
  }
  // 便签
  .note {
    .title {
      color: #fff;
      background-color: #587fff;
      padding: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .add {
        padding-left: 10px;
        &:hover {
          cursor: pointer;
        }
      }
    }
    .item {
      background-color: rgb(250, 219, 119);
      border-radius: 5px;
      margin: 15px;
      padding: 8px;
      display: flex;
      span {
        flex: 1
      }
      &:hover {
        opacity: .9;
        cursor: pointer;
      }
    }
  }
  .del {
    color: red;
    font-size: 18px;
    &:hover {
      cursor: pointer;
    }
  }
  // 快报
  .letters {
    width: 100%;
    min-height: 200px;
    .title {
      padding: 10px;
      display: flex;
      border: 1px solid #eeeeee;
      justify-content: space-between;
      align-items: center;
      .more {
        font-size: 14px;
        color: #909399;
        font-weight: normal;
        &:hover {
          box-shadow: 0 -1px #909399 inset;
          cursor: pointer;
        }
      }
    }
    .item {
      padding: 10px 15px;
      border-bottom: 1px solid #eeeeee;
      .time {
        color: #909399;
        font-size: 14px;
      }
    }
    .item-notify {
      padding: 10px 15px;
      border-bottom: 1px solid #eeeeee;
      .box {
        display: flex;
      }
      .text {
        flex: 1
      }
    }
    ul li:nth-of-type(even) {
      background-color: #d9e2ff;
    }
  }
}
.word-limit {
  text-align: right
}
.line1 {
  margin-top: 20px;
  padding-top: 30px;
  border-top: 1px dashed rgb(147, 232, 255);
}
.line2 {
  padding-right: 20px;
  border-right: 1px dashed rgb(147, 232, 255);
}
.el-carousel__item img {
  width: 100%;
  height: 100%;
  background-size: 100% 100% !important;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
.notifyForm {
  .namebox {
    display: flex;
    .del {
      margin-left: 10px;
    }
  }
}
.notify {
  .add {
    &:hover {
      cursor: pointer;
    }
  }
  // position: relative;
  // padding-bottom: 26px;
  // .pagination {
  //   position: absolute;
  //   bottom: 0;
  //   width: 100%;
  // }
}
</style>
