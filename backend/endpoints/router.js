/****************************************************************/
/*******          @desc Middleware       ************************/
/****************************************************************/
const VerifyToken = require('../modules/core/middleware/VerifyJwtToken');

/****************************************************************/
/*******          @desc Middleware       ************************/
/****************************************************************/
const Settings = require('../modules/core/controllers/SettingsController');
const Continent = require('../modules/core/controllers/ContinentController');
const Country = require('../modules/core/controllers/CountryController');
const State = require('../modules/core/controllers/StateController');
const UserType = require('../modules/core/controllers/UserTypeController');
const Search = require('../modules/core/controllers/SearchController');

/****************************************************************/
/*******         @desc auth routes       ************************/
/****************************************************************/
const Register = require('../modules/auth/RegisterController');
const Login = require('../modules/auth/LoginController');
const ForgotPassword = require('../modules/auth/ForgotPasswordController');

/****************************************************************/
/*******          @desc User Routes      ************************/
/****************************************************************/
const Chat = require('../modules/user/ChatController');
const User = require('../modules/user/UserController');
const Post = require('../modules/user/PostController');
const Gallery = require('../modules/user/GalleryController');
const Connection = require('../modules/user/ConnectionsController');
const Notification = require('../modules/user/NotificationsController');
const Transactions = require('../modules/user/TransactionsController');
const UserAdvert = require('../modules/user/AdvertController');
const Playlist = require('../modules/user/PlaylistController');

const Group = require('../modules/user/GroupController');
/****************************************************************/
/*******          @desc User Routes      ************************/
/****************************************************************/
const Admin = require('../modules/admin/AdminLoginController');
const AdminUsersController = require('../modules/admin/UsersController');
const AdminPostsController = require('../modules/admin/PostController');
const AdminContestController = require('../modules/admin/AdminContestController');
const AdminCategoriesController = require('../modules/admin/CategoryController');
const AdminCommunicationsController = require('../modules/admin/CommunicationController');

const AdminAdvertController = require('../modules/admin/AdminAdvertController');
const AdminManagementController = require('../modules/admin/AdminController');
const AdminPaystackConfigurations = require('../modules/core/controllers/SettingsController');

const Router = function (App) {
    /****************************************************************/
  /*******        @desc Auth Routes @user         *****************/
  /****************************************************************/
  App.post('/api/create-user', Register.createUser);
  App.get('/api/resend-activation-link/:email', Register.resendToken);
  App.get('/api/activate-user-account/:email/:token', Register.activateAccount);
  App.post('/api/login-user', Login.login);

  /****************************************************************/
  /********        @desc Forgot Password          *****************/
  /****************************************************************/
  App.get('/api/forgot-password-check-email/:email', ForgotPassword.checkEmail);
  App.get('/api/forgot-password/:email/:token', ForgotPassword.validateToken);
  App.post('/api/change-password/:email', ForgotPassword.changePassword);
  App.get('/api/get-user-details/:userId', VerifyToken.verify, User.getUserDetails);
  App.post('/api/update-user-details', VerifyToken.verify, User.updateUserDetails);



  App.post('/api/settings', VerifyToken.verifyAdminToken, Settings.createSettings);
  App.get('/api/admin/fetch-paystack-config', VerifyToken.verifyAdminToken, Settings.fetchPaystackConfig);

  /****************************************************************/
  /*******  @desc Continent Routes @admin  ************************/
  /****************************************************************/
  App.get('/api/admin/continents', Continent.fetchContinents);
  App.post('/api/admin/create-continent', Continent.createContinent);
  App.post('/api/admin/create/country/api', Country.createCountryViaApiRegion);

  /****************************************************************/
  /*******  @desc Country Routes @admin & @user *******************/
  /****************************************************************/
  App.get('/api/fetch-all-country', Country.fetchAllCountry);
  App.get('/api/fetch-approved-countries', Country.fetchApprovedCountries);
  App.post('/api/admin/create-country', Country.createCountry);

  /****************************************************************/
  /*******  @desc State Routes @admin & @user  ********************/
  /****************************************************************/
  App.get('/api/find-states-by-country/:countrySlug', State.fetchStates);
  App.post('/api/admin/create-state', State.createState);

  /****************************************************************/
  /*******  @desc UserType Routes @admin & @user  *****************/
  /****************************************************************/
  App.get('/api/fetch-all-user-types', UserType.fetchAllUserType);
  App.post('/api/admin/create-user-type', UserType.createUserType);


  App.get('/api/fetch/categories/:category', AdminCategoriesController.fetchCategories);

  /****************************************************************/
  /********        @desc Connection Route         *****************/
  /****************************************************************/
  App.get('/api/make-connection/:follower', VerifyToken.verify, Connection.makeNewConnections);
  App.get('/api/fetch-connections', VerifyToken.verify, Connection.fetchConnectionsCount);
  App.get('/api/fetch-fanbase', VerifyToken.verify, Connection.fetchMyConnectionsCount);
  App.get('/api/connections-list', VerifyToken.verify, Connection.fetchConnectionList);
  App.get('/api/fetch-pending-fanbases', VerifyToken.verify, Connection.fetchMyPendingFanbases);
  App.get('/api/find-connection/:connectionId', VerifyToken.verify, Connection.fetchConnectionById);
  App.get('/api/approve-connection/:connectionId', VerifyToken.verify, Connection.approveConnection);
  App.get('/api/fetch-approved-connection-request/:userId', VerifyToken.verify, Connection.fetchMyApprovedConnectionRequest);
  App.get('/api/fetch-approved-connections/:userId', VerifyToken.verify, Connection.fetchMyApprovedFanbases);
  App.delete('/api/decline-connection/:connectionId', VerifyToken.verify, Connection.declineConnection);
  /****************************************************************/
  /********        @desc Notification Route       *****************/
  /****************************************************************/
  App.get('/api/fetch-notifications', VerifyToken.verify, Notification.getNotifications);
  App.post('/api/delete-notification-query', VerifyToken.verify, Notification.deleteNotificationQueryMethod);


  App.post('/api/initialize-transactions/:type', VerifyToken.verify, Transactions.initializeTransactions);
  App.all('/api/initialize-transactions', Transactions.verifyTransaction);
  App.get('/api/admin/advert/init', AdminAdvertController.initAdvert);
  App.post('/api/advert/create/:id/:tranxRef', VerifyToken.verify, UserAdvert.createAdvert);
  App.post('/api/advert/update/:id', VerifyToken.verify, UserAdvert.updateAdvert);
  App.get('/api/advert/user/fetch', VerifyToken.verify, UserAdvert.fetchAdverts);
  App.get('/api/charge/advert/:type/:id', VerifyToken.verify, UserAdvert.chargeAdvert);
  App.get('/api/fetch/adverts/user', VerifyToken.verify, UserAdvert.fetchUserAdvert);
  /****************************************************************/
  /********        @desc Check Token Value       ******************/
  /****************************************************************/
  App.get('/api/check-token-value', VerifyToken.verify, (req, res) => { res.status(200).json({  }) });
  App.get('/api/validate-admin-value', VerifyToken.verifyAdminToken, (req, res) => { res.status(200).json({  }) });

  App.get('/api/initialize/group', VerifyToken.verify, Group.initGroup);
  App.get('/api/initialize/group-admin', VerifyToken.verifyAdminToken, Group.initGroup);
  App.post('/api/update-group/:id', VerifyToken.verify, Group.createGroup);

  // Delete Group...
  App.delete('/api/delete-group/:id', VerifyToken.verify, Group.deleteGroup);

  App.post('/api/update-group-client/:id', VerifyToken.verify, Group.updateGroupUser);
  App.post('/api/update-group-admin/:id', VerifyToken.verifyAdminToken, Group.createGroupAdmin);
  App.get('/api/fetch-belongs-to-group', VerifyToken.verify, Group.fetchUserGroups);
  App.get('/api/fetch-created-user-group', VerifyToken.verify, Group.fetchUserCreatedGroups);
  App.get('/api/fetch-all-groups-user', VerifyToken.verify, Group.fetchGroupsNon);
  App.get('/api/fetch-all-groups-admin', VerifyToken.verifyAdminToken, Group.fetchGroupsAdmin);
  App.get('/api/fetch-group-details/:groupId', VerifyToken.verify, Group.fetchGroupDetails);
  App.get('/api/fetch-all-group-posts/:nextPage/:groupId', VerifyToken.verify, Post.fetchGroupPosts);

  App.get('/api/join-group/:groupId', VerifyToken.verify, Group.addMembers);
  App.get('/api/leave-group/:groupId', VerifyToken.verify, Group.leaveGroup);

  /**************************************************************title**/
  /********          @desc Gallery Route         ******************/
  /****************************************************************/
  App.get('/api/fetch-galleries/:userId', VerifyToken.verify, Gallery.fetchAllGalleries);
  /****************************************************************/
  /*******        @desc File Upload Routes @user  *****************/
  /****************************************************************/
  let FileUpload = require('../helpers/FileUpload');
  App.get('/api/init-post', VerifyToken.verify, Post.initPost);
  App.post('/api/image-upload/:postType/:postId', VerifyToken.verify, FileUpload.pictureUpload);
  App.post('/api/image-upload-admin-group/:postType/:postId', VerifyToken.verifyAdminToken, FileUpload.adminGroupUpload);
  App.post('/api/video-upload/:postType/:postId', VerifyToken.verify, FileUpload.videoUpload, FileUpload.videoSnapShot);
  App.post('/api/audio-upload/:postType/:postId', VerifyToken.verify, VerifyToken.verify, FileUpload.audioUpload);
  App.post('/api/banner-upload', VerifyToken.verify, FileUpload.bannerUpload);
  App.post('/api/avatar-upload', VerifyToken.verify, FileUpload.avatarUpload);

  App.post('/api/advert/banner/:id', VerifyToken.verifyAdminToken, FileUpload.adminAdvertUpload);
  App.post('/api/user/advert/banner/:id', VerifyToken.verify, FileUpload.adminAdvertUpload);
  /****************************************************************/
  /*******        @desc Post Upload Routes @user  *****************/
  /****************************************************************/
  App.post('/api/create-post/:postId', VerifyToken.verify, Post.createPost);
  App.post('/api/create-basic-post/:postId', VerifyToken.verify, Post.createPicturePost);
  App.post('/api/create-news-forum-post/:postId', VerifyToken.verify, Post.createNewsForums);
  App.get('/api/fetch-news/:nextPage', VerifyToken.verify, Post.fetchNews);
  App.get('/api/fetch-posts/:nextPage', VerifyToken.verify, Post.fetchPosts);
  App.post('/api/create-forum/:postId', VerifyToken.verify, Post.createForum);
  App.get('/api/fetch-forums/:nextPage', VerifyToken.verify, Post.fetchForum);
  App.get('/api/fetch-forums-via-category/:nextPage/:category', VerifyToken.verify, Post.fetchForumViaCategory);
  App.post('/api/create-status/:postId', VerifyToken.verify, Post.createStatus);
  App.get('/api/fetch-status/:postId', VerifyToken.verify, Post.fetchStatus);
  App.get('/api/fetch-profile/posts/:userId', VerifyToken.verify, Post.fetchUserPosts);
  App.get('/api/fetch-contributions', VerifyToken.verify,  Post.fetchPostsCount);
  App.post('/api/interact-with-post', VerifyToken.verify, Post.addPostInteraction);
  App.get('/api/fetch-fav-posts', VerifyToken.verify, Post.fetchFavouritePost);
  App.get('/api/fetch-post/:postId', VerifyToken.verify, Post.fetchPostById);
  App.delete('/api/delete-post/:postId', VerifyToken.verify,  Post.deletePost);

  App.post('/api/create/playlist', VerifyToken.verify, Playlist.createPlaylist);
  App.get('/api/add/media/playlist/:mediaId/:playlistId', VerifyToken.verify, Playlist.addMediaToPlaylist);
  App.get('/api/update/playlist/:playlistName/:playlistId', VerifyToken.verify, Playlist.updatePlaylistName);
  App.delete('/api/delete/media/playlist/:mediaId/:playlistId', VerifyToken.verify, Playlist.deleteMedia);
  App.delete('/api/delete/playlist/:playlistId', VerifyToken.verify, Playlist.deletePlaylist);
  App.get('/api/fetch/playlist', VerifyToken.verify, Playlist.fetchPlaylist);
  App.get('/api/fetch/playlist/media/:playlistId', VerifyToken.verify, Playlist.fetchPlaylistMedia);

  // Search Router...
  App.get('/api/user/search/:query', VerifyToken.verify, Search.search)

  /****************************************************************/
  /*************        @desc Chat  Routes @user  *****************/
  /****************************************************************/
  App.post('/api/chat', VerifyToken.verify, Chat.createChat);
  App.get('/api/recent-chats', VerifyToken.verify, Chat.RecentChats);
  App.get('/api/chat-list', VerifyToken.verify, Chat.chatList);
  App.get('/api/chat-history/:chatId', VerifyToken.verify, Chat.chatHistory);
  App.get('/api/update-chat/:receiverId/:chatId', VerifyToken.verify, Chat.updateChat);

  /****************************************************************/
  /*************        @desc Admin Routes @admin  ****************/
  /****************************************************************/
  App.post('/api/admin/create', Admin.create);
  App.post('/api/admin/login', Admin.login);

  // Admin && Users..............
  App.get('/api/admin/users/stats', VerifyToken.verifyAdminToken, AdminUsersController.fetchUserStats);
  App.get('/api/admin/users/recent-users', VerifyToken.verifyAdminToken, AdminUsersController.fetchLastFiveAccounts);
  App.get('/api/admin/users/filter/:type', VerifyToken.verifyAdminToken, AdminUsersController.fetchAccountsViaStatus);
  App.get('/api/admin/user/profile/:email', VerifyToken.verifyAdminToken, AdminUsersController.fetchUserProfile);
  App.post('/api/admin/user/profile/update/:userId', VerifyToken.verifyAdminToken, AdminUsersController.updateUserDetails);
  App.get('/api/admin/user/posts/:userId', VerifyToken.verifyAdminToken, AdminUsersController.fetchUserPosts);
  App.get('/api/admin/user/update/status/:status/:userId', VerifyToken.verifyAdminToken, AdminUsersController.updateUserStatus);
  App.post('/api/admin/create/user', VerifyToken.verifyAdminToken, AdminUsersController.createUser);
  App.post('/api/admin/change/password/:email', VerifyToken.verifyAdminToken, AdminUsersController.changePassword);

  // Admin && Categories.............
  App.post('/api/admin/create/categories/forums', VerifyToken.verifyAdminToken, AdminCategoriesController.createForumCategories);
  App.post('/api/admin/create/categories/media', VerifyToken.verifyAdminToken, AdminCategoriesController.createMediaCategories);
  App.post('/api/admin/create/categories/user-types', VerifyToken.verifyAdminToken, AdminCategoriesController.createUserTypeCategories);
  App.post('/api/admin/update/categories/forums', VerifyToken.verifyAdminToken, AdminCategoriesController.updateForums);
  App.post('/api/admin/update/categories/media', VerifyToken.verifyAdminToken, AdminCategoriesController.updateMediaCategories);
  App.post('/api/admin/update/categories/user-types', VerifyToken.verifyAdminToken, AdminCategoriesController.updateUserTypeCategories);
  App.get('/api/admin/fetch/categories/:category', VerifyToken.verifyAdminToken, AdminCategoriesController.fetchCategories);
  App.delete('/api/admin/delete/category/:category/:id', VerifyToken.verifyAdminToken, AdminCategoriesController.deleteCategory);

  // Admin && Communication...
  App.get('/api/admin/fetch/messages', VerifyToken.verifyAdminToken, AdminCommunicationsController.fetchMessages);
  App.post('/api/admin/reply/messages', VerifyToken.verifyAdminToken, AdminCommunicationsController.replyMessages);
  App.delete('/api/admin/delete/messages/:email', VerifyToken.verifyAdminToken, AdminCommunicationsController.deleteMessage);

  // Admin Location && Continent...
  App.post('/api/admin/update/continent', VerifyToken.verifyAdminToken, Continent.updateContinent);
  App.get('/api/admin/update/status/continent/:id/:status', VerifyToken.verifyAdminToken, Continent.updateContinentStatus);
  App.delete('/api/admin/delete/continent/:slug', VerifyToken.verifyAdminToken, Continent.deleteContinent);

  // Admin Location && Country......
  App.post('/api/admin/update/country', VerifyToken.verifyAdminToken, Country.updateCountry);
  App.get('/api/admin/update/status/country/:id/:status', VerifyToken.verifyAdminToken, Country.updateCountryStatus);
  App.delete('/api/admin/delete/country/:slug', VerifyToken.verifyAdminToken, Country.deleteCountry);

  // Admin Location && State....
  App.get('/api/fetch/states', VerifyToken.verifyAdminToken, State.allStates);
  App.post('/api/admin/update/state', VerifyToken.verifyAdminToken, State.updateState);
  App.get('/api/admin/update/status/state/:id/:status', VerifyToken.verifyAdminToken, State.updateStateStatus);
  App.delete('/api/admin/delete/state/:slug', VerifyToken.verifyAdminToken, State.deleteState);

  // Admin Management........
  App.get('/api/admin/fetch/admin', VerifyToken.verifyAdminToken, AdminManagementController.fetchAdmin);
  App.post('/api/admin/update/admin', VerifyToken.verifyAdminToken, AdminManagementController.updateAdmin);
  App.get('/api/admin/update/admin/status/:userName/:status', VerifyToken.verifyAdminToken, AdminManagementController.updateAdminStatus);
  App.delete('/api/admin/delete/admin/:userName', VerifyToken.verifyAdminToken, AdminManagementController.deleteAdmin);

  // Admin Posts Management.......
  App.get('/api/admin/fetch/posts/:nextPage', VerifyToken.verifyAdminToken, AdminPostsController.fetchPosts);
  App.get('/api/admin/fetch/contest/posts/:nextPage', VerifyToken.verifyAdminToken, AdminPostsController.fetchContestPosts);

  // Admin Contest Module.........
  App.post('/api/admin/create/contest', VerifyToken.verifyAdminToken, AdminContestController.createContest);
  App.get('/api/admin/fetch/contest', VerifyToken.verifyAdminToken, AdminContestController.fetchContests);
  App.get('/api/check/contest', AdminContestController.checkOngoingContests);
  App.get('/api/ongoing/contest', AdminContestController.getContest);
  App.get('/api/completed/contest', AdminContestController.fetchPreviousContest);
  App.get('/api/get/contest/details/:contestId', AdminContestController.fetchContestPosts);
  App.get('/api/admin/update/contest/:contestId', VerifyToken.verifyAdminToken, AdminContestController.markAsCompleted);

  // Advert Controller
  App.post('/api/admin/advert/create/:id', VerifyToken.verifyAdminToken, AdminAdvertController.createAdvert);
  App.get('/api/admin/fetch/advert/:status', VerifyToken.verifyAdminToken, AdminAdvertController.fetchAdvert);
  App.get('/api/admin/update/advert/:id/:status', VerifyToken.verifyAdminToken, AdminAdvertController.advertAction);
  App.get('/api/user/update/advert/:id/:status', VerifyToken.verify, AdminAdvertController.advertAction);
  App.delete('/api/admin/advert/delete/:id', VerifyToken.verifyAdminToken, AdminAdvertController.deleteAdvert);

  App.delete('/api/admin/delete/:id', VerifyToken.verifyAdminToken, AdminAdvertController.deletePackage);
  App.get('/api/admin/fetch/packages', AdminAdvertController.fetchPackage);
  App.post('/api/admin/advert/package', VerifyToken.verifyAdminToken, AdminAdvertController.createAdvertPackage);
  App.get('/api/admin/advert/pricing/model', VerifyToken.verifyAdminToken, AdminAdvertController.fetchAdSettings);

  App.get('/api/admin/fetch-transactions', VerifyToken.verifyAdminToken, Transactions.fetchTransactions);
}

module.exports = Router;
