const postForm = document.getElementById('newPostForm');

const handlePostSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(postForm);
    const postData = {
        title: formData.get('title'),
        content: formData.get('content'),
        image: formData.get('image'),
    };
    try {
        await createPost(postData);
        await loadPosts();
    } catch(error) {
        console.error('Failed to create post:', error);
    }
};

postForm.addEventListener('submit', handlePostSubmit);