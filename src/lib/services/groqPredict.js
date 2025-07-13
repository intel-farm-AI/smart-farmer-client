export async function predictPlantDiseaseWithGroq({ preview }) {
  const prompt = `Berikut ini adalah gambar daun. Tolong analisis apakah daun tersebut terkena penyakit atau tidak, dan jika ya, sebutkan jenis penyakitnya. ${preview}`;
  const apiUrl = import.meta.env.VITE_GROK_API_URL || "https://api.groq.com/openai/v1/chat/completions";
  const apiKey = import.meta.env.VITE_GROK_API_KEY;
  const apiModel = import.meta.env.VITE_GROK_API_MODEL || "meta-llama/llama-4-scout-17b-16e-instruct";
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: apiModel,
      messages: [
        { role: "user", content: prompt }
      ]
    })
  });
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "Tidak ada respons dari AI.";
}
