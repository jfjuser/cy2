<template>
    <div class="blackLists">
      <NavBar
        title="黑名单"
        left-text="返回"
        right-text="添加"
        left-arrow
        @click-left="onClickLeft"
        @click-right="isAdd = true"
      />
      <Search
        v-model="listQuery.userName"
        placeholder="请输入姓名"
        show-action
        @search="onSearch"
      >
        <Button slot="action" @click="onSearch" type="info" size="small">搜索</Button>
      </Search>
      <div>
        <div style="text-align:right">
          <!-- <Button type="info">批量添加</Button> -->
          <Button type="danger" style="margin-right:0.5rem" v-show="!show" :loading="deleteAllLoading" @click="deleteAll">删除所有</Button>
        </div>
        <Popup v-model="isAdd" position=top style="width:96vw;height:16rem">
          <Field
            v-model="form.userName"
            required
            label="姓名"
            clearable
            placeholder="请输入名字"
            style="line-height:2rem;font-size:0.9rem;"
          />
          <!-- <div class="uploaderbox">
            <Field label="照片" required placeholder="请选择照片" readonly :value="imgName"/>
            <Field label="照片" @change="fn" required type="file" accept="image/*" multiple class="uploaderimg"/>
          </div> -->
          <van-uploader :after-read="onRead" style="width:100%" accept="image/*" multiple>
            <Field label="照片" required placeholder="请选择照片" readonly v-model="imgName"/>
          </van-uploader>
          <Field
            v-model="form.remark"
            required
            label="原因"
            clearable
            placeholder="请输入添加为黑名单的原因"
            style="line-height:2rem;font-size:0.9rem;"
          />
          <div>
            <Button type="info" :loading="createLoading" @click="addBlackUser" style="width:60vw;border-radius:8px;margin-top:2rem;margin-left:20vw;">确定</Button>
          </div>
        </Popup>
        <PullRefresh v-model="isLoading" @refresh="onRefresh">
          <!-- <CellGroup :title="`${index + 1}`" v-for="(item, index) in tableData" :key=index>
            <Cell title="姓名" icon="user-o" :value="item.userName"/>
            <Cell title="原因" icon="user-o" :value="item.remark"/>
            <Cell title="同步消息" icon="orders-o" :value="item.aiPower"/>
            <span style="display:block;line-height:2.5rem;color:#1E90FF;margin-left:86%;" @click="showin(item,index)">操作</span>
          </CellGroup> -->
          <div style="width:90vw;margin:0.5rem 0 0 5vw;">
            <div v-for="(item, index) in tableData" :key="index">
            <!-- border:1px solid #ccc; -->
              <van-cell-group style="margin-top: 1.5rem;">
                <Cell title="姓名" icon="user-o" :value="item.userName"/>
                <Cell title="原因" icon="user-o" :value="item.remark"/>
                <Cell title="同步消息" icon="orders-o" :value="item.aiPower"/>
                <span style="display:block;line-height:2.5rem;color:#1E90FF;margin-left:86%;" @click="showin(item,index)">操作</span>
              </van-cell-group>
            </div>
          </div>
          <div style="width:100%;height:22rem;text-align:center" v-show="show">
             <img src="@/assets/noData (2).png" style="max-width:300px;max-height:300px"/>
          </div>
        </PullRefresh>
        <Popup v-model="isPic">
          <div style="width:100%;height:22rem;text-align:center">
            <img :src=imgUrl style="max-width:300px;max-height:300px"/>
          </div>
        </Popup>
        <Popup v-model="isShow" position=bottom>
          <Button size="large" @click="isShow = false">取消</Button>
          <Button size="large" @click="deleteUser">删除</Button>
          <Button size="large" @click="getPic">查看图片</Button>
        </Popup>
      </div>
      <div style="margin-top:2rem" v-show="!show">
        <Pagination
          v-model="listQuery.offset"
          :page-count="Math.ceil(total/10)"
          :total-items = 'total'
          mode="simple"
          @change="seePage"
        >
        </Pagination>
      </div>
    </div>
</template>
<script>
import { NavBar, Search, Button, Cell, Dialog, Field, Toast, CellGroup, PullRefresh, Pagination, Popup, Uploader } from 'vant'
import { httpGet, httpDelete, httpPost } from '@/utils/restful'
import { usersAIManage, seeAIMemberPhoto, AIMember, deleteAIMembers, addBlackUser, checkAIMemberPhoto } from '@/api/url'
import lrz from 'lrz'
export default {
  name: 'blackList',
  data () {
    return {
      isLoading: false,
      isPic: false,
      createLoading: false,
      deleteLoading: false,
      deleteAllLoading: false,
      isShow: false,
      show: undefined,
      isAdd: false,
      total: undefined,
      tableData: [],
      fileData: {
        photo: ''
      },
      imgUrl: '',
      form: {
        userName: '',
        photo: '',
        remark: '',
        departmentId: this.$store.getters.departmentId
      },
      listQuery: {
        offset: 1,
        limit: 10,
        username: undefined,
        type: 2
      },
      imgName: ''
    }
  },
  components: { NavBar, Search, Button, Dialog, Toast, Cell, Field, CellGroup, PullRefresh, Pagination, Popup, 'van-uploader': Uploader },
  methods: {
    onClickLeft () {
      this.$router.push('/indexPage/')
    },
    onSearch () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    seePage (val) {
      this.listQuery.offset = val
      this.fetchData()
    },
    // 查看图片
    getPic () {
      httpPost(seeAIMemberPhoto + this.userItem.id)
        .then(res => {
          if (res.data !== null) {
            this.isShow = true
            // this.rowId = row.id
            this.$nextTick(() => {
              this.fileData.photo = res.data.photo
              this.imgUrl = 'data:image/jpg;base64,' + res.data.file
            })
            this.isPic = true
          } else {
            this.isShow = true
            // this.rowId = row.id
            this.fileData.photo = ''
            Toast.fail('图片获取失败')
          }
        }).catch(() => {})
    },
    // 操作
    showin (item, index) {
      this.isShow = true
      this.userItem = item
      this.itemIndex = index
    },
    deleteAll () {
      // 删除所有
      Dialog.confirm({
        message: '确认删除所有的记录吗？',
        title: '提示'
      })
        .then(() => {
          this.deleteAllLoading = true
          httpDelete(deleteAIMembers + '/' + this.$store.getters.departmentId).then(res => {
            Toast({
              type: 'success',
              // message: res.message,
              message: '删除成功！',
              duration: 4 * 1000
            })
            this.deleteAllLoading = false
            this.fetchData()
          }).catch(() => {
            this.deleteAllLoading = false
          })
        }).catch(() => {})
    },
    // 刷新
    onRefresh () {
      setTimeout(() => {
        this.listQuery = {
          name: undefined,
          limit: 10,
          offset: 1
        }
        this.fetchData()
        this.$toast('刷新成功')
        this.isLoading = false
      }, 500)
    },
    // 重置
    restForm () {
      this.form = {
        userName: '',
        photo: '',
        remark: '',
        departmentId: this.$store.getters.departmentId
      }
    },
    // 获取成员数据
    fetchData () {
      this.listQuery = Object.assign(this.listQuery, {type: 2, departmentId: this.$store.getters.departmentId})
      httpGet(usersAIManage, this.listQuery)
        .then(res => {
          if (res.data === null || res.data.rows === null) {
            this.tableData = []
            this.total = 0
            this.show = true
          } else {
            this.tableData = res.data.rows
            this.total = res.data.total
            this.show = false
            console.log(this.tableData)
          }
        }).catch(() => {
        })
    },
    deleteUser (item) {
    // 删除选中
      Dialog.confirm({
        title: '提示',
        message: '确定要删除这个黑名单？'
      })
        .then(() => {
          httpDelete(AIMember, {ids: [this.userItem.id]}).then(res => {
            Toast({
              type: 'success',
              message: res.message,
              duration: 4 * 1000
            })
            this.fetchData()
            this.isShow = false
          }).catch(() => {
          })
        }).catch(() => {})
    },
    addBlackUser () {
      this.createLoading = true
      let aiUserInsertBlacklistDto = this.form
      httpPost(addBlackUser, aiUserInsertBlacklistDto)
        .then((res) => {
          this.fetchData()
          Toast({
            message: res.message,
            type: 'success',
            duration: 3000
          })
          console.log(res)
          this.isAdd = false
          this.createLoading = false
          this.restForm()
        }).catch(() => {
          this.createLoading = false
        })
    },
    getFileName (fileName, length = 10) {
      return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36) + '.' + fileName.split('.').pop()
    },
    // fn (f) {
    //   console.log(f)
    //   let file = f.target.files[0]
    //   // let self = this
    //   const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg'
    //   const isLt10M = file.size / 1024 / 1024 < 10 && file.size / 1024 / 1024 > 0.5
    //   const isLT20M = file.size / 1024 / 1024 > 5
    //   if (!isJPG) {
    //     Toast.fail('上传头像图片只能是 JPG/JPEG 格式!')
    //   }
    //   if (isLT20M) Toast.fail('图片不能超过5M!')
    //   if (isLt10M) {
    //     // eslint-disable-next-line
    //     lrz(file, { quality: 0.2, width: 1000 })
    //       .then(result => {
    //         const formData = new window.FormData()
    //         formData.append('photo', this.form.photo)
    //         formData.append('file', result.file, this.getFileName(result.origin.name))
    //         httpPost(checkAIMemberPhoto, formData).then(res => {
    //           this.form.photo = res.data
    //           this.form = Object.assign(this.form, res.data)
    //           console.log(res.data)
    //           // self.imageUrl = URL.createObjectURL(file)
    //           // self.$refs.uploadPhoto.clearFiles()
    //           console.log(res)
    //           this.imgName = result.name
    //           Toast.success('图片校验成功')
    //         }).catch(() => {
    //           Toast.fail('图片检验失败，请重新上传')
    //         })
    //       })
    //   } else {
    //     let formData = new window.FormData()
    //     formData.append('file', file, this.getFileName(file.name))
    //     formData.append('photo', this.form.photo)
    //     httpPost(checkAIMemberPhoto, formData)
    //       .then(res => {
    //         this.form.photo = res.data
    //         this.form = Object.assign(this.form, res.data)
    //         this.imgName = file.name
    //         Toast.success('图片校检成功')
    //       }).catch(() => {
    //         Toast.fail('图片校检失败，请重新上传！')
    //       })
    //   }
    // },
    onRead (res, detail) {
      // console.log(res)
      let file = res.file
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg'
      const isLt10M = file.size / 1024 / 1024 < 10 && file.size / 1024 / 1024 > 0.5
      const isLT20M = file.size / 1024 / 1024 > 5
      if (!isJPG) {
        Toast.fail('上传头像图片只能是 JPG/JPEG 格式!')
      }
      if (isLT20M) Toast.fail('图片不能超过5M!')
      if (isLt10M) {
        // eslint-disable-next-line
        lrz(file, { quality: 0.2, width: 1000 })
          .then(result => {
            const formData = new window.FormData()
            formData.append('photo', this.form.photo)
            formData.append('file', result.file, this.getFileName(result.origin.name))
            httpPost(checkAIMemberPhoto, formData).then(res => {
              this.form.photo = res.data
              this.form = Object.assign(this.form, res.data)
              // self.imageUrl = URL.createObjectURL(file)
              // self.$refs.uploadPhoto.clearFiles()
              this.imgName = file.name
              Toast.success('图片校验成功')
            }).catch(() => {
              Toast.fail('图片检验失败，请重新上传')
            })
          })
      } else {
        let formData = new window.FormData()
        formData.append('file', file, this.getFileName(file.name))
        formData.append('photo', this.form.photo)
        httpPost(checkAIMemberPhoto, formData)
          .then(res => {
            this.form.photo = res.data
            this.form = Object.assign(this.form, res.data)
            this.imgName = file.name
            Toast.success('图片校检成功')
          }).catch(() => {
            Toast.fail('图片校检失败，请重新上传！')
          })
      }
    }
  },
  created () {
    this.fetchData()
  }
}
</script>
<style lang="scss" scoped>
.imgStyle{
  max-width: 100vw;
  max-height: auto;
}
.uploaderbox {
  position: relative;
}
.uploaderimg {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}
</style>
