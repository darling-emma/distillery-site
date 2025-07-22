console.log("connected - cases - V1");

$(document).ready(function() {
    // Assign ID + DATA-ID
    $('.case-studies-item').each(function() {
        const idText = $(this).children('.idtext').text().trim();
        $(this).attr('id', 'item-' + idText);
    });

    $('.case-modal-item').each(function() {
        const dataIdText = $(this).children('.idtext').text().trim();
        $(this).attr('data-id', 'item-' + dataIdText);
    });
    
    $(window).on("load", function() {
        gsap.to(".smooth-wrapper", { autoAlpha: 1, duration: 1 });
    });

    // Hover and Click Animation
    const gridItems = document.querySelectorAll(".case-studies-item");
    console.log("grid items", gridItems.length);
    const modalItems = document.querySelectorAll(".case-modal-item");
    console.log("modal items", modalItems.length);

    gsap.set(".grid-modal", { display: "none", opacity: 0 });
    gsap.set(modalItems, { display: "none", opacity: 0 });

    let modalIsOpen = false;

    gridItems.forEach(item => {
        const id = item.id;
        const relatedModal = document.querySelector(`.case-modal-item[data-id="${id}"]`);
        const itemText = item.querySelector('.caption');
        const itemImage = item.querySelector('.case-image-wrapper');
        const originalHeight = itemImage.getBoundingClientRect().height;

        let suppressHoverOut = false;

        // Defining freeze scroll function
        function freezeScroll() {
            if (ScrollSmoother.get() && !ScrollTrigger.isTouch) {
                ScrollSmoother.get().paused(true);
                document.querySelector(".smooth-wrapper").style.pointerEvents = "none";
            } else {
                document.body.style.overflow = "hidden";
                document.body.style.touchAction = "none";
            }
        }

        // Defining resume scroll function
        function resumeScroll() {
            if (ScrollSmoother.get() && !ScrollTrigger.isTouch) {
                ScrollSmoother.get().paused(false);
                document.querySelector(".smooth-wrapper").style.pointerEvents = "auto";
            } else {
                document.body.style.overflow = "";
                document.body.style.touchAction = "";
            }
        }

        // Defining close animation
        function closeModal() {
            if (!relatedModal) return;

            const modalImage = relatedModal.querySelector(".modal-image");
            const modalImageHeight = modalImage.getBoundingClientRect().height;
            const modalHeader = relatedModal.querySelector(".case-head-wrapper");
            const modalText = relatedModal.querySelector(".modal-right");
            const modalBackground = document.querySelector(".grid-modal");

            let modalCloseTimeline = gsap.timeline();

            modalCloseTimeline
            .to(modalImage, { height: 0, duration: 0.2, ease: "power1.out" })
            .to([modalText, modalHeader], { opacity: 0, duration: 0.2 }, "<")
            .to([modalBackground, relatedModal], { opacity: 0, duration: 0.2 }, "<")
            .set([modalBackground, relatedModal], { display: "none" })
            .set("body", { backgroundColor: "#ffffff" }, "<")
            .set(".card", { "--_grid---line-color": "#d9d9d9" }, "<")
            .to(itemImage, { height: originalHeight, duration: 0.3, ease: "power1.out" }, "<")
            .to(itemText, { opacity: 1, color: "#000000", duration: 0.3 }, "<")
            .set(modalImage, { height: modalImageHeight })
            .set([modalHeader, modalText], { opacity: 1 });  

            gridItems.forEach(item => {
                gsap.to(item, { opacity: 1, duration: 0.3, delay: 0.2 })
            });

            resumeScroll();
        }

        let hoverInTimeoutId = null;
        
        // Hover In Animation
        item.addEventListener('mouseenter', () => {
            if (hoverInTimeoutId) clearTimeout(hoverInTimeoutId);
            hoverInTimeoutId = setTimeout(() => {
                let hoverInTL = gsap.timeline();

                hoverInTL
                .to("body", { backgroundColor: "#000000", duration: 0.5 })
                .to(itemText, { color: "#ffffff", duration: 0.5 }, "<")
                .to(".card", { "--_grid---line-color": "#000000", duration: 0.5 }, "<")

                gridItems.forEach(other => {
                    if(other !== item) {
                        gsap.to(other, { opacity: 0, duration: 0.5 });
                    } else {
                        gsap.to(other, { opacity: 1, duration: 0.5 });
                    }
                });
            }, 100)
        });

        item.addEventListener('mousedown', () => {
            suppressHoverOut = true;
        });

        // Hover Out Animation
        item.addEventListener('mouseleave', () => {
            if (hoverInTimeoutId) {
                clearTimeout(hoverInTimeoutId);
                hoverInTimeoutId = null;
            }
            if (suppressHoverOut) {
                suppressHoverOut = false;
                return;
            }

            let hoverOutTL = gsap.timeline();

            hoverOutTL
            .to("body", { backgroundColor: "#ffffff", duration: 0.5 })
            .to(itemText, { color: "#000000", duration: 0.5 }, "<")
            .to(".card", { "--_grid---line-color": "#d9d9d9", duration: 0.5 }, "<");

            gridItems.forEach(item => {
                gsap.to(item, { opacity: 1, duration: 0.5 })
            });
        });

        // Click Animation
        item.addEventListener('click', () => {
            modalIsOpen = true;
            
            const modalImage = relatedModal.querySelector(".modal-image");
            const modalHeader = relatedModal.querySelector(".case-head-wrapper");
            const modalText = relatedModal.querySelector(".modal-right");

            let modalRevealTimeline = gsap.timeline();

            modalRevealTimeline
            .set(".card", { "--_grid---line-color": "#000000" })
            .set("body", { backgroundColor: "#000000" }, "<")
            .set(itemText, { opacity: 0 }, "<")
            .to(itemImage, { height: 0, duration: 0.2, ease: "power1.out" }, "<")
            .set(".grid-modal", { display: "block" }, "<")
            .set(relatedModal, { display: "flex" }, "<")
            .to(".grid-modal", { opacity: 1, duration: 0.3 })
            .to(relatedModal, { opacity: 1, duration: 0.3 }, "<")
            .from(modalImage, { height: 0, duration: 0.3, ease: "power1.out" }, "<")
            .from([modalHeader, modalText], { opacity: 0, duration: 0.3 }, "<");

            freezeScroll();
        });

        const closeWrapper = relatedModal.querySelector(".close-wrapper");
        if (closeWrapper) {
            closeWrapper.addEventListener("click", () => {
                closeModal();
                modalIsOpen = false;
            });
        }
    });

    window.addEventListener('mouseout', function(e) {
        if (modalIsOpen) return;
        // Only trigger if mouse leaves the window, not just an element
        if (!e.relatedTarget && !e.toElement) {
            // Reset hover state
            gsap.to("body", { backgroundColor: "#ffffff", duration: 0.5 });
            document.querySelectorAll('.card').forEach(card => {
                card.style.setProperty('--_grid---line-color', '#bfbfbf');
            });
            gridItems.forEach(item => {
                const itemText = item.querySelector('.caption');
                gsap.to(itemText, { color: "#000000", duration: 0.5 });
                gsap.to(item, { opacity: 1, duration: 0.5 });
            });
        }
    });
});
