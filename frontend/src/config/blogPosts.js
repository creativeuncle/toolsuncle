const posts = [
  {
    title: "5 Ways to Shrink Image File Size Without Losing Quality",
    description:
      "Big images slow down your website and eat up storage. Here are five practical techniques to compress images while keeping them sharp.",
    category: "Image Editing",
  },
  {
    title: "JPG vs PNG vs WebP: Which Format Should You Use?",
    description:
      "Not all image formats are created equal. Learn when to use JPG, PNG, or WebP for the best balance of quality and file size.",
    category: "Image Editing",
  },
  {
    title: "How to Merge Multiple PDFs Into One Document",
    description:
      "Combining scattered PDF files into a single document doesn't have to be complicated. Here's the fastest way to do it online.",
    category: "PDF Tips",
  },
  {
    title: "Turning Scanned Photos Into a Shareable PDF",
    description:
      "Got a stack of JPG scans you need to send as one file? This guide walks through converting images into a clean, print-ready PDF.",
    category: "PDF Tips",
  },
  {
    title: "What is HEIC and Why Won't It Open on My PC?",
    description:
      "iPhones save photos as HEIC by default, which many apps can't read. Here's what HEIC is and how to convert it to JPG in seconds.",
    category: "Tutorials",
  },
  {
    title: "Extracting Every Page of a PDF as an Image",
    description:
      "Sometimes you need individual pages as images instead of a PDF. Here's how to convert PDF pages to JPG without losing layout.",
    category: "PDF Tips",
  },
  {
    title: "Writing Better AI Image Prompts: A Beginner's Guide",
    description:
      "Struggling to describe what you want an AI model to draw? These prompt-writing basics will get you much closer to your vision.",
    category: "AI Tools",
  },
  {
    title: "How AI Can Reverse-Engineer a Prompt From Any Image",
    description:
      "Ever wanted to recreate the style of an image you found online? Learn how AI vision models can describe an image back as a prompt.",
    category: "AI Tools",
  },
  {
    title: "Free Online Tools Every Freelancer Should Bookmark",
    description:
      "From file conversion to compression, these free browser-based tools can save freelancers hours of repetitive manual work.",
    category: "Productivity",
  },
  {
    title: "The Hidden Cost of Uncompressed Images on Your Website",
    description:
      "Large, uncompressed images are one of the biggest reasons websites load slowly. Here's how much it actually costs you.",
    category: "Productivity",
  },
  {
    title: "PDF Not Uploading? Common File Size Limits Explained",
    description:
      "Most upload forms cap file size at a few megabytes. Here's how to shrink or split a PDF so it fits within common limits.",
    category: "PDF Tips",
  },
  {
    title: "A Quick Guide to Choosing Image Quality Settings",
    description:
      "Quality sliders can be confusing. This guide breaks down what 70%, 80%, and 90% quality actually mean for your image size.",
    category: "Image Editing",
  },
  {
    title: "Batch Converting Photos: Tips for Large Photo Libraries",
    description:
      "Converting hundreds of photos one by one is painful. Here's how to think about batch conversion workflows that actually scale.",
    category: "Tutorials",
  },
  {
    title: "Why Do iPhone Photos Look Different on Windows?",
    description:
      "Color and format mismatches between Apple and Windows devices trip up a lot of users. Here's what's really going on.",
    category: "Tutorials",
  },
  {
    title: "Combining Product Photos Into a Single PDF Catalog",
    description:
      "Small businesses often need a quick catalog PDF from a folder of product photos. Here's a simple workflow to build one.",
    category: "Productivity",
  },
  {
    title: "Understanding Lossy vs Lossless Compression",
    description:
      "Compression isn't one-size-fits-all. Learn the difference between lossy and lossless methods and when each one makes sense.",
    category: "Image Editing",
  },
  {
    title: "5 Prompt Styles to Try for AI-Generated Art",
    description:
      "From photorealistic to watercolor, small wording changes in your prompt can completely change the mood of an AI image.",
    category: "AI Tools",
  },
  {
    title: "How to Keep PDFs Print-Ready After Merging",
    description:
      "Merging PDFs can sometimes mess up page size or orientation. Here's how to keep everything print-ready after combining files.",
    category: "PDF Tips",
  },
  {
    title: "Organizing Digital Files: A Simple System That Works",
    description:
      "A messy downloads folder slows everyone down. Here's a lightweight file organization system you can set up in an afternoon.",
    category: "Productivity",
  },
  {
    title: "Why Your Image Editor Keeps Changing the File Format",
    description:
      "Ever export a PNG and somehow end up with a JPG? Here's why editors sometimes silently change your image format.",
    category: "Tutorials",
  },
  {
    title: "Best Practices for Sharing Large Files Online",
    description:
      "Compression, format choice, and splitting large files all affect how smoothly your files share and download. Here's what matters most.",
    category: "Productivity",
  },
  {
    title: "The Difference Between Vector and Raster Images",
    description:
      "Not sure why your logo looks blurry when resized? Understanding vector vs raster images explains exactly why.",
    category: "Image Editing",
  },
  {
    title: "How AI Prompt Generators Save Creators Time",
    description:
      "Coming up with the perfect prompt from scratch takes practice. Here's how AI-assisted prompt generation speeds up the process.",
    category: "AI Tools",
  },
  {
    title: "A Beginner's Checklist Before Converting Any File",
    description:
      "Before you convert a file from one format to another, run through this quick checklist to avoid losing quality or data.",
    category: "Tutorials",
  },
];

export const blogPosts = posts.map((post, i) => ({
  id: i + 1,
  slug: `post-${i + 1}`,
  image: `https://picsum.photos/seed/dctools-${i + 1}/600/400`,
  author: "Dctools",
  ...post,
}));
