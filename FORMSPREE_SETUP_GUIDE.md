# Formspree Setup Guide for IPRT Registration System

## 🎯 Why Formspree is Better Than EmailJS

✅ **Much Simpler Setup** - No templates needed
✅ **More Reliable** - Better delivery rates
✅ **File Uploads** - Supports CV attachments easily
✅ **No Configuration Hassles** - Just one form ID
✅ **Free Plan** - 50 submissions/month (perfect for NGO)
✅ **Professional Emails** - Clean, formatted emails

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Formspree Account
1. Go to [https://formspree.io/](https://formspree.io/)
2. Sign up with your email (free account)
3. Verify your email address

### Step 2: Create Your Form
1. Click **"New Form"**
2. **Form Name**: "IPRT Registration Forms"
3. **Email**: `abdallaahmet11@iprt.org` (your admin email)
4. Click **"Create Form"**

### Step 3: Get Your Form ID
1. After creating the form, you'll see a **Form ID** like: `xpznvqko`
2. Copy this Form ID

### Step 4: Update Your .env File
Replace `your_formspree_form_id` with your actual Form ID:

```env
# Formspree Configuration for External Registration Forms
VITE_FORMSPREE_FORM_ID=xpznvqko
VITE_ADMIN_EMAIL=abdallaahmet11@iprt.org
```

### Step 5: Test It!
1. **Restart your dev server**: `npm run dev`
2. **Go to any registration form** (Seminars, Workshops, New Intakes)
3. **Fill out and submit** a test registration
4. **Check your email** (`abdallaahmet11@iprt.org`) for the registration

## 📧 What You'll Receive

When someone registers, you'll get a **professional email** with:

```
Subject: New Seminar Registration: Sustainable Development Goals

From: mohamed.abdullah@example.com
To: abdallaahmet11@iprt.org

Registration Type: Seminar Registration
Seminar Title: Sustainable Development Goals: A Practical Approach
Seminar Date: February 20, 2024

Participant Name: Mohamed Abdullah Ali
Participant Email: mohamed.abdullah@example.com
Participant Phone: 0112233321
Organization: Not specified

Additional Message: Looking forward to learning about SDGs

Submission Date: 1/27/2025, 3:45:23 PM
Form Source: IPRT NGO Website
```

## 🎯 Benefits for IPRT

### **For Seminars:**
- Participant details
- Organization (if provided)
- Additional questions/requirements

### **For Workshops:**
- Participant details
- Experience level (Beginner/Intermediate/Advanced)
- Learning expectations

### **For Program Applications:**
- Complete applicant information
- Educational background
- Relevant experience
- Motivation statement
- **CV file attachment** (if uploaded)

## 🔧 Formspree Dashboard Features

### **View Submissions:**
- See all registrations in one place
- Export to CSV for record keeping
- Search and filter submissions

### **Email Notifications:**
- Instant email when someone registers
- Professional formatting
- All data included

### **File Handling:**
- CV uploads automatically attached to emails
- Secure file storage
- Download files anytime

## 📊 Free Plan Limits

- **50 submissions/month** (perfect for NGO)
- **File uploads included**
- **Email notifications**
- **Spam protection**
- **Basic analytics**

## 🛡️ Security & Reliability

- **Spam Protection**: Built-in spam filtering
- **GDPR Compliant**: Data protection included
- **99.9% Uptime**: Very reliable service
- **SSL Encrypted**: Secure data transmission

## 🚀 Advanced Features (Optional)

### **Custom Thank You Page:**
Set up redirect after successful submission

### **Webhooks:**
Integrate with other systems if needed

### **Team Access:**
Add other team members to view submissions

## 🎉 Ready to Use!

Once you update the `.env` file with your Form ID:

1. **All registration forms will work immediately**
2. **You'll receive emails for every registration**
3. **No templates or complex setup needed**
4. **File uploads work automatically**

## 📞 Support

- **Formspree Docs**: https://help.formspree.io/
- **Support**: Available through dashboard
- **Community**: Active support community

## 🎯 Next Steps

1. **Create Formspree account**
2. **Get your Form ID**
3. **Update .env file**
4. **Test registration forms**
5. **Start receiving registrations!**

Formspree is the perfect solution for IPRT's registration needs! 🚀