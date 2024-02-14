/**
 * Displays feedback to the user.
 * @param {string} message The message to display.
 * @param {string} type The type of message ('success', 'error', 'info', etc.).
 */

export function showFeedback(message, type = 'info') {
    const feedbackElement = document.createElement('div');
    feedbackElement.className = `feedback feedback-${type}`;
    feedbackElement.innerText = message;

    document.body.appendChild(feedbackElement);
    console.log(`[${type.toUpperCase()}]: ${message}`);
}

export function clearFeedback() {
    document.querySelectorAll('.feedback').forEach(element => element.remove());
}