/*
 * @Author: your name
 * @Date: 2020-05-10 00:00:24
 * @LastEditTime: 2020-05-14 21:59:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \OS_VUE\os-vue\test\unit\specs\HelloWorld.spec.js
 */
import Vue from 'vue'
import HelloWorld from '@/components/HelloWorld'
/* eslint-disable */
describe("HelloWorld.vue", () => {
  /* eslint-disable */
  it("should render correct contents", () => {
    const Constructor = Vue.extend(HelloWorld);
    const vm = new Constructor().$mount();
    /* eslint-disable */
    expect(vm.$el.querySelector(".hello h1").textContent);
  });
});
