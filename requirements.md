# Alladin Cafe: Requirements Document

| Field | Value |
|---|---|
| **Project Name** | Alladin Cafe |
| **Type** | Full stack cafe website (customer site, online ordering, reservations, admin panel, AI assistant) |
| **Frontend** | React (Vite) |
| **Backend** | Node.js (Express) |
| **Agent** | Python (FastAPI) |
| **Data** | Dummy/seed data only (no real payments, no real customer data) |
| **Version** | 1.0 |
| **Date** | 2026-09-29 |

---

## Table of Contents

1. Project Overview
2. Tech Stack
3. Brand and Design System
4. Functional Requirements
5. Non-Functional Requirements
6. Project Structure
7. Data Models
8. API Endpoints
9. AI Agent Design
10. Dummy Data Requirements
11. Page Section Details
12. Environment Variables
13. Setup and Run
14. Development Phases
15. Acceptance Criteria
16. Out of Scope

---

## 1. Project Overview

Alladin Cafe is a modern website for a neighborhood cafe that is also a calm place to study and work. The site should look like today's popular cafe brands: large food and coffee photos, bold editorial typography, plenty of white space, and smooth, restrained motion. Visitors can browse the menu, order online, reserve a table or study desk, learn about the cafe, and chat with an AI assistant that knows the real menu.

### 1.1 Goals
- Make a strong first impression and bring in new customers.
- Let customers browse the menu, add items to a cart, and place an order (dummy checkout).
- Let customers reserve a table or a study desk.
- Provide an AI assistant that answers questions about the menu, opening hours, offers, and seating, and can start a reservation.
- Give staff an admin panel to manage the menu, orders, reservations, offers, and testimonials.
- Deliver a fast, accessible, mobile-first experience that looks hand-crafted.

### 1.2 Target Users

| User | Needs |
|---|---|
| Students and freelancers | Quiet seating, Wi-Fi, power sockets, long hours, study passes |
| Coffee lovers and casual visitors | Attractive menu, quick ordering, offers |
| Groups and friends | Table reservations |
| Cafe staff / admin | Manage menu, orders, reservations, offers, testimonials |

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (Vite), React Router v6, Context API (auth, cart), Framer Motion (animation), CSS Modules, Axios |
| Backend | Node.js 18+, Express.js, JWT, bcrypt, express-validator, Helmet, CORS, express-rate-limit, Morgan |
| Database | MongoDB with Mongoose, seeded with dummy data |
| Agent | Python 3.10+, FastAPI, Uvicorn, Pydantic, httpx, LLM API client (e.g., Anthropic Claude) |
| Tooling | ESLint, Prettier, dotenv, Nodemon, Docker Compose (optional) |

---

## 3. Brand and Design System

### 3.1 Color Scheme

The UI uses three **brand colors** and a small set of **neutrals**. No other colors are allowed.

**Brand colors**

| Token | Name | Hex | Role |
|---|---|---|---|
| `--color-purple` | Study Purple | `#4B2C91` | Primary brand color: primary buttons, dark sections, footer, prices on light backgrounds, active states |
| `--color-blue` | Focus Blue | `#1D80C3` | Secondary: large display accents, icons, focus ring, "open now" status, chat button, study-space accents |
| `--color-gold` | Crema Gold | `#D6B83C` | Accent: button hover, highlights on dark backgrounds, badges, reservation call-to-action band, prices on dark |

**Neutrals**

| Token | Name | Hex | Role |
|---|---|---|---|
| `--color-black` | Black | `#000000` | Body text and headings |
| `--color-white` | White | `#FFFFFF` | Cards, text on purple |
| `--color-offwhite` | Off White | `#EEEEEE` | Page background, section alternation |
| `--color-gray` | Light Gray | `#DDDDDD` | Borders, dividers, disabled states, input outlines, skeleton loaders |

Transparent versions of these colors (e.g., white at 70% opacity for secondary text on purple) are allowed. New hues are not.

**Contrast rules (WCAG AA, measured):**

| Foreground on Background | Ratio | Allowed use |
|---|---|---|
| White on Purple | 10.2:1 | All text |
| Purple on Off White | 8.8:1 | All text (prices, links, labels) |
| Black on Gold | 10.8:1 | All text; gold buttons always use black text |
| Gold on Black | 10.8:1 | All text |
| Gold on Purple | 5.2:1 | All text (footer highlights, prices on purple) |
| Black on Blue | 4.9:1 | All text |
| White on Blue | 4.3:1 | Large text only (24px+, or 18.7px+ bold) and icons |
| Blue on White / Off White | 4.3:1 / 3.7:1 | Large display text, icons, and focus rings only; never body text |
| Gold on White / Off White | under 2:1 | Never as text; fills only |
| Blue on Purple | 2.4:1 | Never combine for text |

### 3.1.1 Button styles

| Variant | Default | Hover |
|---|---|---|
| Primary | Purple background, white text | Gold background, black text |
| Accent | Gold background, black text | White background, black text |
| Ghost | Transparent, black text, gray border | Purple border and purple text |
| On dark | White background, black text | Gold background, black text |
| Ghost light (on purple) | Transparent, white text, white 28% border | White background, black text |

### 3.2 Typography

| Role | Font | Size (desktop / mobile) | Weight |
|---|---|---|---|
| Hero headline | Fraunces (variable serif) | 88px / 44px | 500, with an italic accent word |
| H1 page title | Fraunces | 64px / 38px | 500 |
| H2 section title | Fraunces | 44px / 30px | 500 |
| H3 card title | Manrope (variable sans) | 20px / 18px | 700 |
| Body | Manrope | 17px / 16px | 400 |
| Small / label | Manrope | 13px | 700, uppercase with letter-spacing 0.12em |
| Price | Manrope | 18px | 700, purple (gold on dark) |

- Line height: 1.05 to 1.15 for display headings and 1.65 for body text.
- Fonts are self-hosted with `@fontsource-variable` packages (no external font requests), using `font-display: swap`.
- Signature detail: one word in each large headline is set in Fraunces italic in Focus Blue (large text only, so contrast passes).

### 3.3 Spacing, Radius, and Shadow Tokens

| Token | Value |
|---|---|
| Spacing scale | 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px |
| Section vertical padding | 96px desktop, 64px mobile |
| Container max width | 1280px, with 24px side padding (16px on mobile) |
| Radius | small 12px (inputs, buttons), medium 16px (cards), large 20px (images, modals); pills use 999px |
| Shadow soft | `0 4px 20px rgba(0,0,0,0.06)` |
| Shadow lift (hover) | `0 12px 32px rgba(0,0,0,0.10)` |

### 3.4 Art Style (Popular Cafe Website Look)
- Full-width hero with large coffee or food photography and a bold serif headline.
- Large, high-quality product photos with rounded corners and consistent aspect ratios (4:5 for cards, 16:9 for banners).
- Card-based menu: image, name, short description, price, and "Add" button.
- Alternating full-width sections (off-white, white, and purple, with one gold call-to-action band) to create rhythm.
- Editorial layout: large type, generous spacing, asymmetric image placement (for example, an image offset to one side with text overlapping a little).
- Sticky, minimal navbar: transparent over the hero, then solid off-white with a soft shadow after scrolling.
- Consistent rounded corners and soft shadows throughout.
- Real photography does the decorating, not icons or shapes.

### 3.5 Design Restrictions (Important)

The design must look hand-crafted and professional, not auto-generated. **Do not use:**
- Decorative dots, dotted patterns, dot grids, or dotted borders
- Vertical or horizontal side lines, or accent lines along the left or right edge of sections, cards, or quotes
- Random gradient blobs, glowing orbs, noise textures, or generic template decorations
- Gradients of any kind in backgrounds or text
- Too many icons or badges, or emoji used in place of real images
- Numbered decorative circles, floating shapes, or "sparkle" graphics
- Cluttered layouts, or any color outside the three brand colors and the neutrals in 3.1

Icons are allowed only where they carry meaning (cart, close, menu, chat, social links), using one thin-stroke icon set (e.g., Lucide) in black or white.

### 3.6 Animation and Transitions

Animations should be simple, smooth, and have a purpose. Only `transform` and `opacity` are animated, to avoid layout jank.

| Element | Animation | Duration / Easing |
|---|---|---|
| Page transition | Fade in and rise 16px | 300ms, ease-out |
| Scroll reveal (sections, cards) | Fade in and rise 24px, staggered 60ms per card | 500ms, ease-out, runs once |
| Hero text | Headline lines reveal one after another | 600ms, 100ms stagger |
| Hero image | Slow zoom from 1.08 to 1.0, or light parallax | 1.5s, ease-out |
| Buttons | Background color changes (purple to gold), lift 2px | 200ms |
| Cards | Lift 6px, stronger shadow, image zoom 1.05 inside the frame | 250ms |
| Navbar | Background and shadow fade in on scroll | 250ms |
| Mobile menu | Drawer slides in, links fade in with stagger | 300ms |
| Cart drawer | Slides in from the right, backdrop fades in | 300ms |
| Menu filter | Animated layout change (Framer Motion `layout`) | 350ms |
| Modal / lightbox | Scale from 0.96 to 1 with fade | 250ms |
| Testimonials | Crossfade and slide between slides | 400ms |
| Chat panel | Scale from the button corner and fade | 250ms |

- Respect `prefers-reduced-motion`: turn off movement and keep only instant or opacity changes.
- No looping, bouncing, or distracting animation, and no animation that lowers the Lighthouse score.

---

## 4. Functional Requirements

### 4.1 Public Pages

| # | Page | Route | Key features |
|---|---|---|---|
| 1 | Home | `/` | Hero, featured items, about teaser, study-space highlight, offers, testimonials, gallery preview, reservation call to action |
| 2 | Menu | `/menu` | Category tabs (Coffee, Cold Drinks, Bakery, Snacks, Meals, Desserts), search, filters (veg, popular, price range), sorting, item cards, item detail modal |
| 3 | About | `/about` | Cafe story, team, values, study-friendly features (Wi-Fi, sockets, quiet zones) |
| 4 | Study Space | `/study-space` | Seating zones, house rules, passes and pricing (dummy), availability preview, "Book a desk" button |
| 5 | Reservations | `/reserve` | Date, time slot, guests, seat type (table or study desk), contact details, notes, confirmation screen |
| 6 | Gallery | `/gallery` | Masonry image grid, category filter, lightbox with keyboard navigation |
| 7 | Contact | `/contact` | Address, map placeholder, phone, email, opening hours, message form |
| 8 | Checkout | `/checkout` | Item list, quantity control, order notes, pickup or dine-in option, dummy payment (cash, card, wallet), order confirmation |
| 9 | Login / Register | `/login`, `/register` | Customer accounts with validation |
| 10 | Profile | `/profile` | Order history, reservations, edit saved details |
| 11 | 404 | `*` | Friendly message with an image and links back to Home and Menu |

**Cart behavior**
- The cart drawer opens from the navbar cart icon and after "Add to cart".
- The cart is kept in `localStorage` so it survives a page refresh.
- Customers can change quantity, remove items, and see subtotal, tax (dummy 8%), and total.
- Checkout requires login; a guest is sent to login and brought back to checkout afterwards.

**Reservation rules**
- Open times: 08:00 to 22:00 in 30-minute slots; dates from today up to 30 days ahead.
- Tables: 1 to 8 guests. Study desks: 1 guest per booking.
- Guests can reserve without an account; logged-in users have their details filled in automatically.
- New reservations start as `pending`.

### 4.2 Admin Panel (`/admin`)

| Page | Features |
|---|---|
| Admin login | Same login form; admin role redirects to `/admin` |
| Dashboard | Today's orders, today's reservations, revenue (dummy), popular items, recent orders table |
| Manage Menu | Create, edit, delete items and categories; toggle availability; upload or pick image URL |
| Manage Orders | Filter by status; update status (Pending, Preparing, Ready, Completed, Cancelled) |
| Manage Reservations | Approve, reject, or reschedule; filter by date and status |
| Manage Offers | Create, edit, delete, activate or deactivate |
| Manage Testimonials | Create, edit, delete, show or hide |
| Messages | View contact form messages and mark them as read |

### 4.3 AI Agent (Python)
- Floating chat button (bottom-right) that opens a chat panel on every public page.
- Answers questions about menu items, ingredients, prices, opening hours, offers, study-space rules, and location.
- Recommends drinks and food based on mood or taste (for example, "something strong and not sweet").
- Helps start a reservation: collects date, time, guests, seat type, name, and phone, confirms the details with the user, then calls the backend reservations API.
- Grounded in cafe data fetched from the backend; must never invent items, prices, or offers.
- Falls back politely when it doesn't know an answer and suggests contacting the cafe.
- Short conversation memory per session (last 10 turns, expires after 30 minutes idle).
- Shows quick-reply chips such as "Today's offers", "Recommend a coffee", and "Book a table".

### 4.4 Authentication and Authorization
- Register, login, and logout, with passwords hashed using bcrypt (10+ salt rounds).
- JWT access token (15 min) and refresh token (7 days, httpOnly cookie).
- Roles: `customer` and `admin`.
- Protected routes on the frontend (`ProtectedRoute`, `AdminRoute`) and backend (`protect`, `authorize('admin')`).

---

## 5. Non-Functional Requirements

| Area | Requirement |
|---|---|
| Performance | Lighthouse performance 90+ on desktop and 80+ on mobile; lazy-load routes and images; WebP images with `srcset`; code-split the admin panel |
| Responsive | Mobile-first; breakpoints at 480, 768, 1024, and 1280px |
| Accessibility | Semantic HTML, alt text, keyboard navigation, visible focus ring (3px Focus Blue outline with 3px offset), focus trap in modals and drawers, WCAG AA contrast (see 3.1) |
| SEO | Unique page titles and meta descriptions, Open Graph tags, clean URLs, `sitemap.xml`, `robots.txt` |
| Security | Input validation and sanitization, rate limiting (auth: 10 per 15 min; chat: 20 per min), CORS limited to the frontend origin, Helmet, secrets in `.env`, no stack traces in production responses |
| Maintainability | Modular code, one component per file, consistent naming (PascalCase components, camelCase functions, snake_case in Python), comments only where useful |
| Error handling | Central error middleware on the backend; friendly error, loading (skeleton), and empty states on the frontend; error boundary at app level |
| Testing | Unit tests for key utilities and services (Vitest, Jest, Pytest); manual end-to-end checklist for order and reservation flows |

---

## 6. Project Structure

Each concern lives in its own top-level folder. Inside, every feature has its own folder, and every component or module has its own file named after it.

```
study-mind/
├── requirements.md
├── README.md
├── .gitignore
├── docker-compose.yml                  (optional)
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── .env.example
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── robots.txt
│   │   └── images/
│   │       ├── hero/
│   │       ├── menu/
│   │       ├── gallery/
│   │       ├── team/
│   │       └── offers/
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── assets/
│       │   ├── icons/
│       │   └── fonts/
│       ├── components/
│       │   ├── common/
│       │   │   ├── Navbar/
│       │   │   │   ├── Navbar.jsx
│       │   │   │   └── Navbar.module.css
│       │   │   ├── MobileMenu/
│       │   │   │   ├── MobileMenu.jsx
│       │   │   │   └── MobileMenu.module.css
│       │   │   ├── Footer/
│       │   │   │   ├── Footer.jsx
│       │   │   │   └── Footer.module.css
│       │   │   ├── Button/
│       │   │   │   ├── Button.jsx
│       │   │   │   └── Button.module.css
│       │   │   ├── Loader/
│       │   │   │   ├── Loader.jsx
│       │   │   │   └── Loader.module.css
│       │   │   ├── Skeleton/
│       │   │   ├── Modal/
│       │   │   ├── SectionHeading/
│       │   │   ├── ScrollReveal/
│       │   │   ├── PageTransition/
│       │   │   ├── EmptyState/
│       │   │   ├── ErrorBoundary/
│       │   │   └── SEO/
│       │   ├── home/
│       │   │   ├── Hero/
│       │   │   ├── FeaturedMenu/
│       │   │   ├── AboutTeaser/
│       │   │   ├── StudySpaceHighlight/
│       │   │   ├── OffersSection/
│       │   │   ├── Testimonials/
│       │   │   ├── GalleryPreview/
│       │   │   └── ReservationCTA/
│       │   ├── menu/
│       │   │   ├── MenuCard/
│       │   │   ├── MenuGrid/
│       │   │   ├── CategoryTabs/
│       │   │   ├── MenuSearch/
│       │   │   ├── MenuFilters/
│       │   │   └── MenuItemModal/
│       │   ├── about/
│       │   │   ├── StorySection/
│       │   │   ├── TeamCard/
│       │   │   └── ValuesSection/
│       │   ├── study/
│       │   │   ├── SeatingZones/
│       │   │   ├── HouseRules/
│       │   │   ├── PassCard/
│       │   │   └── AvailabilityPreview/
│       │   ├── gallery/
│       │   │   ├── MasonryGrid/
│       │   │   └── Lightbox/
│       │   ├── contact/
│       │   │   ├── ContactInfo/
│       │   │   └── ContactForm/
│       │   ├── cart/
│       │   │   ├── CartDrawer/
│       │   │   ├── CartItem/
│       │   │   └── CartSummary/
│       │   ├── checkout/
│       │   │   ├── CheckoutForm/
│       │   │   ├── PaymentOptions/
│       │   │   └── OrderSuccess/
│       │   ├── reservation/
│       │   │   ├── ReservationForm/
│       │   │   ├── TimeSlotPicker/
│       │   │   └── ReservationSuccess/
│       │   ├── profile/
│       │   │   ├── OrderHistory/
│       │   │   ├── MyReservations/
│       │   │   └── ProfileForm/
│       │   ├── chat/
│       │   │   ├── ChatWidget/
│       │   │   ├── ChatPanel/
│       │   │   ├── ChatMessage/
│       │   │   ├── ChatInput/
│       │   │   └── QuickReplies/
│       │   └── admin/
│       │       ├── AdminSidebar/
│       │       ├── AdminTopbar/
│       │       ├── StatCard/
│       │       ├── DataTable/
│       │       ├── OrdersTable/
│       │       ├── ReservationsTable/
│       │       ├── MenuForm/
│       │       ├── OfferForm/
│       │       ├── TestimonialForm/
│       │       └── StatusBadge/
│       ├── pages/
│       │   ├── Home/Home.jsx
│       │   ├── Menu/Menu.jsx
│       │   ├── About/About.jsx
│       │   ├── StudySpace/StudySpace.jsx
│       │   ├── Reservation/Reservation.jsx
│       │   ├── Gallery/Gallery.jsx
│       │   ├── Contact/Contact.jsx
│       │   ├── Checkout/Checkout.jsx
│       │   ├── Login/Login.jsx
│       │   ├── Register/Register.jsx
│       │   ├── Profile/Profile.jsx
│       │   ├── NotFound/NotFound.jsx
│       │   └── admin/
│       │       ├── Dashboard/Dashboard.jsx
│       │       ├── ManageMenu/ManageMenu.jsx
│       │       ├── ManageOrders/ManageOrders.jsx
│       │       ├── ManageReservations/ManageReservations.jsx
│       │       ├── ManageOffers/ManageOffers.jsx
│       │       ├── ManageTestimonials/ManageTestimonials.jsx
│       │       └── Messages/Messages.jsx
│       ├── layouts/
│       │   ├── MainLayout/MainLayout.jsx
│       │   └── AdminLayout/AdminLayout.jsx
│       ├── routes/
│       │   ├── AppRoutes.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── AdminRoute.jsx
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   ├── CartContext.jsx
│       │   └── ChatContext.jsx
│       ├── hooks/
│       │   ├── useAuth.js
│       │   ├── useCart.js
│       │   ├── useChat.js
│       │   ├── useScrollReveal.js
│       │   ├── useScrollPosition.js
│       │   ├── useDebounce.js
│       │   └── useReducedMotion.js
│       ├── services/
│       │   ├── api.js                  (Axios instance, token interceptor)
│       │   ├── authService.js
│       │   ├── menuService.js
│       │   ├── orderService.js
│       │   ├── reservationService.js
│       │   ├── offerService.js
│       │   ├── testimonialService.js
│       │   ├── contactService.js
│       │   ├── adminService.js
│       │   └── chatService.js
│       ├── utils/
│       │   ├── formatPrice.js
│       │   ├── formatDate.js
│       │   ├── timeSlots.js
│       │   ├── validators.js
│       │   ├── motionVariants.js       (shared Framer Motion variants)
│       │   └── constants.js
│       └── styles/
│           ├── variables.css           (color, spacing, radius, shadow tokens)
│           ├── reset.css
│           ├── global.css
│           ├── typography.css
│           └── animations.css
│
├── backend/
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── server.js                   (starts HTTP server)
│       ├── app.js                      (Express app, middleware, routes)
│       ├── config/
│       │   ├── env.js
│       │   └── corsOptions.js
│       ├── db/
│       │   ├── connection.js
│       │   ├── models/
│       │   │   ├── User.js
│       │   │   ├── Category.js
│       │   │   ├── MenuItem.js
│       │   │   ├── Order.js
│       │   │   ├── Reservation.js
│       │   │   ├── Offer.js
│       │   │   ├── Testimonial.js
│       │   │   ├── ContactMessage.js
│       │   │   └── GalleryImage.js
│       │   └── seeds/
│       │       ├── seed.js
│       │       ├── categoryData.js
│       │       ├── menuData.js
│       │       ├── userData.js
│       │       ├── orderData.js
│       │       ├── reservationData.js
│       │       ├── offerData.js
│       │       ├── testimonialData.js
│       │       └── galleryData.js
│       ├── routes/
│       │   ├── index.js
│       │   ├── authRoutes.js
│       │   ├── menuRoutes.js
│       │   ├── categoryRoutes.js
│       │   ├── orderRoutes.js
│       │   ├── reservationRoutes.js
│       │   ├── offerRoutes.js
│       │   ├── testimonialRoutes.js
│       │   ├── galleryRoutes.js
│       │   ├── contactRoutes.js
│       │   ├── infoRoutes.js
│       │   ├── adminRoutes.js
│       │   └── agentRoutes.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── menuController.js
│       │   ├── categoryController.js
│       │   ├── orderController.js
│       │   ├── reservationController.js
│       │   ├── offerController.js
│       │   ├── testimonialController.js
│       │   ├── galleryController.js
│       │   ├── contactController.js
│       │   ├── infoController.js
│       │   ├── adminController.js
│       │   └── agentController.js
│       ├── services/
│       │   ├── authService.js
│       │   ├── menuService.js
│       │   ├── orderService.js
│       │   ├── reservationService.js
│       │   ├── statsService.js
│       │   └── agentService.js         (calls the Python agent)
│       ├── middleware/
│       │   ├── authMiddleware.js
│       │   ├── roleMiddleware.js
│       │   ├── errorMiddleware.js
│       │   ├── notFoundMiddleware.js
│       │   ├── validateMiddleware.js
│       │   └── rateLimiter.js
│       ├── validators/
│       │   ├── authValidator.js
│       │   ├── menuValidator.js
│       │   ├── orderValidator.js
│       │   ├── reservationValidator.js
│       │   └── contactValidator.js
│       ├── data/
│       │   └── cafeInfo.js             (hours, address, rules, passes)
│       └── utils/
│           ├── generateToken.js
│           ├── apiResponse.js
│           ├── ApiError.js
│           ├── asyncHandler.js
│           ├── slugify.js
│           └── logger.js
│
└── agent/
    ├── requirements.txt
    ├── .env.example
    ├── main.py                         (FastAPI entry point)
    ├── tests/
    │   ├── test_chat.py
    │   └── test_tools.py
    └── app/
        ├── api/
        │   ├── chat_routes.py
        │   └── health_routes.py
        ├── core/
        │   ├── config.py
        │   ├── llm_client.py
        │   └── prompts.py              (system prompt and persona)
        ├── agents/
        │   ├── cafe_agent.py           (main orchestration and intent routing)
        │   ├── menu_agent.py           (search and recommendations)
        │   └── reservation_agent.py    (booking flow)
        ├── tools/
        │   ├── menu_tool.py
        │   ├── offer_tool.py
        │   ├── info_tool.py
        │   └── reservation_tool.py
        ├── memory/
        │   └── session_memory.py
        ├── schemas/
        │   ├── chat_schema.py
        │   └── reservation_schema.py
        ├── data/
        │   ├── cafe_info.json          (fallback copy)
        │   └── faq.json
        ├── services/
        │   ├── backend_client.py       (calls Node.js APIs)
        │   └── cache.py                (short-lived menu cache)
        └── utils/
            ├── logger.py
            └── text_utils.py
```

**Naming rules**
- React: one component per folder, `ComponentName.jsx` plus `ComponentName.module.css`.
- Node: `camelCase.js` files, one model, controller, service, or route file per resource.
- Python: `snake_case.py` modules, one agent, tool, or schema per file.

---

## 7. Data Models

| Model | Fields |
|---|---|
| **User** | name, email (unique), passwordHash, phone, role (`customer` \| `admin`), createdAt, updatedAt |
| **Category** | name, slug (unique), image, order |
| **MenuItem** | name, slug (unique), description, ingredients [String], price, image, category (ref), tags [`veg`, `popular`, `new`, `strong`, `sweet`, `iced`], isAvailable, calories (optional), createdAt |
| **Order** | orderNumber, user (ref), items [{ menuItem, name, price, quantity }], subtotal, tax, total, status (`pending` \| `preparing` \| `ready` \| `completed` \| `cancelled`), orderType (`pickup` \| `dine-in`), notes, paymentMethod (`cash` \| `card` \| `wallet`, dummy), createdAt |
| **Reservation** | user (ref, optional), name, email, phone, date, time, guests, seatType (`table` \| `study-desk`), status (`pending` \| `approved` \| `rejected` \| `cancelled`), notes, source (`web` \| `agent`), createdAt |
| **Offer** | title, description, image, discountText, validTill, isActive |
| **Testimonial** | name, role, message, rating (1 to 5), avatar, isVisible |
| **ContactMessage** | name, email, subject, message, isRead, createdAt |
| **GalleryImage** | src, alt, category, width, height |

Order prices are always calculated on the server from the database, never trusted from the client.

---

## 8. API Endpoints

### 8.1 Node.js Backend

Base path: `/api/v1`. Standard response format: `{ success, message, data }`. Errors: `{ success: false, message, errors? }`.

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/auth/register` | Register a customer | Public |
| POST | `/auth/login` | Log in and receive a token | Public |
| POST | `/auth/refresh` | Get a new access token | Public (cookie) |
| POST | `/auth/logout` | Clear refresh token | Auth |
| GET | `/auth/me` | Current user | Auth |
| PUT | `/auth/me` | Update profile | Auth |
| GET | `/menu` | List items (query: `category`, `search`, `tag`, `minPrice`, `maxPrice`, `sort`) | Public |
| GET | `/menu/:idOrSlug` | Single item | Public |
| POST | `/menu` | Create item | Admin |
| PUT | `/menu/:id` | Update item | Admin |
| PATCH | `/menu/:id/availability` | Toggle availability | Admin |
| DELETE | `/menu/:id` | Delete item | Admin |
| GET | `/categories` | List categories | Public |
| POST/PUT/DELETE | `/categories`, `/categories/:id` | Manage categories | Admin |
| POST | `/orders` | Place an order | Auth |
| GET | `/orders/my` | My orders | Auth |
| GET | `/orders` | All orders (query: `status`, `date`) | Admin |
| PATCH | `/orders/:id/status` | Update order status | Admin |
| POST | `/reservations` | Create a reservation | Public |
| GET | `/reservations/availability` | Free slots for a date and seat type | Public |
| GET | `/reservations/my` | My reservations | Auth |
| GET | `/reservations` | All reservations | Admin |
| PATCH | `/reservations/:id/status` | Approve or reject | Admin |
| PATCH | `/reservations/:id/reschedule` | Change date and time | Admin |
| GET | `/offers` | Active offers | Public |
| POST/PUT/DELETE | `/offers`, `/offers/:id` | Manage offers | Admin |
| GET | `/testimonials` | Visible testimonials | Public |
| POST/PUT/DELETE | `/testimonials`, `/testimonials/:id` | Manage testimonials | Admin |
| GET | `/gallery` | Gallery images | Public |
| GET | `/info` | Cafe info (hours, address, rules, passes) | Public |
| POST | `/contact` | Send a contact message | Public |
| GET | `/contact` | List messages | Admin |
| POST | `/agent/chat` | Forward a chat message to the Python agent | Public (rate limited) |
| GET | `/admin/stats` | Dashboard statistics | Admin |

### 8.2 Python Agent (FastAPI)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/chat` | Body `{ session_id, message }`, returns `{ reply, quick_replies, action? }` |
| DELETE | `/chat/{session_id}` | Clear session memory |
| GET | `/health` | Health check |

Request flow: **React chat widget → Node `/api/v1/agent/chat` → Python `/chat` → Node public APIs (menu, offers, info, reservations) → reply.**

---

## 9. AI Agent Design

| Part | Responsibility |
|---|---|
| `cafe_agent.py` | Receives the message, loads session memory, sends the user's intent to the right sub-agent or tool, builds the final prompt |
| `menu_agent.py` | Filters menu items by tags, price, and keywords; ranks recommendations for moods like "strong, not sweet" |
| `reservation_agent.py` | Step-by-step slot filling (date, time, guests, seat type, name, phone), confirmation, then booking |
| `tools/*` | Thin wrappers that call `backend_client.py` for live data |
| `prompts.py` | Persona: warm, short, helpful barista. Rules: use only the provided data, never invent items or prices, suggest contacting the cafe when unsure |
| `session_memory.py` | In-memory store keyed by `session_id`: last 10 turns, 30-minute time-to-live |
| `cache.py` | Caches menu and info for 60 seconds to reduce backend calls |

**Grounding rules**
1. Every menu, price, or offer fact in a reply must come from tool results for that turn.
2. If an item is not found, say so and suggest similar items that do exist.
3. Prices are shown exactly as returned by the backend.
4. Bookings are only created after the user clearly confirms the summary.
5. If the LLM API is unavailable, fall back to rule-based answers for hours, location, and offers.

---

## 10. Dummy Data Requirements

The seed script (`npm run seed` in `backend/`) clears the database and creates:

| Data | Amount |
|---|---|
| Categories | 6 (Coffee, Cold Drinks, Bakery, Snacks, Meals, Desserts) |
| Menu items | 36 (6 per category) with realistic names, descriptions, ingredients, tags, and prices |
| Users | 1 admin and 1 customer |
| Orders | 8 sample orders in mixed statuses |
| Reservations | 5 sample reservations (tables and study desks) |
| Offers | 3 active offers |
| Testimonials | 6 |
| Gallery images | 12 |

**Demo credentials (documented in README):**

| Role | Email | Password |
|---|---|---|
| Admin | `admin@alladin.cafe` | `Admin@123` |
| Customer | `customer@alladin.cafe` | `Customer@123` |

**Dummy cafe info:** Alladin Cafe, 12 Garden Street; open Monday to Saturday 08:00 to 22:00 and Sunday 09:00 to 20:00; phone +00 123 456 789; email hello@alladin.cafe.

**Study passes (dummy):** Hourly $3, Day Pass $12 (includes one coffee), Weekly $50.

**Images:** royalty-free stock photos (e.g., Unsplash) saved locally in `frontend/public/images` as WebP, with warm, consistent color grading.

---

## 11. Page Section Details (Home Page)

| # | Section | Background | Content |
|---|---|---|---|
| 1 | Navbar | Transparent, then off-white on scroll | Logo "Alladin Cafe", links (Home, Menu, Study Space, About, Gallery, Contact), live "Open now" status, cart icon with count, purple "Reserve" button |
| 2 | Hero | Off-white | Large serif headline (e.g., "Good coffee. Quiet minds."), short supporting line, "Order Now" (purple) and "Reserve a Seat" (ghost) buttons, large rounded coffee image placed off-center |
| 3 | Featured Menu | Off-white | 6 popular items in a 3-column card grid with hover lift, and a "View full menu" link |
| 4 | About Teaser | White | Image and text side by side, asymmetric layout, "Read our story" link |
| 5 | Study Space Highlight | Purple | White serif heading with a gold accent word; four features (Fast Wi-Fi, Power at every seat, Quiet zone, Open until 10pm) in clean typography, next to a large interior photo |
| 6 | Offers | Off-white | 2 or 3 large promo cards with an image, title, and gold label |
| 7 | Testimonials | White | Large quote text, name and role, slider with previous and next buttons |
| 8 | Gallery Preview | Off-white | 5 images in an editorial grid, "See gallery" link |
| 9 | Reservation CTA | Gold | Large black heading "Save your seat", purple button with white text |
| 10 | Footer | Purple | Logo, short tagline, page links, opening hours, contact, social links, copyright |

Other pages follow the same system: a short page hero (title and one line of text, with an optional image) and alternating sections.

---

## 12. Environment Variables

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api/v1
```

**backend/.env**
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/study_mind
USE_MEMORY_DB=false          # true = temporary in-memory MongoDB, auto-seeded on start (dev only)
JWT_ACCESS_SECRET=change_me
JWT_REFRESH_SECRET=change_me_too
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES_DAYS=7
CLIENT_URL=http://localhost:5173
AGENT_URL=http://localhost:8000
```

**agent/.env**
```
LLM_API_KEY=your_api_key
LLM_MODEL=claude-sonnet-5-5
BACKEND_URL=http://localhost:5000/api/v1
SESSION_TTL_MINUTES=30
MAX_HISTORY_TURNS=10
```

Every folder has a `.env.example`; real `.env` files are listed in `.gitignore`.

---

## 13. Setup and Run

**Requirements:** Node.js 18+, Python 3.10+, MongoDB 6+ (local or Atlas). MongoDB is optional in development: with `USE_MEMORY_DB=true` the backend starts a temporary in-memory database and seeds it automatically.

| Service | Commands | Port |
|---|---|---|
| Backend (MongoDB) | `cd backend && npm install && npm run seed && npm run dev` | 5000 |
| Backend (no MongoDB) | `cd backend && npm install && npm run dev:memory` | 5000 |
| Frontend | `cd frontend && npm install && npm run dev` | 5173 |
| Agent | `cd agent && pip install -r requirements.txt && uvicorn main:app --reload --port 8000` | 8000 |
| All (optional) | `docker compose up` | same as above |

---

## 14. Development Phases

| Phase | Scope | Output |
|---|---|---|
| 1. Foundation | Folder structure, design tokens, fonts, layouts, Navbar, Footer, routing, page transitions | App shell running |
| 2. Backend core | DB connection, models, seed data, auth, menu, categories, info APIs | Seeded API |
| 3. Frontend pages | Home, Menu, About, Study Space, Gallery, Contact | Public site browsable |
| 4. Commerce | Cart, checkout, orders, reservations, profile | End-to-end order and booking |
| 5. Agent | FastAPI service, tools, memory, chat widget | Working assistant |
| 6. Admin panel | Dashboard, menu, orders, reservations, offers, testimonials, messages | Staff tooling |
| 7. Polish | Animation tuning, responsiveness, accessibility, SEO, performance, tests, README | Release candidate |

---

## 15. Acceptance Criteria

- [ ] All pages render correctly on mobile (375px), tablet (768px), and desktop (1280px+).
- [ ] Only the three brand colors (#4B2C91, #1D80C3, #D6B83C) and the neutrals in 3.1 appear in the UI.
- [ ] No decorative dots, dotted patterns, side lines, gradient blobs, or template decorations anywhere.
- [ ] Animations are smooth (60fps), use only transform and opacity, and turn off with `prefers-reduced-motion`.
- [ ] Menu filtering, search, cart, checkout, orders, and reservations work end to end with seeded data.
- [ ] Order totals are calculated on the server.
- [ ] The chat agent answers menu and info questions from seeded data, never invents items, and can create a reservation after confirmation.
- [ ] Admin can manage menu items, categories, orders, reservations, offers, and testimonials.
- [ ] Customers cannot open admin routes (frontend redirect and backend 403).
- [ ] Folder structure matches Section 6, with one component or module per file.
- [ ] Lighthouse: performance 90+ (desktop), accessibility 90+, SEO 90+.
- [ ] README documents setup, environment variables, and demo credentials.

---

## 16. Out of Scope (Version 1)

- Real payment gateway integration
- Real email or SMS delivery
- Delivery tracking and driver management
- Multi-branch support
- Native mobile apps
- Multi-language support
