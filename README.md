# DDN Construction website

A fast, modern, dependency-free static website for **DDN Construction** (Barrie & Simcoe County renovations), rebuilt from the content of the previous WordPress site at ddnconstruction.ca.

## Pages

| URL | File |
| --- | --- |
| `/` | `index.html` |
| `/about-us/` | `about-us/index.html` |
| `/gallery/` | `gallery/index.html` (71 project photos, filters + lightbox) |
| `/contact/` | `contact/index.html` (form, contact details, FAQ, map) |
| `/thank-you/` | `thank-you/index.html` (shown after a form submission) |
| 404 | `404.html` |

The page URLs match the old WordPress site, so existing Google results and links keep working.

## Deploying to Netlify

1. In Netlify choose **Add new site → Import an existing project** and pick this GitHub repository and branch.
2. Leave the build command **empty** and the publish directory as **`.`** (both are already set in `netlify.toml`).
3. Deploy.
4. **Custom domain:** Site configuration → Domain management → add `ddnconstruction.ca` and follow Netlify's DNS instructions. HTTPS is issued automatically.

Alternatively, drag-and-drop the whole folder onto <https://app.netlify.com/drop>.

### Contact form (Netlify Forms)

The quote form on the home and contact pages uses **Netlify Forms**, so no server code is needed.

- After the first deploy, open **Forms** in the Netlify dashboard and make sure form detection is enabled (redeploy once if you just enabled it).
- Submissions appear under **Forms → contact**.
- To get them by email: **Site configuration → Notifications → Emails and webhooks → Form submission notifications → Add notification → Email**, and enter `info@ddnconstruction.ca`.
- Spam is filtered with a hidden honeypot field plus Netlify's built-in spam filtering.

## Editing content

Everything is plain HTML/CSS/JS, so any text editor works.

- **Text:** edit the relevant `index.html` file.
- **Phone / email:** they appear in the header, footer, contact sections and the structured data near the top of `index.html`, `about-us/index.html` and `contact/index.html`. Search and replace `249-989-1441`, `+12499891441` and `info@ddnconstruction.ca`.
- **Colours & fonts:** CSS variables at the top of `assets/css/styles.css` (`--red` is sampled from the logo).
- **Photos:** stored in `assets/img/projects/` as WebP in two sizes (`-lg` 1600px, `-sm` 720px). To add a photo to the gallery, add both sizes and copy one of the `<figure class="gallery__item">` blocks in `gallery/index.html`.

## Structure

```
assets/
  css/styles.css     all styles
  js/main.js         menu, scroll effects, counters, gallery filters, lightbox
  img/               logo, icons, social share image, project photos
netlify.toml         Netlify settings, redirects, caching & security headers
robots.txt, sitemap.xml
```
