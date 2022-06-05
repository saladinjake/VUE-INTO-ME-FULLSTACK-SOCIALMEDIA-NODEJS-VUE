<template id="">
  <div>
    <router-view />
  </div>
</template>

<script type="text/javascript">
/*eslint-disable*/
  export default {
    mounted() {

    }
  }
</script>

<style scoped>
  @import "../../assets/admin/css/animate.css";
  @import "../../assets/admin/css/bootstrap.min.css";
  @import "../../assets/admin/css/helper.css";
  @import "../../assets/admin/css/style-responsive.css";
  @import "../../assets/admin/css/style.css";

  html::-webkit-scrollbar,
  body::-webkit-scrollbar {
    width: 1em !important;
  }

  html::-webkit-scrollbar-track,
  body::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3) !important;
  }

  html::-webkit-scrollbar-thumb,
  body::-webkit-scrollbar-thumb {
    background-color: purple !important;
    outline: 1px solid purple !important;
    border-radius: 8px !important;
  }
</style>
