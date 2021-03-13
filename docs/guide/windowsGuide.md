# Windows Guide and Features

## Install

1. Download [here](https://github.com/ahwelgemoed/rg-mx/releases)

2. Install the `.exe`

## On First Startup

Allow Local Network connection otherwise the App wont see the Mac App

<img  align="center" alt="headerIMG" width='400' src="https://raw.githubusercontent.com/ahwelgemoed/rg-mx/main/docs/_media/windows_settings.png" target="_blank" />

1. Click _Choose Mendix Folder Path_ and navigate to any app in your Mendix Projects folder and click on any `.mpr` file. The app should then work out were all your mendix apps are.

2. Select Your Folder Setup.

   - Smart Collect - The App tries and Group Branched Projects together from Flat folder Structure

   - Plain - Lists files as they are in the folder

Note currently RG-MG does not support Nested Folders

### Supported

```
└── Mendix Apps
    │
    ├── Project 1 - Dev
    ├── Project 1 - Main
    ├── Project 2
    └── Project 3

```

### Not Supported

```
└── Mendix Apps
    ├── Project 1
    │   │
    │   ├── Project 1 - Main
    │   └── Project 1 - Dev
    │
    └── Project 2

```

Move on to the macOS guide [here](/guide/macGuide.md).
