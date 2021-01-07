<template>
  <div class="app-container">
    <div class="table-main" style="margin-top: 20px;">
      <div class="filter-container">
        <el-input  class="filter-item" style="width:150px;" v-model="listQuery.userName" clearable placeholder="请输入姓名"></el-input>
        <el-input  class="filter-item" style="width:150px;" v-model="listQuery.phone" clearable placeholder="手机号"></el-input>
        <el-input  class="filter-item" style="width:150px;" v-model="listQuery.mac" clearable placeholder="Mac"></el-input>
        <el-select clearable  style="width:150px;" v-model="listQuery.type"  class="filter-item" placeholder="类型">
          <el-option label="非访客" :value="0"></el-option>
          <el-option label="访客" :value="1"></el-option>
        </el-select>
        <el-select clearable  style="width:150px;" v-model="listQuery.isCheck"  class="filter-item" placeholder="审核状态">
          <el-option label="审核不通过" :value="0"></el-option>
          <el-option label="审核通过" :value="1"></el-option>
          <el-option label="审核中" :value="2"></el-option>
        </el-select>
        <el-select style="width:150px;" v-model="listQuery.isDistribution"  class="filter-item" placeholder="是否分配账户">
          <el-option label="全部" :value="0"></el-option>
          <el-option label="未分配账户" :value="1"></el-option>
        </el-select>
        <el-select style="width:150px;" v-model="listQuery.isSync"  class="filter-item" placeholder="同步状态">
          <el-option label="未同步" :value="0"></el-option>
          <el-option label="同步成功" :value="1"></el-option>
          <el-option label="下发中" :value="2"></el-option>
          <el-option label="删除中" :value="3"></el-option>
        </el-select>
        <!-- <el-button type="danger" @click="testData">测试导出</el-button> -->
        <el-button class="filter-item" type="primary" @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="resetListQuery" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" v-has="['查看同步状态']" @click="lookStatus" >查看同步状态</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="danger" :loading = "deleteLoading" v-has="['删除所选']" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
        <el-button class="filter-item" type="danger" plain v-has="['删除所有']" :loading = "deleteAllLoading" @dblclick.native="handleAllDelete"  icon="el-icon-delete">删除所有</el-button>
        <el-button class="filter-item" v-has="['批量审核']" type="warning" :disabled="selectArrayId.length < 2" icon="el-icon-zoom-in" @click="handleCheck">批量审核</el-button>
        <div style="width:100%">
          <el-button class="filter-item" type="primary" @click="openQuestionPictureDialog" icon="el-icon-refresh">查询问题图片</el-button>
          <el-button class="filter-item" type="primary" @click="checkQuestionPicture" icon="el-icon-refresh">检测问题图片</el-button></div>
        </div>
      <el-tag style="margin-bottom: 1rem" type="success" v-has="['删除所有']">删除所有功能按键需双击才可调用</el-tag><br>
      <el-dialog
        title="问题图片列表"
        :visible.sync="questionPictureDialog"
        width="50%">
        <el-button @click="handlehQuestionView" type="primary" round>导出全部</el-button>
        <el-button @click="reDetectTimeoutData" type="primary" round>重新检测超时数据</el-button>
          <el-table
            :data="questionPictureData"
            stripe
            style="width: 100%">
            <el-table-column
              prop="userName"
              label="姓名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="leader"
              label="部门"
              width="180">
            </el-table-column>
            <el-table-column
              prop="phone"
              label="手机号">
            </el-table-column>
            <el-table-column
              label="日期">
            <template slot-scope="scope">
            {{timeFormatter(scope.row.createTime)}}
          </template>
            </el-table-column>
            <el-table-column
              prop="errorMessage"
              label="问题原因">
            </el-table-column>
          <el-table-column
              label="查看图片">
            <template slot-scope="scope">
              <el-popover
                placement="left"
                width="270"
                trigger="click">
                <img v-if="questionImgUrl" style="width:240px;height:240px" :src="questionImgUrl">
                <el-button slot="reference" @click="viewQuestionPicture(scope.row)" type="primary">查看图片</el-button>
              </el-popover>
          </template>
            </el-table-column>
          </el-table>
          <el-pagination
            style="margin-top:15px"
            @current-change="questionPictureChange"
            background
            page-size="5"
            layout="prev, pager, next"
            :total="questionPictureTotal">
          </el-pagination>
      </el-dialog>

      <!-- <div class="status" style="margin: 0 0 20px;font-size:16px;color:#909399">
        <span style="margin-right:10px">授权人数: {{status.num ? status.num : 0 }}人</span>
        <span style="margin-right:10px">同步: {{status.finsh}}人</span>
        <span style="margin-right:10px">下发中: {{status.middle}}人</span>
        <span style="margin-right:10px">未同步: {{status.notFinsh}}人</span>
        <span style="margin-right:10px">删除中: {{status.delete}}人</span>
      </div> -->
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData"  v-loading.body="listLoading" @selection-change="handleSelectionChange" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left" ></el-table-column>
        <el-table-column label="姓名" align="center" prop="userName"></el-table-column>
        <el-table-column label="手机号" align="center" prop="phone">
          <template slot-scope="scope">
            <template v-if="isShowColumnFormatter(['隐藏手机号'])">{{scope.row.phone | hiddenPhone}}</template>
            <template v-else>{{scope.row.phone}}</template>
          </template>
        </el-table-column>
        <!-- <el-table-column label="地址" align="center" prop="addr"></el-table-column> -->
        <el-table-column label="IC卡号" align="center" prop="accessCardId"></el-table-column>
        <el-table-column label="韦根卡号" align="center" prop="wiegandCard"></el-table-column>
        <el-table-column label="房号地址" align="center">
          <template slot-scope="scope">
            <!-- 判断  floorNum & roomNum 有则显示 , 没有则显示 ==> addr -->
            <span v-if="scope.row.addr !== null">{{scope.row.addr}}</span>
            <span v-else-if="scope.row.floorNum !== null && scope.row.floorNum !== ''">{{scope.row.floorNum  + scope.row.roomNum}}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center" prop="type">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 0">非访客</span>
            <span v-if="scope.row.type === 1">访客</span>
            <span v-if="scope.row.type === 2">黑名单</span>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" align="center" prop="isCheck">
          <template slot-scope="scope">
            {{checkStatusFormatter(scope.row.isCheck)}}
          </template>
        </el-table-column>
        <el-table-column label="同步信息" align="center" prop="aiPower"></el-table-column>
        <el-table-column label="有效日期" align="center" prop="endTime">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.endTime)}}
          </template>
        </el-table-column>
        <el-table-column label="备注信息" align="center" prop="remarks"></el-table-column>
        <!-- 新增下发状态 -->
        <el-table-column label="错误状态" align="center" prop="errorMsg"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="300">
          <template slot-scope="scope">
            <el-button type="primary" @click.native.prevent="downFa(scope.row)" size="mini">重新下发</el-button>
            <el-button type="primary" @click.native.prevent="handleUpdate(scope.row)" size="mini">编辑</el-button>
            <el-button type="primary" @click.native.prevent="handleSeePhoto(scope.row)" style="margin-bottom:0.5rem" size="mini">查看图片</el-button>
            <!-- 新增录制图片  -->
            <el-button type="primary" @click.native.prevent="handleEditPhoto(scope.row)" style="margin-bottom:0.5rem" size="mini">编辑照片</el-button>
            <!-- end -->
            <el-button v-if="scope.row.type === 2" @click.native.prevent="toBeWhite(scope.row)" type="primary" size="mini">转为白名单</el-button>
            <el-button v-if="scope.row.type !== 2" @click.native.prevent="toBeBlack(scope.row)" type="primary" size="mini">转为黑名单</el-button>
            <el-button v-if="scope.row.type === 1" type="primary" @click.native.prevent="tobeAdmin(scope.row)" size="mini">转为非访客</el-button>
            <el-button v-if="scope.row.isCheck === 2" type="primary" @click.native.prevent="handlePermisson(scope.row)" size="mini">审核</el-button>
            <!-- <el-button type="primary" size="mini" @click.native.prevent="setMoreInfo(scope.row)">更多</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 编辑图片操作 -->
       <el-dialog title="编辑图片" width="40%" :visible.sync = "isEditPhoto">
        <el-form :model="editPhotoForm" :rules="editPhotoRules" ref="checkUserPhotoEdit" label-width="100px" >
          <el-form-item label="密码" required prop="password">
            <el-input v-model="editPhotoForm.password" placeholder="请输入密码..."></el-input>
          </el-form-item>
           <el-form-item label="编辑照片" required >
            <upload-photo :name="'file'" v-on:photoNumber = "photoNumber" :action="at" :fileData="fileData" :imgValue ="imgUrl"></upload-photo>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isEditPhoto = false">取消</el-button>
          <el-button type="primary" @click="commitUserPhoto">保存</el-button>
        </div>
      </el-dialog>

      <!-- 转为白名单 -->
       <el-dialog title="白名单" width="40%" :visible.sync = "dialogWhiteVisible">
        <el-form>
          <el-form-item label="账户" required>
            <el-select clearable  style="width:150px;" v-model="lists.dutyCompanyId"  class="filter-item" placeholder="请选择">
              <el-option v-for="(item, index) in userArr" :key=index :label=item.leader :value=item.id></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型" required>
            <el-select clearable  style="width:150px;" v-model="lists.type"  class="filter-item" placeholder="请选择">
              <el-option label="非访客" :value="0"></el-option>
              <el-option label="访客" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <div v-if="lists.type === 1">
            <el-form-item label="开始日期" required>
              <el-date-picker type="datetime"  v-model="lists.beginTime"  placeholder="开始日期不可为空">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束日期" required>
              <el-date-picker type="datetime"  v-model="lists.endTime"  placeholder="结束日期不可为空">
              </el-date-picker>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogWhiteVisible = false">取消</el-button>
          <el-button type="primary" @click="blackToWhite">保存</el-button>
        </div>
      </el-dialog>
      <!-- 转换非访客 -->
      <el-dialog title="非访客" width="40%" :visible.sync = "isNotVisible">
        <el-form>
          <el-form-item label="账户" required>
            <el-select clearable  style="width:150px;" v-model="lists.dutyCompanyId"  class="filter-item" placeholder="请选择">
              <el-option v-for="(item, index) in userArr" :key=index :label=item.leader :value=item.id></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isNotVisible = false">取消</el-button>
          <el-button type="primary" @click="tobeFang">保存</el-button>
        </div>
      </el-dialog>
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[5,10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <!-- 新增或者修改 -->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync = "dialogFormVisible" width="40%">
        <el-form :rules="formRules" ref="dataform" :model="form" autoComplete="on" label-position="right" label-width="100px">
          <el-form-item label="姓名" prop="userName">
            <el-input v-model="form1.userName" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="校验码" prop="idCard">
            <el-input v-model="form.idCard" disabled></el-input>
          </el-form-item>
          <el-form-item label="韦根卡号" prop="wiegandCard">
            <el-input v-model="form.wiegandCard" placeholder="请输入韦根卡号"></el-input>
          </el-form-item>
          <el-form-item label="IC卡号" prop="accessCardId">
            <el-input v-model="form.accessCardId" placeholder="请输入IC卡号"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input type="tel" v-model="form.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <!-- <el-form-item label="地址" prop="addr">
            <el-input v-model="form.addr" placeholder="请输入用户地址"></el-input>
          </el-form-item> -->
          <el-form-item label="上班时长"  v-if="shangban">
             <el-button :loading = "updataLoading" type="primary" @click="showss" v-if="isshowTime&&aiTokenIds.length>0" style="margin-bottom:20px;margin-left:10px">选择</el-button>
             <el-button :loading = "updataLoading" type="primary" @click="setss" v-else style="margin-bottom:20px;margin-left:10px">去设置</el-button>
        </el-form-item>
         <div v-if="tags" >
         <el-table
    ref="multipleTable"
    :data="choosearr"
    row-key="id"
    v-if="dd==1"
    style="width: 100%;padding: 0 25px;
    box-sizing: border-box;"
     max-height="400" >
     <el-table-column
     label="选择"
      width="60">
      <template slot-scope="scope">
        <el-radio v-model="radioss" :label="scope.row.id">
           <span></span>
        </el-radio>
      </template>
    </el-table-column>
    <el-table-column
      label="第一阶段"
      width="150">
      <template slot-scope="scope">
            <span v-if="scope.row.firstStage">{{getTime(scope.row.firstStage.toString().split(',')[0]/1)}}-{{getTime(scope.row.firstStage.toString().split(',')[1]/1)}}</span>
            <span v-else></span>
      </template>
    </el-table-column>
    <el-table-column
      prop="name"
      label="第二阶段"
      width="150">
      <template slot-scope="scope">
            <span v-if="scope.row.secondStage">{{getTime(scope.row.secondStage.toString().split(',')[0]/1)}}-{{getTime(scope.row.secondStage.toString().split(',')[1]/1)}}</span>
            <span v-else></span>
      </template>
    </el-table-column>
    <!-- 添加有效期  validFlg  0永久有效   1 当天有效 -->
   <el-table-column
      prop="address"
      label="有效期"
      width="200">
      <template slot-scope="scope">
            <p v-if="scope.row.workday">
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
            <span v-if="scope.row.startDt">{{getTimes(scope.row.startDt/1)}}</span>
            <span v-if="scope.row.endDt">-{{getTimes(scope.row.endDt/1)}}</span>
            <i style="font-style:normal" >(长期有效)</i>
            </p>
      </template>
    </el-table-column>
    </el-table>
     <p v-if="dd==2" style="margin-left:110px;margin-top:-25px;margin-bottom:25px">
     <!-- 无数据 -->
     <span style="color:#3a8ee6;cursor:pointer;display:inline-block;vertical-align: top;" @click="setss" >去设置或绑定</span>
     </p>
    </div>
    <el-form-item label="备注信息" prop="remarks">
      <el-input v-model="form.remarks" placeholder="请输入备注信息"></el-input>
    </el-form-item>
          <div v-if="dialogStatus === 'create'">
            <el-form-item label="图片" required>
              <upload-photo ref="uploadPhoto" :name="'file'" v-on:photoNumber = "photoNumber" :action="action" :fileData="fileData" :imgValue ="imgUrl"></upload-photo>
            </el-form-item>
          </div>
          <!-- <el-form-item label="类型" required>
            <el-radio-group v-model="form.type" @change="radioChange">
              <el-radio :label= 0 >非访客</el-radio>
              <el-radio :label= 1 >访客</el-radio>
            </el-radio-group>
          </el-form-item> -->
          <el-form-item v-if="form.type !== 1" label="有效期" required>
              <el-date-picker type="datetime"  v-model="form.endTime"  placeholder="有效期不可为空">
              </el-date-picker>
            </el-form-item>
          <div v-if="form.type === 1">
            <el-form-item label="开始日期" required>
              <el-date-picker type="datetime"  v-model="form.beginTime"  placeholder="开始日期不可为空">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束日期" required>
              <el-date-picker type="datetime"  v-model="form.endTime"  placeholder="结束日期不可为空">
              </el-date-picker>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button :loading="updateLoading" type="primary" v-if="dialogStatus === 'update'" @click="updateData">保存</el-button>
        </div>
      </el-dialog>
      <el-dialog title="成员审核" width="40%" :visible.sync = "dialogCheckVisible">
        <el-form label-position="right" autoComplete="on" label-width="100px">
          <el-form-item label="姓名" required>
            <el-input v-model="objName" style="width:280px" disabled></el-input>
          </el-form-item>
           <el-form-item label="图片">
            <img style="width:120px;height:120px" :src="imgUrl">
          </el-form-item>
          <el-form-item label="授权时长" required v-show="showType === 0">
           <el-select v-model="timeLimit" style="width:280px" @change="changeTimeKinds">
              <el-option v-for="item in timeKinds" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
            </el-select>
            <div v-show="val === 5">
              <el-input v-model="customTime" style="width:180px;margin-left:77px;margin-top: 10px"
              placeholder="请输入自定义时长" type="number"></el-input> 个月
            </div>
            <el-tag v-show="showType === 0" type="warning" style="float:left;margin-top: 10px">选择‘其他’可自定义时长，但必须填写数字，且以月为单位计算</el-tag>
          </el-form-item>
           <el-form-item label="上班时长"  v-if="shangban">
             <el-button :loading = "updataLoading" type="primary" @click="showss" v-if="isshowTime&&aiTokenIds.length>0" style="margin-bottom:20px;margin-left:10px">选择</el-button>
             <el-button :loading = "updataLoading" type="primary" @click="setss" v-else style="margin-bottom:20px;margin-left:10px">去设置</el-button>
        <!-- </el-form-item> -->
        </el-form-item>
        <!-- 时长选择 -->
        <!-- <el-form-item    > -->
         <div v-if="tags" >
         <el-table
    ref="multipleTable"
    :data="choosearr"
    row-key="id"
    v-if="dd==1"
    style="width: 100%;padding: 0 25px;
    box-sizing: border-box;"
     max-height="400" >
     <el-table-column
     label="选择"
      width="60">
      <template slot-scope="scope">
        <el-radio v-model="radioss" :label="scope.row.id">
           <span></span>
        </el-radio>
      </template>
    </el-table-column>
    <el-table-column
      label="第一阶段"
      width="150">
      <template slot-scope="scope">
            <span v-if="scope.row.firstStage">{{getTime(scope.row.firstStage.toString().split(',')[0]/1)}}-{{getTime(scope.row.firstStage.toString().split(',')[1]/1)}}</span>
            <span v-else></span>
      </template>
    </el-table-column>
    <el-table-column
      prop="name"
      label="第二阶段"
      width="150">
      <template slot-scope="scope">
            <span v-if="scope.row.secondStage">{{getTime(scope.row.secondStage.toString().split(',')[0]/1)}}-{{getTime(scope.row.secondStage.toString().split(',')[1]/1)}}</span>
            <span v-else></span>
      </template>
    </el-table-column>
    <!-- 添加有效期  validFlg  0永久有效   1 当天有效 -->
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
            <span v-if="scope.row.startDt">{{getTimes(scope.row.startDt/1)}}</span>
            <span v-if="scope.row.endDt">-{{getTimes(scope.row.endDt/1)}}</span>
            <i style="font-style:normal" >(长期有效)</i>
            </p>
      </template>
    </el-table-column>
    </el-table>
     <p v-if="dd==2" style="margin-left:110px;margin-top:-25px;margin-bottom:25px">
     <!-- 无数据 -->
     <span style="color:#3a8ee6;cursor:pointer;display:inline-block;vertical-align: top;margin-left:10px" @click="setss" >去设置或绑定</span>
     </p>
    </div>
     <!-- <el-button :loading = "updataLoading" type="primary" @click="saveTime" style="margin-top:20px">保存</el-button>
      <el-button :loading = "updataLoading" type="primary" @click="cancelTime" style="margin-top:20px">取消</el-button> -->
    <!-- </el-form-item> -->
     <!-- 时长选择结束 -->
          <el-form-item label="审核状态" required >
            <el-radio-group v-model="isCheck">
              <el-radio :label= 0 >审核不通过</el-radio>
              <el-radio :label= 1 >审核通过</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-show="showType === 1 && isCheck === 1" label="分配通道">
            <el-select v-model="channelId" multiple placeholder="请选择">
              <el-option
                v-for="item in channelArr"
                :key="item.id"
                :label="item.localName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogCheckVisible = false;radioss = '';tags = false">取消</el-button>
          <el-button type="primary" @click="isCheckData">保存</el-button>
        </div>
      </el-dialog>
       <el-dialog title="下发相机" width="40%" :visible.sync = "isChannelVisible">
        <el-form label-position="right" autoComplete="on" label-width="100px">
          <el-form-item label="分配通道">
            <el-select v-model="channelId" multiple placeholder="请选择">
              <el-option
                v-for="item in channelArr"
                :key="item.id"
                :label="item.localName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isChannelVisible = false">取消</el-button>
          <el-button type="primary" @click="queDown">保存</el-button>
        </div>
      </el-dialog>
      <el-dialog title="批量审核" width="40%" :visible.sync = "isVisible">
        <el-tag v-show="showType === 0" type="warning" style="float:right">选择‘其他’可自定义时长，但必须填写数字，且以月为单位计算</el-tag>
        <el-form>
          <el-form-item label="授权时长" required v-show="showType === 0">
           <el-select v-model="timeLimit" @change="changeTimeKinds">
              <el-option v-for="item in timeKinds" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
            </el-select>
            <div v-show="timeLimit === 5">
              <el-input v-model="customTime" style="width:180px;line-height:60px;margin-left:75px"
              placeholder="请输入自定义时长" type="number"></el-input>个月
            </div>
        </el-form-item>
          <el-form-item label="审核状态" required >
            <el-radio-group v-model="isCheck">
              <el-radio :label= 0 >审核不通过</el-radio>
              <el-radio :label= 1 >审核通过</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isVisible = false">取消</el-button>
          <el-button type="primary" @click="saveAllCheck">保存</el-button>
        </div>
      </el-dialog>
      <el-dialog title="图片" width="30%" :visible.sync = "dialogPhotoVisible">
        <el-form>
          <el-form-item>
            <upload-photo :foo.sync="photoType" :name="'file'" v-on:photoNumber = "photoNumber" :action="action" :fileData="fileData" :imgValue ="imgUrl"></upload-photo>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogPhotoVisible = false">取消</el-button>
          <el-button type="primary" @click="photoData">保存</el-button>
        </div>
      </el-dialog>
      <el-dialog title="更多" width="35%" :visible.sync = "isCatVisiable">
        <el-form label-position="right" label-width="100px">
          <el-form-item label="地址">
            <el-input disabled class="filter-item" v-model="objSet.addr"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-input disabled class="filter-item" v-model="objSet.sex"></el-input>
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input disabled class="filter-item" v-model="objSet.idCard"></el-input>
          </el-form-item>
          <el-form-item label="业主关系">
            <el-input disabled class="filter-item" v-model="objSet.relationship"></el-input>
          </el-form-item>
          <el-form-item label="访问原因">
            <el-input type="textarea" disabled class="filter-item" v-model="objSet.visitReasons"></el-input>
          </el-form-item>
           <!-- <el-form-item label="图片">
            <img :src = "imgUrls"/>
          </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isCatVisiable = false">取消</el-button>
        </div>
      </el-dialog>
      <!-- 同步状态 -->
      <el-dialog title="同步状态" width="80%" :visible.sync="statusLook" v-if="statusLook">
      <!-- {{finsh + middle}} -->
        <el-button class="filter-item" type="primary" @click="resetstatus" icon="el-icon-refresh" style="margin-bottom:20px;">刷新</el-button>
        <el-table :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="statusss"  v-loading.body="statusLoad"  element-loading-text="加载中..." border fit highlight-current-row>
          <el-table-column label="通道名称" align="center" prop="localName"></el-table-column>
          <el-table-column label="总人数(人数)" align="center" prop="num">
            <template slot-scope="scope">
            <span v-if="scope.row.num">
            {{scope.row.num}}
            </span>
             <span v-else>0</span>
            </template>
          </el-table-column>
          <el-table-column label="同步(人数)" align="center" prop="finsh"></el-table-column>
          <el-table-column label="下发中(人数)" align="center" prop="middle"></el-table-column>
          <el-table-column label="未同步(人数)" align="center" prop="notFinsh"></el-table-column>
          <el-table-column label="删除中(人数)" align="center" prop="delete"></el-table-column>
          <el-table-column label="排队(按部门)" align="center" prop="number">
          <template slot-scope="scope">
            <span v-if="scope.row.number">
            {{scope.row.number}}
            </span>
             <span v-else>排队中</span>
            </template>
          </el-table-column>
          <el-table-column label="进度" align="center" prop="delete">
          <template slot-scope="scope">
          <el-progress :text-inside="true" :stroke-width="26" v-if="scope.row.finsh==0&&scope.row.num==0" :percentage="0"></el-progress>
          <el-progress :text-inside="true" :stroke-width="26" v-else-if="scope.row.finsh!=0&&scope.row.num==0" :percentage="100"></el-progress>
          <el-progress :text-inside="true" :stroke-width="26" v-else-if="scope.row.finsh==0&&scope.row.num!=0" :percentage="0"></el-progress>
          <el-progress :text-inside="true" :stroke-width="26" v-else :percentage="parseInt(scope.row.finsh/(scope.row.num)*100)"></el-progress>
          </template>
          </el-table-column>
          <el-table-column label="预计下发完成时间" align="center" prop="date">
          <template slot-scope="scope">
            <span v-if="scope.row.date&&scope.row.number">
              <b v-if="scope.row.finsh==0&&scope.row.middle==0" style="font-weight: normal">
                {{formatterTime(new Date(scope.row.date).getTime())}}
              </b>
              <b v-else-if="scope.row.finsh==0&&scope.row.middle!=0" style="font-weight: normal">
                {{formatterTime((new Date().getTime() - new Date(scope.row.date).getTime()) * scope.row.middle + new Date().getTime() / 1)}}
              </b>
              <b v-else-if="scope.row.finsh!=0&&scope.row.middle==0" style="font-weight: normal">
                {{formatterTime((new Date().getTime() - new Date(scope.row.date).getTime()) / scope.row.finsh + new Date().getTime() / 1)}}
              </b>
              <b v-else style="font-weight: normal">
                {{formatterTime((new Date().getTime() - new Date(scope.row.date).getTime()) / scope.row.finsh * scope.row.middle + new Date().getTime() / 1)}}
              </b>
            </span>
            <span v-else>-</span>
          </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { isShowColumnFormatter, relationshipFormatter, checkStatusFormatter, personFormatter, timeFormatter, formatterTime } from '@/utils/formatter.js'
import { personType } from '@/utils/selectAble.js'
import { checkPhone } from '@/utils/validator.js'
// apiUserCheckPhoto, apiUserCheckPhoto,
import { faceDetectOpen, getUUid, getQueue, batchDetect, getErrorPhoto, faceDetect, apiUserEditPhoto, usersAIManage, reDownFa, getUserChannel, getAccountCamera, changeVisitor, getAiDuyCompany, whiteBlackList, typeCheck, AIMember, uploadAImMember, checkIsAddAIMember, deleteAIMembers, checkAIMemeber, seeAIMemberPhoto, updateMemberPhoto, getDates, getAItokens, getStatus } from '@/api/url'
import { httpGet, httpPost, httpDelete, httpPut } from '@/utils/restful' //
import UploadPhoto from './components/UploadPhoto/index.vue'
export default {
  components: {
    UploadPhoto
  },
  computed: {
    form1 () {
      let obj = Object.assign(this.form)
      Object.keys(obj).forEach(item => {
        if (typeof obj[item] === 'string') {
          obj[item] = obj[item].trim()
        }
      })
      return obj
    }
  },
  mounted () {
    this.fetchData()
  },
  data () {
    return {
      photoType: undefined,
      ifCheckQuestion: false,
      checkQuestionStr: undefined,
      questionJsonData: [{
        title: '姓名',
        key: 'userName',
        type: 'text'
      }, {
        title: '部门',
        key: 'leader',
        type: 'text'
      }, {
        title: '手机号',
        key: 'phone',
        type: 'text'
      }, {
        title: '日期',
        key: 'createTime',
        type: 'text'
      }, {
        title: '问题原因',
        key: 'errorMessage',
        type: 'text'
      }],
      questionImgUrl: undefined, // 问题图片地址
      questionPictureDialog: false, // 查看问题图片列表
      questionPictureData: [], // 存放问题图片列表
      questionPictureTotal: 0,
      queryQuestionPictureData: {
        offset: 1,
        limit: 5
      }, // 请求问题图片
      isEditPhoto: false, // 编辑照片操作
      tags: false,
      shangban: false,
      updataLoading: false,
      choosearr: [],
      dd: -1,
      isshowTime: false,
      aiTokenIds: [],
      radioss: '',
      editPhotoForm: {// 编辑照片form
        id: '',
        password: '',
        photo: ''
      },
      editPhotoRules: {// 编辑照片form 规则
        password: [
          {required: true, message: '密码不能为空！', trigger: 'blur'}
        ]
      },
      at: faceDetectOpen,
      action1: uploadAImMember,
      action: faceDetect,
      isChannelVisible: false,
      channelArr: [],
      // imgUrls: '',
      fileData: {
        photo: ''
      },
      imgUrl: '',
      isNotVisible: false,
      lists: {
        type: 0,
        mac: undefined,
        id: undefined,
        dutyCompanyId: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      isCheck: undefined,
      list: null,
      listLoading: true,
      isVisible: false,
      updateLoading: false,
      deleteLoading: false,
      deleteAllLoading: false,
      idId: undefined,
      userArr: [],
      listQuery: {
        departmentId: this.$store.getters.departmentId,
        offset: 1,
        limit: 10,
        phone: undefined,
        userName: undefined,
        type: undefined,
        isCheck: undefined,
        isDistribution: 0,
        isSync: ''
      },
      tableData: [],
      tableData1: [],
      total: null,
      relationshipFormatter: relationshipFormatter,
      isShowColumnFormatter: isShowColumnFormatter,
      checkStatusFormatter: checkStatusFormatter,
      personFormatter: personFormatter,
      timeFormatter: timeFormatter,
      formatterTime: formatterTime,
      personType: personType,
      dialogFormVisible: false,
      dialogCheckVisible: false,
      dialogPhotoVisible: false,
      dialogWhiteVisible: false,
      disabled: true,
      selectArrayId: [],
      aiPowerArr: [],
      deleStatus: true,
      dialogStatus: '',
      textMap: {
        update: '编辑成员',
        create: '添加成员'
      },
      form: {
        id: undefined,
        accessCardId: undefined,
        userName: undefined,
        phone: undefined,
        photo: '',
        addr: undefined,
        type: undefined,
        wiegandCard: '',
        beginTime: undefined,
        endTime: undefined
      },
      formRules: {
        userName: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        phone: [
          {required: true, trigger: 'blur', message: '不可为空'},
          {validator: checkPhone, trigger: 'blur'}
        ],
        addr: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ]
        // wiegandCard: [
        //   {required: true, trigger: 'blur', message: '不可为空'}
        // ]
      },
      isCatVisiable: false,
      objSet: {
        relationship: '未知',
        sex: '未知',
        addr: '未知',
        idCard: '未知',
        visitReasons: '未知'
      },
      oop: true,
      rowId: undefined,
      channelId: undefined,
      timeLimit: undefined,
      customTime: undefined,
      showType: undefined,
      val: undefined,
      objName: undefined,
      statusss: [],
      statusLook: false,
      statusLoad: true,
      timeKinds: [
        {
          valueNo: 1,
          valueName: '一个月'
        },
        {
          valueNo: 2,
          valueName: '三个月'
        },
        {
          valueNo: 3,
          valueName: '六个月'
        },
        {
          valueNo: 4,
          valueName: '一年'
        },
        {
          valueNo: 5,
          valueName: '其他'
        }
      ],
      jsonData: [
        {
          title: '姓名',
          key: 'userName',
          type: 'text'
        },
        {
          title: '手机号',
          key: 'phone',
          type: 'text'
        },
        {
          title: 'IC卡号',
          key: 'accessCardId',
          type: 'text'
        },
        {
          title: '韦根卡号',
          key: 'wiegandCard',
          type: 'text'
        },
        {
          title: '房号地址',
          key: 'addr',
          type: 'text'
        },
        {
          title: '类型',
          key: 'type',
          type: 'text'
        },
        {
          title: '审核状态',
          key: 'isCheck',
          type: 'text'
        },
        {
          title: '同步信息',
          key: 'aiPower',
          type: 'text'
        },
        {
          title: '有效日期',
          key: 'endTime',
          type: 'text'
        },
        {
          title: '备注信息',
          key: 'remarks',
          type: 'text'
        },
        {
          title: '错误状态',
          key: 'errorMsg',
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
  watch: {
    customTime (val) {
      if (val < 0) {
        this.customTime = 1
      }
    }
  },
  created () {
    // 是否首页跳转
    let from = this.$route.query.from
    let listQuery = this.$route.query.listQuery
    if (from && from === 'home' && listQuery) {
      listQuery = JSON.parse(listQuery)
      this.listQuery.isCheck = listQuery.is_check
      this.listQuery.type = listQuery.type
    }
  },
  methods: {
    // 重新检测超时数据
    async reDetectTimeoutData () {
      let res = await httpGet(getQueue + this.$store.getters.departmentId)
      if (res.code === -1) {
        this.$message({
          message: '当前正在检测,请勿重复检测',
          type: 'warning'
        })
      } else {
        httpPost(batchDetect + this.$store.getters.departmentId + '/2').then(res => {
          this.$message({
            message: '开始重新检测超时数据',
            type: 'success'
          })
        })
      }
    },
    // 导出全部
    async handlehQuestionView () {
      let res = await httpGet(getQueue + this.$store.getters.departmentId)
      if (res.code === -1) {
        this.$message({
          message: '当前正在检测,请勿重复检测',
          type: 'warning'
        })
      } else {
        httpGet(getErrorPhoto + this.$store.getters.departmentId, {offset: -1, limit: -1}).then(res => {
          let obj = res.data.rows
          return obj
        }).then(res => {
          res.forEach(item => {
            item.createTime = this.timeFormatter(item.createTime)
          })
          this.table2excel(this.questionJsonData, res, 'excel.xlsx')
        }).catch(err => {
          console.log(err)
        })
      }
    },
    async checkQuestionPicture () {
      let res = await httpGet(getQueue + this.$store.getters.departmentId)
      if (res.code === -1) {
        this.$message({
          message: '当前正在检测,请勿重复检测',
          type: 'warning'
        })
      } else {
        httpPost(batchDetect + this.$store.getters.departmentId + '/1').then(res => {
          this.$message({
            message: '开始检测',
            type: 'success'
          })
        })
      }
    },
    // 查看问题图片
    viewQuestionPicture (row) {
      this.questionImgUrl = undefined
      httpPost(seeAIMemberPhoto + row.userId).then(res => {
        this.$nextTick(() => {
          // 修改base64
          this.questionImgUrl = res.data.file
        })
      })
    },
    questionPictureChange (val) {
      this.queryQuestionPictureData.offset = val
      this.openQuestionPictureDialog()
    },
    openQuestionPictureDialog () {
      if (!this.questionPictureDialog) {
        this.questionPictureDialog = true
      }
      httpGet(getErrorPhoto + this.$store.getters.departmentId, this.queryQuestionPictureData).then(
        res => {
          this.questionPictureData = res.data.rows
          this.questionPictureTotal = res.data.total
        }
      )
    },
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item, index) => {
        item.phone = this.isShowColumnFormatter(['隐藏手机号']) ? this.func(item.phone) : item.phone
        item.addr = item.addr !== null ? item.addr : ((item.floorNum !== null && item.floorNum !== '') ? (item.floorNum + item.roomNum) : '')
        item.type = parseInt(item.type) === 0 ? '非访客' : ((parseInt(item.type) === 1) ? '访客' : '黑名单')
        item.isCheck = this.checkStatusFormatter(item.isCheck)
        item.endTime = this.timeFormatter(item.endTime)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    func (value) {
      if (value) {
        return value.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
      } else {
        return ''
      }
    },
    // 获取状态
    getstatus () {
      httpGet(getStatus + this.$store.getters.departmentId).then(res => {
        this.statusss = res.data
        this.statusLoad = false
        this.statusLook = true
      }).catch(() => {
        this.statusss = []
        this.statusLoad = false
        this.statusLook = true
      })
    },
    random (lower, upper) {
      return Math.floor(Math.random() * (upper - lower + 1)) + lower
    },
    resetstatus () {
      this.statusLoad = true
      this.getstatus()
    },
    // 查看同步状态
    lookStatus () {
      this.statusLoad = true
      this.getstatus()
    },
    // 获取当前照片
    getCurrentUserPhoto (row) {
      return new Promise((resolve, reject) => {
        httpPost(seeAIMemberPhoto + row.id)
          .then(res => {
            if (res.data !== null) {
              this.rowId = row.id
              // console.log('查看照片请求：', res)
              this.$nextTick(() => {
                this.fileData.photo = res.data.photo
                // this.imgUrl = 'data:image/jpg;base64,' + res.data.file
                resolve(res.data.file) // end
              })
            } else {
              this.rowId = row.id
              this.imgUrl = ''
              this.fileData.photo = ''
              this.$message.error('图片获取失败')
            }
          }).catch(() => { })
      })
    },
    cancelTime () {
      // 重置
      this.radioss = ''
      this.tags = false
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
    getDate (id) {
      // 查询时长
      // let that = this
      this.choosearr = []
      this.dd = -1
      httpGet(getDates, {id: id, departmentId: this.$store.getters.departmentId}).then(res => {
        this.choosearr = res.data
        if (this.choosearr.length > 0) {
          this.dd = 1
        } else {
          this.dd = 2
        }
      }).catch(() => {
        this.dd = 2
      })
    },
    setss () {
      // 去设置时长
      this.$router.push('/cameraMaintain/cameraManage')
    },
    showss () {
      // 查询绑定时长数据
      this.tags = true
      this.radioss = ''
      // this.aiTokenIds = ['2231']
      // aiTokenIds数组转换,拼接字符串
      let arrs = ''
      this.aiTokenIds.forEach((item, index) => {
        if (this.aiTokenIds.length - 1 === index) {
          arrs += item
        } else {
          arrs += item + ','
        }
      })
      this.getDate(arrs)
    },
    // 编辑图片
    async handleEditPhoto (row) {
      await this.getCurrentUserPhoto(row).then((img) => { // 获取现有图片
        // console.log('开始编辑图片进行操作： ', img)
        // this.imgUrl = ''
        this.$nextTick(() => {
          let newBase64 = img
          // 修改base64
          this.imgUrl = 'data:image/jpeg;base64,' + newBase64
          this.isEditPhoto = true // 打开编辑照片模态框
        })
        // console.log('图片信息： ', this.fileData, this.imgUrl)
      })
    },
    // 从新保存图片
    commitUserPhoto () {
      this.$refs.checkUserPhotoEdit.validate((valid) => {
        let imgData = {
          photo: this.fileData.photo,
          id: this.rowId
        }
        this.editPhotoForm = Object.assign({}, this.editPhotoForm, imgData) // 合并
        httpPost(apiUserEditPhoto, this.editPhotoForm).then(res => {
          // console.log('请求成功... ', res)
          this.$message({
            type: 'success',
            message: res.message,
            duration: 3000
          })
          this.isEditPhoto = false // 关闭编辑照片模态框
        }).catch(() => {
          // console.log('请求失败： ', err)
          // this.$message({
          //   type: 'warning',
          //   message: '保存失败！',
          //   duration: 3000
          // })
        })

        // console.log('验证：', this.editPhotoForm)
        // console.log(this.imgUrl, this.rowId)
        // console.log('用户数据信息', this.editPhotoForm)
      })
    },
    // 测试导出信息
    testData () {
      console.log(this.tableData)
    },
    downFa (row) {
      console.log('点击下发数据信息： ', row.id)
      httpGet(getUserChannel + '/' + row.id).then((res) => {
        if (res.data.length === 0) {
          this.$message({
            message: '请先配置通道',
            type: 'warning',
            duration: 4 * 1000
          })
        } else {
          console.log('获取到的下发数据信息：', res.data, res.data.length)

          this.channelArr = res.data
          this.useId = row.id
          this.isChannelVisible = true
        }
      }).catch(() => {})
    },
    queDown () {
      console.log(this.channelId)
      httpPost(reDownFa, {
        aiTokenId: this.channelId,
        aiUserId: this.useId
      }).then((res) => {
        // console.log('请求下发数据信息成功： ', res)
        this.$message({
          message: res.message,
          duration: 3000,
          type: 'success'
        })
        this.isChannelVisible = false
      }).catch(() => {})
    },
    // 转为非访客
    tobeAdmin (row) {
      console.log(row)
      this.lists.id = row.id
      httpGet(getAiDuyCompany, {departmentId: this.$store.getters.departmentId}).then(res => {
        if (res.data === null || res.data.rows === null) {
          this.userArr = []
        } else {
          this.userArr = res.data.rows
        }
      }).catch((err) => {
        this.$message.error(err)
      })
      this.isNotVisible = true
    },
    // fangke
    tobeFang () {
      httpPost(changeVisitor, {
        dutyCompanyId: this.lists.dutyCompanyId,
        userId: this.lists.id
      }).then((res) => {
        this.$message({
          message: res.message,
          duration: 3000,
          type: 'success'
        })
        this.isNotVisible = false
        this.resetListQuery()
      }).catch(() => {})
    },
    // 转为黑名单
    toBeBlack (row) {
      let obj = {
        id: row.id,
        type: 2
      }
      this.$confirm('确定将该用户转为黑名单？', '提示', {})
        .then(() => {
          httpPut(whiteBlackList, obj).then((res) => {
            console.log(res)
            this.$message({
              type: 'success',
              duration: 3000,
              message: res.message
            })
            this.resetListQuery()
          }).catch(() => {})
        }).catch(() => {})
    },
    // 查看通道
    watchChannel () {
      httpGet(getAccountCamera + '/' + this.idId).then(res => {
        if (res.data.length === 0) {
          this.$message({
            message: '请先配置通道',
            type: 'warning',
            duration: 4 * 1000
          })
        } else {
          this.channelArr = res.data
        }
      }).catch(() => {})
    },
    // 黑转白
    blackToWhite () {
      httpPut(whiteBlackList, this.lists).then((res) => {
        this.$message({
          type: 'success',
          duration: 3000,
          message: res.message
        })
        this.dialogWhiteVisible = false
        this.resetListQuery()
      }).catch(() => {
        this.dialogWhiteVisible = false
      })
    },
    // 转为白名单之前获取账户列表
    toBeWhite (row) {
      this.lists.id = row.id
      this.dialogWhiteVisible = true
      httpGet(getAiDuyCompany, {departmentId: this.$store.getters.departmentId}).then(res => {
        console.log(res)
        if (res.data === null || res.data.rows === null) {
          this.userArr = []
          this.$message({
            type: 'danger',
            duration: 3000,
            message: '获取不到可转入白名单的账户'
          })
        } else {
          this.userArr = res.data.rows
        }
      }).catch((err) => {
        this.$message.error(err)
      })
    },
    setMoreInfo (row) {
      console.log(row)
      if (row.relationship !== null) {
        this.objSet.relationship = this.relationshipFormatter(row.relationship)
      }
      if (row.type !== 1) {
        this.oop = false
      } else {
        this.oop = true
      }
      if (row.sex === 1) {
        this.objSet.sex = '男'
      }
      if (row.sex === 2) {
        this.objSet.sex = '女'
      }
      if (row.addr !== null) {
        this.objSet.addr = row.addr
      }
      if (row.floorNum !== null && row.roomNum !== null) {
        this.objSet.addr = row.floorNum + '#' + row.roomNum
      }
      if (row.idCard !== null) {
        this.objSet.idCard = row.idCard
      }
      if (row.visitReasons !== null) {
        this.objSet.visitReasons = row.visitReasons
      }
      // this.imgUrls = row.photo
      // this.objSet = JSON.parse(JSON.stringify(row))
      this.isCatVisiable = true
    },
    radioChange (value) {
      const data = {
        dutyCompanyId: this.memberId,
        type: value
      }
      httpPost(checkIsAddAIMember, data).then(res => {}).catch(() => {})
    },
    saveAllCheck () {
      if (this.isCheck === 'undefined') {
        this.$message.error('请先选择审核的状态')
      } else {
        const data = {
          ids: this.selectArrayId,
          isCheck: this.isCheck,
          departmentId: this.$store.getters.departmentId,
          customTime: this.customTime,
          timeLimit: this.timeLimit
        }
        httpPut(typeCheck, data).then(res => {
          this.fetchData()
          this.isVisible = false
          this.$message.success(res.message)
        }).catch(() => {
          this.isVisible = false
        })
      }
    },
    handleCheck () {
      this.isVisible = true
      this.showType = this.listQuery.type
      this.isCheck = 'undefined'
    },
    photoNumber (value) {
      this.form.photo = value
    },
    usepromise () {
      return new Promise((resolve, reject) => {
        let obj1 = JSON.parse(JSON.stringify(this.listQuery))
        obj1.limit = 100000000
        this.fetchData1(obj1, resolve)
      })
    },
    fetchData1 (obj1, resolve) {
      httpGet(usersAIManage, obj1).then(res => {
        if (res.data === null || res.data.rows === null) {
          this.tableData1 = []
        } else {
          this.tableData1 = res.data.rows
        }
        resolve(this.tableData1)
      })
    },
    // 获取成员数据
    fetchData () {
      // console.log('发送的数据: ', this.listQuery)

      httpGet(usersAIManage, this.listQuery)
        .then(res => {
          // 测试
          // res = {"code":1,"message":"成功","data":{"total":3,"rows":[{"id":26567,"userName":"test","workType":null,"idCard":"219756025711624","phone":"13021631497","addr":"test2","floorNum":"","roomNum":"","wiegandCard":"","isCheck":2,"beginTime":1588583342000,"endTime":1620119342000,"type":0,"aiPower":"1A:同步成功","remark":null,"sex":2,"relationship":null,"dutyCompanyId":847,"remarks":"","visitReasons":null,"photo":"F0CD923C705F4785A8F022FFA3339EAA","accessCardId":"123456","userPost":null,"errorMsg":"","aiTokenIds":['2231']},{"id":26176,"userName":"555","workType":null,"idCard":"220154800541624","phone":"15206322542","addr":"到时给不会","floorNum":null,"roomNum":null,"wiegandCard":"","isCheck":1,"beginTime":1584288000000,"endTime":1584374400000,"type":1,"aiPower":"null:下发中；null:下发中","remark":null,"sex":1,"relationship":null,"dutyCompanyId":695,"remarks":"","visitReasons":null,"photo":"14E78FB548364EE5B6C08FC0E8D39F09","accessCardId":"555","userPost":null,"errorMsg":"","aiTokenIds":[]},{"id":26164,"userName":"222","workType":null,"idCard":"217978619241624","phone":"15302640883","addr":"到时给不会","floorNum":null,"roomNum":null,"wiegandCard":"","isCheck":2,"beginTime":1584414054000,"endTime":1615950054000,"type":0,"aiPower":"null:下发中；null:下发中","remark":null,"sex":1,"relationship":4,"dutyCompanyId":695,"remarks":"2","visitReasons":null,"photo":"271799CB10DB44F79899AAB868389FF3","accessCardId":"2222","userPost":null,"errorMsg":"","aiTokenIds":['1','2','3']}]}}
          if (res.data === null || res.data.rows === null) {
            this.tableData = []
            this.total = 0
          } else {
            this.tableData = res.data.rows
            this.total = res.data.total
          }
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
    },
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.fetchData()
    },
    handleCurrentChange (val) {
      this.listQuery.offset = val
      this.fetchData()
    },
    // 刷新
    resetListQuery () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        departmentId: this.$store.getters.departmentId,
        userName: undefined,
        type: undefined,
        isCheck: undefined,
        isDistribution: 0
      }
      this.fetchData()
    },
    resetForm () {
      this.form = {
        id: undefined,
        userName: undefined,
        phone: undefined,
        photo: '',
        addr: undefined,
        type: undefined,
        wiegandCard: '',
        beginTime: undefined,
        endTime: undefined
      }
    },
    // 选中
    handleSelectionChange (val) {
      this.selectArrayId = []
      this.aiPowerArr = []
      // console.log(val)
      val.map(item => {
        this.selectArrayId.push(item.id)
        this.aiPowerArr.push(item.aiPower)
      })
      if (this.selectArrayId.length !== 0) {
        this.disabled = false
      } else {
        this.disabled = true
      }
      this.aiPowerArr.map(item => {
        if (item.indexOf('删除中') > -1) {
          this.deleStatus = false
        } else {
          this.deleStatus = true
        }
      })
    },
    // 删除选中
    // handleDelete () {
    //   if (this.deleStatus === false) {
    //     this.$confirm('所选数据中有正待后台删除中的数据，暂不可删除', '提示', {
    //       type: 'error'
    //     }).then(() => {}).catch(() => {})
    //   } else {
    //     this.$confirm('确认删除所选中的记录吗？', '提示', {
    //       type: 'warning'
    //     })
    //       .then(() => {
    //         this.deleteLoading = true
    //         httpDelete(AIMember, {ids: this.selectArrayId}).then(res => {
    //           this.deleteLoading = false
    //           this.fetchData()
    //           this.$message({
    //             type: 'success',
    //             message: res.message,
    //             duration: 4 * 1000
    //           })
    //         }).catch(() => {
    //           this.deleteLoading = false
    //         })
    //       }).catch(() => {})
    //   }
    // },
    handleDelete () {
      if (this.deleStatus === false) {
        this.$confirm('所选数据中有正待后台删除中的数据，暂不可删除', '提示', {
          type: 'error'
        }).then(() => {
        }).catch(() => {
        })
      } else {
        const h = this.$createElement
        let message = ['删除后所选用户将不能正常使用']
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
          // document.onkeydown = undefined
          httpDelete(AIMember, {ids: this.selectArrayId}).then(res => {
            this.deleteLoading = false
            this.fetchData()
            this.$message({
              type: 'success',
              message: res.message,
              duration: 4 * 1000
            })
          }).catch(() => {
            // document.onkeydown = undefined
            this.deleteLoading = false
          })
        })
      }
    },
    // 删除所有
    // handleAllDelete () {
    //   this.$confirm('确认删除所有的记录吗？', '提示', {
    //     type: 'error'
    //   })
    //     .then(() => {
    //       this.deleteAllLoading = true
    //       httpDelete(deleteAIMembers + '/' + this.$store.getters.departmentId).then(res => {
    //         this.deleteAllLoading = false
    //         this.fetchData()
    //         this.$message({
    //           type: 'success',
    //           message: res.message,
    //           duration: 4 * 1000
    //         })
    //       }).catch(() => {
    //         this.deleteAllLoading = false
    //       })
    //     }).catch(() => {})
    // },
    handleAllDelete () {
      const h = this.$createElement
      let message = ['删除后所有用户将不能正常使用']
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
        this.deleteAllLoading = false
      }).catch(() => {
        // document.onkeydown = undefined
        this.deleteAllLoading = true
        httpDelete(deleteAIMembers + '/' + this.$store.getters.departmentId).then(res => {
          this.deleteAllLoading = false
          this.fetchData()
          this.$message({
            type: 'success',
            message: res.message,
            duration: 4 * 1000
          })
        }).catch(() => {
          this.deleteAllLoading = false
          // document.onkeydown = undefined
        })
      })
    },
    handleUpdate (row) {
      this.tags = false
      this.radioss = ''
      this.shangban = false
      this.isshowTime = false
      this.aiTokenIds = []
      this.form = Object.assign({}, row)
      this.dialogStatus = 'update'
      // this.dialogFormVisible = true
      this.getaitokens(row.dutyCompanyId, row.type, 2)
    },
    updateData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          if (this.form.type === 1) {
            this.form.beginTime = (this.timeFormatter(this.form.beginTime - 8 * 60 * 60 * 1000) + '.000Z').replace(' ', 'T')
            this.form.endTime = (this.timeFormatter(this.form.endTime - 8 * 60 * 60 * 1000) + '.000Z').replace(' ', 'T')
          }
          this.updateLoading = true
          const updateFormData = Object.assign({}, this.form)
          updateFormData.workScheduleId = this.radioss
          updateFormData.photoType = this.photoType
          httpPut(AIMember, updateFormData)
            .then(res => {
              this.fetchData()
              this.dialogFormVisible = false
              setTimeout(() => { this.updateLoading = false }, 300)
              this.$message.success(res.message)
            }).catch(() => {
              this.updateLoading = false
            })
        }
      })
    },
    getaitokens (dutyCompanyId, type, el) {
      // this.isshowTime = false
      // this.aiTokenIds = []
      let that = this
      httpGet(getAItokens + dutyCompanyId).then(res => {
        // console.log(res)
        if (res.data.length > 0) {
          // console.log(res.data)
          this.isshowTime = true
          this.aiTokenIds = res.data
        } else {
          this.isshowTime = false
          this.aiTokenIds = []
        }
        if (type || this.aiTokenIds.length <= 0) {
          this.shangban = false
        } else {
          this.shangban = true
        }
        if (el === 1) {
          this.dialogCheckVisible = true
        } else if (el === 2) {
          this.dialogFormVisible = true
          this.$nextTick(() => {
            that.$refs.dataform.clearValidate()
            if (!that.form.idCard) {
              that.getCode()
            }
          })
        }
      }).catch(() => {
        if (el === 1) {
          this.dialogCheckVisible = true
        } else if (el === 2) {
          this.dialogFormVisible = true
          that.$nextTick(() => {
            that.$refs.dataform.clearValidate()
            if (!that.form.idCard) {
              that.getCode()
            }
          })
        }
      })
    },
    getCode () {
      if (this.themeType === 1 || this.themeType === 4) {
        httpGet(getUUid, {departmentId: this.$store.getters.departmentId})
          .then(res => {
            this.form.idCard = res.data
          }).catch(() => {})
      }
    },
    handlePermisson (row) {
      this.idId = row.dutyCompanyId
      // 点击审核重置选择时长
      this.tags = false
      this.radioss = ''
      this.shangban = false
      this.isshowTime = false
      this.aiTokenIds = []
      this.objName = JSON.parse(JSON.stringify(row)).userName
      this.watchChannel()
      this.isCheck = 'undefined'
      // this.dialogCheckVisible = true
      this.rowId = row.id
      this.showType = row.type
      // if (row.type) {
      //   this.shangban = false
      // } else {
      //   this.shangban = true
      // }
      this.getaitokens(row.dutyCompanyId, row.type, 1)
      // 根据aiTokenIds判断是否绑定上班时间
      // this.tableData.forEach((item,index) => {
      //   if (item.id === row.id) {
      // if (row.aiTokenIds.length > 0) {
      //   this.isshowTime = true
      //   this.aiTokenIds = row.aiTokenIds
      // }
      //   }
      // })
      httpPost(seeAIMemberPhoto + row.id)
        .then(res => {
          if (res.data !== null) {
            this.$nextTick(() => {
              this.fileData.photo = res.data.photo
              // 修改base64
              this.imgUrl = 'data:image/jpeg;base64,' + res.data.file
            })
          } else {
            this.fileData.photo = ''
            this.$message.error('图片获取失败')
          }
        }).catch(() => {})
    },
    isCheckData () {
      if (this.isCheck === 'undefined') {
        this.$message.error('请先选择审核的状态')
      } else {
        const data = {
          id: this.rowId,
          isCheck: this.isCheck,
          departmentId: this.$store.getters.departmentId,
          customTime: this.customTime,
          timeLimit: this.timeLimit,
          channelId: this.channelId,
          workScheduleId: this.radioss
        }
        httpPut(checkAIMemeber, data).then(res => {
          this.fetchData()
          this.dialogCheckVisible = false
          this.$message.success(res.message)
        }).catch(() => {
          this.dialogCheckVisible = false
        })
      }
    },
    // 获取图片
    handleSeePhoto (row) {
      httpPost(seeAIMemberPhoto + row.id)
        .then(res => {
          if (res.data !== null) {
            this.dialogPhotoVisible = true
            this.rowId = row.id
            this.$nextTick(() => {
              this.fileData.photo = res.data.photo
              this.imgUrl = 'data:image/jpeg;base64,' + res.data.file
              // 修改base64
            })
          } else {
            this.dialogPhotoVisible = true
            this.rowId = row.id
            this.fileData.photo = ''
            this.$message.error('图片获取失败')
          }
        }).catch(() => {})
    },
    // 保存图片
    photoData () {
      const data = {
        id: this.rowId,
        photo: this.fileData.photo,
        photoType: this.photoType
      }
      httpPost(updateMemberPhoto, data)
        .then(res => {
          this.dialogPhotoVisible = false
          this.$message.success(res.message)
        }).catch(() => {
          this.dialogPhotoVisible = false
        })
    },
    changeTimeKinds (val) {
      this.val = val
    }
  }
}
</script>
