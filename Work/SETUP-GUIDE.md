# How to Add Case Studies to Your Site

## What You Got

1. **work.astro** - Updated version of your /work page with all 8 case study cards
2. **gary-bird.astro** - Full case study page template (use as the model for all others)
3. **case-studies-v2.html** - All the written content for every case study

## Step-by-Step

### Step 1: Create the folder for individual case study pages

In your terminal, from your project root:

```bash
mkdir -p src/pages/work
```

This creates a `work` folder inside `pages`. Astro will automatically
create routes like `/work/gary-bird` for any `.astro` file you put here.

**Important:** Your existing `src/pages/work.astro` file will still serve
the `/work` route. The new folder `src/pages/work/` is for sub-pages.
Astro handles this correctly. No conflicts.


### Step 2: Replace your work page

Copy the new `work.astro` file over your existing one:

```
src/pages/work.astro    <-- replace with the new work.astro
```

This keeps your entire existing page structure (hero, stats bar, services,
dream brands, CTA) but replaces the 2-card case study section with all 8
clickable cards. Each card links to `/work/[slug]`.


### Step 3: Add the Gary Bird page

Copy `gary-bird.astro` into the new folder:

```
src/pages/work/gary-bird.astro
```

Visit `localhost:4321/work/gary-bird` to see it. This is your template.


### Step 4: Create the other 7 case study pages

Duplicate `gary-bird.astro` for each case study:

```
src/pages/work/gary-bird.astro         <-- already done
src/pages/work/nick-gray.astro         <-- duplicate + edit
src/pages/work/jai-long.astro          <-- duplicate + edit
src/pages/work/jim-coleman.astro       <-- duplicate + edit
src/pages/work/marie-poulin.astro      <-- duplicate + edit
src/pages/work/upstart-podcast.astro   <-- duplicate + edit
src/pages/work/sweet-fish.astro        <-- duplicate + edit
src/pages/work/personal-channels.astro <-- duplicate + edit
```

For each one, swap out:
- The Layout title and description (line 8-9)
- The tag color and text (line 18-20)
- The h1 title (line 23)
- The subtitle paragraph (line 26)
- The service tags array (line 32)
- The before/after numbers (lines 43-60)
- The metrics grid (lines 65-77)
- The body content (the prose section)
- The blockquote testimonial (if applicable)
- The timeline label and width

All the written content for each case study is in `case-studies-v2.html`.
Just copy the text from each section there into the matching spots in
the Astro template.


### Step 5: Add screenshots (when ready)

1. Create an images folder:
   ```bash
   mkdir -p public/images/case-studies
   ```

2. Drop your screenshot files in there:
   ```
   public/images/case-studies/gary-bird-before.jpg
   public/images/case-studies/gary-bird-after.jpg
   public/images/case-studies/gary-bird-media.jpg
   public/images/case-studies/nick-gray-before.jpg
   public/images/case-studies/nick-gray-after.jpg
   public/images/case-studies/nick-gray-dm.jpg
   etc.
   ```

3. In each case study page, find the commented-out image sections
   (they look like `<!-- SCREENSHOT SLOT: ... -->`) and uncomment them.
   Update the `src` path to match your filename.


### Step 6: Deploy

If you're on Vercel with auto-deploy from Git:

```bash
git add .
git commit -m "Add case studies to /work"
git push
```

Vercel will pick it up automatically.


## Quick Reference: File Structure After

```
src/
  layouts/
    Layout.astro            (unchanged)
  pages/
    work.astro              (updated - 8 case study cards)
    work/
      gary-bird.astro       (full case study page)
      nick-gray.astro       (full case study page)
      jai-long.astro        (full case study page)
      jim-coleman.astro     (full case study page)
      marie-poulin.astro    (full case study page)
      upstart-podcast.astro (full case study page)
      sweet-fish.astro      (full case study page)
      personal-channels.astro (full case study page)
  components/
    Nav.astro               (unchanged)
    Footer.astro            (unchanged)
public/
  images/
    case-studies/           (screenshots go here)
```


## Color Reference (matches your existing theme)

These are already in your Layout.astro CSS variables:

- Primary purple: #6B5CE7
- Periwinkle: #A89FF5
- Mint: #3BFFB3
- Dark: #1A1523
- Off-white: #F7F5FF

The case study pages use these exact values via Tailwind classes
(text-primary, bg-primary/6, etc.) so everything stays consistent.


## Fonts Reference

- Display: Instrument Serif (already loaded in Layout.astro)
- Body: DM Sans (already loaded in Layout.astro)

No new fonts needed.
