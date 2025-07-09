console.log("connected - solutions - v2.5");

document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(ScrollTrigger,ScrollSmoother, ScrambleTextPlugin)

    let VW = window.innerWidth;
    let VH = window.innerHeight;
    
    let solutionsHero = gsap.timeline({
        scrollTrigger: {
            trigger: ".solutions-hero",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            pin: ".solutions-hero-content"
        }
    });

    solutionsHero
    .to(".one", {
        borderBottomLeftRadius: "999px",
        borderTopLeftRadius: "999px",
        borderBottomRightRadius: "999px",
        borderTopRightRadius: "999px",
        width: "250px",
        height: "250px",
        ease: "none",
    })
    .to(".solutions-hero-content", {
    	scale: 0,
        transformOrigin: "center center",
    }, "<")
    .to(".one", {
        display: "none"
    });

    // LAYERS ANIMATION
    const dots = gsap.utils.toArray(".layer");
    const triggers = gsap.utils.toArray(".solutions-line");

    dots.forEach((dot, i) => {
        const trigger = triggers[i];
        
        if (!trigger) return;

        const dotHeight = dot.getBoundingClientRect().height;
        const windowMeasure = document.querySelector(".solutions-fixed-wrapper");
        const windowHeight = windowMeasure.getBoundingClientRect().height;
        var startVal = (windowHeight / 2) + (dotHeight / 2);
        var endVal = (windowHeight / 2) - (dotHeight / 2);
        var startLine = `top ${startVal}px`;
        var endLine = `top ${endVal}px`;

        gsap.to(dot, {
            scrollTrigger: {
                trigger: trigger,
                start: startLine,
                end: endLine,
                scrub: true,
            },
            clipPath: "inset(0 0 100% 0)",
            ease: "none",
        });
    }); 

    // CTA ANIMATION
    let solutionsCTA = gsap.timeline({
        scrollTrigger: {
            trigger: ".solutions-cta",
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
        }
    });

    solutionsCTA
    .to(".seven", {
        opacity: 0,
        ease: "none",
        duration: 0.5,
    })
    .from(".eight", {
        borderBottomLeftRadius: "999px",
        borderTopLeftRadius: "999px",
        borderBottomRightRadius: "999px",
        borderTopRightRadius: "999px",
        width: "250px",
        height: "250px",
        ease: "none",
        duration: 0.5,
    })
    .to(".scramble", {
        scrambleText: {
            text: "Tell Me More",
            chars: "!@#$%^&*()1234567890"
        },
        ease: "none",
        duration: 1,
    })
    .to(".icon-large", {
        display: "flex"
    });

    document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(ScrollTrigger,ScrollSmoother, ScrambleTextPlugin)

    let VW = window.innerWidth;
    let VH = window.innerHeight;
    
    let solutionsHero = gsap.timeline({
        scrollTrigger: {
            trigger: ".solutions-hero",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            pin: ".solutions-hero-content"
        }
    });

    solutionsHero
    .to(".one", {
        borderBottomLeftRadius: "999px",
        borderTopLeftRadius: "999px",
        borderBottomRightRadius: "999px",
        borderTopRightRadius: "999px",
        width: "250px",
        height: "250px",
        ease: "none",
    })
    .to(".solutions-hero-content", {
    	scale: 0,
        transformOrigin: "center center",
    }, "<")
    .to(".one", {
        display: "none"
    });

    // LAYERS ANIMATION
    const dots = gsap.utils.toArray(".layer");
    const triggers = gsap.utils.toArray(".solutions-line");

    dots.forEach((dot, i) => {
        const trigger = triggers[i];
        
        if (!trigger) return;

        const dotHeight = dot.getBoundingClientRect().height;
        const windowMeasure = document.querySelector(".solutions-fixed-wrapper");
        const windowHeight = windowMeasure.getBoundingClientRect().height;
        var startVal = (windowHeight / 2) + (dotHeight / 2);
        var endVal = (windowHeight / 2) - (dotHeight / 2);
        var startLine = `top ${startVal}px`;
        var endLine = `top ${endVal}px`;

        gsap.to(dot, {
            scrollTrigger: {
                trigger: trigger,
                start: startLine,
                end: endLine,
                scrub: true,
            },
            clipPath: "inset(0 0 100% 0)",
            ease: "none",
        });
    }); 

    // CTA ANIMATION
    let solutionsCTA = gsap.timeline({
        scrollTrigger: {
            trigger: ".solutions-cta",
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
        }
    });

    solutionsCTA
    .to(".seven", {
        opacity: 0,
        ease: "none",
        duration: 0.5,
    })
    .from(".eight", {
        borderBottomLeftRadius: "999px",
        borderTopLeftRadius: "999px",
        borderBottomRightRadius: "999px",
        borderTopRightRadius: "999px",
        width: "250px",
        height: "250px",
        ease: "none",
        duration: 0.5,
    })
    .to(".scramble", {
        scrambleText: {
            text: "Tell Me More",
            chars: "!@#$%^&*()1234567890"
        },
        ease: "none",
        duration: 1,
    })
    .to(".icon-large", {
        display: "flex"
    });

    gsap.to(".solutions-text", { 
        scrollTrigger: {
            trigger: ".footer",
            start: "top bottom",
            end: "top 80%",
        },
        opacity: 0,
        yPercent: -50,
    });
});
});
