<script>
  function error(message) {
    this.$message.error(message);
  }

  function success(message) {
    this.$message({
      message: message,
      type: 'success'
    });
  }

  function warning(message) {
    this.$message({
      message: message,
      type: 'warning'
    });
  }

  function info(message) {
    this.$message(message);
  }

  export default {
    success, error, warning, info
  }
</script>
