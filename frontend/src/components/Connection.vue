<template>
  <div class="connection-page">
    <div class="contr-images">
      <template v-if="connections.length < 1">
          <div class="no-connection">
            <p><i class="fas fa-info-circle"></i> There Are No Connections To Show.</p>
            <button type="button" name="button"  @click="redirectToConnectionPage()">Make A Connection</button>
          </div>
        </template>
        <template v-else>
          <div class="profile-block" v-for="(connection, index) in connections" :key="index">
            <template v-if="!connection.avatar">
              <img class="contribute-image" src="../assets/a1.jpg" />
            </template>
            <template v-else>
              <img class="contribute-image" :src="connection.avatar" />
            </template>
            <span>{{ connection.stageName }}</span>
            <p><small>Fanbases: <b>{{ connection.fanbase | formatNumber }}</b></small></p>
            <ul class="action-btn">
              <li>
                <a href="">Chat</a>
              </li>
              <li>
                <a href="#">Block</a>
              </li>
            </ul>
          </div>
        </template>
    </div>
  </div>
</template>

<script type="text/javascript">

/*eslint-disable*/
  export default {
    props: {
      connections: {
        type: Array,
        required: false
      }
    },
    data() {
      return {
        contribute_images: ['a', 'b', 'c', 'e', 'f', 'd', 'g', 'h', 'i', 'j', 'k', 'l', 'l', 'k', 'i']
      }
    },
    methods: {
      redirectToConnectionPage() {
        setTimeout(() => {
          this.$router.push({
            name: 'Connections'
          });
        }, 1000);
      }
    },
    filters: {
      formatNumber(number) {
        const Format = new Intl.NumberFormat()
        return Format.format(number);
      }
    }
  }
</script>
<style scoped>
  .connection-page {
    margin-bottom: 5%;
  }
  .no-connection {
    position: absolute;
    padding-top: 15px;
    width: 61%;
  }
  .no-connection p {
    text-align: center;
    color: white;
    font-size: 125%;
  }
  .no-connection button {
    padding: 8px;
    margin-top: 10px;
    background: green;
    border: 1px solid green;
    color: white;
    border-radius: 8px;
    margin-bottom: 5%;
    cursor: pointer;
  }
  .profile-block {
    color: white;
  }
  .profile-block .action-btn {
    display: flex;
    width: 100%;
    vertical-align: middle;
    margin-left: 15%;
  }
  .profile-block .action-btn li {
    margin: 5px 15px;
  }
  .profile-block .action-btn li:nth-child(1) a {
    background: #08481a;
    color: white;
    border: 1px solid #08481a;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 8px;
    font-size: 70%;
    font-weight: 700;
    transition: all 0.5s ease;
  }
  .profile-block.action-btn li:nth-child(1) a:hover {
    background: #326e2b;
    border: 1px solid #326e2b;
  }
  .profile-block .action-btn li:nth-child(2) a {
    background: maroon;
    color: white;
    border: 1px solid maroon;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 8px;
    font-size: 70%;
    font-weight: 700;
  }
</style>
