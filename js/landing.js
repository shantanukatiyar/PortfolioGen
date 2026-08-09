
/* =========================================================
   PORTFOLIOGEN — LANDING PAGE JAVASCRIPT
   ========================================================= */


/* =========================================================
   TEMPLATE BUTTONS
   ========================================================= */

const templateCards = document.querySelectorAll(".template-card");

templateCards.forEach((card) => {

    const button = card.querySelector("button");

    if (!button) return;


    button.addEventListener("click", () => {

        const templateName =
            card.querySelector("h3")?.textContent
                .trim()
                .toLowerCase();


        if (!templateName) return;


        window.location.href =
            `builder.html?template=${encodeURIComponent(templateName)}`;

    });

});


/* =========================================================
   NAVBAR SCROLL EFFECT
   ========================================================= */

const navbar = document.querySelector(".navbar");


window.addEventListener("scroll", () => {

    if (!navbar) return;


    if (window.scrollY > 10) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

});


/* =========================================================
   SMOOTH ANCHOR NAVIGATION
   ========================================================= */

document.querySelectorAll('a[href^="#"]').forEach((link) => {

    link.addEventListener("click", (event) => {

        const targetId =
            link.getAttribute("href");


        if (!targetId || targetId === "#") {
            return;
        }


        const target =
            document.querySelector(targetId);


        if (!target) {
            return;
        }


        event.preventDefault();


        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});

