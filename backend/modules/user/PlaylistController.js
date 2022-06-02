const _ = require('lodash');
/****************************************************************/
/************   Custom Module Imports      *********************/
/****************************************************************/

const PostModel = require('../core/model/PostModel');
const UserModel = require('../core/model/UserModel');
const PostActivityModel = require('../core/model/PostActivityModel');
const PlaylistModel = require('../core/model/PlaylistModel');

const Controller = require('../core/controllers/Controller');

class PlaylistController extends Controller {
    constructor() { super(); }

    async createPlaylist(req, res) {
      const Response = { status: 200, message: [], data: [] };
      const { playlistName } = req.body;

      try {
        const User = await super.validateHeaders(req, UserModel, _);
        if (!User) {
          Response.status = 401;
          Response.message.push({ user: 'A user with this token could not be found and verified.' });
          res.status(401).json(Response);
          return;
        }

        // Since The User Exists, We create The Playlist...
        const Playlist = new PlaylistModel();
        const ifExist = await Playlist.checkPlaylistByName(playlistName);
        if (ifExist) {
          Response.status = 409;
          Response.message.push({ name: 'Sorry, A Playlist with this name already exist.' });
          res.status(409).json(Response);
          return;
        }

        // Create The Playlist...
        let createdPlaylist = await Playlist.create(playlistName, User._id);
        if (createdPlaylist) {
          Response.status = 201;
          Response.message.push({ playlist: 'Playlist Created.' });
          Response.data.push(createdPlaylist);

          res.status(201).json(Response);
          return;
        }

        // Send Back An Error Response....
        Response.status = 400;
        Response.message.push({ playlist: 'Failed To Create The Playlist.' });

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

    async addMediaToPlaylist(req, res) {
      const Response = { status: 200, message: [], data: [] };
      let mediaId = req.params.mediaId;
      let playlistId = req.params.playlistId;

      try {
        const User = await super.validateHeaders(req, UserModel, _);
        if (!User) {
          Response.status = 401;
          Response.message.push({ user: 'A user with this token could not be found and verified.' });
          res.status(401).json(Response);
          return;
        }

        const Playlist = new PlaylistModel();
        const playlist = await Playlist.checkPlaylistById(playlistId);
        if (!playlist) {
          Response.status = 404;
          Response.message.push({ playlist: 'Sorry, A Playlist With This ID Could Not Be Found.' });
          res.status(404).json(Response);
          return;
        }

        // Check If The Video Exists In The Playlist....
        if (playlist.media.length > 0) {
          const mediaExist = playlist.media.indexOf(mediaId);
          if (mediaExist >= 0) {
            Response.status = 409;
            Response.message.push({ playlist: 'Sorry, This Media Is Already In Your Playlist.' });

            res.status(409).json(Response);
            return;
          }

          // We can save the playlist....
          playlist.media.push(mediaId);
          // Update The Playlist...
          let updatedPlaylist = await Playlist.updatePlaylist({ id: playlistId, media: playlist.media });
          if (updatedPlaylist) {
            Response.status = 200;
            Response.message.push({ playlist: 'Playlist Updated Successfully...' });
            Response.data.push(updatedPlaylist);

            res.status(200).json(Response);
            return;
          }

          Response.status = 400;
          Response.message.push({ playlist: 'Failed To Update Playlist.' });
          res.status(400).json(Response);
          return;
        }

        // Update The Playlist....
        let updatedPlaylist = await Playlist.updatePlaylist({ id: playlistId, media: [mediaId] });
        if (updatedPlaylist) {
          Response.status = 200;
          Response.message.push({ playlist: 'Playlist Updated Successfully.' });
          Response.data.push(updatedPlaylist);

          res.status(200).json(Response);
          return;
        }

        Response.status = 400;
        Response.message.push({ playlist: 'Failed To Update Playlist.' });
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

    async updatePlaylistName(req, res) {
      const Response = { status: 200, message: [], data: [] };
      let name= req.params.playlistName;
      let playlistId = req.params.playlistId;

      try {
        const User = await super.validateHeaders(req, UserModel, _);
        if (!User) {
          Response.status = 401;
          Response.message.push({ user: 'A user with this token could not be found and verified.' });
          res.status(401).json(Response);
          return;
        }

        const Playlist = new PlaylistModel();
        const playlist = await Playlist.checkPlaylistById(playlistId);
        if (!playlist) {
          Response.status = 404;
          Response.message.push({ playlist: 'Sorry, A Playlist With This ID Could Not Be Found.' });
          res.status(404).json(Response);
          return;
        }

        const ifExist = await Playlist.checkPlaylistByName(name);
        if (ifExist) {
          Response.status = 409;
          Response.message.push({ name: 'Sorry, A Playlist with this name already exist.' });
          res.status(409).json(Response);
          return;
        }

        // Update The Playlist name...
        const updatedPlaylist = await Playlist.updatePlaylistName({ id: playlistId, name });
        if (updatedPlaylist) {
          Response.status = 200;
          Response.message.push({ playlist: 'Playlist Updated Successfully.' });
          Response.data.push(updatedPlaylist);
          res.status(200).json(Response);
          return;
        }

        Response.status = 400;
        Response.message.push({ playlist: 'Failed To Update Playlist.' });
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

    async deleteMedia(req, res) {
      const Response = { status: 200, message: [], data: [] };
      let mediaId = req.params.mediaId;
      let playlistId = req.params.playlistId;

      try {
        const User = await super.validateHeaders(req, UserModel, _);
        if (!User) {
          Response.status = 401;
          Response.message.push({ user: 'A user with this token could not be found and verified.' });
          res.status(401).json(Response);
          return;
        }

        const Playlist = new PlaylistModel();
        const playlist = await Playlist.checkPlaylistById(playlistId);
        if (!playlist) {
          Response.status = 404;
          Response.message.push({ playlist: 'Sorry, A Playlist With This ID Could Not Be Found.' });
          res.status(404).json(Response);
          return;
        }

        // Check If The Video Exists In The Playlist....
        if (playlist.media.length > 0) {
          let mediaExist = playlist.media.indexOf(mediaId);
          if (mediaExist == -1) {
            Response.status = 400;
            Response.message.push({ playlist: 'Sorry, This Media Is Not In Your Playlist.' });

            res.status(400).json(Response);
            return;
          }

          // We can save the playlist....
          mediaExist = playlist.media.filter((el) => {
            if (el != mediaId) return true;
          });

          // Update The Playlist...
          let updatedPlaylist = await Playlist.updatePlaylist({ id: playlistId, media: mediaExist });
          if (updatedPlaylist) {
            Response.status = 200;
            Response.message.push({ playlist: 'Playlist Updated Successfully.' });
            Response.data.push(updatedPlaylist);

            res.status(200).json(Response);
            return;
          }

          Response.status = 400;
          Response.message.push({ playlist: 'Failed To Update Playlist.' });
          res.status(400).json(Response);
          return;
        }

        // Send Back An Error Response....
        Response.status = 400;
        Response.message.push({ playlist: 'Failed To Update Playlist.' });
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

    async deletePlaylist(req, res) {
      const Response = { status: 200, message: [], data: [] };
      let playlistId = req.params.playlistId;

      try {
        const User = await super.validateHeaders(req, UserModel, _);
        if (!User) {
          Response.status = 401;
          Response.message.push({ user: 'A user with this token could not be found and verified.' });
          res.status(401).json(Response);
          return;
        }

        const Playlist = new PlaylistModel();
        const playlist = await Playlist.checkPlaylistById(playlistId);
        if (!playlist) {
          Response.status = 404;
          Response.message.push({ playlist: 'Sorry, A Playlist With This ID Could Not Be Found.' });
          res.status(404).json(Response);
          return;
        }

        // Delete The Playlist...
        const deletedPlaylist = await Playlist.deletePlaylist(playlistId);
        if (deletedPlaylist) {
          Response.status = 200;
          Response.message.push({ playlist: 'Playlist Deleted Successfully.' });
          Response.data.push(deletedPlaylist);
          res.status(200).json(Response);
          return;
        }

        Response.status = 400;
        Response.message.push({ playlist: 'Failed To Delete Playlist.' });
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

    async fetchPlaylist(req, res) {
      const Response = { status: 200, message: [], data: [] };

      try {
        const User = await super.validateHeaders(req, UserModel, _);
        if (!User) {
          Response.status = 401;
          Response.message.push({ user: 'A user with this token could not be found and verified.' });
          res.status(401).json(Response);
          return;
        }

        const Playlist = new PlaylistModel();
        const playlist = await Playlist.fetchPlaylist(User._id);
        if (!playlist) {
          Response.status = 404;
          Response.message.push({ playlist: 'Sorry, But You Do Not Have Any Playlist.' });
          res.status(404).json(Response);
          return;
        }

        // Delete The Playlist...
        Response.status = 200;
        Response.message.push({ playlist: 'Playlist Fetched Successfully.' });
        Response.data.push(playlist);
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

    async fetchPlaylistMedia(req, res) {
      const Response = { status: 200, message: [], data: [] };
      let playlistId = req.params.playlistId;

      try {
        const User = await super.validateHeaders(req, UserModel, _);
        if (!User) {
          Response.status = 401;
          Response.message.push({ user: 'A user with this token could not be found and verified.' });
          res.status(401).json(Response);
          return;
        }

        const Playlist = new PlaylistModel();
        const playlist = await Playlist.checkPlaylistById(playlistId);
        if (!playlist) {
          Response.status = 404;
          Response.message.push({ playlist: 'Sorry, A Playlist With This ID Could Not Be Found.' });
          res.status(404).json(Response);
          return;
        }

        // Fetch All The Posts Under The Playlist...
        if (playlist.media.length > 0) {
          let Posts = [];
          const Post = new PostModel();
          let userModel = new UserModel();
          const PostActivity = new PostActivityModel();
          for (let i = 0; i < playlist.media.length; i++) {
            Posts[i] = await Post.findPostByID(playlist.media[i]);
          }

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
              comment: null
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
          res.status(200).json(Response);
          return;
        }

        Response.status = 400;
        Response.message.push({ post: 'Failed To Fetch Posts For This Playlist.' });
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
}

module.exports = new PlaylistController();
