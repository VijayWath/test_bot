import axios from "axios";


async function sendInitialTemplate(
  GRAPH_API_TOKEN,
  BUSINESS_PHONE_NUMBER_ID,
  recipient,
  imageId,
) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${BUSINESS_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: recipient,
        type: "template",
        template: {
          name: "image_text_ulr_url", // Replace with your actual template name
          language: {
            code: "en"
          },
          components: [
            {
              type: "header",
              parameters: [
                {
                  type: "image",
                  image: {
                    id: imageId
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
    
    console.log(`Template with image sent successfully to ${recipient}`, response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to send template message:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export { sendInitialTemplate };