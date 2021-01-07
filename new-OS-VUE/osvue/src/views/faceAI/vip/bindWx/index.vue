<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-button class="filter-item" type="primary" v-has="['添加']"  @click="handleCreate"  icon="el-icon-edit">添加</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading"  @selection-change="handleSelectionChange"  element-loading-text="加载中..." border fit>
        <el-table-column label="企业名称" align="center" prop="departmentName"></el-table-column>
        <el-table-column label="账号分类" align="center" prop="type">
          <template slot-scope="scope">
            {{wxTypeFormatter(scope.row.type)}}
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            {{enableFormatter(scope.row.status)}}
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center" prop="name"></el-table-column>
        <el-table-column label="默认状态" align="center" prop="current">
          <template slot-scope="scope">
            {{currentFormatter(scope.row.current)}}
          </template>
        </el-table-column>
        <el-table-column label="使用资源" align="center" prop="self">
          <template slot-scope="scope">
            {{selfFormatter(scope.row.self)}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" v-if = "isShowColumnFormatter(['编辑', '删除', '菜单'])" align="center" class-name="small-padding fixed-width" width="220">
          <template slot-scope="scope">
            <el-button type="primary" v-has="['菜单']" @click.native.prevent="handleMenu(scope.row)" size="mini">菜单</el-button>
            <el-button type="primary" v-has="['编辑']" @click.native.prevent="handleUpdate(scope.row)" size="mini">编辑</el-button>
            <el-button type="danger" style="margin-bottom:1rem" v-has="['删除']" @click.native.prevent="handleDelete(scope.row)" size="mini">删除</el-button>
            <el-button type="primary"  @click.native.prevent="addModel(scope.row)" size="mini">模板设置</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="添加推送模板" :visible.sync="addDialog" width="40%">
        <el-form :model="objAck" ref="ssdd" autoCompete = "on" label-position="right" label-width="100px">
          <div style="margin-bottom:2rem">
            <el-button type="primary" @click.native.prevent="addOne">增加一组</el-button><el-button type="danger" @click.native.prevent="reduceOne">删除一组</el-button>
          </div>
          <div v-for="(item, index) in objAck.sForm" :key=index>
            <el-form-item label="模板主题" :prop="'sForm.' + index + '.templateTitle'">
              <el-select v-model="item.templateTitle" style="width:18.75rem;" :rules="{
                  required: true, message: '主题不能为空', trigger: 'blur'
                }" placeholder="请选择">
                <el-option
                 v-for="item in options"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value">
                </el-option>
              </el-select>
              <!-- <el-input v-model="item.templateTitle" style="width:18.75rem;" placeholder="请输入模板主题"></el-input> -->
            </el-form-item>
            <el-form-item label="模板ID" :prop="'sForm.' + index + '.templateId'" :rules="{
                  required: true, message: '模板ID不能为空', trigger: 'blur'
                }">
              <el-input v-model="item.templateId" style="width:18.75rem;" placeholder="请输入模板ID"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialog = false">取消</el-button>
          <el-button type="primary" @click.prevent.native="addInfo">添加</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width ="40%">
        <el-form :rules="formRules" ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="150px" >
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" style="width:18.75rem;" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="账号分类" prop="type">
            <el-radio v-model="form.type" label="0" border>服务号</el-radio>
            <el-radio v-model="form.type" label="1" border>小程序</el-radio>
          </el-form-item>
          <el-form-item label="接入状态" prop="accessType">
            <el-radio v-model="form.accessType" label="0" border>专用</el-radio>
            <el-radio v-model="form.accessType" label="1" border>共用</el-radio>
          </el-form-item>
          <el-card class="box-card" style="margin-bottom: 10px">
            <div slot="header" class="clearfix">
              <span>公众号开发信息<el-tag style="margin-left: 10px">微信菜单->开发->基本配置</el-tag></span>
            </div>
            <el-form-item label="开发者ID(AppID)" prop="appId" label-width="250px">
              <el-input v-model="form.appId" style="width:18.75rem;" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="开发者密码(AppSecret)" prop="appSecret" label-width="250px">
              <el-input v-model="form.appSecret" style="width:18.75rem;" placeholder="请输入"></el-input><el-tag type="danger" size="mini" style="margin-left: 10px">安全模式</el-tag>
            </el-form-item>
            <el-form-item label="原始ID" prop="originalId" label-width="250px">
              <el-input v-model="form.originalId" style="width:18.75rem;" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="IP白名单" prop="ip" label-width="250px">
              <span>请在<el-tag type="success" size="mini">微信</el-tag>上填写以下IP地址</span><el-button size="mini" @click="dialogLookIpVisible = true">查看</el-button>
            </el-form-item>
          </el-card>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>只有启用服务器配置才需要填写(<el-tag size="mini">推荐</el-tag>,启用后交互性更强)</span>
              <p>URL: 请在<el-tag type="success" size="mini">微信</el-tag>上填写 https://www.cytingchechang.com/pb/pv/v1/wx/entry</p>
              <p>消息加解密方式: 请在<el-tag type="success" size="mini">微信</el-tag>上选择 安全模式（推荐）</p>
            </div>
            <el-form-item label="令牌(Token)" prop="token" label-width="250px">
              <el-input v-model="form.token" style="width:18.75rem;" placeholder="请输入微信服务器配置上填写的的令牌"></el-input><el-tag type="danger" size="mini" style="margin-left: 10px">安全模式</el-tag>
            </el-form-item>
            <el-form-item label="消息加解密密钥(EncodingAESKey)" prop="encodingAesKey" label-width="250px">
              <el-input v-model="form.encodingAesKey" style="width:18.75rem;" placeholder="请输入微信服务器配置上随机生成的秘钥"></el-input><el-tag type="danger" size="mini" style="margin-left: 10px">安全模式</el-tag>
            </el-form-item>
            <el-form-item label="编码类型" prop="codeType" label-width="250px">
              <el-radio v-model="form.codeType" label="0" border :disabled="true">xml</el-radio>
              <el-radio v-model="form.codeType" label="1" border>json</el-radio>
            </el-form-item>
            <p style="color: red">补充:保存后即可在<el-tag type="success" size="mini">微信</el-tag>上提交服务器配置信息</p>
          </el-card>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button :loading = "createLoading" v-if="dialogStatus=='create'" type="primary" @click="createData">保存</el-button>
          <el-button :loading = "updateLoading" v-else type="primary" @click="updateData">修改</el-button>
        </div>
      </el-dialog>
      <el-dialog title="请把以下所有IP地址配置到微信IP白名单中" :visible.sync="dialogLookIpVisible" width ="400px">
        <p>请咨询管理员获取,不对外公布</p>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogLookIpVisible = false">返回</el-button>
        </div>
      </el-dialog>
      <el-dialog
      title="自定义菜单"
      :visible.sync="dialogMenuVisible"
      :close-on-click-modal="false"
      @closed="onclosedMenu"
      :before-close="handleCloseMenu" >
        <!-- <i class="el-icon-question questionicon" @click="onQuestion"/>
        <section>
          <el-button type="success" style="margin-bottom: 10px;" v-if="menus.length < 3 && disabledDrag" @click="addMenu">添加一级菜单</el-button>
          <el-button type="primary" style="margin-bottom: 10px;" v-show="disabledDrag" @click="disabledDrag = false, menuContent = {}">点击选择排序</el-button>
          <el-button type="primary" style="margin-bottom: 10px;" v-show="!disabledDrag" @click="saveSort">点击选择编辑</el-button>
          <el-collapse v-model="activeName" accordion>
            <draggable v-model="menus" group="menu" :disabled="disabledDrag" @update="dragUpdate">
              <el-collapse-item :name="i" v-for="(item, i) in menus" :key="i">
                <template slot="title">
                  <div @click="selectMenu('f', item, i)" class="first-menu">
                    <i class="el-icon-circle-close danger" style="margin-right: 10px" @click.stop="delMenu(i, item.id)" v-if="disabledDrag"></i>
                    {{item.menuFirstLevel}}(一级菜单)
                  </div>
                </template>
                <draggable v-model="item.child" group="child" :disabled="disabledDrag" @update="dragUpdateChild(i, $event)" >
                  <el-button plain v-for="(childitem, i2) in item.child" :key="i2" @click="selectMenu('c', childitem, i, i2)">
                    {{childitem.menuSecondLevel}}
                    <i class="el-icon-circle-close danger" @click.stop="delMenuChild(i, i2, childitem.id)" v-if="disabledDrag"></i>
                  </el-button>
                  <span style="color:#C0C4CC;" v-if="item.child.length==0">还未添加二级菜单</span>
                  <el-button slot="header" type="success" icon="el-icon-plus" circle v-if="item.child.length < 5 && disabledDrag" @click="addMenuChild(i)"></el-button>
                </draggable>
              </el-collapse-item>
            </draggable>
          </el-collapse>
        </section> -->
        <i class="el-icon-question questionicon" @click="onQuestion" title="操作说明"/>
        <section>
          <el-button type="success" style="margin-bottom: 10px;" v-if="menus.length < 3 && disabledDrag" @click="addMenu">添加一级菜单</el-button>
          <el-button type="primary" style="margin-bottom: 10px;" v-show="disabledDrag" @click="disabledDrag = false, menuContent = {}">点击选择排序</el-button>
          <el-button type="primary" style="margin-bottom: 10px;" v-show="!disabledDrag" @click="saveSort">点击选择编辑</el-button>
          <el-collapse v-model="activeName" accordion>
            <draggable v-model="menus" group="menu" :disabled="disabledDrag" @update="dragUpdate">
              <el-collapse-item :name="i" v-for="(item, i) in menus" :key="i">
                <template slot="title">
                  <div @click="selectMenu('f', item, i)" class="first-menu">
                    <i class="el-icon-circle-close danger" style="margin-right: 10px" @click.stop="delMenu(i, item.id)" v-if="disabledDrag" title="删除"></i>
                    {{item.menuFirstLevel}}(一级菜单)
                  </div>
                </template>
                <draggable v-model="item.child" group="child" :disabled="disabledDrag" @update="dragUpdateChild(i, $event)" >
                  <el-button plain v-for="(childitem, i2) in item.child" :key="i2" @click="selectMenu('c', childitem, i, i2)">
                    {{childitem.menuSecondLevel}}
                    <i class="el-icon-circle-close danger" @click.stop="delMenuChild(i, i2, childitem.id)" v-if="disabledDrag" title="删除"></i>
                  </el-button>
                  <span style="color:#C0C4CC;" v-if="item.child.length==0">还未添加二级菜单</span>
                  <el-button slot="header" type="success" icon="el-icon-plus" circle v-if="item.child.length < 5 && disabledDrag" @click="addMenuChild(i)" title="添加二级菜单"></el-button>
                </draggable>
              </el-collapse-item>
            </draggable>
          </el-collapse>
        </section>
        <div style="color:#C0C4CC;" v-if="menus.length == 0">还未添加菜单</div>
        <MenuContent v-bind="menuContent" @saveMenu="saveMenu"></MenuContent>
        <div slot="footer" class="dialog-footer">
          <span style="color:#C0C4CC;" v-show="disabledDrag">您正在编辑菜单</span>
          <span style="color:#C0C4CC;" v-show="!disabledDrag">您正在排序菜单</span>
          <el-button type="primary" :loading = "saveLoading" @click="saveData">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { identityType } from '@/utils/selectAble.js'
import { isShowColumnFormatter, wxTypeFormatter, enableFormatter, currentFormatter, selfFormatter } from '@/utils/formatter.js'
import { templateInfo, wxManager, WXMemu } from '@/api/url.js'
import { httpGet, httpPost, httpPut, httpDelete } from '@/utils/restful.js'
import MenuContent from './components/MenuContent'
import draggable from 'vuedraggable'

export default {
  components: {
    MenuContent,
    draggable
  },
  data () {
    return {
      list: null,
      listLoading: true,
      createLoading: false,
      updateLoading: false,
      deleteLoading: false,
      listQuery: {
        offset: 1,
        limit: 10,
        departmentId: this.$store.getters.departmentId
      },
      tableData: [],
      identityType: identityType,
      wxTypeFormatter: wxTypeFormatter,
      enableFormatter: enableFormatter,
      currentFormatter: currentFormatter,
      selfFormatter: selfFormatter,
      isShowColumnFormatter: isShowColumnFormatter,
      total: null,
      selectArrayId: [],
      dialogStatus: '',
      options: [
        {
          value: '人脸进出通知'
        },
        {
          value: '审核通过通知'
        },
        {
          value: '审核不通过通知'
        },
        {
          value: '黑名單警告'
        }
      ],
      textMap: {
        update: '编辑',
        create: '添加'
      },
      form: {
        name: undefined,
        departmentId: this.$store.getters.departmentId,
        appId: undefined,
        appSecret: undefined,
        token: undefined,
        encodingAesKey: undefined,
        codeType: '1',
        type: '0',
        accessType: '0',
        originalId: undefined
      },
      formRules: {
        name: [
          {required: true, trigger: 'blur', message: '请填写规则名称'}
        ]
      },
      objAck: {
        appId: undefined,
        sForm: [
          {
            templateTitle: undefined,
            templateId: undefined
          }
        ]
      },
      addDialog: false,
      disabled: true,
      dialogFormVisible: false,
      dialogLookIpVisible: false,
      dialogMenuVisible: false,
      menus: [],
      menuContent: {},
      activeName: 0,
      disabledDrag: false,
      saveLoading: false,
      menuRow: null,
      jsonData: [
        {
          title: '企业名称',
          key: 'departmentName',
          type: 'text'
        },
        {
          title: '账号分类',
          key: 'type',
          type: 'text'
        },
        {
          title: '状态',
          key: 'status',
          type: 'text'
        },
        {
          title: '名称',
          key: 'name',
          type: 'text'
        },
        {
          title: '默认状态',
          key: 'current',
          type: 'text'
        },
        {
          title: '使用资源',
          key: 'self',
          type: 'text'
        }
        // ,
        // {
        //   title: 'Pic',
        //   key: 'pic',
        //   type: 'image',
        //   width: 80,
        //   height: 50
        // }
      ]
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item, index) => {
        item.type = this.wxTypeFormatter(item.type)
        item.status = this.enableFormatter(item.status)
        item.current = this.currentFormatter(item.current)
        item.self = this.selfFormatter(item.self)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    // 获取列表
    fetchData () {
      this.listLoading = true
      httpGet(wxManager + '/' + this.$store.getters.departmentId).then(res => {
        if (res.data === null) {
          this.tableData = []
          // this.total = 0
        } else {
          this.tableData = res.data
          // this.total = res.data.total
        }
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 添加模板
    addInfo () {
      this.$refs.ssdd.validate((valid) => {
        if (valid) {
          let faceWxTemplateInfoInsertDto = {
            departmentId: Number(this.$store.getters.departmentId),
            sForm: this.objAck.sForm,
            wxAppid: this.appId
          }
          httpPost(templateInfo, faceWxTemplateInfoInsertDto).then((res) => {
            this.$message({
              type: 'success',
              duration: 3000,
              message: res.message
            })
            this.addDialog = false
          }).catch(() => {
          })
        }
      })
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.fetchData()
    },
    handleCurrentChange (val) {
      this.listQuery.offset = val
      this.fetchData()
    },
    // 选中
    handleSelectionChange (val) {
      this.selectArrayId = []
      val.map(item => {
        this.selectArrayId.push(item.id)
      })
      if (this.selectArrayId.length !== 0) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    // 增加一组模板信息
    addOne () {
      this.objAck.sForm.push({
        templateTitle: undefined,
        templateId: undefined
      })
    },
    // 删除一组模板信息
    reduceOne () {
      if (this.objAck.sForm.length !== 1) {
        this.objAck.sForm.pop()
      }
    },
    createData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.createLoading = true
          let param = this.form
          httpPost(wxManager, param).then((res) => {
            this.fetchData()
            this.dialogFormVisible = false
            setTimeout(() => { this.createLoading = false }, 300)
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {
            this.createLoading = false
          })
        }
      })
    },
    updateData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.updateLoading = true
          let param = this.form
          httpPut(wxManager, param).then(res => {
            this.fetchData()
            this.dialogFormVisible = false
            setTimeout(() => { this.updateLoading = false }, 300)
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {
            this.updateLoading = false
          })
        }
      })
    },
    handleCreate () {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      // 延迟调用
      this.$nextTick(() => {
        this.$refs['dataform'].resetFields()
        this.resetForm()
      })
    },
    // 添加模板
    addModel (row) {
      console.log(row)
      this.appId = row.appId
      this.addDialog = true
      let faceWxTemplateSearchDto = {
        appid: this.appId,
        departmentId: Number(this.$store.getters.departmentId)
      }
      httpGet(templateInfo, faceWxTemplateSearchDto).then((res) => {
        if (res.data !== null) {
          this.objAck.sForm = res.data
        }
        console.log(res)
      }).catch(() => {})
    },
    handleUpdate (row) {
      this.form = Object.assign({}, row)
      // num转string
      this.form.type = String(this.form.type)
      this.form.accessType = String(this.form.accessType)
      this.form.codeType = String(this.form.codeType)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.dataform.clearValidate()
      })
    },
    // 获取菜单
    handleMenu (row) {
      // console.log(row)
      this.menuRow = row
      let data = {departmentId: this.$store.getters.departmentId, wxId: row.id}
      httpGet(WXMemu, data)
        .then(res => {
          if (res.code === 1) {
            let arr = []
            for (const v of res.data) {
              if (Number(v.memuLocation) === 1) {
                v.child = []
                arr.unshift(v)
              }
              if (Number(v.memuLocation) === 2) {
                v.child = []
                if (arr.length === 1 && arr[0].memuLocation === 3) {
                  arr.unshift(v)
                } else if (arr.length === 2) {
                  arr.splice(1, 0, v)
                } else {
                  arr.push(v)
                }
              }
              if (Number(v.memuLocation) === 3) {
                v.child = []
                arr.push(v)
              }
            }
            for (const v of res.data) {
              if (v.memuLocation.includes('-') && Number(v.memuLocation.substring(0, 1)) === 1) {
                arr[0].child.push(v)
              }
              if (v.memuLocation.includes('-') && Number(v.memuLocation.substring(0, 1)) === 2) {
                arr[1].child.push(v)
              }
              if (v.memuLocation.includes('-') && Number(v.memuLocation.substring(0, 1)) === 3) {
                arr[2].child.push(v)
              }
            }
            // console.log(arr, 'arr')
            this.menus = arr
          }
        }).catch(() => {})
      this.dialogMenuVisible = true
    },
    onclosedMenu () {
      this.menuContent = {}
      this.activeName = 0
      this.disabledDrag = false
    },
    handleCloseMenu (done) {
      this.$confirm('确认放弃编辑？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 重置form表单
    resetForm () {
      this.form = {
        name: undefined,
        departmentId: this.$store.getters.departmentId,
        appId: undefined,
        appSecret: undefined,
        token: undefined,
        encodingAesKey: undefined,
        codeType: '1',
        type: '0',
        accessType: '0'
      }
    },
    handleDelete (row) {
      this.$confirm('确定要删除吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true
          httpDelete(wxManager + '/' + row.id).then(res => {
            this.deleteLoading = false
            this.fetchData()
          }).catch(() => {
            this.deleteLoading = false
          })
        })
    },
    // 增加
    addMenu () {
      let obj = {
        memuLocation: this.menus.length + 1,
        menuFirstLevel: '菜单名称',
        type: null,
        link: null,
        miniprogramAppid: null,
        miniprogramPagepath: null,
        child: []
      }
      this.menus = this.menus.concat([obj])
    },
    addMenuChild (i) {
      let obj = {
        miniprogramAppid: null,
        memuLocation: (i + 1) + '-' + (this.menus[i].child.length + 1),
        menuSecondLevel: '子菜单名称',
        miniprogramPagepath: null,
        type: null,
        link: null
      }
      this.menus[i].child = this.menus[i].child.concat([obj])
    },
    // 删除
    delMenu (menuI, id) {
      this.$confirm('删除后菜单下设置的内容将被删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.menus.splice(menuI, 1)
        this.menuContent = {}
      }).catch(() => {})
    },
    delMenuChild (menuI, childI, id) {
      this.$confirm('删除后菜单下设置的内容将被删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.menus[menuI].child.splice(childI, 1)
        this.menuContent = {}
      }).catch(() => {})
    },
    // 选择
    selectMenu (type, item, menuI, childI) {
      if (this.disabledDrag) {
        let obj = { menudata: item, menuI, childI, type }
        this.menuContent = obj
      }
    },
    // 保存内容
    saveMenu ({ type, form, menuI, childI }) {
      if (type === 'f') { // 主菜单
        this.menus.splice(menuI, 1, form)
      }
      if (type === 'c') { // 子菜单
        this.menus[menuI].child.splice(childI, 1, form)
      }
    },
    // 保存编辑
    saveData () {
      this.saveLoading = true
      let menus = this.menus
      let postdata = {
        departmentId: this.$store.getters.departmentId,
        wxId: this.menuRow.id,
        wxCreateMenus: []
      }
      for (const v of menus) {
        let obj = {
          memuLocation: v.memuLocation,
          name: v.menuFirstLevel,
          type: v.type,
          url: v.link,
          appid: v.miniprogramAppid,
          pagepath: v.miniprogramPagepath,
          sub_button: []
        }
        if (v.child.length !== 0) {
          for (const v2 of v.child) {
            obj.sub_button.push({
              appid: v2.miniprogramAppid,
              memuLocation: v2.memuLocation,
              name: v2.menuSecondLevel,
              pagepath: v2.miniprogramPagepath,
              type: v2.type,
              url: v2.link
            })
          }
        }
        postdata.wxCreateMenus.push(obj)
      }
      httpPost(WXMemu, postdata).then(res => {
        this.dialogMenuVisible = false
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 4 * 1000
        })
        setTimeout(() => { this.saveLoading = false }, 300)
      }).catch((err) => {
        this.$message.error(err)
      })
    },
    // 排序
    dragUpdateChild (i, evt) {
      let oldIndex = evt.oldIndex
      let newIndex = evt.newIndex
      let old = this.menus[i].child[oldIndex].memuLocation
      let ne = this.menus[i].child[newIndex].memuLocation
      this.$set(this.menus[i].child[oldIndex], 'memuLocation', ne)
      this.$set(this.menus[i].child[newIndex], 'memuLocation', old)
    },
    dragUpdate (evt) {
      let oldIndex = evt.oldIndex
      let newIndex = evt.newIndex
      let old = this.menus[oldIndex].memuLocation
      let ne = this.menus[newIndex].memuLocation
      this.$set(this.menus[oldIndex], 'memuLocation', ne)
      this.$set(this.menus[newIndex], 'memuLocation', old)
    },
    // 完成排序
    saveSort () {
      this.disabledDrag = true
    },
    onQuestion () {
      // this.$alert('暂无', '操作说明', {showConfirmButton: false})
      const h = this.$createElement
      const message = h('div', null, [
        h('p', { style: 'font-weight: bold' }, '如何排序菜单？'),
        h('p', null, '点击选择排序，即可进行排序菜单(默认位于排序菜单)。点击拖拽菜单项到对应位置即可，如未添加菜单，请先添加菜单。'),
        h('p', { style: 'font-weight: bold' }, '如何编辑菜单？'),
        h('p', null, '点击选择编辑，即可进行编辑菜单(默认位于排序菜单)。点击对应菜单项，即可编辑内容，二级菜单需先点击一级菜单展开。'),
        h('p', { style: 'font-weight: bold' }, '如何添加菜单项？'),
        h('p', null, '进入编辑菜单，添加一级菜单点击“添加一级菜单”按钮，添加二级菜单需先点击一级菜单展开再点击“+”按钮（一级菜单最多3个，二级菜单最多5个）。'),
        h('p', { style: 'font-weight: bold' }, '为何编辑的菜单项内容未保存？'),
        h('p', null, '点击对应菜单项编辑完内容后，需点击右上角保存按钮，内容才会保存。')
      ])
      this.$msgbox({
        title: '操作说明',
        message,
        showConfirmButton: false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.danger {
  color: #f56c6c;
  font-size: 16px;
}
.first-menu {
  &:hover, &:focus {
    color: #409EFF;
  }
}
.questionicon {
  position: absolute;
  top: 22px;
  right: 40px;
  &:hover {
     cursor: pointer;
  }
}
</style>
