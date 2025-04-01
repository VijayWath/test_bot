import express from "express";
import { sendFinalMessage } from "./final_template.js";
import { sendInitialTemplate } from "./selection_template.js";

import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3005;
const WEBHOOK_VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;
const GRAPH_API_TOKEN = process.env.GRAPH_API_TOKEN;

const BUSINESS_PHONE_NUMBER_ID = process.env.BUSINESS_PHONE_NUMBER_ID;
const INITIAL_MEDIA_IMAGE = process.env.INITIAL_MEDIA_IMAGE;
const INITIAL_PDF = process.env.INITIAL_PDF;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    console.log("Webhook verified successfully!");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.get("/", (req, res) => {
  res.send(
    `<pre>Nothing to see here. Check out README.md to get started.</pre>`
  );
});

app.post("/submit", async (req, res) => {
  var recipient = req.body.contact;
  console.log(recipient);
  await sendFinalMessage(
    GRAPH_API_TOKEN,
    BUSINESS_PHONE_NUMBER_ID,
    recipient,
    INITIAL_PDF
  );
  res
    .send(`<pre>Nothing to see here. Check out README.md to get started.</pre>`)
    .status(201);
});

app.listen(PORT, async () => {
  console.log(`Server is listening on port: ${PORT}`);
});

app.post("/webhook", async (req, res) => {
  try {
    console.log("Webhook received:", JSON.stringify(req.body, null, 2));

    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    const to = changes.value.metadata.display_phone_number;
    console.log(to);

    var replyText = "";

    if (!message) {
      console.log("No message found in the webhook payload.");
      return res.sendStatus(200);
    }

    const from = message.from;

    const messageText =
      message.text?.body || message.interactive?.button_reply?.title;

    replyText = messageText;

    if (!replyText) {
      console.log("No text or button reply found in the message.");
      return res.sendStatus(200);
    }
    console.log(`Reply text received from ${from}: ${replyText}`);

    console.log(`Unrecognized reply text: "${replyText}"`);
    await sendInitialTemplate(
      GRAPH_API_TOKEN,
      BUSINESS_PHONE_NUMBER_ID,
      from,
      INITIAL_MEDIA_IMAGE
    );

    res.sendStatus(200);
  } catch (error) {
    console.error("Error handling the webhook:", error.message || error);
    res.sendStatus(500);
  }
});
