How to generate PNG and ICO fallbacks from `favicon.svg`

If you have ImageMagick installed (recommended), run:

```bash
# create 32x32 PNG
magick convert -background none favicon.svg -resize 32x32 favicon-32.png

# create apple touch icon (180x180)
magick convert -background none favicon.svg -resize 180x180 apple-touch-icon.png

# create multi-size ICO (16x16,32x32,48x48)
magick convert favicon.svg -background none -resize 16x16 favicon-16.png
magick convert favicon.svg -background none -resize 32x32 favicon-32.png
magick convert favicon.svg -background none -resize 48x48 favicon-48.png
magick convert favicon-16.png favicon-32.png favicon-48.png favicon.ico
```

If you prefer `rsvg-convert` / `inkscape`:

```bash
rsvg-convert -w 32 -h 32 -o favicon-32.png favicon.svg
rsvg-convert -w 180 -h 180 -o apple-touch-icon.png favicon.svg
```

After generating the files, refresh your site (hard refresh / clear cache) to see the updated tab icon. If you want, I can generate the PNG/ICO files here and add them to the repo — tell me if you want me to proceed and I will create them automatically (ImageMagick not available in this environment; I will create simple PNG placeholders if you prefer).