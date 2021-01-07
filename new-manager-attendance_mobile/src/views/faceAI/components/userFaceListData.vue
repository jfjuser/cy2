<template>
  <div class="user-face-list-data">
    <!-- 搜索框  @input="onSearch"-->
    <van-search
      v-model="userFaceListParams.userName"
      show-action
      shape="round"
      background="#ffff"
      placeholder="请输入搜索用户名字关键词..."
      @search="onSearch"
    >
      <template #action>
        <div @touchstart="onSearch">搜索</div>
      </template>
    </van-search>
    <!-- 人脸数据列表 -->
    <van-list
      v-model="listLoading"
      :finished="listFinishd"
      :finished-text="
        userlistData.length > 0
          ? '没有更多了'
          : '当前没有数据，请录制人脸数据！'
      "
      error-text="请求失败，点击重新加载"
      :error.sync="getUserListError"
      @load="fatchUserFaceList"
    >
      <van-cell v-for="(item, index) in userlistData" :key="index" center>
        <van-row type="flex" justify="space-between">
          <van-col span="15">
            <p class="list-title overflow-nowrap">
              部门：{{ item.leader ? item.leader : "暂无！" }}
            </p>
            <p class="userName overflow-nowrap">用户名：{{ item.userName }}</p>
          </van-col>
          <van-col span="8" class="">
            <van-button
              plain
              size="mini"
              @touchstart="detailsListItem(index)"
              type="info"
              >详情</van-button
            >
            <van-button
              plain
              size="mini"
              @touchstart="deletedUserList(index)"
              type="danger"
              >删除</van-button
            >
          </van-col>
        </van-row>
      </van-cell>
      <!-- faceUserListAdmin -->
      <!-- <van-checkbox-group v-model="faceChecked">
        <van-checkbox v-for="(item, index) in userlistData" :key="index" label-disabled>
          <van-cell  center>
            <van-row type="flex" justify="space-between">
              <van-col span="15">
                <p class="list-title overflow-nowrap">
                  部门ID：{{ item.addr ? item.addr : "暂无！" }}
                </p>
                <p class="userName overflow-nowrap">
                  用户名：{{ item.userName }}
                </p>
              </van-col>
              <van-col span="8" class="">
                <van-button
                  plain
                  size="mini"
                  @touchstart="detailsListItem(index)"
                  type="info"
                  >详情</van-button
                >
                <van-button
                  plain
                  size="mini"
                  @touchstart="deletedUserList(index)"
                  type="danger"
                  >删除</van-button
                >
              </van-col>
            </van-row>
          </van-cell>
        </van-checkbox>
      </van-checkbox-group> -->
    </van-list>
    <div class="add-face-user">
      <van-button
        block
        type="info"
        @click="addUserFace(0)"
        round
        class="add-face-user-btn"
        >添加录制人脸</van-button
      >
    </div>
  </div>
</template>

<script>
// ApiDeleteFaceData
import { lookMember } from '@/api/url'
import { setLocalStorage } from '@/utils/localStore'
import { Search, Checkbox, CheckboxGroup } from 'vant'
// import { lookMember, userAdmin, adaptNewInfo } from '@/api/url'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      listLoading: false, // 人脸列表loading
      listFinishd: false, //
      userlistData: [], // 用户人脸数据
      faceChecked: [],
      userFaceListParams: {
        userName: '',
        offset: 1,
        limit: 15,
        departmentId: this.$store.getters.departmentId
      },
      getUserListError: false
    }
  },
  components: {
    'van-search': Search,
    'van-checkbox': Checkbox,
    'van-checkbox-group': CheckboxGroup
  },
  methods: {
    ...mapMutations('userFaceAdmin', [
      'SET_USER_FACE_STEPS',
      'SET_DATAILS_FORM_DATA'
    ]),
    // 添加用户人脸数据
    addUserFace () {
      return this.SET_USER_FACE_STEPS(0)
    },
    // 请求拉取用户人脸数据列表
    fatchUserFaceList () {
      this.$http
        .post(
          `${lookMember}?offset=${this.userFaceListParams.offset}&limit=${this.userFaceListParams.limit}`,
          this.userFaceListParams
        )
        .then(res => {
          this.userFaceListParams.offset = this.userFaceListParams.offset + 1
          this.getUserListError = false
          if (res.data && res.data.rows) {
            this.uniquenessArr(this.userlistData, res.data.rows).then(
              result => {
                this.userlistData = result
                // console.log(333333333, result)
              }
            )
            // this.userlistData = this.uniquenessArr(this.userlistData, res.data.rows)
            // this.userlistData = this.userlistData.concat(res.data.rows)
            // this.userlistData = res.data.rows
            // console.log(this.userlistData)

            this.listLoading = false
            if (res.data.rows.length < this.userFaceListParams.limit) {
              this.listFinishd = true
            }
          } else {
            this.listLoading = false
            this.listFinishd = true
          }
        })
        .catch(() => {
          this.listLoading = false
          this.getUserListError = true
        })
    },
    async uniquenessArr (oldArr, newArr) {
      let length = oldArr.length + newArr.length
      // if (oldArr.length === 0) {
      //   return newArr
      // }

      for (let i = 0; i < length; i++) {
        if (oldArr[i]) {
          if (oldArr[i].id !== newArr[i].id) {
            oldArr.push(newArr[i])
          }
        } else {
          if (newArr[i] && newArr[i].id) {
            oldArr.push(newArr[i])
          }
        }

        if (oldArr[i] === undefined) {
          oldArr.splice(i, 1)
        }
        /// /////////////////添加换行符/////////////////////////////
        if (oldArr[i] && oldArr[i].aiPower) {
          let splitTxt = oldArr[i].aiPower.replace(/[;；]/gm, '; <br />\n')
          oldArr[i].aiPower = splitTxt
        }
      }

      await oldArr
      return oldArr
    },
    onSearch () {
      this.userFaceListParams.offset = 1
      this.userlistData = []
      this.fatchUserFaceList()
      // console.log('测试测试', '1208464114'.indexOf(this.searchValue))

      // let getVal = this.userlistData.reduce((v, current) => (current.userName.indexOf(this.searchValue) !== -1 ? v + 1 : v), 0)
      // if (getVal === 0) {
      //   return this.fatchUserFaceList()
      // } else {
      //   console.log('搜索结果“', getVal)
      //   this.userFaceListParams.limit = getVal
      //   this.userFaceListParams.offset = 1
      //   this.userlistData = []
      //   return this.fatchUserFaceList()
      // }
    },
    // 查询用户详情
    detailsListItem (id) {
      if (Object.prototype.toString.call(this.userlistData[id]) === '[object Object]') {
        this.$dialog
          .confirm({
            title: '用户详情查看',
            message: `是否查看：${this.userlistData[id].userName}! `
          })
          .then(res => {
            console.log('详情信息： ', this.userlistData[id])

            this.SET_DATAILS_FORM_DATA(this.userlistData[id])
            this.SET_USER_FACE_STEPS(2)
            setLocalStorage('saveTempData', this.userlistData[id])
          })
          .catch(() => {})
      } else {
        this.$toast.fail('查询失败！')
      }
    },
    // 删除用户信息
    deletedUserList (id) {
      // console.log('删除当前的人脸数据', this.userlistData[id])
      this.$dialog
        .confirm({
          title: '确定删除人脸信息',
          message: `部门ID：${this.userlistData[id].dutyCompanyId},\n用户名：${this.userlistData[id].userName} ! `
        })
        .then(res => {
          // console.log('删除用户人脸数据。。')
          const ToastLoading = this.$toast.loading({
            forbidClick: true,
            message: '正在删除...',
            position: 'bottom',
            duration: 500
          })
          let userId = this.userlistData[id].id
          const formData = {
            departmentId: this.$store.getters.departmentId,
            ids: [userId]
          }
          // 发起删除请求
          this.$http
            .delete(lookMember, { data: formData })
            .then(res => {
              ToastLoading.clear()
              this.userlistData.splice(id, 1)
              this.$toast.success('删除成功')
            })
            .catch(() => {
              ToastLoading.clear()
            })
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.user-face-list-data {
  .add-face-user {
    position: fixed;
    left: 50%;
    bottom: 0rem;
    transform: translateX(-50%);
    width: 100%;
    padding: 0.3rem 1rem;
    box-sizing: border-box;
    background: #f1f1f1;
    z-index: 200;
  }
  .van-list {
    padding: 0.3rem 0;
  }
  .van-search {
    padding: 0 0.3rem;
    border-bottom: 1px solid #f1f1f1;
    padding-bottom: 0.3rem;
    .van-search__action {
      background: #ffff;
    }
  }
}
</style>
