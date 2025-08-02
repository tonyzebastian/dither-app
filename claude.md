# claude.md - Dithered Photo Animation App - Current Status & Next Steps

## **Project Overview**
A web-based dithered photo animation app that converts photos into animated dot patterns. Users can upload photos, apply dithering effects, create interactive animations, and export them as static images or GIFs.

## **Technology Stack**
- **React 18+** with JavaScript (no TypeScript)
- **Vite** as build tool  
- **Canvas API** for image processing and rendering
- **Shadcn/ui** for component library
- **Tailwind CSS** for styling
- **Vitest + React Testing Library** for testing

## **Current Implementation Status**

### **✅ COMPLETED FEATURES**

#### **Core Functionality**
- ✅ **Project Setup**: Vite + React + Tailwind + Shadcn/ui configured
- ✅ **Image Processing**: Upload, resize, color extraction, validation (5MB limit)
- ✅ **Dithering Engine**: 5000 dots with complete grid coverage, circle dots only
- ✅ **Animation System**: Wave, Ripple, Pulse animations using Canvas API
- ✅ **Background Colors**: White, Black, Dark Blue, Dark Green, Dark Red

#### **UI/UX Design**
- ✅ **Integrated Upload**: Image upload moved into main canvas area with drag & drop
- ✅ **Unified Controls**: Combined dither + animation settings into single "Configurations" section
- ✅ **Simplified Interface**: Removed complexity - always circle dots, always max colors (32)
- ✅ **Smart Defaults**: 40% dot size, Ripple animation, White background
- ✅ **Control Layout**: Monochrome first, then background color picker, dot size, animation type, play/pause

#### **Image Processing Pipeline**
```javascript
// Current workflow:
Upload Image → Resize (1024px max) → Extract 32 Colors → Generate 5000 Dots Grid → Render
```

#### **Animation Controller**  
```javascript
// Implemented animations:
- Wave: Horizontal sine wave with size pulsing
- Ripple: Concentric circles from center point  
- Pulse: Synchronized breathing effect
// All animations respect background color and monochrome mode
```

#### **Component Architecture**
```
/src
  /components
    /ui (Shadcn components)
    - App.jsx ✅
    - Header.jsx ✅ 
    - Sidebar.jsx ✅
    - MainCanvas.jsx ✅ (with integrated upload)
    - Configurations.jsx ✅ (combined dither + animation controls)
    - ExportControls.jsx ✅ (UI only)
  /hooks
    - useImageProcessor.js ✅
  /utils  
    - ImageProcessor.js ✅
    - DitheredRenderer.js ✅
    - AnimationController.js ✅
  /lib
    - utils.js ✅
  /__tests__ 
    - setup.js ✅
    - Various test files ✅
```

### **🎯 CURRENT SETTINGS & DEFAULTS**
- **Dot Count**: 5000 (for touching dots coverage)
- **Dot Shape**: Circle only (simplified)
- **Color Count**: 32 always (maximum quality)
- **Default Dot Size**: 40%
- **Default Animation**: Ripple
- **Default Background**: White
- **Upload Limit**: 5MB, JPG/PNG/WebP

### **🎨 USER INTERFACE**
```javascript
// Current layout:
<Header /> // Clean header without export buttons
<div className="flex">
  <Sidebar> // Configurations + Export
    <Configurations>
      - Monochrome Mode (first)
      - Background Color (5 swatches)  
      - Dot Size (slider 10-100%)
      - Animation Type (Ripple/Wave/Pulse)
      - Play/Pause (single button)
    </Configurations>
    <ExportControls>
      - PNG Export (static)
      - GIF Export (animation)
    </ExportControls>
  </Sidebar>
  
  <MainCanvas> // Integrated upload + preview
    {processedImage ? (
      <Canvas + ChooseAnother + RemoveImage />
    ) : (
      <UploadInterface />
    )}
  </MainCanvas>
</div>
```

---

## **🚧 TODO: REMAINING FEATURES**

### **1. UI Polish & Cleanup**
**Priority: Medium**

#### **Responsive Design**
- [ ] Mobile-first responsive layout
- [ ] Collapsible sidebar on mobile
- [ ] Touch-friendly controls
- [ ] Better mobile upload experience

#### **Visual Polish**
- [ ] Smooth transitions between states
- [ ] Loading animations and skeletons
- [ ] Better hover states and feedback
- [ ] Improved spacing and typography
- [ ] Dark mode support for UI (not just canvas background)

#### **UX Improvements**
- [ ] Keyboard shortcuts (Space for play/pause, etc.)
- [ ] Drag & drop visual feedback improvements  
- [ ] Better error messaging with recovery suggestions
- [ ] Progress indicators for long operations
- [ ] Undo/redo functionality

### **2. Export Functionality** 
**Priority: High**

#### **Static PNG Export**
- [ ] Canvas-to-PNG conversion
- [ ] Custom resolution options (1x, 2x, 4x)
- [ ] Download with proper filename
- [ ] Export with current settings (background, monochrome, dot size)

#### **Animated GIF Export**
- [ ] Record animation frames
- [ ] GIF encoding (use library like gif.js)
- [ ] Custom duration and loop settings
- [ ] Frame rate options (12fps, 24fps, 30fps)
- [ ] File size optimization
- [ ] Export progress indicator

#### **Advanced Export Options**
- [ ] Video export (MP4/WebM) 
- [ ] Batch export (multiple variations)
- [ ] Custom canvas dimensions
- [ ] Watermark/signature options

### **3. Additional Animation Types**
**Priority: Medium**

#### **New Animation Patterns**
- [ ] **Spiral**: Dots rotate in spiral pattern from center
- [ ] **Zoom**: Dots scale in/out with wave effect  
- [ ] **Rotate**: Entire image rotates while dots pulse
- [ ] **Scatter**: Random organic movement
- [ ] **Flow**: Directional movement (left-to-right, etc.)
- [ ] **Gravity**: Dots fall and bounce
- [ ] **Explosion**: Dots expand outward then contract

#### **Animation Customization**
- [ ] Speed controls (0.5x to 3x)
- [ ] Direction controls (reverse, alternate)
- [ ] Easing options (linear, ease-in-out, bounce)
- [ ] Multiple simultaneous animations
- [ ] Custom animation sequencing

#### **Interactive Animations**
- [ ] Mouse/touch interaction (follow cursor)
- [ ] Audio-reactive animations (microphone input)
- [ ] Click-to-trigger effects
- [ ] Gesture-based controls on mobile

---

## **🛠 DEVELOPMENT COMMANDS**

```bash
# Development  
npm run dev              # Start development server (localhost:3000)
npm run test:watch       # Run tests in watch mode
npm run build           # Build for production
npm run preview         # Preview production build

# Testing
npm test                # Run all tests
npm run test:coverage   # Run with coverage report
```

## **📁 KEY FILES TO WORK WITH**

### **For Export Implementation:**
- `src/components/ExportControls.jsx` - Add real export functionality
- `src/utils/ExportManager.js` - Create new utility for export logic
- `src/hooks/useExporter.js` - Create export hook with progress tracking

### **For New Animations:**
- `src/utils/AnimationController.js` - Add new animation calculations
- `src/components/Configurations.jsx` - Update animation type tabs

### **For UI Polish:**
- `src/components/MainCanvas.jsx` - Improve upload/preview experience
- `src/components/Sidebar.jsx` - Add responsive behavior
- `tailwind.config.js` - Add custom animations and transitions

---

## **🎯 IMPLEMENTATION PRIORITIES**

### **Phase 1: Core Functionality** (✅ COMPLETED)
- Basic image processing and dithering
- Core animation system (Wave, Ripple, Pulse)
- Unified UI with Configurations panel
- Background color system

### **Phase 2: Export System** (🚧 NEXT)
1. PNG export with current canvas state
2. GIF export with animation recording
3. Quality and resolution options
4. Progress feedback

### **Phase 3: Animation Expansion** (🚧 FUTURE)
1. Additional animation types (Spiral, Zoom, Rotate)
2. Animation customization (speed, easing)
3. Interactive features

### **Phase 4: Polish & Production** (🚧 FUTURE)
1. Responsive design completion
2. Performance optimizations
3. Accessibility improvements  
4. Production deployment setup

---

## **💡 ARCHITECTURAL DECISIONS MADE**

### **Canvas Over Three.js**
- Chose Canvas API over Three.js for simpler dot rendering
- Better performance for 2D animations
- Easier to implement export functionality

### **Simplified Controls**
- Always use circle dots (removed shape options)  
- Always use maximum colors (32) for best quality
- Combined dither + animation into single panel
- Moved upload into main canvas area

### **High Dot Density**
- Increased from 1000 to 5000 dots
- Implemented complete grid coverage algorithm
- Ensured dots reach all edges of canvas

### **Smart Defaults**
- 40% dot size for good balance
- Ripple animation as most visually appealing default
- White background as neutral starting point

This approach prioritizes usability and visual quality over complex configuration options.

---

**Next steps**: Focus on implementing PNG/GIF export functionality to complete the core user workflow of create → animate → export.