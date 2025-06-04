console.log("team connected - add mobile 1");

$(document).ready(function() {
    // Assign ID + DATA-ID
    $('.team-names-item').each(function() {
        const idText = $(this).children('.idtext').text().trim();
        $(this).attr('id', 'item-' + idText);
    });

    $('.team-drinks-item').each(function() {
        const dataIdText = $(this).children('.idtext').text().trim();
        $(this).attr('data-id', 'item-' + dataIdText);
    });

    // Team Animation Desktop
    const drinksItems = document.querySelectorAll(".team-drinks-item");
    const namesItems = document.querySelectorAll(".team-names-item");
    const instruction = document.querySelector(".instruction-wrapper");

    gsap.set(drinksItems, { display: "none", opacity: 0 });
    gsap.set(".close-wrapper", { opacity: 0 });
    gsap.set(".item-text", { opacity: 0 });
    gsap.set(".ticker-wrap", { opacity: 0 });
    gsap.set(instruction, { opacity: 1 });

    let tickerTimelines = {};
    let activeId = null;
    let fadeTimelines = {};

    // Main loop for each name
    namesItems.forEach(item => {
        const id = item.id;
        const tickerWrap = item.querySelector(".ticker-wrap");
        const tickerMove = item.querySelector(".ticker-move");
        const relatedDrink = document.querySelector(`.team-drinks-item[data-id="${id}"]`);
        const trigger = item.querySelector(".name");

        if (!tickerMove || !relatedDrink) {
            console.warn(`Missing elements for ${id}`);
            return;
        }

        if (!trigger) {
            console.warn(`⚠️ No .name trigger found in ${id}`);
            return;
        }

        // Defining close animation
        function closeDrinkItem() {
            const closeWrapper = relatedDrink.querySelector(".close-wrapper");
            const itemText = relatedDrink.querySelector(".item-text");
            const itemDrinkWrap = relatedDrink.querySelector(".item-drink-wrapper");

            gsap.to([closeWrapper, itemText], { opacity: 0, duration: 0.01 });
            gsap.to(relatedDrink, { opacity: 0, duration: 0.01 });

            setTimeout(() => {
                gsap.set(instruction, { opacity: 1 });
                gsap.set(relatedDrink, { display: "none", zIndex: "auto" });
                gsap.set(itemDrinkWrap, { display: "block", opacity: 1 });
                activeId = null;

                namesItems.forEach(name => {
                    gsap.to(name, { opacity: 1, duration: 0.01 });
                    const ticker = name.querySelector(".ticker-wrap");
                    if (ticker) gsap.to(ticker, { opacity: 0, duration: 0.01 });
                });
            }, 300);
        }

        const closeWrapper = relatedDrink.querySelector(".close-wrapper");
        if (closeWrapper) {
            closeWrapper.addEventListener("click", closeDrinkItem);
        }

        console.log(`close button bound for ${id}`);

        // Ticker timeline
        tickerTimelines[id] = gsap.timeline({ paused: true, repeat: -1 });
        tickerTimelines[id].to(tickerMove, {
            xPercent: -100,
            duration: 20,
            ease: "none"
        });

        // Hover animation
        trigger.addEventListener("mouseenter", () => {
            if (activeId) return;

            if (fadeTimelines[id]) {
                fadeTimelines[id].kill();
            };

            gsap.set(relatedDrink, { clearProps: "all", display: "flex" });

            gsap.to(tickerWrap, { opacity: 1, duration: 0.01 });
            tickerTimelines[id].play();

            gsap.to(relatedDrink, { opacity: 1, duration: 0.01 });
            gsap.to(instruction, { opacity: 0, duration:0.01 });

            namesItems.forEach(other => {
                if (other !== item) {
                    gsap.to(other, { opacity: 0.3, duration: 0.01 });
                    const otherTicker = other.querySelector(".ticker-wrap");
                    if (otherTicker) gsap.to(otherTicker, { opacity: 0, duration: 0.3 });
                } else {
                    gsap.to(other, { opacity: 1, duration: 0.01 });
                }
            });
        });

        // Hover out animation
        trigger.addEventListener("mouseleave", () => {
            if (activeId) return;
            
            fadeTimelines[id] = gsap.timeline();
            fadeTimelines[id]
            .to(relatedDrink, { opacity: 0, duration: 0.01 })
            .set(relatedDrink, { display: "none" })
            .to(instruction, { opacity: 1, duration: 0.01 }, "<");

            namesItems.forEach(name => {
                gsap.to(name, { opacity: 1, duration: 0.01 });

                const ticker = name.querySelector(".ticker-wrap");
                if (ticker) gsap.to(ticker, { opacity: 0, duration: 0.01 });
            });

            tickerTimelines[id].pause(0);
        });


        // Click animation
        trigger.addEventListener("click", () => {
            if (activeId === id) {
                closeDrinkItem();
                return;
            }
            if (activeId) return;
            activeId = id;

            gsap.to(tickerWrap, { opacity: 0, duration: 0.01 });
            tickerTimelines[id].pause();

            gsap.set(instruction, { opacity: 0 });
            
            const itemText = relatedDrink.querySelector(".item-text");
            const itemDrinkWrap = relatedDrink.querySelector(".item-drink-wrapper");

            gsap.to(itemDrinkWrap, { opacity: 0, duration: 0.01 });

            setTimeout(() => {
                gsap.set(itemDrinkWrap, { display: "none" });
                gsap.set(relatedDrink, { zIndex: "900" });
                gsap.to([closeWrapper, itemText], { opacity: 1, duration: 0.01 });
                gsap.set(closeWrapper, { pointerEvents: "auto" });
            }, 300);
        });
    });

    // Mobile Accordion Logic (Tablet and Below Only)
const isMobile = window.matchMedia("(max-width: 991px)"); // adjust based on Webflow's breakpoints

if (isMobile.matches) {
    let openAccordion = null;

    $(".team-names-item .name").on("click", function () {
        const $name = $(this);
        const $wrapper = $name.siblings(".mobile-info-wrapper");
        const $plus = $name.find(".svg-plus");

        // If this is already open, close it
        if (openAccordion && openAccordion.get(0) === $wrapper.get(0)) {
            gsap.to($wrapper.get(0), {
                height: 0,
                duration: 0.3,
                onComplete: () => {
                    $wrapper.css("display", "none");
                    openAccordion = null;
                }
            });
            gsap.to($plus.get(0), { rotate: 0, duration: 0.3 });
            return;
        }

        // Close the currently open one if it exists
        if (openAccordion) {
            const $prevName = openAccordion.siblings(".name");
            const $prevPlus = $prevName.find(".svg-plus");
            gsap.to(openAccordion.get(0), {
                height: 0,
                duration: 0.3,
                onComplete: () => {
                    openAccordion.css("display", "none");
                }
            });
            gsap.to($prevPlus.get(0), { rotate: 0, duration: 0.3 });
        }

        // Open the new one
        $wrapper.css("display", "flex");

        // First set height to auto to measure it, then animate from 0 to that height
        const fullHeight = $wrapper.get(0).scrollHeight;

        gsap.fromTo(
            $wrapper.get(0),
            { height: 0 },
            {
                height: fullHeight,
                duration: 0.3,
                onComplete: () => {
                    $wrapper.css("height", "auto");
                }
            }
        );
        gsap.to($plus.get(0), { rotate: 45, duration: 0.3 });

        openAccordion = $wrapper;
    });
}

});
