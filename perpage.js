console.log("per-page connected - v4");

document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollSmoother, SplitText)

    const matchMedia = gsap.matchMedia();

    // Hover Animation for Nav
    matchMedia.add("(min-width: 992px)", () => {
        document.fonts.ready.then(() => {
            document.querySelectorAll(".menu-link-text-wrapper, .button-text-wrapper").forEach(wrapper => {
                const visible = wrapper.querySelector(".nav-visible[nav-split]");
                const hidden = wrapper.querySelector(".nav-hidden[nav-split]");

                if (!visible || !hidden) return;

                const visibleSplit = new SplitText(visible, {
                    type: "lines, chars",
                    mask: "lines",
                    autoSplit: true,
                });

                const hiddenSplit = new SplitText(hidden, {
                    type: "lines, chars",
                    mask: "lines",
                    autoSplit: true,
                });

                gsap.set(hiddenSplit.chars, { yPercent: -100 });

                const navHover = gsap.timeline({ paused: true, reversed: true});
                
                navHover
                .to(visibleSplit.chars, {
                    yPercent: 100,
                    duration: 0.4,
                    stagger: 0.01,
                }, 0)
                .to(hiddenSplit.chars, {
                    yPercent: 0,
                    duration: 0.4,
                    stagger: 0.01,
                }, 0);

                wrapper.addEventListener("mouseenter", () => navHover.play());
                wrapper.addEventListener("mouseleave", () => navHover.reverse());
            });
        });
    });
    

    // Initialize ScrollSmoother, Desktop only
    matchMedia.add("(min-width: 768px)", () => {
        ScrollSmoother.create({
            wrapper: "#smooth-wrapper",
            content: "#smooth-content",
            smooth: 1,
            effects: true,
            ignoreMobileResize: true,
            normalizeScroll: true
        });
    });

    // Mouse Follow Animation
    gsap.set(".cursor", {xPercent: -50, yPercent: -50});

    let xTo = gsap.quickTo(".cursor", "x", {duration: 0.01, ease: "none"}),
        yTo = gsap.quickTo(".cursor", "y", {duration: 0.01, ease: "none"});

    window.addEventListener("mousemove", m => {
        xTo(m.clientX);
        yTo(m.clientY);
    });

    // Event listener for resizing / reload on resize
    let resizeTimeout;
    let initialWidth = window.innerWidth;
    
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (Math.abs(window.innerWidth - initialWidth) > 50) {
          const scrollY = window.scrollY;
          sessionStorage.setItem("scrollY", scrollY);
          location.reload();
        }
      }, 250);
    });
    
    window.addEventListener("load", () => {
      const savedScrollY = sessionStorage.getItem("scrollY");
      if (savedScrollY !== null) {
        window.scrollTo(0, parseInt(savedScrollY));
        sessionStorage.removeItem("scrollY");
      }
    });

    // Menu animation
    const mobileTrigger = document.querySelector(".nav-links-mobile");
    const mobileLinksWrapper = document.querySelector(".dropdown-mobile");

    if (mobileTrigger && mobileLinksWrapper) {
        const mobileLinks = mobileLinksWrapper.querySelectorAll(".row-reverse");

        gsap.set(".dropdown-mobile", { display: "none", xPercent: 100 });
        gsap.set(".menu-icon-embed", { rotation: 0 });
        gsap.set(".nav", { mixBlendMode: "difference" });

        mobileTrigger.dataset.open = "false";
        
        function closeMenu() {
            let menuClose = gsap.timeline();

            menuClose
            .to(".dropdown-mobile", { xPercent: 100, duration: 0.5 })
            .to(".menu-icon-embed", { rotation: 0, duration: 0.5 }, "<")
            .set(".nav", { mixBlendMode: "difference" })
            .set(".dropdown-mobile", { display: "none" }, "<")

            mobileTrigger.dataset.open = "false";
        };

        mobileTrigger.addEventListener("click", () => {
            const isClosed = mobileTrigger.dataset.open === "false";

            if (isClosed) {
                let menuOpen = gsap.timeline();

                menuOpen
                .set(".dropdown-mobile", { display: "flex" })
                .set(".nav", { mixBlendMode: "normal" })
                .to(".dropdown-mobile", { xPercent: 0, duration: 0.8 }, "<")
                .to(".menu-icon-embed", { rotation: 45, duration: 0.8 }, "<")

                mobileTrigger.dataset.open = "true";
            } else {
                closeMenu();
            }
        });

        mobileLinks.forEach(link => {
            link.addEventListener("click", closeMenu)
        });
    }
    
    // Footer animation
    // Load Lottie
    const FooterLottie = lottie.loadAnimation({
        container: document.getElementById("footer-lottie"),
        path: "https://cdn.prod.website-files.com/682387662b01db59008838c3/683629ba33408738443b5730_Distillery_LogoLayers_052725.json",
        renderer: "svg",
        autoplay: false,
    });

    // Deliverables timeline
    const FooterAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".footer",
            start: "bottom bottom",
            end: "+=250",
            pin: ".footer",
            scrub: true,
            onUpdate: function (self) {
                const progress = self.progress;
                FooterLottie.goToAndStop((FooterLottie.totalFrames - 1) * progress, true);
            },
        }
    });

    FooterAnimation
    .fromTo("html", { "--colors--black": "#000000" }, { "--colors--black": "#ffffff" }, "<");
});
