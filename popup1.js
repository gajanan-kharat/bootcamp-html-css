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
            modalVideo1.src = ""; // Reset video source to stop video playback
        } 

        const videoItems1 = document.querySelectorAll(".items");
        videoItems1.forEach(item1 => {
            item1.addEventListener("click", () => {
                const videoSrc1 = item1.querySelector("iframe").src;
                openModal1(videoSrc1);
            });
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

 
/*document.addEventListener("DOMContentLoaded", function() {
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
            modalVideo1.src = ""; // Reset video source to stop video playback
        }

        const videoItems1 = document.querySelectorAll(".items");
        videoItems1.forEach(item1 => {
            item1.addEventListener("click", (event) => {
                const videoSrc1 = item1.querySelector("iframe").src;
                openModal1(videoSrc1);
            });
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
});*/



/*document.addEventListener("DOMContentLoaded", function() {
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
            modalVideo1.src = ""; // Reset video source to stop video playback
        }

        const videoItems1 = document.querySelectorAll(".items");
        videoItems1.forEach(item1 => {
            item1.addEventListener("click", (event) => {
                // Check if the click occurred on the iframe element itself
                if (event.target.tagName.toLowerCase() === 'iframe') {
                    const videoSrc1 = item1.querySelector("iframe").src;
                    openModal1(videoSrc1);
                }
            });
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
});*/


