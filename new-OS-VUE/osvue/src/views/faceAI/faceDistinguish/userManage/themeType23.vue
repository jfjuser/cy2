
<template>
  <div class="app-container">
    <el-row :span="24">
      <el-col :span=" 4">
        <div class="tree-main">
          <div class="title">
            <el-button size="small" type="text">部门列表</el-button>
            <span>
              <el-tooltip effect="dark" v-has="['添加树']" content="添加" placement="bottom">
                <el-button size="mini"  @click="handleCreate" type="text"  icon="el-icon-plus"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" v-has="['修改树']" content="编辑" placement="bottom">
                <el-button size="mini"  @click="handleUpdate" type="text"  icon="el-icon-edit-outline"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" v-has="['删除树']" content="删除" placement="bottom">
                <el-button size="mini"  :loading="deleteLoading" @click="handleDelete" type="text"  icon="el-icon-delete"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" v-has="['修改树密码']" content="修改密码"  placement="bottom">
                <el-button size="mini"  type="text" :loading="passWordLoading" @click="handlePassword">
                  <i class="fa fa-key fa-fw"></i>
                </el-button>
              </el-tooltip>
            </span>
          </div>
          <el-scrollbar :style="{height: height + 'px'}">
            <el-tree
              v-if="showTree"
              show-checkbox
              :props="props"
              node-key="id"
              check-strictly
              :check-on-click-node="true"
              @check-change="handleTreeClick"
              @node-click="nodeTreeClick"
              ref="tree"
              :load="loadNode" lazy>
              <span class="custom-tree-node" slot-scope="{ node }">
                <span>{{ node.label}}</span>
              </span>
            </el-tree>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col :span="20">
        <div class="table-main">
          <Member :memberId="checkedId"/>
        </div>
      </el-col>
    </el-row>
    <!-- 新增或者修改 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync = "dialogFormVisible">
        <el-form :rules="formRules" ref="dataform" :model="form" autoComplete="on" label-position="right" label-width="150px">
          <el-form-item :label="themeType === 2? '部门名称' : '班级名称'" prop="leader">
            <el-input v-model="form.leader" placeholder="请输入"></el-input>
          </el-form-item>
          <div v-if="dialogStatus === 'create'">
            <el-form-item label="通道名称" prop="aiTokenIds">
              <el-select v-model="form.aiTokenIds" multiple >
                <el-option v-for="item in localList" :key="item.id" :label="item.localName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="审核方式" prop="isCheck" >
            <el-select v-model="form.isCheck">
              <el-option v-for="item in checkType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input type="tel" v-model="form.phone" @blur="phoneCheck" placeholder="请输入手机号"></el-input>
            <span style="font-size: 14px; color: red">备注：手机号为人脸智能识别小程序的登录账号！</span>
          </el-form-item>
          <el-form-item v-if="addrInput" :label=" themeType === 2 ? '楼室' : '班级位置'" prop="addr">
            <el-input v-model="form.addr" :placeholder="themeType === 2 ? '请输入楼室' : '请输入年级班级'"></el-input>
          </el-form-item>
          <el-form-item v-if="!addrInput" :label=" themeType === 2 ? '楼室' : '班级位置'" prop="floorNum">
            <el-select v-model="form.floorNum" style="width:100px;" @change="showFloor">
              <el-option v-for="item in unitArr" :key="item" :value="item"></el-option>
            </el-select> {{themeType === 2 ? '单元' : '校区'}}
            <!-- 第<el-input style="width:80px;" v-model="form.floorNum"></el-input>单元 -->
             <el-select v-model="floor" style="width:100px;margin-left: 10px" @change="getRoom">
              <el-option v-for="item in floorArr" :key="item" :value="item"></el-option>
            </el-select> {{themeType === 2 ? '层' : '年级'}}
            <!-- <span style="padding-left:15px">房号：</span> -->
            <el-select v-model="form.roomNum" style="width:100px;margin-left: 10px">
              <el-option v-for="item in roomArr" :key="item" :value="item"></el-option>
            </el-select> {{themeType === 2 ? '号房' : '班级'}}
            <!-- <el-input style="width:120px;" v-model="form.roomNum"></el-input> -->
            <div style="font-size: 14px; color: #ccc">备注：可前往【小区/学校管理】创建</div>
          </el-form-item>
          <el-form-item :label="themeType === 1? '家庭人数': (themeType === 2? '部门人数' : (themeType === 3? '班级人数' : '成员人数'))" prop="userNum">
            <el-input type="number" min="1" v-model="form.userNum" placeholder="请输入成员人数"></el-input>
          </el-form-item>
          <el-form-item label="访问人数" prop="visitorNum">
            <el-input type="number" min="1" v-model="form.visitorNum" placeholder="请输入访问人数"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button :loading="createLoading" type="primary" v-if="dialogStatus === 'create'" @click="createData">保存</el-button>
          <el-button :loading="updateLoading" type="primary" v-if="dialogStatus === 'update'" @click="updateData">保存</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import { compact } from '@/utils/formatter.js'
import { mapGetters } from 'vuex'
import { httpGet, httpPost, httpPut, httpDelete } from '@/utils/restful'
import { getAITreeData, showFloor, showBuilding, showRoom, AIInOutTime, AiDuyCompany, checkAICamera, deleteAIDuyUser, getAIDuyDetail, updateAIPassword } from '@/api/url'
import { checkPhone, checkAINumber } from '@/utils/validator.js'
import { checkType } from '@/utils/selectAble.js'
import Member from './components/member23.vue'
export default {
  computed: {
    ...mapGetters([
      'themeType'
    ])
  },
  components: {
    Member
  },
  data () {
    return {
      height: 0,
      unitArr: [],
      floorArr: [],
      roomArr: [],
      props: {
        label: 'name',
        children: 'children'
      },
      showTree: true,
      addrInput: undefined,
      checkedId: 0,
      floor: undefined,
      checkType: checkType,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加',
        detail: '详情'
      },
      createLoading: false,
      deleteLoading: false,
      updateLoading: false,
      detailLoading: false,
      passWordLoading: false,
      dialogFormVisible: false,
      localList: [],
      form: {
        id: undefined,
        leader: undefined,
        aiTokenIds: [],
        isCheck: undefined,
        phone: undefined,
        addr: undefined,
        floorNum: undefined,
        roomNum: undefined,
        userNum: undefined,
        visitorNum: undefined
      },
      formRules: {
        aiTokenIds: [
          {required: true, trigger: 'change', message: '不可为空'}
        ],
        leader: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        isCheck: [
          {required: true, trigger: 'change', message: '不可为空'}
        ],
        phone: [
          {required: true, trigger: 'blur', message: '不可为空'},
          {validator: checkPhone, trigger: 'blur'}
        ],
        addr: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        userNum: [
          {required: true, trigger: 'blur', message: '不可为空'},
          {validator: checkAINumber, trigger: 'blur'}
        ],
        visitorNum: [
          {required: true, trigger: 'blur', message: '不可为空'},
          {validator: checkAINumber, trigger: 'blur'}
        ]
      },
      detailName: ''
    }
  },
  created () {
    this.getHeight()
    this.getTimeData()
  },
  methods: {
    getHeight () {
      this.height = document.documentElement.clientHeight - 100
    },
    getTimeData () {
      httpGet(AIInOutTime + '/list/' + this.$store.getters.departmentId)
        .then(res => {
          if (res.data.addrType === 0) {
            this.addrInput = true
          } else {
            this.addrInput = false
          }
        }).catch(() => {})
    },
    getUnit () {
      if (this.addrInput === false) {
        httpGet(showBuilding + '/' + this.$store.getters.departmentId).then((res) => {
          if (res.data.length > 0) {
            this.unitArr = res.data
          } else {
            this.unitArr = []
          }
        }).catch(() => {})
      }
    },
    // 根据单元生成楼层
    showFloor (val) {
      console.log(val)
      httpGet(showFloor, {
        buildingName: this.form.floorNum,
        departmentId: this.$store.getters.departmentId
      }).then((res) => {
        if (res.data.length > 0) {
          this.floorArr = compact(res.data)
        } else {
          this.floorArr = []
        }
      }).catch(() => {})
    },
    // 根据楼层获取房间号
    getRoom () {
      httpGet(showRoom, {
        buildingName: this.form.floorNum,
        departmentId: this.$store.getters.departmentId,
        floorNumber: this.floor
      }).then((res) => {
        if (res.data.length > 0) {
          this.roomArr = res.data
        } else {
          this.roomArr = []
        }
      })
    },
    loadNode (node, resolve) {
      if (node.level === 0) {
        httpGet(getAITreeData, {
          departmentId: this.$store.getters.departmentId
        }).then(res => {
          this.checkedId = res.data[0].dcCode + res.data[0].id + '-'
          setTimeout(() => {
            resolve(res.data)
          })
        }).catch(() => {})
      } else {
        httpGet(getAITreeData, {
          dcCode: node.data.dcCode + node.data.id + '-',
          departmentId: this.$store.getters.departmentId
        }).then(res => {
          if (res.data !== null) {
            if (node.data.id === parseInt(this.$store.getters.departmentId)) {
              res.data.push({
                dcCode: '-0',
                id: '',
                name: '未分配部门用户'
              })
              setTimeout(() => {
                resolve(res.data)
              })
            } else {
              setTimeout(() => {
                resolve(res.data)
              })
            }
          } else {
            resolve([])
          }
        }).catch(() => {})
      }
    },
    // loadNode (node, resolve) {
    //   if (node.level === 0) {
    //     httpGet(getAITreeData, {
    //       departmentId: this.$store.getters.departmentId
    //     }).then(res => {
    //       this.checkedId = res.data[0].dcCode + res.data[0].id + '-'
    //       setTimeout(() => {
    //         resolve(res.data)
    //       })
    //     }).catch(() => {})
    //   } else {
    //     httpGet(getAITreeData, {
    //       dcCode: node.data.dcCode + node.data.id + '-',
    //       departmentId: this.$store.getters.departmentId
    //     }).then(res => {
    //       if (res.data !== null) {
    //         alert(123)
    //         if (node.data.id === parseInt(this.$store.getters.departmentId)) {
    //           res.data.push({
    //             dcCode: '-0',
    //             id: '',
    //             name: '未分配部门用户'
    //           })
    //           setTimeout(() => {
    //             resolve(res.data)
    //           })
    //         }
    //       } else {
    //         if (node.data.id === parseInt(this.$store.getters.departmentId)) {
    //           resolve([{
    //             dcCode: '-0',
    //             id: '',
    //             name: '未分配部门用户'
    //           }])
    //         } else {
    //           resolve([])
    //         }
    //       }
    //     }).catch(() => {})
    //   }
    // },
    // 设置单选框
    handleTreeClick (data, checked) {
      if (checked === true) {
        this.checkedId = data.dcCode + data.id + '-'
        this.$refs.tree.setCheckedNodes([data])
      }
    },
    nodeTreeClick (data) {
      this.checkedId = data.dcCode + data.id + '-'
      this.$refs.tree.setCheckedNodes([data])
    },
    // 检查手机号是否重复
    phoneCheck () {
      httpGet(AiDuyCompany + '/' + this.form.phone)
        .then(res => {}).catch(() => {})
    },
    // 重置表单
    resetForm () {
      this.form = {
        id: undefined,
        leader: undefined,
        aiTokenIds: [],
        isCheck: undefined,
        phone: undefined,
        addr: undefined,
        userNum: undefined,
        visitorNum: undefined
      }
    },
    // 获取所有的通道列表
    getCameraList () {
      httpGet(checkAICamera + this.$store.getters.departmentId).then(res => {
        if (res.data.length === 0) {
          this.$message({
            message: '请先配置通道',
            type: 'warning',
            duration: 4 * 1000
          })
        } else {
          this.localList = res.data
        }
      }).catch(() => {})
    },
    // 添加
    handleCreate () {
      if (this.$refs.tree.getCheckedNodes().length > 0) {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.getCameraList()
        this.$nextTick(() => {
          this.$refs['dataform'].clearValidate()
          this.resetForm()
          this.getUnit()
        })
      } else {
        this.$message.warning('请先选择一个上级进行添加')
      }
    },
    // 新增
    createData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.createLoading = true
          this.form = Object.assign(this.form, {
            departmentId: this.$store.getters.departmentId,
            dcCode: this.checkedId
          })
          httpPost(AiDuyCompany, this.form)
            .then(res => {
              this.showTree = false
              setTimeout(() => {
                this.showTree = true
              }, 100)
              this.dialogFormVisible = false
              setTimeout(() => { this.createLoading = false }, 300)
              this.$message.success(res.message)
            }).catch(() => {
              this.createLoading = false
            })
        }
      })
    },
    // 删除
    // handleDelete () {
    //   if (this.$refs.tree.getCheckedNodes().length > 0) {
    //     this.$confirm('确认删除所选中的记录吗？', '提示', {})
    //       .then(() => {
    //         this.deleteLoading = true
    //         let node = this.$refs.tree.getCheckedNodes()[0]
    //         let data = {
    //           departmentId: this.$store.getters.departmentId,
    //           id: node.id,
    //           dcCode: node.dcCode
    //         }
    //         httpDelete(deleteAIDuyUser, data).then(res => {
    //           this.deleteLoading = false
    //           this.showTree = false
    //           setTimeout(() => {
    //             this.showTree = true
    //           }, 100)
    //           this.$message({
    //             type: 'success',
    //             message: res.message,
    //             duration: 4 * 1000
    //           })
    //         }).catch(() => {
    //           this.deleteLoading = false
    //         })
    //       }).catch(() => {})
    //   } else {
    //     this.$message.warning('请先选择一个部门进行删除')
    //   }
    // },
    handleDelete () {
      if (this.$refs.tree.getCheckedNodes().length > 0) {
        const h = this.$createElement
        let message = ['删除后所选部门将不能使用']
        let info = {
          h,
          message,
          firstconfirmButtonText: '确定',
          firstcancelButtonText: '取消',
          secondmessgae: '您已了解删除后果，确定还要继续删除吗',
          secondconfirmButtonText: '我再想想',
          secondcancelButtonText: '确定删除'
        }
        this.MessageBox(info).then(() => {
          this.deleteLoading = false
        }).catch(() => {
          this.deleteLoading = true
          let node = this.$refs.tree.getCheckedNodes()[0]
          let data = {
            departmentId: this.$store.getters.departmentId,
            id: node.id,
            dcCode: node.dcCode
          }
          httpDelete(deleteAIDuyUser, data).then(res => {
            this.deleteLoading = false
            this.showTree = false
            setTimeout(() => {
              this.showTree = true
            }, 100)
            this.$message({
              type: 'success',
              message: res.message,
              duration: 4 * 1000
            })
          }).catch(() => {
            this.deleteLoading = false
          })
        })
      } else {
        this.$message.warning('请先选择一个部门进行删除')
        document.onkeydown = undefined
      }
    },
    // 查看详情
    handleDeatil () {
      if (this.$refs.tree.getCheckedNodes().length > 0 && this.checkedId.split('-').length > 2) {
        this.detailLoading = true
        httpGet(getAIDuyDetail + this.$refs.tree.getCheckedNodes()[0].id)
          .then(res => {
            this.form = Object.assign({}, res.data)
            this.dialogStatus = 'detail'
            this.dialogFormVisible = true
            this.$nextTick(() => {
              this.$refs['dataform'].clearValidate()
            })
            this.detailLoading = false
          }).catch(() => {
            this.detailLoading = false
          })
      } else {
        this.$message.warning('请先选择一个上级进行添加')
      }
    },
    // 更新
    handleUpdate () {
      if (this.$refs.tree.getCheckedNodes().length > 0 && this.checkedId.split('-').length > 2) {
        httpGet(getAIDuyDetail + this.$refs.tree.getCheckedNodes()[0].id)
          .then(res => {
            this.detailName = res.data.leader
            this.form = Object.assign({}, res.data)
            this.dialogStatus = 'update'
            this.dialogFormVisible = true
            this.$nextTick(() => {
              this.$refs['dataform'].clearValidate()
            })
          }).catch(() => {})
      } else {
        this.$message.warning('请先选择一个上级进行添加')
      }
    },
    updateData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.updateLoading = true
          const updateFormData = Object.assign({}, this.form)
          httpPut(AiDuyCompany, updateFormData)
            .then(res => {
              if (this.detailName !== updateFormData.leader) {
                this.showTree = false
                setTimeout(() => {
                  this.showTree = true
                }, 100)
              }
              this.dialogFormVisible = false
              setTimeout(() => { this.updateLoading = false }, 300)
              this.$message.success(res.message)
            }).catch(() => {
              this.updateLoading = false
            })
        }
      })
    },
    // 修改密码
    handlePassword (row) {
      this.$prompt('请填写新密码', '提示', {
        confimButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^(\w){6,12}$/,
        inputErrorMessage: '密码为6-12位字母，数字或者下划线'
      }).then(({value}) => {
        this.passWordLoading = true
        let node = this.$refs.tree.getCheckedNodes()[0]
        httpPut(updateAIPassword, {id: node.id, psw: value})
          .then(res => {
            this.passWordLoading = false
            this.$message.success(res.message)
          }).catch(() => {
            this.passWordLoading = false
          })
      }).catch(() => {})
    }
  }
}
</script>
<style lang='scss' scoped>
.tree-main{
  padding: 10px;
  border-radius: 10px;
  background: white;
  margin-right: 20px;
}
.custom-tree-node{
  font-size: 14px;
}
.title{
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
}
.el-button .el-tooltip .el-button--primary .el-button--mini .is-circle{
  padding: 6px;
  margin-left: 5px;
}
</style>
