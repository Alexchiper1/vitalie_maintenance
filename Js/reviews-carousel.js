/**
 * Reviews carousel: loads data/reviews.json (edit that file when new reviews appear).
 * Pulling reviews live from Google requires Google Places / Business APIs and a backend
 * to keep your API key secret — this static JSON + redeploy is the usual approach here.
 */
(function () {
  const DEFAULT_DATA = {
    google: { rating: 5, reviewCount: 4, location: "Clonee, Dublin 15" },
    reviews: [
      {
        author: "Julia R",
        stars: 5,
        text: "Amazing tiling job done in the downstairs bathroom, would highly recommend 👍",
        when: "2 months ago",
      },
      {
        author: "Anna Maria Chiper",
        stars: 5,
        text:
          "I recently had these frames built onto my wall, quick fast & reliable work would recommend to anyone looking for any work done. very professional thank you 🥰",
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

  const JSON_URL = "data/reviews.json";
  const root = document.querySelector(".reviews-carousel");
  const track = document.getElementById("reviews-track");
  const btnPrev = document.querySelector(".reviews-nav--prev");
  const btnNext = document.querySelector(".reviews-nav--next");
  const viewport = document.querySelector(".reviews-viewport");
  const summaryEl = document.getElementById("reviews-summary-text");
  const summaryRegion = document.getElementById("reviews-summary-block");

  if (!root || !track) return;

  const intervalMs = Math.max(1500, parseInt(root.dataset.interval || "2000", 10) || 2000);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function starsHtml(n) {
    const c = Math.min(5, Math.max(0, Number(n) || 0));
    return "★".repeat(c);
  }

  function escapeHtml(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function renderSummary(data) {
    if (!summaryEl || !data.google) return;
    const g = data.google;
    const r = Number(g.rating);
    const ratingStr = Number.isInteger(r) ? String(r) : (Math.round(r * 10) / 10).toString();
    summaryEl.innerHTML = `<strong>${ratingStr}</strong> on Google · ${g.reviewCount} reviews · ${escapeHtml(g.location || "")}`;
    if (summaryRegion) {
      summaryRegion.setAttribute(
        "aria-label",
        `${ratingStr} out of 5 stars on Google, based on ${g.reviewCount} reviews`
      );
    }
  }

  function renderSlides(data) {
    const list = Array.isArray(data.reviews) ? data.reviews : [];
    track.innerHTML = "";
    list.forEach((rev) => {
      const slide = document.createElement("div");
      slide.className = "reviews-slide";
      slide.setAttribute("role", "group");
      slide.setAttribute("aria-roledescription", "slide");

      const stars = starsHtml(rev.stars);
      const text = (rev.text || "").trim();
      const body = text
        ? `<p class="review-text">“${escapeHtml(text)}”</p>`
        : `<p class="review-text review-text--muted">5-star review on Google.</p>`;

      slide.innerHTML = `
        <article class="review-card">
          <div class="review-card-top">
            <span class="review-author">${escapeHtml(rev.author || "Customer")}</span>
            <span class="reviews-stars reviews-stars--sm" aria-label="${Number(rev.stars) || 5} stars">${stars}</span>
          </div>
          ${body}
          <p class="review-when">${escapeHtml(rev.when || "")} · Google review</p>
        </article>`;
      track.appendChild(slide);
    });

    return list.length;
  }

  let index = 0;
  let timer = null;
  let slidesCount = 0;
  let touchStartX = null;

  function slideStepPx() {
    if (!viewport) return 0;
    const first = track.querySelector(".reviews-slide");
    if (first) return first.getBoundingClientRect().width;
    return viewport.clientWidth || viewport.getBoundingClientRect().width;
  }

  function applyTransform(smooth) {
    if (!track) return;
    const useMotion = smooth && !reduceMotion;
    track.style.transition = useMotion ? "transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1)" : "none";
    // Pixel offset: each slide is one “step” wide (avoids % translate bugs vs track width)
    const step = slideStepPx();
    track.style.transform = `translateX(-${index * step}px)`;
    root.dataset.slide = String(index + 1);
    root.dataset.slides = String(slidesCount);
  }

  function go(delta) {
    if (slidesCount <= 1) return;
    const next = (index + delta + slidesCount) % slidesCount;
    const wrapForward = delta > 0 && index === slidesCount - 1 && next === 0;
    const wrapBack = delta < 0 && index === 0 && next === slidesCount - 1;
    if (wrapForward || wrapBack) {
      index = next;
      applyTransform(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          track.style.transition = reduceMotion ? "none" : "transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1)";
        });
      });
    } else {
      index = next;
      applyTransform(true);
    }
    resetTimer();
  }

  function next() {
    go(1);
  }

  function prev() {
    go(-1);
  }

  function clearTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function startTimer() {
    clearTimer();
    if (reduceMotion || slidesCount <= 1) return;
    timer = setInterval(next, intervalMs);
  }

  function resetTimer() {
    clearTimer();
    startTimer();
  }

  function onVisibility() {
    if (document.hidden) clearTimer();
    else startTimer();
  }

  async function loadData() {
    try {
      const res = await fetch(JSON_URL, { cache: "default" });
      if (!res.ok) throw new Error("bad status");
      return await res.json();
    } catch {
      return DEFAULT_DATA;
    }
  }

  loadData().then((data) => {
    renderSummary(data);
    slidesCount = renderSlides(data);
    if (slidesCount === 0) {
      track.innerHTML =
        '<div class="reviews-slide"><p class="review-text review-text--muted">Reviews loading…</p></div>';
      slidesCount = 1;
    }
    applyTransform(false);
    requestAnimationFrame(() => applyTransform(false));
    btnPrev.disabled = slidesCount <= 1;
    btnNext.disabled = slidesCount <= 1;

    btnPrev?.addEventListener("click", () => {
      prev();
    });
    btnNext?.addEventListener("click", () => {
      next();
    });

    root.addEventListener("mouseenter", clearTimer);
    root.addEventListener("mouseleave", startTimer);

    viewport?.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        prev();
        e.preventDefault();
      } else if (e.key === "ArrowRight") {
        next();
        e.preventDefault();
      }
    });

    viewport?.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0]?.screenX ?? null;
      },
      { passive: true }
    );
    viewport?.addEventListener(
      "touchend",
      (e) => {
        if (touchStartX == null) return;
        const dx = e.changedTouches[0].screenX - touchStartX;
        touchStartX = null;
        if (Math.abs(dx) < 50) return;
        if (dx > 0) prev();
        else next();
      },
      { passive: true }
    );

    document.addEventListener("visibilitychange", onVisibility);

    const io =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((en) => {
                if (en.isIntersecting) startTimer();
                else clearTimer();
              });
            },
            { threshold: 0.2 }
          )
        : null;
    if (io) io.observe(root);
    else startTimer();

    let resizeTick;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTick);
      resizeTick = setTimeout(() => applyTransform(false), 80);
    });
  });
})();
