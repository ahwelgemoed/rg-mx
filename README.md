 <img  align="center" alt="headerIMG" src="./github-images/Header.png" target="_blank" />
  <br/>  <br/>
<p align="center">
  <a href="">
    <img alt="License: MIT" src="https://img.shields.io/badge/Status-Very Beta-blue?style=for-the-badge" target="_blank" />
  </a>
  <a href="">
    <img alt="License: MIT" src="https://img.shields.io/github/issues/ahwelgemoed/rg-mx?style=for-the-badge" target="_blank" />
  </a>
  <a href="">
    <img alt="GitHub issues" src="https://img.shields.io/github/release/ahwelgemoed/rg-mx?style=for-the-badge" target="_blank" />
  </a>
  <a href="/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/badge/license-Apache%202.0-orange.svg?style=for-the-badge" target="_blank" />
  </a>
  <br/>
</p>
<h3>Key Features</h3>

- Open Mendix Projects From Mac
- Open Styles In VS Code or Terminal
- Open Mendix Project in Terminal or CMD
- List all Android Simulators on device
- Install Make it Native 8 or 9
- List All Widgets
- Open Widgets in VS Code or Terminal
- List all GH Users Gists

<h3>The Idea behind RG-MX</h3>
<hr/>
As a Mendix Widget Developer, I work and Develop from a Mac, but as Mendix Studio currently is only available on Windows, I use Parallels as my Windows Client.

This means when I develop Widgets, I am switching between mac with Vscode, Windows for Mendix Studio, browser for Web View and when I develop Native Widgets the Android studio as well. When building Design Systems for Mendix I need to open deep nested folders to find the appropriate sass folders. As a developer who jumps constantly from one project to another I need to open and close multiple projects a day. This all leads to window-drown, where I have way to many windows open and that hurts my head and performance. I ideally I would like to close all I don't use and only have open only what I am working with.

The idea with the app is to be able to close a project and get back to it with a simple click of a button. This apps solves that.

<h3>How It Works</h3>
<hr/>
You install the app on your windows machine and the app on your macbook.

You point the Windows app to your Mendix folders and Copy the Windows Address.

You then go to the mac app and point it to your Mendix Apps Folders. In the Mac app you also add the windows address you added and point it to your widgets folder (if you use it), you also add your github username to get all your gists (again only if you use it).

This will then list out all projects you have. It then gives you the ability to open studio quickly, or Vscode ect.

<h4>Setup Steps</h4>
<br/>
<h4>🛑 Before You Start</h4>

For the App to work you will have some prior setup that need to be done.

- VSCode must be installed and added to your PATH ([macOS](https://code.visualstudio.com/docs/setup/mac#_launching-from-the-command-line)/[Windows](https://code.visualstudio.com/docs/setup/windows#_installation))
- Parallels must be Setup according to Mendix Docs ([Mendix Docs](https://docs.mendix.com/howto/mobile/using-mendix-studio-pro-on-a-mac))
- All Mendix projects must be in one folder (Nesting is not yet supported [see here](https://github.com/ahwelgemoed/rg-mx/projects/1#card-54876549))
- (Optional) Android Studio must be installed and Configured as Stated by React Native Team ([React Native Setup](https://reactnative.dev/docs/environment-setup#installing-dependencies))
- (Optional) All Widgets on Mac must be one folder

<br/>
<h4>1️⃣ Step One</h4>

Download the `.dmg` and `.exe`, they should currently be about 200mb each.

<h4>2️⃣ Step two</h4>

Install the windows app, and open it up, allow network connection.

<h4>3️⃣ Step three</h4>

Install the mac app and open it up. You might run into permissions issues as the app is not signed. [See here](https://support.apple.com/en-gb/guide/mac-help/mh40616/mac) how to install unsigned apps, it should be straight forward.

<h4>4️⃣ Setup Windows App</h4>
 <img  align="center" alt="headerIMG" width='400' src="./github-images/windows-app-setup.png" target="_blank" />

- Click _Choose Mendix Folder Path_ and navigate to any app in your Mendix Projects folder and click on any `.mrp` file. The app should then work out were all your mendix apps are.

 <img  align="center" alt="headerIMG" width='400' src="./github-images/windows-ip.png" target="_blank" />

- Copy the IP address in the main window

<h4>6️⃣ Setup Mac App</h4>
 <img  align="center" alt="headerIMG" height='500' src="./github-images/mac-app-setup.png" target="_blank" />

- Copy the IP from the windows app and Paste it in the "Set Windows IP"

- Click _Choose Mendix Folder Path_ and navigate to any app in your Mendix Projects folder and click on any `.mrp` file. The app should then work out were all your mendix apps are.

- Click _Choose Widgets Folder Path_ and navigate to the folder on your mac where all your Mendix Widgets are and select a `READ ME.md` from any of the projects

- Enter the github user name of the person who _gists_ you want.

 <h4>7️⃣ Done</h4>
After this your Windows app knows where all the Mendix projects are, You Mac app know where all the projects are.

Every 30 Seconds The Windows app pings the Mac app with all the projects that there are.

<h3>Technical Info</h3>
<hr/>

This is a Electron app, with a Socket IO Server. certain commands from the mac is passed to the socket server where the windows app listen as executes them.

Every 30 Seconde the Windows App Pings the Mendix projects.

Every 15 Mins the Windows app looks for more Projects in the Mendix Folder

Both apps `.dmg` and `.exe` are exactly the same.

On startup in the main process, the Operating system is detected and if its macOS it will Make a "Tray" app and if Windows it will make a "Browser" App. This is why both installs are relatively big, because the Mac app has a socket server that never gets used, and the Windows app has .apks it can never access. This was done to keep the project as simple as possible, as keeping it all together and separating functionality based on OS and Routes seemed very easy. It has led to some spaghetti code and was more of a headache than expected, I would not recommend anyone ever do it.

<h3>FAQ</h3>
<hr/>
Q - "I use alfred, why do I need this?"

A- You don't

<h3>Known Issues</h3>
<hr/>

- [[Issue #1](https://github.com/ahwelgemoed/rg-mx/issues/1)]
  Currently the app size is very big. as the `apks` for Android is shipped with it. Ideally It would be downloaded every time the user request it.
