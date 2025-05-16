console.log("connected - onlycanvasondesktop");

document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(DrawSVGPlugin, ScrambleTextPlugin, ScrollTrigger, ScrollSmoother, MotionPathPlugin);

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
    gsap.set(".draw-me", {drawSVG: 0, visibility: "visible"});
    gsap.set(".scroll-prompt", {opacity: 1});

    let LoopTL = gsap.timeline({repeat: -1});
    LoopTL
        .to(".scroll-prompt", {opacity: 0, y: -20, duration: 1.5})
        .to(".scroll-prompt", {y: 20, duration: 0.5})
        .to(".scroll-prompt", {y: 0, opacity: 1, duration: 2});

    let Fade = gsap.to(".scroll-prompt-wrapper", {
        opacity: 0,
        duration: 1,
        paused: true,
        onStart: () => LoopTL.pause(),
        onReverseComplete: () => LoopTL.play()
    });

    const Hero = gsap.timeline({
        scrollTrigger: {
            trigger: ".helper",
            start: "top bottom",
            end: "top top",
            scrub: 0.5,
            markers: false,
            onEnter: () => Fade.play(),
            onLeaveBack: () => Fade.reverse()
        }
    });

    Hero
        .to(".draw-me", {drawSVG: true, stagger: 0.05})
        .to(".svg-wrapper", {x: "-50%", ease: "none"}, "<")
        .to(".svg-wrapper", {scale: 0.5, transformOrigin: "right center"})
        .to(".window", {scale: 0.7, transformOrigin: "center center"});

    ScrollTrigger.create({
        trigger: ".helper",
        start: "top bottom",
        end: "top top",
        scrub: true,
        pin: ".hero",
        markers: false,
    });

    // SUBHERO ANIMATION
    function isDesktop() {
        return window.innerWidth >= 768;
    }

    let subheroTimeline;

    if (isDesktop()) {
        // --- Canvas/Image Sequence Animation (Desktop Only) ---
        const imageURLs = [
            "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321960/01_wmfw04.webp",
            // ... (rest of your URLs) ...
            "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747322260/48_bqiauq.webp"
        ];
        const frameCount = imageURLs.length;
        const canvas = document.getElementById("sequence-canvas");
        const context = canvas.getContext("2d");
        const images = [];
        const imageSeq = { frame: 0 };

        function preloadImages() {
            imageURLs.forEach((url) => {
                const img = new Image();
                img.src = url;
                images.push(img);
            });
        }

        function render() {
            const img = images[imageSeq.frame];
            if (!img?.complete) return;
            const container = document.querySelector(".canvas-window");
            const displayWidth = container.clientWidth;
            const displayHeight = container.clientHeight;
            const canvasAspect = displayWidth / displayHeight;
            const imgAspect = img.width / img.height;
            let drawWidth, drawHeight;
            if (imgAspect > canvasAspect) {
                drawHeight = displayHeight;
                drawWidth = drawHeight * imgAspect;
            } else {
                drawWidth = displayWidth;
                drawHeight = drawWidth / imgAspect;
            }
            const x = (displayWidth - drawWidth) / 2;
            const y = (displayHeight - drawHeight) / 2;
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, x, y, drawWidth, drawHeight);
        }

        function resizeCanvas() {
            const container = document.querySelector(".canvas-window");
            const width = container.clientWidth;
            const height = container.clientHeight;
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";
            canvas.width = width;
            canvas.height = height;
            render();
        }

        window.addEventListener("resize", resizeCanvas);
        preloadImages();
        resizeCanvas();

        subheroTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: ".end-scroll",
                start: "top bottom",
                end: "top top",
                scrub: true,
                pin: ".subhero-track",
                markers: false,
            }
        });

        subheroTimeline
            .to(imageSeq, {
                frame: frameCount - 1,
                snap: "frame",
                ease: "none",
                onUpdate: render
            })
            .to(".scramble", {y: -40, opacity: 0})
            .from(".subhero-paragraph", {y: 40, opacity: 0});

    } else {
        // --- Mobile: Only run text/paragraph tweens ---
        subheroTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: ".end-scroll",
                start: "top bottom",
                end: "top top",
                scrub: true,
                pin: ".subhero-track",
                markers: false,
            }
        });

        subheroTimeline
            .to(".scramble", {y: -40, opacity: 0})
            .from(".subhero-paragraph", {y: 40, opacity: 0});
    }

    // Scramble Text Animation (runs on all devices)
    ScrollTrigger.create({
        trigger: ".scramble-trigger",
        start: "top top",
        onEnter: () => {
            gsap.to(".scramble", {
                scrambleText: "DISTILLING BRANDS TO THEIR ESSENCE",
                duration: 2,
                chars: "DISTLERY"
            });
        },
        onLeaveBack: () => {
            gsap.to(".scramble", {
                scrambleText: "THE BRAND STRATEGY COMPANY",
                duration: 2,
                chars: "DISTLERY"
            });
        },
        markers: false
    });

    // Pipes Animation (unchanged)
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
        .to(".one", {motionPath: {path: ".path-1", align: ".path-1", alignOrigin: [0.5, 0.5]}})
        .to(".two", {motionPath: {path: ".path-2", align: ".path-2", alignOrigin: [0.5, 0.5]}}, 0);

    let delayOne = Pipes.duration() * 0.2;
    Pipes.add("delayOne", delayOne);

    Pipes
        .to(".three", {motionPath: {path: ".path-1", align: ".path-1", alignOrigin: [0.5, 0.5]}}, delayOne)
        .to(".four", {motionPath: {path: ".path-2", align: ".path-2", alignOrigin: [0.5, 0.5]}}, delayOne);

    let delayTwo = Pipes.duration() * 0.4;
    Pipes.add("delayTwo", delayTwo);

    Pipes
        .to(".five", {motionPath: {path: ".path-1", align: ".path-1", alignOrigin: [0.5, 0.5]}}, delayTwo)
        .to(".six", {motionPath: {path: ".path-2", align: ".path-2", alignOrigin: [0.5, 0.5]}}, delayTwo);

    let delayThree = Pipes.duration() * 0.8;
    Pipes.add("delayThree", delayThree);

    Pipes
        .to(".seven", {motionPath: {path: ".path-1", align: ".path-1", alignOrigin: [0.5, 0.5]}}, delayThree)
        .to(".eight", {motionPath: {path: ".path-2", align: ".path-2", alignOrigin: [0.5, 0.5]}}, delayThree);

    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
    });
});
