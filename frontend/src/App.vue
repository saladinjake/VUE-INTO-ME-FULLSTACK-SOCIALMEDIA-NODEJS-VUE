<template>
  <div id="app">
    hello ruter
  </div>
</template>

<script type="text/javascript">
/*eslint-disable*/
  export default {
    beforeMount() {
      window.addEventListener("beforeunload", () => {
        console.log('Redirecting...');
      })
    },
  }
</script>

<style>

</style>
