# 👥 TEAM SETUP GUIDE

## 🎯 For All Team Members

### Step 1: Pull Latest Code
```bash
git pull origin main
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Setup Environment File
```bash
# Copy the example file
cp .env.example .env

# The .env file already has the correct Supabase keys
# NO CHANGES NEEDED!
```

### Step 4: Run the Application
```bash
npm run dev
```

### Step 5: Login
- Go to: http://localhost:5173
- Use admin credentials (ask super admin for credentials)

---

## ✅ Important Notes

### Everyone Uses:
- ✅ **Same Supabase project** (wozvgekvgdggjwayamxn)
- ✅ **Same `.env` file** (with anon key only)
- ✅ **Same database** (shared data)
- ✅ **Same admin credentials** (created by super admin)

### DO NOT:
- ❌ Create separate Supabase projects
- ❌ Add service role key to `.env`
- ❌ Modify Supabase configuration
- ❌ Create admin users from the app

---

## 🔑 Getting Admin Access

### If You Need Admin Access:

1. **Ask the super admin** to create your account
2. Super admin will:
   - Go to Supabase Dashboard
   - Create your auth user
   - Add you to admin_users table
   - Give you your credentials
3. **Login** with provided credentials
4. **Change your password** after first login

---

## 🐛 Troubleshooting

### "supabaseKey is required" Error
**Solution**: Restart your dev server
```bash
# Stop server (Ctrl + C)
npm run dev
```

### "No data showing" Error
**Solution**: Make sure you're logged in and RLS policies are applied

### "Different behavior than teammate" Error
**Solution**: Make sure you're using the same `.env` file (pull latest code)

### "Can't create admin users" Error
**Solution**: This is correct! Admin creation is now done via Supabase Dashboard only

---

## 📝 Development Workflow

### Daily Workflow:
1. Pull latest code: `git pull`
2. Install any new dependencies: `npm install`
3. Run dev server: `npm run dev`
4. Make your changes
5. Test thoroughly
6. Commit and push: `git add . && git commit -m "..." && git push`

### Before Pushing:
- ✅ Test your changes
- ✅ Make sure app runs without errors
- ✅ Don't commit `.env` file (it's in `.gitignore`)
- ✅ Don't commit sensitive keys

---

## 🔒 Security Reminders

### NEVER:
- ❌ Share service role key
- ❌ Commit `.env` file to Git
- ❌ Expose Supabase keys publicly
- ❌ Bypass RLS policies
- ❌ Create separate Supabase projects

### ALWAYS:
- ✅ Use anon key in frontend
- ✅ Keep `.env` file private
- ✅ Test with proper authentication
- ✅ Follow RLS policies
- ✅ Use shared Supabase project

---

## 📞 Need Help?

### Contact:
- **Super Admin**: [Your Name/Email]
- **GitHub Issues**: [Repository URL]
- **Documentation**: See `SECURITY_FIX_APPLIED.md`

### Common Questions:

**Q: Can I create admin users from the app?**
A: No, admin creation is now done via Supabase Dashboard only.

**Q: Why is my app behavior different from my teammate?**
A: Make sure you pulled the latest code and are using the same `.env` file.

**Q: Do I need my own Supabase project?**
A: No! Everyone uses the same shared Supabase project.

**Q: Where do I get the Supabase keys?**
A: They're already in `.env.example`. Just copy it to `.env`.

---

## ✅ Setup Checklist

Before starting development:

- [ ] Pulled latest code from GitHub
- [ ] Ran `npm install`
- [ ] Copied `.env.example` to `.env`
- [ ] Verified `.env` has correct Supabase URL and anon key
- [ ] Ran `npm run dev` successfully
- [ ] Can access http://localhost:5173
- [ ] Have admin credentials from super admin
- [ ] Can login successfully
- [ ] See data in dashboard

---

**Last Updated**: December 24, 2024
**Status**: Active
**Team Size**: [Your Team Size]
