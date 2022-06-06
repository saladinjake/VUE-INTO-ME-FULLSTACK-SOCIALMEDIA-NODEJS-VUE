<template>
  <div>
    <SideBar></SideBar>
    <section class="content">
      <AdminHeader></AdminHeader>
      <div class="wraper container-fluid">
        <div class="container-fluid page-current-title">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
              <div class="page-title">
                <h5 class="title"><b>Advert Management</b></h5>
              </div>
            </div>
          </div>
        </div>
        <div class="row forum-tables">
          <div class="col-md-12 col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
            <div class="panel panel-default">
              <div class="panel-body">
                <div class="row">
                  <div class="col-xs-12 col-sm-12">
                    <a class="btn btn-sm btn-success z-depth-0 left-align pull-left" data-toggle="modal" data-target="#createModal"><i class="fas fa-plus"></i> Create Advert</a>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                    <ul class="nav nav-tabs">
                      <li data-toggle="tab">
                        <a href="#active-adverts" data-toggle="tab">Active Adverts</a>
                      </li>
                      <li data-toggle="tab">
                        <a href="#pending-adverts" data-toggle="tab">Pending Adverts</a>
                      </li>
                    </ul>
                  </div>
                  <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="tab-content">
                      <div class="tab-pane active" id="active-adverts">
                        <div class="table-responsive">
                          <table class="table table-striped">
                            <thead>
                              <tr>
                                <td>#</td>
                                <td>Title</td>
                                <td>Business Name</td>
                                <td>Website Url</td>
                                <td>Reference</td>
                                <td>Age</td>
                                <td>Country</td>
                                <td>State</td>
                                <td>Amount</td>
                                <td>Action</td>
                              </tr>
                            </thead>
                            <tbody v-if="activeAdverts.length > 0">
                              <tr v-for="(activeAd, index) in activeAdverts" :key="activeAd._id">
                                <td>
                                  <b>{{ index + 1 }}</b>
                                </td>
                                <td>
                                  <b>{{ activeAd.title }}</b>
                                </td>
                                <td><b>{{ activeAd.businessName }}</b></td>
                                <td><b>{{ activeAd.websiteUrl }}</b></td>
                                <td><b>{{ activeAd.tranxRef }}</b></td>
                                <td><b>{{ activeAd.age }}</b></td>
                                <td>
                                  <b>{{ activeAd.country }}</b>
                                </td>
                                <td>
                                  <b>{{ activeAd.state }}</b>
                                </td>
                                <td>
                                  <b>NGN {{ new Intl.NumberFormat().format(activeAd.amount) }}</b>
                                </td>
                                <td>
                                  <div class="btn-group">
                                    <button type="button" class="btn z-depth-0 btn-small btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Action <span class="caret"></span></button>
                                    <ul class="dropdown-menu" role="menu">
                                      <li><a data-toggle="modal" href="#editModal" @click="getAdvert(activeAd)">Edit</a></li>
                                      <li><a @click.prevent="updateAdvertStatus('pending', activeAd._id)" href="javascript:void(0)">Mark As Pending</a></li>
                                      <li><a href="#deleteModal" @click.prevent="deleteAdvert(activeAd._id)">Delete</a></li>
                                    </ul>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div class="tab-pane" id="pending-adverts">
                        <div class="table-reponsive">
                          <table class="table table-striped">
                            <thead>
                              <tr>
                                <td>#</td>
                                <td>Title</td>
                                <td>Business Name</td>
                                <td>Website Url</td>
                                <td>Reference</td>
                                <td>Age</td>
                                <td>Country</td>
                                <td>State</td>
                                <td>Amount</td>
                                <td>Action</td>
                              </tr>
                            </thead>
                            <tbody v-if="pendingAdverts.length > 0">
                              <tr v-for="(pendingAd, index) in pendingAdverts" :key="pendingAd._id">
                                <td>
                                  <b>{{ index + 1 }}</b>
                                </td>
                                <td>
                                  <b>{{ pendingAd.title }}</b>
                                </td>
                                <td><b>{{ pendingAd.businessName }}</b></td>
                                <td><b>{{ pendingAd.websiteUrl }}</b></td>
                                <td><b>{{ pendingAd.tranxRef }}</b></td>
                                <td><b>{{ pendingAd.age }}</b></td>
                                <td>
                                  <b>{{ pendingAd.country }}</b>
                                </td>
                                <td>
                                  <b>{{ pendingAd.state }}</b>
                                </td>
                                <td>
                                  <b>NGN {{ new Intl.NumberFormat().format(pendingAd.amount) }}</b>
                                </td>
                                <td>
                                  <div class="btn-group">
                                    <button type="button" class="btn z-depth-0 btn-small btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Action <span class="caret"></span></button>
                                    <ul class="dropdown-menu" role="menu">
                                      <li><a data-toggle="modal" href="#editModal" @click="getAdvert(pendingAd)">Edit</a></li>
                                      <li><a @click.prevent="updateAdvertStatus('active', pendingAd._id)" href="javascript:void(0)">Mark As Active</a></li>
                                      <li><a href="#deleteModal" @click.prevent="deleteAdvert(pendingAd._id, 'pending')">Delete</a></li>
                                    </ul>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- End Row -->
      </div>
    </section>
    <AdminFooter></AdminFooter>

    <!-- Modal -->
    <div id="createModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div class="modal-header">
            <div class="container-fluid">
              <div class="row">
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <h5 class="modal-title"><i class="fas fa-plus text-success"></i> Create Advert</h5>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <form action="" @submit.prevent="createAdvert()">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-xl-6 col-lg-6">
                      <div class="form-group">
                        <v-text-field required v-model="advert.businessName" label="Business Name" solo></v-text-field>
                      </div>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-xl-6 col-lg-6">
                      <div class="form-group">
                        <v-text-field v-model="advert.title" required label="Advert Title" solo></v-text-field>
                      </div>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-xl-6 col-lg-6">
                      <div class="form-group">
                        <v-select @input="getstate" required style="padding-left: 4px; padding-top: 4px;" v-model="advert.country"
                          class="v-select browser-default"
                          placeholder="Select Country"
                          :options="countries"
                        ></v-select>
                      </div>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-xl-6 col-lg-6">
                      <div class="form-group">
                        <v-select style="padding-left: 4px; padding-top: 4px;" required v-model="advert.state"
                          class="v-select browser-default"
                          placeholder="Select State"
                          :options="provinces"
                        ></v-select>
                      </div>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-xl-6 col-lg-6">
                      <div class="form-group">
                        <v-text-field label="amount" required v-model="advert.amount" type="number" solo></v-text-field>
                      </div>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-xl-6 col-lg-6">
                      <div class="form-group">
                        <v-select style="padding-left: 4px; padding-top: 4px;" v-model="advert.age"
                          class="v-select browser-default"
                          placeholder="Age Range"
                          :options="[ '0-13', '13-20', '21-30', '31-40', '41-50', '50-100' ]"
                        ></v-select>
                      </div>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                      <div class="form-group">
                        <v-text-field label="Website Url" v-model="advert.websiteUrl" required type="text" solo></v-text-field>
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
                        <ckeditor :editor="editor" required v-model="advert.description" :config="editorConfig"></ckeditor>
                      </div>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                      <button type="submit" class="btn btn-md btn-success btn-block">Create Advert</button>
                    </div>
                  </form>
                </div>
                <div class="col-xs-12 col-sm-12 col-lg-12 col-xl-12">
                  <div class="btn-group-sm pull-right">
                    <a href="javascript:void(0)" class="modal-close z-depth-0 btn btn-danger" data-dismiss="modal">
                      <i class="fas fa-times"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div><!-- /.modal -->
    <div id="editModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-header">
            <div class="container-fluid">
              <div class="row">
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <h5 class="modal-title"><i class="fas fa-plus text-success"></i> Update Advert</h5>
                </div>
              </div>
            </div>
          </div>
      <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <form action="" @submit.prevent="updateAdvert()">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-xl-6 col-lg-6">
                      <div class="form-group">
                        <v-text-field required v-model="advert.businessName" label="Business Name" solo></v-text-field>
                      </div>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-xl-6 col-lg-6">
                      <div class="form-group">
                        <v-text-field v-model="advert.title" required label="Advert Title" solo></v-text-field>
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
                        <v-text-field label="amount" required v-model="advert.amount" type="number" solo></v-text-field>
                      </div>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-xl-6 col-lg-6">
                      <div class="form-group">
                        <v-select style="padding-left: 4px; padding-top: 4px;" v-model="advert.age"
                          class="v-select browser-default"
                          placeholder="Age Range"
                          :options="[ '0-13', '13-20', '21-30', '31-40', '41-50', '50-100' ]"
                        ></v-select>
                      </div>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                      <div class="form-group">
                        <v-text-field label="Website Url" v-model="advert.websiteUrl" required type="text" solo></v-text-field>
                      </div>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-xl-6 col-lg-6">
                      <div class="form-group">
                        <div class="file-field input-field">
                          <div class="btn">
                            <span>Upload Banner</span>
                            <input type="file" required id="banner-update" @change="uploadBanner" ref="fileInput">
                          </div>
                          <div class="file-path-wrapper">
                            <input class="file-path validate" type="text">
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-xl-6 col-lg-6">
                      <img :src="advert.image" alt="Advert Image" class="advert-image">
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                      <div class="form-group">
                        <ckeditor :editor="editor" required v-model="advert.description" :config="editorConfig"></ckeditor>
                      </div>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                      <button type="submit" class="btn btn-md btn-success btn-block">Update Advert</button>
                    </div>
                  </form>
                </div>
                <div class="col-xs-12 col-sm-12 col-lg-12 col-xl-12">
                  <div class="btn-group-sm pull-right">
                    <a href="javascript:void(0)" class="modal-close z-depth-0 btn btn-danger" data-dismiss="modal">
                      <i class="fas fa-times"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
    </div><!-- /.modal -->
  </div>
</template>

<script type="text/javascript">
/*eslint-disable*/
  import SideBar from './Aside.vue'
  import AdminHeader from './Header.vue'
  import AdminFooter from './Footer.vue'

  import axios from 'axios'
  import moment from 'moment'
  import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
  import _ from 'lodash';

  export default {
    async mounted() {
      this.$store.dispatch('callLocalAdminStore');
      if (this.fetchAdminAuth.token !== '') {
        await this.fetchActiveAdverts();
        await this.fetchPendingAdverts();

        await this.fetchCountries();
      }
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
        if (this.advert.country !== 'All Country') {
          let selectedCountry = _.escape(this.advert.country);
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
        } else if (this.advert.country == 'All Country') {
          this.provinces = ['All States'];
        }

      },
      async getAdvert(advert) {
        this.advert = { id: advert._id, title: advert.title, state: advert.state, amount: advert.amount, image: advert.banner, country: advert.country, description: advert.description};
        return;
      },
      async updateAdvert() {
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

          // Banner Upload Notification...
          notifInterval = setInterval(() => {
          this.$toast.info('Uploading Your Banner, Please wait.', 'Uploading Banner', this.notificationSystem.options.info);
          }, 5000);

          // Advert banner upload...
          let advertBanner = await axios.post(this.$baseUrl + '/advert/banner/' + this.advert.id, Data, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web'
            }
          });

          // Advert Creation....
          let advert = await axios.post(this.$baseUrl + '/admin/advert/create/' + this.advert.id, this.advert, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web'
            }
          });

          if (advert.status == 201) {
            this.$toast.success('Advert Created', 'The Selected Advert Has Been Updated Successfully.', this.notificationSystem.options.success);

            this.advert = { id: '', image: '', title: '', state: '', amount: '', country: '', description: '' }

            document.getElementById('banner-creation').value  = '';
            document.getElementById('banner-creation').value  = [];

            document.getElementById('banner-update').value  = [];
            document.getElementById('banner-update').value  = [];
            let fileValue = document.querySelectorAll('.file-path');
            fileValue = [...fileValue];
            fileValue.map((el) => {
              el.value = '';
              return el;
            });

            window.location.reload();
            clearInterval(notifInterval);
            return;
          }

        } catch (e) {
          clearInterval(notifInterval);
          this.$toast.error('Advert Error', 'Oops, An Unexpected Error Occurred While Trying To Update Your Advert.', this.notificationSystem.options.error);
          return;
        }
      },
      async deleteAdvert(id, status = 'active') {
        try {
          let advert = await axios.delete(this.$baseUrl + '/admin/advert/delete/' + id, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web'
            }
          });

          if (advert.status == 200) {
              if (status == 'active') {
                this.activeAdverts = this.activeAdverts.filter((el) => {
                  if (el._id != id) return true;
                });
              }

              if (status == 'pending') {
                this.pendingAdverts = this.pendingAdverts.filter((el) => {
                  if (el._id != id) return true;
                });
              }

            this.$toast.success('Advert Deleted', 'The Selected Advert Has Been Deleted Successfully.', this.notificationSystem.options.success);
            return;
          }

          this.$toast.error('Advert Error', 'Sorry, There Was An Unknow Error An Your Operation Could Not Be Completed.', this.notificationSystem.options.error);
          return;
        } catch (e) {
          this.$toast.error('Operation Failed', 'Sorry, An Unknown Error Occurred And Your Request Could Not Be Completed.', this.notificationSystem.options.error);
          return;
        }
      },
      async updateAdvertStatus(status, id) {
        try {
          let advert = await axios.get(this.$baseUrl + '/admin/update/advert/' + id + '/' + status, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web'
            }
          });
          if (advert.status == 200) {
            this.$toast.success('Success', 'The Selected Advert Status Has Been Updated Successfully', this.notificationSystem.options.success);

            window.location.reload();
            return;
          }

          this.$toast.error('Operation Failed', 'The Selected Advert Could Not Be Updated', this.notificationSystem.options.success);
          return;
        } catch (e) {
          this.$toast.error('Advert Error', 'Sorry, An Unknown Error Occurred And Your Advert Could Not Be Updated', this.notificationSystem.options.error);
          return;
        }
      },
      async fetchActiveAdverts() {
        try {
          let adverts = await axios.get(this.$baseUrl + '/admin/fetch/advert/active', {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web'
            }
          });

          if (adverts.status == 200) {
            this.activeAdverts = adverts.data.data[0];
            return;
          }
        } catch (e) {
          this.activeAdverts = [];
          return;
        }
      },
      async fetchPendingAdverts() {
        try {
          let adverts = await axios.get(this.$baseUrl + '/admin/fetch/advert/pending', {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web'
            }
          });

          if (adverts.status == 200) {
            this.pendingAdverts = adverts.data.data[0];
            return;
          }
        } catch (e) {
          this.pendingAdverts = [];
          return;
        }
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

          document.getElementById('banner-update').value  = [];
          document.getElementById('banner-update').value  = [];
          let fileValue = document.querySelectorAll('.file-path');
          fileValue = [...fileValue];
          fileValue.map((el) => {
            el.value = '';
            return el;
          });
          return false;
        }

        let __this = this;
        const reader = new FileReader();
        reader.onload = e => {
          var imgData = e.target.result;
          let newImg = new Image();
          newImg.onload = function() {
            console.log(this.width + 'x' + this.height);
            if (parseInt(this.width) == parseInt(__this.adSizes.mediumRectangle.width) && parseInt(this.height) == parseInt(__this.adSizes.mediumRectangle.height)) {
              // do nothing....
              return;
            } else if (parseInt(this.width) == parseInt(__this.adSizes.wideSkyScrapper.width) && parseInt(this.height) == parseInt(__this.adSizes.wideSkyScrapper.height)) {
              // do nothing...
              return;
            } else if (parseInt(this.width) == parseInt(__this.adSizes.largeRectangle.width) && parseInt(this.height) == parseInt(__this.adSizes.largeRectangle.height)) {
              // do nothing...
              return;
            } else {
              __this.$toast.error(
                "Sorry, The Image Dimensions Allowed Are 300*250, 160*600, 336*280",
                "Banner Dimension",
                __this.notificationSystem.options.error
              );

              document.getElementById('banner-creation').value  = '';
              document.getElementById('banner-creation').value  = [];

              document.getElementById('banner-update').value  = [];
              document.getElementById('banner-update').value  = [];
              let fileValue = document.querySelectorAll('.file-path');
              fileValue = [...fileValue];
              fileValue.map((el) => {
                el.value = '';
                return el;
              });
              return false;
            }
          }
          newImg.src = imgData;
        };
        reader.readAsDataURL(this.$refs.fileInput.files[0]);
      },
      async createAdvert() {
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
              'App-X-Token': this.fetchAdminAuth.token,
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
          let advertBanner = await axios.post(this.$baseUrl + '/advert/banner/' + advertInit.data.data[0]._id, Data, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web'
            }
          });

          // Advert Creation....
          let advert = await axios.post(this.$baseUrl + '/admin/advert/create/' + advertInit.data.data[0]._id, this.advert, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web'
            }
          });

          if (advert.status == 201) {
            this.$toast.success('Advert Created', 'The Advert Has Been Created Successfully.', this.notificationSystem.options.success);

            document.getElementById('banner-creation').value  = '';
            document.getElementById('banner-creation').value  = [];

            document.getElementById('banner-update').value  = [];
            document.getElementById('banner-update').value  = [];
            let fileValue = document.querySelectorAll('.file-path');
            fileValue = [...fileValue];
            fileValue.map((el) => {
              el.value = '';
              return el;
            });

            window.location.reload();
            this.advert = { title: '', state: '', amount: '', country: '', description: ''}
            clearInterval(notifInterval);
            return;
          }

        } catch (e) {
          clearInterval(notifInterval);
          this.$toast.error('Advert Error', 'Oops, An Unexpected Error Occurred While Trying To Create Your Advert.', this.notificationSystem.options.error);
          return;
        }
      }
    },
    components: {
      SideBar,
      AdminHeader,
      AdminFooter
    },
    computed: {
      fetchAdminAuth() {
        return this.$store.getters.fetchAdminAuth
      },
      fetchAdminStore() {
        return this.$store.getters.fetchAdminStore
      }
    },
    filters: {
      diffForHumans(value) {
        return moment
          .utc(value)
          .local()
          .fromNow()
      },
    },
    async created() {
      await this.$store.dispatch('validateAdminToken');
      if (
        this.fetchAdminAuth.isLoggedIn !== true ||
        this.fetchAdminAuth.role != 'admin' ||
        this.fetchAdminAuth.token == ''
      ) {
        setTimeout(() => {
          this.$router.push({
            name: 'AdminLogin'
          })
        }, 1000);
        return
      }
    },
    data() {
      return {
        countries: [],
        provinces: [],
        advert: {
          id: '',
          age: '',
          title: '',
          state: '',
          image: '',
          amount: '',
          country: '',
          websiteUrl: '',
          description: '',
          businessName: '',
        },
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
        activeAdverts: [],
        pendingAdverts: [],
        editor: ClassicEditor,
        editorData: "<p>Describe Your Advert...</p>",
        editorConfig: {},
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
    }
  }
</script>

<style scoped>
#createModal, #editModal {
  height: 120vh !important;
  max-height: 200vh !important;
  width: 55% !important;
  overflow-x: scroll !important;
  overflow-y: scroll !important;
}
#createModal h5,
#editModal h5 {
  text-align: left;
  float: left;
  font-size: 120%;
}
#createModal p,
#editModal p {
  text-align: left;
  font-size: 105%;
  text-transform: capitalize;
}
#createModal p,
#editModal p {
  text-align: center;
  font-size: 105%;
  text-transform: capitalize;
}
#createModal .text-muted,
#editModal .text-muted {
  background: grey;
  border: 1px solid grey;
  color: white;
  padding: 5px 5px;
  border-radius: 8px;
  width: 45% !important;
}
#createModal .modal-close,
#editModal .modal-close {
  color: white !important;
  height: auto !important;
}
#createModal .modal-close:hover,
#editModal .modal-close:hover {
  color: white !important;
}
#createModal a,
#editModal a {
  margin: 1px 5px;
}
#createModal .btn-group-sm a,
#editModal .btn-group-sm a {
  margin: 1px 5px;
}
.modal-header {
  height: 20vh;
}
.continent-title {
  text-transform: capitalize;
}
.file-field input.file-path {
  width: 100% !important;
  margin-top: 2% !important;
}
.modal-title {
  margin-top: 45px;
}
.advert-image {
  width: 90px;
}
@media(min-width: 320px) {
  #createModal, #editModal {
    width: 95% !important;
  }
}
</style>
