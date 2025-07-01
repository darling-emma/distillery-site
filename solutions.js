console.log("connected - solutions");

document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(ScrollTrigger,ScrollSmoother, ScrambleTextPlugin)

    // HERO ANIMATION
    var VW = window.innerWidth;
    var VH = window.innerHeight;
    
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
    .from(".one", {
        borderBottomLeftRadius: "0px",
        borderTopLeftRadius: "0px",
        borderBottomRightRadius: "0px",
        borderTopRightRadius: "0px",
        width: VW,
        height: VH,
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
        const windowHeight = window.innerHeight;
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
    .to(".eight", {
        borderBottomLeftRadius: "0px",
        borderTopLeftRadius: "0px",
        borderBottomRightRadius: "0px",
        borderTopRightRadius: "0px",
        width: VW,
        height: VH,
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
});
