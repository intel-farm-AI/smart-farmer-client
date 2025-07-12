import { dataURLtoBlob } from "../utils/dataUrlToBlobs";

export async function predictDisease(preview, setLoading, setResult) {
  setLoading(true);
  setResult(null);
  try {
    const blob = dataURLtoBlob(preview);
    const formData = new FormData();
    formData.append("file", blob, "image.png");

    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      setResult(data);
    } else {
      alert("Gagal prediksi: " + data.error);
    }
  } catch (err) {
    alert("Terjadi kesalahan: " + err.message);
  } finally {
    setLoading(false);
  }
}
