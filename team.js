console.log("team connected - V2");

$(document).ready(function() {
    const matchM = gsap.matchMedia();
    
    $(window).on("load", function() {
        gsap.to(".smooth-wrapper", { autoAlpha: 1, duration: 1 });
    });

    // Assign ID + DATA-ID
    $('.team-names-item').each(function() {
        const idText = $(this).children('.idtext').text().trim();
        $(this).attr('id', 'item-' + idText);
    });

    $('.team-drinks-item').each(function() {
        const dataIdText = $(this).children('.idtext').text().trim();
        $(this).attr('data-id', 'item-' + dataIdText);
    });

    // Defining freeze scroll function
    function freezeScroll() {
        if (ScrollSmoother.get() && !ScrollTrigger.isTouch) {
            ScrollSmoother.get().paused(true);
            document.querySelector(".smooth-wrapper").style.pointerEvents = "none";
        } else {
            document.body.style.overflow = "hidden";
            document.body.style.touchAction = "none";
        }
    }

    // Defining resume scroll function
    function resumeScroll() {
        if (ScrollSmoother.get() && !ScrollTrigger.isTouch) {
            ScrollSmoother.get().paused(false);
            document.querySelector(".smooth-wrapper").style.pointerEvents = "auto";
        } else {
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
        }
    }

    // Team Animation Desktop
    matchM.add("(min-width: 992px)", () => {

        const namesItems = document.querySelectorAll(".team-names-item");

        let activeId = null;

        namesItems.forEach(item => {
            const id = item.id;
            const tickerWrap = item.querySelector(".ticker-wrap");
            const tickerMove = tickerWrap.querySelector(".ticker-move");
            const trigger = item.querySelector(".name");

            const relatedItem = document.querySelector(`.team-drinks-item[data-id="${id}"]`);
            const largeDrink = relatedItem.querySelector(".item-drink-wrapper");
            const bio = relatedItem.querySelector(".item-info-wrapper");

            if (!tickerWrap || !tickerMove || !trigger || !relatedItem || !largeDrink) {
                console.log("item not found");
                return;
            } else {
                console.log("all clear")
            };

            // Ticker timeline
            const tickerTimeline = gsap.timeline({ paused: true, repeat: -1 });
            tickerTimeline.to(tickerMove, { x: "-100%", duration: 20, ease: "none" });

            // Close function
            function closeAnimation() {
                // Hide bio
                const bioClickClose = gsap.timeline();
                bioClickClose
                .to(bio, { opacity: 0, duration: 0.3 })
                .set(bio, { display: "none" })
                .set(relatedItem, { zIndex: "auto" }, "<")
                .set(".instruction-wrapper", { display: "flex" }, "<")
                .set(".close-wrapper-big", { display: "none" })
                .to(".instruction-wrapper", { opacity: 1, duration: 0.3 });

                // Reset active id to none
                activeId = null;

                // Reset all names
                namesItems.forEach(name => {
                    gsap.to(name, { opacity: 1, duration: 0.3 });
                });

                resumeScroll();
            }

            const closeWrapper = document.querySelector(".close-wrapper-big");
            if (closeWrapper) {
                closeWrapper.addEventListener("click", closeAnimation);
            }

            // Hover in animation
            trigger.addEventListener("mouseenter", () => {
                if (activeId) return;

                setTimeout(() => {
                    // Start ticker + reveal opacity
                    tickerTimeline.play();
                    gsap.to(tickerWrap, { opacity: 1, duration: 0.3 });

                    // Hide instructions
                    gsap.to(".instruction-wrapper", { opacity: 0, duration: 0.3 });

                    // Keep hovered name 100% opacity, decrease others to 30%
                    namesItems.forEach(other => {
                        if (other !== item) {
                            gsap.to(other, { opacity: 0.3, duration: 0.3 });
                        } else {
                            gsap.to(other, { opacity: 1, duration: 0.3 });
                        }
                    });

                    // Reveal related large drink
                    const drinkHover = gsap.timeline();
                    drinkHover
                    .set(largeDrink, { display: "flex" })
                    .to(largeDrink, { opacity: 1, duration: 0.3 });
                }, 100);
            });

            // Hover out animation
            trigger.addEventListener("mouseleave", () => {
                if (activeId) return;

                setTimeout(() => {
                    // Pause ticker + hide opacity
                    tickerTimeline.pause(0);
                    gsap.to(tickerWrap, { opacity: 0, duration: 0.3 });

                    // Show instructions
                    gsap.to(".instruction-wrapper", { opacity: 1, duration: 0.3 });

                    // All names to 100% opacity
                    namesItems.forEach(name => {
                        gsap.to(name, { opacity: 1, duration: 0.3 });
                    });

                    // Hide related large drink
                    const drinkHover = gsap.timeline();
                    drinkHover
                    .to(largeDrink, { opacity: 0, duration: 0.3 })
                    .set(largeDrink, { display: "none" });
                }, 100);
            });

            // Click animation
            trigger.addEventListener("click", () => {
                // If active, clicking on it closes it
                if (activeId === id) {
                    closeAnimation();
                    return;
                }

                // If active, don't play this animation
                if (activeId) return;

                // Set this id to active
                activeId = id;

                // Pause ticker + hide opacity
                tickerTimeline.pause(0);
                gsap.to(tickerWrap, { opacity: 0, duration: 0.3 });

                // Hide related large drink + keep instructions hidden
                const drinkHover = gsap.timeline();
                drinkHover
                .to(largeDrink, { opacity: 0, duration: 0.3 })
                .set(".instruction-wrapper", { opacity: 0 }, "<")
                .set(".instruction-wrapper", { display: "none" })
                .set(largeDrink, { display: "none" }, "<");

                // Reveal bio 
                setTimeout(() => {
                    const bioClickOpen = gsap.timeline();
                    bioClickOpen
                    .set(bio, { display: "flex" })
                    .set(relatedItem, { zIndex: 900 }, "<")
                    .set(".close-wrapper-big", { display: "flex" }, "<")
                    .to(bio, { opacity: 1, duration: 0.3 });
                }, 300);

                freezeScroll();
            });
        });
    });
});
