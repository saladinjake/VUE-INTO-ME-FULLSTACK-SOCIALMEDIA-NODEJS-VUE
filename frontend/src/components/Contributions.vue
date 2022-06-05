<template>
  <div class="contribution-page">
    <div class="contr-images">
      <template v-if="contributions.length < 1">
        <div class="no-contribution">
          <p><i class="fas fa-info-circle"></i> There Are No Contributions To Show Now.</p>
          <button type="button" name="button"  @click="redirectToPostPage()">Make A Post</button>
        </div>
      </template>
      <template v-else>
        <div v-for="(contribution, index ) in contributions[0].posts" :key="index">
          <template v-if="contribution.banner == ''">
            <img @click="redirectToPostPage()" class="contribute-image" style="cursor: pointer;" src="../assets/a1.jpg" />
          </template>
          <template v-else>
            <img @click="redirectToPostPage()" class="contribute-image" style="cursor: pointer;" :src="contribution.banner" />
          </template>

          <div class="feed-activity">
            <div>
              <i class="fas fa-eye" style="padding: 5px; color: green; font-size: 165%;" title="Views"></i>
              <br>
              <span style="font-size: 85%;">{{ contribution.views }}</span>
            </div>
            <div class="padding-act-s"></div>
            <div class="padding-act-s"></div>
            <div class="padding-act-s"></div>
            <div>
              <i class="fas fa-thumbs-up" style="padding: 5px; color: red; font-size: 165%;" title="Likes"></i>
              <br>
              <span style="font-size: 85%;">{{ contribution.likes }}</span>
            </div>
            <div class="padding-act-s"></div>
            <div class="padding-act-s"></div>
            <div class="padding-act-s"></div>
            <div>
              <i class="fas fa-heart" style="padding: 5px; color: maroon; font-size: 165%;" title="Favourite"></i>
              <br>
              <span style="font-size: 85%;">{{ contribution.favourites }}</span>
            </div>
            <div class="padding-act-s"></div>
            <div class="padding-act-s"></div>
            <div class="padding-act-s"></div>
            <div>
              <i class="fas fa-comment-alt" style="padding: 5px; color: blue; font-size: 165%;" title="Comments"></i>
              <br>
              <span style="font-size: 85%;">{{ contribution.comments }}</span>
            </div>
            <div class="padding-act-s"></div>
            <div class="padding-act-s"></div>
            <div class="padding-act-s"></div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import VideoToThumb from 'video-thumb-generator';
  export default {
    props: {
      contributions: {
        type: Array,
        required: false,
      }
    },
    async mounted() {

    },
    methods: {
      redirectToPostPage() {
        setTimeout(() => {
          this.$router.push({
            name: 'Feedpage'
          });
        }, 1000);
      }
    },
    data() {
      return {
        contribute_images: ['a', 'b', 'c', 'e', 'f', 'd', 'g', 'h', 'i', 'j', 'k', 'l', 'l', 'k', 'i'],
        image: ''
      }
    }
  }
</script>

<style scoped>
.contribution-page {
  margin-bottom: 5%;
}
.no-contribution {
  position: absolute;
  padding-top: 15px;
  width: 61%;
}
.no-contribution p {
  text-align: center;
  color: white;
  font-size: 125%;
}
.contribution-page .feed-activity .fas {
  font-size: 115%;
}
</style>
