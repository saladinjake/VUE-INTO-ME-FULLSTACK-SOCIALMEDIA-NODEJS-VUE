import { ObjectId } from 'mongodb';
import Model from './Model';

class PlaylistModel extends Model {
  constructor() { super(); }

  async create(playlistName, userId) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_playlist').insertOne({
      userId: new ObjectId(userId).toString(),
      name: playlistName,
      media: []
    }).then((doc) => {
      return doc.ops[0];
    });
  }

  async checkPlaylistByName(name) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_playlist').findOne({ name }).then((doc) => {
      return doc;
    });
  }

  async checkPlaylistById(id) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_playlist').findOne({
      _id: new ObjectId(id)
    }).then((doc) => {
      return doc;
    });
  }

  async fetchPlaylist(userId) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_playlist').find({
      userId: new ObjectId(userId).toString()
    }).sort({ _id: -1 }).toArray().then((doc) => {
      return doc;
    });
  }

  async updatePlaylist(playlist) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_playlist').findOneAndUpdate({
      _id: new ObjectId(playlist.id),
    }, {
      $set: {
        media: playlist.media
      }
    }, { returnOriginal: false }).then((doc) => {
      return doc.value;
    });
  }

  async updatePlaylistName(playlist) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_playlist').findOneAndUpdate({
      _id: new ObjectId(playlist.id)
    }, {
      $set: {
        name: playlist.name
      }
    }, { returnOriginal: false }).then((doc) => {
      return doc.value;
    });
  }

  async deletePlaylist(playlistId) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_playlist').findOneAndDelete({
      _id: new ObjectId(playlistId)
    }).then((doc) => {
      return doc.value;
    });
  }
}

module.exports = PlaylistModel;
