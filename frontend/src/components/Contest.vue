<template id="">
  <div class="feeds">
    <div class="feed-grid">
      <div v-if="currentContest.id !== ''" class="a-feed">
        <div class="feed-body">
          <div class="feed-grid-inner" style="margin-left: -11%;">
            <div class="feed-name"><i class="fas fa-trophy"></i> {{ currentContest.title }}</div>
            <div class="feed-time"><b>{{ currentContest.startDate | parseDate }} - {{ currentContest.endDate | parseDate }}</b></div>
          </div>
          <div class="feed-text">
            <b class="contest-description">{{ currentContest.description }}</b>
            <br>
            <div class="contest-details">
              <ul>
                <hr>
                <li>Total Posts: <b>{{ currentContest.posts }}</b></li>
                <li>Total Users: <b>{{ currentContest.users }}</b></li>
                <br>
                <li class="list-header"><i class="fas fa-trophy"></i> Prizes</li>
                <hr>
                <li>1st Prize: <b>{{ currentContest.prizes.firstPrize }}</b><li>
                <li>2nd Prize: <b>{{ currentContest.prizes.secondPrize }}</b></li>
                <li>3rd Prize: <b>{{ currentContest.prizes.thirdPrize }}</b></li>
              </ul>
            </div>
          </div>
          <div class="feed-activity">
            <router-link :to="{ name: 'ContestPage', params: { contestId: currentContest.id } }"
              style="padding: 5px; color: white; background: green; border: 1px solid green; border-radius: 4px;"
            >
              <i class="fas fa-check icons" title="View Contest"></i> View Contest
            </router-link>
          </div>
        </div>
        <div class="padding-b"></div>
      </div>

      <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
        <h5 class="left-align white-text"><i class="fas fa-trophy"></i> Previous Contests</h5>
        <hr>
      </div>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <template v-if="previousContest.length > 0">
        <div v-for="previous in previousContest" class="a-feed" :key="previous._id">
          <div class="feed-body">
            <div class="feed-grid-inner" style="margin-left: -11%;">
              <div class="feed-name"><i class="fas fa-trophy"></i> {{ previous.title }}</div>
              <div class="feed-time"><b>{{ previous.date.startDate | parseDate }} - {{ previous.date.endDate | parseDate }}</b></div>
            </div>
            <div class="feed-text">
              <b class="contest-description">{{ previous.description }}</b>
              <br>
              <div class="contest-details">
                <ul>
                  <hr>
                  <li>Total Posts: <b>{{ previous.totalPosts }}</b></li>
                  <li>Total Users: <b>{{ previous.totalUsers }}</b></li>
                  <br>
                  <li class="list-header"><i class="fas fa-trophy"></i> Prizes</li>
                  <hr>
                  <li v-if="previous.prizes.firstPrize !== ''">1st Prize: <b>{{ previous.prizes.firstPrize }}</b><li>
                  <li v-if="previous.prizes.secondPrize !== ''">2nd Prize: <b>{{ previous.prizes.secondPrize }}</b></li>
                  <li v-if="previous.prizes.thirdPrize !== ''">3rd Prize: <b>{{ previous.prizes.thirdPrize }}</b></li>
                  <li v-if="previous.prizes.fourthPrize !== ''">4th Prize: <b>{{ previous.prizes.fourthPrize }}</b></li>
                  <li v-if="previous.prizes.fifthPrize !== ''">5th Prize: <b>{{ previous.prizes.fifthPrize }}</b></li>
                </ul>
              </div>
            </div>
            <div class="feed-activity">
              <router-link :to="{ name: 'ContestPage', params: { contestId: previous._id } }"
                style="padding: 5px; color: white; background: green; border: 1px solid green; border-radius: 4px;"
              >
                <i class="fas fa-check icons" title="View Contest"></i> View Contest
              </router-link>
            </div>
          </div>
          <div class="padding-b"></div>
        </div>
      </template>
    </div>
  </div>
</template>

<script type="text/javascript">
/* eslint-disable */
import axios from "axios";
import moment from "moment";

export default {
  data() {
    return {
      currentContest: {
        id: '',
        title: '',
        posts: '',
        users: '',
        description: '',
        prizes: '',
        startDate: '',
        endDate: ''
      },
      previousContest: [],
      notificationSystem: {
        options: {
          show: {
            theme: "dark",
            icon: "icon-person",
            position: "topCenter",
            progressBarColor: "rgb(0, 255, 184)",
            buttons: [
              [
                "<button>Ok</button>",
                function(instance, toast) {
                  alert("Hello world!");
                },
                true
              ],
              [
                "<button>Close</button>",
                function(instance, toast) {
                  instance.hide(
                    {
                      transitionOut: "fadeOutUp",
                      onClosing: function(instance, toast, closedBy) {
                        console.info("closedBy: " + closedBy);
                      }
                    },
                    toast,
                    "buttonName"
                  );
                }
              ]
            ],
            onOpening: function(instance, toast) {
              console.info("callback abriu!");
            },
            onClosing: function(instance, toast, closedBy) {
              console.info("closedBy: " + closedBy);
            }
          },
          ballon: {
            balloon: true,
            position: "bottomCenter"
          },
          info: {
            position: "bottomLeft"
          },
          success: {
            position: "bottomRight"
          },
          warning: {
            position: "topLeft"
          },
          error: {
            position: "topRight"
          },
          question: {
            timeout: 20000,
            close: false,
            overlay: true,
            toastOnce: true,
            id: "question",
            zindex: 999,
            position: "center",
            buttons: [
              [
                "<button><b>YES</b></button>",
                function(instance, toast) {
                  instance.hide({ transitionOut: "fadeOut" }, toast, "button");
                },
                true
              ],
              [
                "<button>NO</button>",
                function(instance, toast) {
                  instance.hide({ transitionOut: "fadeOut" }, toast, "button");
                }
              ]
            ],
            onClosing: function(instance, toast, closedBy) {
              console.info("Closing | closedBy: " + closedBy);
            },
            onClosed: function(instance, toast, closedBy) {
              console.info("Closed | closedBy: " + closedBy);
            }
          }
        }
      }
    };
  },
  async mounted() {
    this.$store.dispatch("callLocalStore");
    await this.fetchCurrentContest();
    await this.fetchPreviousContest();
  },
  methods: {
    async fetchCurrentContest() {
      try {
        let currentContest = await axios.get(this.$baseUrl + '/ongoing/contest', {
          headers: {
            Accept: 'application/json',
            'Cache-Control': 'no-cache'
          }
        });

        if (currentContest.status == 200) {
          this.currentContest.id = currentContest.data.data[0].contest._id;
          this.currentContest.title = currentContest.data.data[0].contest.title;
          this.currentContest.posts = currentContest.data.data[0].totalPosts;
          this.currentContest.users = currentContest.data.data[0].totalUsers;
          this.currentContest.description = currentContest.data.data[0].contest.description;
          this.currentContest.prizes = currentContest.data.data[0].contest.prizes;
          this.currentContest.startDate = currentContest.data.data[0].contest.date.startDate;
          this.currentContest.endDate = currentContest.data.data[0].contest.date.endDate;

          return;
        }
      } catch (e) {
        this.currentContest.id = '';
        this.currentContest.title = '';
        this.currentContest.posts = '';
        this.currentContest.users = '';
        this.currentContest.description = '';
        this.currentContest.prizes = '';
        this.currentContest.startDate = '';
        this.currentContest.endDate = '';

        return;
      }
    },
    async fetchPreviousContest() {
      try {
        let previousContest = await axios.get(this.$baseUrl + '/completed/contest', {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (previousContest.status == 200) {
          this.previousContest = previousContest.data.data[0].contests;
        }
      } catch (e) {
        this.previousContest = [];
        return;
      }
    }
  },
  computed: {
    fetchAuthState() {
      return this.$store.getters.fetchAuthStore;
    },
    fetchUserState() {
      return this.$store.getters.fetchUserStore;
    }
  },
  filters: {
    diffForHumans(value) {
      return moment
        .utc(value)
        .local()
        .fromNow();
    },
    parseDate(dateString) {
      let dateFormat = new Date(dateString)
      dateFormat = dateFormat.toString();

      return dateFormat.split(' ').slice(0, 4).join(' ');
    },
  }
};
</script>

<style scoped>
#overlay-post {
  position: fixed;
  display: none;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  cursor: pointer;
}
.preloader-wrapper.big {
  width: 50px !important;
  height: 50px !important;
  position: absolute !important;
  /* top: 50% ; */
  left: 54% !important;
  top: 50% !important;
}
.image-feed {
  min-height: 333px !important;
  max-height: 589px !important;
  width: 95% !important;
}
.contest-details ul li {
  font-size: 110%;
}
.contest-description {
  font-size: 115%;
}
</style>
