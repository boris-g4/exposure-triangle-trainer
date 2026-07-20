# Exposure Triangle Trainer

An interactive educational tool for learning how aperture, shutter speed, and ISO work together.

The trainer demonstrates that different combinations of camera settings can produce photographs with the same overall brightness. It is designed for photography students who are learning manual exposure and the concept of equivalent exposures.

## How It Works

The student selects an initial combination of:

- aperture;
- shutter speed;
- ISO.

After changing one of the exposure settings, the student must compensate for that change using another setting while keeping the overall exposure unchanged.

The trainer calculates the difference in exposure stops and shows whether the new combination produces:

- the same brightness;
- a brighter image;
- a darker image.

## Features

- Interactive aperture, shutter speed, and ISO controls
- Exposure difference calculation in stops
- Equivalent exposure training
- Clear visual feedback
- Russian and Ukrainian language versions
- Responsive layout for desktop and mobile devices
- Relative file paths for deployment in a website subdirectory
- No backend or database required
- No build process required

## Technologies

- HTML
- CSS
- Vanilla JavaScript

The project does not require any JavaScript frameworks or server-side functions.

## Project Structure

```text
exposure-triangle-trainer/
├── assets/
│   ├── css/
│   ├── images/
│   └── js/
├── tests/
├── uk/
│   └── index.html
├── index.html
└── README.md
```
