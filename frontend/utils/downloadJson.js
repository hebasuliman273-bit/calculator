export function downloadJson(history) {
  const jsonData = JSON.stringify(history, null, 2);

  const blob = new Blob([jsonData], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "history.json";

  link.click();

  URL.revokeObjectURL(url);
}