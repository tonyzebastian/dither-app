# 🎨 Dithered Photo Animation App

A web-based application that transforms photos into beautiful animated dot patterns using dithering techniques. Upload an image, customize the animation, and export your creation as static images or GIFs.

![Demo Screenshot](https://via.placeholder.com/800x400/1e3a8a/ffffff?text=Dithered+Photo+Animation+Demo)

## ✨ Features

### 🖼️ Image Processing
- **Smart Upload**: Drag & drop or click to upload images (JPG, PNG, WebP)
- **Auto Optimization**: Automatic resizing and color extraction (up to 5MB)
- **High Quality**: 5000 dots with complete edge coverage for detailed results

### 🎭 Visual Controls
- **Background Colors**: White, Black, Dark Blue, Dark Green, Dark Red
- **Monochrome Mode**: Convert to grayscale instantly
- **Dot Size Control**: Adjustable from 10% to 100%
- **Real-time Preview**: See changes immediately

### 🌊 Animations
- **Ripple**: Concentric circles expanding from center
- **Wave**: Horizontal sine wave with size variations
- **Pulse**: Synchronized breathing effect across all dots
- **Canvas-based**: Smooth 60fps animations

### 📤 Export (Coming Soon)
- **PNG Export**: High-resolution static images
- **GIF Export**: Animated sequences with custom settings
- **Multiple Resolutions**: 1x, 2x, 4x scaling options

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser with Canvas API support

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd dither-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Usage

1. **Upload Image**: Drag & drop an image or click "Choose File"
2. **Customize**: Adjust monochrome, background color, and dot size
3. **Animate**: Select animation type and hit play
4. **Export**: Save as PNG or GIF (coming soon)

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Testing
npm test                # Run tests once
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage

# Linting
npm run lint            # Check code quality
```

### Project Structure

```
src/
├── components/         # React components
│   ├── ui/            # Shadcn/ui components
│   ├── App.jsx        # Main app component
│   ├── MainCanvas.jsx # Canvas with integrated upload
│   ├── Configurations.jsx # Settings panel
│   └── ExportControls.jsx # Export options
├── hooks/             # Custom React hooks
│   └── useImageProcessor.js
├── utils/             # Core utilities
│   ├── ImageProcessor.js    # Image handling
│   ├── DitheredRenderer.js  # Dot rendering
│   └── AnimationController.js # Animation engine
└── __tests__/         # Test files
```

### Tech Stack

- **React 18+** - UI framework
- **Vite** - Build tool and dev server
- **Canvas API** - Image processing and rendering
- **Shadcn/ui** - Component library
- **Tailwind CSS** - Styling
- **Vitest** - Testing framework

## 🌐 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   # Build the project
   npm run build
   
   # Deploy to Vercel
   vercel --prod
   ```

3. **One-click Deploy**:
   
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

### Netlify

1. **Build Command**: `npm run build`
2. **Publish Directory**: `dist`
3. **Deploy**:
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Build and deploy
   npm run build
   netlify deploy --prod --dir=dist
   ```

### GitHub Pages

1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json**:
   ```json
   {
     "homepage": "https://<username>.github.io/<repository-name>",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build and run
docker build -t dither-app .
docker run -p 80:80 dither-app
```

### Other Platforms

| Platform | Build Command | Output Directory |
|----------|---------------|------------------|
| **Firebase Hosting** | `npm run build` | `dist` |
| **AWS Amplify** | `npm run build` | `dist` |
| **Surge.sh** | `npm run build` | `dist` |
| **Railway** | `npm run build` | `dist` |

## 🔧 Configuration

### Environment Variables

Create a `.env` file for custom configuration:

```env
# Optional: Custom upload limits
VITE_MAX_FILE_SIZE=5242880  # 5MB in bytes
VITE_MAX_CANVAS_SIZE=2048   # Max canvas dimension

# Optional: Analytics
VITE_GA_TRACKING_ID=your-tracking-id
```

### Vite Configuration

The app includes optimized Vite configuration in `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000  # Development server port
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  }
})
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests (`npm test`)
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines

- Write tests for new features
- Follow existing code style (Prettier + ESLint)
- Update documentation for significant changes
- Test across different browsers and devices

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Issues & Support

- **Bug Reports**: [Create an issue](../../issues/new?template=bug_report.md)
- **Feature Requests**: [Create an issue](../../issues/new?template=feature_request.md)
- **Questions**: [Discussions](../../discussions)

## 🎉 Acknowledgments

- Built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
- UI components by [Shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

---

**Made with ❤️ for creative visual expression**