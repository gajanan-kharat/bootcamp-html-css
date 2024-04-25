 // JavaScript code to handle modal functionality

// Get the modal and other elements
/*const modal = document.getElementById("videoModal");
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
});*/



// Get the modal and other elements
/*const modal = document.getElementById("videoModal");
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
});*/


/*document.addEventListener("DOMContentLoaded", function() {
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
});
*/

/*document.addEventListener("DOMContentLoaded", function() {
    // Get the modal and other elements
    const modal = document.getElementById("videoModal");
    const modalVideo = document.getElementById("modalVideo");
    const closeModalBtn = document.getElementById("closeModalBtn");

    // Check if closeModalBtn exists before adding event listener
    if (closeModalBtn) {
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
    } else {
        console.error("Close modal button not found");
    }
});*/



/*document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("videoModal");
    const modalVideo = document.getElementById("modalVideo");
    const closeModalBtn = document.getElementById("closeModalBtn");

    if (closeModalBtn) {
        function openModal(videoSrc) {
            modalVideo.src = videoSrc;
            modal.style.display = "block";
        }

        function closeModal() {
            modal.style.display = "none";
            modalVideo.src = ""; // Reset video source to stop video playback
        }

        const videoItems = document.querySelectorAll(".item");
        videoItems.forEach(item => {
            item.addEventListener("click", () => {
                const videoSrc = item.querySelector("iframe").src;
                openModal(videoSrc);
            });
        });

        closeModalBtn.addEventListener("click", closeModal);

        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    } else {
        console.error("Close modal button not found");
    }
});*/



document.addEventListener("DOMContentLoaded", function() {
    const modal1 = document.getElementById("videoModal1");
    const modalVideo1 = document.getElementById("modalVideo1");
    const closeModalBtn1 = document.getElementById("closeModalBtn1");

    if (closeModalBtn1) {
        function openModal1(videoSrc1) {
            modalVideo1.src = videoSrc1;
            modal1.style.display = "block";
        }

        function closeModal1() {
            modal1.style.display = "none";
            modalVideo1.pause(); // Pause the video
            modalVideo1.currentTime = 0; // Reset video playback
        }

        const displayVideo = document.querySelector(".display-video");
        displayVideo.addEventListener("click", () => {
            const videoSrc1 = displayVideo.querySelector("source").src;
            openModal1(videoSrc1);
        });

        closeModalBtn1.addEventListener("click", closeModal1);

        modal1.addEventListener("click", (event) => {
            if (event.target === modal1) {
                closeModal1();
            }
        });
    } else {
        console.error("Close modal button not found");
    }
});



