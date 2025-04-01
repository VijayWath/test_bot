
import axios from "axios";

async function sendFinalMessage(
  GRAPH_API_TOKEN,
  BUSINESS_PHONE_NUMBER_ID,
  recipient,
  documentId,
  documentFilename,
) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${BUSINESS_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: recipient,
        type: "template",
        template: {
          name: "pdf_text_link",
          language: {
            code: "en"
          },
          components: [
            {
              type: "header",
              parameters: [
                {
                  type: "document",
                  document: {
                    id: documentId,
                    filename: documentFilename || "kraya_document.pdf"
                  }
                }
              ]
            },
          ]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${GRAPH_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    console.log(`Template sent successfully to ${recipient}`, response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to send template message:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export { sendFinalMessage };