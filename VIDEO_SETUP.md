# Demo Video Setup Instructions

## Option 1: YouTube Embed (Recommended)

1. **Upload your demo video to YouTube**:
   - Go to https://www.youtube.com/upload
   - Upload your demo video
   - Make it unlisted or public (your choice)
   - Copy the video ID from the URL (e.g., if URL is `https://www.youtube.com/watch?v=dQw4w9WgXcQ`, the ID is `dQw4w9WgXcQ`)

2. **Update the landing page**:
   - Open `frontend/src/components/LandingPage.tsx`
   - Find the line: `src="https://www.youtube.com/embed/VIDEO_ID?rel=0&modestbranding=1"`
   - Replace `VIDEO_ID` with your actual YouTube video ID
   - Example: `src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1"`

## Option 2: Local Video File

1. **Add your video file**:
   - Place your video file in `frontend/public/` directory
   - Name it `demo-video.mp4` (or `.webm` for better compression)
   - Optional: Add a poster image `demo-video-poster.jpg` in the same directory

2. **Update the landing page**:
   - Open `frontend/src/components/LandingPage.tsx`
   - Comment out the YouTube iframe (lines with `<iframe>`)
   - Uncomment the local video section (lines with `<video>`)
   - The video will automatically play when the page loads

## Option 3: Vimeo Embed

If you prefer Vimeo, replace the YouTube iframe with:

```tsx
<iframe
  className="w-full h-full"
  src="https://player.vimeo.com/video/YOUR_VIDEO_ID?title=0&byline=0&portrait=0"
  title="ProductAI Demo Video"
  frameBorder="0"
  allow="autoplay; fullscreen; picture-in-picture"
  allowFullScreen
></iframe>
```

## Video Recommendations

- **Length**: 2-3 minutes for best engagement
- **Format**: MP4 (H.264) or WebM
- **Resolution**: 1920x1080 (Full HD) minimum
- **Aspect Ratio**: 16:9
- **Content**: Show key features, user flow, and value proposition

## Current Setup

The landing page is currently configured for YouTube embed. Just replace `VIDEO_ID` with your actual video ID.

