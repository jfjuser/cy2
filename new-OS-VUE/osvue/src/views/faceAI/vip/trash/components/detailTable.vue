<template>
  <el-table
    stripe
    :header-cell-style="{background:'#f3f4f6'}"
    style="width: 100%"
    max-height="600"
    :data="data"
    @selection-change="handleSelectionChange"
    element-loading-text="加载中..."
    border
    fit
    highlight-current-row
  >
    <el-table-column type="selection" width="40" fixed="left"></el-table-column>
    <template v-if="istype === '普通白名单'">
      <el-table-column label="车主姓名" align="center" prop="userName"></el-table-column>
      <el-table-column label="通道名称" align="center" prop="deviceName"></el-table-column>
      <el-table-column label="车牌号码" align="center" prop="plate"></el-table-column>
      <el-table-column label="联系方式" align="center" prop="userPhone"></el-table-column>
      <el-table-column label="开始时间" align="center" :key="Math.random()">
        <template slot-scope="scope">{{timeFormatter(scope.row.enableTime)}}</template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" :key="Math.random()">
        <template slot-scope="scope">{{timeFormatter(scope.row.overdueTime)}}</template>
      </el-table-column>
      <el-table-column label="备注信息" align="center" prop="reason"></el-table-column>
    </template>
    <template v-if="istype === '高级白名单'">
      <el-table-column label="车主姓名" align="center" prop="userName"></el-table-column>
      <el-table-column label="通道名称" align="center" prop="localName"></el-table-column>
      <el-table-column label="车牌号码" align="center" prop="plate"></el-table-column>
      <el-table-column label="车位数" align="center" prop="carTal"></el-table-column>
      <el-table-column label="联系方式" align="center" prop="userPhone"></el-table-column>
      <el-table-column label="时段一" align="center" :key="Math.random()">
        <template slot-scope="scope">{{scope.row.time1}} - {{scope.row.time2}}</template>
      </el-table-column>
      <el-table-column label="时段二" align="center" :key="Math.random()">
        <template slot-scope="scope">{{scope.row.time3}} - {{scope.row.time4}}</template>
      </el-table-column>
      <el-table-column label="开始时间" align="center" :key="Math.random()">
        <template slot-scope="scope">{{timeFormatter(scope.row.startTime)}}</template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" :key="Math.random()">
        <template slot-scope="scope">{{timeFormatter(scope.row.endTime)}}</template>
      </el-table-column>
      <el-table-column label="备注信息" align="center" prop="reason"></el-table-column>
    </template>
    <!-- 固定车 -->
    <template v-if="istype === '盒子白名单'">
      <el-table-column label="车主姓名" align="center" prop="name"></el-table-column>
      <el-table-column label="车牌号码" align="center" prop="plate"></el-table-column>
      <el-table-column label="联系方式" align="center" prop="phone"></el-table-column>
      <el-table-column label="车位信息" align="center" prop="carcw"></el-table-column>
      <el-table-column label="开始时间" align="center" prop="beginTime" :key="Math.random()">
        <template slot-scope="scope">{{timeFormatter(scope.row.beginTime)}}</template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="endTime" :key="Math.random()">
        <template slot-scope="scope">{{timeFormatter(scope.row.endTime)}}</template>
      </el-table-column>
      <el-table-column label="备注信息" align="center" prop="reason"></el-table-column>
    </template>
    <template v-if="istype === '渣土白名单'">
      <el-table-column label="车场名称" align="center" prop="departmentName"></el-table-column>
      <el-table-column label="本地编号" align="center" prop="localId"></el-table-column>
      <el-table-column label="车主姓名" align="center" prop="carName"></el-table-column>
      <el-table-column label="车牌号码" align="center" prop="plate"></el-table-column>
      <el-table-column label="联系方式" align="center" prop="carPhone"></el-table-column>
      <el-table-column label="开始时间" align="center" :key="Math.random()">
        <template slot-scope="scope">
          {{timeFormatter(scope.row.startTime)}}
        </template>
      </el-table-column>
      <el-table-column label="有效期至" align="center" :key="Math.random()">
        <template slot-scope="scope">
          {{timeFormatter(scope.row.validateAt)}}
        </template>
      </el-table-column>
      <el-table-column label="备注信息" align="center" prop="remarks"></el-table-column>
    </template>
    <template v-if="istype === '特殊车'">
       <el-table-column label="标识符" align="center" prop="sign"></el-table-column>
        <el-table-column label="所处位置" align="center" prop="position" :key="Math.random()">
          <template slot-scope="scope">
            <el-button  type="danger" size="mini">{{ positionFormatter(scope.row.position) }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="备注信息" align="center" prop="remark"></el-table-column>
    </template>
    <template v-if="istype === '免费车'">
      <el-table-column label="所属车场" align="center" prop="departmentName"></el-table-column>
      <el-table-column label="车牌号码" align="center" prop="plate"></el-table-column>
      <el-table-column label="开始时间" align="center" prop="startTime" :key="Math.random()">
        <template slot-scope="scope">
          {{timeFormatter(scope.row.startTime)}}
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="endTime" :key="Math.random()">
        <template slot-scope="scope">
          {{timeFormatter(scope.row.endTime)}}
        </template>
      </el-table-column>
      <el-table-column label="备注信息" align="center" prop="remarks"></el-table-column>
    </template>
    <template v-if="istype === '盒子免费车'">
      <el-table-column label="车牌号码" align="center" prop="plate"></el-table-column>
      <el-table-column label="开始时间" align="center" prop="beginTime" :key="Math.random()">
        <template slot-scope="scope">
            {{timeFormatter(scope.row.beginTime)}}
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="endTime" :key="Math.random()">
        <template slot-scope="scope">
            {{timeFormatter(scope.row.endTime)}}
        </template>
      </el-table-column>
      <el-table-column label="操作员" align="center" prop="operatorName"></el-table-column>
    </template>
    <template v-if="istype === '人脸识别-用户'">
      <template v-if="themeType === 1 || themeType === 4 || themeType === 5">
         <el-table-column label="姓名" align="center" prop="userName"></el-table-column>
          <el-table-column label="手机号" align="center" prop="phone"></el-table-column>
          <!-- <el-table-column label="地址" align="center" prop="addr"></el-table-column> -->
          <el-table-column label="韦根卡号" align="center" prop="wiegandCard"></el-table-column>
          <el-table-column label="类型" align="center" prop="type" :key="Math.random()">
            <template slot-scope="scope">
              <span v-if="scope.row.type === 0">非访客</span>
              <span v-if="scope.row.type === 1">访客</span>
              <span v-if="scope.row.type === 2">黑名单</span>
            </template>
          </el-table-column>
          <el-table-column label="审核状态" align="center" prop="isCheck" :key="Math.random()">
            <template slot-scope="scope">
              {{checkStatusFormatter(scope.row.isCheck)}}
            </template>
          </el-table-column>
          <el-table-column label="同步信息" align="center" prop="aiPower"></el-table-column>
          <el-table-column label="有效日期" align="center" prop="endTime" :key="Math.random()">
            <template slot-scope="scope">
              {{timeFormatter(scope.row.endTime)}}
            </template>
          </el-table-column>
          <el-table-column label="备注信息" align="center" prop="remarks"></el-table-column>
      </template>

      <template v-if="themeType === 2 || themeType === 3">
        <el-table-column label="韦根卡号" align="center" prop="wiegandCard"></el-table-column>
        <el-table-column label="姓名" align="center" prop="userName"></el-table-column>
        <el-table-column :label="themeType === 1 ? '校验码' : (themeType === 2? '工号' : (themeType === 3? '学号' : '校验码'))" align="center" prop="idCard"></el-table-column>
        <el-table-column label="手机号" align="center" prop="phone"></el-table-column>
        <el-table-column label="地址" align="center" prop="addr"></el-table-column>
        <el-table-column label="类型" align="center" prop="type" :key="Math.random()">
          <template slot-scope="scope">
            <span v-if="!scope.row.type">非访客</span>
            <span v-if="scope.row.type">访客</span>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" align="center" prop="isCheck" :key="Math.random()">
          <template slot-scope="scope">
            {{checkStatusFormatter(scope.row.isCheck)}}
          </template>
        </el-table-column>
        <el-table-column label="同步信息" align="center" prop="aiPower"></el-table-column>
        <el-table-column label="有效日期" align="center" prop="endTime" :key="Math.random()">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.endTime)}}
          </template>
        </el-table-column>
        <el-table-column label="备注信息" align="center" prop="remarks"></el-table-column>
      </template>
    </template>
    <template v-if="istype === '人脸识别-账户'">
      <template v-if="themeType === 1 || themeType === 4 || themeType === 5">
        <el-table-column label="登录名" align="center" prop="loginName"></el-table-column>
        <el-table-column label="班组名称" align="center" prop="teamName" v-if="themeType === 5"></el-table-column>
        <el-table-column :label="themeType === 1? '业主姓名': (themeType === 2? '部门名称' : (themeType === 3? '班级名称' : (themeType === 4? '账户名称' : '带班名称')))"  align="center" prop="leader"></el-table-column>
        <el-table-column label="手机号" align="center" prop="phone"></el-table-column>
        <el-table-column label="性别" align="center" prop="sex" :key="Math.random()">
          <template slot-scope="scope">
            {{sexFormatter(scope.row.sex)}}
          </template>
        </el-table-column>
        <el-table-column :label="themeType === 1? '房号' : '地址'" align="center" prop="addr"></el-table-column>
        <!-- <el-table-column label="成员" align="center" prop="tenant"></el-table-column> -->
        <el-table-column label="审核方式" align="center" prop="isCheck" :key="Math.random()">
          <template slot-scope="scope">
            {{checkFormatter(scope.row.isCheck)}}
          </template>
        </el-table-column>
        <el-table-column :label="themeType === 1? '家庭人数': (themeType === 2? '部门人数' : (themeType === 3? '班级人数' : (themeType === 4? '成员人数' : '非访客人数')))" align="center" prop="userNum"></el-table-column>
        <!-- <el-table-column label="访客人数" align="center" prop="visitorNum"></el-table-column> -->
      </template>

      <template v-if="themeType === 2 || themeType === 3">
        <el-table-column label="登录名" align="center" prop="loginName"></el-table-column>
        <el-table-column :label="themeType === 1? '业主姓名': (themeType === 2? '部门名称' : (themeType === 3? '班级名称' : (themeType === 4? '账户名称' : '班组名称')))"  align="center" prop="leader"></el-table-column>
        <el-table-column label="手机号" align="center" prop="phone"></el-table-column>
        <el-table-column label="地址" align="center" prop="addr"></el-table-column>
        <el-table-column label="审核方式" align="center" prop="isCheck" :key="Math.random()">
          <template slot-scope="scope">
            {{checkFormatter(scope.row.isCheck)}}
          </template>
        </el-table-column>
        <el-table-column :label="themeType === 1? '家庭人数': (themeType === 2? '部门人数' : (themeType === 3? '班级人数' : (themeType === 4? '成员人数' : '非访客人数')))" align="center" prop="userNum"></el-table-column>
        <el-table-column label="访客人数" align="center" prop="visitorNum"></el-table-column>
      </template>
    </template>

    <el-table-column
      fixed="right"
      label="操作"
      v-if="isShowColumnFormatter(['恢复'])"
      align="center"
      class-name="small-padding fixed-width"
      width="100"
    >
      <template slot-scope="scope">
        <el-button
          type="primary"
          v-has="['恢复']"
          @click.native="recoveryOne(scope.row)"
          size="mini"
        >恢复</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import {
  isShowColumnFormatter,
  timeFormatter,
  trashFormatter,
  positionFormatter,
  checkStatusFormatter,
  sexFormatter,
  checkFormatter
} from '@/utils/formatter.js'
export default {
  props: {
    data: Array,
    detailRow: Object
  },
  data () {
    return {
      isShowColumnFormatter: isShowColumnFormatter,
      timeFormatter: timeFormatter,
      positionFormatter: positionFormatter,
      checkStatusFormatter: checkStatusFormatter,
      sexFormatter: sexFormatter,
      checkFormatter: checkFormatter
    }
  },
  computed: {
    istype () {
      return trashFormatter(this.detailRow.type)
    },
    themeType () {
      return this.$store.getters.themeType
    }
  },
  methods: {
    recoveryOne (row) {
      this.$emit('recoveryOne', row)
    },
    handleSelectionChange (val) {
      this.$emit('selection-change', val)
    }
  }
}
</script>
