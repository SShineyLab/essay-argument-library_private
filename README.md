# Essay Argument Library — standalone edition

This is a read-only, framework-free website containing the extracted contents of 38 essays: their topics, argument structure, examples and short quotations. It does not contain the complete essay texts and does not depend on ChatGPT after publication.

## Publish it on GitHub Pages

1. Create a new **public** GitHub repository named `essay-argument-library`.
2. Extract the ZIP and upload **all files inside this folder** to the repository. Make sure `index.html` is at the repository's top level.
3. Open the repository's **Settings → Pages**.
4. Under **Build and deployment**, choose **GitHub Actions** as the source.
5. Open the **Actions** tab and wait for “Deploy to GitHub Pages” to finish.

Your address will normally be:

`https://YOUR-GITHUB-USERNAME.github.io/essay-argument-library/`

## Test it on your computer

The browser must serve the files over HTTP so it can read the catalogue. In this folder, run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. VS Code's Live Server extension also works. Double-clicking `index.html` directly may not load the data because modern browsers block local file requests.

## Future updates

The catalogue is stored in `data/essays.json`. When you provide more essays, the extraction can be rerun and that file replaced. Pushing the updated file to the `main` branch automatically republishes the site.

The site is deliberately read-only. It has no login, database, forms, analytics or external dependencies.
