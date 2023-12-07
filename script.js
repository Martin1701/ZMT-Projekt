const carriageCount = 4 + 1
const scrollPerCarriage = 10

let ticking = false;

let scrollProgress = scrollPerCarriage
let scrollPaused = false;

let currentCarriage;
let contentVisible = false

carriageNames = ["Cesta z Bratislavy", "Cesta z Bratislavy", "Video", "Vznik myšlenky", "Sběr obsahu", "Technická realizace", "Cesta z Bratislavy"]

// Function to handle wheel events
function handleWheel(event) {
    if (scrollPaused) return
    const sections = document.querySelectorAll(".section");
    let scrollAmount = 0;

    // Calculate the scroll amount based on wheel delta
    if (event.deltaY > 8) {
        scrollAmount = 1;
    } else if (event.deltaY < -8) {
        scrollAmount = -1;
    }
    scrollProgress += scrollAmount;

    if (scrollProgress < 0) scrollProgress = 0
    else if (scrollProgress > scrollPerCarriage * (carriageCount + 1)) {
        scrollProgress = scrollPerCarriage * (carriageCount + 1)
    }

    // Update the UI or trigger animations based on scroll progress
    // if ((scrollProgress % scrollPerCarriage) == 0) {
    const progressBar = document.getElementById("progressBar")
    progressBar.style.width = ((scrollProgress - scrollPerCarriage) / (scrollPerCarriage * (carriageCount))) * 100 + "%"

    if (!ticking) {
        window.requestAnimationFrame(() => {
            if (moveTrain(Math.round(scrollProgress / scrollPerCarriage))) {
                scrollPaused = true
                setTimeout(() => {
                    scrollPaused = false
                }, 500)
            }
            // updateUI(scrollAmount);
            ticking = false;
        });
        ticking = true;
    }
    // }
}


// 0 -> hidden left
// 1 -> locomotive visible
// 2 -> car 1
// ...
// n -> car n
// n+1 -> hidden right
function moveTrain(n) {
    console.log(`current: ${currentCarriage}, n: ${n}`)
    if (currentCarriage == n) {
        if (n > 1) {
            contentControl(n - 2)
        }
        return false
    } else {
        contentControl(currentCarriage - 2, false)
        scrollProgress = n * scrollPerCarriage
    }
    if (n < 0) {
        n = 0
        return false
    } else if (n > carriageCount + 1) {
        return false
    }
    else if (n > carriageCount + 1) n = carriageCount + 1
    currentCarriage = n


    const heading = document.getElementById("heading")
    heading.classList.add("headingHidden")
    setTimeout(() => {
        heading.innerText = carriageNames[currentCarriage]
        heading.classList.remove("headingHidden")
    }, 500)


    const progressBar = document.getElementById("progressBar")
    progressBar.style.width = ((scrollProgress - scrollPerCarriage) / (scrollPerCarriage * (carriageCount))) * 100 + "%"


    const elementWidth = document.getElementById('train').offsetWidth;
    const documentWidth = document.body.offsetWidth;

    // Calculate the ratio
    let carriageOffset = Math.round(elementWidth / documentWidth * 100) / carriageCount


    // to center the carriage
    let carriageAdditionalOffset = Math.round((elementWidth / carriageCount - documentWidth) / documentWidth * 100) / 2

    if (n == carriageCount + 1) {
        carriageAdditionalOffset *= 2.1
    }
    if (n == 0) {
        carriageAdditionalOffset = 0
    }

    trainOffset = 100 - (n * carriageOffset) + carriageAdditionalOffset

    train.style.left = trainOffset + "%"
    return true // train moved
}


function contentControl(i, show = true) {
    const contents = document.getElementsByClassName("carriageContent")
    if (!contents[i]) return
    if (show) {
        contents[i].classList.remove("contentSmall")
        contents[i].classList.remove("contentHidden")
        contentVisible = true
    } else {
        contents[i].classList.add("contentSmall")
        setTimeout(() => { contents[i].classList.add("contentHidden") }, 500)
        contentVisible = false
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Attach the handleWheel function to the wheel event
    window.addEventListener("wheel", handleWheel);

    // Event listener for keydown to start incrementing
    this.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowRight' || event.key === 'Enter' || event.key === ' ') {
            // Start incrementing when key is pressed
            if (!contentVisible && currentCarriage > 1) {
                moveTrain(currentCarriage)
            } else {
                moveTrain(currentCarriage + 1)
            }
            // moveTrain(currentCarriage + 1)
        } else if (event.key === 'ArrowLeft') {
            if (!contentVisible && currentCarriage < carriageCount + 1) {
                moveTrain(currentCarriage)
            } else {
                moveTrain(currentCarriage - 1)
            }
        }
    });


    // Trigger the initial check on page load
    moveTrain(1)

    const carriages = this.querySelectorAll(".carriage");
    // Function to add the "wobble" class with a delay
    function addWobbleClassWithDelay(index) {
        setTimeout(() => {
            carriages[index].classList.add("wobble");
        }, index * 200); // Delay in milliseconds
    }

    // Loop through each carriage and add the "wobble" class with a delay
    for (let i = 0; i < carriages.length; i++) {
        addWobbleClassWithDelay(i);
    }
});

