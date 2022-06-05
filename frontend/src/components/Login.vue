<template>
  <div class="whole">
    <div class="login-page">
      <div class="login-logos">
        <div class="logo-home">
          <router-link to="/">
            <img style="height:50px" src="../assets/logo.png" />
          </router-link>
        </div>
        <div class="take-care">We take care of your interests - music and social interaction</div>
        <div class="grid-logos-1 hide-on-med-and-down">
          <div class="logos-flex">
            <img class="logo-new" src="../assets/share-music-video.png" /> Share Music & Videos
          </div>
          <div class="logos-flex">
            <img class="logo-new" src="../assets/connect.png" /> Connect
          </div>
          <div class="logos-flex">
            <img class="logo-new" src="../assets/win.png" /> Win
          </div>
          <div class="logos-flex">
            <img class="logo-new" src="../assets/community.png" /> Community
          </div>
        </div>
        <div class="grid-logos-1 hide-on-med-and-down">
          <div class="logos-flex">
            <img class="logo-new" src="../assets/share-stories.png" /> Share Stories
          </div>
          <div class="logos-flex">
            <img class="logo-new" src="../assets/world-activities.png" /> World Activities
          </div>
          <div class="logos-flex">
            <img class="logo-new" src="../assets/entertainment-news.png" /> Entertainment News
          </div>
          <div class="logos-flex">
            <img class="logo-new" src="../assets/file-sharing.png" /> File Sharing
          </div>
        </div>
        <div class="apps-download hide-on-med-and-down">Apps Download Now</div>
        <div class="app-for-download hide-on-med-and-down">
          <img src="../assets/naija-p-on-app-store.png" />
          <img src="../assets/naija-p-on-google-play-store.png" />
        </div>
      </div>
      <div class="login-fields">
        <div
          class="member-text"
          v-if="forgot_password == false && password_form === false"
        >Member Login</div>
        <div class="member-text" v-if="forgot_password">Forgot Password</div>
        <div class="member-text" v-if="password_form">Change Password</div>
        <!--  -->
        <div class="form-input-1" :style="[forgot_password ? { 'height': '118px'  } : '' ]">
          <div class="input-1" v-if="forgot_password == false && password_form == false">
            <input
              v-model="login_key"
              class="inputte browser-default"
              type="text"
              placeholder="Phone or email"
              :style="[login_error.email ? { 'border': '1px solid red' } : '']"
            />
          </div>
          <div class="input-1" v-if="forgot_password == false && password_form == false">
            <input
              v-model="password_login"
              class="inputte browser-default"
              type="password"
              placeholder="Password"
              :style="[login_error.password ? { 'border': '1px solid red' } : '']"
            />
          </div>
          <div class="input-1" v-if="password_form == true">
            <input
              v-model="password_data.old_password"
              class="inputte browser-default"
              type="password"
              placeholder="Password"
            />
          </div>
          <div class="input-1" v-if="password_form == true">
            <input
              v-model="password_data.new_password"
              class="inputte browser-default"
              type="password"
              placeholder="Confirm Password"
            />
          </div>
          <div class="input-1" v-if="forgot_password == true && password_form == false">
            <input
              type="text"
              v-model="forgot_password_email"
              class="inputte browser-default"
              placeholder="Email"
              :style="[ forgot_password_error ? { 'border': '1px solid red' } : '' ]"
            />
            <div v-if="forgot_password_error" class="text-danger">Sorry, This Email Could Not Be Verified!</div>
          </div>
          <div class="login-forgot">
            <div
              @click="login()"
              class="login"
              v-if="forgot_password == false && password_form == false"
            >Login</div>
            <div
              class="login"
              v-if="forgot_password == true && password_form == false"
              @click="checkEmail()"
            >Confirm</div>
            <div class="login" @click="changePassword()" v-if="password_form == true">Confirm</div>
            <div
              class="forgot-password"
              @click="forgotPassword(true)"
              v-show="forgot_password === false && password_form == false"
            >Forgot Password</div>
            <div
              class="forgot-password"
              @click="forgotPassword(false)"
              v-show="forgot_password === true"
            >Login Instead</div>
          </div>
        </div>
        <div class="spacing"></div>
        <div class="form-input-2">
          <div class="create-account-text">Create a new account</div>
          <div class="text-field-grid">
            <div class="textfield-1">
              <input
                v-model="first_name"
                class="input-small browser-default"
                type="text"
                placeholder="First Name"
                :style="[registration_error.firstName ? { 'border': '1px solid red' } : '']"
              />
            </div>
            <div class="textfield-2">
              <input
                v-model="last_name"
                class="input-small browser-default"
                type="text"
                placeholder="Surname"
                :style="[registration_error.lastName ? { 'border': '1px solid red' } : '']"
              />
            </div>
            <div class="textfield-3">
              <input
                v-model="register_key"
                class="input-small browser-default"
                type="text"
                placeholder="Phone or email"
                :style="[registration_error.email ? { 'border': '1px solid red' } : '']"
              />
            </div>
            <div class="textfield-4">
              <input
                v-model="stage_name"
                class="input-small browser-default"
                type="text"
                placeholder="Stage name"
                :style="[registration_error.stageName ? { 'border': '1px solid red' } : '']"
              />
            </div>
            <div class="textfield-5">
              <input
                v-model="password_register"
                class="inputte browser-default"
                type="password"
                placeholder="Password"
                :style="[registration_error.password ? { 'border': '1px solid red' } : '']"
              />
            </div>
          </div>
          <div class="birthday-text">Birthday :</div>

          <div class="textfields-birthday">
            <input
              v-model="day"
              min="01"
              max="31"
              type="number"
              class="input-mid browser-default"
              placeholder="Day"
              :style="[registration_error.birthDay ? { 'border': '1px solid red' } : '']"
            />
            <select class="select-role browser-default" v-model="month" :style="[registration_error.birthMonth ? { 'border': '1px solid red' } : '']">
              <option selected value>Please Select A Month</option>
              <template v-if="user_type.length > 0">
                <option
                  v-for="(bMonth, index) in ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']"
                  :key="index"
                  :value="index + 1"
                >{{ bMonth }}</option>
              </template>
            </select>
            <input
              v-model="year"
              min="1900"
              :max="`${new Date().getFullYear()}`"
              step="1"
              type="number"
              class="input-mid browser-default"
              placeholder="Year"
              :style="[registration_error.birthYear ? { 'border': '1px solid red' } : '']"
            />
          </div>
          <div class="gender-flex">
            <div class="gender-text">Gender :</div>
            <div @click="changeGender('male')">
              <input
                type="radio"
                @click="changeGender('male')"
                id="male"
                class="browser-default"
                value="male"
                v-model="picked"
              />
            </div>
            <label for="male" @click="changeGender('male')">male</label>
            <div @click="changeGender('female')">
              <input
                class="browser-default"
                type="radio"
                @click="changeGender('female')"
                id="female"
                value="female"
                v-model="picked"
              />
            </div>
            <div>
              <label for="female" @click="changeGender('female')">female</label>
            </div>
          </div>
          <div class="interested-in">
            <div class="interested-in-text">Interested In:</div>
            <select class="select-role browser-default" v-model="selected_usertype" :style="[registration_error.userType ? { 'border': '1px solid red' } : '']">
              <option selected value>Please select one</option>
              <template v-if="user_type.length > 0">
                <option
                  v-for="(userType, index) in user_type"
                  :key="index"
                  :value="userType.name"
                >{{ userType.name }}</option>
              </template>
            </select>
          </div>
          <div class="country-and-province">
            <select
              class="select-role browser-default"
              @change="getstate()"
              v-model="selected_country"
              :style="[registration_error.country ? { 'border': '1px solid red' } : '']"
            >
              <option value disabled selected>Select a country</option>
              <template v-if="countries.length > 0">
                <option
                  v-for="country in countries"
                  :value="country.slug"
                  v-bind:key="country.name"
                >{{country.name}}</option>
              </template>
            </select>
            <select class="select-role browser-default" v-model="selected_province" :style="[registration_error.state ? { 'border': '1px solid red' } : '']">
              <option value selected>Select a state</option>
              <template v-if="provinces.length > 0">
                <option
                  v-for="(state, index) in provinces"
                  :key="index"
                  :value="state.name"
                >{{ state.name }}</option>
              </template>
            </select>
          </div>
          <div class="spacing"></div>
          <div
            class="policy"
          >By Clicking Register, you agree to our Terms & conditions, Privacy Policy and Cookie Policy.</div>
          <div class="spacing"></div>
          <div @click="registerUser()" class="register-button">
            <div class="reg">Register</div>
          </div>
        </div>
      </div>
      <div class="apps-download hide-on-large-only">Apps Download Now</div>
      <div class="app-for-download hide-on-large-only">
        <img src="../assets/naija-p-on-app-store.png" />
        <img src="../assets/naija-p-on-google-play-store.png" />
      </div>
    </div>
    <div class="login-footer">
      <div class="naija-text">Naija-P @ 2020</div>
      <div
        class="copywright"
      >About us | Contact Us | Help | Advertise | Terms and Conditions | Privacy Policy | Cookies</div>
    </div>
  </div>
  <!-- </div> -->
</template>
<script>
/*eslint-disable*/
// import swal from 'sweetalert'
import toastr from "toastr";
import { SocketConnection } from '@/mixins/GlobalMixins';
import io from 'socket.io-client'

const axios = require("axios");
var moment = require("moment");

var socket = io.connect(SocketConnection());
export default {
  async mounted() {
    await this.fetchUserType();
    await this.fetchCountries();
  },
  methods: {
    changeGender(gender) {
      this.picked = gender;
    },
    async getstate() {
      await axios
        .get(this.$baseUrl + "/find-states-by-country/" + this.selected_country)
        .then(response => {
          if (response.status === 200) {
            const States = response.data.data[0];
            this.provinces = States;
          }

          if (response.status !== 200) {
            this.provinces = [];
          }
        })
        .catch(e => {
          this.provinces = [];
        });
    },
    off() {
      document.getElementById("overlay").style.display = "none";
    },
    forgotPassword(def = true) {
      this.forgot_password = def;
    },
    async checkEmail() {
      if (this.forgot_password_email == "") {
        this.forgot_password_error = true;
      }

      await axios
        .get(
          this.$baseUrl +
            "/forgot-password-check-email/" +
            this.forgot_password_email,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Cache-Control": "no-cache"
            }
          }
        )
        .then(response => {
          if (response.status === 200) {
            this.$toast.success(
              "A password reset link has been sent to your Email Address",
              "Success",
              this.notificationSystem.options.success
            );
            return;
          }

          // this.$toast.error(
          //   "A password reset link could not be sent to your Email Address",
          //   "Error",
          //   this.notificationSystem.options.error
          // );
          this.forgot_password_error = true;
        })
        .catch(e => {
          this.forgot_password_error = true;
          // this.$toast.error(
          //   "An unexpected Error occurred and your request could not be completed.",
          //   "Error",
          //   this.notificationSystem.options.error
          // );
        });
    },
    async changePassword() {
      if (this.password_data.old_password !== this.password_data.new_password) {
        this.$toast.info(
          "Password mismatch. Please try again.",
          "Notice!",
          this.notificationSystem.options.info
        );
        return;
      }

      await axios
        .post(
          this.$baseUrl + "/change-password/" + this.forgot_password_email,
          JSON.stringify({ password: this.password_data.new_password }),
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Cache-Control": "no-cache"
            }
          }
        )
        .then(response => {
          // show the form for the user to get logged in...
          this.password_form = false;
          this.forgot_password = false;
          this.$toast.success(
            "Your password has been changed successfully. Please, login to continue.",
            "Success!",
            this.notificationSystem.options.success
          );

          // redirect and ask the user to login...
          setTimeout(() => {
            this.$router.push("/");
          }, 3000);
        })
        .catch(e => {
          console.log(e);
        });
    },
    async login() {
      if (
        this.login_key === undefined ||
        this.login_key === "" ||
        this.login_key === null
      ) {
        this.login_error.email = true;
        return;
      }

      if (
        this.password_login === undefined ||
        this.password_login === "" ||
        this.password_login === null
      ) {
        this.login_error.password = true;
        return;
      }

      await axios
        .post(
          this.$baseUrl + "/login-user",
          {
            email: this.login_key,
            password: this.password_login,
            userAgent: "web"
          },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Cache-Control": "no-cache"
            }
          }
        )
        .then(response => {
          if (response.status !== 200) {
            this.login_error.password = true;
            this.login_error.email = true;
            return;
          }

          const Data = response.data.data[0];
          const Auth = {
            isLoggedIn: true,
            token: Data.token.web.token.pop().jwt,
            role: Data.userType
          };

          const User = {
            firstName: Data.firstName,
            lastName: Data.lastName,
            email: Data.email,
            phone: Data.phone,
            avatar: Data.avatar || '',
            cover: Data.cover || '',
            stageName: Data.stageName,
            gender: Data.gender,
            birthDay: Data.birthDay,
            state: Data.state,
            country: Data.country,
            professions: Data.userType || Data.profession,
            skills: Data.skills,
            address: Data.address,
            website: Data.website,
            maritalStatus: Data.maritalStatus,
            education: Data.education,
            contributions: 0,
            connections: 0,
            fanbase: 0,
            groups: 0,
            facebook: Data.facebook,
            twitter: Data.twitter,
            instagram: Data.instagram,
            youtube: Data.youtube
          };

          this.$store.dispatch("synchronizeLocalStore", {
            auth: Auth,
            user: User
          });

          socket.emit('newLogin', User.stageName);

          setTimeout(() => {
            this.$router.push("/home");
          }, 1000);
        })
        .catch(e => {
          try {
            const status = e.response.status;
            if (status === 400) {
              const Data = e.response.data.message;
              Data.forEach(err => {
                for (const key in err) {
                  this.$toast.error(
                    err[key],
                    `${key} Error: `,
                    this.notificationSystem.options.error
                  );
                }
              });
              return;
            }

            if (status === 500) {
              const Data = e.response.data.message[0].server;
              this.$toast.error(
                Data.errorMessage,
                "Server Error",
                this.notificationSystem.options.error
              );
              return;
            }

            if (status === 404) {
              this.$toast.error(
                "Couldnt't find this endpoint on the server",
                "404 Error",
                this.notificationSystem.options.error
              );
              return;
            }
          } catch (err) {}
        });
    },
    validateUser() {
      if (
        this.first_name === undefined &&
        this.first_name === null &&
        this.first_name == ""
      ) {
        this.registration_error.firstName = true;
        return false;
      } else {
        this.registration_error.firstName = false;
      }

      if (!this.first_name.match(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)) {
        this.registration_error.firstName = true;
        return false;
      } else {
        this.registration_error.firstName = false;
      }

      if (
        this.last_name === undefined ||
        this.last_name === null ||
        this.last_name === ""
      ) {
        this.registration_error.lastName = true;
        return false;
      } else {
        this.registration_error.lastName = false;
      }

      if (!this.last_name.match(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)) {
        this.registration_error.lastName = true;
        return false;
      } else {
        this.registration_error.lastName = false;
      }

      if (
        this.register_key === null ||
        this.register_key === undefined ||
        this.register_key === ""
      ) {
        this.registration_error.email = true;
        return false;
      } else {
        this.registration_error.email = false;
      }

      if (
        this.stage_name === null ||
        this.stage_name === undefined ||
        this.stage_name === ""
      ) {
        this.registration_error.stageName = true;
        return false;
      } else {
        this.registration_error.stageName = false;
      }

      const Day = parseInt(this.day);
      if (Day > 31 || Day < 1) {
        this.registration_error.birthDay = true;
        return false;
      } else {
        this.registration_error.birthDay = false;
      }

      const Year = parseInt(this.year);
      const CurrentYear = new Date().getFullYear();

      if (Year >= CurrentYear || Year < 1) {
        this.registration_error.birthYear = true;
        return false;
      } else {
        this.registration_error.birthYear = false;
      }

      if (this.password_register.length < 7) {
        this.registration_error.password = true;
        return false;
      } else {
        this.registration_error.password = false;
      }

      if (!this.selected_usertype || this.selected_usertype == undefined) {
        this.registration_error.userType = true;
        return false;
      } else {
        this.registration_error.userType = false;
      }

      if (!this.selected_country || this.selected_country == undefined) {
        this.registration_error.country = true;
        return false;
      } else {
        this.registration_error.country = false;
      }

      if (!this.selected_province || this.selected_province == undefined) {
        this.registration_error.state = true;
        return false;
      } else {
        this.registration_error.state = false;
      }

      return true;
    },
    async registerUser() {
      // Validations..........
      const Validation = this.validateUser();
      if (!Validation) {
        return;
      }

      const Month = parseInt(this.month) - 1;
      const Months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];
      const BirthDay = `${Months[Month]} ${parseInt(this.day)} ${parseInt(
        this.year
      )}`;

      const CountrySlug = this.selected_country;
      let countries = this.countries;
      countries = countries.filter(el => {
        if (el.slug == CountrySlug) return true;
      });
      let country = countries[0].name;

      this.$toast.info(
        "Creating your account, Please Wait and don\t send another request.",
        "Info!",
        this.notificationSystem.options.info
      );
      await axios
        .post(
          this.$baseUrl + "/create-user",
          {
            firstName: this.first_name,
            lastName: this.last_name,
            email: this.register_key,
            phone: "",
            stageName: this.stage_name,
            password: this.password_register,
            birthDay: BirthDay,
            gender: this.picked,
            userType: this.selected_usertype,
            country: country,
            state: this.selected_province,
            userAgent: "web"
          },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Cache-Control": "no-cache"
            }
          }
        )
        .then(response => {
          if (response.status === 201) {
            this.$toast.success(
              "Your Account has been created successfully. Please, login to continue.",
              "Success",
              this.notificationSystem.options.success
            );
            return;
          }
        })
        .catch(e => {
          const status = e.response.status;
          if (status === 400) {
            const Data = e.response.data.message;
            Data.forEach(err => {
              for (const key in err) {
                this.$toast.error(
                  err[key],
                  `${key} Error: `,
                  this.notificationSystem.options.error
                );
              }
            });
            return;
          }

          if (status === 500) {
            const Data = e.response.data.message[0].server;
            this.$toast.error(
              Data.errorMessage,
              "Server Error",
              this.notificationSystem.options.error
            );
            return;
          }
        });
    },
    async fetchUserType() {
      await axios
        .get(this.$baseUrl + "/fetch-all-user-types", {
          data: {},
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
          }
        })
        .then(response => {
          if (response.status === 200) {
            const userType = response.data.data[0];
            this.user_type = userType;
          }

          if (response.status !== 200) {
            this.user_type = [];
          }
        })
        .catch(e => {
          this.user_type = [];
        });
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
            this.countries = Countries;
          }

          if (response.status !== 200) {
            this.countries = [];
          }
        })
        .catch(e => {
          this.countries = [];
        });
    }
  },
  data() {
    return {
      selected: "A",
      countries: [],
      provinces: [],
      selected_usertype: "",
      user_type: [],
      picked: "male",
      selected_role: "",
      selected_country: "",
      selected_province: "",
      password_login: "",
      password_register: "",
      login_key: "",
      register_key: "",
      day: "",
      month: "",
      year: "",
      stage_name: "",
      last_name: "",
      first_name: "",
      password_form: false,
      password_data: {
        old_password: "",
        new_password: ""
      },
      forgot_password: false,
      forgot_password_email: "",
      forgot_password_error: false,
      forgot_password_email: "",
      login_error: {
        email: false,
        password: false
      },
      registration_error: {
        firstName: false,
        lastName: false,
        email: false,
        stageName: false,
        paswsord: false,
        birthDay: false,
        birthMonth: false,
        birthYear: false,
        userType: false,
        country: false,
        state: false
      },
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
  async created() {
    await this.$store.dispatch("localStorePreCheck");
    if (
      this.fetchAuthState.isLoggedIn === true &&
      this.fetchAuthState.role !== "admin"
    ) {
      setTimeout(() => {
        this.$router.push("/home");
      });
      return;
    }
  },
  computed: {
    fetchAuthState() {
      return this.$store.getters.fetchAuthStore;
    },
    fetchUserStore() {
      return this.$store.getters.fetchUserStore;
    }
  },
  async mounted() {
    if (this.$route.query) {
      if (
        this.$route.query.token !== "" &&
        this.$route.query.token !== undefined &&
        this.$route.query.token !== null &&
        this.$route.query.token !== "undefined" &&
        this.$route.query.token !== "null"
      ) {
        this.$toast.success(
          "Your Account has been activated successfully. Login to continue.",
          "Success",
          this.notificationSystem.options.success
        );
      }

      if (this.$route.query.action == "password-reset") {
        if (
          this.$route.query.email !== undefined &&
          this.$route.query.email !== null &&
          this.$route.query.email !== ""
        ) {
          this.password_form = true;
          this.forgot_password_email = this.$route.query.email;
        }
      }
    }

    await this.fetchUserType();
    await this.fetchCountries();
  }
};
</script>
<style scoped>

</style>
