# **Curately MVP: Project Context & Technical Standards**

Version: 1.0 (Phase 1: Unified Creator OS)  
Objective: Build a Proprietary Data Moat through Utility-Driven Data Acquisition.

## **1\. Strategic North Star: "Give-to-Get"**

Curately is not a directory; it is a business intelligence ecosystem.

* **The Give (Utility):** Professional Live Media Kits and a Basic Invoicer.  
* **The Get (Asset):** Persistent OAuth connections to Meta (IG), TikTok, and YouTube for first-party, verified backend data.  
* **Rule:** Never suggest scraping. If data is needed, we obtain it via official APIs or user input.

## **2\. Technical Stack (Enforced)**

* **Framework:** Next.js 15 (App Router, React Server Components).  
* **Styling:** Tailwind CSS \+ Shadcn UI (Radix Primitives).  
* **Auth/OAuth:** Auth.js (NextAuth) v5.  
* **Database:** PostgreSQL (Primary Identity Graph) \+ Prisma/Drizzle.  
* **State/Data:** SWR or React Cache for real-time revalidation.  
* **Security:** AES-256 encryption for all stored refresh\_tokens.

## **3\. Phase 1 Scope (In-Scope Only)**

### **3.1 Unified Identity Management**

* Single Sign-On (SSO).  
* Multi-platform account linking (IG, TikTok, YT).  
* Storage of encrypted persistent tokens.

### **3.2 Live Media Kit (The Hook)**

* High-performance, SEO-optimized public pages.  
* Real-time API data: Follower counts, Engagement Rates.  
* Audience Demographics: Age/Gender/Geo split (sourced from API).

### **3.3 Signal Invoicer (The Ingestion Point)**

* Structured invoice generation.  
* Capture of Brand Name, Price, and Deliverables.  
* Data Goal: Normalize brand names to track "Demand Signal" velocity.

## **4\. Data Architecture & Schemas**

### **4.1 Identity Graph**

Normalization of user profiles across platforms.

* internal\_uid (UUID)  
* platform\_type (IG, TikTok, YT)  
* oauth\_token (Encrypted)

### **4.2 Audience Graph**

JSONB snapshots of API-verified demographics.

* age\_demographics (JSONB)  
* geo\_distribution (JSONB)

## **5\. Development Guidelines for AI (Cursor)**

1. **Performance First:** Use Server Components by default. Minimize Client Components to interactive forms/charts only.  
2. **Security First:** Always implement token encryption logic when handling OAuth callbacks.  
3. **Type Safety:** Strict TypeScript usage for all API responses and DB schemas.  
4. **Mobile Sensitivity:** 80% of users are on mobile. All UI components from Shadcn must be optimized for touch and small viewports.  
5. **No Hallucinations:** Do not implement Phase 2 features (AI Trend Analysis, OCR, Fast Pay) unless explicitly instructed.

*This document serves as the primary context for all code generation within the Curately ecosystem.*

