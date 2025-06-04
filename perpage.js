console.log("per-page connected - v3");

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
})
