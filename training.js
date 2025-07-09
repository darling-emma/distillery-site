console.log("page script connected - FOUC fix")

document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(SplitText, ScrollTrigger)

    const matchM = gsap.matchMedia();

    // Hero + subhero Text Animation
    window.addEventListener("load", () => {
        document.fonts.ready.then(() => {
            setTimeout(() => {
                document.querySelectorAll("[text-split]").forEach(el => {
                    if (el._split) el._split.revert();

                    el.offHeight;

                    const split = new SplitText(el, {
                        type: "lines, words",
                        mask: "lines",
                        autoSplit: true,
                    });
                    el._split = split;

                    if (el.hasAttribute("trickle-in")) {
                        const tl = gsap.timeline({ paused: true });
                        tl.from(split.words, {
                            yPercent: -100,
                            duration: 0.7,
                            stagger: 0.02,
                        });
                        createScrollTrigger(el, tl)
                    }

                    if (el.hasAttribute("trickle-in-special")) {
                        const tl = gsap.timeline();
                        tl
                        .from(".vis-hidden", { autoAlpha: 0 })
                        .from(split.words, {
                            yPercent: -100,
                            duration: 0.7,
                            stagger: 0.02,
                        }, "<");
                    }

                    if (el.hasAttribute("roll-out")) {
                        const tl = gsap.timeline();
                        tl.to(split.words, {
                            yPercent: -100,
                            stagger: 0.1
                        });
                        createScrubScroll(el, tl)
                    }

                    if (el.hasAttribute("roll-in")) {
                        const tl = gsap.timeline();
                        tl.from(split.words, {
                            yPercent: 100,
                            stagger: 0.1
                        });
                        createScrubScroll(el, tl)
                    }
                });
                ScrollTrigger.refresh();
            }, 100);
        });
    });

    function createScrollTrigger(triggerElement, timeline) {
        ScrollTrigger.create({
            trigger: triggerElement,
            start: "top 75%",
            onEnter: () => timeline.play(),
            onLeaveBack: () => timeline.reverse(),
        });
    };

    function createScrubScroll(triggerElement, timeline) {
        ScrollTrigger.create({
            trigger: triggerElement,
            start: "50% 70%",
            end: "50% 30%",
            scrub: true,
            animation: timeline,
        });
    };

    // CTA Section Animation
    window.addEventListener("load", () => {
        const ctaWrapper = document.querySelector(".train-cta-wrapper")
        const bodyTag = document.querySelector(".body")
        const gridLine = document.querySelector(".grid-line")
        if (!ctaWrapper) {
            console.warn(".train-cta-wrapper not found");
            return;
        }
        if (!bodyTag) {
            console.warn(".body not found");
            return;
        }
        if (!gridLine) {
            console.warn(".grid-line not found");
            return;
        }

        const ctaTransform = gsap.timeline({
            scrollTrigger: {
                trigger: ".train-cta-wrapper",
                start: "top 75%",
                end: "top 60%",
                scrub: true,
                onToggle: self => console.log("CTA ScrollTrigger toggled:", self.isActive)
            }
        });

        ctaTransform
        .to(".train-content-section", {
            backgroundColor: "white",
            onStart: () => console.log("bg -> white")
        })
        .to(".grid-line", {
            opacity: 0,
            onStart: () => console.log("gridline -> opacity")
        }, "<");
    });
    

    matchM.add("(min-width: 992px)", () => {
        console.log("matchMedia fired");
        const root = document.querySelector('.train-cta-wrapper')

        if (!root) {
            console.warn(".train-cta-wrapper not found");
            return;
        }

        const circles = root.querySelector('.circles')

        if (!circles) {
            console.warn(".circles not found");
            return;
        }

        let incr = 0,
            oldIncr = 0,
            firstMove = true,
            resetDist = window.innerWidth / 30
        
        root.addEventListener("mousemove", e => {
            const rect = root.getBoundingClientRect()
            const localX = e.clientX - rect.left
            const localY = e.clientY - rect.top

            if(firstMove) {
                oldX = e.clientX
                firstMove = false
                return
            }

            incr += Math.abs(e.clientX - oldX)
            oldX = e.clientX

            if(incr > resetDist) {
                incr = 0
                createCircle(localX, localY)
            }
        })

        const circleColors = [
            "#ff0000",
            "#00ff00",
            "#0000ff",
            "#ff00ff",
            "#ffff00",
            "#00ffff"
        ];

        function createCircle(x, y) {
            const circle = document.createElement("div")
            circle.className = "circle"

            const color = circleColors [Math.floor(Math.random() * circleColors.length)];
            circle.style.background = `${color}`;

            const cursor = document.querySelector('.cursor');
            if (cursor) {
                cursor.style.background = color;
            }

            circles.appendChild(circle)

            const tl = gsap.timeline({
                onStart: () => console.log("circle-create"),
                onComplete: () => {
                    circles.removeChild(circle);
                    tl && tl.kill()
                }
            })

            tl.fromTo(circle, {
                x,
                y,
                yPercent: -50,
                xPercent: -50,
                scaleX: 1,
                scaleY: 1,
            }, {
                scaleX: 0,
                scaleY: 0,
                ease: "power1.in",
                duration: 1,
            })
        }
    });
});
