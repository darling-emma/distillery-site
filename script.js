console.log("connected - debug-2");

// Register Plugins
document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(DrawSVGPlugin, ScrambleTextPlugin, ScrollTrigger, ScrollSmoother, MotionPathPlugin)

    // Event listener for resizing
    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 200);
    });
    
    // Initialize ScrollSmoother, Desktop only
    let mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
        ScrollSmoother.create({
            wrapper: "#smooth-wrapper",
            content: "#smooth-content",
            smooth: 1,
            effects: true,
            ignoreMobileResize: true,
            normalizeScroll: true
        });
    });

    // HERO ANIMATION
    // Get Rid of Flash on Load
    gsap.set(".draw-me", {drawSVG: 0, visibility: "visible"});

    // .scroll-prompt Animation
    gsap.set(".scroll-prompt", {opacity: 1});

    let LoopTL = gsap.timeline({repeat: -1});
    LoopTL
    .to (".scroll-prompt", { // fade out, move up
        opacity: 0,
        y: -20,
        duration: 1.5
    })
    .to (".scroll-prompt", { // move down to reset
        y: 20,
        duration: 0.5
    })
    .to (".scroll-prompt", { // fade in, move back to original position
        y: 0,
        opacity: 1,
        duration: 2
    });

    // Fade Out Scroll Prompt Control
    let Fade = gsap.to(".scroll-prompt-wrapper", {
        opacity: 0,
        duration: 1,
        paused: true,
        onStart: () => LoopTL.pause(), // Pause loop when fading out
        onReverseComplete: () => LoopTL.play() // Play loop when reversed animation completes
    });

    // Main Hero Timeline
    const Hero = gsap.timeline({
        scrollTrigger: {
            trigger: ".helper",
            start: "top bottom",
            end: "top top",
            scrub: 0.5,
            markers: false,
            onEnter: () => Fade.play(), // Play animation to fade out .scroll-prompt-wrapper
            onLeaveBack: () => Fade.reverse() // Reverse animation to fade out .scroll-prompt-wrapper
        }
    });

    Hero
    .to(".draw-me", { // drawing in distillery logo
        drawSVG: true,
        stagger: 0.05
    })
    .to(".svg-wrapper", { // moving the logo from right to left
        x: "-50%",
        ease: "none"
    }, "<")
    .to(".svg-wrapper", { // scaling back to center
        scale: 0.5,
        transformOrigin: "right center"
    })
    .to(".window", { // scaling even smaller after reaching center
        scale: 0.7,
        transformOrigin: "center center"
    });

    // ScrollTrigger for pinning .hero
    ScrollTrigger.create({
        trigger: ".helper",
        start: "top bottom",
        end: "top top",
        scrub: true,
        pin: ".hero",
        markers: false,
    });

    
