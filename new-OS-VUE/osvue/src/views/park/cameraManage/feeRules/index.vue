<template>
  <div class="app-container">
    <div class="table-main">
      <el-form :inline="true" v-has="['测试算费']">
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="testForm.beginTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="testForm.endTime"
            @change="endTimeChange"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="停车时长">
         <span style="color:red;">{{timeValue}} 分钟</span>
        </el-form-item>
        <el-form-item >
          <el-button @click="save">保存</el-button>
        </el-form-item>
      </el-form>
      <el-form ref="form" :model="form" label-width="120px">
        <el-tabs v-model="activeName" tabPosition="left" @tab-click="tabClick">
          <el-tab-pane label="24段收费类型设置" name="first">
            <el-header>24段收费类型设置 &#x3000; <el-tag v-if="visible1" type="success">当前选择</el-tag></el-header>
            <el-main>
              <el-row>
                <template>停车时间在 &#x3000; <el-input-number v-model="form.freeTime" :min="0" :max="10000" controls-position="right"></el-input-number> &#x3000; 分钟内免费</template>
              </el-row>
              <el-row type="flex">
                <el-col>停车时间在 &#x3000; <template><el-input-number v-model="form.firstTime" :min="0" :max="10000" controls-position="right"></el-input-number></template> &#x3000; 分钟内</el-col>
                <el-col>收费 &#x3000; <template><el-input-number v-model="form.firstMoney" :min="0" :max="10000" :step="0.01" :precision = "2" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
              </el-row>
              <el-row type="flex">
                <el-col>停车时间在 &#x3000; <template><el-input-number v-model="form.nextTime" :min="0" :max="10000" controls-position="right"></el-input-number></template> &#x3000; 分钟内</el-col>
                <el-col>收费 &#x3000; <template><el-input-number v-model="form.nextMoney" :min="0" :max="10000" :step="0.01" :precision = "2" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
              </el-row>
              <el-row type="flex">
                <el-col>停车时间在 &#x3000; <template><el-input-number v-model="form.tm3" :min="0" :max="10000" controls-position="right"></el-input-number></template> &#x3000; 分钟内</el-col>
                <el-col>收费 &#x3000; <template><el-input-number v-model="form.mm3" :min="0" :max="10000" :step="0.01" :precision = "2" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
              </el-row>
              <el-row type="flex">
                <el-col>停车时间在 &#x3000; <template><el-input-number v-model="form.tm4" :min="0" :max="10000" controls-position="right"></el-input-number></template> &#x3000; 分钟内</el-col>
                <el-col>收费 &#x3000; <template><el-input-number v-model="form.mm4" :min="0" :max="10000" :step="0.01" :precision = "2" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
              </el-row>
              <el-row type="flex">
                <el-col>停车时间在 &#x3000; <template><el-input-number v-model="form.tm5" :min="0" :max="10000" controls-position="right"></el-input-number></template> &#x3000; 分钟内</el-col>
                <el-col>收费 &#x3000; <template><el-input-number v-model="form.mm5" :min="0" :max="10000" :step="0.01" :precision = "2" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
              </el-row>
              <el-row type="flex">
                <el-col>停车时间在 &#x3000; <template><el-input-number v-model="form.tm6" :min="0" :max="10000" controls-position="right"></el-input-number></template> &#x3000; 分钟内</el-col>
                <el-col>收费 &#x3000; <template><el-input-number v-model="form.mm6" :min="0" :max="10000" :step="0.01" :precision = "2" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
              </el-row>
              <el-row type="flex">
                <el-col>停车时间在 &#x3000; <template><el-input-number v-model="form.tm7" :min="0" :max="10000" controls-position="right"></el-input-number></template> &#x3000; 分钟内</el-col>
                <el-col>收费 &#x3000; <template><el-input-number v-model="form.mm7" :min="0" :max="10000" :step="0.01" :precision = "2" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
              </el-row>
              <el-row type="flex">
                <el-col>停车时间在 &#x3000; <template><el-input-number v-model="form.tm8" :min="0" :max="10000" controls-position="right"></el-input-number></template> &#x3000; 分钟内</el-col>
                <el-col>收费 &#x3000; <template><el-input-number v-model="form.mm8" :min="0" :max="10000" :step="0.01" :precision = "2" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
              </el-row>
              <el-row type="flex">
                <el-col>停车时间在 &#x3000; <template><el-input-number v-model="form.tm9" :min="0" :max="10000" controls-position="right"></el-input-number></template> &#x3000; 分钟内</el-col>
                <el-col>收费 &#x3000; <template><el-input-number v-model="form.mm9" :min="0" :max="10000" :step="0.01" :precision = "2" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
              </el-row>
              <el-row type="flex">
                <el-col>停车时间在 &#x3000; <template><el-input-number v-model="form.tm10" :min="0" :max="10000" controls-position="right"></el-input-number></template> &#x3000; 分钟内</el-col>
                <el-col>收费 &#x3000; <template><el-input-number v-model="form.mm10" :min="0" :max="10000" :step="0.01" :precision = "2" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
              </el-row>
              <el-row type="flex">
                <el-col>停车时间在 &#x3000; <template><el-input-number v-model="form.tm11" :min="0" :max="10000" controls-position="right"></el-input-number></template> &#x3000; 分钟内</el-col>
                <el-col>收费 &#x3000; <template><el-input-number v-model="form.mm11" :min="0" :max="10000" :step="0.01" :precision = "2" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
              </el-row>
              <el-row type="flex">
                <el-col>停车时间在 &#x3000; <template><el-input-number v-model="form.tm12" :min="0" :max="10000" controls-position="right"></el-input-number></template> &#x3000; 分钟内</el-col>
                <el-col>收费 &#x3000; <template><el-input-number v-model="form.mm12" :min="0" :max="10000" :step="0.01" :precision = "2" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
              </el-row>
              <el-row type="flex">
                <el-col>停车时间在 &#x3000; <template><el-input-number v-model="form.tm13" :min="0" :max="10000" controls-position="right"></el-input-number></template> &#x3000; 分钟内</el-col>
                <el-col>收费 &#x3000; <template><el-input-number v-model="form.mm13" :min="0" :max="10000" :step="0.01" :precision = "2" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
              </el-row>
              <el-row type="flex">
                <el-col>停车时间在 &#x3000; <template><el-input-number v-model="form.tm14" :min="0" :max="10000" controls-position="right"></el-input-number></template> &#x3000; 分钟内</el-col>
                <el-col>收费 &#x3000; <template><el-input-number v-model="form.mm14" :min="0" :max="10000" :step="0.01" :precision = "2" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
              </el-row>
              <el-row type="flex">
                <el-col>停车时间在 &#x3000; <template><el-input-number v-model="form.tm15" :min="0" :max="10000" controls-position="right"></el-input-number></template> &#x3000; 分钟内</el-col>
                <el-col>收费 &#x3000; <template><el-input-number v-model="form.mm15" :min="0" :max="10000" :step="0.01" :precision = "2" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
              </el-row>
              <el-row type="flex">
                <el-col>停车时间在 &#x3000; <template><el-input-number v-model="form.tm16" :min="0" :max="10000" controls-position="right"></el-input-number></template> &#x3000; 分钟内</el-col>
                <el-col>收费 &#x3000; <template><el-input-number v-model="form.mm16" :min="0" :max="10000" :step="0.01" :precision = "2" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
              </el-row>
              <el-row type="flex">
                <el-col>停车时间在 &#x3000; <template><el-input-number v-model="form.tm17" :min="0" :max="10000" controls-position="right"></el-input-number></template> &#x3000; 分钟内</el-col>
                <el-col>收费 &#x3000; <template><el-input-number v-model="form.mm17" :min="0" :max="10000" :step="0.01" :precision = "2" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
              </el-row>
              <el-row type="flex">
                <el-col>停车时间在 &#x3000; <template><el-input-number v-model="form.tm18" :min="0" :max="10000" controls-position="right"></el-input-number></template> &#x3000; 分钟内</el-col>
                <el-col>收费 &#x3000; <template><el-input-number v-model="form.mm18" :min="0" :max="10000" :step="0.01" :precision = "2" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
              </el-row>
              <el-row type="flex">
                <el-col>停车时间在 &#x3000; <template><el-input-number v-model="form.tm19" :min="0" :max="10000" controls-position="right"></el-input-number></template> &#x3000; 分钟内</el-col>
                <el-col>收费 &#x3000; <template><el-input-number v-model="form.mm19" :min="0" :max="10000" :step="0.01" :precision = "2" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
              </el-row>
              <el-row type="flex">
                <el-col>停车时间在 &#x3000; <template><el-input-number v-model="form.tm20" :min="0" :max="10000" controls-position="right"></el-input-number></template> &#x3000; 分钟内</el-col>
                <el-col>收费 &#x3000; <template><el-input-number v-model="form.mm20" :min="0" :max="10000" :step="0.01" :precision = "2" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
              </el-row>
              <el-row type="flex">
                <el-col>停车时间在 &#x3000; <template><el-input-number v-model="form.tm21" :min="0" :max="10000" controls-position="right"></el-input-number></template> &#x3000; 分钟内</el-col>
                <el-col>收费 &#x3000; <template><el-input-number v-model="form.mm21" :min="0" :max="10000" :step="0.01" :precision = "2" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
              </el-row>
              <el-row type="flex">
                <el-col>停车时间在 &#x3000; <template><el-input-number v-model="form.tm22" :min="0" :max="10000" controls-position="right"></el-input-number></template> &#x3000; 分钟内</el-col>
                <el-col>收费 &#x3000; <template><el-input-number v-model="form.mm22" :min="0" :max="10000" :step="0.01" :precision = "2" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
              </el-row>
              <el-row type="flex">
                <el-col>停车时间在 &#x3000; <template><el-input-number v-model="form.tm23" :min="0" :max="10000" controls-position="right"></el-input-number></template> &#x3000; 分钟内</el-col>
                <el-col>收费 &#x3000; <template><el-input-number v-model="form.mm23" :min="0" :max="10000" :step="0.01" :precision = "2" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
              </el-row>
              <el-row type="flex">
                <el-col>停车时间在 &#x3000; <template><el-input-number v-model="form.tm24" :min="0" :max="10000" controls-position="right"></el-input-number></template> &#x3000; 分钟内</el-col>
                <el-col>收费 &#x3000; <template><el-input-number v-model="form.mm24" :min="0" :max="10000" :step="0.01" :precision = "2" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
              </el-row>
              <el-row type="flex">
                <el-col>单日最大限额 &#x3000; <template><el-input-number v-model="form.maxMoney" :min="0" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
                <el-col>总的最大限额 &#x3000; <template><el-input-number v-model="form.minMoney" :min="0" :step="0.01" :precision = "2" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
              </el-row>
              <el-row v-if = "isShowColumnFormatter(['临时下载'])">
                <template>相机名称 &#x3000;&#x3000;
                  <el-select v-model="macs" multiple placeholder="请选择">
                    <el-option v-for="item in macLists" :key="item.mac" :label="item.localName"  :value="item.mac"></el-option>
                  </el-select>
                </template>
              </el-row>
            </el-main>
          </el-tab-pane>
          <el-tab-pane label="白天夜间收费分段设置" name="second">
            <el-header>白天夜间收费分段设置 &#x3000; <el-tag v-if="visible2" type="success">当前选择</el-tag></el-header>
            <el-main>
              <el-tag size="medium">白天收费设置</el-tag>
              <el-row>
                <template>停车时间在 &#x3000; <el-input-number v-model="form.freeTime" :min="0" :max="10000" controls-position="right"></el-input-number> &#x3000; 分钟内免费</template>
              </el-row>
              <el-row type="flex">
                <el-col>停车时间在 &#x3000; <template><el-input-number v-model="form.firstTime" :min="0" :max="10000" controls-position="right"></el-input-number></template> &#x3000; 分钟内</el-col>
                <el-col>收费 &#x3000; <template><el-input-number v-model="form.firstMoney" :min="0" :max="10000" :step="0.01" :precision = "2" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
              </el-row>
              <el-row type="flex">
                <el-col>停车时间在 &#x3000; <template><el-input-number v-model="form.nextTime" :min="0" :max="10000" controls-position="right"></el-input-number></template> &#x3000; 分钟内</el-col>
                <el-col>收费 &#x3000; <template><el-input-number v-model="form.nextMoney" :min="0" :max="10000" :step="0.01" :precision = "2" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
              </el-row>
              <el-row type="flex">
                <el-col>停车时间在 &#x3000; <template><el-input-number v-model="form.firstTime2" :min="0" :max="10000" controls-position="right"></el-input-number></template> &#x3000; 分钟内</el-col>
                <el-col>收费 &#x3000; <template><el-input-number v-model="form.firstMoney2" :min="0" :max="10000" :step="0.01" :precision = "2" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
              </el-row>
              <el-row type="flex">
                <el-col>每超出停车 &#x3000; <template><el-input-number v-model="form.nextTime2" :min="0" :max="10000" controls-position="right"></el-input-number></template> &#x3000; 分钟</el-col>
                <el-col>加收 &#x3000; <template><el-input-number v-model="form.nextMoney2" :min="0" :max="10000" :step="0.01" :precision = "2" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
              </el-row>
              <el-row>
                <template>白天限额 &#x3000;&#x3000; <el-input-number v-model="form.minMoney" :min="0" controls-position="right"></el-input-number> &#x3000; 元</template>
              </el-row>
              <el-tag type="warning">过夜费设置</el-tag>
              <el-row type="flex">
                <el-col><template>启用时间 &#x3000;&#x3000;
                  <el-time-picker placeholder="开始时间" v-model="form.beginTime"   value-format='HH:mm' @change="changeBeginTime"></el-time-picker> 至 <el-time-picker placeholder="结束时间" v-model="form.endTime"  value-format='HH:mm' @change="changeEndTime"> </el-time-picker></template></el-col>
              </el-row>
              <el-row>
                <template>停车时间在 &#x3000; <el-input-number v-model="form.nightTime" :min="0" :max="10000" controls-position="right"></el-input-number> &#x3000; 分钟内免费</template>
              </el-row>
              <el-row type="flex">
                <el-col>停车时间在 &#x3000; <template><el-input-number v-model="form.firstTime3" :min="0" :max="10000" controls-position="right"></el-input-number></template> &#x3000; 分钟内</el-col>
                <el-col>收费 &#x3000; <template><el-input-number v-model="form.firstMoney3" :min="0" :max="10000" :step="0.01" :precision = "2" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
              </el-row>
              <el-row type="flex">
                <el-col>停车时间在 &#x3000; <template><el-input-number v-model="form.nextTime3" :min="0" :max="10000" controls-position="right"></el-input-number></template> &#x3000; 分钟内</el-col>
                <el-col>收费 &#x3000; <template><el-input-number v-model="form.nextMoney3" :min="0" :max="10000" :step="0.01" :precision = "2" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
              </el-row>
              <el-row type="flex">
                <el-col>停车时间在 &#x3000; <template><el-input-number v-model="form.tm3" :min="0" :max="10000" controls-position="right"></el-input-number></template> &#x3000; 分钟内</el-col>
                <el-col>收费 &#x3000; <template><el-input-number v-model="form.mm3" :min="0" :max="10000" :step="0.01" :precision = "2" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
              </el-row>
              <el-row type="flex">
                <el-col>每超出停车 &#x3000; <template><el-input-number v-model="form.tm4" :min="0" :max="10000" controls-position="right"></el-input-number></template> &#x3000; 分钟</el-col>
                <el-col>加收 &#x3000; <template><el-input-number v-model="form.mm4" :min="0" :max="10000" :step="0.01" :precision = "2" controls-position="right"></el-input-number></template> &#x3000; 元</el-col>
              </el-row>
              <el-row>
                <template>过夜限额 &#x3000;&#x3000; <el-input-number v-model="form.nightMoney" :min="0" controls-position="right"></el-input-number> &#x3000; 元</template>
              </el-row>
              <el-row>
                <template>单日最大限额 &nbsp;<el-input-number v-model="form.maxMoney" :min="0" controls-position="right"></el-input-number> &#x3000; 元</template>
              </el-row>
              <el-row v-if = "isShowColumnFormatter(['临时下载'])">
                <template>相机名称 &#x3000;&#x3000;
                  <el-select v-model="macs" multiple >
                    <el-option v-for="item in macLists"  :key="item.mac" :label="item.localName" :value="item.mac"></el-option>
                  </el-select>
                </template>
              </el-row>
            </el-main>
          </el-tab-pane>
        </el-tabs>
        <el-row>
          <el-col :offset="6" :span="12">
            <div class="grid-content bg-purple">
              <el-form-item>
                <el-button type="info" @click="onInit">初始化</el-button>
                <el-button type="primary" :loading="createloading" @click="onSubmit">保存并下载所有相机</el-button>
                <el-button type="warning"  v-has="['临时下载']" :loading="createSelectLoading" @click="onSelectSubmit">下载所选相机</el-button>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { testFeeRules, FeeRules, getCamera, FeeRulesSelect } from '@/api/url'
import { httpGet, httpPost } from '@/utils/restful'
import { isShowColumnFormatter, minFormatter } from '@/utils/formatter'
export default {
  data () {
    return {
      isShowColumnFormatter: isShowColumnFormatter,
      minFormatter: minFormatter,
      createSelectLoading: false,
      createloading: false,
      form: {
        id: undefined,
        departmentId: this.$store.getters.departmentId,
        freeTime: 60,
        firstTime: 60,
        firstMoney: 0,
        nextTime: 120,
        nextMoney: 0,
        firstTime2: 240,
        firstMoney2: 0,
        nextTime2: 300,
        nextMoney2: 0,
        minMoney: 5000,
        firstTime3: 120,
        firstMoney3: 0,
        nextTime3: 180,
        nextMoney3: 0,
        dayType: 0,
        maxDaymoney: 0,
        maxMoney: 2000,
        overnight: undefined,
        beginTime: undefined,
        endTime: undefined,
        nightMoney: 9000,
        nightTime: 60,
        moneyMoney: undefined,
        monthCount: undefined,
        lxzt: undefined,
        tm3: 180,
        mm3: 0,
        tm4: 240,
        mm4: 0,
        tm5: 300,
        mm5: 0,
        tm6: 360,
        mm6: 0,
        tm7: 420,
        mm7: 0,
        tm8: 480,
        mm8: 0,
        tm9: 540,
        mm9: 0,
        tm10: 600,
        mm10: 0,
        tm11: 660,
        mm11: 0,
        tm12: 720,
        mm12: 0,
        tm13: 780,
        mm13: 0,
        tm14: 840,
        mm14: 0,
        tm15: 900,
        mm15: 0,
        tm16: 960,
        mm16: 0,
        tm17: 1020,
        mm17: 0,
        tm18: 1080,
        mm18: 0,
        tm19: 1140,
        mm19: 0,
        tm20: 1200,
        mm20: 0,
        tm21: 1260,
        mm21: 0,
        tm22: 1320,
        mm22: 0,
        tm23: 1380,
        mm23: 0,
        tm24: 1440,
        mm24: 0,
        defaultType: 1
      },
      macs: [],
      initForm: {},
      visible1: false,
      visible2: false,
      activeName: 'first',
      macLists: [],
      testForm: {
        departmentId: this.$store.getters.departmentId,
        beginTime: undefined,
        endTime: undefined
      },
      timeValue: 0
    }
  },
  created () {
    this.getLocalList()
    this.initForm = this.form
    this.fetchData()
  },
  methods: {
    endTimeChange () {
      console.log(this.testForm.beginTime)
      if (this.testForm.beginTime === undefined || this.testForm.beginTime === null) {
        this.$message.error('请先选择开始时间')
        this.testForm.endTime = undefined
      } else {
        let a = this.minFormatter(new Date(this.testForm.endTime) - new Date(this.testForm.beginTime))
        this.timeValue = a
      }
    },
    getLocalList () {
      httpGet(getCamera + this.$store.getters.departmentId)
        .then(res => {
          this.macLists = res.data
        }).catch(() => {})
    },
    changeBeginTime (value) {
      if (value === null || value === undefined) {
        this.$message.error('请填写开始时间！')
      } else {
        this.form.beginTime = value
      }
    },
    changeEndTime (value) {
      if (value === null || value === undefined) {
        this.$message.error('请填写结束时间！')
      } else {
        this.form.endTime = value
      }
    },
    tabClick (tab) {
      if (tab.label === '24段收费类型设置') {
        this.form.defaultType = 1
      } else {
        this.form.defaultType = 2
      }
    },
    fetchData () {
      httpGet(FeeRules + '/' + this.$store.getters.departmentId).then(res => {
        if (res.data) {
          this.form = res.data
          if (res.data.defaultType === 1) {
            this.visible1 = true
            this.activeName = 'first'
          } else if (res.data.defaultType === 2) {
            this.visible2 = true
            this.activeName = 'second'
          }
        }
      }).catch(() => {})
    },
    onInit () {
      this.form = Object.assign({}, this.initForm)
    },
    onSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$confirm('本次操作下发并重启所有相机，是否确认继续...', '提示', {})
            .then(() => {
              this.createloading = true
              httpPost(FeeRules, this.form).then(res => {
                this.createloading = false
                this.$message({
                  message: res.message,
                  type: 'success',
                  duration: 4 * 1000
                })
              }).catch(() => {
                this.createloading = false
              })
            }).catch(() => {})
        }
      })
    },
    // 保存所选相机
    onSelectSubmit () {
      this.$confirm('本次操作下发并重启此相机，是否确认继续...', '提示', {})
        .then(res => {
          this.createSelectLoading = true
          this.form = Object.assign(this.form, {macs: this.macs})
          httpPost(FeeRulesSelect, this.form)
            .then(res => {
              this.createSelectLoading = false
              this.$message({
                message: res.message,
                type: 'success',
                duration: 4 * 1000
              })
            }).catch(() => {
              this.createSelectLoading = false
            })
        })
    },
    save () {
      httpGet(testFeeRules, this.testForm)
        .then(res => {
          console.log('成功。。 ', res)
          this.$message(res.data + '元')
        }).catch((err) => {
          console.log('出错。。 ', 'api: ', err)
        })
    }
  }
}
</script>

 <style lang="scss" scoped>
  .demo-table-expand {
    font-size: 0;
    label {
      width: 90px;
      color: #99a9bf;
    }
    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }
  }
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-tag {
    margin-bottom: 10px;
    font-size: 14px;
  }
  .el-header{
    font-size: 24px;
  }
</style>
