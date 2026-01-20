# Setup Guide for Your Friend 👋

Hey! Your friend wants to share this project with you. Here's how to get it running on your laptop.

---

## Quick Setup (5 Minutes)

### Step 1: Clone the Repository
```bash
git clone https://github.com/Hariirios/IPRTDMS.git
cd IPRTDMS
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create Environment File
```bash
# Copy the example file
copy .env.example .env
```

### Step 4: Add Supabase Credentials

Open the `.env` file and add these values:

```env
# Application Configuration
VITE_APP_NAME=IPRT
VITE_APP_URL=http://localhost:5173

# Contact Information
VITE_CONTACT_EMAIL=info@iprt.edu
VITE_CONTACT_PHONE=+252-XXX-XXXXXX
VITE_CONTACT_ADDRESS="Mogadishu, Somalia"

# Supabase Configuration
VITE_SUPABASE_URL=https://wozvgekvgdggjwayamxn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvenZnZWt2Z2RnZ2p3YXlhbXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MjQ5MTgsImV4cCI6MjA3OTIwMDkxOH0.zt28bEdGYaX6-q_IIqTn2E0PqajyGdmtuAnTzGp_mHg
```

**Ask your friend for the Supabase credentials if different!**

### Step 5: Start the Application
```bash
npm run dev
```

### Step 6: Open in Browser
Go to: `http://localhost:5173`

---

## Admin Login

To access the admin panel:

1. Go to: `http://localhost:5173/admin`
2. Click "Admin" button
3. Login with:
   - **Email:** `abdallaahmet11@iprt.org`
   - **Password:** Ask your friend for the password

---

## What You'll See

### Main Website
- Home page with IPRT information
- Training programs
- Services
- Success stories
- Contact information
- Multilingual support (English, Somali, Arabic)
- Dark mode toggle

### Admin Dashboard (After Login)
- Dashboard overview
- Projects management
- Students management
- Members management
- Attendance tracking
- Requisitions
- Deletion requests
- Team members

---

## Troubleshooting

### Problem: `npm install` fails

**Solution:**
```bash
# Make sure you have Node.js installed
node --version  # Should be 18.0.0 or higher

# If not installed, download from: https://nodejs.org
```

### Problem: "Missing Supabase environment variables"

**Solution:**
- Make sure you created the `.env` file
- Check that you copied the Supabase URL and Anon Key correctly
- No extra spaces or quotes

### Problem: Can't login to admin

**Solution:**
- Ask your friend for the correct admin password
- Make sure you're using the email: `abdallaahmet11@iprt.org`
- Check browser console (F12) for errors

### Problem: Port 5173 already in use

**Solution:**
```bash
# Vite will automatically use the next available port
# Check the terminal output for the actual port
# Example: http://localhost:5174
```

---

## Project Structure

```
IPRTDMS/
├── components/          # React components
│   ├── admin/          # Admin dashboard components
│   ├── member/         # Member portal components
│   └── ui/             # Reusable UI components
├── pages/              # Page components
├── lib/                # Utilities and data stores
├── public/             # Static assets
├── styles/             # Global styles
└── ...
```

---

## Available Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## Features to Test

### Public Website
- [ ] Home page loads
- [ ] Navigation works
- [ ] Language switcher (English, Somali, Arabic)
- [ ] Dark mode toggle
- [ ] Contact form
- [ ] Responsive design (try on mobile)

### Admin Panel
- [ ] Login works
- [ ] Dashboard shows statistics
- [ ] Can view projects
- [ ] Can view students
- [ ] Can view members
- [ ] Can mark attendance
- [ ] Can view requisitions
- [ ] Notifications work
- [ ] Logout works

---

## Sharing the Same Database

**Good news!** You and your friend are using the **same Supabase database**:

✅ You'll see the same data
✅ Changes sync in real-time
✅ Same admin login works for both
✅ No need to set up your own database

---

## Need Help?

### Documentation Files
- `README.md` - Project overview
- `ADMIN_LOGIN_FIX_COMPLETE.md` - Admin login details
- `TEST_ADMIN_LOGIN.md` - Testing guide
- `SHARE_WITH_FRIEND_GUIDE.md` - Sharing options

### Ask Your Friend
- Admin password
- Supabase credentials (if different)
- Any custom configuration

### Check Console
Press `F12` in browser to see error messages

---

## Next Steps

1. ✅ Get the project running
2. ✅ Test the main website
3. ✅ Login to admin panel
4. ✅ Explore the features
5. ✅ Try making changes (add a project, student, etc.)

---

## Tips

💡 **Hot Reload:** Changes to code will automatically refresh the browser

💡 **Same WiFi:** If you're on the same WiFi as your friend, they can share their dev server with you (see `SHARE_NOW_QUICK_STEPS.md`)

💡 **Git Pull:** To get latest updates from your friend:
```bash
git pull origin main
npm install
```

💡 **Database:** You're both using the same database, so be careful when testing delete operations!

---

**Welcome to the IPRT project!** 🎉

If you have any questions, ask your friend or check the documentation files.

Happy coding! 👨‍💻👩‍💻
