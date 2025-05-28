// const AWS = require('aws-sdk');

// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION
// });

// exports.uploadFile = (fileBuffer, fileName, mimeType) => {
//   const params = {
//     Bucket: process.env.AWS_S3_BUCKET,
//     Key: fileName,
//     Body: fileBuffer,
//     ContentType: mimeType
//   };
//   return s3.upload(params).promise();
// };

// exports.getSignedUrl = (key) => {
//   const params = {
//     Bucket: process.env.AWS_S3_BUCKET,
//     Key: key,
//     Expires: 300 // 5 minutes
//   };
//   return s3.getSignedUrl('getObject', params);
// };


const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

exports.uploadFile = async (fileBuffer, fileName, mimeType) => {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimeType,
  });

  await s3.send(command);
  return { key: fileName };
};

exports.getSignedUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
  });

  return getSignedUrl(s3, command, { expiresIn: 300 }); // 5 mins
};
