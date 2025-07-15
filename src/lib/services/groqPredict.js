export async function predictPlantDiseaseWithGroq({ file }) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("http://localhost:8000/predict", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  return data;
}
