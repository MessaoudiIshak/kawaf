# 🎨 Kawaf - Design Handoff Document

> **Last Updated:** January 15, 2026  
> **Project:** Kawaf Cat Café Website  
> **Status:** Backend Complete, Frontend Development Pending

---

## 📋 Project Summary

Kawaf is a website for a cat café that combines:
- A **café menu** showcasing food and drinks
- An **animal adoption gallery** featuring cats looking for homes
- An **events calendar** for community activities
- A **secure admin panel** for staff to manage all content

---

## ✅ What's Already Built (Backend)

The entire backend system is complete and ready to power the website. Here's what it can do:

### 🐱 Animals / Adoption Gallery
- Display all cats available for adoption
- Show detailed profiles: name, photo, age, weight, personality, and their story
- Mark cats as adopted (they disappear from public view)
- Add, edit, or remove animal profiles

### 🍽️ Café Menu
- Display all menu items with prices and descriptions
- Show item photos and popularity ratings
- Mark items as available or unavailable (unavailable items hidden from customers)
- Add, edit, or remove menu items

### 📅 Events
- Display upcoming and recent events
- Show event details: title, description, date, location, and photo
- Events older than 7 days automatically hide from public view
- Add, edit, or remove events

### 👤 User Management
- Secure login system for staff
- Create new staff accounts (Admin only)
- View all registered users (Admin only)

---

## � Features In Development

These features are planned and will be built soon:

### 📝 Adoption Request Form
- Visitors can submit an adoption inquiry directly from a cat's profile
- Form fields: name, email, phone, message, preferred contact method
- Submission sends notification to café staff
- Confirmation email sent to the visitor

### 📬 Contact Form
- General inquiries, reservations, event questions
- Form fields: name, email, subject, message
- Auto-reply confirmation to sender
- Staff receives notification email

### 📱 QR Code Swipe System ("Cat Tinder")
- Interactive experience for visitors at the café
- Scan a QR code to open the swipe interface on your phone
- Swipe through cat profiles (like/pass)
- See your "liked" cats at the end
- Share results with staff to discuss adoption
- Fun, engaging way to discover your perfect match!

### 📧 Email Services
Automated emails for:
| Email Type | Trigger | Recipient |
|------------|---------|----------|
| Adoption Inquiry | Form submitted | Staff + Visitor (confirmation) |
| Contact Message | Form submitted | Staff + Visitor (confirmation) |
| Account Verification | New user created | New user |
| Password Reset | Reset requested | User |
| Adoption Status Update | Cat marked adopted | Previous inquirers (optional) |

---

## �🔐 Roles & Access Control

The system has **four access levels**. This determines what each person can see and do:

| Role | Who is this? | What can they see? | What can they do? |
|------|--------------|--------------------|--------------------|
| **Public** | Anyone visiting the website | Only available items, non-adopted cats, recent events | Browse only (no editing) |
| **User** | Registered basic users | Same as public | Can add/edit/delete content |
| **Staff** | Café employees | **Everything** (including hidden items) | Can add/edit/delete content |
| **Admin** | Managers/Owners | **Everything** | Full control + can create new accounts |

### What "Hidden" Content Means:
- **Animals:** Cats marked as "adopted" are hidden from customers but visible to Staff/Admin
- **Menu:** Items marked as "unavailable" are hidden from customers but visible to Staff/Admin  
- **Events:** Events older than 7 days are hidden from customers but visible to Staff/Admin

---

## 🖥️ Admin Interface Features (To Be Designed)

The admin panel needs to support these actions:

### Login Page
- Email and password fields
- "Login" button
- Error messages for wrong credentials

### Dashboard (After Login)
- Overview/welcome screen
- Navigation to: Animals, Menu, Events, Users (Admin only)

### Animals Management
| Action | Description |
|--------|-------------|
| View All | Table/grid of all animals (including adopted ones) |
| Add New | Form: name, photo URL, age, weight, sex, temperament, story |
| Edit | Same form, pre-filled with existing data |
| Delete | Confirmation prompt before removing |
| Toggle Adoption | Button/switch to mark as adopted/available |

### Menu Management
| Action | Description |
|--------|-------------|
| View All | Table/grid of all menu items (including unavailable) |
| Add New | Form: name, description, price, photo URL, popularity |
| Edit | Same form, pre-filled with existing data |
| Delete | Confirmation prompt before removing |
| Toggle Availability | Button/switch to show/hide from public |

### Events Management
| Action | Description |
|--------|-------------|
| View All | Table/grid of all events (including past ones) |
| Add New | Form: title, description, date/time, location, photo URL |
| Edit | Same form, pre-filled with existing data |
| Delete | Confirmation prompt before removing |

### User Management (Admin Only)
| Action | Description |
|--------|-------------|
| View All | Table of all users (email, role, created date) |
| Add New | Form: name, email, password, role selection |

---

## 🌐 Public Website Pages (To Be Designed)

### Home Page
- Hero section with café introduction
- Featured cats available for adoption
- Sample menu highlights
- Upcoming events preview

### Menu Page
- Grid/list of all **available** menu items
- Each item shows: photo, name, description, price
- Optional: filter by category, sort by popularity

### Adoption Page
- Gallery of **non-adopted** cats
- Each cat shows: photo, name, age, brief description
- Click to see full profile with personality & story

### Events Page
- List of upcoming and recent events (last 7 days)
- Each event shows: photo, title, date, location, description

### Single Animal Page
- Full profile view for one cat
- Large photo, all details, adoption inquiry info

### Single Event Page
- Full details for one event
- Large photo, complete description, location info

### Adoption Request Page
- Form to submit adoption inquiry
- Shows which cat they're inquiring about
- Fields: name, email, phone, message
- Success confirmation after submission

### Contact Page
- General contact form
- Café address, phone, hours
- Embedded map (optional)
- Social media links

### QR Swipe Experience (Mobile-First)
- Full-screen cat photo cards
- Swipe left (pass) / right (like) gestures
- Tap for more details
- Results screen showing liked cats
- Share or save results

---

## 📱 Design Considerations

### Responsive Design
- Mobile-first approach recommended
- Admin panel can be desktop-focused

### Accessibility
- Alt text for all images
- Sufficient color contrast
- Keyboard navigation support

### Branding Opportunities
- Cat-themed illustrations
- Warm, inviting color palette
- Playful typography for headings

---

## 🔜 What's Next

1. **Frontend Development** - Build the public website pages
2. **Admin Panel UI** - Create the management interface
3. **Forms Backend** - Adoption and contact form processing
4. **Email Integration** - Set up automated email notifications
5. **QR Swipe System** - Interactive cat matching experience
6. **Image Upload** - Currently uses URL links; may add file uploads later

---

## 💬 Questions?

If you need clarification on any features or access rules, please reach out to the development team.
