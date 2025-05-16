console.log("connected - video not found debug");

console.log("connected");

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

    // SUBHERO ANIMATION
    // Pinning + video scrubbing with scroll
    const coolVideo = document.querySelector("video");
    console.log("video found?", !!video, video);
    if (!video) return; 

    coolVideo.onloadedmetadata = function () {
        coolVideo.playbackRate = 0;
        
        const subheroTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: ".end-scroll",
                start: "top bottom",
                end: "top top",
                scrub: true,
                pin: ".subhero-window",
                markers: false,
            }
        });

        subheroTimeline
        .to(coolVideo, {
            currentTime: coolVideo.duration
        }, 0)
        .to(".scramble",{
            y: -40,
            opacity: 0
        })
        .from(".subhero-paragraph",{
            y: 40,
            opacity: 0
        });

        // Scramble Text Animation
        ScrollTrigger.create({
            trigger: ".scramble-trigger",
            start: "center center",
            onEnter: () => {
                gsap.to (".scramble", {
                    scrambleText: "DISTILLING BRANDS TO THEIR ESSENCE",
                    duration: 2,
                    chars: "ABCDEFGHIJ!@#$%^&*"
                });  
            },
            onEnterBack: () => {
                gsap.to(".scramble", {
                    scrambleText: "THE BRAND STRATEGY COMPANY",
                    duration: 2,
                    chars: "ABCDEFGHIJ!@#$%^&*"
                });
            },
            markers: false
        });

        ScrollTrigger.refresh();

        // Pipes Animation
        let CircleShow = gsap.to(".dot", {
            visibility: "visible",
            opacity: 1,
            duration: 0.05,
            paused: true
        });

        const Pipes = gsap.timeline({
            scrollTrigger: {
                trigger: ".pipes-wrapper",
                start: "top top",
                end: "bottom bottom",
                scrub: true,
                anticipatePin: 1,
                onEnter: () => CircleShow.play(),
                onLeave: () => CircleShow.reverse(),
                onEnterBack: () => CircleShow.play(),
                onLeaveBack: () => CircleShow.reverse()
            }
        });

        Pipes
        .to(".one", {
            motionPath: {
                path: ".path-1",
                align: ".path-1",
                alignOrigin: [0.5, 0.5]
            }
        })
        .to(".two", {
            motionPath: {
                path: ".path-2",
                align: ".path-2",
                alignOrigin: [0.5, 0.5]
            }
        }, 0);

        let delayOne = Pipes.duration() * 0.2;
        Pipes.add("delayOne", delayOne);

        Pipes
        .to(".three", {
            motionPath: {
                path: ".path-1",
                align: ".path-1",
                alignOrigin: [0.5, 0.5]
            }
        }, delayOne)
        .to(".four", {
            motionPath: {
                path: ".path-2",
                align: ".path-2",
                alignOrigin: [0.5, 0.5]
            }
        }, delayOne);

        let delayTwo = Pipes.duration() * 0.4;
        Pipes.add("delayTwo", delayTwo);

        Pipes
        .to(".five", {
            motionPath: {
                path: ".path-1",
                align: ".path-1",
                alignOrigin: [0.5, 0.5]
            }
        }, delayTwo)
        .to(".six", {
            motionPath: {
                path: ".path-2",
                align: ".path-2",
                alignOrigin: [0.5, 0.5]
            }
        }, delayTwo);

        let delayThree = Pipes.duration() * 0.8;
        Pipes.add("delayThree", delayThree);

        Pipes
        .to(".seven", {
            motionPath: {
                path: ".path-1",
                align: ".path-1",
                alignOrigin: [0.5, 0.5]
            }
        }, delayThree)
        .to(".eight", {
            motionPath: {
                path: ".path-2",
                align: ".path-2",
                alignOrigin: [0.5, 0.5]
            }
        }, delayThree);

        window.addEventListener("load", () => {
            ScrollTrigger.refresh();
        });
    };

    // Touch device handling
    function isTouchDevice() {
        return (
            "ontouchstart" in window ||
            navigator.maxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0
        );
    }
    if (isTouchDevice()) {
        coolVideo.play();
        coolVideo.pause();
    };

});
