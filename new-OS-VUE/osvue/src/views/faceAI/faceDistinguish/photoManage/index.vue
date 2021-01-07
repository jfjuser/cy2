<!-- 用户照片管理 -->
<template>
  <div id="photo-manage">
    <div class="filter-container line" style="overflow:hidden">
      <el-input
        class="filter-item line"
        clearable
        style="width: 150px;"
        v-model.trim="listQuery.addr"
        placeholder="地址查询"
      ></el-input>
      <el-input
        class="filter-item line"
        clearable
        style="width: 150px;"
        v-model.trim="listQuery.userName"
        placeholder="用户名查询"
      ></el-input>
      <div class="search-time line">
        <div class="block">
          <el-date-picker
            v-model="timeValue"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </div>
      </div>
      <el-button
        class="filter-item"
        type="primary"
        @click="handleSearch"
        icon="el-icon-search"
        >搜索</el-button
      >
      <el-button
        class="filter-item"
        type="primary"
        @click="resetListQuery"
        icon="el-icon-refresh"
        >刷新</el-button
      >
      <el-button
        class="filter-item"
        type="primary"
        @click="checkSelector"
        icon="el-icon-refresh"
        >全选</el-button
      >
      <el-button
        class="filter-item"
        type="danger"
        plain
        :loading="isDeleteSelectorLoading"
        @dblclick.native="deleteSelector"
        icon="el-icon-delete"
        >删除所选</el-button
      >
    </div>
    <div
      class="container-wrap"
      v-loading="boxIsLoading"
      element-loading-text="正在加载..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.2)"
    >
      <div class="content">
        <div class="user-photo-wrap" v-if="userPhotoData.length > 0">
          <div
            class="photo-item"
            v-for="(photoele, index) in userPhotoData"
            :key="index"
          >
            <div class="left-content">
              <el-checkbox border size="mini"></el-checkbox>
              <div class="user-name">
                <el-button
                  type="success"
                  @click.native="getUserPhoto(photoele)"
                  plain
                  size="small"
                  >{{ photoele.userName }}</el-button
                >
              </div>
            </div>
            <div class="right-content">
              <div
                class="slide-photo"
                v-if="photoele.image && photoele.image.length > 0"
              >
                <div
                  class="img-item"
                  v-for="(url, k) in photoele.image"
                  :key="k"
                >
                  <span
                    class="check-icon"
                    :ref="'photoIcon-' + index + k"
                    @click="clickUserIcon(index, k)"
                  ></span>
                  <el-image :src="url" :preview-src-list="photoele.image" lazy>
                    <div slot="placeholder" class="image-slot">
                      <span class="dot">loading...</span>
                    </div>
                  </el-image>
                </div>
              </div>
              <!-- 图片空空 -->
              <div class="img-empty" style="" v-else>
                当前照片数据为空。。。
              </div>
            </div>
            <div class="button-content">
              <el-button type="primary" size="mini" @click="commitPhoto(index)"
                >提交所选</el-button
              >
              <el-button type="warning" size="mini">全选</el-button>
              <el-button type="danger" size="mini">删除所选</el-button>
            </div>
          </div>
        </div>
        <!-- 空空数据 -->
        <div
          class="empty"
          v-else-if="!boxIsLoading && userPhotoData.length === 0"
        >
          空空如也...
        </div>
      </div>
    </div>
    <!-- 展示用户图片信息 -->
    <el-dialog title="图片信息" width="30%" :visible.sync="dialogPhotoVisible">
      <div class="" v-if="currentPhotoInfo">
        <h2 class="userName">{{currentPhotoInfo.userName}}</h2>
        <div class="block">
          <el-image :src="currentPhotoInfo.photos">
            <div slot="placeholder" class="image-slot">
              <span class="dot">加载中...</span>
            </div>
          </el-image>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPhotoVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        :page-sizes="[5, 10, 20, 30, 50]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.offset"
        :page-size="listQuery.limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
// seeAIMemberPhoto
import { apiFindUserPhoto, apiUpdataPhoto, seeAIMemberPhoto } from '@/api/url'
import { httpPost } from '@/utils/restful'
import { mapGetters } from 'vuex'
export default {
  name: 'PhotoManage',
  data () {
    return {
      dialogPhotoVisible: false,
      checkUserPhotoLoading: false,
      boxIsLoading: false,
      total: 20000, // 分页总数
      pageSize: 10, // 每一页的显示条数
      pagerCount: 5, // 分页超出折叠
      currentPage: 1, // 当前分页
      isDeleteSelectorLoading: false, // 删除loading
      timeValue: '',
      createBase64: 'data:image/jpg;base64,',
      defaultTime: {
        // 默认请求时间
        begin: new Date().getTime() - 3600 * 1000 * 24 * 7,
        end: new Date().getTime()
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              // start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      listQuery: {
        departmentId: null,
        begin: '',
        end: '',
        addr: '',
        userName: '',
        page: 1,
        sizes: 10 // 每一页的显示条数
      },
      userPhotoData: [], // 当前图片数据信息
      userPhotoReplaceData: [], // 当前需要替换图片数据信息
      currentPhotoInfo: null // 当前图片信息
    }
  },
  created () {
    if (this.departmentId) this.listQuery.departmentId = this.departmentId
    this.listQuery = Object.assign({}, this.listQuery, this.defaultTime)
    // console.log(this.listQuery)

    this.getUserPhotoData() // 获取用户照片数据
  },
  computed: {
    ...mapGetters(['departmentId'])
  },
  methods: {
    // 获取用户照片数据
    getUserPhotoData () {
      // console.log('正在搜索。。。')

      this.boxIsLoading = true // 启动loading
      httpPost(apiFindUserPhoto, this.listQuery)
        .then(result => {
          if (result.code === 1 && result.data && result.data.length > 0) {
            result.data.forEach(item => {
              if (item.image) {
                if (item.image.indexOf('://') < 0) {
                  item.image = [this.createBase64 + item.image]
                } else {
                  item.image = [item.image]
                }
              }
              return item
            })
            // console.log('查询到的：', result)
            this.boxIsLoading = false // 取消loading
            this.userPhotoData = result.data // 赋值
          } else {
            // console.log('查询失败结果：', result)
            this.userPhotoData = result.data
            this.boxIsLoading = false // 取消loading
          }
        })
        .catch(error => {
          console.log('查询错误：', error)
          this.boxIsLoading = false // 取消loading
        })
    },
    // 刷新
    resetListQuery () {
      this.listQuery = {
        departmentId: this.departmentId,
        begin: new Date().getTime() - 3600 * 1000 * 24 * 7,
        end: new Date().getTime(),
        addr: '',
        userName: '',
        page: 1,
        sizes: 10 // 每一页的显示条数
        // limit: 10, // 每一页的显示条数
        // offset: 5// 分页超出折叠
      }
      this.getUserPhotoData()
      // console.log('开始刷新。。。')
    },
    // 获取用户照片信息
    getUserPhoto (data) {
      // console.log('获取照片信息： ', data)
      let photoInfo = {
        userName: data.userName
      }
      if (data.userId) {
        const loading = this.$loading({
          lock: true,
          text: '正在加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        httpPost(seeAIMemberPhoto + data.userId).then(res => {
          if (res.code === 1 && res.data.file) {
            photoInfo.photos = this.createBase64 + res.data.file
            this.currentPhotoInfo = photoInfo
            this.dialogPhotoVisible = true
            loading.close()
          } else {
            this.currentPhotoInfo = null
            this.dialogPhotoVisible = false
            loading.close()
          }
        }).catch(() => { loading.close() })
      }
    },
    // 开始搜索
    handleSearch () {
      if (this.listQuery) {
        if (this.timeValue.length > 1) {
          let start = new Date(this.timeValue[0]).getTime()
          let end = new Date(this.timeValue[1]).getTime()
          if (end < start) {
            this.$message({
              type: 'warning',
              message: '结束时间不可小于开始时间，请重新选择！'
            })
          } else {
            this.listQuery.page = 1
            this.listQuery.sizes = 10 // 每一页的显示条数
            this.listQuery.begin = start // 赋值开始时间
            this.listQuery.end = end // 赋值结束时间
          }
        }
        this.getUserPhotoData()
      }

      // console.log('开始搜索。。。', this.listQuery)
      // console.log('开始搜索。时间。。', new Date(this.timeValue[0]).getTime(), new Date(this.timeValue[1]).getTime())
    },
    // 删除所选
    deleteSelector () {
      console.log('删除所选')
    },
    checkSelector () {
      console.log('全选、反选')
    },
    // 用户选择图片
    clickUserIcon (index, k) {
      // console.log(index, k)

      let classList = this.$refs['photoIcon-' + index + k][k].classList // 读取class集合
      // console.log(11, classList, this.$refs['photoIcon-' + index + k])
      let checkClass = 'checks' // 读取类名

      let len = classList.length //

      for (let i = 0; i < len; i++) {
        // console.log(classList[i])
        let currentPhoto = this.userPhotoData[index]
        // let currentImg = this.userPhotoData[index].image[k]
        // currentPhoto.image = currentImg
        if (classList[i] === checkClass) {
          // 检测是否含有这个class , 有则删除，没有则添加
          classList.remove(classList[i]) //
          // this.userPhotoData.splice(index,i)
          // classList.splice(i, 1)
          this.userPhotoReplaceData.filter((ele, v, self) => {
            return ele && ele.userId !== self[index].userId
          })
          // console.log('测试： ', this.userPhotoReplaceData)

          // console.log('截取： ', this.userPhotoReplaceData)
        } else {
          classList.add(checkClass)
          this.userPhotoReplaceData = this.userPhotoReplaceData.concat(
            ...[currentPhoto]
          )
        }

        // console.log('当前数据信息：', this.userPhotoData[index], this.userPhotoData[index].image[k])
      }
    },
    // 提交所选
    commitPhoto (index) {
      if (this.userPhotoReplaceData.length > 0) {
        console.log(
          '已选择： ',
          this.userPhotoReplaceData,
          this.userPhotoData[index]
        )

        let userId = this.userPhotoReplaceData[0].userId
        let newPhotoArr = Array.from(this.userPhotoReplaceData[0].image).map(
          (element, index) => {
            if (element.match(this.createBase64)) {
              element = element.replace(this.createBase64, '')
            }
            return element
          }
        )

        let updata = {
          id: userId,
          image: newPhotoArr[0]
        }

        // console.log('开始提交。。。', updata)
        httpPost(apiUpdataPhoto, updata)
          .then(res => {
            this.$message({
              type: 'success',
              message: '替换' + res.message
            })
            // console.log('提交成功数据信息', res)
            this.userPhotoReplaceData = [] // 初始化
            // this.userPhotoData.filter((element, index) => {
            //   if (element['userId'] === updata.id) {
            //     element.image = []
            //   }
            //   return element
            // })
            // this.userPhotoData[index].image = []
            // this.getUserPhotoData() // 获取用户照片数据
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    handleSizeChange (val) {
      console.log('改变size页码', val)
      // this.listQuery.sizes = val
      // this.fetchData()
    },
    // 改变页码
    handleCurrentChange (val) {
      console.log('改变页码', val)
      this.listQuery.page = val
      this.getUserPhotoData()
    },
    // 上一页
    prevClick () {
      console.log('上一页')
    },
    // 下一页
    nextClick () {
      console.log('下一页')
    }
  }
}
</script>
<style lang="scss" scoped>
$checkIcon: "~@/assets/icon/check-icon.jpg";
html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

#app-main {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}
#photo-manage >>> {
  padding: 20px;
  user-select: none;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  // background: url('../../../../assets/icon/check-circle.png');
  .userName{

  }
  .block{
    .el-image{
      width: 20vw;
      height: 20vw;
    }

  }
  .filter-container {
    display: flex;
    flex-wrap: wrap;
    .line {
      margin-right: 10px;
    }
  }
  .pagination-container {
    background: #fff;
    padding-top: 0;
    padding: 15px 20px;
    margin-top: 10px;
    border-radius: 20px;
  }
  .container-wrap {
    padding: 10px;
    border: 1px solid #eee;
    background: #fff;
    border-radius: 20px;
    overflow: hidden;
    height: calc(100vh - 110px - 180px);
    min-height: 300px;
    width: 100%;
    .content {
      height: 100%;
      width: 100%;
      overflow: auto;
      position: relative;
      .empty {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #999;
        font-size: 20px;
        letter-spacing: 3px;
        font-weight: bolder;
      }
      .photo-item {
        width: 100%;
        height: 120px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
        border-bottom: 1px solid #dddd;
        .left-content {
          width: 150px;
          // background: #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 10px;
          border-right: 1px oslid #eee;
          padding-right: 20px;
          height: 100%;
        }
        .right-content {
          flex: 1;
          // background: #000;
          overflow: hidden;

          height: 100%;
          .img-empty {
            color: #999;
            margin: 0 auto;
            height: 100%;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .slide-photo {
            height: 100%;
            box-sizing: border-box;
            padding-bottom: 10px;
            white-space: nowrap;
            overflow-x: auto;
            overflow-y: hidden;
            padding: 0 10px;
            .img-item {
              width: 100px;
              height: calc(100% - 10px);
              border-radius: 10px;
              box-shadow: 2px 2px 5px 2px rgb(197, 191, 191);
              box-sizing: border-box;
              display: inline-block;
              // overflow: hidden;
              margin-left: 10px;
              position: relative;
              cursor: pointer;
              .check-icon {
                position: absolute;
                top: 0;
                right: 0px;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                overflow: hidden;
                background: rgb(255, 255, 255);
                box-shadow: 0 0 2px 4px rgb(48, 214, 236) inset;
                z-index: 100;
                &.checks {
                  background: url($checkIcon) no-repeat center;
                  background-size: 100% 100%;
                  box-shadow: none;
                }
              }
              .el-image {
                box-sizing: border-box;
                padding: 5px;
                overflow: hidden;
                width: 100px;
                height: 100%;

                .image-slot {
                  width: 100%;
                  height: 100%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  font-size: 12px;
                  color: #666;
                }
                img {
                  border-radius: 10px;
                }
              }
            }
          }
        }
        .button-content {
          width: 180px;
          height: 100%;
          padding: 10px;
          overflow-y: auto;
          overflow-x: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
        }
      }
    }
  }
}
</style>
