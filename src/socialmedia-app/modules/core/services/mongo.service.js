import _ from 'lodash';


export class BaseApiService{
  /****************************************************************/
  /********* Removes all the _id associated  ***********************/
  /********* an array of documents  ********************************/
  /****************************************************************/
  removeDocumentID(docs, callback) {
    const docArray = docs.map((doc) => {
      return callback(doc, ['_id']);
    });
    return docArray;
  }
  /*****************************************************************/
  /*********   Generates a Random String    ************************/
  /****************************************************************/
  generateRandomString(length) {
     var result = '';
     var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
     var charactersLength = characters.length;
     for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }
     return result;
  }

  /******************************************************************/
  /*********   Validate the headers token    ***********************/
  /****************************************************************/
  async validateHeaders(req, UserModel, _) {
    const Payload = {
      token: req.headers['x-access-token'],
      client: _.toLower(req.headers['app-client'])
    };
    try {
      const User = new UserModel();
      let userDetails = await User.getUserByToken(Payload);

      if (userDetails) {
        return userDetails;
      }

      return false;
    } catch (e) {
      return false;
    }
  }

  /******************************************************************/
  /*********  Return the next element as a paginated cntent.   *****/
  /****************************************************************/
  async paginationMetaConetnt(records, Db, collection) {
    const Pagination = { nextPage: null, previousPage: null, hasNextPage: null, hasPrevPage: null };
    const Model = new Db();
    const LastDocument = await Model.fetchLastPost(collection);

    if (LastDocument.length > 0) {
      //!## Check if the last document matches any in the record....
      const Match = records.filter((data) => {
        if (data._id === LastDocument[0]._id) return true;
      });

      if (Match.length > 0) {
        Pagination.nextPage = null // data[data.length -1]._id;
        Pagination.previousPage = records[0]._id;

        Pagination.hasNextPage = true;
        Pagination.hasPrevPage = true;
        return Pagination;
      }

      Pagination.nextPage = records[records.length - 1]._id;
      Pagination.previousPage = records[0]._id;

      Pagination.hasNextPage = true;
      Pagination.hasPrevPage = true;
      return Pagination;
    }

    if (LastDocument.length < 1) {
      //!## Check if the last document matches any in the record....
      const Match = records.filter((data) => {
        if (data._id === LastDocument[0]._id) return true;
      });

      if (Match) {
        Pagination.nextPage = null // data[data.length -1]._id;
        Pagination.previousPage = records[0]._id;
        Pagination.hasNextPage = true;
        Pagination.hasPrevPage = true;
      }

      Pagination.nextPage = null;
      Pagination.previousPage = records[0]._id;
      Pagination.hasNextPage = true;
      Pagination.hasPrevPage = true;
      return Pagination;
    }

  }

}
