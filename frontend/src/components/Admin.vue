<template>
  <div></div>
</template>

<script type="text/javascript">
/*eslint-disable*/
  export default {
    mounted() {
      setTimeout(() => {
        this.$router.push({
          name: 'AdminLogin'
        });
      }, 1000);
    }
  }
</script>
