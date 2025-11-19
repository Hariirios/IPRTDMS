# IPRT - Institute for Practical Research & Training

A modern, multilingual website for the Institute for Practical Research & Training, built with React, TypeScript, and Tailwind CSS.

## Features

- 🌍 **Multilingual Support**: English, Somali, and Arabic
- 🌓 **Dark Mode**: Seamless theme switching
- 📱 **Responsive Design**: Mobile-first approach
- ⚡ **Fast Performance**: Built with Vite
- 🎨 **Modern UI**: Tailwind CSS with custom design system
- ♿ **Accessible**: WCAG compliant components
- 🎭 **Smooth Animations**: Framer Motion integration
- 🔐 **Admin Panel**: Full CRUD operations for events, services, and testimonials

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **Animations**: Framer Motion
- **UI Components**: Radix UI
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd iprt-website
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Admin Panel

Access the admin panel at `http://localhost:5173/admin` (or `http://localhost:5174/admin` if running on port 5174)

**Default Credentials**:
- Email: `admin@iprt.edu` or Username: `admin`
- Password: `admin123`

**Note**: Admin credentials are stored in the `.env` file and can be changed by updating:
- `VITE_ADMIN_EMAIL`
- `VITE_ADMIN_USERNAME`
- `VITE_ADMIN_PASSWORD`

### Admin Features

The admin panel allows you to manage:

- **Training Programs**: Add, edit, and delete training programs with image upload from device
- **Services**: Manage service offerings with facilitator information and images
- **Success Stories**: Control graduate testimonials and success stories
- **Image Upload**: Upload images directly from your device (stored as base64)
- **Enhanced Login**: Email/username login with show password and forgot password features

All changes are stored in browser localStorage and persist across sessions.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Application Configuration
VITE_APP_NAME="IPRT"
VITE_APP_URL=http://localhost:5173

# Contact Information
VITE_CONTACT_EMAIL=info@iprt.edu
VITE_CONTACT_PHONE=+252-XXX-XXXXXX
VITE_CONTACT_ADDRESS="Mogadishu, Somalia"

# Social Media Links
VITE_FACEBOOK_URL=https://facebook.com/iprt
VITE_TWITTER_URL=https://twitter.com/iprt
VITE_INSTAGRAM_URL=https://instagram.com/iprt
VITE_LINKEDIN_URL=https://linkedin.com/company/iprt
```

See `.env.example` for all available configuration options.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
iprt-website/
├── components/          # React components
│   ├── home/           # Home page sections
│   ├── ui/             # Reusable UI components
│   └── ...
├── contexts/           # React contexts (Theme, Language)
├── lib/                # Utilities and data
├── pages/              # Page components
├── public/             # Static assets
│   └── assets/         # Images, logos, favicons
├── styles/             # Global styles
└── ...
```

## Branding Assets

All branding assets are located in the `public/assets/` directory:

- `main_logo.png` - Main logo
- `favicon.ico` - Browser favicon
- `favicon-16x16.png` - 16x16 favicon
- `favicon-32x32.png` - 32x32 favicon
- `apple-touch-icon.png` - Apple touch icon
- `android-chrome-192x192.png` - Android icon (192x192)
- `android-chrome-512x512.png` - Android icon (512x512)

## Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Deploy to Vercel (Recommended)

This project is optimized for Vercel deployment. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

**Quick Deploy:**
```bash
npm install -g vercel
vercel login
vercel --prod
```

**Or use Vercel Dashboard:**
1. Import your Git repository at [vercel.com](https://vercel.com)
2. Vercel will auto-detect Vite configuration
3. Add environment variables (see DEPLOYMENT.md)
4. Deploy

**Important:** Don't forget to set up environment variables in Vercel dashboard before deploying!

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2025 Mowlid Haibe. All rights reserved.

## Author & Code Owner

**Main Developer**: Mowlid Haibe  
**GitHub**: [@mawlid1431](https://github.com/mawlid1431)  
**Role**: Code Owner & Lead Developer

## Contact

IPRT - Institute for Practical Research & Training
- Website: [iprt.edu](https://iprt.edu)
- Email: info@iprt.edu
- Location: Mogadishu, Somalia

---

Built with ❤️ for practical education and research
