

export const copy = (text) => {
  console.log("copying to clipboard: ", text)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
    } else {
      alert("Clipboard API not available");
    }
  }