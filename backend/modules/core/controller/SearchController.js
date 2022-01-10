import _ from "lodash"

import Axios from "./Controller"
import Controller from "./Controller"
import PostModel from "../model/PostModel"
import UserModel from "../model/UserModel"

class Search extends Controller {
  async search(req, res) {
    //!## Fetch the posts based on the userid.... This will be used a relationship for other posts / users.
    const User = await super.validateHeaders(req, UserModel, _);
    const Response = { status: 200, message: [], data: [] };
    const Post = new PostModel();
    const userModel = new UserModel();
    const query = req.params.query;

    if (!User) {
      Response.status = 401;
      Response.message.push({ user: 'A user with this token could not be found and verified.' });
      res.status(401).json(Response);
      return;
    }

    try {
      const UserResults = await userModel.searchUser(query);
      const PostResults = await Post.searchPosts(query);

      const Search = { user: [], posts: [] };

      if (UserResults) {
        Search.users = UserResults;      
      }

      if (PostResults) {
        Search.posts = PostResults;
      }
      
      if (Search.users.length > 0 || Search.posts.length > 0) {
        Response.status = 200;
        Response.data.push(Search);

        res.status(200).json(Response);
        return;
      }

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

module.exports = new Search();