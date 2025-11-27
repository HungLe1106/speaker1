// Shop bot for automated responses about audio equipment
// Supports local keyword responses and optional Gemini 2.0 Flash API call
const axios = require("axios");

// Create axios instance with timeout and retry configuration
const client = axios.create({
  timeout: parseInt(process.env.GEMINI_TIMEOUT, 10) || 30000,
  // Add proxy agent if needed
  proxy: false,
  // Increase max content length for larger responses
  maxContentLength: 50 * 1024 * 1024,
  // Enable keep-alive
  keepAlive: true,
  keepAliveMsecs: 1000,
});

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_API_URL =
  process.env.GEMINI_API_URL ||
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const DEBUG = process.env.DEBUG || false;

const keywords = {
  price: ["giá", "bao nhiêu", "giá cả", "chi phí", "đắt không"],
  speakers: ["loa", "bluetooth", "jbl", "sony", "bose"],
  headphones: ["tai nghe", "airpods", "chống ồn", "không dây"],
  homeAudio: ["dàn âm thanh", "soundbar", "âm thanh", "dolby", "home theater"],
  karaoke: ["karaoke", "micro", "hát", "partybox"],
  warranty: ["bảo hành", "sửa chữa", "lỗi", "đổi"],
  specs: ["thông số", "công suất", "bass", "treble", "watt", "bluetooth"],
  hello: ["hi", "hello", "chào", "xin chào", "alo"],
  time: ["giờ mở cửa", "thời gian", "mấy giờ", "đóng cửa"],
};

const responses = {
  price: [
    "Shop có nhiều mức giá:\n- Loa bluetooth: 2-12tr\n- Tai nghe: 5-8tr\n- Dàn âm thanh: 15-30tr\n- Loa karaoke: 8-20tr\nBạn quan tâm dòng nào ạ?",
    "Tùy theo nhu cầu, shop có sản phẩm từ 2tr đến 30tr. Bạn đang có budget khoảng bao nhiêu để mình tư vấn?",
  ],
  speakers: [
    "Shop có các dòng loa JBL, Sony, Bose với công suất từ 20W-160W. Bạn cần nghe nhạc ở đâu để mình tư vấn loại phù hợp?",
    "Loa bluetooth của shop đa dạng về kích thước và công suất, pin từ 12-18 giờ. Bạn thường nghe nhạc ở môi trường nào ạ?",
  ],
  headphones: [
    "Shop có các dòng tai nghe cao cấp của Sony, Bose với chống ồn tốt, pin 30h. Bạn hay dùng tai nghe để làm gì ạ?",
    "Tai nghe của shop đa dạng từ in-ear đến over-ear, có cả có dây và bluetooth. Bạn cần loại nào ạ?",
  ],
  homeAudio: [
    "Dàn âm thanh của shop từ 2.0 đến 7.1.2 kênh, hỗ trợ Dolby Atmos. Phòng bạn rộng bao nhiêu m2 để tư vấn công suất phù hợp?",
    "Shop có soundbar và dàn âm thanh từ Sony, Samsung, JBL. Bạn cần setup cho phòng khách hay phòng phim ạ?",
  ],
  karaoke: [
    "Loa karaoke shop có công suất lớn 200-500W, tặng kèm 2 micro không dây, giá từ 8-20tr. Bạn cần để hát ở đâu ạ?",
    "Shop có combo loa karaoke + micro không dây, có app kết nối điện thoại. Bạn muốn xem demo không ạ?",
  ],
  warranty: [
    "Tất cả sản phẩm bảo hành chính hãng 12 tháng, 1 đổi 1 trong 30 ngày đầu nếu lỗi. Có thể nâng bảo hành lên 24 tháng.",
    "Shop bảo hành chính hãng và hỗ trợ sau bán hàng tận tình. Sản phẩm lỗi được đổi mới trong 30 ngày đầu.",
  ],
  specs: [
    "Các sản phẩm đều có thông số chi tiết trên web. Bạn quan tâm đến model cụ thể nào để mình gửi thông số ạ?",
    "Shop có đầy đủ thông số kỹ thuật và demo thực tế. Bạn cần biết thông số gì cụ thể không ạ?",
  ],
  hello: [
    "Chào bạn! Shop chuyên các thiết bị âm thanh chính hãng. Bạn đang tìm sản phẩm nào ạ? 🎵",
    "Xin chào! Mình có thể tư vấn về loa, tai nghe, dàn âm thanh cho bạn. Bạn cần tư vấn loại nào ạ? 🎧",
  ],
  time: [
    "Shop mở cửa 9h-21h tất cả các ngày trong tuần. Có thể hẹn trước để demo âm thanh ạ! 🎵",
    "Thời gian mở cửa: 9h-21h (cả T7, CN). Bạn có thể ghé shop test nhạc bất cứ lúc nào ạ! 🎧",
  ],
  default: [
    "Shop có đa dạng thiết bị âm thanh, bạn đang quan tâm đến loại nào: loa, tai nghe, dàn âm thanh hay karaoke ạ? 🎵",
    "Bạn cần tư vấn thêm về thiết bị âm thanh nào không ạ? Shop có nhiều mẫu mới về! 🎧",
    "Bạn có thể cho mình biết nhu cầu sử dụng để tư vấn sản phẩm phù hợp không ạ? 🎵",
  ],
};

function detectIntent(message) {
  const text = String(message || "").toLowerCase();
  for (const [intent, patterns] of Object.entries(keywords)) {
    if (patterns.some((pattern) => text.includes(pattern))) {
      return intent;
    }
  }
  return "default";
}

function getRandomResponse(intent) {
  const possibleResponses = responses[intent] || responses.default;
  const randomIndex = Math.floor(Math.random() * possibleResponses.length);
  return possibleResponses[randomIndex];
}

module.exports = {
  // generateResponse: returns { text, intent }
  async generateResponse(message) {
    const intent = detectIntent(message);

    // If Gemini API key is provided, try using the Gemini Flash model for richer responses
    if (GEMINI_API_KEY) {
      try {
        // Build a brief prompt instructing Gemini to answer as a Vietnamese audio equipment shop assistant
        const prompt = `You are a friendly Vietnamese shop assistant specializing in audio equipment (loa, tai nghe, dàn âm thanh, karaoke). 
Reply within 10 seconds to the customer message: "${String(
          message || ""
        ).replace(/\n/g, " ")}". 
Reply CONCISELY in Vietnamese (50-100 chars) with recommendations or questions to clarify customer needs.
Detected intent: ${intent}
Rules:
- Must respond in Vietnamese
- Keep responses brief (<100 chars)
- Focus on specific product recommendations
- Include product details (price, specs) when relevant`;

        if (DEBUG)
          console.log("Preparing Gemini request for message:", message);

        if (DEBUG) console.log("Sending request to Gemini API...");

        const doGenerate = async (modelUrl) => {
          const r = await client.post(
            modelUrl,
            {
              contents: [
                {
                  parts: [
                    {
                      text: prompt,
                    },
                  ],
                },
              ],
              generationConfig: {
                maxOutputTokens: 128,
                temperature: 0.1,
                topP: 1,
                topK: 32,
              },
            },
            {
              headers: { "Content-Type": "application/json" },
              params: { key: GEMINI_API_KEY },
              validateStatus: (status) => status < 500,
            }
          );
          return r;
        };

        // First attempt with configured URL
        let resp = await doGenerate(GEMINI_API_URL);

        // If model not found, attempt to discover a usable model and retry once
        if (resp?.data?.error?.status === "NOT_FOUND" || resp?.status === 404) {
          if (DEBUG)
            console.warn(
              "Configured Gemini model not found, attempting discovery..."
            );
          try {
            const listResp = await client.get(
              process.env.GEMINI_API_URL ||
                "https://generativelanguage.googleapis.com/v1beta/models",
              {
                params: { key: GEMINI_API_KEY },
                validateStatus: (s) => s < 500,
              }
            );
            if (DEBUG) console.log("ListModels response:", listResp.data);

            const models = listResp.data?.models || [];
            // Prefer flash models, then any model with 'gemini' in its name
            const preferred =
              models.find((m) => /flash/i.test(m?.name)) ||
              models.find((m) => /gemini/i.test(m?.name)) ||
              models[0];

            if (preferred && preferred.name) {
              const modelUrl = `https://generativelanguage.googleapis.com/v1beta/models/${preferred.name}:generateContent`;
              if (DEBUG)
                console.log(
                  "Retrying generate with discovered model:",
                  preferred.name
                );
              resp = await doGenerate(modelUrl);
            }
          } catch (listErr) {
            if (DEBUG)
              console.error(
                "Model discovery failed:",
                listErr?.message || listErr
              );
          }
        }

        if (DEBUG) console.log("Gemini API response:", resp?.data);

        // Extract text from the Gemini response format
        const text =
          resp?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          resp?.data?.candidates?.[0]?.output ||
          resp?.data?.output?.[0]?.content?.[0]?.text ||
          resp?.data?.outputs?.[0]?.text ||
          resp?.data?.text ||
          String(resp?.data);

        return { text: String(text).trim(), intent };
      } catch (err) {
        console.error(
          "Gemini API error, falling back to local responses:",
          err.message || err
        );
        console.error("Gemini API error details:", {
          message: err.message,
          code: err.code,
          status: err.response?.status,
          data: err.response?.data,
          config: {
            url: err.config?.url,
            timeout: err.config?.timeout,
            headers: { ...err.config?.headers, Authorization: "[REDACTED]" },
          },
        });
        // fallthrough to local responses
      }
    }

    // Local fallback response
    return {
      text: getRandomResponse(intent),
      intent,
    };
  },
};
