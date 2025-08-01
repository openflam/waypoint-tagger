# OpenFLAME Waypoint Tagger

## Development

The OpenFLAME Waypoint Tagger application is a static site generated using [Vite](https://vite.dev/) build tool and uses [React](https://react.dev/). The generated static site is hosted at [open-flame.com/waypoint-tagger/](https://www.open-flame.com/waypoint-tagger/) using Github Pages.

### Install dependencies

```
cd waypoint-tagger
npm install
```

### Build

```
npm run build
```

### Open the application in browser

The static webpage files are written to the `dist/` directory. Run any HTTP server to see the generated site. For example:

```
cd dist && python3 -m http.server
```

### Deploy

```
npm run deploy
```
