function toggleResults() {
    const preview = document.getElementById('preview');
    const fullResults = document.getElementById('fullResults');
    const btn = document.getElementById('seeBtn');

    if (fullResults.style.maxHeight) {
    fullResults.style.maxHeight = null;
    fullResults.style.opacity = 0;
    preview.style.display = "block";
    btn.textContent = "Show more";
  } else {
    fullResults.style.maxHeight = fullResults.scrollHeight + "px";
    fullResults.style.opacity = 1;
    preview.style.display = "none";
    btn.textContent = "Show less";
  }
}