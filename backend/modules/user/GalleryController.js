const _ = require('lodash');
/****************************************************************/
/************   Custom Module Imports      *********************/
/****************************************************************/
const Controller = require('../Controller');
const UserModel = require('../../model/UserModel');
const PostModel = require('../../model/PostModel');
const GalleryModel = require('../../model/GalleryModel');

class GalleryController extends Controller {
  constructor() { super() }

  /****************************************************************/
  /******* Fetch All Galleries: Fetch Galleries  ******************/
  /****************************************************************/
  async fetchAllGalleries(req, res) {
    const Response = { status: 200, message: [], data: [] };
    const User = await super.validateHeaders(req, UserModel, _);
    if (!User) {
        Response.status = 401;
        Response.message.push({ user: 'A user with this token could not be found and verified.' });
        res.status(401).json(Response);
        return;
    }

    try {
      let user = null;
      const Post = new PostModel();
      let userModel = new UserModel();
      const Gallery = new GalleryModel();
      // Fetch all galleries based on the userid....
      if (req.params.userId != 0) {
        user = await userModel.findUserById(req.params.userId);
      } else {
        user = User;
      }

      let galleries = await Gallery.fetchGalleries(user._id.toString());
      let posts = await await Post.fetchUserPosts(user._id.toString());
      let payload = [];

      //!# Move the galleries to the payload........
      if (galleries.length > 0) {
        for (let i = 0; i < galleries.length; i++) {
          let data = {};
          data.banner = galleries[i].image;
          data.type = galleries[i].type;
          data.assetUrl = galleries[i].assetId;
          data.likes = 0;
          data.comments = 0;
          payload.unshift(data);
        }
      }

      //#! Move the posts.........
      if (posts.length > 0) {
        for (let i = 0; i < posts.length; i++) {
          let data = {};
          data.banner = posts[i].banner;
          data.type = posts[i].postType;
          data.assetUrl = posts[i]._id;
          data.likes = posts[i].likes;
          data.comments = posts[i].comments;
          payload.unshift(data);
        }
      }

      if (payload.length > 0) {
        Response.status = 200;
        Response.data.push(payload);

        res.status(200).json(Response);
        return;
      }

      if (payload.length < 1) {
        Response.status = 204;
        res.status(204).json(Response);
        return;
      }
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

const Gallery = new GalleryController();
module.exports = Gallery;
