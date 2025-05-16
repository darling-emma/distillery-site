console.log("connected - sticky subhero - markers");

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
            end: "50% top",
            scrub: 0.5,
            markers: true,
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
        end: "50% top",
        scrub: true,
        pin: ".hero",
        markers: {
            indent: 200px,
        },
    });

    // SUBHERO ANIMATION
    const imageURLs = [
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321960/01_wmfw04.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321960/02_t4y3dq.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321960/03_rqpwid.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321961/04_wtwh9j.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321961/05_nn5zst.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321961/06_mtehvs.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321961/07_xkfv9t.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321961/08_izkkbi.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321962/09_g7qdnb.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321961/10_u2arir.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321962/11_ca579c.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321962/12_eq57wt.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321962/13_rdu0zf.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321962/14_usjip1.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321963/15_jgdn4l.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321963/16_xvutpd.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321963/17_lwmuez.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321963/18_lrz2ld.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321964/19_r6mhad.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321964/20_bb7czi.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321964/21_pifxub.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321964/22_lj1nhw.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321965/23_xwo9bb.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321965/24_xsyc7x.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321965/25_uwn4p5.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321966/26_k5nfb7.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321966/27_rsovjs.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321966/28_ifjfkn.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321966/29_up8jh8.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321967/30_pwvsju.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321967/31_jiykee.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321967/32_kmoruf.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321968/33_gpvl8v.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321968/34_qrvmam.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321968/35_p03hd3.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321969/36_a8o4j4.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321969/37_jret6y.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321969/38_pe6qem.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321970/39_emcscw.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747321970/40_mqam03.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747322261/41_tylms7.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747322262/42_qwjoao.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747322264/43_f8gss0.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747322254/44_hq3xos.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747322256/45_al18pr.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747322257/46_ztcdx3.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747322259/47_eijxun.webp",
        "https://res.cloudinary.com/dwxgs5mgk/image/upload/v1747322260/48_bqiauq.webp"
    ];

    const frameCount = imageURLs.length;
    const canvas = document.getElementById("sequence-canvas");
    const context = canvas.getContext("2d");

    const images = [];
    const imageSeq = {
        frame: 0
    };

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

        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        canvas.width = width;
        canvas.height = height;

        render();
    }

    function resizeCanvas() {
        const container = document.querySelector(".canvas-window");
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Match display size
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";

        // Match pixel buffer for sharpness
        canvas.width = width;
        canvas.height = height;

        render();
    }

    window.addEventListener("resize", () => {
        resizeCanvas();
    });

    preloadImages();
    resizeCanvas();

    const subheroTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: ".end-scroll",
            start: "top bottom",
            end: "top top",
            scrub: true,
            markers: {
                indent: 400px,
            },
        }
    });

    subheroTimeline
    .to(imageSeq, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        onUpdate: render
    })
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
});
