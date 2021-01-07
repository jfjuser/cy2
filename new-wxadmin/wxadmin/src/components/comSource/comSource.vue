<template>
  <div>
    <NavBar
      title="积分"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <Tabs>
      <Tab title="全部">
        <div style="line-height:2.5rem;width:100vw;text-align:right;background-color:#FBFBFF"><span>获取: <span style="color:#1E90ff">280</span> </span><span style="margin-left:1rem">使用: </span><span style="color:#FFAF60;;margin-right:0.7rem">20</span></div>
        <div>
          <Cell title="测试布局" value="+15" size="large" label="2018-05-20" />
          <Cell title="测试布局1" value="+35" size="large" label="2018-05-28" />
          <Cell title="测试布局2" value="+25" size="large" label="2018-07-13" />
          <Cell title="测试布局3" value="-25" size="large" label="2018-11-13" />
        </div>
      </Tab>
      <Tab title="查看">
        <Cell title="测试布局" value="+15" size="large" label="2018-05-20" />
        <Cell title="测试布局1" value="+35" size="large" label="2018-05-28" />
        <Cell title="测试布局2" value="+25" size="large" label="2018-07-13" />
        <Cell title="测试布局3" value="-25" size="large" label="2018-11-13" />
      </Tab>
      <!-- <Tab title="使用">
        <div>
          <div style="text-align:center;padding-top:1.2rem"><span style="display:block">我的积分</span>
          <span style="display:block;margin-top:0.5rem;font-size:2rem;color:#1E90ff">482</span>
          <Button round size=small type="info" style="margin-top:0.2rem" plain>积分明细</Button></div>
          <div>
            <div style="text-align:center">
            <h5 style="font-size:1rem;text-align:left;margin-left:0.5rem">积分互通商户</h5>
            <div style="border:1px solid #ccc;height:10rem;margin-top:0.4rem;display:flex;justify-content:center;align-items:center;">
              <span>暂无记录</span>
              </div>
              <div>
               <Button size=large type="info" style="margin-top:4rem;width:70vw;border-radius:0.8rem">积分兑换</Button>
              </div>
            </div>
          </div>
        </div>
      </Tab> -->
    </Tabs>
  </div>
</template>
<script>
import { NavBar, Tabs, Tab, Cell, Button } from 'vant'
export default {
  name: 'comSource',
  data () {
    return {
    }
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    }
  },
  components: {
    NavBar,
    Tabs,
    Tab,
    Cell,
    Button
  }
}
</script>
<style lang="scss" scoped>

</style>
