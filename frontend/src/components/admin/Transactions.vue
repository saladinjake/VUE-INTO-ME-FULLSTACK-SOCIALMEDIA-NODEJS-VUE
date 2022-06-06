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
                <h5 class="title"><b>Manage Transactions</b></h5>
              </div>
            </div>
          </div>
        </div>
        <div class="row forum-tables">
          <div class="col-md-12 col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
            <div class="panel panel-default">
              <div class="panel-body">
                <div class="row">
                  <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="table-responsive">
                      <table class="table table-striped">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Email</th>
                            <th>Transaction Reference</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Product</th>
                          </tr>
                        </thead>
                        <tbody v-if="transactions.length > 0">
                          <tr v-for="(transaction, index) in transactions" :key="transaction._id">
                            <td>
                              <b>{{index + 1 }}</b>
                            </td>
                            <td>
                              <b>{{ transaction.email }}</b>
                            </td>
                            <td>
                              <b>{{ transaction.reference }}</b>
                            </td>
                            <td>
                              <b>NGN{{ new Intl.NumberFormat().format(transaction.amount) }}</b>
                            </td>
                            <td v-if="transaction.status == 'success'">
                              <b class="text-success">Success</b>
                            </td>
                            <td v-else>
                              <b class="text-danger">{{ transaction.status }}</b>
                            </td>
                            <td>
                              <b>{{ transaction.humanTimestamp | diffForHumans }}</b>
                            </td>
                            <td>
                              <b>Advert</b>
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
        <!-- End Row -->
      </div>
    </section>
    <AdminFooter></AdminFooter>
  </div>
</template>

<script type="text/javascript">
/*eslint-disable*/
  import SideBar from './Aside.vue'
  import AdminHeader from './Header.vue'
  import AdminFooter from './Footer.vue'

  import axios from 'axios'
  import moment from 'moment'

  export default {
    data () {
      return {
        transactions: [],
        payments: []
      }
    },
    async mounted() {
      this.$store.dispatch('callLocalAdminStore');
      if (this.fetchAdminAuth.token !== '') {
        await this.fetchTransactions();
      }
    },
    methods: {
      onChangePage(pageOfItems) {
        this.payments = pageOfItems;
      },
      async fetchTransactions() {
        try {
          let transactions = await axios.get(this.$baseUrl + '/admin/fetch-transactions', {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
            }
          });

          if (transactions.status == 200) {
            this.transactions = transactions.data.data[0];
            this.payments = transactions.data.data[0];
            return;
          }

          this.transactions = [];
          return;
        } catch (e) {
          this.transactions = []
          this.payments = []
        }
      }
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
          .fromNow();
      },
    }
  }
</script>

<style scoped>

</style>
