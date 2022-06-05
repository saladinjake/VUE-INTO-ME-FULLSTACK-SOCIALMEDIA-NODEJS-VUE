<template>
  <div class="profile-tab-page">
    <div class="profile-tab-container">
      <div class="profile-tab-grid">
        <div class="profile-detail">First Name:</div>
        <div class="profile-detail-1" ref="firstName" :contenteditable="currentField == 'firstName'" :focus="currentField == 'firstName'">{{user.firstName}}</div>
        <div v-if="user.previewType == 'default' && currentField != 'firstName'"
             @click="editingField('firstName')"
             class="profile-detail-1 edit-icon"
             style="float: right;"><i class="fas fa-edit"></i></div>
        <span v-if="user.previewType == 'default' &&  currentField == 'firstName'"
              @click="updateField('firstName')"
              class="profile-detail-1 edit-icon"><i class="fas fa-check"></i></span>
      </div>
      <div class="element-center">
        <div class="thin-line-profile-tab" text-wrap></div>
      </div>
      <div class="profile-tab-grid">
        <div class="profile-detail">Last Name:</div>
        <div class="profile-detail-1" ref="lastName" :contenteditable="currentField == 'lastName'" :focus="currentField == 'lastName'">{{user.lastName}}</div>
        <div class="profile-detail-1 edit-icon"
             v-if="user.previewType == 'default' && currentField != 'lastName'"
             @click="editingField('lastName')"
             style="float: right;"><i class="fas fa-edit"></i></div>
        <span v-if="user.previewType == 'default' && currentField == 'lastName'"
              @click="updateField('lastName')"
              class="profile-detail-1 edit-icon"><i class="fas fa-check"></i></span>
      </div>
      <div class="element-center">
        <div class="thin-line-profile-tab" text-wrap></div>
      </div>
      <div class="profile-tab-grid">
        <div class="profile-detail">Profession:</div>
        <div class="profile-detail-1" ref="profession" :contenteditable="currentField == 'profession'" :focus="currentField == 'profession'" style="text-align: start;">{{user.professions}}</div>
        <div class="profile-detail-1 edit-icon" v-if="user.previewType == 'default' && currentField != 'profession'"
         @click="editingField('profession')" style="float: right;"><i class="fas fa-edit"></i></div>
         <span v-if="user.previewType == 'default' && currentField == 'profession'"
               @click="updateField('profession')"
               class="profile-detail-1 edit-icon"><i class="fas fa-check"></i></span>
      </div>
      <div class="element-center">
        <div class="thin-line-profile-tab" text-wrap></div>
      </div>
      <div class="profile-tab-grid">
        <div class="profile-detail">Skills/Hobbies:</div>
        <div class="profile-detail-1" ref="skills" :contenteditable="currentField == 'skills'" :focus="currentField == 'skills'">{{user.skills}}</div>
        <div class="profile-detail-1 edit-icon" v-if="user.previewType == 'default' && currentField != 'skills'"
         @click="editingField('skills')" style="float: right;"><i class="fas fa-edit"></i></div>
         <span v-if="user.previewType == 'default' && currentField == 'skills'"
               @click="updateField('skills')"
               class="profile-detail-1 edit-icon"><i class="fas fa-check"></i></span>
      </div>
      <div class="element-center">
        <div class="thin-line-profile-tab" text-wrap></div>
      </div>
      <div class="profile-tab-grid">
        <div class="profile-detail">Address:</div>
        <div class="profile-detail-1" ref="address" :contenteditable="currentField == 'address'" :focus="currentField == 'address'">{{user.address}}</div>
        <div class="profile-detail-1 edit-icon" v-if="user.previewType == 'default' && currentField != 'address'"
         @click="editingField('address')" style="float: right;"><i class="fas fa-edit"></i></div>
         <span v-if="user.previewType == 'default' && currentField == 'address'"
               @click="updateField('address')"
               class="profile-detail-1 edit-icon"><i class="fas fa-check"></i></span>
      </div>
      <div class="element-center">
        <div class="thin-line-profile-tab" text-wrap></div>
      </div>
      <div class="profile-tab-grid">
        <div class="profile-detail">Country</div>
        <div class="profile-detail-1" ref="country" v-if="currentField != 'country'">{{user.country}}</div>
        <div v-if="currentField == 'country'">
          <select v-model="user.country" class="browser-default" style="display: block;" name="" id="">
            <template v-for="(country, index) in countries">
              <option :selected="country == user.country" :key="index" :value="country">{{ country }}</option>
            </template>
          </select>
        </div>
        <div class="profile-detail-1 edit-icon" v-if="user.previewType == 'default' && currentField != 'country'"
         @click="editingField('country')" style="float: right;"><i class="fas fa-edit"></i></div>
         <span v-if="user.previewType == 'default' && currentField == 'country'"
               @click="updateField('country')"
               class="profile-detail-1 edit-icon"><i class="fas fa-check"></i></span>
      </div>
      <div class="element-center">
        <div class="thin-line-profile-tab" text-wrap></div>
      </div>
      <div class="profile-tab-grid">
        <div class="profile-detail">Phone</div>
        <div class="profile-detail-1" ref="phone" :contenteditable="currentField == 'phone'" :focus="currentField == 'phone'">{{user.phone}}</div>
        <div class="profile-detail-1 edit-icon" v-if="user.previewType == 'default' && currentField != 'phone'"
         @click="editingField('phone')" style="float: right;"><i class="fas fa-edit"></i></div>
         <span v-if="user.previewType == 'default' && currentField == 'phone'"
               @click="updateField('phone')"
               class="profile-detail-1 edit-icon"><i class="fas fa-check"></i></span>
      </div>
      <div class="element-center">
        <div class="thin-line-profile-tab" text-wrap></div>
      </div>
      <div class="profile-tab-grid">
        <div class="profile-detail">Email</div>
        <div class="profile-detail-1" ref="email" :contenteditable="currentField == 'email'" :focus="currentField == 'email'">{{user.email}}</div>
        <div class="profile-detail-1 edit-icon" v-if="user.previewType == 'default' && currentField != 'email'"
         @click="editingField('email')" style="float: right;"><i class="fas fa-edit"></i></div>
         <span v-if="user.previewType == 'default' && currentField == 'email'"
               @click="updateField('email')"
               class="profile-detail-1 edit-icon"><i class="fas fa-check"></i></span>
      </div>
      <div class="element-center">
        <div class="thin-line-profile-tab" text-wrap></div>
      </div>
      <div class="profile-tab-grid">
        <div class="profile-detail">Website</div>
        <div class="profile-detail-1" ref="website" :contenteditable="currentField == 'website'" :focus="currentField == 'website'">{{user.website}}</div>
        <div class="profile-detail-1 edit-icon" v-if="user.previewType == 'default' && currentField != 'website'"
         @click="editingField('website')" style="float: right;"><i class="fas fa-edit"></i></div>
         <span v-if="user.previewType == 'default' && currentField == 'website'"
               @click="updateField('website')"
               class="profile-detail-1 edit-icon"><i class="fas fa-check"></i></span>
      </div>
      <div class="element-center">
        <div class="thin-line-profile-tab" text-wrap></div>
      </div>
      <div class="profile-tab-grid">
        <div class="profile-detail">Social Media</div>
        <div class="profile-detail-2">
          <div class="soc-med">
            <div class="text">Facebook</div>
            <div class="item" ref="socialFacebook" :contenteditable="currentField == 'social'" :focus="currentField == 'social'">{{user.facebook}}</div>
          </div>
          <div class="soc-med">
            <div class="text">Twitter</div>
            <div class="item" ref="socialTwitter" :contenteditable="currentField == 'social'" :focus="currentField == 'social'">{{user.twitter}}</div>
          </div>
          <div class="soc-med">
            <div class="text">Instagram</div>
            <div class="item" ref="socialInstagram" :contenteditable="currentField == 'social'" :focus="currentField == 'social'">{{user.instagram}}</div>
          </div>
          <div class="soc-med">
            <div class="text">Youtube</div>
            <div class="item" ref="socialYoutube" :contenteditable="currentField == 'social'" :focus="currentField == 'social'">{{user.youtube}}</div>
          </div>
        </div>
        <div class="profile-detail-1 edit-icon" v-if="user.previewType == 'default' && currentField != 'social'"
         @click="editingField('social')" style="float: right;"><i class="fas fa-edit"></i></div>
         <span v-if="user.previewType == 'default' && currentField == 'social'"
               @click="updateField('social')"
               class="profile-detail-1 edit-icon"><i class="fas fa-check"></i></span>
      </div>
      <div class="element-center">
        <div class="thin-line-profile-tab" text-wrap></div>
      </div>
      <div class="profile-tab-grid">
        <div class="profile-detail">Birthday</div>
        <div class="profile-detail-1" ref="birthday" :contenteditable="currentField == 'birthday'" :focus="currentField == 'birthday'">{{user.birthDay}}</div>
        <div class="profile-detail-1 edit-icon" v-if="user.previewType == 'default' && currentField != 'birthday'"
         @click="editingField('birthday')" style="float: right;"><i class="fas fa-edit"></i></div>
        <span v-if="user.previewType == 'default' && currentField == 'birthday'"
              @click="updateField('birthday')"
              class="profile-detail-1 edit-icon"><i class="fas fa-check"></i></span>
      </div>
      <div class="element-center">
        <div class="thin-line-profile-tab" text-wrap></div>
      </div>
      <div class="profile-tab-grid">
        <div class="profile-detail">Gender:</div>
        <div v-if="currentField != 'gender'" class="profile-detail-1">{{user.gender}}</div>
        <div v-if="currentField == 'gender'">
          <select v-model="user.gender" class="browser-default" style="display: block;">
            <template v-for="(gender, index) in ['Male', 'Female']">
              <option :selected="gender == user.gender" :key="index" :value="gender">{{ gender }}</option>
            </template>
          </select>
        </div>
        <div class="profile-detail-1 edit-icon" v-if="user.previewType == 'default' && currentField != 'gender'"
         @click="editingField('gender')" style="float: right;"><i class="fas fa-edit"></i></div>
         <span v-if="user.previewType == 'default' && currentField == 'gender'"
               @click="updateField('gender')"
               class="profile-detail-1 edit-icon"><i class="fas fa-check"></i></span>
      </div>
      <div class="element-center">
        <div class="thin-line-profile-tab" text-wrap></div>
      </div>
      <div class="profile-tab-grid">
        <div class="profile-detail">Marital Status:</div>
        <div class="profile-detail-1" ref="maritalStatus" :contenteditable="currentField == 'maritalStatus'" :focus="currentField == 'maritalStatus'">{{user.maritalStatus}}</div>
        <div class="profile-detail-1 edit-icon" v-if="user.previewType == 'default' && currentField != 'maritalStatus'"
         @click="editingField('maritalStatus')" style="float: right;"><i class="fas fa-edit"></i></div>
         <span v-if="user.previewType == 'default' && currentField == 'maritalStatus'"
               @click="updateField('maritalStatus')"
               class="profile-detail-1 edit-icon"><i class="fas fa-check"></i></span>
      </div>
      <div class="element-center">
        <div class="thin-line-profile-tab" text-wrap></div>
      </div>
      <div class="profile-tab-grid hide-on-med-and-down">
        <div class="profile-detail">Education:</div>
        <div class="profile-detail-1" ref="education" :contenteditable="currentField == 'education'" :focus="currentField == 'education'">{{user.education}}</div>
        <div class="profile-detail-1 edit-icon" v-if="user.previewType == 'default' && currentField != 'education'"
         @click="editingField('education')" style="float: right;"><i class="fas fa-edit"></i></div>
         <span v-if="user.previewType == 'default' && currentField == 'education'"
               @click="updateField('education')"
               class="profile-detail-1 edit-icon"><i class="fas fa-check"></i></span>
      </div>
    </div>
  </div>
</template>
<script>
/*eslint-disable*/
import axios from 'axios';
  export default {
    props: {
      user: {
        type: Object,
        required: true,
        default() {
          return {}
        }
      },
      auth: {
        type: Object,
        required: true,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        countries: '',
        profession: '',
        currentField: '',
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
      }
    },
    async mounted() {
      await this.fetchCountries();
    },
    methods: {
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
              if (Countries.length > 0) {
                let countriesData = [];
                Countries.forEach((el) => {
                  countriesData.unshift(el.name);
                });

                this.countries = countriesData
                return;
              }

              this.countries = [];
            }

            if (response.status !== 200) {
              this.countries = [];
            }
          })
          .catch(e => {
            this.countries = [];
          });
      },
      editingField(field) {
        this.currentField = field
      },
      async updateField(field) {
        try {
          switch (field) {
            case 'firstName':
              const firstName = this.$refs.firstName.textContent;
              if (firstName) {
                let payload = { key: 'firstName', value: firstName };
                payload = JSON.stringify(payload);

                const Response = await axios.post(this.$baseUrl + '/update-user-details', payload, {
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                    "App-X-Token": this.auth.token,
                    "App-Client": "web"
                  }
                });

                if (Response.status == 200) {
                  this.$store.dispatch('updateUserStore', JSON.parse(payload));

                  this.currentField = ''
                  return;
                }
              }

              this.$toast.error('Please, check the First Name field and correct the error.', 'First Name Error', this.notificationSystem.options.error
              );
              this.currentField = '';
              return;

              break
            case 'lastName':
              const lastName = this.$refs.lastName.textContent;
              if (lastName) {
                let payload = { key: 'lastName', value: lastName };
                payload = JSON.stringify(payload);

                const Response = await axios.post(this.$baseUrl + '/update-user-details', payload, {
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                    "App-X-Token": this.auth.token,
                    "App-Client": "web"
                  }
                });

                if (Response.status == 200) {
                  this.$store.dispatch('updateUserStore', JSON.parse(payload));

                  this.currentField = ''
                  return;
                }
              }

              this.$toast.error('Please, check the Last Name field and correct the error.', 'Last Name Error', this.notificationSystem.options.error
              );
              this.currentField = '';
              return;

              break;
            case 'profession':
              const profession = this.$refs.profession.textContent;
              if (profession) {
                let payload = { key: 'profession', value: profession };
                payload = JSON.stringify(payload);

                const Response = await axios.post(this.$baseUrl + '/update-user-details', payload, {
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                    "App-X-Token": this.auth.token,
                    "App-Client": "web"
                  }
                });

                if (Response.status == 200) {
                  this.$store.dispatch('updateUserStore', { key: 'professions', value: profession });

                  this.currentField = ''
                  return;
                }
              }

              this.$toast.error('Please, check the Profession field and correct the error.', 'Profession Error', this.notificationSystem.options.error
              );
              this.currentField = '';
              return;
              break;
            case 'skills':
              const skills = this.$refs.skills.textContent;
              if (skills) {
                let payload = { key: 'skills', value: skills };
                payload = JSON.stringify(payload);

                const Response = await axios.post(this.$baseUrl + '/update-user-details', payload, {
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                    "App-X-Token": this.auth.token,
                    "App-Client": "web"
                  }
                });

                if (Response.status == 200) {
                  this.$store.dispatch('updateUserStore', JSON.parse(payload));

                  this.currentField = ''
                  return;
                }
              }

              this.$toast.error('Please, check the Skills field and correct the error.', 'Skills Error', this.notificationSystem.options.error
              );
              this.currentField = '';
              return;
              break;
            case 'address':
              const address = this.$refs.address.textContent;
              if (address) {
                let payload = { key: 'address', value: address };
                payload = JSON.stringify(payload);

                const Response = await axios.post(this.$baseUrl + '/update-user-details', payload, {
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                    "App-X-Token": this.auth.token,
                    "App-Client": "web"
                  }
                });

                if (Response.status == 200) {
                  this.$store.dispatch('updateUserStore', JSON.parse(payload));

                  this.currentField = ''
                  return;
                }
              }

              this.$toast.error('Please, check the Address field and correct the error.', 'Address Error', this.notificationSystem.options.error
              );
              this.currentField = '';
              return;
              break;
            case 'country':
              const country = this.user.country
              if (country) {
                let payload = { key: 'country', value: country };
                payload = JSON.stringify(payload);

                const Response = await axios.post(this.$baseUrl + '/update-user-details', payload, {
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                    "App-X-Token": this.auth.token,
                    "App-Client": "web"
                  }
                });

                if (Response.status == 200) {
                  this.$store.dispatch('updateUserStore', JSON.parse(payload));

                  this.currentField = ''
                  return;
                }
              }

              this.$toast.error('Please, check the Country field and correct the error.', 'Country Error', this.notificationSystem.options.error
              );
              this.currentField = '';
              return;
              break;
            case 'phone':
              const phone = this.$refs.phone.textContent;
              if (phone) {
                let payload = { key: 'phone', value: phone };
                payload = JSON.stringify(payload);

                const Response = await axios.post(this.$baseUrl + '/update-user-details', payload, {
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                    "App-X-Token": this.auth.token,
                    "App-Client": "web"
                  }
                });

                if (Response.status == 200) {
                  this.$store.dispatch('updateUserStore', JSON.parse(payload));

                  this.currentField = ''
                  return;
                }
              }

              this.$toast.error('Please, check the Phone field and correct the error.', 'Phone Error', this.notificationSystem.options.error
              );
              this.currentField = '';
              return;
              break;
            case 'email':
              const email = this.$refs.email.textContent;
              if (email) {
                let payload = { key: 'email', value: email };
                payload = JSON.stringify(payload);

                const Response = await axios.post(this.$baseUrl + '/update-user-details', payload, {
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                    "App-X-Token": this.auth.token,
                    "App-Client": "web"
                  }
                });

                if (Response.status == 200) {
                  this.currentField = ''
                }

                this.$toast.info('Please, check your previous email address and validate your new email address in order to begin using this Email Address.', 'Email Info', this.notificationSystem.options.info
                );
                return;
              }

              this.$toast.error('Please, check the Email field and correct the error.', 'Email Error', this.notificationSystem.options.error
              );
              this.currentField = '';
              return;
              break;
            case 'website':
              const website = this.$refs.website.textContent;
              if (website) {
                let payload = { key: 'website', value: website };
                payload = JSON.stringify(payload);

                const Response = await axios.post(this.$baseUrl + '/update-user-details', payload, {
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                    "App-X-Token": this.auth.token,
                    "App-Client": "web"
                  }
                });

                if (Response.status == 200) {
                  this.$store.dispatch('updateUserStore', JSON.parse(payload));

                  this.currentField = ''
                  return;
                }
              }

              this.$toast.error('Please, check the Website field and correct the error.', 'Website Error', this.notificationSystem.options.error
              );
              this.currentField = '';
              return;
              break;
            case 'social':
              const facebook = this.$refs.socialFacebook.textContent;
              const twitter = this.$refs.socialTwitter.textContent;

              const instagram = this.$refs.socialInstagram.textContent;
              const youtube = this.$refs.socialYoutube.textContent;

              if (facebook && twitter && instagram && youtube) {
                let payload = { key: 'social', value: { facebook, twitter, instagram, youtube } };
                payload = JSON.stringify(payload);

                const Response = await axios.post(this.$baseUrl + '/update-user-details', payload, {
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                    "App-X-Token": this.auth.token,
                    "App-Client": "web"
                  }
                });

                if (Response.status == 200) {
                  this.$store.dispatch('updateUserStore', { key: 'facebook', value: facebook });
                  this.$store.dispatch('updateUserStore', { key: 'twitter', value: twitter });
                  this.$store.dispatch('updateUserStore', { key: 'instagram', value: instagram });
                  this.$store.dispatch('updateUserStore', { key: 'youtube', value: youtube });

                  this.currentField = ''
                  return;
                }
              }

              this.$toast.error('Please, check the Social fields and correct the errors.', 'Social Error', this.notificationSystem.options.error
              );
              this.currentField = '';
              return;
              break;
            case 'birthday':
              const birthDay = this.$refs.birthday.textContent;
              if (birthDay) {
                let payload = { key: 'birthDay', value: birthDay };
                payload = JSON.stringify(payload);

                const Response = await axios.post(this.$baseUrl + '/update-user-details', payload, {
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                    "App-X-Token": this.auth.token,
                    "App-Client": "web"
                  }
                });

                if (Response.status == 200) {
                  this.$store.dispatch('updateUserStore', JSON.parse(payload));

                  this.currentField = ''
                  return;
                }
              }

              this.$toast.error('Please, check the Birth Day field and correct the error.', 'Birth Day Error', this.notificationSystem.options.error
              );
              this.currentField = '';
              return;
              break;
            case 'gender':
              const gender = this.user.gender;
              if (gender) {
                let payload = { key: 'gender', value: gender };
                payload = JSON.stringify(payload);

                const Response = await axios.post(this.$baseUrl + '/update-user-details', payload, {
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                    "App-X-Token": this.auth.token,
                    "App-Client": "web"
                  }
                });

                if (Response.status == 200) {
                  this.$store.dispatch('updateUserStore', JSON.parse(payload));

                  this.currentField = ''
                  return;
                }
              }

              this.$toast.error('Please, check the Gender field and correct the error.', 'Gender Error', this.notificationSystem.options.error
              );
              this.currentField = '';
              return;
              break;
            case 'maritalStatus':
              const maritalStatus = this.$refs.maritalStatus.textContent;
              if (maritalStatus) {
                let payload = { key: 'maritalStatus', value: maritalStatus };
                payload = JSON.stringify(payload);

                const Response = await axios.post(this.$baseUrl + '/update-user-details', payload, {
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                    "App-X-Token": this.auth.token,
                    "App-Client": "web"
                  }
                });

                if (Response.status == 200) {
                  this.$store.dispatch('updateUserStore', JSON.parse(payload));

                  this.currentField = ''
                  return;
                }
              }

              this.$toast.error('Please, check the Marital Status field and correct the error.', 'Marital Status Error', this.notificationSystem.options.error
              );
              this.currentField = '';
              return;
              break;
            case 'education':
              const education = this.$refs.education.textContent;
              if (education) {
                let payload = { key: 'education', value: education };
                payload = JSON.stringify(payload);

                const Response = await axios.post(this.$baseUrl + '/update-user-details', payload, {
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                    "App-X-Token": this.auth.token,
                    "App-Client": "web"
                  }
                });

                if (Response.status == 200) {
                  this.$store.dispatch('updateUserStore', JSON.parse(payload));

                  this.currentField = ''
                  return;
                }
              }

              this.$toast.error('Please, check the Education field and correct the error.', 'Education Error', this.notificationSystem.options.error
              );
              this.currentField = '';
              return;
              break;
            default:
              this.$toast.error('Please, check your input and try again.', 'Input Error', this.notificationSystem.options.error
              );
              this.currentField = '';
              break;
          }
          this.currentField = ''
        } catch (e) {
          console.log(e);
          const Status = e.response.status || '';
          if (Status !== 500) {
            const Message = e.response.data.message;
            Message.forEach(err => {
              for (const key in err) {
                this.$toast.error(
                  err[key],
                  `${key} Error: `,
                  this.notificationSystem.options.error
                );
              }
            });
          } else {
            this.$toast.error('Sorry, an unknown error occurred during the operation. Please, try again later.', 'Unknown Error', this.notificationSystem.options.error
            );
          }
        }
      }
    }
  }
</script>

<style scoped>
  .edit-icon {
    margin-left: 61%;
    cursor: pointer;
  }
  div[contenteditable='true'] {
    border: 1px solid white;
    background: white;
    color: black;
    padding: 2px 10px;
    border-radius: 2px;
  }
</style>
