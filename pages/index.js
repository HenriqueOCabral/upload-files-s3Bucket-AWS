import Dropzone from "react-dropzone-uploader";
import "react-dropzone-uploader/dist/styles.css";

const axios = require("axios");

export default function Home() {
   const uploadURL = process.env.LAMBDA_URL;
   const handleChangeStatus = ({ meta, remove }, status) => {
     console.log(status, meta);
   };

   const handleSubmit = async (files, allFiles) => {
     const f = files[0];
     const fileName = f.name;
     const API_ENDPOINT = `${uploadURL}?id=${fileName}`;

     // * GET request: presigned URL
     const response = await axios({
       method: "GET",
       url: API_ENDPOINT,
     });

     //* PUT request: upload file to S3
     const result = await fetch(response.data.uploadURL, {
       method: "PUT",
       body: f.file,
       headers: {
         "Content-type": "*",
         "x-amz-acl": "public-read",
         ACL: "public-read",
       },
     });
     allFiles.forEach((f) => f.remove());
   };

   return (
     <>
       <Dropzone
         onChangeStatus={handleChangeStatus}
         onSubmit={handleSubmit}
         accept="*"
         inputContent={(files, extra) =>
           extra.reject ? "What hell you're trying to add here?!" : "Add a File!"
         }
         styles={{
           submitButton: {
             background: '#1CA0FD',
           },
           inputLabelWithFiles: {
             color: "#000000",
           },
           dropzone: {
             overflow: "hidden",
             backgroundColor: "#888888",
             border: "1px solid #1CA0FD",
           },
           dropzoneActive: {
             overflow: "hidden",
             backgroundColor: "#888888",
             border: "1px solid #1CA0FD",
           },
           dropzoneReject: {
             overflow: "hidden",
             borderColor: "red",
             backgroundColor: "#DAA",
           },
           inputLabel: (files, extra) =>
             extra.reject ? { color: "red" } : { color: "#3c3c3c" },
         }}
       />
     </>
   );
}
