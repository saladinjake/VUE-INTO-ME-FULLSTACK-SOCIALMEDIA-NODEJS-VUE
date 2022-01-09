//require('dotenv').config(__dirname + '../.env');
import dotenv from "dotenv"
dotenv.config(__dirname + '../.env');
/****************************************************************/
/******* @author saladin jake (Victor juwa) ********************************/
/******* @desc Creates A Config Object For The Aws Store ********/
/****************************************************************/
const AwsConfig = {
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  imageRegion: process.env.AWS_IMAGE_REGION,
  imageBucket: process.env.AWS_IMAGE_BUCKET,
  audioBucket: process.env.AWS_AUDIO_BUCKET,
  audioRegion: process.env.AWS_AUDIO_REGION,
  videoRegion: process.env.AWS_VIDEO_REGION,
  videoBucket: process.env.AWS_VIDEO_BUCKET,
};
module.exports = AwsConfig;
