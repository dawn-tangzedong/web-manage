<template>
  <div id="home">
    <view-header/>
    <view-sidebar/>
    <div class="content-box">
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import header from './Header.vue';
  import sidebar from './Sidebar';

  export default {
    name: "home",
    components: {
      "view-header": header,
      "view-sidebar": sidebar,
    },
  }
</script>

<style scoped>
  .content-box {
    position: absolute;
    left: 180px;
    right: 0;
    top: 70px;
    bottom: 0;
    padding-bottom: 30px;
    -webkit-transition: left .3s ease-in-out;
    transition: left .3s ease-in-out;
    background: #b4b4b4;
  }

  .content {
    width: auto;
    height: 100%;
    padding: 10px;
    overflow-y: scroll;
    box-sizing: border-box;
  }

  /* 内容不需要滚动条 */
  .content::-webkit-scrollbar {
    width: 0;
  }
</style>
