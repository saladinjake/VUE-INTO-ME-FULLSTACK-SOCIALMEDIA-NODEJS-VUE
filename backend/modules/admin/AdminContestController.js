const _ = require('lodash');
const {ObjectId} = require('mongodb');
const Validator = require('validator');

const UserModel = require('../../model/UserModel');
const PostModel = require('../../model/PostModel');
const ContestModel = require('../../model/ContestModel');
/****************************************************************/
/************   Custom Module Imports      *********************/
/****************************************************************/
const Controller = require('../Controller');

class AdminContestController extends Controller {
  constructor() {
    super();
  }

  async createContest(req, res) {
    const Response = { status: 200, message: [], data: [] };
    let {contestTitle, contestDescription, contestStartDate, contestEndDate, contestFirstPrize, contestSecondPrize, contestThirdPrize, contestFourPrize, contestFivePrize} = req.body;
    try {
      const Payload = { status: true }

      // check if there is currently an active contest...
      let contestModel = new ContestModel();
      let existingContest = await contestModel.checkContest();

      if (existingContest) {
        if (existingContest.date.startDate == contestStartDate) {
          Response.status = 409;
          Response.message.push({ contest: 'Sorry, There Is Already A Contest Scheduled For This Day.' });

          res.status(409).json(Response);
          return;
        }
      }

      // since there is no existing contest, we can create a contest...
      Payload.title = contestTitle;
      Payload.description = contestDescription;
      Payload.date = {
        startDate: contestStartDate,
        endDate: contestEndDate
      };
      Payload.prizes = {
        firstPrize: contestFirstPrize,
        secondPrize: contestSecondPrize,
        thirdPrize: contestThirdPrize,
        fourthPrize: contestFourPrize,
        fifthPrize: contestFivePrize,
      };
      Payload.status = true;
      let newContest = await contestModel.createContest(Payload);

      if (newContest) {
        Response.status = 201;
        Response.data.push(newContest);

        res.status(201).json(Response);
        return;
      }

      Response.status = 400;
      Response.message.push({ contest: 'Sorry, An Unexpected Error Occurred And Your Contest Could Not Be Created.' });

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

  async markAsCompleted(req, res) {
    const Response = { status: 200, message: [], data: [] };
    try {
      let contestId = req.params.contestId;
      let contestModel = new ContestModel();

      let updatedContest = await contestModel.markContestAsCompleted(contestId);
      if (updatedContest) {
        // notify top 3 winners.........

        Response.status = 200;
        Response.data.push(updatedContest);

        res.status(200).json(Response);
        return;
      }

      Response.status = 400;
      Response.message.push({ contest: 'An Unexpected Error Occurred And Your Contest Could Not Be Updated.' });

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

  async fetchContests(req, res) {
    const Response = { status: 200, message: [], data: [] };
    try {
      let postModel = new PostModel();
      let contestModel = new ContestModel();
      let contests = await contestModel.fetchContests();

      if (contests) {
        for (let i = 0; i < contests.length; i++) {
          let posts = await postModel.fetchPostByContest(contests[i]._id);
          contests[i].posts = posts.length || 0;
        }

        Response.status = 200;
        Response.data.push(contests);

        res.status(200).json(Response);
        return;
      }

      res.status(204).json([]);
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

  async getContest(req, res) {
    const Response = { status: 200, message: [], data: [] };
    try {
      let postModel = new PostModel();
      let contestModel = new ContestModel();
      let contest = await contestModel.fetchOngoingContest();

      if (contest) {
        // fetch all users associated to this contest and also all posts...

        let currentDate = new Date();
        let contestStartDate = new Date(contest.date.startDate);
        let contestEndDate = new Date(contest.date.endDate);

        if (currentDate.getTime() >= contestStartDate.getTime() && currentDate.getTime() >= contestEndDate.getTime()) {
          await contestModel.markContestAsCompleted(contest._id);
          res.status(204).json([]);
          return;
        }

        if (currentDate.getTime() <= contestStartDate.getTime() && currentDate.getTime() <= contestEndDate.getTime()) {
          res.status(204).json([]);
          return;
        }

        let users = [];
        let posts = await postModel.fetchPostByContest(contest._id)
        let totalUsers = 0;
        let totalPosts = posts.length || 0;

        if (totalPosts > 0) {
          for (let i = 0; i < posts.length; i++) {
            users.push(posts[i].userId);
          }

          // users = [...new Set(users)];
          totalUsers = users.length;
        }

        Response.status = 200;
        Response.data.push({
          contest,
          totalUsers,
          totalPosts,
        });

        res.status(200).json(Response);
        return;
      }

      res.status(204).json([]);
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

  async checkOngoingContests(req, res) {
    const Response = { status: 200, message: [], data: [] };
    try {
      let contestModel = new ContestModel();
      let contest = await contestModel.checkContest();

      if (contest) {
        Response.status = 200;

        let currentDate = new Date();
        let contestStartDate = new Date(contest.date.startDate);
        let contestEndDate = new Date(contest.date.endDate);

        if (currentDate.getTime() >= contestStartDate && currentDate.getTime() >= contestEndDate.getTime()) {
          await contestModel.markContestAsCompleted(contest._id);
          Response.data.push({ status: false });
          res.status(200).json(Response);
          return;
        }

        if (currentDate.getTime() >= contestStartDate.getTime() && currentDate.getTime() <= contestEndDate.getTime()) {
          Response.data.push({ status: true });
          res.status(200).json(Response);
          return;
        }

        Response.status = 200;
        Response.data.push({ status: false });
        res.status(200).json(Response);
        return;

      }

      Response.status = 200;
      Response.data.push({ status: false });
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

  async fetchContestPosts(req, res) {
    const Response = { status: 200, message: [], data: [] };
    try {
      let userModel = new UserModel();
      let postModel = new PostModel();
      let contestModel = new ContestModel();

      let contest = await contestModel.fetchContestById(req.params.contestId);
      let posts = [];
      if (contest) {
        // fetch all posts under this contest and also fetch the top 3 users...
        posts = await postModel.fetchPostsViaContest(req.params.contestId);
        if (posts.length > 0) {
          for (let i = 0; i < posts.length; i++) {
            posts[i].user = await userModel.findUserById(posts[i].userId);
            posts[i].timestamp = new ObjectId(posts[i]._id).getTimestamp();
          }
          let topPosts = posts.map((el) => {
            el.totalInteractions = parseInt(el.likes) + parseInt(el.views) + parseInt(el.favourites) + parseInt(el.comments) + parseInt(el.shares);
            return el;
          });

          // sort out the top users based on their posts interactions...
          let topUsers = topPosts.sort((afterItem, beforeItem) => {
            if (parseInt(afterItem.totalInteractions) < parseInt(beforeItem.totalInteractions)) {
              return 1;
            }

            if (parseInt(afterItem.totalInteractions) > parseInt(beforeItem.totalInteractions)) {
              return -1;
            }

            return 0;
          });
          let userProfiles = [];
          // get the first ten top users....
          topUsers = topUsers.map((el) => {
            return el.userId;
          });
          for (let i = 0; i < topUsers.length; i++) {
            userProfiles.push(await userModel.findUserById(topUsers[i]));
          }

          // Prepare the response body....
          Response.status = 200;
          Response.data.push({
            posts,
            contest,
            topUsers: userProfiles
          });

          res.status(200).json(Response);
          return;
        }

        if (posts.length < 1) {
          // Prepare the response body....
          Response.status = 200;
          Response.data.push({
            posts: [],
            contest,
            topUsers: []
          });
          res.status(200).json(Response);
          return;
        }

        res.status(204).json([]);
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

  async fetchPreviousContest(req, res) {
    const Response = { status: 200, message: [], data: [] };
    try {
      let users = [];
      let posts = [];
      let totalUsers = [];
      let totalPosts = [];
      let postModel = new PostModel();
      let contestModel = new ContestModel();
      let contests = await contestModel.fetchCompletedContest();
      if (contests) {
        // fetch all users associated to this contest and also all posts...
        for (let i = 0; i < contests.length; i++) {
          posts = await postModel.fetchPostByContest(contests[i]._id)
          totalUsers = 0;
          totalPosts = posts.length || 0;

          if (totalPosts > 1) {
            for (let i = 0; i < posts.length; i++) {
              users.push(posts[i].userId);
            }
            contests[i].totalUsers = users.length;
            users = [];

            contests[i].totalPosts = totalPosts;
            // users = [...new Set(users)];
          }
        }

        Response.status = 200;
        Response.data.push({
          contests,
        });

        res.status(200).json(Response);
        return;
      }

      res.status(204).json([]);
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


module.exports = new AdminContestController();
