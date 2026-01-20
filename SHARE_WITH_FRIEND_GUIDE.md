# Share Application with Friend - Complete Guide

## Option 1: Local Network Access (Same WiFi) ⚡ FASTEST

If you and your friend are on the same WiFi network, they can access your dev server directly.

### Steps:

#### 1. Find Your Local IP Address

**On Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter (usually starts with `192.168.x.x` or `10.0.x.x`)

**Example output:**
```
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . . . : 192.168.1.100
```

#### 2. Update Vite Configuration

Edit `vite.config.ts`:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow external access
    port: 5173,
  },
});
```

#### 3. Start Development Server
```bash
npm run dev
```

You should see:
```
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.100:5173/
```

#### 4. Share Network URL with Friend
Your friend can access: `http://192.168.1.100:5173` (use YOUR IP address)

### ✅ Pros:
- Instant access
- No deployment needed
- Free
- Real-time updates

### ❌ Cons:
- Only works on same WiFi
- Your computer must stay on
- Dev server must keep running

---

## Option 2: Deploy to Vercel (Production) 🚀 RECOMMENDED

Deploy your app so anyone can access it from anywhere.

### Steps:

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Login to Vercel
```bash
vercel login
```

#### 3. Deploy
```bash
vercel --prod
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? **iprt-website** (or your choice)
- Directory? **./** (press Enter)
- Override settings? **N**

#### 4. Set Environment Variables

After deployment, go to [vercel.com](https://vercel.com):
1. Go to your project
2. Settings > Environment Variables
3. Add these variables:

```
VITE_APP_NAME=IPRT
VITE_APP_URL=https://your-project.vercel.app
VITE_CONTACT_EMAIL=info@iprt.edu
VITE_CONTACT_PHONE=+252-XXX-XXXXXX
VITE_CONTACT_ADDRESS=Mogadishu, Somalia
VITE_SUPABASE_URL=https://wozvgekvgdggjwayamxn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 5. Redeploy
```bash
vercel --prod
```

#### 6. Share URL
Your friend can access: `https://your-project.vercel.app`

### ✅ Pros:
- Works from anywhere
- Professional URL
- Automatic HTTPS
- Free tier available
- Auto-deploys on git push

### ❌ Cons:
- Requires deployment
- Takes a few minutes to set up

---

## Option 3: Ngrok (Tunnel) 🌐 QUICK SHARE

Create a temporary public URL for your local dev server.

### Steps:

#### 1. Install Ngrok
Download from [ngrok.com](https://ngrok.com/download) or:
```bash
npm install -g ngrok
```

#### 2. Start Your Dev Server
```bash
npm run dev
```

#### 3. Create Tunnel (in new terminal)
```bash
ngrok http 5173
```

#### 4. Share URL
You'll see:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:5173
```

Share the `https://abc123.ngrok.io` URL with your friend.

### ✅ Pros:
- Very quick setup
- Works from anywhere
- No deployment needed
- HTTPS included

### ❌ Cons:
- URL changes each time (free tier)
- Your computer must stay on
- Session expires after 2 hours (free tier)
- Requires ngrok account

---

## Option 4: GitHub Pages (Static) 📄

Deploy as a static site on GitHub Pages.

### Steps:

#### 1. Update `vite.config.ts`
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/iprt-website/', // Your repo name
});
```

#### 2. Install gh-pages
```bash
npm install --save-dev gh-pages
```

#### 3. Update `package.json`
Add these scripts:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

#### 4. Deploy
```bash
npm run deploy
```

#### 5. Enable GitHub Pages
1. Go to your GitHub repo
2. Settings > Pages
3. Source: `gh-pages` branch
4. Save

#### 6. Share URL
`https://yourusername.github.io/iprt-website/`

### ✅ Pros:
- Free
- Easy to set up
- Works from anywhere

### ❌ Cons:
- Static only (no server-side features)
- Requires GitHub repo
- Manual deployment

---

## Comparison Table

| Method | Speed | Cost | Access | Best For |
|--------|-------|------|--------|----------|
| **Local Network** | ⚡ Instant | Free | Same WiFi only | Quick testing with nearby friend |
| **Vercel** | 🚀 5 min | Free | Anywhere | Production deployment |
| **Ngrok** | 🌐 2 min | Free* | Anywhere | Quick demo/testing |
| **GitHub Pages** | 📄 10 min | Free | Anywhere | Static sites |

*Free tier has limitations

---

## Recommended Approach

### For Quick Testing (Same Location)
1. Use **Local Network Access** (Option 1)
2. Takes 2 minutes
3. Friend can see changes in real-time

### For Remote Access (Different Locations)
1. Use **Vercel** (Option 2)
2. Professional and reliable
3. Easy to update

### For Quick Demo (Remote)
1. Use **Ngrok** (Option 3)
2. Fastest for remote access
3. No deployment needed

---

## Step-by-Step: Local Network (Recommended for You)

Since you're likely testing together, here's the detailed process:

### 1. Update vite.config.ts
```bash
# Open vite.config.ts and add:
```

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
});
```

### 2. Find Your IP
```bash
ipconfig
```
Note your IPv4 Address (e.g., `192.168.1.100`)

### 3. Start Server
```bash
npm run dev
```

### 4. Share with Friend
Tell your friend to open: `http://YOUR_IP:5173`
Example: `http://192.168.1.100:5173`

### 5. Admin Login
Your friend can login with:
- Email: `abdallaahmet11@iprt.org`
- Password: [Your Supabase password]

---

## Troubleshooting

### Friend Can't Access (Local Network)

**Problem:** Connection refused or timeout

**Solutions:**
1. Check firewall settings:
   ```bash
   # Windows: Allow Node.js through firewall
   # Control Panel > Windows Defender Firewall > Allow an app
   ```

2. Verify same WiFi network:
   - Both must be on same network
   - Not on guest network

3. Try different port:
   ```typescript
   server: {
     host: '0.0.0.0',
     port: 3000, // Try different port
   }
   ```

### Supabase Connection Issues

**Problem:** Database not working for friend

**Solution:** Supabase works from anywhere! No changes needed.
- Your `.env` file has the public anon key
- This key is safe to share
- Works from any location

### Admin Login Not Working

**Problem:** Friend can't login

**Solution:**
1. Verify Supabase credentials are correct
2. Check `.env` file has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Make sure admin user exists (run `verify-admin-user.sql`)

---

## Security Notes

### Safe to Share:
✅ Supabase URL
✅ Supabase Anon Key
✅ Application URL
✅ Admin email (for login)

### Keep Private:
❌ Supabase Service Role Key (never in frontend!)
❌ Admin password
❌ `.env` file (don't commit to git)
❌ Database credentials

---

## Quick Commands Reference

```bash
# Find IP (Windows)
ipconfig

# Start dev server (local network)
npm run dev

# Deploy to Vercel
vercel --prod

# Create ngrok tunnel
ngrok http 5173

# Deploy to GitHub Pages
npm run deploy
```

---

## What Your Friend Needs

### For Local Network Access:
1. Same WiFi network
2. Your IP address
3. Web browser
4. Admin credentials (if testing admin panel)

### For Deployed Version:
1. Internet connection
2. Web browser
3. The deployed URL
4. Admin credentials (if testing admin panel)

---

**Recommendation:** Start with **Local Network Access** (Option 1) for immediate testing, then deploy to **Vercel** (Option 2) for permanent access.

Need help with any of these options? Let me know!
