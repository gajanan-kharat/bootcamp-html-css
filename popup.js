 // JavaScript code to handle modal functionality

// Get the modal and other elements
const modal = document.getElementById("videoModal");
const modalVideo = document.getElementById("modalVideo");
const closeModalBtn = document.getElementById("closeModalBtn");

// Function to open modal and play video
function openModal(videoSrc) {
    modalVideo.src = videoSrc;
    modal.style.display = "block";
}

// Function to close modal and stop video
function closeModal() {
    modal.style.display = "none";
    modalVideo.src = ""; // Reset video source to stop video playback
}

// Add click event listeners to each video item
const videoItems = document.querySelectorAll(".item");
videoItems.forEach(item => {
    item.addEventListener("click", () => {
        // Get the video source from the data attribute
        const videoSrc = item.dataset.videoSrc;
        
        // Open modal and play video
        openModal(videoSrc);
    });
});

// Add click event listener to the close button
closeModalBtn.addEventListener("click", closeModal);

// Add click event listener to the modal to close if clicking outside the modal content
modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeModal();
    }
});