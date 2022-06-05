<template id="">
  <div class="photos-page">
    <div class="contr-images">
      <template v-if="photos.length < 1">
          <div class="no-photos">
            <p><i class="fas fa-info-circle"></i> There Are No Pictures To Show.</p>
            <button type="button" name="button"  @click="redirectToFeedPage()">Upload A Picture</button>
          </div>
        </template>
        <template v-else>
          <div class="profile-block" v-for="(photo, index) in photos[0]" :key="index">
            <template v-if="photo.avatar == ''">
              <img class="contribute-image" src="../assets/a1.jpg" />
            </template>
            <template v-else>
              <img class="contribute-image" :src="photo.banner" />
            </template>
            <ul class="action-btn" v-if="photo.type !== 'avatar' && photo.type !== 'cover'">
              <li>
                <a href="#"><i class="fas fa-comment" style="font-size: 120% !important;"></i> <b>{{ photo.comments | formatNumber }}</b></a>
              </li>
              <li>
                <a href="#"><i class="fas fa-thumbs-up" style="font-size: 120% !important;"></i> <b>{{ photo.likes | formatNumber }}</b></a>
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
      photos: {
        type: Array,
        required: false,
      }
    },
    methods: {
      redirectToFeedPage() {
        setTimeout(() => {
          this.$router.push({
            name: 'Feedpage'
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
.photos-page {
  margin-bottom: 5%;
}
.no-photos {
  position: absolute;
  padding-top: 15px;
  width: 61%;
}
.no-photos p {
  text-align: center;
  color: white;
  font-size: 125%;
}
.no-photos button {
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
  color: #ce0019;
  font-size: 75%;
  font-weight: 700;
}

.profile-block .action-btn li:nth-child(2) a {
  color: green;
  font-size: 75%;
  font-weight: 700;
}
</style>
