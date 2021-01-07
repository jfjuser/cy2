<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-button class="filter-item" type="primary"   @click="fetchData" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item look" type="primary"   @click="toOpenOutLog" >查询开闸记录</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-dialog
  title="开闸记录"
  :visible.sync="dialogVisible"
  width="80%"
  :before-close="handleClose">
  <el-button class="filter-item" type="primary" @click="handleh1"  icon="el-icon-download" v-has="['导出1']">导出</el-button>
    <!-- <el-table :data="userInfoData"> -->
    <el-table stripe :data="userInfoData">
    <el-table-column property="userName" label="用户名称" width="150"></el-table-column>
    <el-table-column property="phone" label="手机号" width="200"></el-table-column>
    <el-table-column property="email" label="邮箱"></el-table-column>
    <el-table-column property="localId" label="相机ID"></el-table-column>
    <el-table-column property="localName" label="通道名称"></el-table-column>
    <el-table-column property="date" label="开闸时间"></el-table-column>
    <el-table-column property="departmentId" label="部门ID"></el-table-column>
  </el-table>
  <div style="width:100%;display:flex;justify-content:flex-end">
    <el-pagination
    @current-change='pageChange'
    page-size='5'
    layout="prev, pager, next"
    :total="dataTotal">
  </el-pagination>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
      </div>
      <el-table :header-cell-style="{background:'#f3f4f6'}" style="width: 100%"   max-height="600" :data="tableData" v-loading.body="listLoading"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column label="通道名称" align="center" prop="localName"></el-table-column>
        <el-table-column label="MAC地址" align="center" prop="mac"></el-table-column>
        <el-table-column label="相机类型" align="center" prop="cameraType">
          <template slot-scope="scope">
            {{aiCameraTypeFormatter(scope.row.cameraType)}}
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" v-if="scope.row.status === 0">离线</el-button>
            <span v-if="scope.row.status === 1">在线</span>
          </template>
        </el-table-column>
        <el-table-column label="最近在线时间" align="center" prop="loginAt" width="160">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.loginAt)}}
          </template>
        </el-table-column>
        <el-table-column label="最近离线时间" align="center" prop="loginOutAt" width="160">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.loginOutAt)}}
          </template>
        </el-table-column>
        <el-table-column label="出/入口" align="center" prop="type">
          <template slot-scope="scope">
            {{inOutFormatter(scope.row.type)}}
          </template>
        </el-table-column>
        <el-table-column label="绑定状态" align="center" prop="isBind">
          <template slot-scope="scope">
            {{isBindFormatter(scope.row.isBind)}}
          </template>
        </el-table-column>
        <el-table-column label="TCP协议版本" align="center" prop="tcpVersion"></el-table-column>
        <el-table-column label="网络连接类型" align="center" prop="networkType">
          <template slot-scope="scope">
            {{networkTypeFormatter(scope.row.networkType)}}
          </template>
        </el-table-column>
        <!--  v-if = "isShowColumnFormatter(['编辑'])"  -->
        <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" min-width="500">
          <template slot-scope="scope">
            <el-button type="primary" style="margin-bottom:10px" v-has="['编辑']"  @click="handleEdit(scope.row)" size="mini">编辑</el-button>
            <el-button v-if="scope.row.isBind === 1" type="danger" v-has="['删除']" @click="handleDelete(scope.row.id)" size="mini">解绑</el-button>
            <el-button type="primary" v-has="['重启TCP']"  @click="reBootCamera(scope.row.id)" size="mini">重启TCP</el-button>
            <el-button type="primary" @click="reBootDevice(scope.row.id)" v-if="scope.row.cameraType === 130||scope.row.cameraType === 135" size="mini">重启设备</el-button>
            <el-button type="primary" @click="openGate(scope.row.id)" v-if="scope.row.cameraType === 130||scope.row.cameraType === 135" size="mini">一键开闸</el-button>
            <el-button type="primary" style="margin-bottom:10px"  @click="dataReset(scope.row.id)" v-if="scope.row.cameraType === 130" size="mini">恢复出厂设置</el-button>
            <el-button type="primary" v-has="['校对时间']"  @click="setCameraTime(scope.row.id)" size="mini">校时</el-button>
            <el-button type="primary" v-has="['升级相机']" v-if="scope.row.cameraType !== 131" @click="updateCamera(scope.row.id)" size="mini">升级相机</el-button>
            <el-button type="primary" v-has="['版本信息']"  @click="getCameraVer(scope.row.id)" size="mini">版本</el-button>
            <el-button type="primary" v-has="['同步状态修改']"  @click="adaptStatus(scope.row.id)" size="mini">同步状态</el-button>
            <!-- 判断136 设置时间  &&scope.row.status === 1&&scope.row.isBind === 1 -->
            <el-button type="primary" v-if="scope.row.cameraType === 136&&isNo==0"  style="margin-bottom:0.5rem"  @click="set(scope.row.id)" size="mini">设置工作时间</el-button>
            <el-button type="primary" v-has="['清除相机名单']" style="margin-bottom:0.5rem"  @click="clearCameraWhite(scope.row.id)" size="mini">清除白名单</el-button>
            <el-button type="primary" v-has="['获取图片']"  @click="getPicture(scope.row)" size="mini">获取图片</el-button>
            <el-button type="primary" v-has="['向下调焦', '向上调焦', '减小倍数', '增加倍数', '增加倍数', '相机设置', '参数设置']" @click="handleMore(scope.row)" size="mini">更多...</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <el-dialog title="编辑" :visible.sync="dialogEditVisible" width="30%">
        <el-form>
          <el-form-item label="名称">
            <el-input v-model="editForm.localName"></el-input>
          </el-form-item>
          <el-form-item label="出入口状态">
              <el-select v-model="editForm.type" placeholder="请选择">
                <el-option
                  v-for="item in inOutOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item>
            <el-button :loading = "updataLoading" type="primary" @click="createEdit">保存</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
        <!-- 设置时间 绑定相机 解绑相机 添加时长 -->
        <el-dialog title="设置时间" :visible.sync="dialogSetVisible" width="55%">
        <el-form>
        <el-form-item>
            <el-button :loading = "updataLoading" v-if="!dialogVisibles" type="primary" @click="addTime" style="margin-bottom:20px">添加</el-button>
             <el-form v-if="dialogVisibles">
          <el-form-item>
          第一阶段:
         <el-time-picker
        v-model="value1"
        format='HH:mm'
    :picker-options="{
      selectableRange: '00:00:00 - 23:59:00'
    }"
    placeholder="开始时间">
  </el-time-picker>
  <el-time-picker
    v-model="value11"
    format='HH:mm'
    :picker-options="{
      selectableRange: '00:00:00 - 23:59:00'
    }"
    placeholder="结束时间">
  </el-time-picker>
          <div style="margin-top:20px;"></div>
          第二阶段:
           <el-time-picker
        v-model="value2"
        format='HH:mm'
    :picker-options="{
      selectableRange: '00:00:00 - 23:59:00'
    }"
    placeholder="开始时间">
  </el-time-picker>
  <el-time-picker
    v-model="value22"
    format='HH:mm'
    :picker-options="{
      selectableRange: '00:00:00 - 23:59:00'
    }"
    placeholder="结束时间">
  </el-time-picker>
   <div style="margin-top:20px;"></div>
   <!-- 添加有效期  validFlg  0永久有效   1 当天有效  -->
          &emsp;有效期:
  <el-radio-group v-model="radioed" @change="handleChange">
    <el-radio :label="0">长久有效</el-radio>
    <el-radio :label="1">当天有效</el-radio>
  </el-radio-group>
          <div style="margin-top:20px;"></div>
          <p v-if="radioed==0">
          日期选择:
           <el-date-picker
      v-model="value3"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
          </p>
         <div style="margin-top:20px;"></div>
          <p v-if="radioed==1">
        周期选择:
            <el-checkbox-group
               v-model="checkedCities"
               :min="0"
               :max="7"
                style="display:inline-block">
            <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
           </el-checkbox-group>
           </p>
          </el-form-item>
          <el-form-item style="text-align:right;padding:20px 45% 20px 0;box-sizing:border-box">
          <el-button :loading = "updataLoading" type="primary" @click="cance">取消</el-button>
            <el-button :loading = "updataLoading" type="primary" @click="subm">确定</el-button>
          </el-form-item>
        </el-form>
    </el-form-item >
    <el-table
      ref="multipleTable"
      :data="choosearr"
      row-key="id"
      style="width: 100%;"
      max-height="400"
      v-if="!dialogVisibles"
      @selection-change="handleSelectionChange">
      <!-- <el-table-column
        type="selection"
        width="55">
      </el-table-column> -->
      <el-table-column
        label="第一阶段"
        width="200">
        <template slot-scope="scope">
          <span v-if="scope.row.firstStage.split(',')[0]!='NaN'">{{getTime(scope.row.firstStage.split(',')[0]/1)}}-{{getTime(scope.row.firstStage.split(',')[1]/1)}}</span>
          <span v-else></span>
        </template>
     </el-table-column>
     <el-table-column
      prop="name"
      label="第二阶段"
      width="200">
      <template slot-scope="scope">
          <span v-if="scope.row.secondStage.split(',')[0]!='NaN'">{{getTime(scope.row.secondStage.split(',')[0]/1)}}-{{getTime(scope.row.secondStage.split(',')[1]/1)}}</span>
          <span v-else></span>
      </template>
     </el-table-column>
     <!-- 添加有效期  validFlg  0永久有效   1 当天有效 后期可以根据这个判断显示哪一个 -->
    <el-table-column
      prop="address"
      label="有效期"
      width="200">
      <template slot-scope="scope">
            <p v-if="scope.row.validFlg==1">
            <span v-for="(item,index) in scope.row.workday.split(',')"  :key="index" >
               <i style="font-style:normal" v-if="item==1">{{item>0?'周':''}}一</i>
               <i style="font-style:normal" v-if="item==2">{{item>0?'周':''}}二</i>
               <i style="font-style:normal" v-if="item==3">{{item>0?'周':''}}三</i>
               <i style="font-style:normal" v-if="item==4">{{item>0?'周':''}}四</i>
               <i style="font-style:normal" v-if="item==5">{{item>0?'周':''}}五</i>
               <i style="font-style:normal" v-if="item==6">{{item>0?'周':''}}六</i>
               <i style="font-style:normal" v-if="item==0">{{item==0?'周':''}}日</i>
            </span>
            <i style="font-style:normal" >(当天有效)</i>
            </p>
            <p v-else>
            <span v-if="scope.row.startDt!='NaN'">{{getTimes(scope.row.startDt/1)}}</span>
            <span v-if="scope.row.endDt!='NaN'">-{{getTimes(scope.row.endDt/1)}}</span>
            <i style="font-style:normal" >(长期有效)</i>
            </p>
      </template>
    </el-table-column>
    <!-- <el-table-column
      prop="name"
      label="日期"
      width="200">
      <template slot-scope="scope">
          <span v-if="scope.row.startDt!='NaN'">{{getTimes(scope.row.startDt/1)}}</span>
          <span v-if="scope.row.endDt!='NaN'">-{{getTimes(scope.row.endDt/1)}}</span>
      </template>
     </el-table-column> -->
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          style="margin-bottom:5px"
          @click="upTime(scope.row, scope.row.id, scope.row.validFlg)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          style="margin-bottom:5px"
          @click="delTime(scope.row, scope.row.id, scope.$index, choosearr)">删除</el-button>
          <el-button
          size="mini"
          type="danger"
          style="margin-bottom:5px"
          @click="getCarme(scope.row.id);dialogVisiblesss=true;">关联相机</el-button>
          <!-- <el-button
          size="mini"
          type="danger"
          v-if="ischecks(checkedarr,scope.row.id)"
          @click="unbind(times, scope.row.id,scope.row)">解绑相机</el-button> -->
      </template>
      </el-table-column>
     </el-table>
        </el-form>
      </el-dialog>
 <!-- 设置时间 绑定相机 解绑相机 添加时长   结束 -->
       <el-dialog title="关联相机" :visible.sync="dialogVisiblesss" width="55%">
         <el-form>
         <el-form-item label="提示"  required>
         <el-tag  type="warning">选中为关联相机&emsp;&emsp;未选中则为未关联或解除关联</el-tag>
         </el-form-item>
          <el-form-item>
       <el-table
      ref="multipleTables"
      :data="carmes"
      row-key="id"
      style="width: 100%;"
      max-height="400"
      @select-all="selectAll"
      @select="selectChange"
      @selection-change="handleSelectionChanges">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column label="通道名称" align="center" prop="localName"></el-table-column>
        <el-table-column label="MAC地址" align="center" prop="mac"></el-table-column>
        <el-table-column label="相机类型" align="center" prop="cameraType">
          <template slot-scope="scope">
            {{aiCameraTypeFormatter(scope.row.cameraType)}}
          </template>
      </el-table-column>
      <el-table-column label="出/入口" align="center" prop="type">
          <template slot-scope="scope">
            {{inOutFormatter(scope.row.type)}}
          </template>
        </el-table-column>
      </el-table>
          </el-form-item>
      <!-- <el-pagination
      @current-change="handleCurrentChangess"
      :current-page.sync="listQuery1.offset"
      :page-size="listQuery1.limit"
      layout="total, prev, pager, next, jumper"
      :total="total1">
    </el-pagination> -->
    <el-form-item style="text-align:right;margin-top:20px;padding:0 20px;box-sizing:border-box" v-if="carmes.length > 0">
    <el-button :loading = "updataLoading" type="primary" @click="cancelss();dialogVisiblesss=false;tot=''">取消</el-button>
            <el-button :loading = "updataLoading" type="primary" @click="isbind();">保存</el-button>
          </el-form-item>
      </el-form>
      </el-dialog>
      <el-dialog title="版本信息" :visible.sync="dialogVersionVisible">
        <el-input type="textarea" v-model="version" :rows = "13"></el-input>
      </el-dialog>
      <el-dialog title="更多操作" :visible.sync="dialogMoreVisible" width="1000px">
        <el-tabs type="border-card" @tab-click="tabClick">
          <el-tab-pane label="向下调焦" v-if="isShowColumnFormatter(['向下调焦']) && isShow">
            <el-button @click="cameraDownFocus(5)">粗调</el-button>
            <el-button @click="cameraDownFocus(1)">微调</el-button>
            <el-button :disabled="disabled" @click="getPic">查看图片</el-button>
          </el-tab-pane>
          <el-tab-pane label="向上调焦" v-if="isShowColumnFormatter(['向上调焦']) && isShow">
            <el-button @click="cameraUpFocus(5)">粗调</el-button>
            <el-button @click="cameraUpFocus(1)">微调</el-button>
            <el-button :disabled="disabled" @click="getPic">查看图片</el-button>
          </el-tab-pane>
          <el-tab-pane label="减小倍数" v-if="isShowColumnFormatter(['减小倍数']) && isShow">
            <el-button @click="cameraZoomDown(5)">粗调</el-button>
            <el-button @click="cameraZoomDown(1)">微调</el-button>
            <el-button :disabled="disabled" @click="getPic">查看图片</el-button>
          </el-tab-pane>
          <el-tab-pane label="增加倍数" v-if="isShowColumnFormatter(['增加倍数']) && isShow">
            <el-button @click="cameraZoomUp(5)">粗调</el-button>
            <el-button @click="cameraZoomUp(1)">微调</el-button>
            <el-button :disabled="disabled" @click="getPic">查看图片</el-button>
          </el-tab-pane>
          <el-tab-pane label="参数设置" v-if="isShowColumnFormatter(['参数设置'])">
            <!-- <el-form label-width="120px">
              <el-form-item label="文件名称">
                <el-input v-model="paramForm.fileName"></el-input>
              </el-form-item>
              <el-form-item label="参数名">
                <el-input v-model="paramForm.key"></el-input>
              </el-form-item>
              <el-form-item label="参数值">
                <el-input v-model="paramForm.value"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button :loading="paramLoading" type="primary" @click="paramSetting">保存</el-button>
              </el-form-item>
            </el-form> -->
            <!-- <paramSetting :aiTokenId = "rowId"></paramSetting> -->
            <ParamsAISetting :aiTokenId = "rowId" :cameraType = "rowData.cameraType"></ParamsAISetting>
          </el-tab-pane>
          <el-tab-pane label="相机设置" v-show="isShowColumnFormatter(['相机设置'])" v-if="isShow">
            <!-- 华安人脸 -->
            <div v-if="rowData.cameraType === 129">
              <el-form label-width="150px" label-position="right">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="亮度阈值">
                      <el-input-number v-model="cameraSetting.ledThreshold" :min="1" :max="100" ></el-input-number>
                    </el-form-item>
                    <el-form-item label="LED亮度">
                      <el-input-number v-model="cameraSetting.ledLevel" :min="1" :max="100"></el-input-number>
                    </el-form-item>
                    <el-form-item label="去重复开关">
                      <el-select v-model="cameraSetting.derEn">
                        <el-option
                          v-for="item in derEnFormatter"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="当前最大增益">
                      <el-input-number v-model="cameraSetting.ledLevel" :min="0" :max="40" ></el-input-number>
                      <span>单位:DB</span>
                    </el-form-item>
                    <el-form-item label="输出延迟">
                      <el-input-number v-model="cameraSetting.outputDelay" :min="1" :max="30" ></el-input-number>
                      <span>单位:秒</span>
                    </el-form-item>
                    <el-form-item label="实时推送进出记录">
                      <el-select v-model="cameraSetting.enPushFace">
                        <el-option
                          v-for="item in enPushFaceFormatter"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="输出延迟">
                      <el-input-number v-model="cameraSetting.alarmDuration" :min="500" :max="5000" ></el-input-number>
                      <span>单位:毫秒</span>
                    </el-form-item>
                    <div v-if="cameraSetting.contType === 1">
                      <el-form-item label="韦根类型">
                        <el-select v-model="cameraSetting.wiegandType">
                          <el-option
                            v-for="item in wiegandTypeFormatter"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="韦根卡号范围最小值">
                        <el-input-number v-model="cameraSetting.wiegMinCardNo" :min="1" :max="20" ></el-input-number>
                      </el-form-item>
                      <el-form-item label="闸机门禁公共卡号">
                        <el-input v-model="cameraSetting.wiegCardNo" ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="人脸对比强度">
                      <el-select v-model="cameraSetting.matchLevel">
                        <el-option
                          v-for="item in matchLevelFormatter"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="人脸确信分数">
                      <el-input-number v-model="cameraSetting.matchScore" :min="1" :max="100" ></el-input-number>
                    </el-form-item>
                    <el-form-item label="重复超时" v-if="cameraSetting.derEn === 1">
                      <el-input-number v-model="cameraSetting.outTime" :min="1" :max="59" ></el-input-number>
                    </el-form-item>
                    <el-form-item label="最大曝光时间">
                      <el-input-number v-model="cameraSetting.outTime" :min="300" :max="9900" ></el-input-number>
                      <span>毫秒</span>
                    </el-form-item>
                    <el-form-item label="对比度">
                      <el-input-number v-model="cameraSetting.outTime" :min="1" :max="128" ></el-input-number>
                      <span>毫秒</span>
                    </el-form-item>
                    <el-form-item label="控制接口">
                      <el-select v-model="cameraSetting.contType">
                        <el-option
                          v-for="item in contTypeFormatter"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="继电器序号" v-if="cameraSetting.contType === 0">
                      <el-select v-model="cameraSetting.alarmIoNum">
                        <el-option
                          v-for="item in alarmIoNumFormatter"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <div v-if="cameraSetting.contType === 1">
                      <el-form-item label="韦根卡发行码">
                        <el-input-number v-model="cameraSetting.wiegandDcode" ></el-input-number>
                      </el-form-item>
                      <el-form-item label="韦根卡号范围最大值">
                        <el-input-number v-model="cameraSetting.wiegMaxCardNo" ></el-input-number>
                      </el-form-item>
                    </div>
                    <el-form-item>
                      <el-button :loading = "setdataLoading" type="primary" @click="cameraSettingParams">保存</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <!-- 安卓人脸 -->
            <!-- <div v-if="rowData.cameraType === 130">
              <AndroidAICamera :id="rowId"></AndroidAICamera>
            </div> -->
            <!-- 畅盈Linux人脸 -->
            <div v-if="rowData.cameraType === 131" v-show="isCatch">
              <LinuxAICamera :id="rowId"></LinuxAICamera>
            </div>
            <!-- 安卓科发人脸 -->
            <!-- <div v-if="rowData.cameraType === 132">
              <AndroidAIKFCamera :id="rowId"></AndroidAIKFCamera>
            </div> -->
            <!-- 若改变该相机有效期,将下发该规则下所有相机,你确定吗? -->
          </el-tab-pane>
        </el-tabs>
      </el-dialog>
      <el-dialog title="获取图片" :visible.sync="innerVisible" width="30%">
        <img :src="picSrc" alt="图片">
      </el-dialog>
    </div>
    <el-button type="info" round class="cancel-btn" @click.native="cancelGetImg" v-show="isCancelBtn">取消获取</el-button>
  </div>
</template>
<script>
import { aiCameraTypeFormatter, networkTypeFormatter, inOutFormatter, isBindFormatter, timeFormatter, isShowColumnFormatter } from '@/utils/formatter.js'
import { httpGet, httpPut, httpPost } from '@/utils/restful'
import { updateCameraAl, deviceReboot, aKeyOpened, dataReset, editAICameraName, syncState, getAICamera, unBindAICamera, reAIBoot, setAITime, clearAIWhite, getDate, focusAIDown, getBind, getUnbind, focusAIUp, getAISnap, getAIParams, setAIParams, getAIVer, zoomAIDown, zoomAIUp, setAIpar, openOutLog, getAddTime, getAICameras } from '@/api/url'
import AndroidAICamera from './components/AndroidAICamera'
import AndroidAIKFCamera from './components/AndroidAIKFCamera'
import LinuxAICamera from './components/LinuxAICamera'
import CoilDebugger from './components/CoilDebugger'
import paramSetting from './components/ParamsSetting'
import ParamsAISetting from './components/ParamsAISetting'
import { formatterTime } from '@/utils/formatter'
import Axios from 'axios'
export default {
  components: {
    CoilDebugger,
    AndroidAICamera,
    AndroidAIKFCamera,
    LinuxAICamera,
    paramSetting,
    ParamsAISetting
  },
  data () {
    return {
      inOutOptions: [
        {
          value: 0,
          label: '入口'
        }, {
          value: 1,
          label: '出口'
        }, {
          value: 2,
          label: '不区分'
        }
      ],
      dialogVisible: false, // 查询开闸记录对话框
      userInfoData: [], // 点击查询开闸记录对话框后弹出的表格
      dataTotal: '', // 表格数据总数
      currentPage: 1, // 当前页数
      list: null,
      radios: -1,
      tot: '',
      currentPage44: 1,
      radioed: -1,
      currentPage4: 1,
      upid: '',
      updat: [],
      carmes: [
        // {id: 1, name: '相机一', type: '一类型'},
        // {name: '相机二', type: '二类型'},
        // {name: '相机三', type: '三类型'},
        // {name: '相机四', type: '四类型'},
        // {name: '相机五', type: '五类型'}
      ],
      checkedCitiess: [],
      cities: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      checkedCities: [],
      isCatch: false,
      uid: '',
      updataLoading: false,
      setdataLoading: false,
      listLoading: true,
      fileLoading: false,
      paramLoading: false,
      times: '',
      isShow: true,
      disabled: true,
      value1: '',
      value2: '',
      value22: '',
      value11: '',
      dialogVersionVisible: false,
      dialogEditVisible: false,
      dialogSetVisible: false,
      dialogVisibles: false,
      version: '',
      listQuery: {
        offset: 1,
        limit: 10
      },
      listQuery1: {
        offset: 1,
        limit: 100000
      },
      total1: null,
      tableData: [],
      isNo: 0,
      choosearr: [],
      total: null,
      dialogMoreVisible: false,
      innerVisible: false,
      inOutFormatter: inOutFormatter,
      isBindFormatter: isBindFormatter,
      timeFormatter: timeFormatter,
      networkTypeFormatter: networkTypeFormatter,
      aiCameraTypeFormatter: aiCameraTypeFormatter,
      isShowColumnFormatter: isShowColumnFormatter,
      rowId: undefined,
      // 华安相机设置
      cameraSetting: {
        ledThreshold: 1,
        ledLevel: 1,
        derEn: 1,
        maxGain: 15,
        outputDelay: 1,
        alarmDuration: 1000,
        matchLevel: 2,
        enPushFace: 1,
        contType: 0,
        matchScore: 80,
        outTime: 1,
        contrast: 65,
        alarmIoNum: 1,
        wiegandType: 1,
        wiegMinCardNo: 1,
        wiegCardNo: '',
        wiegandDcode: undefined,
        wiegMaxCardNo: 100000000
      },
      wiegandTypeFormatter: [
        { value: 1, label: 'WG26' },
        { value: 2, label: 'WG34' }
      ],
      derEnFormatter: [
        { value: 0, label: '关' },
        { value: 1, label: '开' }
      ],
      enPushFaceFormatter: [
        { value: 0, label: '不推送' },
        { value: 1, label: '推送' }
      ],
      matchLevelFormatter: [
        { value: 1, label: '低' },
        { value: 2, label: '中' },
        { value: 3, label: '高' }
      ],
      contTypeFormatter: [
        { value: 0, label: '继电器' },
        { value: 1, label: '韦根' }
      ],
      alarmIoNumFormatter: [
        { value: 0, label: 'Out1' },
        { value: 1, label: 'Out2' },
        { value: 2, label: 'Out3' }
      ],
      value3: '',
      dialogVisiblesss: false,
      paramForm: {
        fileName: '',
        key: '',
        value: ''
      },
      selectDataArrL: [],
      chosee: [],
      picSrc: '',
      checkedarr: [],
      aid: '',
      rowData: {},
      AndroidAICameraData: null,
      editForm: {
        id: undefined,
        localName: undefined,
        type: undefined
      },
      isCancelBtn: false,
      jsonData: [
        {
          title: '通道名称',
          key: 'localName',
          type: 'text'
        },
        {
          title: 'MAC地址',
          key: 'mac',
          type: 'text'
        },
        {
          title: '相机类型',
          key: 'cameraType',
          type: 'text'
        },
        {
          title: '状态',
          key: 'status',
          type: 'text'
        },
        {
          title: '最近在线时间',
          key: 'loginAt',
          type: 'text'
        },
        {
          title: '最近离线时间',
          key: 'loginOutAt',
          type: 'text'
        },
        {
          title: '出/入口',
          key: 'type',
          type: 'text'
        },
        {
          title: '绑定状态',
          key: 'isBind',
          type: 'text'
        },
        {
          title: 'TCP协议版本',
          key: 'tcpVersion',
          type: 'text'
        },
        {
          title: '网络连接类型',
          key: 'networkType',
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
      ],
      jsonData1: [
        {
          title: '用户名称',
          key: 'userName',
          type: 'text'
        },
        {
          title: '手机号',
          key: 'phone',
          type: 'text'
        },
        {
          title: '邮箱',
          key: 'email',
          type: 'text'
        },
        {
          title: '相机ID',
          key: 'localId',
          type: 'text'
        },
        {
          title: '通道名称',
          key: 'localName',
          type: 'text'
        },
        {
          title: '开闸时间',
          key: 'date',
          type: 'text'
        },
        {
          title: '部门ID',
          key: 'departmentId',
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
    // this.getTime ()
  },
  methods: {
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item, index) => {
        item.cameraType = this.aiCameraTypeFormatter(item.cameraType)
        item.status = parseInt(item.status) === 0 ? '离线' : '在线'
        item.loginAt = this.timeFormatter(item.loginAt)
        item.loginOutAt = this.timeFormatter(item.loginOutAt)
        item.type = this.inOutFormatter(item.type)
        item.isBind = this.isBindFormatter(item.isBind)
        item.networkType = this.networkTypeFormatter(item.networkType)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    handleh1 () {
      let obj = JSON.parse(JSON.stringify(this.userInfoData))
      this.table2excel(this.jsonData1, obj, 'excel.xlsx')
    },
    // 点击分页器跳转页面
    pageChange (val) {
      this.currentPage = val
      this.toOpenOutLog()
    },
    handleChange (val) {
      if (this.upid && this.aid / 1 !== this.radioed / 1) {
        this.radioed = this.aid
        this.$confirm('若改变该相机有效期,将重新下发该规则下所有相机录入的人员,你确定吗', '提示', {
          type: 'warning'
        }).then(() => {
          this.radioed = val
        }).catch(() => {})
        // this.$message({type: 'warning', message: })
      } else if (this.upid && this.aid / 1 === this.radioed / 1) {
        this.radioed = this.aid
      } else {
        this.radioed = val
      }
      // console.log(this.radioed)
    },
    //  点击分页切换数据
    handleCurrentChangess (val) {
      // console.log(val)
      this.listQuery1.offset = val
      this.fetchData1()
    },
    // handlechange (val) {
    //   if (this.upid) {
    //     // 若改变该相机有效期,将重新下发该规则下所有相机录入的人员,你确定吗?

    //   }
    // },
    // 获取相机列表
    getCarme (id) {
      // let that = this
      // this.tot = ''
      // this.$refs.multipleTables.clearSelection()
      // console.log(this.$refs.multipleTables)
      // console.log(id)
      this.carmes = []
      this.total1 = null
      this.listQuery1.offset = 1
      this.tot = id
      this.fetchData1()
    },
    // 根据chosee判断是否绑定 调取绑定接口 解绑接口
    isbind () {
      let that = this
      // {aiTokenId: tokeid, workScheduleId: id}
      let arrs = []
      this.chosee.forEach((item, index) => {
        arrs.push({
          aiTokenId: item.id,
          workScheduleId: this.tot
        })
      })
      if (arrs.length > 0) {
        httpPost(getBind, arrs).then(res => {
          this.$message({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
        })
      } else {
        this.$confirm('确定要解除关联所有相机？', '提示', {
          type: 'warning'
        }).then(() => {
          httpPost(getUnbind, {workScheduleId: this.tot}).then(res => {
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
            this.tot = ''
          })
        }).catch(() => {})
      }
      that.$refs.multipleTables.clearSelection()
      that.dialogVisiblesss = false
      this.carmes = []
      this.total1 = null
      this.listQuery1.offset = 1
      this.currentPage4 = 1
    },
    // 相机列表 选中赋值
    handleSelectionChanges (val) {
      this.chosee = val
    },
    selectChange (arr, row) {
      let isHaveItem = this.selectDataArrL.find(item => item.id === row.id)
      if (isHaveItem) {
        this.selectDataArrL = this.selectDataArrL.filter(item => item.id !== isHaveItem.id)
      } else {
        this.selectDataArrL.push(row)
      }
    },
    selectAll (arr) {
      if (arr.length > 0) {
        this.selectDataArrL = this.selectDataArrL.concat(arr)
      } else {
        arr.forEach(ms => {
          this.selectDataArrL = this.selectDataArrL.filter(item => item.id !== ms.id)
        })
      }
    },
    // 时间列表选中赋值
    handleSelectionChange (val) {
      this.checkedarr = val
    },
    // 相机列表 取消重置
    cancelss () {
      this.$refs.multipleTables.clearSelection()
      this.carmes = []
      this.total1 = null
      this.listQuery1.offset = 1
      this.currentPage4 = 1
    },
    ischecks (arr, indexs) {
      // 判断数组中是否有这个元素
      let indexss = -1
      arr.forEach((item, index) => {
        if (item.id === indexs) {
          indexss = index
        }
      })
      if (indexss >= 0) {
        return true
      } else {
        return false
      }
    },
    red (arr) {
      let arr1 = arr.sort(function (a, b) {
        return b - a
      })
      arr1.forEach((item, index) => {
        if (item === 0) {
          arr1.splice(index, 1)
          arr1.push(item)
        }
      })
      return arr1
    },
    ischeck (arr, indexs) {
      // 判断数组中是否有这个元素
      let indexss = -1
      arr.forEach((item, index) => {
        if (item === indexs) {
          indexss = index
        }
      })
      if (indexss >= 0) {
        return true
      } else {
        return false
      }
    },
    getTime (time) {
      // 转换时分秒显示给用户看
      let date = new Date(time)
      // let year = date.getFullYear()
      // let month = date.getMonth()/1 + 1
      // let day = date.getDate()
      let h = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
      let m = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
      // let s = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()
      return h + ':' + m
    },
    getTimes (time) {
      // 转换时分秒显示给用户看
      let date = new Date(time)
      let year = date.getFullYear()
      let month = date.getMonth() / 1 + 1
      let day = date.getDate()
      // let h = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
      // let m = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
      // let s = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()
      return year + '/' + month + '/' + day
    },
    toOpenOutLog () { // 点击查询开闸记录的点击事件
      this.dialogVisible = true
      httpGet(openOutLog, { departmentId: this.$store.getters.departmentId, offset: this.currentPage, limit: 5 })
        .then(res => {
          console.log('查询成功！', res)
          if (res.code === 1 && res.data && res.data.rows) {
            this.dataTotal = res.data.total
            Array.from(res.data.rows).forEach(item => {
              item.date = formatterTime(item.date)
              return item
            })
            this.userInfoData = res.data.rows
          }
        })
        .catch(err => {
          console.log('查询失败：', err)
        })
    },
    set (id) {
      // console.log(id)
      // 点击设置时间
      this.times = id
      this.dialogVisibles = false
      this.radioed = -1
      this.upid = ''
      this.value1 = ''
      this.value2 = ''
      this.value22 = ''
      this.value11 = ''
      this.value3 = ''
      // this.checkedCitiess = []
      this.checkedCities = []
      this.getDate(id)
    },
    getDate (id) {
      // 查询数据 并选中已绑定相机
      let that = this
      this.choosearr = []
      httpGet(getDate + '/' + this.$store.getters.departmentId + '/' + id, {}).then(res => {
        this.choosearr = res.data
        this.dialogSetVisible = true
        this.$nextTick(() => {
          that.choosearr.forEach((item, index) => {
            if (item.aiTokenId) {
              this.$refs.multipleTable.toggleRowSelection(item)
            }
          })
        })
      }).catch(() => {
        this.choosearr = []
        this.dialogSetVisible = true
      })
    },
    bind (tokeid, id, row) {
      // 绑定相机
      httpPost(getBind, {aiTokenId: tokeid, workScheduleId: id}).then(res => {
        this.$message({
          message: res.message,
          type: 'success',
          duration: 4 * 1000
        })
        this.$refs.multipleTable.toggleRowSelection(row)
      })
    },
    unbind (tokeid, id, row) {
      // 解绑相机
      httpPost(getUnbind, {aiTokenId: tokeid, workScheduleId: id}).then(res => {
        this.$message({
          message: res.message,
          type: 'success',
          duration: 4 * 1000
        })
        this.$refs.multipleTable.toggleRowSelection(row)
      })
    },
    handleClose () {
    },
    delTime (row, index, index1, arr) {
      let that = this
      // 删除单个时长
      this.$confirm('确定删除？', '提示', {
        type: 'warning'
      }).then(() => {
        httpPut(getAddTime, { id: index, isDelete: 1 }).then(res => {
          this.$message({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
          that.dialogVisibles = false
          that.value1 = ''
          that.value2 = ''
          that.value22 = ''
          that.value11 = ''
          that.value3 = ''
          that.upid = ''
          that.radioed = -1
          // this.checkedCitiess = []
          that.checkedCities = []
          // 重新查询数据
          // arr.splice(index1, 1)
          this.getDate(this.times)
          // this.choosearr = this.choosearr.splice(index, 1)
        }).catch(() => {})
      })
    },
    upTime (row, id, aid) {
      // 帮用户把数据写入
      if (row) {
        // this.uid = this.choosearr[index].id
        this.dialogVisibles = true
        this.value1 = new Date(row.firstStage.split(',')[0] / 1)
        this.value11 = new Date(row.firstStage.split(',')[1] / 1)
        this.value22 = new Date(row.secondStage.split(',')[1] / 1)
        this.value2 = new Date(row.secondStage.split(',')[0] / 1)
        this.aid = aid
        if (row.validFlg / 1 === 1) {
          let uu = row.workday.split(',')
          let arrs = []
          uu.forEach((item, index) => {
            if (item / 1 === 1) {
              item = '周一'
            } else if (item / 1 === 2) {
              item = '周二'
            } else if (item / 1 === 3) {
              item = '周三'
            } else if (item / 1 === 4) {
              item = '周四'
            } else if (item / 1 === 5) {
              item = '周五'
            } else if (item / 1 === 6) {
              item = '周六'
            } else if (item / 1 === 0) {
              item = '周日'
            }
            arrs.push(item)
          })
          this.checkedCities = arrs
        } else if (row.validFlg / 1 === 0) {
          this.value3 = [new Date(row.startDt / 1), new Date(row.endDt / 1)]
        }
        this.radioed = row.validFlg
        this.upid = id
      }
    },
    addTime () {
      // 显示添加时长弹窗
      if (this.choosearr.length >= 16) {
        this.$message({
          message: '只能添加16条',
          type: 'warning',
          duration: 3 * 1000
        })
        return
      }
      this.dialogVisibles = true
    },
    subm () {
      // 根据this.upid判断是添加还是更新时长
      let that = this
      if (!this.getTime(this.value1) || !this.getTime(this.value11) || !this.getTime(this.value2) || !this.getTime(this.value22)) {
        this.$message({
          message: '请选择时间',
          type: 'warning',
          duration: 3 * 1000
        })
        return
      } else {
        if (this.radioed < 0) {
          this.$message({
            message: '请选择有效时间',
            type: 'warning',
            duration: 3 * 1000
          })
          return
        } else {
          if (this.radioed / 1 === 0) {
            if (!this.getTimes(this.value3[0]) || !this.getTimes(this.value3[1])) {
              this.$message({
                message: '请选择时间',
                type: 'warning',
                duration: 3 * 1000
              })
              return
            }
          } else if (this.radioed / 1 === 1) {
            if (this.checkedCities.length <= 0) {
              this.$message({
                message: '请选择时间',
                type: 'warning',
                duration: 3 * 1000
              })
              return
            }
          }
        }
        // if (this.checkedCities.length <= 0) {
        //   if (!this.getTimes(this.value3[0]) || !this.getTimes(this.value3[1])) {
        //     this.$message({
        //       message: '请选择时间',
        //       type: 'warning',
        //       duration: 3 * 1000
        //     })
        //     return
        //   }
        // } else if (!this.getTimes(this.value3[0]) || !this.getTimes(this.value3[1])) {
        //   if (this.checkedCities.length <= 0) {
        //     this.$message({
        //       message: '请选择时间',
        //       type: 'warning',
        //       duration: 3 * 1000
        //     })
        //     return
        //   }
        // }
      }
      // if (new Date(that.value2).getTime() / 1 > new Date(that.value22).getTime() / 1 || new Date(that.value1[0]).getTime() / 1 > new Date(that.value1[1]).getTime() / 1) {
      //   this.$message({
      //       message: '开始时间不能大于结束时间',
      //       type: 'warning',
      //       duration: 3 * 1000
      //     })
      //   return
      // } else {
      //   if (new Date(that.value1[1]).getTime() / 1 > new Date(that.value2[0]).getTime() / 1) {
      //     this.$message({
      //       message: '下午开始时间不能小于上午结束时间',
      //       type: 'warning',
      //       duration: 3 * 1000
      //     })
      //   return
      //   }
      // }
      let obj1 = Object.assign([], this.checkedCities)
      let weeek = ''
      obj1.forEach((item, index) => {
        if (item === '周一') {
          item = 1
        } else if (item === '周二') {
          item = 2
        } else if (item === '周三') {
          item = 3
        } else if (item === '周四') {
          item = 4
        } else if (item === '周五') {
          item = 5
        } else if (item === '周六') {
          item = 6
        } else if (item === '周日') {
          item = 0
        }
        if (obj1.length - 1 === index) {
          weeek += item
        } else {
          weeek += item + ','
        }
      })
      //  console.log(new Date(this.value1[0]).getTime())
      //  console.log(weeek)
      // console.log(this.value1)
      var obj = null
      if (this.upid) {
        if (that.radioed / 1 === 0) {
          obj = { id: that.upid, aiTokenId: this.times, departmentId: this.$store.getters.departmentId, validFlg: that.radioed, firstStage: new Date(that.value1).getTime() + ',' + new Date(that.value11).getTime(), secondStage: new Date(that.value2).getTime() + ',' + new Date(that.value22).getTime(), startDt: new Date(that.value3[0]).getTime(), endDt: new Date(that.value3[1]).getTime(), oldValidFlg: this.aid }
        } else if (that.radioed / 1 === 1) {
          // let obj ={ id: that.upid, aiTokenId: this.times, departmentId: this.$store.getters.departmentId, workday: weeek, firstStage: new Date(that.value1).getTime() + ',' + new Date(that.value11).getTime(), secondStage: new Date(that.value2).getTime() + ',' + new Date(that.value22).getTime(), startDt: new Date(that.value3[0]).getTime(), endDt: new Date(that.value3[1]).getTime() }
          obj = { id: that.upid, aiTokenId: this.times, departmentId: this.$store.getters.departmentId, validFlg: that.radioed, workday: weeek, firstStage: new Date(that.value1).getTime() + ',' + new Date(that.value11).getTime(), secondStage: new Date(that.value2).getTime() + ',' + new Date(that.value22).getTime(), oldValidFlg: this.aid }
        }
        httpPut(getAddTime, obj).then(res => {
          that.$message({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
          that.getDate(that.times)
          that.dialogVisibles = false
          that.value1 = ''
          that.value2 = ''
          that.value22 = ''
          that.value11 = ''
          that.value3 = ''
          that.upid = ''
          that.radioed = -1
          // this.checkedCitiess = []
          that.checkedCities = []
        }).catch(() => {
          that.$message({
            message: '修改失败',
            type: 'warning',
            duration: 4 * 1000
          })
        })
      } else {
        if (that.radioed / 1 === 0) {
          obj = { aiTokenId: this.times, departmentId: this.$store.getters.departmentId, validFlg: that.radioed, firstStage: new Date(that.value1).getTime() + ',' + new Date(that.value11).getTime(), secondStage: new Date(that.value2).getTime() + ',' + new Date(that.value22).getTime(), startDt: new Date(that.value3[0]).getTime(), endDt: new Date(that.value3[1]).getTime() }
        } else if (that.radioed / 1 === 1) {
          obj = { aiTokenId: this.times, departmentId: this.$store.getters.departmentId, workday: weeek, firstStage: new Date(that.value1).getTime() + ',' + new Date(that.value11).getTime(), secondStage: new Date(that.value2).getTime() + ',' + new Date(that.value22).getTime(), validFlg: that.radioed }
        }
        // obj = {
        //   aiTokenId: 2242,
        //   departmentId: 3,
        //   firstStage: '1598947755000,1598947756000',
        //   secondStage: '1598947757000,1598947759000',
        //   workday: '3',
        //   startDt: 1599580800000,
        //   endDt: 1599753600000,
        //   validFlg: that.radioed
        // }
        httpPost(getAddTime, obj).then(res => {
          that.$message({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
          that.getDate(that.times)
          that.dialogVisibles = false
          that.value1 = ''
          that.value2 = ''
          that.value3 = ''
          that.value22 = ''
          that.value11 = ''
          that.upid = ''
          that.radioed = -1
          // this.checkedCitiess = []
          that.checkedCities = []
        }).catch(() => {
          that.$message({
            message: '添加失败',
            type: 'warning',
            duration: 4 * 1000
          })
        })
      }
    },
    cance () {
      this.dialogVisibles = false
      this.value1 = ''
      this.value2 = ''
      this.value3 = ''
      this.value22 = ''
      this.value11 = ''
      this.upid = ''
      this.radioed = -1
      // this.checkedCitiess = []
      this.checkedCities = []
    },
    fetchData () {
      this.isNo = 0
      this.listLoading = true
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getAICamera, this.listQuery).then(res => {
        if (res.data === null || res.data.rows === null) {
          this.tableData = []
          this.total = 0
        } else {
          this.tableData = res.data.rows
          this.total = res.data.total
          var index = 0
          this.tableData.forEach((item, index) => {
            if (item.cameraType / 1 !== 136) {
              index++
            }
          })
          this.isNo = index
          // console.log(this.isNo)
        }
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    fetchData1 () {
      let that = this
      this.listQuery1 = Object.assign(this.listQuery1, {departmentId: this.$store.getters.departmentId, cameraType: 136, workScheduleId: this.tot})
      httpGet(getAICameras, this.listQuery1).then(res => {
        // res = {"code":1,"message":"成功","data":{"total":1,"rows":[{"id":2242,"localName":null,"mac":"00:2A:2A:43:48:53","init":1,"loginAt":null,"loginOutAt":null,"status":1,"type":2,"isBind":null,"cameraType":null,"networkType":null,"tcpVersion":null,"effTime":null,"workScheduleId":null},{"id":2242,"localName":null,"mac":"00:2A:2A:43:48:53","init":1,"loginAt":null,"loginOutAt":null,"status":1,"type":2,"isBind":null,"cameraType":null,"networkType":null,"tcpVersion":null,"effTime":null,"workScheduleId":null}]}}
        if (res.data === null || res.data.rows === null) {
          this.carmes = []
          this.total1 = 0
        } else {
          this.carmes = res.data.rows
          this.total1 = res.data.total
        }
        this.$nextTick(() => {
          that.$refs.multipleTables.clearSelection()
          that.carmes.forEach((item, index) => {
            if (item.workScheduleId) {
              that.$refs.multipleTables.toggleRowSelection(item)
            }
          })
        })
      })
    },
    // 升级相机
    updateCamera (id) {
      this.$confirm('确定要升级相机？', '提示', {
        type: 'warning'
      }).then(() => {
        httpGet(updateCameraAl + '/' + id).then((res) => {
          this.$message({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
        }).catch(() => {})
      }).catch(() => {})
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.fetchData()
    },
    handleCurrentChange (val) {
      this.listQuery.offset = val
      this.fetchData()
    },
    // 状态修改
    adaptStatus (id) {
      this.$confirm('当前操作会清除相机内所有注册人员，然后重新同步？', '提示', {
        type: 'warning'
      })
        .then(() => {
          let obj = {
            'aiTokenId': id,
            'departmentId': parseInt(this.$store.getters.departmentId)
          }
          httpPut(syncState, obj).then(res => {
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {})
        }).catch(() => {})
    },
    // 解绑
    handleDelete (id) {
      const h = this.$createElement
      let message = ['解绑会清空本通道数据，重新绑定时下发需要较长时间，且在此期间设备不可使用', '设备参数会恢复默认设置']
      let info = {
        h,
        message,
        firstconfirmButtonText: '我要解绑',
        firstcancelButtonText: '取消解绑',
        secondmessgae: '您已了解解绑后果，确定还要继续解绑吗',
        secondconfirmButtonText: '我再想想',
        secondcancelButtonText: '确定解绑'
      }
      this.MessageBox(info).then(() => {}).catch(() => {
        httpPut(unBindAICamera + id).then(res => {
          this.$message({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
          this.fetchData()
        }).catch(() => {})
      })
    },
    // 恢复出厂设置
    dataReset (id) {
      this.$confirm('确定要恢复出厂模式？', '提示', {})
        .then(() => {
          httpGet(dataReset + '/' + id + '/' + this.$store.getters.departmentId)
            .then((res) => {
              console.log(res)
              this.$message({
                duration: 3000,
                type: 'success',
                message: res.message
              })
            }).catch((err) => {
              console.log(err)
            })
        }).catch(() => {})
    },
    // 一键开闸
    openGate (id) {
      this.$confirm('确定要启动一键开闸？', '提示', {})
        .then(() => {
          httpGet(aKeyOpened + '/' + id + '/' + this.$store.getters.departmentId)
            .then((res) => {
              console.log(res)
              this.$message({
                duration: 3000,
                type: 'success',
                message: res.message
              })
            }).catch((err) => {
              console.log(err)
            })
        }).catch(() => {})
    },
    // 重启设备
    reBootDevice (id) {
      this.$confirm('确定要重启设备？', '提示', {})
        .then(() => {
          httpGet(deviceReboot + '/' + id + '/' + this.$store.getters.departmentId)
            .then((res) => {
              console.log(res)
              this.$message({
                type: 'success',
                duration: 3000,
                message: res.message
              })
            }).catch((err) => {
              console.log(err)
            })
        }).catch(() => {})
    },
    // 重启TCP
    reBootCamera (id) {
      this.$confirm('是否重启TCP？', '提示', {})
        .then(() => {
          httpPost(reAIBoot + id).then(res => {
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {})
        }).catch(() => {})
    },
    // 校时
    setCameraTime (id) {
      this.$confirm('是否对相机进行时间校对？', '提示', {})
        .then(() => {
          httpPost(setAITime + id).then(res => {
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {})
        }).catch(() => {})
    },
    // 清空白名单
    clearCameraWhite (id) {
      this.$confirm('是否对清空相机里的所有白名单？', '提示', {})
        .then(() => {
          httpPost(clearAIWhite + id).then(res => {
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {})
        }).catch(() => {})
    },
    // 获取相机版本
    getCameraVer (id) {
      httpPost(getAIVer + id).then(res => {
        this.dialogVersionVisible = true
        this.version = JSON.stringify(res.data, null, 4)
      }).catch(() => {})
    },
    // ---------------------- 更多操作 --------------------\\
    tabClick (tab) {
      this.disabled = true
      if (tab.label === '参数设置') {
        this.paramForm = {
          fileName: '',
          key: '',
          value: ''
        }
      } else if (tab.label === '相机设置') {
        // 华安人脸
        if (this.rowData.cameraType === 129) {
          this.getCameraSetting()
        }
        this.isCatch = true
      } else if (tab.label === '线圈调试') {
        const loading = this.$loading({
          lock: true,
          text: '获取中....',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        httpPost(getAISnap + this.rowId)
          .then(res => {
            // 修改base64
            this.picSrc = 'data:image/jpeg;base64,' + res.data
            loading.close()
          }).catch(() => {
            loading.close()
          })
      }
    },
    handleMore (row) {
      this.rowData = row
      // console.log(row.cameraType === (130 || 132 || 135))
      if (row.cameraType === (130 || 132) || row.cameraType === 135) {
        this.isShow = false
      } else {
        this.isShow = true
      }
      this.rowId = row.id
      this.dialogMoreVisible = true
    },
    // 向上调焦
    cameraUpFocus (value) {
      this.disabled = true
      let data = {
        id: this.rowId,
        level: value
      }
      httpPost(focusAIUp, data)
        .then(res => {
          this.$message.success(res.message)
          this.disabled = false
        }).catch(() => {})
    },
    // 向下调焦
    cameraDownFocus (value) {
      this.disabled = true
      let data = {
        id: this.rowId,
        level: value
      }
      httpPost(focusAIDown, data)
        .then(res => {
          this.$message.success(res.message)
          this.disabled = false
        }).catch(() => {})
    },
    // 减小倍数
    cameraZoomDown (value) {
      this.disabled = true
      let data = {
        id: this.rowId,
        level: value
      }
      httpPost(zoomAIDown, data)
        .then(res => {
          this.$message.success(res.message)
          this.disabled = false
        }).catch(() => {})
    },
    // 增加倍数
    cameraZoomUp (value) {
      this.disabled = true
      let data = {
        id: this.rowId,
        level: value
      }
      httpPost(zoomAIUp, data)
        .then(res => {
          this.$message.success(res.message)
          this.disabled = false
        }).catch(() => {})
    },
    getPicture (row) {
      this.rowId = row.id
      this.getPic()
    },
    // 获取图片
    getPic () {
      const loading = this.$loading({
        lock: true,
        text: '获取中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let showBtnTime = setTimeout(() => { this.isCancelBtn = true }, 1000)
      httpPost(getAISnap + this.rowId)
        .then(res => {
          clearTimeout(showBtnTime)
          // 修改base64
          this.picSrc = 'data:image/jpeg;base64,' + res.data
          loading.close()
          if (this.isCancelBtn) this.isCancelBtn = false
          this.innerVisible = true
        }).catch(() => {
          clearTimeout(showBtnTime)
          loading.close()
          if (this.isCancelBtn) this.isCancelBtn = false
        })
    },
    cancelGetImg () {
      const CancelToken = Axios.CancelToken
      this.$store.state.source.cancel && this.$store.state.source.cancel()
      this.$store.state.source = CancelToken.source()
    },
    // 相机设置
    getCameraSetting () {
      httpGet(getAIParams + this.rowId)
        .then(res => {
          if (res.data !== null) {
            this.cameraSetting = Object.assign({}, res.data)
          }
        }).catch(() => {})
    },
    cameraSettingParams () {
      this.setdataLoading = true
      let data = Object.assign({id: this.rowId}, this.cameraSetting)
      httpPut(setAIParams, data)
        .then(res => {
          this.setdataLoading = false
          this.$message.success(res.message)
        }).catch(() => {
          this.setdataLoading = false
        })
    },
    // 参数设置
    paramSetting () {
      this.paramLoading = true
      this.paramForm = Object.assign(this.paramForm, {aiTokenId: this.rowId})
      httpPost(setAIpar, this.paramForm)
        .then(res => {
          this.paramLoading = false
          this.$message.success(res.message)
        }).catch(() => {
          this.paramLoading = false
        })
    },
    handleEdit (row) {
      this.editForm = {
        id: row.id,
        localName: row.localName,
        type: row.type
      }
      this.dialogEditVisible = true
    },
    createEdit () {
      this.updataLoading = true
      httpPut(editAICameraName, this.editForm)
        .then(res => {
          this.fetchData()
          this.dialogEditVisible = false
          setTimeout(() => { this.updataLoading = false }, 300)
          this.$message.success(res.message)
        }).catch(() => { this.updataLoading = false })
    }
  }
}
</script>

<style lang="scss">
  .messageBox_class {
  width: 540px;
  .el-message-box__header {
    background: #f1f2f6 !important;
    .el-message-box__title{
      span{
            color: red !important;
      }
    }
  }
  .el-message-box__headerbtn .el-message-box__close {
    color: #3a3d46;
  }
  .el-message-box__status.el-icon-warning {
    display: none;
  }
  .el-message-box__status + .el-message-box__message {
    padding: 0;
    margin: 0;
  }
  .el-message-box__message p {
    text-align: center;
    color: #3a3d46;
    margin-top: 10px;
  }
  .el-button--primary {
    background: #4c8bff;
  }
}
</style>
<style lang="scss" scoped>
.messageBox_class {
  width: 540px;
  .el-message-box__header {
    background: #f1f2f6 !important;
  }
  .el-message-box__headerbtn .el-message-box__close {
    color: #3a3d46;
  }
  .el-message-box__status.el-icon-warning {
    display: none;
  }
  .el-message-box__status + .el-message-box__message {
    padding: 0;
    margin: 0;
  }
  .el-message-box__message p {
    text-align: center;
    color: #3a3d46;
    margin-top: 10px;
  }
  .el-button--primary {
    background: #4c8bff;
  }
}
  img{
    width: 100%;
  }
  .el-select{
    width: 180px;
  }
  .cancel-btn {
    position: fixed;
    bottom: 30%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10000;
  }
  .el-checkbox{
    margin-right:20px;
  }
</style>
