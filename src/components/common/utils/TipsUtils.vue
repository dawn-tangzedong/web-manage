<script>
  import Vue from 'vue';
  let vue = new Vue();
  function error(message) {
    info(message,"error")
  }

  function success(message) {
    info(message,"success")
  }

  function warning(message) {
    info(message,"warning")
  }

  function info(message, type) {
    vue.$message({
      showClose: true,
      message: message,
      type: type
    });
  }

  export default {
    success, error, warning, info
  }
</script>
