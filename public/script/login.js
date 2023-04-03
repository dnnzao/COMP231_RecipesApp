window.onload = function() {
    // Check if there is an error message
    if (errorMsg) {
        // Make sure that there is an element with class "error"
        var errorEl = document.querySelector('.error');
        // If there is an element with class "error", show it
        if (errorEl) {
            errorEl.style.display = 'block';
        }
    }
};