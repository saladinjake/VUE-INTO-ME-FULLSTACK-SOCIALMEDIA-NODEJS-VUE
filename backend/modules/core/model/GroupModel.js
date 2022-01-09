
import  { ObjectId } from 'mongodb';
import Model from './Model';

class GroupModel extends Model {
  constructor() { super(); }

  async createGroup() {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_groups').insertOne({
      _id: new ObjectId(),
      groupName: '',
      groupDescription: '',
      status: true
    }).then((doc) => {
      return doc.ops[0];
    });
  }

  async fetchUserCreatedGroups(id) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_groups').find({ groupAdmin: new ObjectId(id).toString() }).toArray().then((docs) => { return docs; });
  }

  async checkGroup(groupName) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_groups').findOne({ groupName: groupName })
    .then((doc) => {
      return doc;
    });
  }

  async checkGroupById(groupId) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_groups').findOne({
      _id: new ObjectId(groupId)
    }).then((doc) => { return doc });
  }

  async fetchAllGroups() {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_groups').find().toArray().then((docs) => {
      return docs;
    });
  }

  async fetchUserGroups(userId) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_groups_member').find({ memberId: userId }).toArray().then((docs) => {
      return docs;
    });
  }

  async updateGroup(id, Payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_groups').findOneAndUpdate({
      _id: new ObjectId(id)
    }, {
      $set: Payload
    }, { returnOriginal: false }).then((doc) => {
      return doc.value;
    });
  }

  async createMembers(Payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_groups_member').insertOne(Payload)
    .then((doc) => {
      return doc.ops[0];
    });
  }

  async checkGroupMembers(Payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_groups_member').findOne({ groupId: new ObjectId(Payload.groupId).toString(), memberId: Payload.id }).then((doc) => { return doc; });
  }

  async leaveGroup(Payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_groups_member').findOneAndDelete({ groupId: new ObjectId(Payload.groupId).toString(), memberId: Payload.id })
    .then((doc) => {
      return doc.value;
    });
  }

  async deleteGroup(id) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_groups').findOneAndDelete({ _id: new ObjectId(id) })
    .then((doc) => {
      return doc.value;
    });
  }

  async groupUsersCount(id) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_groups_member').find({ groupId: new ObjectId(id).toString() }).toArray().then((docs) => {
      return docs;
    });
  }

  async deleteAllMembers(Payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_groups_member').deleteMany({ groupId: new ObjectId(Payload.groupId).toString() })
    .then((doc) => {
      return true;
    });
  }
}

module.exports = GroupModel;
