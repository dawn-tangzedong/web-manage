<script>
  // 开发环境配置
  const prod = {
    host: 'http://localhost/rockcandy/',
  };
  // 测试环境配置
  const dev = {
    host: 'http://localhost/rockcandy/',
  };
  // 线上线下配置使用控制器
  const online = false;
  // 根据online选择使用配置
  let info = online ? prod : dev;
  // 暴露配置信息，供全局使用
  export default {
    info
  }
</script>
