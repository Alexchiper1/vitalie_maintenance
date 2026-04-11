/**
 * Reviews carousel for home page.
 * Loads data/reviews.json when available and falls back to inline data.
 */
(function () {
  const root = document.querySelector(".reviews-carousel");
  const track = document.getElementById("reviews-track");
  const viewport = document.querySelector(".reviews-viewport");
  const btnPrev = document.querySelector(".reviews-nav--prev");
  const btnNext = document.querySelector(".reviews-nav--next");
  const summaryText = document.getElementById("reviews-summary-text");
  const summaryBlock = document.getElementById("reviews-summary-block");

  if (!root || !track || !viewport) return;

  const FALLBACK_DATA = {
    google: {
      rating: 5,
      reviewCount: 4,
      location: "Clonee, Dublin 15",
    },
    reviews: [
      {
        author: "Julia R",
        stars: 5,
        text: "Amazing tiling job done in the downstairs bathroom, would highly recommend \ud83d\udc4d",
        when: "2 months ago",
      },
      {
        author: "Anna Maria Chiper",
        stars: 5,
        text:
          "I recently had these frames built onto my wall, quick fast & reliable work would recommend to anyone looking for any work done. very professional thank you \ud83e\udd70",
        when: "4 months ago",
      },
      {
        author: "Mateusz Kietrys",
        stars: 5,
        text: "",
        when: "4 months ago",
      },
    ],
  };

  const intervalMs = Math.max(1500, parseInt(root.dataset.interval || "2000", 10) || 2000);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let slideIndex = 0;
  let slideCount = 0;
  let timer = null;
  let touchStartX = null;

  function escapeHtml(value) {
    const el = document.createElement("div");
    el.textContent = value || "";
    return el.innerHTML;
  }

  function starString(count) {
    const safeCount = Math.max(0, Math.min(5, Number(count) || 0));
    return "\u2605".repeat(safeCount);
  }

  function renderSummary(data) {
    if (!summaryText || !data.google) return;

    const rating = Number(data.google.rating || 5);
    const ratingText = Number.isInteger(rating) ? String(rating) : rating.toFixed(1);
    const reviewCount = data.google.reviewCount || 0;
    const location = data.google.location || "Dublin";

    summaryText.innerHTML =
      `<strong>${ratingText}</strong> on Google \u00b7 ${reviewCount} reviews \u00b7 ${escapeHtml(location)}`;

    if (summaryBlock) {
      summaryBlock.setAttribute(
        "aria-label",
        `${ratingText} out of 5 stars on Google, based on ${reviewCount} reviews`
      );
    }
  }

  function renderSlides(data) {
    const reviews = Array.isArray(data.reviews) ? data.reviews : [];
    track.innerHTML = "";

    reviews.forEach((review) => {
      const slide = document.createElement("div");
      slide.className = "reviews-slide";
      slide.setAttribute("role", "group");
      slide.setAttribute("aria-roledescription", "slide");

      const text = (review.text || "").trim();
      const reviewBody = text
        ? `<p class="review-text">"${escapeHtml(text)}"</p>`
        : '<p class="review-text review-text--muted">5-star review on Google.</p>';

      slide.innerHTML = `
        <article class="review-card">
          <div class="review-card-top">
            <span class="review-author">${escapeHtml(review.author || "Customer")}</span>
            <span class="reviews-stars reviews-stars--sm" aria-label="${Number(review.stars) || 5} stars">${starString(review.stars || 5)}</span>
          </div>
          ${reviewBody}
          <p class="review-when">${escapeHtml(review.when || "")} \u00b7 Google review</p>
        </article>
      `;

      track.appendChild(slide);
    });

    slideCount = reviews.length;
    btnPrev.disabled = slideCount <= 1;
    btnNext.disabled = slideCount <= 1;
  }

  function slideWidth() {
    const firstSlide = track.querySelector(".reviews-slide");
    if (!firstSlide) return viewport.clientWidth;
    return firstSlide.getBoundingClientRect().width;
  }

  function applyTransform(animate) {
    const width = slideWidth();
    track.style.transition =
      animate && !reduceMotion ? "transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1)" : "none";
    track.style.transform = `translateX(-${slideIndex * width}px)`;
  }

  function stopTimer() {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  }

  function startTimer() {
    stopTimer();
    if (reduceMotion || slideCount <= 1) return;
    timer = setInterval(() => {
      nextSlide();
    }, intervalMs);
  }

  function resetTimer() {
    stopTimer();
    startTimer();
  }

  function nextSlide() {
    if (slideCount <= 1) return;
    slideIndex = (slideIndex + 1) % slideCount;
    applyTransform(true);
    resetTimer();
  }

  function prevSlide() {
    if (slideCount <= 1) return;
    slideIndex = (slideIndex - 1 + slideCount) % slideCount;
    applyTransform(true);
    resetTimer();
  }

  async function loadReviews() {
    try {
      const response = await fetch("data/reviews.json", { cache: "default" });
      if (!response.ok) throw new Error("Failed to fetch reviews");
      return await response.json();
    } catch (_error) {
      return FALLBACK_DATA;
    }
  }

  loadReviews().then((data) => {
    renderSummary(data);
    renderSlides(data);

    if (!slideCount) {
      track.innerHTML =
        '<div class="reviews-slide"><article class="review-card"><p class="review-text review-text--muted">Reviews will appear here soon.</p></article></div>';
      slideCount = 1;
    }

    slideIndex = 0;
    applyTransform(false);
    requestAnimationFrame(() => applyTransform(false));
    startTimer();
  });

  btnPrev?.addEventListener("click", prevSlide);
  btnNext?.addEventListener("click", nextSlide);

  viewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      prevSlide();
      event.preventDefault();
    }
    if (event.key === "ArrowRight") {
      nextSlide();
      event.preventDefault();
    }
  });

  viewport.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.touches[0]?.screenX ?? null;
    },
    { passive: true }
  );

  viewport.addEventListener(
    "touchend",
    (event) => {
      if (touchStartX == null) return;
      const touchEndX = event.changedTouches[0]?.screenX ?? touchStartX;
      const delta = touchEndX - touchStartX;
      touchStartX = null;

      if (Math.abs(delta) < 40) return;
      if (delta > 0) prevSlide();
      else nextSlide();
    },
    { passive: true }
  );

  root.addEventListener("mouseenter", stopTimer);
  root.addEventListener("mouseleave", startTimer);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopTimer();
    else startTimer();
  });

  window.addEventListener("resize", () => {
    applyTransform(false);
  });
})();
