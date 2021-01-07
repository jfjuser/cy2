<template>
  <div class="container">
    <div>
      <NavBar
        title="对接协议"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
    </div>
    <div>
      <label style="line-height:2rem;font-size:1rem;margin-left:0.8rem">对接协议</label>
      <RadioGroup v-model="protoArr" @change="checkSelect" :disabled="ff !== undefined" style="line-height:1.8rem;font-size:0.9rem;margin:0rem 0 0.5rem 10%">
          <Radio v-for="item in protocolData" style="display:inline-block;line-height:2rem;margin-left:2rem" :key="item.id" :name="item.id">{{item.protocolName}}</Radio>
      </RadioGroup>
      <!-- <Button type="info" :disabled="total" style="margin-left:0.5rem" @click="handleCreate">添加</Button> -->
      <Button type="info" style="margin-left:1rem" :disabled="!total" @click="deletePro">删除</Button>
      <div style="height:60vh;margin-top:1rem" v-show="sum == 0">
        <img src='@/assets/no-data.png' style="max-width:100vw;max-height:auto;opacity:0.6"/>
      </div>
      <div class="demo-input-suffix">
        <div style="margin-top:1rem" v-if="infoData.protocolKeyFirstRemark != undefined">
          <span class="labelNum">秘钥一</span>
          <Field
            placeholder="秘钥"
            class="inputStyle"
            v-model="infoData.protocolKeyFirst"
          />
          <Field
            class="remarkStyle"
            disabled
            v-model="infoData.protocolKeyFirstRemark"
          />
        </div>
        <div style="margin-top:1rem" v-if="infoData.protocolKeyTwoRemark != undefined">
          <label class="labelNum">秘钥二</label>
          <Field
            placeholder="秘钥"
            class="inputStyle"
            v-model="infoData.protocolKeyTwo"
          />
          <Field
            class="remarkStyle"
            disabled
            v-model="infoData.protocolKeyTwoRemark"
          />
        </div>
        <div style="margin-top:1rem" v-show="infoData.protocolKeyThreeRemark != undefined">
          <label class="labelNum">秘钥三</label>
          <Field
            placeholder="秘钥"
            class="inputStyle"
            v-model="infoData.protocolKeyThree"
          />
          <Field
            class="remarkStyle"
            disabled
            v-model="infoData.protocolKeyThreeRemark"
          />
        </div>
        <div style="margin-top:1rem" v-show="infoData.protocolKeyFourRemark != undefined">
          <label class="labelNum">秘钥四</label>
          <Field
            placeholder="秘钥"
            class="inputStyle"
            v-model="infoData.protocolKeyFour"
          />
          <Field
            class="remarkStyle"
            disabled
            v-model="infoData.protocolKeyFourRemark"
          />
        </div>
        <div style="margin-top:1rem" v-show="infoData.protocolKeyFiveRemark != undefined">
          <label class="labelNum">秘钥五</label>
          <Field
            placeholder="秘钥"
            class="inputStyle"
            v-model="infoData.protocolKeyFive"
          />
          <Field
            class="remarkStyle"
            disabled
            v-model="infoData.protocolKeyFiveRemark"
          />
        </div>
        <div style="margin-top:1rem" v-show="infoData.protocolKeySixRemark != undefined">
          <label class="labelNum">秘钥六</label>
          <Field
            placeholder="秘钥"
            class="inputStyle"
            v-model="infoData.protocolKeySix"
          />
          <Field
            class="remarkStyle"
            disabled
            v-model="infoData.protocolKeySixRemark"
          />
        </div>
        <div style="margin-top:1rem" v-show="infoData.protocolKeySevenRemark != undefined">
          <label class="labelNum">秘钥七</label>
          <Field
            placeholder="秘钥"
            class="inputStyle"
            v-model="infoData.protocolKeySeven"
          />
          <Field
            class="remarkStyle"
            disabled
            v-model="infoData.protocolKeySevenRemark"
          />
        </div>
        <div style="margin-top:1rem" v-show="infoData.protocolKeyEightRemark != undefined">
          <label class="labelNum">秘钥八</label>
          <Field
            placeholder="秘钥"
            class="inputStyle"
            v-model="infoData.protocolKeyEight"
          />
          <Field
            class="remarkStyle"
            disabled
            v-model="infoData.protocolKeyEightRemark"
          />
        </div>
        <div style="margin-top:1rem" v-show="infoData.protocolKeyNineRemark != undefined">
          <label class="labelNum">秘钥九</label>
          <Field
            placeholder="秘钥"
            class="inputStyle"
            v-model="infoData.protocolKeyNine"
          />
          <Field
            class="remarkStyle"
            disabled
            v-model="infoData.protocolKeyNineRemark"
          />
        </div>
        <div style="margin-top:1rem" v-show="infoData.protocolKeyTenRemark != undefined">
          <label class="labelNum">秘钥十</label>
          <Field
            placeholder="秘钥"
            class="inputStyle"
            v-model="infoData.protocolKeyTen"
          />
          <Field
            class="remarkStyle"
            disabled
            v-model="infoData.protocolKeyTenRemark"
          />
        </div>
      </div>
      <Button style="margin: 2rem 0 2rem 80%;" type="info"  @click="updateContent">修改</Button>
    </div>
     <!-- <Popup position="top" v-model="dialogFormVisible" style="width:96vw;height:40rem;">
        <form ref="dataform" :model="form">
          <span class="labelNum">秘钥一</span>
            <Field v-model="form.protocolKeyFirst"  clearable placeholder="请输入秘钥名称"/>
          <span class="labelNum">秘钥二</span>
            <Field v-model="form.protocolKeyTwo"  clearable placeholder="请输入秘钥名称"/>
          <span class="labelNum">秘钥三</span>
            <Field v-model="form.protocolKeyThree"  clearable placeholder="请输入秘钥名称"/>
          <span class="labelNum">秘钥四</span>
            <Field v-model="form.protocolKeyFour"  clearable placeholder="请输入秘钥名称"/>
          <span class="labelNum">秘钥五</span>
            <Field v-model="form.protocolKeyFive"  clearable placeholder="请输入秘钥名称"/>
          <span class="labelNum">秘钥六</span>
            <Field v-model="form.protocolKeySix"  clearable placeholder="请输入秘钥名称"/>
          <span class="labelNum">秘钥七</span>
            <Field v-model="form.protocolKeySeven"  clearable placeholder="请输入秘钥名称"/>
          <span class="labelNum">秘钥八</span>
            <Field v-model="form.protocolKeyEight"  clearable placeholder="请输入秘钥名称"/>
          <span class="labelNum">秘钥九</span>
            <Field v-model="form.protocolKeyNine"  clearable placeholder="请输入秘钥名称"/>
          <span class="labelNum">秘钥十</span>
            <Field v-model="form.protocolKeyTen"  clearable placeholder="请输入秘钥名称"/>
        </form>
        <div>
          <Button @click="dialogFormVisible = false">取消</Button>
          <Button :loading = "createLoading"  type="info" @click="createData">保存</Button>
        </div>
      </Popup> -->
  </div>
</template>
<script>
import { isShowColumnFormatter } from '@/utils/formatter.js'
import { httpGet, httpPost, httpDelete } from '@/utils/restful'
import { getFullInfo, addInfo, getRemark, delInfo } from '@/api/url' // , getRemark
import { NavBar, RadioGroup, Radio, Button, Field, Dialog, Cell, Toast, Popup } from 'vant'
export default {
  name: 'docking',
  components: { NavBar, RadioGroup, Radio, Button, Field, Cell, Popup },
  data () {
    return {
      list: null,
      protoArr: undefined,
      listLoading: true,
      createLoading: false,
      total: false,
      updataLoading: false,
      deleteLoading: false,
      roleLoading: false,
      getRoleLoading: false,
      isShowColumnFormatter: isShowColumnFormatter,
      count: undefined,
      sum: undefined,
      tableData: [],
      protocolData: [],
      infoData: {
        id: undefined,
        protocolKeyFirst: undefined,
        protocolKeyFirstRemark: undefined,
        protocolKeyTwo: undefined,
        protocolKeyTwoRemark: undefined,
        protocolKeyThree: undefined,
        protocolKeyThreeRemark: undefined,
        protocolKeyFour: undefined,
        protocolKeyFourRemark: undefined,
        protocolKeyFive: undefined,
        protocolKeyFiveRemark: undefined,
        protocolKeySix: undefined,
        protocolKeySixRemark: undefined,
        protocolKeySeven: undefined,
        protocolKeySevenRemark: undefined,
        protocolKeyEight: undefined,
        protocolKeyEightRemark: undefined,
        protocolKeyNine: undefined,
        protocolKeyNineRemark: undefined,
        protocolKeyTen: undefined,
        protocolKeyTenRemark: undefined
      },
      dialogFormVisible: false,
      selectArrayId: [],
      disabled: true,
      ff: undefined,
      ids: undefined,
      form: {
        protocolKeyFirst: '',
        protocolKeyTwo: '',
        protocolKeyThree: '',
        protocolKeyFour: '',
        protocolKeyFive: '',
        protocolKeySix: '',
        protocolKeySeven: '',
        protocolKeyEight: '',
        protocolKeyNine: '',
        protocolKeyTen: ''
      }
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    onClickLeft () {
      this.$router.push('/siteManage/')
    },
    fetchData () {
      httpGet(getFullInfo + '/' + this.$store.getters.departmentId).then(res => {
        console.log(res)
        if (res.data.thirdProtocolDtos === null) {
          this.protocolData = []
          this.sum = 0
        } else {
          this.protocolData = res.data.thirdProtocolDtos
          this.sum = 17
        }
        if (res.data.protocolRemarkDo === null) {
          // this.infoData = {}
          // this.protoArr = undefined
        } else {
          this.infoData = res.data.protocolRemarkDo
          this.protoArr = res.data.protocolRemarkDo.thirdProtocolId
          this.ff = '123'
        }
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
        this.sum = 0
      })
    },
    deletePro () {
      Dialog.confirm({
        message: '确认要删除所有秘钥吗？',
        title: '提示'
      })
        .then(() => {
          let id = this.infoData.id
          httpDelete(delInfo + '/' + id + '/' + this.$store.getters.departmentId)
            .then((res) => {
              Toast({
                message: res.message,
                type: 'success',
                duration: 4 * 1000
              })
              this.fetchData()
            }).catch(() => {})
          this.fetchData()
        }).catch(() => {})
    },
    rest () {
      this.infoData = {
        id: undefined,
        protocolKeyFirst: undefined,
        protocolKeyFirstRemark: undefined,
        protocolKeyTwo: undefined,
        protocolKeyTwoRemark: undefined,
        protocolKeyThree: undefined,
        protocolKeyThreeRemark: undefined,
        protocolKeyFour: undefined,
        protocolKeyFourRemark: undefined,
        protocolKeyFive: undefined,
        protocolKeyFiveRemark: undefined,
        protocolKeySix: undefined,
        protocolKeySixRemark: undefined,
        protocolKeySeven: undefined,
        protocolKeySevenRemark: undefined,
        protocolKeyEight: undefined,
        protocolKeyEightRemark: undefined,
        protocolKeyNine: undefined,
        protocolKeyNineRemark: undefined,
        protocolKeyTen: undefined,
        protocolKeyTenRemark: undefined
      }
    },
    checkSelect () {
      httpGet(getRemark + '/' + this.protoArr)
        .then((res) => {
          console.log(res)
          // this.rest()
          if (res.data !== null) {
            this.infoData = Object.assign(this.infoData, res.data)
            // this.infoData = res.data
            this.total = true
            this.fetchData()
          }
        })
      console.log(this.protoArr)
    },
    handleCreate () {
      if (this.protoArr === undefined) {
        Toast('请先选择协议再添加')
      } else {
        let self = this
        self.dialogFormVisible = true
      }
      // this.form = Object.assign(this.form, JSON.parse(x))
      // 延迟调用
      // self.$nextTick(() => {
      //   self.$refs['dataform'].resetFields()
      //   self.resetForm()
      // })
    },
    // 新增
    createData () {
      this.createLoading = true
      this.thirdProtocolPram = Object.assign(this.form, {
        departmentId: parseInt(this.$store.getters.departmentId),
        thirdProtocolId: this.protoArr
      })
      httpPost(addInfo, this.thirdProtocolPram).then(res => {
        this.createLoading = false
        this.fetchData()
        this.dialogFormVisible = false
        Toast({
          message: res.message,
          type: 'success',
          duration: 4 * 1000
        })
      }).catch(() => {
        this.createLoading = false
      })
    },
    updateContent () {
      httpGet(getFullInfo + '/' + this.$store.getters.departmentId)
        .then(res => {
          this.protoArr = res.data.protocolRemarkDo.thirdProtocolId
        }).catch(() => {})
      this.thirdProtocolPram = Object.assign(this.infoData, {
        departmentId: parseInt(this.$store.getters.departmentId),
        thirdProtocolId: this.protoArr
      })
      httpPost(addInfo, this.thirdProtocolPram).then(res => {
        Toast({
          message: res.message,
          type: 'success',
          duration: 4 * 1000
        })
        this.ff = '123'
        this.fetchData()
        console.log(res)
      }).catch(() => {
      })
    }
  }
}
</script>
<style lang="scss">
.container{
  background: url(../../assets/bind-back.jpg);
  background-size: 100%;
  height: 100vh
}
.labelNum{
  margin:0 20px;
  margin-left:1rem;
  font-size:15px;
  display:line-block;
}
.inputStyle{
  display:inline-block;
  width:40vw;
  border-radius:4px;
  margin-bottom:-1rem;
  line-height:20px;
  border: 1px solid #ccc;
  opacity:0.6;
}
.remarkStyle{
  display:inline-block;
  width:25vw;
  margin-left:5vw;
  line-height:20px;
  border-radius:3px;
  opacity:0.6;
  margin-bottom:-1rem;
}
</style>
