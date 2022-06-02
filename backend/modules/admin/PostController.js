const _ = require('lodash');
const {ObjectId} = require('mongodb');

/****************************************************************/
/************   Custom Module Imports      **********************/
/****************************************************************/
const Controller = require('../core/controllers/Controller');
const UserModel = require('../core/model/UserModel');
const PostModel = require('../core/model/PostModel');
const PostActivityModel = require('../core/model/PostActivityModel');

class PostController extends Controller {
  constructor() {
    super();
  }

  async fetchPosts(req, res) {
    //!## Fetch the posts based on the userid.... This will be used a relationship for other posts / users.
    const Response = { status: 200, message: [], data: [] };
    const NextPage = req.params.nextPage;

    const Post = new PostModel();
    const PostActivity = new PostActivityModel();

    let userModel = new UserModel();

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
              userId: user._id.toString(),
              type: 'like',
              comment: null
            });
            postComments = await PostActivity.findActivity({
              postId: Posts[i]._id.toString(),
              userId: user._id.toString(),
              type: 'comment',
            });
            postFavourite = await PostActivity.findActivity({
              postId: Posts[i]._id.toString(),
              userId: user._id.toString(),
              type: 'favourite',
              comment: null
            });

            Posts[i].timestamp = userModel.fetchTimestamp(Posts[i]._id);
            Posts[i].user = {
              firstName: user.firstName,
              lastName: user.lastName,
              stageName: user.stageName,
              avatar: user.avatar
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
              userId: user._id.toString(),
              type: 'like',
              comment: null
            });
            postComments = await PostActivity.findActivity({
              postId: Posts[i]._id.toString(),
              userId: user._id.toString(),
              type: 'comment',
            });
            postFavourite = await PostActivity.findActivity({
              postId: Posts[i]._id.toString(),
              userId: user._id.toString(),
              type: 'favourite',
              comment: null
            });

            Posts[i].timestamp = userModel.fetchTimestamp(Posts[i]._id);
            Posts[i].user = {
              firstName: user.firstName,
              lastName: user.lastName,
              stageName: user.stageName,
              avatar: user.avatar
            };
          }
          Response.status = 200;
          Response.data.push(Posts);

          Response.data.push({ posts: Pagination });
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

  async fetchContestPosts(req, res) {
    //!## Fetch the posts based on the userid.... This will be used a relationship for other posts / users.
    const Response = { status: 200, message: [], data: [] };
    const NextPage = req.params.nextPage;

    const Post = new PostModel();
    const PostActivity = new PostActivityModel();

    let userModel = new UserModel();

    try {
      if (NextPage == 0) {
        const Posts = await Post.fetchContestPosts(null);
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
              userId: user._id.toString(),
              type: 'like',
              comment: null
            });
            postComments = await PostActivity.findActivity({
              postId: Posts[i]._id.toString(),
              userId: user._id.toString(),
              type: 'comment',
            });
            postFavourite = await PostActivity.findActivity({
              postId: Posts[i]._id.toString(),
              userId: user._id.toString(),
              type: 'favourite',
              comment: null
            });

            Posts[i].timestamp = userModel.fetchTimestamp(Posts[i]._id);
            Posts[i].user = {
              firstName: user.firstName,
              lastName: user.lastName,
              stageName: user.stageName,
              avatar: user.avatar
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
        const Posts = await Post.fetchContestPosts(NextPage);
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
              userId: user._id.toString(),
              type: 'like',
              comment: null
            });
            postComments = await PostActivity.findActivity({
              postId: Posts[i]._id.toString(),
              userId: user._id.toString(),
              type: 'comment',
            });
            postFavourite = await PostActivity.findActivity({
              postId: Posts[i]._id.toString(),
              userId: user._id.toString(),
              type: 'favourite',
              comment: null
            });

            Posts[i].timestamp = userModel.fetchTimestamp(Posts[i]._id);
            Posts[i].user = {
              firstName: user.firstName,
              lastName: user.lastName,
              stageName: user.stageName,
              avatar: user.avatar
            };
          }
          Response.status = 200;
          Response.data.push(Posts);

          Response.data.push({ posts: Pagination });
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
}

module.exports = new PostController();
