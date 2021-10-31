const AWS = require("aws-sdk");
require("dotenv").config();
AWS.config.update({ region: process.env.REGION });
var s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  signatureVersion: "v4",
});
const URL_EXPIRATION_SECONDS = 600;

// Main Lambda entry point
exports.handler = async (event) => {
  return await getUploadURL(event);
};

const getUploadURL = async function (event) {
  // Get signed URL from S3
  const s3Params = {
    Bucket: "bucket_name",
    Key: event.queryStringParameters.id,
    Expires: URL_EXPIRATION_SECONDS,
    ContentType: "*",
    // aws reads mp4 as octet stream
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    resolve({
      statusCode: 200,
      isBase64Encoded: false,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        uploadURL: s3.getSignedUrl("putObject", s3Params),
        Filename: event.queryStringParameters.id,
      }),
    });
  });
};

