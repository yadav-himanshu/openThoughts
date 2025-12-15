# OpenThoughts 📝

OpenThoughts is a content-sharing platform where anyone can post thoughts, shayari, poems, short stories, and quotes in Hindi or English — without creating an account.

The focus of this project is **real-world frontend architecture**, **admin moderation**, and **proper SEO for dynamic content**, not just CRUD features.

🔗 Live: https://open-thoughts-pi.vercel.app

---

## Why I Built This

Most beginner projects stop at UI or basic CRUD.  
With OpenThoughts, I wanted to build something closer to a **real product**:

- User-generated content
- Admin moderation
- SEO that actually works for dynamic pages
- Production issues like sitemap fetching, indexing, and permissions

---

## Key Features

- Public post submission (no login required)
- Categories and author-based browsing
- Likes, comments, and view counts
- Admin dashboard to approve, edit, or delete posts
- Admin-only comment deletion
- Post deletion request flow via email
- Responsive UI with dark / light theme

---

## SEO & Search (Production-Grade)

This project implements **actual SEO**, not just meta tags:

- Server-side metadata using Next.js App Router
- Dynamic titles & descriptions for:
  - Posts
  - Authors
  - Categories
- Canonical URLs
- Open Graph tags for social sharing
- Dynamic `sitemap.xml` (approved posts only)
- `robots.txt` blocking admin routes
- Google Search Console integration

---

## Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **Firebase (Firestore + Auth)**
- **Nodemailer**
- **Vercel**
- **Google Search Console**

---

## 📁 Project Structure

```txt
src/
├─ app/
│ ├─ page.tsx
│ ├─ post/[id]/
│ ├─ author/[name]/
│ ├─ category/[name]/
│ ├─ admin/
│ ├─ api/
│ ├─ sitemap.ts
│ └─ robots.ts
│
├─ components/
│ ├─ PostList.tsx
│ ├─ Comments.tsx
│ ├─ Navbar.tsx
│ ├─ Footer.tsx
│ ├─ ThemeToggle.tsx
│ └─ DeleteRequestForm.tsx

```
---

## 🔐 Security & Best Practices

- Firestore rules ensure only approved posts are publicly readable
- Admin routes blocked from search indexing
- Server-side SEO separated from client-side Firebase logic
- No sensitive credentials exposed to the client

---

## 🚀 Getting Started (Local Setup)

```bash
git clone https://github.com/your-username/openthoughts.git
cd openthoughts
npm install
npm run dev

Create a .env.local file:

NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_TO=your_email@gmail.com 
```
## 📌 What This Project Demonstrates

- Real-world **Next.js App Router** architecture  
- Clear separation of **client and server** responsibilities  
- **SEO implementation** beyond basics  
- **Firebase** usage in production scenarios  
- **Admin moderation** workflows  
- Debugging real production issues (sitemap, indexing, permissions)

---

## 📈 Future Improvements

- User profiles  
- Rich text editor  
- Content reporting system  
- Analytics dashboard  
- Custom domain integration  

---

## 👤 Author

**Himanshu Yadav**  
Frontend Developer
