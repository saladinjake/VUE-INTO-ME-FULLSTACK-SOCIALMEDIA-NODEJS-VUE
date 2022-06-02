const _ = require('lodash');
/****************************************************************/
/************   Custom Module Imports      *********************/
/****************************************************************/
const Controller = require('../core/controllers/Controller');
const UserModel = require('../core/model/UserModel');
const PostModel = require('../core/model/PostModel');
const ConnectionModel = require('../core/model/ConnectionModel');

class ConnectionsController extends Controller {
    constructor() { super() }

    /****************************************************************/
    /*************** @desc Fetch Connections Count ******************/
    /****************************************************************/
    async fetchConnectionsCount(req, res) {
        const Response = { status: 200, message: [], data: [] };
        const User = await super.validateHeaders(req, UserModel, _);
        if (!User) {
            Response.status = 401;
            Response.message.push({ user: 'A user with this token could not be found and verified.' });
            res.status(401).json(Response);
            return;
        }

        try {
            const Payload = { id: User._id }
            const Connection = new ConnectionModel();
            let connectionCount = await Connection.fetchConnections(Payload);
            if (connectionCount.length < 1) {
                Response.data.push({ connections: 0 });

                res.status(200).json(Response);
                return;
            }

            Response.data.push({ connections: connectionCount.length });
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

    /****************************************************************/
    /******* Fetch Connections Count: Fetch An Existing  ************/
    /****************************************************************/
    async fetchMyConnectionsCount(req, res) {
        const Response = { status: 200, message: [], data: [] };
        const User = await super.validateHeaders(req, UserModel, _);
        if (!User) {
            Response.status = 401;
            Response.message.push({ user: 'A user with this token could not be found and verified.' });
            res.status(401).json(Response);
            return;
        }

        try {
            const Payload = { id: User._id }
            const Connection = new ConnectionModel();
            const Fanbase = await Connection.fetchMyConnections(Payload);
            if (Fanbase.length < 0) {
                Response.data.push({ fanbase: 0 });
                res.status(200).json(Response);
                return;
            }

            Response.data.push({ fanbase: Fanbase.length });
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

    /****************************************************************/
    /****************** Make New Connections  ***********************/
    /****************************************************************/
    async makeNewConnections(req, res) {
        const Response = { status: 200, message: [], data: [] };
        const User = await super.validateHeaders(req, UserModel, _);
        const Follower = req.params.follower;

        if (!User) {
            Response.status = 401;
            Response.message.push({ user: 'A user with this token could not be found and verified.' });
            res.status(401).json(Response);
            return;
        }

        try {

            let checkFollower = new UserModel();
            let connection = new ConnectionModel();
            let checkSyntaxOne = {
                following: Follower,
                follower: User._id.toString(),
                status: false
            }

            let checkSyntaxTwo = {
                following: User._id.toString(),
                follower: Follower,
                status: false
            }

            let checkIfConnectionExist = await connection.checkConnection(checkSyntaxOne);
            let checkIfConnectionExistTwo = await connection.checkConnection(checkSyntaxTwo);

            if (checkIfConnectionExist || checkIfConnectionExistTwo) {
                Response.status = 400;
                Response.message.push({ user: 'Sorry, there is already a pending connection with this user.' });
                res.status(400).json(Response);
                return;
            }

            checkFollower = await checkFollower.findUserById(Follower);

            if (!checkFollower) {
                Response.status = 401;
                Response.message.push({ user: 'The user with this ID could not be found and verified.' });

                res.status(401).json(Response);
                return;
            }

            const Connection = new ConnectionModel();
            const Payload = {
                following: Follower,
                follower: User._id.toString(),
                status: false
            }

            let newConnection = await Connection.create(Payload);
            if (!newConnection) {
                Response.stataus = 400;
                Response.message.push({ user: 'An unexpected error occurred and your request could not be completed.' });
                res.status(400).json(Response);
                return;
            }

            Response.status = 200;
            Response.data.push(newConnection);
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

    /****************************************************************/
    /****************** Fetch Connections List  *********************/
    /****************************************************************/
    async fetchConnectionList(req, res) {
        const Response = { status: 200, message: [], data: [] };
        const User = await super.validateHeaders(req, UserModel, _);
        if (!User) {
            Response.status = 401;
            Response.message.push({ user: 'A user with this token could not be found and verified.' });
            res.status(401).json(Response);
            return;
        }

        try {
            const UserObject = new UserModel();
            const PostObject = new PostModel();
            const Connection = new ConnectionModel();
            const Users = await UserObject.fetchAllUsers();
            const Payload = {};
            let ConnectionList = [];
            // Loop the object and check if the current user is either following or being followed by the user...
            if (Users.length > 0) {
                for (let i = 0; i < Users.length; i++) {
                    let UsersDocId = UserObject.convertDocumentId(Users[i]._id);
                    let UserDocId = UserObject.convertDocumentId(User._id);
                    if (UsersDocId != UserDocId) {
                        Payload.following = UserDocId;
                        Payload.follower = UsersDocId;
                        let connectionOne = await Connection.checkConnection(Payload);

                        Payload.following = UsersDocId; //Users[i]._id;
                        Payload.follower = UserDocId;
                        let connectionTwo = await Connection.checkConnection(Payload);

                        if (!connectionTwo && !connectionOne) {
                            ConnectionList.push({
                                id: Users[i]._id,
                                name: Users[i].stageName,
                                avatar: Users[i].avatar || ''
                            });
                        }

                        //fetch each of the users fanbases and songs...
                        for (let i = 0; i < ConnectionList.length; i++) {
                            let fanbase = await Connection.fetchMyConnections({ id: ConnectionList[i].id });
                            let songs = await PostObject.findAudioPostById(ConnectionList[i].id);

                            if (fanbase) {
                                ConnectionList[i].fanbase = fanbase.length;
                            } else {
                                ConnectionList[i].fanbase = 0;
                            }

                            if (songs) {
                                ConnectionList[i].songs = songs;
                            } else {
                                ConnectionList[i].songs = 0;
                            }
                        }
                    }
                }

                Response.status = 200;
                Response.data = ConnectionList;
                res.status(200).json(Response);
                return;
            }

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
    /****************** Fetch Pending Fanbases  *********************/
    /****************************************************************/
    async fetchMyPendingFanbases(req, res) {
        const Response = { status: 200, message: [], data: [] };
        const User = await super.validateHeaders(req, UserModel, _);

        if (!User) {
            Response.status = 401;
            Response.message.push({ user: 'A user with this token could not be found and verified.' });
            res.status(401).json(Response);
            return;
        }

        try {
            const UserM = new UserModel();
            const Connection = new ConnectionModel();
            const Connections = await Connection.fetchMyPendingConnections(User._id);
            if (Connections.length > 0) {

                for (let i = 0; i < Connections.length; i++) {
                    let user = await UserM.findUserById(Connections[i].follower);
                    let fanbase = await Connection.fetchMyConnections({ id: Connections[i].follower });
                    Connections[i].timestamp = Connections[i]._id.getTimestamp();
                    Connections[i].user = {
                        stageName: user.stageName,
                        fanbase: fanbase.length || 0,
                        avatar: user.avatar
                    }
                }

                Response.status = 200;
                Response.data.push(Connections);

                Response.data.push({ metas: '' });
                res.status(200).json(Response);
                return;
            }

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
    /****************** Fetch Approved Fanbases  ********************/
    /****************************************************************/
    async fetchMyApprovedFanbases(req, res) {
      const Response = { status: 200, message: [], data: [] };
      const User = await super.validateHeaders(req, UserModel, _);

      if (!User) {
          Response.status = 401;
          Response.message.push({ user: 'A user with this token could not be found and verified.' });
          res.status(401).json(Response);
          return;
      }

      try {
        let userModel = new UserModel();
        let connectionModel = new ConnectionModel();

        // #! Fetch Connections........
        let approvedConnections = null;
        if (req.params.userId != 0) {
           approvedConnections = await connectionModel.fetchApprovedConnectionRequest(req.params.userId);
        } else {
          approvedConnections = await connectionModel.fetchApprovedConnectionRequest(User._id);
        }

        if (approvedConnections.length < 1) {
          Response.status = 204;
          Response.message.push({ connections: 'Sorry, but there are no connections to show. Try making some connections then try again.' });

          res.status(204).json(Response);
          return;
        }

        for (let i = 0; i < approvedConnections.length; i++) {
          let user = await userModel.findUserById(approvedConnections[i].follower);
          let fanbase = await connectionModel.fetchMyConnections({ id: user._id.toString() });
          approvedConnections[i].avatar = user.avatar;
          approvedConnections[i].userId = user._id.toString();
          approvedConnections[i].stageName = user.stageName;
          approvedConnections[i].fanbase = fanbase.length || 0;
        }

        Response.status = 200;
        Response.data.push(approvedConnections);
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

    /****************************************************************/
    /****************** Fetch Approved Connection Request  **********/
    /****************************************************************/
    async fetchMyApprovedConnectionRequest(req, res) {
      const Response = { status: 200, message: [], data: [] };
      const User = await super.validateHeaders(req, UserModel, _);

      if (!User) {
          Response.status = 401;
          Response.message.push({ user: 'A user with this token could not be found and verified.' });
          res.status(401).json(Response);
          return;
      }

      try {
        let userModel = new UserModel();
        let connectionModel = new ConnectionModel();

        // #! Fetch Connections........

        let approvedConnections = null;
        if (req.params.userId != 0) {
           approvedConnections = await connectionModel.fetchApprovedConnections(req.params.userId);
        } else {
          approvedConnections = await connectionModel.fetchApprovedConnections(User._id);
        }

        if (approvedConnections.length < 1) {
          Response.status = 204;
          Response.message.push({ connections: 'Sorry, but there are no connections to show. Try making some connections then try again.' });

          res.status(204).json(Response);
          return;
        }

        for (let i = 0; i < approvedConnections.length; i++) {
          let user = await userModel.findUserById(approvedConnections[i].following);
          let fanbase = await connectionModel.fetchMyConnections({ id: user._id.toString() });
          approvedConnections[i].avatar = user.avatar;
          approvedConnections[i].userId = user._id.toString();
          approvedConnections[i].stageName = user.stageName;
          approvedConnections[i].fanbase = fanbase.length || 0;
        }

        Response.status = 200;
        Response.data.push(approvedConnections);
        res.status(200).json(Response);
        return;
      } catch (e) {
        console.log(e);
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
    /****************** Fetch Connection By ID  ********************/
    /****************************************************************/
    async fetchConnectionById(req, res) {
        const Response = { status: 200, message: [], data: [] };
        const User = await super.validateHeaders(req, UserModel, _);

        if (!User) {
            Response.status = 401;
            Response.message.push({ user: 'A user with this token could not be found and verified.' });
            res.status(401).json(Response);
            return;
        }

        try {
            const User = new UserModel();
            const Connection = new ConnectionModel();
            let connection = await Connection.findConnection(req.params.connectionId);
            if (connection) {
                let user = await User.findUserById(connection.follower);
                let fanbase = await Connection.fetchMyConnections({ id: connection.follower });
                connection[i].timestamp = connection._id.getTimestamp();
                connection[i].user = {
                    stageName: user.stageName,
                    fanbase: fanbase.length || 0,
                    avatar: user.avatar
                }

                Response.status = 200;
                Response.data.push(connection);
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
            })
            res.status(500).json(Response);
            return;
        }
    }

    /****************************************************************/
    /****************** Approve Connection Request  *****************/
    /****************************************************************/
    async approveConnection(req, res) {
        const Response = { status: 200, message: [], data: [] };
        const User = await super.validateHeaders(req, UserModel, _);

        if (!User) {
            Response.status = 401;
            Response.message.push({ user: 'A user with this token could not be found and verified.' });
            res.status(401).json(Response);
            return;
        }

        try {
            const Connection = new ConnectionModel();
            const Payload = {
                id: req.params.connectionId,
                status: true
            }
            let approvedConnection = await Connection.updateConnection(Payload);
            if (approvedConnection) {
                Response.status = 200;
                Response.data.push(approvedConnection);

                res.status(200).json(Response);
                return;
            }

            Response.status = 400;
            Response.message.push({ connection: 'An unknown error occurred and the connection could not be approved.' });
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

    /****************************************************************/
    /****************** Decline Connection Request  *****************/
    /****************************************************************/
    async declineConnection(req, res) {
        const Response = { status: 200, message: [], data: [] };
        const User = await super.validateHeaders(req, UserModel, _);

        if (!User) {
            Response.status = 401;
            Response.message.push({ user: 'A user with this token could not be found and verified.' });
            res.status(401).json(Response);
            return;
        }

        try {
            const Connection = new ConnectionModel();
            const Payload = {
                id: req.params.id,
                status: true
            }
            let deletedConnection = await Connection.deleteConnection(Payload);
            if (deletedConnection) {
                Response.status = 200;
                Response.data.push(deletedConnection);

                res.status(200).json(Response);
                return;
            }

            Response.status = 400;
            Response.message.push({ connection: 'An unknown error occurred and the connection could not be declined.' });
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

const Connection = new ConnectionsController();
module.exports = Connection;
