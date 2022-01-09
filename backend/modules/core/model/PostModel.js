import {MongoClient, ObjectId} from 'mongodb';

import Model from './Model';
/****************************************************************/
/******* @author saladin jake victor juwa ********************************/
/******* @desc PostModel: Provides Methods For ******************/
/******* creates a new post resource  ***************************/
/****************************************************************/

class PostModel extends Model {
    constructor() { super() }

    /****************************************************************/
    /******* @author saladin jake victor juwa ********************************/
    /******* @desc InitPost: Creates an post object    **************/
    /****************************************************************/
    async init(userId) {
        const Payload = {
            _id: new ObjectId().toString(),
            userId: userId,
            title: '',
            content: '',
            genre: '',
            original: false,
            banner: '',
            audio: '',
            video: '',
            postType: '',
            forumCategory: '',
            views: 0,
            likes: 0,
            favourites: 0,
            shares: 0,
            comments: 0,
            contestId: '',
            groupId: ''
        }
        const dbConnection = await this.createConnection();
        return dbConnection.collection('naijap_db_posts').insertOne(Payload).then((doc) => {
            return doc.ops[0];
        });
    }

    /****************************************************************/
    /******* @author saladin jake victor juwa ********************************/
    /******* @desc CreatePost: Saves A User Post       **************/
    /****************************************************************/
    async createPost(payload) {
        const dbConnection = await super.createConnection();
        return dbConnection.collection('naijap_db_posts').insertOne(payload).then((doc) => {
          return doc;
        });
    }

    /****************************************************************/
    /******* @author saladin jake victor juwa ********************************/
    /******* @desc fetchPosts: Fetches All  Post       **************/
    /****************************************************************/
    async fetchPosts(nextValue = null) {
        // This will fetch all posts from the database...
        // IDEA: In the future, we will be sorting posts based on relationships with other users...
        const dbConnection = await super.createConnection();
        if (nextValue == null) {
            return dbConnection.collection('naijap_db_posts').find({ postType: { $nin: ['news', 'forum', 'status'] }, groupId: "" }).sort({ _id: -1 }).limit(20).toArray().then((docs) => {
              return docs;
            });
        }
        return Posts;
    }

    async fetchAllGroupsPost(nextValue = null, groupId) {
      // This will fetch all posts from the database...
      // IDEA: In the future, we will be sorting posts based on relationships with other users...
      const dbConnection = await super.createConnection();
      if (nextValue == null) {
          return dbConnection.collection('naijap_db_posts').find({ groupId: groupId }).sort({ _id: -1 }).limit(20).toArray().then((docs) => {
            return docs;
          });
      }
      return Posts;
    }

    async fetchContestPosts(nextValue = null) {
      // This will fetch all posts from the database...
      // IDEA: In the future, we will be sorting posts based on relationships with other users...
      const dbConnection = await super.createConnection();
      if (nextValue == null) {
        return dbConnection.collection('naijap_db_posts').find({ postType: { $nin: ['news', 'forum', 'status'] }, original: true }).sort({ _id: -1 }).limit(20).toArray().then((docs) => {
          return docs;
        });
      }
    }

    async fetchForums(nextValue = null) {
        // This will fetch all posts from the database...
        // IDEA: In the future, we will be sorting posts based on relationships with other users...
        const dbConnection = await super.createConnection();
        if (nextValue == null) {
            return dbConnection.collection('naijap_db_posts').find({ postType: 'forum' }).sort({ _id: -1 }).limit(20).toArray().then((docs) => {
                return docs;
            });
        }

        const Posts = dbConnection.collection('naijap_db_posts')
            .find({ _id: { $lt: nextValue }, postType: 'forum' })
            .sort({ _id: -1 })
            .limit(20);

        return Posts;
    }

    async fetchForumsViaCategory(nextValue = null, category) {
        // This will fetch all posts from the database...
        // IDEA: In the future, we will be sorting posts based on relationships with other users...
        const dbConnection = await super.createConnection();
        if (nextValue == null) {
            return dbConnection.collection('naijap_db_posts').find({ postType: 'forum', forumCategory: category }).sort({ _id: -1 }).limit(20).toArray().then((docs) => {
              return docs;
            });
        }

        const Posts = dbConnection.collection('naijap_db_posts')
            .find({ _id: { $lt: nextValue }, postType: 'forum', forumCategory: category })
            .sort({ _id: -1 })
            .limit(20);

        return Posts;
    }

    async fetchStatus(nextValue = null) {
        // This will fetch all posts from the database...
        // IDEA: In the future, we will be sorting posts based on relationships with other users...
        const dbConnection = await super.createConnection();
        if (nextValue == null) {
            return dbConnection.collection('naijap_db_posts').find({ postType: 'status' }).sort({ _id: -1 }).limit(20).toArray().then((docs) => {
              return docs;
            });
        }

        const Posts = dbConnection.collection('naijap_db_posts')
            .find({ _id: { $lt: nextValue }, postType: 'status' })
            .sort({ _id: -1 })
            .limit(20);

        return Posts;
    }

    async fetchNews(nextValue = null) {
      const dbConnection = await super.createConnection();
      if (nextValue == null) {
          return dbConnection.collection('naijap_db_posts').find({ postType: 'news' }).sort({ _id: -1 }).limit(20).toArray().then((docs) => {
            return docs;
          });
      }

      const Posts = dbConnection.collection('naijap_db_posts')
          .find({ _id: { $lt: nextValue }, postType: "news" })
          .sort({ _id: -1 })
          .limit(20);

      return Posts;
    }

    /****************************************************************/
    /******* @author saladin jake victor juwa ********************************/
    /******* @desc fetchUserPost: Fetches All  Post For A User ******/
    /****************************************************************/
    async fetchUserPosts(userId) {
      const dbConnection = await super.createConnection();
      return dbConnection.collection('naijap_db_posts').find({ userId: userId, postType: { $ne: 'news' } }).sort({ _id: -1 }).toArray().then((docs) => {
        return docs;
      });
    }

    /****************************************************************/
    /******* @author saladin jake victor juwa ********************************/
    /******* @desc findPostByID: Finds A Post By ID    **************/
    /****************************************************************/
    async findPostByID(postID) {
      const dbConnection = await super.createConnection();
      return dbConnection.collection('naijap_db_posts').findOne({ _id: new ObjectId(postID).toString() }).then((doc) => {
        return doc
      });
    }

    /****************************************************************/
    /******* @author saladin jake victor juwa ********************************/
    /******* @desc findPostByID: Finds All Post By ID    ************/
    /****************************************************************/
    async fetchPostsCount(userId) {
      const dbConnection = await super.createConnection();
      return dbConnection.collection('naijap_db_posts').countDocuments({ userId: new ObjectId(userId).toString() }).then((total) => {
        return total
      });
    }

    /****************************************************************/
    /******* @author saladin jake victor juwa ********************************/
    /******* @desc findAudioPostById: Finds All Audio Posts By ID ***/
    /****************************************************************/
    async findAudioPostById(userId) {
      const dbConnection = await super.createConnection();
      return dbConnection.collection('naijap_db_posts').countDocuments({ userId: new ObjectId(userId).toString(), postType: 'audio' }).then((total) => {
        return total;
      });
    }

    /****************************************************************/
    /*****************  Find Posts With Pictures     ****************/
    /****************************************************************/
    async findPostsWithPictures(userId) {
      const dbConnection = await super.createConnection();
      return dbConnection.collection('naijap_db_posts').find({ userId: userId }).sort({ _id: -1 }).toArray().then((docs) => {
        return docs;
      })
    }

    /****************************************************************/
    /******* @author saladin jake victor juwa ********************************/
    /******* @desc udatePost: Updates A  Post       *****************/
    /****************************************************************/
    async updatePost(payload) {
        const dbConnection = await super.createConnection();
        return dbConnection.collection('naijap_db_posts').findOneAndUpdate({
            _id: payload._id
        }, {
            $set: payload
        }, {
            returnOriginal: false
        }).then((doc) => {
          return doc.value;
        });
    }

    /****************************************************************/
    /*****************  Update Post Likes     ***********************/
    /****************************************************************/
    async updatePostLikes(payload) {
      const dbConnection = await super.createConnection();
      return dbConnection.collection('naijap_db_posts').findOneAndUpdate({
          _id: payload._id
      }, {
          $inc: {
            likes: payload.likes,
          }
      }, {
          returnOriginal: false
      }).then((doc) => {
          return doc.value;
      });
    }

    /****************************************************************/
    /*****************  Update Post Favourites     ******************/
    /****************************************************************/
    async updatePostFavourites(payload) {
      const dbConnection = await super.createConnection();
      return dbConnection.collection('naijap_db_posts').findOneAndUpdate({
          _id: payload._id
      }, {
          $inc: {
            favourites: payload.favourites,
          }
      }, {
          returnOriginal: false
      }).then((doc) => {
          return doc.value;
      });
    }

    /****************************************************************/
    /*****************       Update Post Views     ******************/
    /****************************************************************/
    async updatePostViews(payload) {
      const dbConnection = await super.createConnection();
      return dbConnection.collection('naijap_db_posts').findOneAndUpdate({
          _id: payload._id
      }, {
          $inc: {
            views: payload.views
          }
      }, {
          returnOriginal: false
      }).then((doc) => {
        return doc.value;
      });
    }

    /****************************************************************/
    /*****************       Update Post Comments  ******************/
    /****************************************************************/
    async updatePostComment(payload) {
      const dbConnection = await super.createConnection();
      return dbConnection.collection('naijap_db_posts').findOneAndUpdate({
          _id: payload._id
      }, {
          $inc: {
            comments: payload.comments
          }
      }, {
          returnOriginal: false
      }).then((doc) => {
        return doc.value;
      });
    }

    async fetchPostByContest(contestId) {
      const dbConnection = await super.createConnection();
      return dbConnection.collection('naijap_db_posts').find({ contestId: new ObjectId(contestId).toString() }).sort({ _id: -1 }).toArray()
        .then((docs) => {
          return docs;
      })
    }

    async fetchPostsViaContest(contestId) {
      const dbConnection = await super.createConnection();
      return dbConnection.collection('naijap_db_posts').find({
        contestId: new ObjectId(contestId).toString()
      }).sort({ _id: -1 }).toArray().then((docs) => {
        return docs;
      });
    }

    async findGroupPosts(groupId) {
      const dbConnection = await super.createConnection();
      return dbConnection.collection('naijap_db_posts').find({ groupId: groupId }).toArray()
      .then((docs) => { return docs; })
    }

    /****************************************************************/
    /******* @author saladin jake victor juwa ********************************/
    /******* @desc deletePost: Deletes A  Post      *****************/
    /****************************************************************/
    async deletePost(postId) {
        const dbConnection = await super.createConnection();
        return dbConnection.collection('naijap_db_posts').findOneAndDelete({ _id: postId }).then((response) => {
            if (response.value) {
              return true;
            }

            return false;
        });
    }

    async searchPosts(title) {
      const dbConnection = await super.createConnection();
      return dbConnection.collection('naijap_db_posts').find({ title: /title/ })
      .toArray().then((docs) => {
        return docs;
      });
    }
}

module.exports = PostModel;
