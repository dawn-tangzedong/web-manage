<!-- 顶部导航 -->
<template>
  <div class="header">
    <div class="header-right">
      <span>{{user.name}} <span class="email">({{user.email}})</span></span>
      <span class="logout">退出登录</span>
    </div>
    <div class="logo"><img src="../../assets/img/element-ui.svg" alt="logo"></div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        user: {
          name: '唐泽东',
          role: '超级管理员',
          email: 'tangzedong.programmer@gmail.com'
        }
      }
    }
  }
</script>

<style scoped>
  .header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #fff;
  }

  /* 设置logo垂直居中 */
  .logo {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    width: 180px;
    height: 70px;
  }

  .header-right {
    line-height: 70px;
    margin-right: 20px;
    font-size: 16px;
    float: right;
  }

  .header-right > span {
    display: inline-block;
    margin-right: 20px;
  }

  .email {
    font-size: 12px;
  }

</style>
