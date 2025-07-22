console.log("connected - clients - V1");

document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const matchMedia = gsap.matchMedia();

    window.addEventListener("load", () => {
        gsap.to(".smooth-wrapper", { autoAlpha: 1, delay: 0.5, duration: 1 })
    });

    function runGsap() {
        matchMedia.add("(min-width: 768px)", () => {
            // SCROLLBAR ANIMATION
            const listWrapper = document.querySelector(".clients-right");
            const padding = parseFloat(getComputedStyle(listWrapper).paddingTop);
            const list = document.querySelector(".clients-list");
            const listHeight = list.getBoundingClientRect().height;
            const windowHight = window.innerHeight;
            const distance = -1 * (windowHight - (listHeight + padding));

            const scrollBar = document.querySelector(".clients-scrollbar");
            const scrollDot = document.querySelector(".clients-scrollbar-dot");
            const barHeight = scrollBar.getBoundingClientRect().height;
            const dotHeight = scrollDot.getBoundingClientRect().height;
            const totalDotScroll = barHeight - dotHeight;

            gsap.to(".clients-scrollbar-dot", {
                scrollTrigger: {
                    trigger: ".clients-left",
                    start: "top top",
                    end: "+=" + distance,
                    scrub: true,
                    pin: ".clients-left",
                },
                y: totalDotScroll,
            });

            // IMAGE ANIMATION
            gsap.set(".clients-image", {
                scrollTrigger: {
                    trigger: ".clients-list",
                    start: "top 12%",
                    end: "+=" + distance,
                    scrub: true,
                },
                display: "flex",
                stagger: 1,
                rotation: () => (Math.random() - 0.5) * 20,
            });
        });
    }

    // Try to detect if Finsweet has already loaded
    if (window.fsAttributes && window.fsAttributes.initialized) {
        runGsap();
    } else {
        document.addEventListener("fsAttribute:loaded", runGsap, { once: true });
        // Fallback: run after a short delay if event never fires
        setTimeout(runGsap, 1000);
    }
});
