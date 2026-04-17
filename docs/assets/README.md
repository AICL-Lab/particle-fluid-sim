# Documentation Assets

> **Version**: 2.0.0 | **Last Updated**: 2026-04-17

This directory contains static assets used in the project documentation.

---

## Directory Structure

```
assets/
├── images/          # Screenshots, diagrams
├── diagrams/        # Architecture diagrams (SVG/ PNG)
└── examples/        # Example code snippets, config files
```

---

## Image Guidelines

### Screenshots

- Use PNG format for screenshots
- Optimize images before adding (use tools like `optipng`)
- Keep images under 500KB when possible
- Use descriptive filenames: `simulation-overview.png`

### Diagrams

- Prefer SVG for diagrams (scalable, smaller file size)
- Use consistent color scheme across all diagrams
- Include alt text when embedding in markdown

---

## Diagram Colors

The project uses the following color palette for diagrams:

| Element | Color | Hex |
|---------|-------|-----|
| CPU | Blue | `#3178C6` |
| GPU | Purple | `#9966CC` |
| Data Flow | Gray | `#666666` |
| Highlight | Cyan | `#00BCD4` |
| Warning | Orange | `#FF9800` |

---

## External Assets

### Project Logo

The project uses WebGPU branding:
- WebGPU Logo: Available from [WebGPU website](https://www.w3.org/TR/webgpu/)

### Browser Compatibility Icons

Browser icons are from [Shield.io](https://shields.io/):
- Chrome, Edge, Safari, Firefox badges

---

## Adding New Assets

1. Place images in appropriate subdirectory
2. Optimize the file size
3. Update this README if adding new categories
4. Reference assets using relative paths in markdown

### Example Usage

```markdown
![Simulation Screenshot](../assets/images/simulation-screenshot.png)
```

---

## Current Assets

| File | Type | Description |
|------|------|-------------|
| *(none yet)* | - | Add assets as needed |

---

## Related Documentation

- [Architecture Overview](../architecture/README.md)
- [Tutorials](../tutorials/README.md)
