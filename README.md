# IronPeak Fitness Website

A fully responsive, multi-section fitness landing page engineered with performance-focused front-end practices and modern interaction patterns — built using **vanilla HTML, CSS, and JavaScript**.

This project emphasizes **animation systems, UI interaction design, and smooth scrolling architecture** without relying on frameworks.

---

## 🚀 Features

### Core UI Sections

* Loader screen with animated progress bar
* Sticky navigation with blur-on-scroll + mobile hamburger menu
* Hero section with parallax background and animated text
* About / Our Story (two-column layout with layered visuals)
* Why Choose Us (feature grid with full-width background)
* Classes grid with interactive cards
* Trainers section with hover overlays
* Marquee ticker strip
* Testimonials with user avatars
* Pricing section (featured tier scaling)
* CTA banner
* Contact form with validation + success feedback
* Footer with structured navigation

---

## ⚡ Interaction & Animation System

* **Lenis Smooth Scroll (CDN-based)**

  * Custom-tuned duration and easing
  * Dynamic scroll speed based on viewport proximity
  * Scroll “brake” effect near section boundaries

* **Scroll Animations**

  * IntersectionObserver-based reveal system
  * Staggered grid animations
  * Hero entry sequence

* **UI Effects**

  * 3D tilt interaction on cards
  * Parallax hero background
  * Animated stat counters
  * Custom cursor with follower
  * Toast notifications

---

## 🧠 Functional Behavior

### Modals (Fully Wired)

* Free Trial Modal
* Booking Modal (auto-filled based on class)
* Pricing Join Modal

Each modal includes:

* Form validation
* Escape key support
* Backdrop click dismissal
* Scroll lock (Lenis pause/resume)

---

## 📁 Project Structure

fitfactory/
├── index.html
├── css/
│   └── style.css
└── js/
└── main.js

---

## 🛠️ Tech Stack

* HTML5 (semantic structure)
* CSS3 (custom properties, responsive design)
* JavaScript (ES6+)
* Lenis (smooth scrolling via CDN)

---

## 📦 Installation & Usage

No build tools or dependencies required.

1. Download or clone the repository
2. Maintain the folder structure
3. Open `index.html` in any browser

---

## 🌐 Deployment

You can deploy instantly using:

* Netlify (drag & drop)
* Vercel
* GitHub Pages
* cPanel hosting

---

## ⚠️ Known Limitations (Be honest — this matters)

* No component-based architecture (not scalable for large apps)
* No accessibility audit (ARIA roles, focus management incomplete)
* No performance optimization (lazy loading, image compression not enforced)
* Animations may impact low-end devices
* No state management abstraction (modals handled imperatively)

---

## 🔥 Future Improvements

* Convert to React / Next.js for scalability
* Add GSAP for timeline-based animation control
* Implement accessibility standards (WCAG)
* Add backend integration for forms
* Optimize images and introduce lazy loading
* Introduce reusable component system

---

## 👤 Author

Built as a front-end engineering and UI/UX exploration project.

---

## 💡 Positioning Tip

This is **not just a landing page**. It’s an **interaction-heavy front-end system**.

If you present it in interviews, expect questions like:

* Why Lenis over native scroll-behavior?
* How would you refactor this into reusable components?
* How would you handle animation performance at scale?
* What breaks when content becomes dynamic?

Be ready to answer those — otherwise this looks like surface-level polish.
