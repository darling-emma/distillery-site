console.log("connected - put back smooth scroll");

// Register Plugins
document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(DrawSVGPlugin, ScrambleTextPlugin, ScrollTrigger, ScrollSmoother, MotionPathPlugin, Draggable, InertiaPlugin, SplitText)

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
    // === CENTERED SQUARE IMAGE SEQUENCE ===

    // 1. List your image URLs (replace with your own if needed)
    const centerImageURLs = [
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422176/Distillery_Burst_051525_00_cndban.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422176/Distillery_Burst_051525_01_stiwwm.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422176/Distillery_Burst_051525_02_umuyaa.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422176/Distillery_Burst_051525_03_yjh0yk.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422176/Distillery_Burst_051525_04_f0bcjz.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422177/Distillery_Burst_051525_05_x4kfhk.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422177/Distillery_Burst_051525_06_lt6u0f.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422177/Distillery_Burst_051525_07_ahdzgl.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422177/Distillery_Burst_051525_08_iqutrs.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422177/Distillery_Burst_051525_09_bsryyk.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422178/Distillery_Burst_051525_10_gtrwrs.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422178/Distillery_Burst_051525_11_qegr9w.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422178/Distillery_Burst_051525_12_mkrbj7.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422178/Distillery_Burst_051525_13_z3sk53.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422179/Distillery_Burst_051525_14_q0ama1.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422179/Distillery_Burst_051525_15_ith5sw.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422179/Distillery_Burst_051525_16_w9idjr.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422180/Distillery_Burst_051525_17_uvfwg2.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422180/Distillery_Burst_051525_18_vga8kh.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422180/Distillery_Burst_051525_19_ylciq9.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422181/Distillery_Burst_051525_20_wag8h6.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422181/Distillery_Burst_051525_21_vg2nap.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422181/Distillery_Burst_051525_22_n0jjyd.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422181/Distillery_Burst_051525_23_io4e6h.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422182/Distillery_Burst_051525_24_cdjycb.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422182/Distillery_Burst_051525_25_kfiw2k.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422183/Distillery_Burst_051525_26_xi6t51.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422183/Distillery_Burst_051525_27_lxtvey.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422183/Distillery_Burst_051525_28_vvsf7z.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422184/Distillery_Burst_051525_29_jkjpfi.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422184/Distillery_Burst_051525_30_sis0kg.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422184/Distillery_Burst_051525_31_j44xd3.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422185/Distillery_Burst_051525_32_embx9a.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422185/Distillery_Burst_051525_33_ljf542.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422185/Distillery_Burst_051525_34_eeyv8i.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422186/Distillery_Burst_051525_35_jmwuim.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422186/Distillery_Burst_051525_36_c5zeeh.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422187/Distillery_Burst_051525_37_a4skgz.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422187/Distillery_Burst_051525_38_lveykp.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422187/Distillery_Burst_051525_39_jsnkb5.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422187/Distillery_Burst_051525_40_mk2jbn.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422188/Distillery_Burst_051525_41_mmtrwf.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422188/Distillery_Burst_051525_42_us8jdi.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422188/Distillery_Burst_051525_43_d2xabk.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422188/Distillery_Burst_051525_44_fddkdt.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422189/Distillery_Burst_051525_45_whsjoq.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422190/Distillery_Burst_051525_46_ump0jy.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747422190/Distillery_Burst_051525_47_oo0ook.webp",
    ];

    // 2. Setup
    const centerFrameCount = centerImageURLs.length;
    const centerCanvas = document.getElementById("center-sequence-canvas");
    const centerContext = centerCanvas.getContext("2d");
    const centerImages = [];
    const centerImageSeq = { frame: 0 };

    // 3. Preload images
    function preloadCenterImages() {
    centerImageURLs.forEach((url) => {
        const img = new Image();
        img.src = url;
        centerImages.push(img);
    });
    }

    // 4. Resize canvas to be a centered square (max possible size)
    function resizeCenterCanvas() {
    const size = Math.min(window.innerWidth, window.innerHeight);
    centerCanvas.style.width = size + "px";
    centerCanvas.style.height = size + "px";
    centerCanvas.width = size;
    centerCanvas.height = size;
    renderCenterImage();
    }

    // 5. Render current frame, cover the square area
    function renderCenterImage() {
    const img = centerImages[centerImageSeq.frame];
    if (!img?.complete) return;

    const size = centerCanvas.width;
    // Fit image into square, cover style (object-fit: cover)
    const imgAspect = img.width / img.height;
    let drawWidth, drawHeight;
    if (imgAspect > 1) {
        drawHeight = size;
        drawWidth = imgAspect * size;
    } else {
        drawWidth = size;
        drawHeight = size / imgAspect;
    }
    const x = (size - drawWidth) / 2;
    const y = (size - drawHeight) / 2;

    centerContext.clearRect(0, 0, size, size);
    centerContext.drawImage(img, x, y, drawWidth, drawHeight);
    }

    // 6. Handle resizing
    window.addEventListener("resize", resizeCenterCanvas);

    // 7. Preload and initialize
    preloadCenterImages();
    resizeCenterCanvas();

    // 8. ScrollTrigger timeline
    const subheroTimeline = gsap.timeline({
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
    .to(centerImageSeq, {
        frame: centerFrameCount - 1,
        snap: "frame",
        ease: "none",
        onUpdate: renderCenterImage
    })
    .to(".scramble",{
        y: -40,
        opacity: 0
    })
    .from(".subhero-paragraph",{
        y: 40,
        opacity: 0
    })
    .from(".scroll-indicator-lottie", {
        y: 40,
        opacity: 0
    });

    // Scramble Text Animation
    ScrollTrigger.create({
        trigger: ".scramble-trigger",
        start: "top top",
        onEnter: () => {
            gsap.to (".scramble", {
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

    // Draggable Section Animation
    Draggable.create("#drag-me", {
        type: "x",
        bounds: document.getElementById("container"), 
        ease: "power2.in",
        inertia: true,
        dragResistance: 0.3,
        onDrag: function () {
            const direction = this.getDirection("start") === "left" ? 1 : -1;
            gsap.to(".client-image-card", {
                rotation: direction * 25,
                ease: "power1.in"
            });
        },
        onDragEnd: function () {
            gsap.to(".client-image-card", {
                rotation: 0,
            });
        },
    });

    // Process Section Animation
    const ProgressLottie = lottie.loadAnimation({
        container: document.getElementById("lottie-container"),
        path: "https://cdn.prod.website-files.com/682387662b01db59008838c3/682e160d47982ad4729294d0_Distillery_Process_052025-B.json",
        renderer: "svg",
        autoplay: false,
    }); 

    document.fonts.ready.then(() => {

        let tOneTrigger = false;
        let tTwoTrigger = false;

        const paragraphs = document.querySelectorAll(".process-paragraph");
        const paraSplit = Array.from(paragraphs).map(p => SplitText.create(p, {
            type: "words, lines",
            mask: "lines",
        }));

        const tags = document.querySelectorAll(".section-label");
        const tagSplit = Array.from(tags).map(t => SplitText.create(t, {
            type: "lines",
            mask: "lines",
        }));

        const progressBars = document.querySelectorAll(".process-progressbar-fill");

        const transitionOne = gsap.timeline({ paused: true });
        transitionOne
        .to(paraSplit[0].words, {
                yPercent: 100,
                stagger: {
                    amount: 0.7
                },
        })
        .to(tagSplit[0].lines, {
                yPercent: 100,
                stagger: {
                    amount: 0.7
                }
        }, "<")
        .from(paraSplit[1].words, {
                yPercent: -100,
                stagger: {
                    amount: 0.7
                },
        }, "<+0.2")
        .from(tagSplit[1].lines, {
                yPercent: -100,
                stagger: {
                    amount: 0.7
                }
        }, "<");
        
        const transitionTwo = gsap.timeline({ paused: true });
        transitionTwo
        .to(paraSplit[1].words, {
                yPercent: 100,
                stagger: {
                    amount: 0.7
                },
        })
        .to(tagSplit[1].lines, {
                yPercent: 100,
                stagger: {
                    amount: 0.7
                }
        }, "<")
        .from(paraSplit[2].words, {
                yPercent: -100,
                stagger: {
                    amount: 1
                },
        }, "<+0.2")
       .from(tagSplit[2].lines, {
                yPercent: -100,
                stagger: {
                    amount: 0.7
                }
        }, "<");


        const ProgressAnimation = gsap.timeline({
            scrollTrigger: {
                trigger: ".process-section",
                start: "top top",
                end: "+=3000",
                scrub: 0.5,
                onUpdate: function (self) {
                    const progress = self.progress;
                    ProgressLottie.goToAndStop(ProgressLottie.totalFrames * progress, true);
    
                    if (progress >= 1/3 && !tOneTrigger) {
                        tOneTrigger = true;
                        transitionOne.play();
                    } else if (progress < 1/3 && tOneTrigger) {
                        tOneTrigger = false ;
                        transitionOne.reverse();
                    }
    
                    if (progress >= 2/3 && !tTwoTrigger) {
                        tTwoTrigger = true;
                        transitionTwo.play();
                    } else if (progress < 2/3 && tTwoTrigger) {
                        tTwoTrigger = false;
                        transitionTwo.reverse();
                    }
                },
            }
        });
    
       progressBars.forEach((bar) => {
            ProgressAnimation.from(bar, {
                width: "0%",
            });
       });
    
    
       ScrollTrigger.create({
            trigger: ".process-section",
            start: "top top",
            end: "+=3000",
            scrub: 0.5,
            pin: true,
       });
    });

    let headerFade = gsap.timeline({ paused: true});

    headerFade.to(".process-heading", {
        opacity: 0,
        ease: "power2.out",
        duration: 0.5,
    });

    ScrollTrigger.create({
        trigger: ".end",
        start: "top bottom",
        onEnter: () => headerFade.play(),
        onLeaveBack: () => headerFade.reverse(),
    });

});
