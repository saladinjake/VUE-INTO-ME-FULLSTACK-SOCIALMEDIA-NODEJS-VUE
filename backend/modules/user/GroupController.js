const _ = require('lodash');
/****************************************************************/
/************   Custom Module Imports      *********************/
/****************************************************************/
const Controller = require('../core/controllers/Controller');
const UserModel = require('../core/model/UserModel');
const PostModel = require('../core/model/PostModel');
const GroupModel = require('../core/model/GroupModel');

class GroupController extends Controller {
  constructor() {
    super();
  }

  async initGroup(req, res) {
    const Response = { status: 200, message: [], data: [] };
    try {
      const Group = new GroupModel();
      const groupInit = await Group.createGroup();

      if (groupInit) {
        Response.status = 201;
        Response.data.push(groupInit);

        res.status(201).json(Response);
        return;
      }

      Response.status = 400;
      Response.message.push({ init: 'An Unexpected Error Occurred And The Operation Could Not Be Completed.' });
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
      });
      res.status(500).json(Response);
      return;
    }
  }

  async fetchGroupDetails(req, res) {
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
      const Group = new GroupModel();
      let groupDetails = await Group.checkGroupById(req.params.groupId);
      let data = [];

      if (groupDetails) {
        let inGroup = await Group.checkGroupMembers({ groupId: req.params.groupId, id: User._id.toString() });

        // Count Users....
        groupDetails.users = await Group.groupUsersCount(req.params.groupId)
        groupDetails.users = groupDetails.users.length || 0;
        // Count Posts....
        groupDetails.posts = await Post.findGroupPosts(req.params.groupId);
        groupDetails.posts = groupDetails.posts.length || 0;

        if (inGroup) {
          groupDetails.member = true;
        } else {
          groupDetails.member = false;
        }

        Response.status = 200;
        Response.data.push(groupDetails);

        res.status(200).json(Response);
        return;
      }

      Response.status = 400;
      Response.message.push({ group: 'An Unknown Error Occurred And The Group Could Not Be Fetched!' });

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

  async createGroup (req, res) {
    const Response = { status: 200, message: [], data: [] };
    const User = await super.validateHeaders(req, UserModel, _);
    if (!User) {
        Response.status = 401;
        Response.message.push({ user: 'A user with this token could not be found and verified.' });
        res.status(401).json(Response);
        return;
    }

    try {
      const Group = new GroupModel();
      let {groupName, groupDescription} = req.body;

      // check if the group name exists...
      let groupNameExists = await Group.checkGroup(groupName);
      if (groupNameExists) {
        Response.status = 400;
        Response.message.push({ groupName: 'Sorry, A Group With This Name Already Exist.' });

        res.status(400).json(Response);
        return;
      }

      // Create a new group...
      const Payload = {
        groupName, groupDescription, groupAdmin: User._id.toString()
      }
      let newGroup = await Group.updateGroup(req.params.id, Payload);

      if (newGroup) {
        Response.status = 201;
        Response.data.push(newGroup);

        res.status(201).json(Response);
        return;
      }

      Response.status = 400;
      Response.message.push({ group: 'Sorry, An Unknown Error Occurred And Your Group Could Not Be Created!' })
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

  async updateGroupUser(req, res) {
    const Response = { status: 200, message: [], data: [] };
    const User = await super.validateHeaders(req, UserModel, _);
    if (!User) {
        Response.status = 401;
        Response.message.push({ user: 'A user with this token could not be found and verified.' });
        res.status(401).json(Response);
        return;
    }

    try {
      const Group = new GroupModel();
      let {groupName, groupDescription} = req.body;

      // check if the group name exists...
      let groupNameExists = await Group.checkGroup(groupName);
      if (groupNameExists) {
        Response.status = 400;
        Response.message.push({ groupName: 'Sorry, A Group With This Name Already Exist.' });

        res.status(400).json(Response);
        return;
      }

      // Create a new group...
      const Payload = {
        groupName, groupDescription, groupAdmin: User._id.toString()
      }
      let newGroup = await Group.updateGroup(req.params.id, Payload);

      if (newGroup) {
        Response.status = 200;
        Response.data.push(newGroup);

        res.status(200).json(Response);
        return;
      }

      Response.status = 400;
      Response.message.push({ group: 'Sorry, An Unknown Error Occurred And Your Group Could Not Be Updated!' })
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

  async createGroupAdmin (req, res) {
    const Response = { status: 200, message: [], data: [] };

    try {
      const Group = new GroupModel();
      let {groupName, groupDescription} = req.body;

      // check if the group name exists...
      let groupNameExists = await Group.checkGroup(groupName);
      if (groupNameExists) {
        Response.status = 400;
        Response.message.push({ groupName: 'Sorry, A Group With This Name Already Exist.' });

        res.status(400).json(Response);
        return;
      }

      // Create a new group...
      const Payload = {
        groupName, groupDescription, groupAdmin: ''
      }
      let newGroup = await Group.updateGroup(req.params.id, Payload);

      if (newGroup) {
        Response.status = 201;
        Response.data.push(newGroup);

        res.status(201).json(Response);
        return;
      }

      Response.status = 400;
      Response.message.push({ group: 'Sorry, An Unknown Error Occurred And Your Group Could Not Be Created!' })
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

  async addMembers(req, res) {
    const Response = { status: 200, message: [], data: [] };
    const User = await super.validateHeaders(req, UserModel, _);

    if (!User) {
        Response.status = 401;
        Response.message.push({ user: 'A user with this token could not be found and verified.' });
        res.status(401).json(Response);
        return;
    }
    try {
      const Group = new GroupModel();
      let groupId = req.params.groupId;
      // check if this user is already a member of that group...
      let checkMember = await Group.checkGroupMembers({ groupId: groupId, memberId: User._id.toString() });
      if (checkMember) {
        Response.status = 409;
        Response.message.push({ group: 'Sorry, You Are Already A Member Of This Group' });

        res.status(409).json(Response);
        return;
      }

      // add the user to the group...
      const Payload = {
        groupId: groupId,
        memberId: User._id.toString(),
        status: true
      }
      let newUser = await Group.createMembers(Payload);

      if (newUser) {
        Response.status = 201;
        Response.data.push(newUser);

        res.status(201).json(Response);
        return;
      }

      Response.status = 400;
      Response.message.push({ user: 'Sorry, An Unknown Error Occurred And You Could Not Be Added To Thos Group.' });
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

  async leaveGroup(req, res) {
    const Response = { status: 200, message: [], data: [] };
    const User = await super.validateHeaders(req, UserModel, _);

    if (!User) {
        Response.status = 401;
        Response.message.push({ user: 'A user with this token could not be found and verified.' });
        res.status(401).json(Response);
        return;
    }
    try {
      const Group = new GroupModel();
      let groupId = req.params.groupId;
      let exitGroup = await Group.leaveGroup({ groupId: groupId, id: User._id.toString() });

      if (exitGroup) {
        Response.status = 200;
        Response.data.push(exitGroup);

        res.status(200).json(Response);
        return;
      }

      Response.status = 400;
      Response.message.push({ user: 'Sorry, An Unknown Error Occurred And You Could Not Be Added To Thos Group.' });
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

  async fetchAllGroups(req, res) {
    const Response = { status: 200, message: [], data: [] };
    const User = await super.validateHeaders(req, UserModel, _);

    if (!User) {
        Response.status = 401;
        Response.message.push({ user: 'A user with this token could not be found and verified.' });
        res.status(401).json(Response);
        return;
    }

    try {
      const Group = new GroupModel();
      let allGroups = await Group.fetchAllGroups();

      // count total members in the group and total post...


      if (allGroups) {
        Response.status = 200;
        Response.data.push(allGroups);

        res.status(200).json(Response);
        return;
      }

      res.status(204).json({});
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

  async fetchUserGroups(req, res) {
    const Response = { status: 200, message: [], data: [] };
    const User = await super.validateHeaders(req, UserModel, _);

    if (!User) {
        Response.status = 401;
        Response.message.push({ user: 'A user with this token could not be found and verified.' });
        res.status(401).json(Response);
        return;
    }

    try {
      const Group = new GroupModel();
      let userGroups = await Group.fetchUserGroups(User._id.toString());

      if (userGroups) {
        let belongsTo = [];
        let tempGroup = '';
        let groupUsersCount = 0;
        let groupPostsCount = 0;
        for (let i = 0; i < userGroups.length; i++) {
          tempGroup = await Group.checkGroupById(userGroups[i].groupId);
          if (tempGroup) {
            // check how many users and also how many posts are in the group...
            groupUsersCount = await Group.groupUsersCount(userGroups[i].groupId);
            groupUsersCount = groupUsersCount.length || 0;

            // check how many posts....
            groupPostsCount = 0;

            tempGroup.users = groupUsersCount;
            tempGroup.posts = groupPostsCount;

            belongsTo.push(tempGroup);
          }
        }

        if (tempGroup.length > 0) {
          Response.status = 200;
          Response.data.push(userGroups);

          res.status(200).json(Response);
          return;
        }

        res.status(204).json({});
        return;
      }

      res.status(204).json({});
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

  async fetchUserCreatedGroups(req, res) {
    const Response = { status: 200, message: [], data: [] };
    const User = await super.validateHeaders(req, UserModel, _);

    if (!User) {
        Response.status = 401;
        Response.message.push({ user: 'A user with this token could not be found and verified.' });
        res.status(401).json(Response);
        return;
    }

    try {
      const Group = new GroupModel();
      let createdGroup = await Group.fetchUserCreatedGroups(User._id.toString());

      if (createdGroup) {
        Response.status = 200;
        for (let i = 0; i < createdGroup.length; i++) {
          createdGroup[0].users = await Group.groupUsersCount(createdGroup[0]._id.toString())
          createdGroup[0].users = createdGroup[0].users.length || 0;
          createdGroup[0].posts = 0;
        }
        Response.data.push(createdGroup);

        res.status(200).json(Response);
        return;
      }

      res.status(204).json({});
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

  async fetchGroupsNon(req, res) {
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
      const Group = new GroupModel();

      let allGroups = await Group.fetchAllGroups();
      let groups = [];
      let inGroup = '';

      if (allGroups) {
        // USE THE USER ID TO CHECK IF THE USER IS ALREADY A MEMBER....
        for (let i = 0; i < allGroups.length; i++) {
          inGroup = await Group.checkGroupMembers({ groupId: allGroups[i]._id, id: User._id.toString() });

          // Count Users....
          allGroups[i].users = await Group.groupUsersCount(allGroups[i]._id.toString())
          allGroups[i].users = allGroups[i].users.length || 0;

          // Count Posts....
          allGroups[i].posts = await Post.findGroupPosts(allGroups[i]._id.toString());
          allGroups[i].posts = allGroups[i].posts.length || 0;
          allGroups[i].humanTimestamp = allGroups[i]._id.getTimestamp();
          allGroups[i].admin = ''
          // Check Membership status...
          if (inGroup) {
            allGroups[i].member = true;
            groups.push(allGroups[i]);
          } else {
            allGroups[i].member = false;
            groups.push(allGroups[i]);
          }
        }

        Response.status = 200;
        Response.data.push(groups);

        res.status(200).json(Response);
        return;
      }

      res.status(204).json({});
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

  async fetchGroupsAdmin(req, res) {
    const Response = { status: 200, message: [], data: [] };

    try {
      const User = new UserModel();
      const Post = new PostModel();
      const Group = new GroupModel();

      let allGroups = await Group.fetchAllGroups();
      let groups = [];
      let inGroup = '';

      if (allGroups) {
        // USE THE USER ID TO CHECK IF THE USER IS ALREADY A MEMBER....
        for (let i = 0; i < allGroups.length; i++) {
          // Count Users....
          allGroups[i].users = await Group.groupUsersCount(allGroups[i]._id.toString())
          allGroups[i].users = allGroups[i].users.length || 0;

          // Count Posts....
          allGroups[i].posts = await Post.findGroupPosts(allGroups[i]._id.toString());
          allGroups[i].posts = allGroups[i].posts.length || 0;
          allGroups[i].humanTimestamp = allGroups[i]._id.getTimestamp();

          if (allGroups[i].groupAdmin !== '') {
            let admin = await User.findUserById(allGroups[i].groupAdmin);
            allGroups[i].admin = admin.email || '';
          } else {
            allGroups[i].admin = '';
          }


          groups.push(allGroups[i]);
        }

        Response.status = 200;
        Response.data.push(groups);

        res.status(200).json(Response);
        return;
      }

      res.status(204).json({});
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

  async deleteGroup(req, res) {
    const Group = new GroupModel();
    const GroupId = req.params.id;
    const Response = { status: 200, message: [], data: [] };

    try {
      // Delete The Group && It's Members....
      const User = await super.validateHeaders(req, UserModel, _);
      if (!User) {
        Response.status = 401;
        Response.message.push({ user: 'A user with this token could not be found and verified.' });
        res.status(401).json(Response);
        return;
      }

      // Delete The Group...
      await Group.deleteGroup(GroupId);
      await Group.deleteAllMembers({ groupId: GroupId });

      // Send Back A Response...
      Response.status = 200;
      Response.message.push({ message: 'The Selected Group Has Been Deleted Successfully.' });
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
      })
      res.status(500).json(Response);
      return;
    }
  }
}

module.exports = new GroupController();
