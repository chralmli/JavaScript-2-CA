document.getElementById('newPostButton').onclick = function() {
    document.getElementById('newPostModal').style.display = 'block';
};

document.getElementsByClassName('close')[0].onclick = function() {
    document.getElementById('newPostModal').style.display = 'none';
};

// Close the modal if the user clicks outside of it
window.onclick = function(event) {
    if (event.target == document.getElementById('newPostModal')) {
        document.getElementById('newPostModal').style.display = 'none';
    }
};