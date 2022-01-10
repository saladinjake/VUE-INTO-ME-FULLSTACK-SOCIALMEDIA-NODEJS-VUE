const _ = require('lodash');
const Jwt = require('jsonwebtoken');

const Controller = require('../Controller');
const UserModel = require('../../model/UserModel');
const PostModel = require('../../model/PostModel');
const CategoryModel = require('../../model/CategoryModel');

class CategoryController extends Controller {
  constructor() { super() }

  async createForumCategories(req, res) {
    const Response = { status: 200, message: [], data: [] };
    const Category = new CategoryModel();

    let category = req.body;
    try {
      // check if the forum name already exists....
      let forum = await Category.fetchForumType(category.name);
      if (forum) {
        Response.status = 409
        Response.message.push({ forum: 'Sorry, A Category With This Name Already Exist.' });

        res.status(409).json(Response);
        return;
      }

      // create the forum...
      let Forum = await Category.createForum(category.name);
      if (Forum) {
        Forum.humanTime = Forum._id.getTimestamp();
        Response.status = 201;
        Response.data.push(Forum);

        res.status(201).json(Response);
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
      });
      res.status(500).json(Response);
      return;
    }
  }

  async createMediaCategories(req, res) {
    const Response = { status: 200, message: [], data: [] };
    const Category = new CategoryModel();

    let category = req.body;
    try {
      // check if the forum name already exists....
      let media = await Category.fetchMediaType(category.name);
      if (media) {
        Response.status = 409
        Response.message.push({ forum: 'Sorry, A Category With This Name Already Exist.' });

        res.status(409).json(Response);
        return;
      }

      // create the forum...
      let Media = await Category.createMediaTypes(category.name);
      if (Media) {
        Media.humanTime = Media._id.getTimestamp();
        Response.status = 201;
        Response.data.push(Media);

        res.status(201).json(Response);
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
      });
      res.status(500).json(Response);
      return;
    }
  }

  async createUserTypeCategories(req, res) {
    const Response = { status: 200, message: [], data: [] };
    const Category = new CategoryModel();

    let category = req.body;
    try {
      // check if the forum name already exists....
      let userType = await Category.fetchUserType(category.name);
      if (userType) {
        Response.status = 409
        Response.message.push({ forum: 'Sorry, A Category With This Name Already Exist.' });

        res.status(409).json(Response);
        return;
      }

      // create the forum...
      let UserType = await Category.createUserTypes(category.name);
      if (UserType) {
        UserType.humanTime = UserType._id.getTimestamp();
        Response.status = 201;
        Response.data.push(UserType);

        res.status(201).json(Response);
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
      });
      res.status(500).json(Response);
      return;
    }
  }

  async updateForums(req, res) {
    const Response = { status: 200, message: [], data: [] };
    const Category = new CategoryModel();

    let category = req.body;
    try {
      // check if the forum name already exists....
      let forum = await Category.fetchForumType(category.name);
      if (forum) {
        Response.status = 400
        Response.message.push({ forum: 'Sorry, A Category With This Name Already Exist.' });

        res.status(400).json(Response);
        return;
      }

      // create the forum...
      let Forum = await Category.updateForumCategory(category);
      if (Forum) {
        Forum.humanTime = Forum._id.getTimestamp();
        Response.status = 200;
        Response.data.push(Forum);

        res.status(200).json(Response);
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
      });
      res.status(500).json(Response);
      return;
    }
  }

  async updateMediaCategories(req, res) {
    const Response = { status: 200, message: [], data: [] };
    const Category = new CategoryModel();

    let category = req.body;
    try {
      // check if the forum name already exists....
      let media = await Category.fetchMediaType(category.name);
      if (media) {
        Response.status = 400
        Response.message.push({ forum: 'Sorry, A Category With This Name ALready Exist.' });

        res.status(400).json(Response);
        return;
      }

      // create the forum...
      let Media = await Category.updateMediaType(category);
      if (Media) {
        Media.humanTime = Media._id.getTimestamp();
        Response.status = 200;
        Response.data.push(media);

        res.status(200).json(Response);
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
      });
      res.status(500).json(Response);
      return;
    }
  }

  async updateUserTypeCategories(req, res) {
    const Response = { status: 200, message: [], data: [] };
    const Category = new CategoryModel();

    let category = req.body;
    try {
      // check if the forum name already exists....
      let userType = await Category.fetchUserType(category.name);
      if (userType) {
        Response.status = 400
        Response.message.push({ forum: 'Sorry, A Category With This Name Already Exist.' });

        res.status(400).json(Response);
        return;
      }

      // create the forum...
      let UserType = await Category.updateMediaType(category);
      if (UserType) {
        UserType.humanTime = UserType._id.getTimestamp();
        Response.status = 200;
        Response.data.push(userType);

        res.status(200).json(Response);
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
      });
      res.status(500).json(Response);
      return;
    }
  }

  async fetchCategories(req, res) {
    const Response = { status: 200, message: [], data: [] };
    const Category = new CategoryModel();
    let lists = [];

    try {
      switch(req.params.category) {
        case 'forums':
          lists = await Category.fetchAllForumTypes();
        break;
        case 'media':
          lists = await Category.fetchAllMediaTypes();
        break;
        case 'user-types':
          lists = await Category.fetchAllUserTypes();
        break;
        default:
          lists = [];
        break;
      }

      if (lists.length < 1) {
        Response.status = 204;

        res.status(204).json(Response);
        return;
      }

      for (let i = 0; i < lists.length; i++) {
        lists[i].humanTime = lists[i]._id.getTimestamp();
      }

      Response.status = 200;
      Response.data.push(lists);

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

  async deleteCategory(req, res) {
    const Response = { status: 200, message: [], data: [] };
    const Category = new CategoryModel();
    let category = '';
    try {
      switch(req.params.category) {
        case 'forums':
          category = await Category.deleteForumType(req.params.id);
        break;
        case 'media':
          category = await Category.deleteMediaType(req.params.id);
        break;
        case 'user-types':
          category = await Category.deleteUserType(req.params.id);
        break;
        default:
          category = '';
        break;
      }

      if (!category) {
        Response.status = 400;
        Response.message.push({ category: 'Sorry, An Unexpected Error Occurred And Your Category Could Not Be Deleted.' });

        res.status(400).json(Response);
        return;
      }


      Response.status = 200;
      Response.data.push(category);

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
}

module.exports = new CategoryController();
