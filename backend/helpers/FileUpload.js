import _ from "lodash";
import Aws from "aws-sdk";
import {exec , spawn } from "child_process";
import Multer from "multer";
import MulterS3 from "multer-s3";
import  { ObjectId } from "mongodb";
import FfmpegCommand from "fluent-ffmpeg";
import AwsConfig from "../config/amazon";
import AppConfig from "../config/app";
import TokenHelper from "./TokenHelper"
import PostModel from '../modules/core/model/PostModel';
import UserModel from '../modules/core/model/UserModel';
import GroupModel from '../model/GroupModel';
import GalleryModel from '../modules/core/model/GalleryModel';
import AdvertModel from '../modules/core/model/AdvertModel';
/****************************************************************/
/******* @author saladin jake victor juwa ********************************/
/******* @desc  Modules. ****************************************/
/****************************************************************/

class FileUpload {
    constructor() {}

    loadAwsConfig = (mediaType) => {
            this.S3 = new Aws.S3({});

            // Image Configurations....
            let region = '';
            switch (mediaType) {
                case 'image':
                    region = AwsConfig.imageRegion;
                    break;
                case 'video':
                    region = AwsConfig.videoRegion;
                    break;
                default:
                    region = AwsConfig.audioRegion;
                    break;
            }

            // Aws Config...
            Aws.config.update({
                secretAccessKey: AwsConfig.secretAccessKey,
                accessKeyId: AwsConfig.accessKeyId,
                region: AwsConfig.imageRegion
            });

            return;
        }

    /****************************************************************/
    /******* Verifies the headers sent from the request   ***********/
    /****************************************************************/
    verifyHeaders = async(req, res) => {
        //!## User and token verification.......
        const Payload = {
            token: req.headers['app-x-token'],
            client: _.toLower(req.headers['app-client'])
        };
        const User = await TokenHelper.getUserIdFromToken(Payload);
        if (!User) {
            res.status(404).json({ status: 404, message: [{ user: 'Sorry, A user with this token could not be found and verified.' }], data: [] });
            return false;
        }

        return User;
    }

    /****************************************************************/
    /******* Uploads A New Picture To The Amazon S3 Bucket***********/
    /****************************************************************/
    pictureUpload = async(req, res) => {
        //!## Image Upload.........
        let User = await this.verifyHeaders(req, res);
        if (!User) {
            res.status(404).json({ status: 404, message: [{ user: 'Sorry, A user with this token could not be found and verified.' }], data: [] });
            return false;
        }

        // !## Collection and ID......
        const Collection = _.toLower(req.params.postType);
        const CollectionID = req.params.postId;

        this.loadAwsConfig('image');

        //!## Image Uploads..........
        const Upload = Multer({
            fileFilter: this.pictureFilter,
            storage: MulterS3({
                s3: this.S3,
                bucket: AwsConfig.imageBucket,
                acl: 'public-read',
                metadata: function(req, file, cb) {
                    cb(null, { fieldName: file.fieldname }); //file.fieldname
                },
                key: function(req, file, cb) {
                    cb(null, Date.now().toString())
                }
            })
        });
        const ImageLocation = Upload.single('image');

        //!## Image Aws Url........
        ImageLocation(req, res, async(err) => {
            const Post = new PostModel();
            const Group = new GroupModel();

            if (!err) {
                //!## Search the collection and update the image field...
                try {
                    switch (Collection) {
                        case 'post':
                            const PostDetails = await Post.findPostByID(CollectionID);

                            PostDetails.banner = req.file.location;
                            const UpdatedPost = await Post.updatePost(PostDetails);

                            res.status(200).json({ status: 200, postId: UpdatedPost._id, imageUrl: PostDetails.banner });
                            return;
                            break;
                        case 'group':
                            const GroupDetails = await Group.checkGroupById(CollectionID);

                            GroupDetails.banner = req.file.location;
                            const UpdatedGroup = await Group.updateGroup(CollectionID, GroupDetails);

                            res.status(200).json({ status: 200, groupId: GroupDetails._id.toString(), imageUrl: GroupDetails.banner });
                            return;
                            break;
                        case 'chat':
                            res.status(200).json({ status: 200, imageUrl: req.file.location });
                            return;
                            break;
                        default:
                            break;
                    }
                } catch (e) {
                    const Response = { data: [], message: [] };
                    if (Collection == 'post') {
                      // await Post.deletePost(CollectionID);
                    } else if (Collection == 'group') {
                      // await Group.deleteGroup(CollectionID);
                    }
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

            if (Collection == 'post') {
              // await Post.deletePost(CollectionID);
            } else if (Collection == 'group') {
              // await Group.deleteGroup(CollectionID);
            }
            res.status(400).json({ error: err.message });
            return;
        });
    }

    adminGroupUpload = async(req, res) => {
        // !## Collection and ID......
        const Collection = _.toLower(req.params.postType);
        const CollectionID = req.params.postId;

        this.loadAwsConfig('image');

        //!## Image Uploads..........
        const Upload = Multer({
            fileFilter: this.pictureFilter,
            storage: MulterS3({
                s3: this.S3,
                bucket: AwsConfig.imageBucket,
                acl: 'public-read',
                metadata: function(req, file, cb) {
                    cb(null, { fieldName: file.fieldname }); //file.fieldname
                },
                key: function(req, file, cb) {
                    cb(null, Date.now().toString())
                }
            })
        });
        const ImageLocation = Upload.single('image');

        //!## Image Aws Url........
        ImageLocation(req, res, async(err) => {
            const Post = new PostModel();
            const Group = new GroupModel();

            if (!err) {
                //!## Search the collection and update the image field...
                try {
                    switch (Collection) {
                        case 'post':
                            const PostDetails = await Post.findPostByID(CollectionID);

                            PostDetails.banner = req.file.location;
                            const UpdatedPost = await Post.updatePost(PostDetails);

                            res.status(200).json({ status: 200, postId: UpdatedPost._id, imageUrl: PostDetails.banner });
                            return;
                            break;
                        case 'group':
                            const GroupDetails = await Group.checkGroupById(CollectionID);

                            GroupDetails.banner = req.file.location;
                            const UpdatedGroup = await Group.updateGroup(CollectionID, GroupDetails);

                            res.status(200).json({ status: 200, groupId: GroupDetails._id.toString(), imageUrl: GroupDetails.banner });
                            return;
                            break;
                        default:

                            break;
                    }
                } catch (e) {
                    const Response = { data: [], message: [] };
                    if (Collection == 'post') {
                      await Post.deletePost(CollectionID);
                    } else if (Collection == 'group') {
                      await Group.deleteGroup(CollectionID);
                    }
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

            if (Collection == 'post') {
              await Post.deletePost(CollectionID);
            } else if (Collection == 'group') {
              await Group.deleteGroup(CollectionID);
            }
            res.status(400).json({ error: err.message });
            return;
        });
    }

    /****************************************************************/
    /******* Uploads A New Picture To The Amazon S3 Bucket***********/
    /****************************************************************/
    adminAdvertUpload = async(req, res) => {
        // !## AWS Config....
        this.loadAwsConfig('image');

        //!## Image Uploads..........
        const Upload = Multer({
            fileFilter: this.pictureFilter,
            storage: MulterS3({
                s3: this.S3,
                bucket: AwsConfig.imageBucket,
                acl: 'public-read',
                metadata: function(req, file, cb) {
                  cb(null, { fieldName: file.fieldname });
                },
                key: function(req, file, cb) {
                  cb(null, Date.now().toString())
                }
            })
        });
        const ImageLocation = Upload.single('image');
        const ID = req.params.id;
        //!## Image Aws Url........
        ImageLocation(req, res, async(err) => {
            const Advert = new AdvertModel();
            if (!err) {
                //!## Search the collection and update the image field...
                try {
                  const AdvertDetails = await Advert.updateAdvert(ID, { banner: req.file.location });

                  res.status(200).json({ status: 200, advertId: AdvertDetails._id, imageUrl: AdvertDetails.banner });
                  return;
                } catch (e) {
                  const Response = { data: [], message: [] };
                  await Advert.deleteAdvert(ID);
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

            await Advert.deleteAdvert(req.params.id);
            res.status(400).json({ error: err.message });
            return;
        });
    }

    /****************************************************************/
    /******* Uploads A New Video To The Amazon S3 Bucket ************/
    /****************************************************************/
    videoUpload = async(req, res, next) => {
        //!## Video Upload.........
        const User = await this.verifyHeaders(req, res);
        if (!User) {
            res.status(404).json({ status: 404, message: [{ user: 'Sorry, A user with this token could not be found and verified.' }], data: [] });
            return false;
        }

        // !## Collection and ID......
        const Collection = _.toLower(req.params.postType);
        const CollectionID = req.params.postId;

        this.loadAwsConfig('video');
        //!## Video Uploads..........

        const Upload = Multer({
            storage: MulterS3({
                fileFilter: this.videoFilter,
                s3: this.S3,
                bucket: AwsConfig.videoBucket,
                acl: 'public-read',
                metadata: function(req, file, cb) {
                    cb(null, { fieldName: file.fieldname }); //file.fieldname
                },
                key: function(req, file, cb) {
                    cb(null, Date.now().toString())
                }
            })
        });

        const VideoLocation = Upload.single('video');
        VideoLocation(req, res, async(err) => {
            const Post = new PostModel();
            if (!err) {
                //!## Search the collection and update the image field...
                try {
                    switch (Collection) {
                        case 'post':
                            const PostDetails = await Post.findPostByID(CollectionID);

                            PostDetails.video = req.file.location;
                            const UpdatedPost = await Post.updatePost(PostDetails);
                            next();
                            // res.status(200).json({ status: 200, postId: UpdatedPost._id, videoUrl: PostDetails.video });
                            return;
                            break;
                        case 'chat':
                            res.status(200).json({ status: 200, videoUrl: req.file.location });
                            return;
                            break;
                        default:

                            break;
                    }
                } catch (e) {
                    switch (Collection) {
                      case 'post':
                        const Response = { data: [], message: [] };
                        await Post.deletePost(CollectionID);
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
                        break;
                      case 'chat':
                        res.status(500).json({ error: e.message });
                        return;
                        break;
                      default:

                    }
                }
            }
            // await Post.deletePost(CollectionID);
            res.status(400).json({ error: err.message });
            return;
        });
    }

    /****************************************************************/
    /******* Uploads A New Video To The Amazon S3 Bucket ************/
    /****************************************************************/
    audioUpload = async(req, res) => {
        //!## Video Upload.........
        const User = await this.verifyHeaders(req, res);
        if (!User) {
            res.status(404).json({ status: 404, message: [{ user: 'Sorry, A user with this token could not be found and verified.' }], data: [] });
            return false;
        }

        // !## Collection and ID......
        const Collection = _.toLower(req.params.postType);
        const CollectionID = req.params.postId;

        this.loadAwsConfig('audio');
        //!## Audio Uploads..........
        const Upload = Multer({
            storage: MulterS3({
                fileFilter: this.audioFilter,
                s3: this.S3,
                bucket: AwsConfig.audioBucket,
                acl: 'public-read',
                metadata: function(req, file, cb) {
                    cb(null, { fieldName: file.fieldname }); //file.fieldname
                },
                key: function(req, file, cb) {
                    cb(null, Date.now().toString())
                }
            })
        });
        const AudioLocation = Upload.single('audio');

        AudioLocation(req, res, async(err) => {
            const Post = new PostModel();
            if (!err) {
                //!## Search the collection and update the image field...
                try {
                    switch (Collection) {
                        case 'post':
                            const PostDetails = await Post.findPostByID(CollectionID);

                            PostDetails.audio = req.file.location;
                            const UpdatedPost = await Post.updatePost(PostDetails);

                            res.status(200).json({ status: 200, postId: UpdatedPost._id, audioUrl: PostDetails.audio });
                            return;
                            break;
                        case 'chat':
                            res.status(200).json({ status: 200, audioUrl: req.file.location });
                            return;
                            break;
                        default:

                            break;
                    }
                } catch (e) {
                    const Response = { data: [], message: [] };
                    Response.status = 500;
                    Response.message.push({
                        server: {
                            customMessage: `Sorry, an exception occurred and your request could not be completed. `,
                            errorName: e.name,
                            errorMessage: e.message
                        }
                    });

                    await Post.deletePost(CollectionID);
                    res.status(500).json(Response);
                    return;
                }
            }

            await Post.deletePost(CollectionID);
            res.status(400).json({ error: err.message });
            return;
        });
    }

    /****************************************************************/
    /******* Uploads || Updates A Profile Picture Amazon S3 Bucket **/
    /****************************************************************/
    avatarUpload = async (req, res) => {
      //!## User Meta.........
      const User = await this.verifyHeaders(req, res);
      if (!User) {
          res.status(404).json({ status: 404, message: [{ user: 'Sorry, A user with this token could not be found and verified.' }], data: [] });
          return false;
      }

      //#! Load up the Models.........
      let userModel = new UserModel();
      let galleryModel = new GalleryModel();

      // #! Load up the aws config......
      this.loadAwsConfig('image');

      //#! Upload the image to AWS.........
      const Upload = Multer({
          fileFilter: this.pictureFilter,
          storage: MulterS3({
              s3: this.S3,
              bucket: AwsConfig.imageBucket,
              acl: 'public-read',
              metadata: function(req, file, cb) {
                  cb(null, { fieldName: file.fieldname }); //file.fieldname
              },
              key: function(req, file, cb) {
                  cb(null, Date.now().toString())
              }
          })
      });
      const ImageLocation = Upload.single('image');

      //#! Update the database...........
      //!## Image Aws Url........
      ImageLocation(req, res, async(err) => {
          if (!err) {
              //!## Search the collection and update the image field...
              try {
                const Response = { status: 200, message: [], data: [] }
                //#! Payloads.......
                let GalleryPayload = {
                  userId: User._id.toString(),
                  type: 'avatar',
                  image: req.file.location,
                  assetId: User._id.toString()  //This will act as a pointer for all posts that contains a media
                }
                User.avatar = req.file.location;

                //#! Db Operations.........
                let updatedUser = await userModel.updateUserAccount(User);
                let newGallery = await galleryModel.createGallery(GalleryPayload);

                //#! Return Response.........
                Response.status = 200;
                Response.data.push({ user: updatedUser, gallery: newGallery });

                res.status(200).json(Response);
                return;
              } catch (e) {
                  const Response = { data: [], message: [] };
                  Response.status = 500;
                  Response.message.push({
                      server: {
                          customMessage: `Sorry, an exception occurred and your image couldnot be uploaded. `,
                          errorName: e.name,
                          errorMessage: e.message
                      }
                  });

                  res.status(500).json(Response);
                  return;
              }
          }

          const Response = { message: [], data: [] };

          Response.status = 400;
          Response.message.push({
            server: {
              customMessage: `Sorry, an unknow exception occurred and your image could not be uploaded.`,
              errorName: err.name,
              errorMessage: err.message
            }
          });
          res.status(400).json(Response);
          return;
      });
    }

    /****************************************************************/
    /******* Uploads || Updates A Cover Picture Amazon S3 Bucket ****/
    /****************************************************************/
    bannerUpload = async (req, res) => {
      //!## User Meta.........
      const User = await this.verifyHeaders(req, res);
      if (!User) {
          res.status(404).json({ status: 404, message: [{ user: 'Sorry, A user with this token could not be found and verified.' }], data: [] });
          return false;
      }

      //#! Load up the Models.........
      let userModel = new UserModel();
      let galleryModel = new GalleryModel();

      // #! Load up the aws config......
      this.loadAwsConfig('image');

      //#! Upload the image to AWS.........
      const Upload = Multer({
          fileFilter: this.pictureFilter,
          storage: MulterS3({
              s3: this.S3,
              bucket: AwsConfig.imageBucket,
              acl: 'public-read',
              metadata: function(req, file, cb) {
                  cb(null, { fieldName: file.fieldname }); //file.fieldname
              },
              key: function(req, file, cb) {
                  cb(null, Date.now().toString())
              }
          })
      });
      const ImageLocation = Upload.single('image');

      //#! Update the database...........
      //!## Image Aws Url........
      ImageLocation(req, res, async(err) => {
          if (!err) {
              //!## Search the collection and update the image field...
              try {
                const Response = { status: 200, message: [], data: [] }
                //#! Payloads.......
                let GalleryPayload = {
                  userId: User._id.toString(),
                  type: 'cover',
                  image: req.file.location,
                  assetId: User._id.toString()  //This will act as a pointer for all posts that contains a media
                }
                User.cover = req.file.location;

                //#! Db Operations.........
                let updatedUser = await userModel.updateUserAccount(User);
                let newGallery = await galleryModel.createGallery(GalleryPayload);

                //#! Return Response.........
                Response.status = 200;
                Response.data.push({ user: updatedUser, gallery: newGallery });

                res.status(200).json(Response);
                return;
              } catch (e) {
                  const Response = { data: [], message: [] };
                  Response.status = 500;
                  Response.message.push({
                      server: {
                          customMessage: `Sorry, an exception occurred and your image couldnot be uploaded. `,
                          errorName: e.name,
                          errorMessage: e.message
                      }
                  });

                  res.status(500).json(Response);
                  return;
              }
          }

          const Response = { message: [], data: [] };

          Response.status = 400;
          Response.message.push({
            server: {
              customMessage: `Sorry, an unknow exception occurred and your image could not be uploaded.`,
              errorName: err.name,
              errorMessage: err.message
            }
          });
          res.status(400).json(Response);
          return;
      });
    }

    /****************************************************************/
    /*******  Picture Filter: This Filters A Picture    *************/
    /****************************************************************/
    pictureFilter = (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
            cb(null, true);
        } else {
            cb(new Error('Sorry, Only Jpeg, Png and Jpg files are allowed.'), false);
        }
    }

    /****************************************************************/
    /******* Video Filter: This Filters A Video  ********************/
    /****************************************************************/
    videoFilter = (req, file, cb) => {
        if (file.mimetype == 'video/3gpp' || file.mimetype == 'video/mp4' || file.mimetype == 'video/x-ms-wmv' || file.mimetype == 'application/x-mpegURL' || file.mimetype == 'video/MP2T') {
            cb(null, true);
        } else {
            cb(new Error('Sorry, Only 3gpp, Mp4, x-ms-wmv, and x-mpegURL files are allowed.'), false);
        }
        return;
    }

    /****************************************************************/
    /******* Auio Filter: This Filters An Audio  ********************/
    /****************************************************************/
    audioFilter = (req, file, cb) => {
        if (file.mimetype == 'audio/mp4' || file.mimetype == 'audio/mp3' || file.mimetype == 'audio/basic' || file.mimetype == 'audio/mpeg' || file.mimetype == 'audio/mpeg4-generic' || file.mimetype == 'audio/opus' || file.mimetype == 'audio/ogg') {
            cb(null, true);
        } else {
            cb(new Error('Sorry, Only, Mp4, Mp3, Basic, Mpeg, Mpeg4-generic, Opus, and Ogg file are allowed.'), false);
        }
    }

    /****************************************************************/
    /******* Video Snapshot: This Generates a snapshot from *********/
    /*************  an uploaded video file  *************************/
    /****************************************************************/
    videoSnapShot = (req, res, file) => {
      const snapShotName = new ObjectId().toString();
      exec(`ffmpeg -i "${req.file.location}" -ss 00:00:10 -vframes 1 -f image2 "${AppConfig.appConfig.videoSnapShotPath}${snapShotName}.jpg"`, async (error, stdout, stderr) => {
        if (error) {
          const Post = new PostModel();
          await Post.deletePost(req.params.postId);

          res.status(500).json({ status: 500, message: [{ video: "An unexpected error occured while trying to generate a snaphot for your uploaded video. Please, try again later." }], data: [] });
          return;
        }

        try {
          const Post = new PostModel();
          const PostDetails = await Post.findPostByID(req.params.postId);
          let imagePath = `${AppConfig.appConfig.appUrl}/img/${snapShotName}.jpg`;

          PostDetails.banner = imagePath;
          const UpdatedPost = await Post.updatePost(PostDetails);
          res.status(200).json({ status: 200, postId: UpdatedPost._id, videoUrl: PostDetails.video });
          return;
        } catch (e) {
          const Response = { message: [], data: [] };
          Response.status = 400;

          Response.message.push({
            server: {
              customMessage: `Sorry, an unknown exception occurred and your image could not be uploaded.`,
              errorName: err.name,
              errorMessage: err.message
            }
          });

          console.log(req.params.postId);
          const Post = new PostModel();
          await Post.deletePost(req.params.postId);

          res.status(500).json(Response);
          return;
        }
      });

    }
}

module.exports = new FileUpload();
