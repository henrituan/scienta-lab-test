Patient clusters visualization, deployed at: [https://cluster-visualization.henrituan.com](https://cluster-visualization.henrituan.com/)

## Features

- Zoomable graph
- Click on ponts to show cluster details
- Filters by AvgAge, Female %, Symptoms
- Graph settings: Maximum number of points to render. Higher points rendered requires more RAM.
- Graph settings: Proximity radius (do not render too many points close to each other). Smaller radius means more points rendered -> requires more RAM
- Show loader when the Graph is updating

## Technical choice

- [Visx](https://airbnb.io/visx): Flexible, highly customizable, based on `D3`
- [D3-Quadtree](https://d3js.org/d3-quadtree): Optimal way to browse through big objects/array. Support cooridnated dataset
- [Mobx](https://mobx.js.org/README.html): Out of the box memorization, important in manipulating QuadTree on client side
- NextJs and Vercel: support Static file generation to speed up first load

## Approach

- Load dataset `patients` and `clusters` on serverside
- On client side, save `patients` as a QuadTree
- Use `QuadTree` for all operations instead of raw `patients` dataset

## Demo

https://www.loom.com/share/2bd75dda2f4d4254b5d9ef8a2597db2a

## Run on local

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
