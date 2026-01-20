# Share with Your Friend - Quick Steps 🚀

## What I Just Did
✅ Updated `vite.config.ts` to allow network access

## What You Need to Do Now

### Step 1: Find Your IP Address (30 seconds)

Open Command Prompt and run:
```bash
ipconfig
```

Look for **"IPv4 Address"** - it will look like:
- `192.168.1.100` or
- `192.168.0.50` or
- `10.0.0.25`

**Example:**
```
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . . . : 192.168.1.100  ← THIS ONE!
```

### Step 2: Start Your Server (10 seconds)

```bash
npm run dev
```

You should see something like:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.100:5173/  ← SHARE THIS!
```

### Step 3: Share with Your Friend

Tell your friend to open their browser and go to:
```
http://YOUR_IP_ADDRESS:5173
```

**Example:** If your IP is `192.168.1.100`, they go to:
```
http://192.168.1.100:5173
```

### Step 4: Friend Can Login

Your friend can login to admin panel at:
```
http://YOUR_IP_ADDRESS:5173/admin
```

**Login credentials:**
- Email: `abdallaahmet11@iprt.org`
- Password: [Your Supabase password]

---

## Important Notes

### ✅ Requirements:
- You and your friend must be on the **same WiFi network**
- Your computer must stay on
- Dev server must keep running

### ⚠️ If It Doesn't Work:

#### Problem: Friend can't connect

**Solution 1 - Check Firewall:**
1. Windows Search: "Windows Defender Firewall"
2. Click "Allow an app through firewall"
3. Find "Node.js" and make sure both Private and Public are checked
4. If not there, click "Allow another app" and add Node.js

**Solution 2 - Verify Same Network:**
- Make sure you're both on the same WiFi
- Not on guest network
- Ask friend to check their WiFi name matches yours

**Solution 3 - Try Different Port:**
If port 5173 is blocked, edit `vite.config.ts`:
```typescript
server: {
    host: '0.0.0.0',
    port: 3000, // Try 3000 instead
}
```
Then restart server and use: `http://YOUR_IP:3000`

---

## Alternative: Deploy Online (If Same WiFi Doesn't Work)

If you can't connect on same WiFi, deploy to Vercel:

```bash
# Install Vercel
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Then share the URL Vercel gives you (works from anywhere!)

---

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't find IP | Run `ipconfig` in Command Prompt |
| Friend gets "Can't reach" | Check firewall, verify same WiFi |
| Server won't start | Close other apps using port 5173 |
| Login doesn't work | Check `.env` has Supabase credentials |

---

## Summary

1. ✅ Run `ipconfig` to get your IP
2. ✅ Run `npm run dev`
3. ✅ Share `http://YOUR_IP:5173` with friend
4. ✅ Friend opens in browser
5. ✅ Both can see the same app!

**Your friend will see exactly what you see!** Any changes you make will update for both of you in real-time.

---

Need help? Check `SHARE_WITH_FRIEND_GUIDE.md` for more detailed options!
