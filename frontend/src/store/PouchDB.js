/*eslint-disable*/

import PouchDB from 'pouchdb-browser';
// const PouchDB = require('pouchdb-browser');

const PostActivitiesDB = new PouchDB('naijap_post_activities_db', {
  auto_compaction: true,
  adapter: 'idb',
  revs_limit: 999999999,
  deterministic_revs: false
});

export default PostActivitiesDB;
