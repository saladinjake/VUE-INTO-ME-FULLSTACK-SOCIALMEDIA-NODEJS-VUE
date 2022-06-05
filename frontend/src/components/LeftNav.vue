<template>
  <div class="side">
    <div class="side-left" id="lefty">
      <router-link :to="{ name: 'Profile' }">
        <div class="name-left">
          {{ user.lastName }} {{ user.firstName }} - {{ user.state }},
          {{ user.country }}
        </div>
      </router-link>
      <div class="profession-grid">
        <template v-if="user.avatar == ''">
          <img @click="redirectToProfile()" class="avatar" src="../assets/u1.jpg" />
        </template>
        <template v-else>
          <img @click="redirectToProfile()" class="avatar" :src="user.avatar" />
        </template>
        <div class="profession-name">Profession: {{ user.professions }}</div>
        <div class="social-media-and-chat">
          <div class="social-media">
            <div class="red-background">
              <i class="fab fa-facebook"></i>
            </div>
            <div class="red-background">
              <i class="fab fa-twitter"></i>
            </div>
            <div class="red-background">
              <i class="fab fa-instagram"></i>
            </div>
            <div class="red-background">
              <i class="fab fa-youtube"></i>
            </div>
          </div>
          <div @click="home()" class="chat-btn">Chat</div>
        </div>
      </div>
      <div class="grid-2">
        <div class="grid-1-1">
          <div class="left">Contributions</div>
          <div class="right">{{ contributions }}</div>
        </div>
        <div class="grid-1-1">
          <div class="left">My connections</div>
          <div class="right">{{ connections }}</div>
        </div>
        <div class="grid-1-1">
          <div class="left">Fanbase</div>
          <div class="right">{{ fanbase }}</div>
        </div>
        <div class="grid-1-1">
          <div class="left">Groups</div>
          <div class="right">{{ groups }}</div>
        </div>
        <div class="grid-1-1">
          <div @click="showModal('new')" class="left-btn">Make a post</div>
          <div class="left-btn" @click="logout()">Logout</div>
        </div>
      </div>
      <div class="advertising">
        <div class="advert-text"><a href="" @click.prevent="openAdvertModal()">Advertise With Naijap</a></div>
        <div class="spacing-left"></div>
        <!-- ../assets/left-ad-sample.jpg -->
        <img class="ad-left" style="margin-top: -8%;" v-if="activeAds.length > 0" :src="activeAds[0].banner" alt />
      </div>
      <div class="footer-left-all" style="margin-top: -8%;">
        <div class="footer-left">
          About us | Contact Us | Help | <a href="" @click.prevent="openAdvertModal()">Advertise</a> | Terms and Conditions |
          Privacy Policy | Cookies
        </div>
        <div class="footer-left-2">Naija-P @ 2019. All Rights Reserved</div>
      </div>
    </div>

    <modal name="advert-modal" @opened="openAdvertModal()" @closed="closeModal()" class="advert-user-modal" style="margin-top: -5%;">
      <h5 class="black-text" style="padding-left: 10px;">Create Advert</h5>
      <p class="black-text" style="padding-left: 10px;">Create a <b>Promotional Campaign</b> today and reach millions of audience.</p>
      <hr>
      <form action="" v-if="!tranxPaid" @submit.prevent="makePayment()">
        <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
          <v-text-field label="Amount" required v-model="packageSelected.price" type="number" solo></v-text-field>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
          <button type="submit" class="btn btn-md btn-success btn-block">Make Payment</button>
        </div>
      </form>
      <form action="" v-if="tranxPaid" @submit.prevent="createAd()">
        <div class="col-xs-12 col-sm-12 col-md-12 col-xl-6 col-lg-6">
          <div class="form-group">
            <v-text-field required v-model="createAdvert.businessName" label="Business Name" solo></v-text-field>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-xl-6 col-lg-6">
          <div class="form-group">
            <v-text-field required v-model="createAdvert.title" label="Advert Title" solo></v-text-field>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-xl-6 col-lg-6">
          <div class="form-group">
            <v-select @input="getstate" required style="padding-left: 4px; padding-top: 4px;" v-model="createAdvert.country"
              class="v-select browser-default"
              placeholder="Select Country"
              :options="countries"
            ></v-select>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-xl-6 col-lg-6">
          <div class="form-group">
            <v-select style="padding-left: 4px; padding-top: 4px;" required v-model="createAdvert.state"
              class="v-select browser-default"
              placeholder="Select State"
              :options="provinces"
            ></v-select>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-xl-6 col-lg-6">
          <div class="form-group">
            <v-text-field label="amount" v-model="createAdvert.amount" required type="number" solo></v-text-field>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-xl-6 col-lg-6">
          <div class="form-group">
            <v-select style="padding-left: 4px; padding-top: 4px;" required v-model="createAdvert.age"
              class="v-select browser-default"
              placeholder="Age Range"
              :options="[ '0-13', '13-20', '21-30', '31-40', '41-50', '50-100' ]"
            ></v-select>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
          <div class="form-group">
            <v-text-field label="Website Url" v-model="createAdvert.websiteUrl" required type="text" solo></v-text-field>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
          <div class="form-group">
            <div class="file-field input-field">
              <div class="btn">
                <span>Upload Banner</span>
                <input type="file" required id="banner-creation" @change="uploadBanner" ref="fileInput">
              </div>
              <div class="file-path-wrapper">
                <input class="file-path validate" type="text">
              </div>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
          <div class="form-group">
            <ckeditor :editor="editor" required v-model="createAdvert.description" :config="editorConfig"></ckeditor>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
          <div class="form-group"></div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
          <button type="submit" class="btn btn-md btn-success btn-block">Create Advert</button>
        </div>
      </form>
    </modal>
  </div>
</template>
<script>
/*eslint-disable*/
import { SocketConnection } from "@/mixins/GlobalMixins";
import io from "socket.io-client";
import axios from "axios";
import eventBus from "@/mixins/EventsMixins";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import _ from 'lodash';

var socket = io.connect(SocketConnection());

export default {
  props: {
    AuthState: {
      type: Object,
      required: true
    },
    UserState: {
      type: Object,
      required: true
    },
    modalConfigs: {
      adaptive: true,
      scrollable: true,
      height: "auto"
    }
  },
  async mounted() {
    this.$store.dispatch("callLocalStore");

    await this.fetchContributions();
    await this.fetchMyConnections();
    await this.fetchMyFanbase();
    await this.fetchCountries();
    await this.advertsPackage();
    await this.fetchActiveAdverts('first');

    // A New Advert Will Be Displayed Every 5 Minutes..
    setInterval(async () => {
      await this.fetchActiveAdverts('second');
    }, 300000);

    socket.on("connectionApproved", Data => {
      if (Data.receivers.receiverStageName == this.fetchUserState.stageName) {
        this.connections += 1;
        return;
      } else if (
        Data.receivers.initiateStageName == this.fetchUserState.stageName
      ) {
        this.fanbase += 1;
        return;
      }
    });

    eventBus.$on("post-action", postType => {
      if (postType.type == "increment") {
        this.contributions += 1;
      } else {
        this.contributions -= 1;
      }
    });

    if (this.$route.query.tranx) {
      this.$toast.info('Please Wait', 'Opening Your Advert Form. Please Wait!', this.notificationSystem.options.info);
      setTimeout(() => {
        this.tranxPaid = true;
        this.$modal.show('advert-modal');
        eventBus.$emit("open-advert-modal");
      }, 3000);
      return;
    }
  },
  async created() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    logout() {
      setTimeout(() => {
        this.$store.dispatch("resetStoreState");
        this.$router.push("/");
      }, 1000);
    },
    redirectToProfile() {
      try {
        if (this.$route.name !== 'Profile') {
          this.$router.push({
            name: 'Profile'
          });
        }
      } catch (e) {}
    },
    showModal(content) {
      if (content === "video") {
        this.showVideo = true;
        (this.showPicture = false),
          (this.showAudio = false),
          (this.showForum = false),
          (this.showStatus = false);
      } else if (content === "audio") {
        this.showAudio = true;
        (this.showPicture = false),
          (this.showVideo = false),
          (this.showForum = false),
          (this.showStatus = false);
      } else if (content === "camera") {
        this.showPicture = true;
        (this.showVideo = false),
          (this.showAudio = false),
          (this.showForum = false),
          (this.showStatus = false);
      } else if (content === "forum") {
        this.showForum = true;
        this.showPicture = false;
        this.showAudio = false;
        this.showVideo = false;
        this.showStatus = false;
      } else if (content === "status") {
        this.showStatus = true;
        this.showPicture = false;
        this.showAudio = false;
        this.showForum = false;
        this.showVideo = false;
      }
      this.displayed = content;
      this.$modal.show("hello-world");
    },
    profile() {
      console.log("logout");
      this.$router.push({ path: "/Profile" });
    },
    home() {
      this.$router.push({ path: "/home" });
    },
    async fetchCountries() {
      await axios
        .get(this.$baseUrl + "/fetch-all-country", {
          data: {},
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
          }
        })
        .then(response => {
          if (response.status === 200) {
            const Countries = response.data.data;
            this.countries = Countries.map((el) => {
              return el.name;
            });
            this.countries[this.countries.length] = 'All Countries';
          }

          if (response.status !== 200) {
            this.countries = [];
          }
        })
        .catch(e => {
          this.countries = [];
        });
    },
    async getstate() {
      if (this.createAdvert.country !== 'All Country') {
        let selectedCountry = _.escape(this.createAdvert.country);
        selectedCountry = _.trim(selectedCountry);
        selectedCountry = _.upperFirst(selectedCountry);
        selectedCountry = _.kebabCase(selectedCountry);

        await axios
          .get(this.$baseUrl + "/find-states-by-country/" + selectedCountry)
          .then(response => {
            if (response.status === 200) {
              const States = response.data.data[0];
              this.provinces = States.map((el) => {
                return el.name;
              });
              this.provinces[this.provinces.length] = 'All States';
            }

            if (response.status !== 200) {
              this.provinces = ['All States'];
            }
          })
          .catch(e => {
            this.provinces = ['All States'];
          });
      } else if (this.createAdvert.country == 'All Country') {
        this.provinces = ['All States'];
      }

    },
    async makePayment() {
      try {
        let paystackPaymentGateway = await axios.post(this.$baseUrl + '/initialize-transactions/advert', this.packageSelected, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "App-X-Token": this.fetchAuthState.token,
            "App-Client": "web"
          }
        });

        if (paystackPaymentGateway.status == 200) {
          window.location.href = paystackPaymentGateway.data.data[0].data.authorization_url;
        }
      } catch (e) {
        this.$toast.error('Advert Error', 'Sorry, An Unknown Error Occurred And Your Advert Could Not Be Created.', this.notificationSystem.options.error);
        return;
      }
    },
    async advertsPackage() {
      try {
        let packagesAd = await axios.get(this.$baseUrl + '/admin/fetch/packages', {
          headers: {
            Accept: 'application/json',
            'Cache-Control': 'no-cache'
          }
        });

        if (packagesAd.status == 200) {
          for (let i = 0; i < packagesAd.data.data[0].length; i++) {
            this.packagesName.push(packagesAd.data.data[0][i].name);
          }

          this.packages = packagesAd.data.data[0];
          return;
        }
      } catch (e) {
        this.packagesName = [];
        this.packages = [];
        return;
      }
    },
    async fetchContributions() {
      await axios
        .get(this.$baseUrl + "/fetch-contributions", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "App-X-Token": this.fetchAuthState.token,
            "App-Client": "web"
          }
        })
        .then(response => {
          if (response.status == 200) {
            if (response.data.data.contributions) {
              this.contributions = response.data.data.contributions;
            } else if (response.data.data[0]) {
              this.contributions = response.data.data[0].contributions;
            } else {
              this.contributions = 0;
            }
          } else {
            this.contributions = 0;
          }
        })
        .catch(e => {
          this.contributions = 0;
        });
    },
    async fetchMyConnections() {
      await axios
        .get(this.$baseUrl + "/fetch-connections", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "App-X-Token": this.fetchAuthState.token,
            "App-Client": "web"
          }
        })
        .then(response => {
          if (response.status == 200) {
            this.connections = response.data.data[0].connections;
          } else {
            this.connections = 0;
          }
        })
        .catch(e => {
          this.connections = 0;
        });
    },
    async fetchMyFanbase() {
      await axios
        .get(this.$baseUrl + "/fetch-fanbase", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "App-X-Token": this.fetchAuthState.token,
            "App-Client": "web"
          }
        })
        .then(response => {
          if (response.status == 200) {
            this.fanbase = response.data.data[0].fanbase;
          } else {
            this.fanbase = 0;
          }
        })
        .catch(e => {
          this.fanbase = 0;
        });
    },
    async uploadBanner(e) {
      if (
        this.$refs.fileInput.files[0].type !== "image/jpeg" &&
        this.$refs.fileInput.files[0].type !== "image/png" &&
        this.$refs.fileInput.files[0].type !== "image/jpg"
      ) {
        this.$toast.error(
          "Sorry, Only Jpeg, Jpg, and Png Images are allowed.",
          "Picture Format",
          this.notificationSystem.options.error
        );

        document.getElementById('banner-creation').value  = '';
        document.getElementById('banner-creation').value  = [];

        return;
      }

      let __this = this;
      const reader = new FileReader();
      reader.onload = e => {
        var imgData = e.target.result;
        let newImg = new Image();
        newImg.onload = function() {
          console.log(this.width + 'x' + this.height);
          if (parseInt(this.width) == parseInt(__this.adSizes.mediumRectangle.width) && parseInt(this.height) == parseInt(__this.adSizes.mediumRectangle.height)) {
            __this.$toast.success(
              "Successfull",
              "Banner Uploaded",
              __this.notificationSystem.options.success
            );
            return;
          } else if (parseInt(this.width) == parseInt(__this.adSizes.wideSkyScrapper.width) && parseInt(this.height) == parseInt(__this.adSizes.wideSkyScrapper.height)) {
            __this.$toast.success(
              "Successfull",
              "Banner Uploaded",
              __this.notificationSystem.options.success
            );
            return;
          } else if (parseInt(this.width) == parseInt(__this.adSizes.largeRectangle.width) && parseInt(this.height) == parseInt(__this.adSizes.largeRectangle.height)) {
            __this.$toast.success(
              "Successfull",
              "Banner Uploaded",
              __this.notificationSystem.options.success
            );
            return;
          } else {
            __this.$toast.error(
              "Sorry, The Image Dimensions Allowed Are 300*250, 160*600, 336*280",
              "Banner Dimension",
              __this.notificationSystem.options.error
            );

            document.getElementById('banner-creation').value  = '';
            document.getElementById('banner-creation').value  = [];
            return false;
          }
        }
        newImg.src = imgData;
      };
      reader.readAsDataURL(this.$refs.fileInput.files[0]);
    },
    async createAd() {
      let notifInterval = null;
      try {
        if (
          this.$refs.fileInput.files[0].type !== "image/jpeg" &&
          this.$refs.fileInput.files[0].type !== "image/png" &&
          this.$refs.fileInput.files[0].type !== "image/jpg"
        ) {
          this.$toast.error(
            "Sorry, Only Jpeg, Jpg, and Png Images are allowed.",
            "Picture Format",
            this.notificationSystem.options.error
          );
          return false;
        }

        // Form Data...
        const Data = new FormData();
        Data.append('image', this.$refs.fileInput.files[0]);

        // Advert Init
        let advertInit = await axios.get(this.$baseUrl + '/admin/advert/init', {
          headers: {
            Accept: 'application/json',
            'App-X-Token': this.fetchAuthState.token,
            'App-Client': 'web',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });

        // Banner Upload Notification...
        notifInterval = setInterval(() => {
        this.$toast.info('Uploading Your Banner, Please wait.', 'Uploading Banner', this.notificationSystem.options.info);
        }, 5000);

        // Advert banner upload...
        let advertBanner = await axios.post(this.$baseUrl + '/user/advert/banner/' + advertInit.data.data[0]._id, Data, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            "App-X-Token": this.fetchAuthState.token,
            'App-Client': 'web'
          }
        });

        // Advert Creation....
        let advert = await axios.post(this.$baseUrl + '/advert/create/' + advertInit.data.data[0]._id + '/' + this.$route.query.tranx, this.createAdvert, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            "App-X-Token": this.fetchAuthState.token,
            'App-Client': 'web'
          }
        });

        if (advert.status == 201) {
          this.$toast.success('Advert Created', 'The Advert Has Been Created Successfully.', this.notificationSystem.options.success);

          document.getElementById('banner-creation').value  = '';
          document.getElementById('banner-creation').value  = [];

          this.closeAdvertModal();
          clearInterval(notifInterval);

          window.location.href = 'http://127.0.0.1:8080/#/home';
          return;
        }

        this.$toast.error('Advert Error', 'Oops, An Unknown Error Occurred While Trying To Create Your Advert.', this.notificationSystem.options.error);
        return;
      } catch (e) {
        clearInterval(notifInterval);
        this.$toast.error('Advert Error', 'Oops, An Unexpected Error Occurred While Trying To Create Your Advert.', this.notificationSystem.options.error);
        return;
      }
    },
    async fetchActiveAdverts(type = 'first') {
      try {
        let activeAds = await axios.get(this.$baseUrl + '/advert/user/fetch', {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "App-X-Token": this.fetchAuthState.token,
            "App-Client": "web"
          }
        });

        if (activeAds.status == 200) {
          if (type !== 'first') {
            this.activeAds = activeAds.data.data[0].sort( () => Math.random() - 0.5) ;
            // Shuffle the ads and show the first one in the array...

            // charge the first advert...
            await this.chargeAdvert('view', this.activeAds[0]._id);
            return;
          }

          this.activeAds = activeAds.data.data[0];
          // charge the first advert...
          await this.chargeAdvert('view', this.activeAds[0]._id);
          return;
        }

        this.activeAds = [];
        return;
      } catch (e) {
        this.activeAds = [];
        return;
      }
    },
    async chargeAdvert(type, id) {
      try {
        let charge = await axios.get(this.$baseUrl + '/charge/advert/' + type + '/' + id, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "App-X-Token": this.fetchAuthState.token,
            "App-Client": "web"
          }
        });
        console.log(charge);
      } catch (e) { /** Fail silently */  }
    },
    closeModal() {
      eventBus.$emit("close-advert-modal");
    },
    openAdvertModal() {
      this.$modal.show('advert-modal');
      eventBus.$emit("open-advert-modal");
    },
    closeAdvertModal() {
      this.$modal.hide('advert-modal');
      eventBus.$emit("close-advert-modal");
    }
  },
  data() {
    return {
      user: this.UserState,
      countries: [],
      provinces: [],
      auth: this.AuthState,
      contributions: 0,
      connections: 0,
      fanbase: 0,
      groups: 0,
      activeAds: [],
      createAdvert: {
        age: '',
        title:  '',
        state: '',
        country: '',
        websiteUrl: '',
        description: '',
        businessName: '',
        amount: this.$route.query.amnt || '',
      },
      editor: ClassicEditor,
      editorConfig: {},
      adSizes: {
        mediumRectangle: {
          width: '300',
          height: '250',
        },
        wideSkyScrapper: {
          width: '160',
          height: '600'
        },
        largeRectangle: {
          width: '336',
          height: '280'
        }
      },
      packages: [],
      tranxPaid: false,
      packageSelected: {
        name: '',
        price: '',
        amount: '',
      },
      packagesName: [],
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
      },
    };
  },
  computed: {
    fetchAuthState() {
      return this.$store.getters.fetchAuthStore;
    },
    fetchUserState() {
      return this.$store.getters.fetchUserStore;
    }
  }
};
</script>
