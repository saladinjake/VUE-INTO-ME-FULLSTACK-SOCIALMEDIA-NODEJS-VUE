const _ = require('lodash');
const {ObjectId} = require('mongodb');

/****************************************************************/
/************   Custom Module Imports      **********************/
/****************************************************************/
const Controller = require('../core/controllers/Controller');

const ContestModel = require('../core/model/ContestModel');
const UserModel = require('../core/model/UserModel');
const PostModel = require('../core/model/PostModel');
const PostActivityModel = require('../core/model/PostActivityModel');

class PostController extends Controller {
    constructor() { super() }

    /****************************************************************/
    /*******       Init a new post          *************************/
    /****************************************************************/
    async initPost(req, res) {
      const Response = { status: 200, message: [], data: [] };

      /****************************************************************/
      /**********      Verify The User ID     *************************/
      /****************************************************************/
      try {

        const UserID = await super.validateHeaders(req, UserModel, _);

        if (UserID) {
          // Init the Post Object...........
          const Post = new PostModel();
          const PostId = await Post.init(UserID._id.toString());
          Response.data.push({ postId: PostId._id });

          res.status(200).json(Response);
          return;
        }

        Response.status = 401;
        Response.message.push({ user: 'A user with this token could not be found and verified.' });

        res.status(401).json(Response);
        return;
      } catch (e) {
        Response.status = 500;
        Response.message.push({
          server: {
            customMessage: `Sorry, an exception occurred and your request could not be completed. `,
            errorName: e.name,
            errorMessage: e.message
          }
        });

        res.status(500).json(Response);
      }
    }

    /****************************************************************/
    /*******   Creates  a new post  | News Forum  *******************/
    /****************************************************************/
    async createPost(req, res) {
      const Response = { status: 200, message: [], data: [] };
      let { title, content, genre, original, postType, forumCategory, groupId  } = req.body;
      const postID = req.params.postId;

      if (title == null || title == undefined || title == '') {
        Response.status = 400;
        Response.message.push({ title: 'Sorry, the title field is required.' });
      }

      if (content == null || content == undefined || content == '') {
        Response.status = 400;
        Response.message.push({ content: 'Sorry, the content field is required.' });
      }

      if (genre == null || genre == undefined || genre == '') {
        Response.status = 400;
        Response.message.push({ genre: 'Sorry, the genre field is required.' });
      }

      if (postType == null || postType == undefined || postType == '') {
        Response.status = 400;
        Response.message.push({ postType: 'Sorry, the post type field is required.' });
      }

      if (original) {
        original = true;
      } else {
        original = false;
      }

      if (forumCategory == undefined || forumCategory == null || forumCategory == '') {
        forumCategory = '';
      }

      if (groupId == undefined || groupId == null || groupId == '') {
        groupId = '';
      }

      //!## Update the post using the post id... findPostByID
      try {
        const Post = new PostModel();

        //!## Send a response back with a 400 status code .....
        if (Response.status !== 200) {
          await Post.deletePost(postID);
          res.status(400).json(Response);
          return;
        }

        const PostContent = await Post.findPostByID(postID);
        //!## Check if a post with this ID exist..........
        if (!PostContent) {
          Response.message.push({ PostError: 'Sorry, A post with this ID could not be found.' });
          res.status(404).json(Response);
          return;
        }

        if (original) {
          if (postType == 'audio' || postType == 'video') {
            let contestModel = new ContestModel();
            let ongoingContest = await contestModel.fetchOngoingContest();

            if (ongoingContest) {

              let currentDate = new Date();
              let contestStartDate = new Date(ongoingContest.date.startDate);
              let contestEndDate = new Date(ongoingContest.date.endDate);

              if (currentDate.getTime() >= contestStartDate.getTime() && currentDate.getTime() <= contestEndDate.getTime()) {
                PostContent.contestId = ongoingContest._id.toString();
              }

              // PostContent.contestId = ongoingContest._id.toString();
            }
          }
        }

        //!## Update the Post collection.........
        PostContent.title = title;
        PostContent.content = content;
        PostContent.genre = genre;
        PostContent.original = original;
        PostContent.postType = postType;
        PostContent.forumCategory = forumCategory;
        PostContent.groupId = groupId;

        //!## Update the post finally......
        const UpdatePost = Post.updatePost(PostContent);

        Response.status = 201;
        Response.data.push(PostContent);

        res.status(201).json(Response);
        return;
      } catch (e) {
        Response.status = 500;
        Response.message.push({
          server: {
            customMessage: `Sorry, an exception occurred and your request could not be completed. `,
            errorName: e.name,
            errorMessage: e.message
          }
        });
        Post.deletePost(postID);
        res.status(500).json(Response);
        return;
      }
    }

    async createPicturePost(req, res) {
      const Response = { status: 200, message: [], data: [] };
      let { title, content, postType, groupId } = req.body;
      const postID = req.params.postId;

      if (title == null || title == undefined || title == '') {
        Response.status = 400;
        Response.message.push({ title: 'Sorry, the title field is required.' });
      }

      if (content == null || content == undefined || content == '') {
        Response.status = 400;
        Response.message.push({ content: 'Sorry, the content field is required.' });
      }

      if (postType == null || postType == undefined || postType == '') {
        Response.status = 400;
        Response.message.push({ postType: 'Sorry, the postType field is required.' });
      }

      try {
        const Post = new PostModel();

        //!## Send a response back with a 400 status code .....
        if (Response.status !== 200) {
          await Post.deletePost(postID);
          res.status(400).json(Response);
          return;
        }

        const PostContent = await Post.findPostByID(postID);
        //!## Check if a post with this ID exist..........
        if (!PostContent) {
          Response.message.push({ PostError: 'Sorry, A post with this ID could not be found.' });
          res.status(404).json(Response);
          return;
        }

        if (groupId == undefined || groupId == null || groupId == '') {
          groupId = '';
        }

        //!## Update the Post collection.........
        PostContent.title = title;
        PostContent.content = content;
        PostContent.postType = postType;
        PostContent.groupId = groupId;
        //!## Update the post finally......
        const UpdatePost = Post.updatePost(PostContent);

        Response.status = 201;
        Response.data.push(PostContent);

        res.status(201).json(Response);
        return;
      } catch (e) {
        Response.status = 500;
        Response.message.push({
          server: {
            customMessage: `Sorry, an exception occurred and your request could not be completed. `,
            errorName: e.name,
            errorMessage: e.message
          }
        });

        res.status(500).json(Response);
        return;
      }
    }

    async createNewsForums(req, res) {
      const Response = { status: 200, message: [], data: [] };
      const postID = req.params.postId;
      let { title, content, postType } = req.body;

      if (title == null || title == undefined || title == '') {
        Response.status = 400;
        Response.message.push({ title: 'Sorry, the title field is required.' });
      }

      if (content == null || content == undefined || content == '') {
        Response.status = 400;
        Response.message.push({ content: 'Sorry, the content field is required.' });
      }

      if (postType == null || postType == undefined || postType == '') {
        Response.status = 400;
        Response.message.push({ postType: 'Sorry, the post type field is required.' });
      }

      try {
        const Post = new PostModel();

        //!## Send a response back with a 400 status code .....
        if (Response.status !== 200) {
          await Post.deletePost(postID);
          res.status(400).json(Response);
          return;
        }

        const PostContent = await Post.findPostByID(postID);
        //!## Check if a post with this ID exist..........
        if (!PostContent) {
          Response.message.push({ PostError: 'Sorry, A post with this ID could not be found.' });
          res.status(404).json(Response);
          return;
        }

        //!## Update the Post collection.........
        PostContent.title = title;
        PostContent.content = content;
        PostContent.postType = postType;
        PostContent.timestamp = Post.fetchTimestamp(PostContent._id);
        //!## Update the post finally......
        const UpdatePost = Post.updatePost(PostContent);

        Response.status = 201;
        Response.data.push(PostContent);

        res.status(201).json(Response);
        return;
      } catch (e) {
        Response.status = 500;
        Response.message.push({
          server: {
            customMessage: `Sorry, an exception occurred and your request could not be completed. `,
            errorName: e.name,
            errorMessage: e.message
          }
        });
        Post.deletePost(postID);
        res.status(500).json(Response);
        return;
      }
    }

    /****************************************************************/
    /********     Forums    Management      *************************/
    /****************************************************************/
    async createForum(req, res) {
      const Response = { status: 200, message: [], data: [] };
      const postID = req.params.postId;
      let { title, content, category, postType } = req.body;

      if (title == null || title == undefined || title == '') {
        Response.status = 400;
        Response.message.push({ title: 'Sorry, the title field is required.' });
      }

      if (content == null || content == undefined || content == '') {
        Response.status = 400;
        Response.message.push({ content: 'Sorry, the content field is required.' });
      }

      if (category == null || category == undefined || category == '') {
        Response.status = 400;
        Response.message.push({ category: 'Sorry, the category field is required.' });
      }

      if (postType == null || postType == undefined || postType == '') {
        Response.status = 400;
        Response.message.push({ postType: 'Sorry, the post type field is required.' });
      }

      try {
        const Post = new PostModel();

        //!## Send a response back with a 400 status code .....
        if (Response.status !== 200) {
          await Post.deletePost(postID);
          res.status(400).json(Response);
          return;
        }

        const PostContent = await Post.findPostByID(postID);
        //!## Check if a post with this ID exist..........
        if (!PostContent) {
          Response.message.push({ PostError: 'Sorry, A post with this ID could not be found.' });
          res.status(404).json(Response);
          return;
        }

        //!## Update the Post collection.........
        PostContent.title = title;
        PostContent.content = content;
        PostContent.forumCategory = category;
        PostContent.postType = postType;
        PostContent.timestamp = Post.fetchTimestamp(PostContent._id);
        //!## Update the post finally......
        const UpdatePost = Post.updatePost(PostContent);

        Response.status = 201;
        Response.data.push(PostContent);

        res.status(201).json(Response);
        return;
      } catch (e) {
        Response.status = 500;
        Response.message.push({
          server: {
            customMessage: `Sorry, an exception occurred and your request could not be completed. `,
            errorName: e.name,
            errorMessage: e.message
          }
        });
        Post.deletePost(postID);
        res.status(500).json(Response);
        return;
      }
    }

    async fetchForum(req, res) {
      //!## Fetch the posts based on the userid.... This will be used a relationship for other posts / users.
      const Response = { status: 200, message: [], data: [] };
      const User = await super.validateHeaders(req, UserModel, _);
      const NextPage = req.params.nextPage;

      const Post = new PostModel();
      let userModel = new UserModel();
      const PostActivity = new PostActivityModel();

      if (!User) {
        Response.status = 401;
        Response.message.push({ user: 'A user with this token could not be found and verified.' });
        res.status(401).json(Response);
        return;
      }

      try {
        if (NextPage == 0) {
          const Posts = await Post.fetchForums(null);
          if (Posts.length < 1) {
            Response.status = 204;

            res.status(204).json(Response);
            return;
          }

          if (Posts.length > 0) {
            const Pagination = await super.paginationMetaConetnt(Posts, PostModel, 'naijap_db_posts');
            //!# Refractor Code Later!!!
            let user = '';
            let postLikes = '';
            let postComments = '';
            let postFavourite = '';

            for (let i = 0; i < Posts.length; i++) {
              user = await userModel.findUserById(Posts[i].userId);
              postLikes = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'like',
              });
              postComments = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'comment',
              });
              postFavourite = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'favourite',
              });

              Posts[i].timestamp = userModel.fetchTimestamp(Posts[i]._id);
              Posts[i].user = {
                firstName: user.firstName,
                lastName: user.lastName,
                stageName: user.stageName,
                avatar: user.avatar
              }

              if (postLikes) {
                Posts[i].liked = true;
              } else {
                Posts[i].liked = false;
              }

              if (postComments) {
                Posts[i].comment = true;
              } else {
                Posts[i].comment = true;
              }

              if (postFavourite) {
                Posts[i].favourite = true;
              } else {
                Posts[i].favourite = false;
              }

            }
            Response.status = 200;
            Response.data.push(Posts);

            Response.data.push({ pagination: Pagination });
            res.status(200).json(Response);
            return;
          }
        }

        if (NextPage !== 0) {
          const Posts = await Post.fetchForums(NextPage);
          if (Posts.length < 1) {
            Response.status = 204;

            res.status(204).json(Response);
            return;
          }

          if (Posts.length > 0) {
            const Pagination = await super.paginationMetaConetnt(Posts, PostModel, 'naijap_db_posts');
            //!# Refractor Code Later!!!
            let user = '';
            let postLikes = '';
            let postComments = '';
            let postFavourite = '';

            for (let i = 0; i < Posts.length; i++) {
              user = await userModel.findUserById(Posts[i].userId);
              postLikes = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'like',
              });
              postComments = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'comment',
              });
              postFavourite = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'favourite',
              });

              Posts[i].timestamp = userModel.fetchTimestamp(Posts[i]._id);
              Posts[i].user = {
                firstName: user.firstName,
                lastName: user.lastName,
                stageName: user.stageName,
                avatar: user.avatar
              };

              if (postLikes) {
                Posts[i].liked = true;
              } else {
                Posts[i].liked = false;
              }

              if (postComments) {
                Posts[i].comment = true;
              } else {
                Posts[i].comment = false;
              }

              if (postFavourite) {
                Posts[i].favourite = true;
              } else {
                Posts[i].favourite = false;
              }
            }
            Response.status = 200;
            Response.data.push(Posts);

            Response.data.push({ pagination: Pagination });
            res.status(200).json(Response);
            return;
          }
        }

        Response.message.push({ posts: 'Sorry. We couldn\'t fetch the next set of posts for you.' });
        Response.status = 204;

        res.status(204).json(Response);
        return;
      } catch (e) {
        Response.status = 500;
        Response.message.push({
          server: {
            customMessage: `Sorry, an exception occurred and your request could not be completed. `,
            errorName: e.name,
            errorMessage: e.message
          }
        })
        res.status(500).json(Response);
        return;
      }

    }

    async fetchForumViaCategory(req, res) {
      //!## Fetch the posts based on the userid.... This will be used a relationship for other posts / users.
      const Response = { status: 200, message: [], data: [] };
      const User = await super.validateHeaders(req, UserModel, _);
      const NextPage = req.params.nextPage;
      const category = req.params.category;

      const Post = new PostModel();
      let userModel = new UserModel();
      const PostActivity = new PostActivityModel();

      if (!User) {
        Response.status = 401;
        Response.message.push({ user: 'A user with this token could not be found and verified.' });
        res.status(401).json(Response);
        return;
      }

      if (!category) {
        Response.status = 401;
        Response.message.push({ user: 'Sorry, This field is required in order to continue.' });
        res.status(401).json(Response);
        return;
      }

      try {
        if (NextPage == 0) {
          const Posts = await Post.fetchForumsViaCategory(null, category);
          if (Posts.length < 1) {
            Response.status = 204;

            res.status(204).json(Response);
            return;
          }

          if (Posts.length > 0) {
            const Pagination = await super.paginationMetaConetnt(Posts, PostModel, 'naijap_db_posts');
            //!# Refractor Code Later!!!
            let user = '';
            let postLikes = '';
            let postComments = '';
            let postFavourite = '';

            for (let i = 0; i < Posts.length; i++) {
              user = await userModel.findUserById(Posts[i].userId);
              postLikes = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'like'
              });
              postComments = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'comment',
              });
              postFavourite = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'favourite'
              });

              Posts[i].timestamp = userModel.fetchTimestamp(Posts[i]._id);
              Posts[i].user = {
                firstName: user.firstName,
                lastName: user.lastName,
                stageName: user.stageName,
                avatar: user.avatar
              }

              if (postLikes) {
                Posts[i].liked = true;
              } else {
                Posts[i].liked = false;
              }

              if (postComments) {
                Posts[i].comment = true;
              } else {
                Posts[i].comment = true;
              }

              if (postFavourite) {
                Posts[i].favourite = true;
              } else {
                Posts[i].favourite = false;
              }

            }
            Response.status = 200;
            Response.data.push(Posts);

            Response.data.push({ pagination: Pagination });
            res.status(200).json(Response);
            return;
          }
        }

        if (NextPage !== 0) {
          const Posts = await Post.fetchForumsViaCategory(NextPage, category);
          if (Posts.length < 1) {
            Response.status = 204;

            res.status(204).json(Response);
            return;
          }

          if (Posts.length > 0) {
            const Pagination = await super.paginationMetaConetnt(Posts, PostModel, 'naijap_db_posts');
            //!# Refractor Code Later!!!
            let user = '';
            let postLikes = '';
            let postComments = '';
            let postFavourite = '';

            for (let i = 0; i < Posts.length; i++) {
              user = await userModel.findUserById(Posts[i].userId);
              postLikes = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'like'
              });
              postComments = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'comment',
              });
              postFavourite = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'favourite'
              });

              Posts[i].timestamp = userModel.fetchTimestamp(Posts[i]._id);
              Posts[i].user = {
                firstName: user.firstName,
                lastName: user.lastName,
                stageName: user.stageName,
                avatar: user.avatar
              };

              if (postLikes) {
                Posts[i].liked = true;
              } else {
                Posts[i].liked = false;
              }

              if (postComments) {
                Posts[i].comment = true;
              } else {
                Posts[i].comment = false;
              }

              if (postFavourite) {
                Posts[i].favourite = true;
              } else {
                Posts[i].favourite = false;
              }
            }
            Response.status = 200;
            Response.data.push(Posts);

            Response.data.push({ pagination: Pagination });
            res.status(200).json(Response);
            return;
          }
        }

        Response.message.push({ posts: 'Sorry. We couldn\'t fetch the next set of posts for you.' });
        Response.status = 204;

        res.status(204).json(Response);
        return;
      } catch (e) {
        Response.status = 500;
        Response.message.push({
          server: {
            customMessage: `Sorry, an exception occurred and your request could not be completed. `,
            errorName: e.name,
            errorMessage: e.message
          }
        })
        res.status(500).json(Response);
        return;
      }

    }

    /****************************************************************/
    /*******      Status Management         *************************/
    /****************************************************************/
    async createStatus(req, res) {
      const Response = { status: 200, message: [], data: [] };
      const postID = req.params.postId;
      let { title, content, postType } = req.body;

      if (title == null || title == undefined || title == '') {
        Response.status = 400;
        Response.message.push({ title: 'Sorry, the title field is required.' });
      }

      if (content == null || content == undefined || content == '') {
        Response.status = 400;
        Response.message.push({ content: 'Sorry, the content field is required.' });
      }

      if (postType == null || postType == undefined || postType == '') {
        Response.status = 400;
        Response.message.push({ postType: 'Sorry, the post type field is required.' });
      }

      try {
        const Post = new PostModel();

        //!## Send a response back with a 400 status code .....
        if (Response.status !== 200) {
          await Post.deletePost(postID);
          res.status(400).json(Response);
          return;
        }

        const PostContent = await Post.findPostByID(postID);
        //!## Check if a post with this ID exist..........
        if (!PostContent) {
          Response.message.push({ PostError: 'Sorry, A post with this ID could not be found.' });
          res.status(404).json(Response);
          return;
        }

        //!## Update the Post collection.........
        PostContent.title = title;
        PostContent.content = content;
        PostContent.postType = postType;
        PostContent.timestamp = Post.fetchTimestamp(PostContent._id);
        //!## Update the post finally......
        const UpdatePost = Post.updatePost(PostContent);

        Response.status = 201;
        Response.data.push(PostContent);

        res.status(201).json(Response);
        return;
      } catch (e) {
        Response.status = 500;
        Response.message.push({
          server: {
            customMessage: `Sorry, an exception occurred and your request could not be completed. `,
            errorName: e.name,
            errorMessage: e.message
          }
        });
        Post.deletePost(postID);
        res.status(500).json(Response);
        return;
      }
    }

    async fetchStatus(req, res) {
      //!## Fetch the posts based on the userid.... This will be used a relationship for other posts / users.
      const Response = { status: 200, message: [], data: [] };
      const User = await super.validateHeaders(req, UserModel, _);
      const NextPage = req.params.nextPage;

      const Post = new PostModel();
      let userModel = new UserModel();
      const PostActivity = new PostActivityModel();

      if (!User) {
        Response.status = 401;
        Response.message.push({ user: 'A user with this token could not be found and verified.' });
        res.status(401).json(Response);
        return;
      }

      try {
        if (NextPage == 0) {
          const Posts = await Post.fetchStatus(null);
          if (Posts.length < 1) {
            Response.status = 204;

            res.status(204).json(Response);
            return;
          }

          if (Posts.length > 0) {
            const Pagination = await super.paginationMetaConetnt(Posts, PostModel, 'naijap_db_posts');
            //!# Refractor Code Later!!!
            let user = '';
            let postLikes = '';
            let postComments = '';
            let postFavourite = '';

            for (let i = 0; i < Posts.length; i++) {
              user = await userModel.findUserById(Posts[i].userId);
              postLikes = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'like'
              });
              postComments = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'comment',
              });
              postFavourite = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'favourite'
              });

              Posts[i].timestamp = userModel.fetchTimestamp(Posts[i]._id);
              Posts[i].user = {
                firstName: user.firstName,
                lastName: user.lastName,
                stageName: user.stageName,
                avatar: user.avatar
              }

              if (postLikes) {
                Posts[i].liked = true;
              } else {
                Posts[i].liked = false;
              }

              if (postComments) {
                Posts[i].comment = true;
              } else {
                Posts[i].comment = true;
              }

              if (postFavourite) {
                Posts[i].favourite = true;
              } else {
                Posts[i].favourite = false;
              }

            }
            Response.status = 200;
            Response.data.push(Posts);

            Response.data.push({ pagination: Pagination });
            res.status(200).json(Response);
            return;
          }
        }

        if (NextPage !== 0) {
          const Posts = await Post.fetchStatus(NextPage);
          if (Posts.length < 1) {
            Response.status = 204;

            res.status(204).json(Response);
            return;
          }

          if (Posts.length > 0) {
            const Pagination = await super.paginationMetaConetnt(Posts, PostModel, 'naijap_db_posts');
            //!# Refractor Code Later!!!
            let user = '';
            let postLikes = '';
            let postComments = '';
            let postFavourite = '';

            for (let i = 0; i < Posts.length; i++) {
              user = await userModel.findUserById(Posts[i].userId);
              postLikes = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'like'
              });
              postComments = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'comment',
              });
              postFavourite = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'favourite'
              });

              Posts[i].timestamp = userModel.fetchTimestamp(Posts[i]._id);
              Posts[i].user = {
                firstName: user.firstName,
                lastName: user.lastName,
                stageName: user.stageName,
                avatar: user.avatar
              };

              if (postLikes) {
                Posts[i].liked = true;
              } else {
                Posts[i].liked = false;
              }

              if (postComments) {
                Posts[i].comment = true;
              } else {
                Posts[i].comment = false;
              }

              if (postFavourite) {
                Posts[i].favourite = true;
              } else {
                Posts[i].favourite = false;
              }
            }
            Response.status = 200;
            Response.data.push(Posts);

            Response.data.push({ pagination: Pagination });
            res.status(200).json(Response);
            return;
          }
        }

        Response.message.push({ posts: 'Sorry. We couldn\'t fetch the next set of posts for you.' });
        Response.status = 204;

        res.status(204).json(Response);
        return;
      } catch (e) {
        Response.status = 500;
        Response.message.push({
          server: {
            customMessage: `Sorry, an exception occurred and your request could not be completed. `,
            errorName: e.name,
            errorMessage: e.message
          }
        })
        res.status(500).json(Response);
        return;
      }

    }

    /****************************************************************/
    /*******    Posts | News Retrieval      *************************/
    /****************************************************************/
    async fetchPosts(req, res) {
      //!## Fetch the posts based on the userid.... This will be used a relationship for other posts / users.
      const Response = { status: 200, message: [], data: [] };
      const User = await super.validateHeaders(req, UserModel, _);
      const NextPage = req.params.nextPage;

      const Post = new PostModel();
      let userModel = new UserModel();
      const PostActivity = new PostActivityModel();

      if (!User) {
        Response.status = 401;
        Response.message.push({ user: 'A user with this token could not be found and verified.' });
        res.status(401).json(Response);
        return;
      }

      try {
        if (NextPage == 0) {
          const Posts = await Post.fetchPosts(null);
          if (Posts.length < 1) {
            Response.status = 204;

            res.status(204).json(Response);
            return;
          }

          if (Posts.length > 0) {
            const Pagination = await super.paginationMetaConetnt(Posts, PostModel, 'naijap_db_posts');
            //!# Refractor Code Later!!!
            let user = '';
            let postLikes = '';
            let postComments = '';
            let postFavourite = '';

            for (let i = 0; i < Posts.length; i++) {
              user = await userModel.findUserById(Posts[i].userId);
              postLikes = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'like',
              });
              postComments = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'comment',
              });
              postFavourite = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'favourite',
              });

              Posts[i].timestamp = userModel.fetchTimestamp(Posts[i]._id);
              Posts[i].user = {
                firstName: user.firstName,
                lastName: user.lastName,
                stageName: user.stageName,
                avatar: user.avatar
              }

              if (postLikes) {
                Posts[i].liked = true;
              } else {
                Posts[i].liked = false;
              }

              if (postComments) {
                Posts[i].comment = true;
              } else {
                Posts[i].comment = true;
              }

              if (postFavourite) {
                Posts[i].favourite = true;
              } else {
                Posts[i].favourite = false;
              }

            }
            Response.status = 200;
            Response.data.push(Posts);

            Response.data.push({ pagination: Pagination });
            res.status(200).json(Response);
            return;
          }
        }

        if (NextPage !== 0) {
          const Posts = await Post.fetchPosts(NextPage);
          if (Posts.length < 1) {
            Response.status = 204;

            res.status(204).json(Response);
            return;
          }

          if (Posts.length > 0) {
            const Pagination = await super.paginationMetaConetnt(Posts, PostModel, 'naijap_db_posts');
            //!# Refractor Code Later!!!
            let user = '';
            let postLikes = '';
            let postComments = '';
            let postFavourite = '';

            for (let i = 0; i < Posts.length; i++) {
              user = await userModel.findUserById(Posts[i].userId);
              postLikes = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'like',
              });
              postComments = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'comment',
              });
              postFavourite = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'favourite',
              });

              Posts[i].timestamp = userModel.fetchTimestamp(Posts[i]._id);
              Posts[i].user = {
                firstName: user.firstName,
                lastName: user.lastName,
                stageName: user.stageName,
                avatar: user.avatar
              };

              if (postLikes) {
                Posts[i].liked = true;
              } else {
                Posts[i].liked = false;
              }

              if (postComments) {
                Posts[i].comment = true;
              } else {
                Posts[i].comment = false;
              }

              if (postFavourite) {
                Posts[i].favourite = true;
              } else {
                Posts[i].favourite = false;
              }
            }
            Response.status = 200;
            Response.data.push(Posts);

            Response.data.push({ pagination: Pagination });
            res.status(200).json(Response);
            return;
          }
        }

        Response.message.push({ posts: 'Sorry. We couldn\'t fetch the next set of posts for you.' });
        Response.status = 204;

        res.status(204).json(Response);
        return;
      } catch (e) {
        Response.status = 500;
        Response.message.push({
          server: {
            customMessage: `Sorry, an exception occurred and your request could not be completed. `,
            errorName: e.name,
            errorMessage: e.message
          }
        })
        res.status(500).json(Response);
        return;
      }

    }

    async fetchGroupPosts(req, res) {
      //!## Fetch the posts based on the userid.... This will be used a relationship for other posts / users.
      const Response = { status: 200, message: [], data: [] };
      const User = await super.validateHeaders(req, UserModel, _);
      const NextPage = req.params.nextPage;

      const Post = new PostModel();
      let userModel = new UserModel();
      const PostActivity = new PostActivityModel();

      if (!User) {
        Response.status = 401;
        Response.message.push({ user: 'A user with this token could not be found and verified.' });
        res.status(401).json(Response);
        return;
      }

      try {
        if (NextPage == 0) {
          const Posts = await Post.fetchAllGroupsPost(null, req.params.groupId);
          if (Posts.length < 1) {
            Response.status = 204;

            res.status(204).json(Response);
            return;
          }

          if (Posts.length > 0) {
            const Pagination = await super.paginationMetaConetnt(Posts, PostModel, 'naijap_db_posts');
            //!# Refractor Code Later!!!
            let user = '';
            let postLikes = '';
            let postComments = '';
            let postFavourite = '';

            for (let i = 0; i < Posts.length; i++) {
              user = await userModel.findUserById(Posts[i].userId);
              postLikes = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'like',
              });
              postComments = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'comment',
              });
              postFavourite = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'favourite'
              });

              Posts[i].timestamp = userModel.fetchTimestamp(Posts[i]._id);
              Posts[i].user = {
                firstName: user.firstName,
                lastName: user.lastName,
                stageName: user.stageName,
                avatar: user.avatar
              }

              if (postLikes) {
                Posts[i].liked = true;
              } else {
                Posts[i].liked = false;
              }

              if (postComments) {
                Posts[i].comment = true;
              } else {
                Posts[i].comment = true;
              }

              if (postFavourite) {
                Posts[i].favourite = true;
              } else {
                Posts[i].favourite = false;
              }

            }
            Response.status = 200;
            Response.data.push(Posts);

            Response.data.push({ pagination: Pagination });
            res.status(200).json(Response);
            return;
          }
        }

        if (NextPage !== 0) {
          const Posts = await Post.fetchAllGroupsPost(NextPage, req.params.groupId);
          if (Posts.length < 1) {
            Response.status = 204;

            res.status(204).json(Response);
            return;
          }

          if (Posts.length > 0) {
            const Pagination = await super.paginationMetaConetnt(Posts, PostModel, 'naijap_db_posts');
            //!# Refractor Code Later!!!
            let user = '';
            let postLikes = '';
            let postComments = '';
            let postFavourite = '';

            for (let i = 0; i < Posts.length; i++) {
              user = await userModel.findUserById(Posts[i].userId);
              postLikes = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'like',
              });
              postComments = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'comment',
              });
              postFavourite = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'favourite',
              });

              Posts[i].timestamp = userModel.fetchTimestamp(Posts[i]._id);
              Posts[i].user = {
                firstName: user.firstName,
                lastName: user.lastName,
                stageName: user.stageName,
                avatar: user.avatar
              };

              if (postLikes) {
                Posts[i].liked = true;
              } else {
                Posts[i].liked = false;
              }

              if (postComments) {
                Posts[i].comment = true;
              } else {
                Posts[i].comment = false;
              }

              if (postFavourite) {
                Posts[i].favourite = true;
              } else {
                Posts[i].favourite = false;
              }
            }
            Response.status = 200;
            Response.data.push(Posts);

            Response.data.push({ pagination: Pagination });
            res.status(200).json(Response);
            return;
          }
        }

        Response.message.push({ posts: 'Sorry. We couldn\'t fetch the next set of posts for you.' });
        Response.status = 204;

        res.status(204).json(Response);
        return;
      } catch (e) {
        Response.status = 500;
        Response.message.push({
          server: {
            customMessage: `Sorry, an exception occurred and your request could not be completed. `,
            errorName: e.name,
            errorMessage: e.message
          }
        })
        res.status(500).json(Response);
        return;
      }

    }

    async fetchUserPosts(req, res) {
      const Response = { status: 200, message: [], data: [] };
      const User = await super.validateHeaders(req, UserModel, _);

      if (!User) {
        Response.status = 401;
        Response.message.push({ user: 'A user with this token could not be found and verified.' });
        res.status(401).json(Response);
        return;
      }

      try {
        const Post = new PostModel();
        let userModel = new UserModel();
        let user = null;

        if (req.params.userId == 0) {
          user = User;
        } else {
          user = await userModel.findUserById(req.params.userId);
        }

        let posts = await Post.fetchUserPosts(user._id.toString());
        if (posts < 1) {
          Response.status = 204;
          res.status(204).json(Response);
          return;
        }

        Response.status = 200;
        Response.data.push({ posts });

        res.status(200).json(Response);
        return;

      } catch (e) {
        Response.status = 500;
        Response.message.push({
          server: {
            customMessage: `Sorry, an exception occurred and your request could not be completed. `,
            errorName: e.name,
            errorMessage: e.message
          }
        });
        res.status(500).json(Response);
        return;
      }
    }

    async fetchNews(req, res) {
      const Response = { status: 200, message: [], data: [] };
      const User = await super.validateHeaders(req, UserModel, _);
      const NextPage = req.params.nextPage;

      const Post = new PostModel();
      let userModel = new UserModel();
      const PostActivity = new PostActivityModel();

      if (!User) {
        Response.status = 401;
        Response.message.push({ user: 'A user with this token could not be found and verified.' });
        res.status(401).json(Response);
        return;
      }

      try {
        if (NextPage == 0) {
          const Posts = await Post.fetchNews(null);
          if (Posts.length < 1) {
            Response.status = 204;

            res.status(204).json(Response);
            return;
          }

          if (Posts.length > 0) {
            const Pagination = await super.paginationMetaConetnt(Posts, PostModel, 'naijap_db_posts');
            //!# Refractor Code Later!!!
            let user = '';
            let postLikes = '';
            let postComments = '';
            let postFavourite = '';

            for (let i = 0; i < Posts.length; i++) {
              user = await userModel.findUserById(Posts[i].userId);
              postLikes = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'like'
              });
              postComments = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'comment',
              });
              postFavourite = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'favourite'
              });

              Posts[i].timestamp = userModel.fetchTimestamp(Posts[i]._id);
              Posts[i].user = {
                firstName: user.firstName,
                lastName: user.lastName,
                stageName: user.stageName,
                avatar: user.avatar
              }

              if (postLikes) {
                Posts[i].liked = true;
              } else {
                Posts[i].liked = false;
              }

              if (postComments) {
                Posts[i].comment = true;
              } else {
                Posts[i].comment = true;
              }

              if (postFavourite) {
                Posts[i].favourite = true;
              } else {
                Posts[i].favourite = false;
              }

            }
            Response.status = 200;
            Response.data.push(Posts);

            Response.data.push({ pagination: Pagination });
            res.status(200).json(Response);
            return;
          }
        }

        if (NextPage !== 0) {
          const Posts = await Post.fetchNews(NextPage);
          if (Posts.length < 1) {
            Response.status = 204;

            res.status(204).json(Response);
            return;
          }

          if (Posts.length > 0) {
            const Pagination = await super.paginationMetaConetnt(Posts, PostModel, 'naijap_db_posts');
            //!# Refractor Code Later!!!
            let user = '';
            let postLikes = '';
            let postComments = '';
            let postFavourite = '';

            for (let i = 0; i < Posts.length; i++) {
              user = await userModel.findUserById(Posts[i].userId);
              postLikes = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'like'
              });
              postComments = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'comment',
              });
              postFavourite = await PostActivity.findActivity({
                postId: Posts[i]._id.toString(),
                userId: User._id.toString(),
                type: 'favourite'
              });

              Posts[i].timestamp = userModel.fetchTimestamp(Posts[i]._id);
              Posts[i].user = {
                firstName: user.firstName,
                lastName: user.lastName,
                stageName: user.stageName,
                avatar: user.avatar
              };

              if (postLikes) {
                Posts[i].liked = true;
              } else {
                Posts[i].liked = false;
              }

              if (postComments) {
                Posts[i].comment = true;
              } else {
                Posts[i].comment = false;
              }

              if (postFavourite) {
                Posts[i].favourite = true;
              } else {
                Posts[i].favourite = false;
              }
            }
            Response.status = 200;
            Response.data.push(Posts);

            Response.data.push({ pagination: Pagination });
            res.status(200).json(Response);
            return;
          }
        }

        Response.message.push({ posts: 'Sorry. We couldn\'t fetch the next set of news for you.' });
        Response.status = 204;

        res.status(204).json(Response);
        return;
      } catch (e) {
        Response.status = 500;
        Response.message.push({
          server: {
            customMessage: `Sorry, an exception occurred and your request could not be completed. `,
            errorName: e.name,
            errorMessage: e.message
          }
        });
        res.status(500).json(Response);
        return;
      }
    }

    /****************************************************************/
    /******************    Post Statistics  *************************/
    /****************************************************************/
    async fetchPostsCount(req, res) {
      const Response = { status: 200, message: [], data: [] };
      const User = await super.validateHeaders(req, UserModel, _);

      if (!User) {
        Response.status = 401;
        Response.message.push({ user: 'A user with this token could not be found and verified.' });
        res.status(401).json(Response);
        return;
      }

      try {
        const Post = new PostModel();
        const postCount = await Post.fetchPostsCount(User._id.toString());

        if (postCount < 1) {
          Response.data.push({ contributions: 0 });
          res.status(204).json(Response);
          return;
        }

        Response.data.push({ contributions: postCount });
        res.status(200).json(Response);
        return;

      } catch (e) {
        Response.status = 500;
        Response.message.push({
          server: {
            customMessage: `Sorry, an exception occurred and your request could not be completed. `,
            errorName: e.name,
            errorMessage: e.message
          }
        });
        res.status(500).json(Response);
        return;
      }

    }

    async addPostInteraction(req, res) {
      const Response = { status: 200, message: [], data: [] };
      let user = await super.validateHeaders(req, UserModel, _);

      let { type, postId, comment } = req.body;
      let userId = user._id.toString();

      if (!user) {
        Response.status = 401;
        Response.message.push({ user: 'A user with this token could not be found and verified.' });
        res.status(401).json(Response);
        return;
      }

      try {
        const Post = new PostModel();
        const User = new UserModel();
        const PostActivity = new PostActivityModel();
        // check if the post id or user id is stil valid...
        let checkPostId = await Post.findPostByID(postId);
        let checkUser = await User.findUserById(userId);

        if (!checkPostId) {
          Response.status = 401;
          Response.message.push({ post: 'Sorry, an unexpected error occurred and your operation could not be completed.' });
          res.status(401).json(Response);
          return;
        }

        if (!checkUser) {
          Response.status = 401;
          Response.message.push({ user: 'Sorry, an unexpected error occurred and your operation could not be completed. Please, try again later.' });
          res.status(401).json(Response);
          return;
        }

        // create a new post activity...
        let payload = {};
        let postLikes = {};

        switch (type) {
          case 'like':
            payload.postId = postId;
            payload.userId = userId;
            payload.type = 'like';
            payload.comment = null;

            postLikes._id = postId;
            postLikes.likes = 1;

            let newPostActivity = await PostActivity.addLikesViewsFavToPost(payload);
            let likes = await Post.updatePostLikes(postLikes);

            if (newPostActivity && likes) {
              Response.status = 200;
              Response.data.push({ activity: newPostActivity, type: { likes } });
              res.status(201).json(Response);
              return;
            }

            Response.status = 400;
            Response.message.push({ error: 'Sorry, an unknow error occurred and your request could not be completed. Please, try again later.' });

            res.status(400).json(Response);
            return;
            break;
          case 'unlike':
            payload.postId = postId;
            payload.userId = userId;
            payload.type = 'like';
            payload.comment = null;

            postLikes._id = postId;
            postLikes.likes = -1;

            let postActivity = await PostActivity.deleteLikesViewsFavFromPost(payload);
            let unlike = await Post.updatePostLikes(postLikes);

            if (postActivity && unlike) {
              Response.status = 200;
              Response.data.push({ activity: postActivity, type: { unlike } });
              res.status(201).json(Response);
              return;
            }

            Response.status = 400;
            Response.message.push({ error: 'Sorry, an unknow error occurred and your request could not be completed. Please, try again later.' });

            res.status(400).json(Response);
            return;
            break;
          case 'favourite':
              payload.postId = postId;
              payload.userId = userId;
              payload.type = 'favourite';
              payload.comment = null;

              postLikes._id = postId;
              postLikes.favourites = 1;
              let favouriteActivity = await PostActivity.addLikesViewsFavToPost(payload);
              let favourites = await Post.updatePostFavourites(postLikes);

              if (favouriteActivity && favourites) {
                Response.status = 200;
                Response.data.push({ activity: favouriteActivity, type: { favourites } });
                res.status(201).json(Response);
                return;
              }

              Response.status = 400;
              Response.message.push({ error: 'Sorry, an unknown error occurred and your request could not be completed. Please, try again later.' });

              res.status(400).json(Response);
              return;
            break;
          case 'unfavourite':
                payload.postId = postId;
                payload.userId = userId;
                payload.type = 'favourite';
                payload.comment = null;

                postLikes._id = postId;
                postLikes.favourites = -1;

                let delFavouriteActivity = await PostActivity.deleteLikesViewsFavFromPost(payload);
                let unfavourites = await Post.updatePostFavourites(postLikes);

                if (delFavouriteActivity && unfavourites) {
                  Response.status = 200;
                  Response.data.push({ activity: delFavouriteActivity, type: { unfavourites } });
                  res.status(200).json(Response);
                  return;
                }

                Response.status = 400;
                Response.message.push({ error: 'Sorry, an unknown error occurred and your request could not be completed. Please, try again later.' });

                res.status(400).json(Response);
                return;
            break;
          case 'comment':
            payload.postId = postId;
            payload.userId = userId;
            payload.type = 'comment';
            payload.comment = comment;

            postLikes._id = postId;
            postLikes.comments = 1;

            let postComments = await PostActivity.addCommentsToPost(payload);
            let comments = await Post.updatePostComment(postLikes);

            if (postComments && comments) {
              let cUser = {};

              Response.status = 200;
              cUser.userId = user._id;
              cUser.avatar = user.avatar;
              cUser.lastName = user.lastName;
              cUser.firstName = user.firstName;
              postComments.user = cUser;
              Response.data.push({ activity: postComments, type: { comments } });
              res.status(201).json(Response);
              return;
            }

            Response.status = 400;
            Response.message.push({ error: 'Sorry, an unknown error occurred and your request could not be completed. Please, try again later.' });

            res.status(400).json(Response);
            return;
            break;
          case 'uncomment':
            payload.postId = postId;
            payload.userId = userId;
            payload.type = 'comment';
            payload.comment = comment;

            postLikes._id = postId;
            postLikes.comments = -1;

            let deletedComments = await PostActivity.deleteComments(payload);
            let updatedComments = await Post.updatePostComment(postLikes);

            if (deletedComments && updatedComments) {
              Response.status = 200;
              Response.data.push({ activity: deletedComments, type: { updatedComments } });
              res.status(201).json(Response);
              return;
            }

            Response.status = 400;
            Response.message.push({ error: 'Sorry, an unknow error occurred and your request could not be completed. Please, try again later.' });

            res.status(400).json(Response);
            return;
            break;
          case 'views':
            postLikes._id = postId;
            postLikes.views = 1;

            let views = await Post.updatePostViews(postLikes);

            if (views) {
              Response.status = 200;
              Response.data.push({ activity: null, type: { views } });
              res.status(201).json(Response);
              return;
            }

            Response.status = 400;
            Response.message.push({ error: 'Sorry, an unknown error occurred and your request could not be completed. Please, try again later.' });

            res.status(400).json(Response);
            return;
            break;
          default:
            Response.status = 400;
            Response.message.push({ error: 'Sorry, Your request could not be matched. Please, try again later with a valid request name.' });

            res.status(400).json(Response);
            return;
            break;
        }
      } catch (e) {
        (e);
        Response.status = 500;
        Response.message.push({
          server: {
            customMessage: `Sorry, an exception occurred and your request could not be completed. `,
            errorName: e.name,
            errorMessage: e.message
          }
        });
        res.status(500).json(Response);
        return;
      }
    }

    async fetchPostById(req, res) {
      const Response = { status: 200, message: [], data: [] };
      const User = await super.validateHeaders(req, UserModel, _);

      if (!User) {
        Response.status = 401;
        Response.message.push({ user: 'A user with this token could not be found and verified.' });
        res.status(401).json(Response);
        return;
      }

       try {
         const Post = new PostModel();
         let userModel = new UserModel();
         const PostActivity = new PostActivityModel();
         // verify if the post exists....
         let post = await Post.findPostByID(req.params.postId);
         if (!post) {
           Response.status = 204;
           Response.message.push({ post: 'Sorry, an unexpected error occurred and your post could not be fetched at the moment.' });

           res.status(204).json(Response);
           return;
         }

         // fetch all the comments and the user info associated with the post...
         let user = await userModel.findUserById(post.userId);
         let comments = '';
         let postLikes = '';
         let postComments = '';
         let postFavourite = '';

         postLikes = await PostActivity.findActivity({
           postId: post._id.toString(),
           userId: User._id.toString(),
           type: 'like'
         });
         postComments = await PostActivity.findActivity({
           postId: post._id.toString(),
           userId: User._id.toString(),
           type: 'comment',
         });
         postFavourite = await PostActivity.findActivity({
           postId: post._id.toString(),
           userId: User._id.toString(),
           type: 'favourite'
         });
         comments = await PostActivity.findAllComments({
           postId: post._id.toString()
         });

         post.timestamp = userModel.fetchTimestamp(post._id);
         post.user = {
           firstName: user.firstName,
           lastName: user.lastName,
           stageName: user.stageName,
           avatar: user.avatar
         };

         if (postLikes) {
           post.liked = true;
         } else {
           post.liked = false;
         }

         if (postComments) {
           post.comment = true;
         } else {
           post.comment = false;
         }

         if (postFavourite) {
           post.favourite = true;
         } else {
           post.favourite = false;
         }

         if (comments.length > 0) {
           let userDetails = {};
           let user = {};

           for (let i = 0; i < comments.length; i++) {
             userDetails = await userModel.findUserById(comments[i].userId);
             if (userDetails) {
               user.userId = userDetails._id;
               user.avatar = userDetails.avatar;
               user.lastName = userDetails.lastName;
               user.firstName = userDetails.firstName;
             } else {
               user.userId = '';
               user.avatar = '';
               user.lastName = '';
               user.firstName = '';
             }

             comments[i].user = user;
           }
           post.commentsList = comments;
         } else {
           post.commentsList = [];
         }
         Response.status = 200;
         Response.data.push(post);

         res.status(200).json(Response);
         return;
       } catch (e) {
         Response.status = 500;
         Response.message.push({
           server: {
             customMessage: `Sorry, an exception occurred and your request could not be completed. `,
             errorName: e.name,
             errorMessage: e.message
           }
         });
         res.status(500).json(Response);
         return;
       }
    }

    async deletePost(req, res) {
      const Response = { status: 200, message: [], data: [] };
      const User = await super.validateHeaders(req, UserModel, _);
      if (!User) {
        Response.status = 401;
        Response.message.push({ user: 'A user with this token could not be found and verified.' });
        res.status(401).json(Response);
        return;
      }

      try {
        const Post = new PostModel();
        //delete the post....
        let deletedPost = await Post.deletePost(req.params.postId);
        if (deletedPost) {
          Response.status = 200;
          Response.data.push(deletedPost)
          res.status(200).json(Response);

          return;
        }

        Response.status = 400;
        Response.message.push({ postId: 'Sorry, an unexpected error and your post could not be deleted.' });
        res.status(400).json(Response);
        return;
      } catch (e) {
        Response.status = 500;
        Response.message.push({
          server: {
            customMessage: `Sorry, an exception occurred and your request could not be completed. `,
            errorName: e.name,
            errorMessage: e.message
          }
        })
        res.status(500).json(Response);
        return;
      }
    }

    async fetchFavouritePost(req, res) {
      const Response = { status: 200, message: [], data: [] };
      const User = await super.validateHeaders(req, UserModel, _);

      let userModel = new UserModel();
      const Post = new PostModel();
      const PostActivity = new PostActivityModel();

      if (!User) {
        Response.status = 401;
        Response.message.push({ user: 'A user with this token could not be found and verified.' });
        res.status(401).json(Response);
        return;
      }

      // Fetch Posts Based On The Users Fav...
      const Posts = await PostActivity.findUserFavs({
        userId: User._id.toString()
      });

      let PostArray = [];

      if (Posts.length > 0) {
        // Fetch Posts Based On The Resuly Gotten....
        for (let index = 0; index < Posts.length; index++) {
         PostArray[index] = await Post.findPostByID(Posts[index].postId);
         PostArray[index]['user'] = await userModel.findUserById(Posts[index].userId);
        }

        // Since the length is > 0 we send back a valid list...
        Response.status = 200;
        Response.data.push(PostArray);
        res.status(200).json(Response);
        return;
      }

      Response.status = 204;
      res.status(204).json(Response);
      return;
    }
}

const Post = new PostController();
module.exports = Post;
