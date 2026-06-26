# Scratch Card Feature Documentation

This document provides a comprehensive overview of the current implementation of the "Scratch Card" feature in the ShipCart project.

## 1. CONCEPT & PURPOSE

**Business/Marketing Perspective:**
The Scratch Card feature is a gamified lead-generation and conversion-optimization tool. Its primary goal is to capture user contact information (emails and phone numbers) and incentivize purchases. By offering a randomized discount or gift via an engaging HTML5 Canvas "scratch off" interaction, it creates a sense of curiosity, urgency, and excitement, encouraging visitors to convert into registered users and ultimately complete a checkout.

**Placement & Trigger:**
Currently, the scratch card is embedded as a banner section (`ScratchCardBanner.tsx`) on the main homepage. It acts as a static inline component rather than a popup. It is visible to all visitors as they scroll down the homepage.

## 2. UI/UX FLOW

The user journey is handled through a sequence of steps (tracked via the `flowStep` state):

1. **Visitor State (`visitor`)**
   - The user sees a locked/blurred scratch card on the right and an inviting "Sign Up to Scratch" prompt on the left.
   - The user cannot interact with the canvas.

2. **Authentication Flow (`signup` / `otp`)**
   - When the user clicks to sign up, they are presented with an inline auth form.
   - They can sign in via Google, Log In with an existing account, or Sign Up.
   - **Phone OTP Simulation:** During sign-up, a phone number is required. The system simulates sending an SMS OTP (currently shown via a mock toast notification for demonstration purposes). The user must enter this 4-digit code to proceed.
   - Upon successful verification, an account is created and they are automatically logged in.

3. **Ready to Scratch State (`ready`)**
   - The scratch card remains hidden, but a "Tap to Unlock Card" button appears on the left.
   - When clicked, this fires a request to `/api/user/spin` (the legacy endpoint name is preserved) to generate and assign a random prize *before* the user scratches.

4. **Scratching State (`scratching`)**
   - An HTML5 Canvas layer completely covers the underlying prize card.
   - Users can drag their mouse or swipe their finger to "scratch" away the navy blue overlay.
   - The canvas uses `globalCompositeOperation = "destination-out"` to erase pixels dynamically.
   - A real-time check analyzes the alpha channel of the canvas data. Once approximately 45-50% of the area is cleared, the interaction completes automatically.

5. **Winner State (`winner`)**
   - The canvas fades out via CSS transition.
   - A 6-second confetti animation plays across the screen.
   - The underlying prize card is fully revealed, displaying the prize name, a randomly generated coupon code (e.g., `WIN10-XYZ1`), and a "Copy Code" button.
   - A prominent CTA encourages them to "Shop Now & Checkout".

## 3. PRIZE LOGIC

The actual prize logic runs purely on the backend in `app/api/user/spin/route.ts` using a weighted randomized system.

**Available Prizes & Weights:**
- **Free Delivery** (Weight: 30) - *Highest probability*
- **5% OFF** (Weight: 25)
- **10% OFF** (Weight: 15)
- **Rs.150 Voucher** (Weight: 10)
- **Buy 2 Get 10% OFF** (Weight: 10)
- **Buy 3 Get 15% OFF** (Weight: 5)
- **Surprise Gift** (Weight: 4)
- **Buy 4 Get 1 Free** (Weight: 1) - *Lowest probability*

*Total weight = 100, meaning probabilities map directly to percentages (e.g., 30% chance for Free Delivery).*

**Selection Algorithm:**
The server calculates a random number between 0 and the total weight (100). It then iterates through the prizes, accumulating weights until the sum surpasses the random number. The prize at that index is awarded.

## 4. BACKEND & DATABASE OPERATIONS

When the `POST /api/user/spin` endpoint is called:

1. **Auth Check:** Verifies the user session via NextAuth.
2. **Database Lookup:** Finds the user in MongoDB.
3. **Limit Enforcement:** Checks `user.hasSpun`. If true, rejects the request (unless the user is the designated admin, who gets unlimited attempts for testing).
4. **Prize Generation:** Runs the weighted logic to select a prize.
5. **Coupon Generation:** Creates a unique 9-character code combining a specific prefix and a random 4-character suffix (e.g., `FREE-K9A2`).
6. **Database Update:** Updates the User document:
   - `hasSpun` = `true`
   - `spinResult` = `"Free Delivery"`
   - `spunAt` = `[Current Timestamp]`
   - `couponCode` = `"FREE-K9A2"`
   - `couponExpiry` = `[Current Time + 48 Hours]`
   - `couponStatus` = `"active"`

*(Note: The internal variables still use the word `spin` to maintain backward compatibility with existing databases and validation endpoints.)*

## 5. COUPON VALIDATION

Coupons are validated at checkout via the `POST /api/coupons/validate/route.ts` endpoint. 

**Validation Hierarchy:**
1. The system first checks if the entered code matches any global/admin-created coupons in the `Coupon` collection.
2. If no global coupon is found, it falls back to checking the current User's document for a match against `user.couponCode`.

**User Coupon Rules:**
- The entered code must exactly match `user.couponCode`.
- `user.couponStatus` must be `"active"`.
- The current date/time must be strictly before `user.couponExpiry` (48 hours from generation).

If valid, it dynamically determines the discount type based on the code prefix:
- `WIN10-` -> 10% percentage discount
- `WIN5-` -> 5% percentage discount
- `FREE-` -> Free shipping
- `CASH150-` -> Rs.150 fixed discount
- (Other tiers require specific cart conditions managed elsewhere)

## 6. LIMITATIONS & NOTES

- **One-time Use (Scratch):** Standard users can only scratch the card once per account. Attempting to hit the API again will fail.
- **Admin Bypass:** Users logged in with the admin email (defined in `.env`) can scratch infinitely for testing purposes. An extra "Try Again" button appears for admins.
- **Auto-Apply:** The code is not currently auto-applied to the cart state instantly; the user must copy it and paste it into the checkout page.
- **SMS Integration:** The OTP system uses a simulated delay and toast notification. A real SMS gateway (like Twilio) would need to be plugged into `app/api/phone-otp/send/route.ts` for production.
- **Performance Constraints:** The canvas scratch effect uses `ctx.getImageData` to calculate the percentage scratched. To ensure 60fps on mobile devices, the algorithm only checks every 4th byte (alpha) and skips pixels in chunks (stride of 16), reducing CPU load significantly while maintaining accurate approximations.
