import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import path from "path";

async function uploadMedia(GRAPH_API_TOKEN, BUSINESS_PHONE_NUMBER_ID, pdfPath) {
  const form = new FormData();
  form.append("file", fs.createReadStream(pdfPath));
  form.append("messaging_product", "whatsapp");

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${BUSINESS_PHONE_NUMBER_ID}/media`,
      form,
      {
        headers: {
          Authorization: `Bearer ${GRAPH_API_TOKEN}`,
          ...form.getHeaders(),
        },
      }
    );

    console.log("PDF uploaded successfully!");
    console.log("Media ID:", response.data.id);
    return response.data.id;
  } catch (error) {
    console.error(
      "Failed to upload PDF:",
      error.response?.data || error.message
    );
    throw error;
  }
}

const mediaPath = path.resolve("test.pdf");
const WEBHOOK_VERIFY_TOKEN = "testbot";
const GRAPH_API_TOKEN =
  "EAANwSyH8z34BO62L3MmcSASmZAuHrZBMW9ZCnEmfgs2ZCXI4FQCLBGzaUpLpCvM9g3DoZCP4B8ZCE6zMbRQdboBsZASks2lqioG1fvWDZCJrJXBXsSxIYc0tFin5xqe3LssCdPPadQHGnVIz7orHZBogMgQHkJmr51mIJprR0nhZAw7ycVUdmf1dTkjTVUFEUwsL92EtCZCuMZCZCBqk4u9e1VGmeKcFfQHa70ZBfSwvqG";
const BUSINESS_PHONE_NUMBER_ID = "515786791615689";
uploadMedia(GRAPH_API_TOKEN,BUSINESS_PHONE_NUMBER_ID,mediaPath)