The "**OnePage For All App Stores**" Landing Page eases your job when you have a mobile app in different app stores (e.g., App Store or GooglePlay) and like to share it with others!

[Preview the Landing Page here](https://imalitavakoli.github.io/one-page-for-all-app-stores/).

With this Landing Page, you don't need to give your users variety of links or generate multiple QRCodes for each versions of your app in different app stores anymore! From now on, you can simply edit this Landing Page (put your own links, app icon, and description in the page), upload it on your server, generate a single QRCode for the page, and hand it to your users. That's it!




# Features

- Built-in pre-loader.
- **Automatically detects the user's device**, and redirects her to your app's page in App Store (if her device is IOS), or GooglePlay (if her device is Android). If user's device is not recognizable, then user won't be redirected anywhere! The page simply loads, and user herself decides to click to go to the App Store or GooglePlay.
- **Easy editing**. Simply edit one single *.html* file.
- **Easy structure**. Everything is beautifully designed and ready for you. Just replace the dummy content with your own content in the *.html* file.
- **Easy styling**. Simply change some CSS variables in the *.html* file and change the whole page's color theme and feeling.
- I have designed two buttons for App Store and GooglePlay by default. But if your app is available to be downloaded anywhere else, simply edit the *.html* file to add more buttons and links.




# How to use (for beginner users)

Easily open the `dist/index.html` file and edit it!


## How to style the page?

Change the CSS variables' values under the '*Main CSS variables*' section.

``` css
<style>
  :root {
    --oa-headings-color: #333;
    --oa-text-color: #333;
    --oa-text-link-color: #5c6bc0;
    --oa-btn-color: #333;
    --oa-bg-color: #fff;
  }
</style>
```


## Where to put your content and description?

Replace the dummy content with you own content under the '*Container*' section.

``` html
<section class="oa-box-container">
  <figure id="appIcon" class="oa-m-0">
    <img src="images/app-icon.png" alt="My App">
  </figure>
  <h1 class="oa-m oa-text-center">Download 'My App' today</h1>
  <p class="oa-text-center">Lorem ipsum dolor sit <a href="#">amet consectetur</a> adipisicing elit.</p>
  ...
</section>
```


## Where to put your app's links in App Store and GooglePlay?

Change the JS variable's values under the '*My App store URLs*' section.

``` js
let urlIos = 'https://apps.apple.com/app/my-app/id000';
let urlAnroid = 'https://play.google.com/store/apps/details?id=com.mysite.myapp';
```




# How to use (for advanced users)

You can modify the JS and SASS codes in any way that you like. Run the Gulp tasks to preview your modification for development, and build your final touches for production.


## Install Required Dependencies

You must first [download and install node.js](https://nodejs.org/download/) (which includes npm) on your machine. npm stands for [node packaged modules](https://www.npmjs.com/) and is a way to manage development dependencies through node.js.

Then, open your Terminal / Command Prompt and run the following commands.  
**TIP!** If you're not so familiar with command line tools yet, [here is a great start](http://webdesign.tutsplus.com/series/the-command-line-for-web-design--cms-777)!


- Install dependencies: `npm install --global gulp-cli@2.3.0`
- Change directory to this folder on your machine: `cd my/path/to/project`
- Run `npm install` to install all required dependencies

- *Optional!* Run `npm install --save <package>` to install new frontend dependencies
- *Optional!* Run `npm install --save-dev <package>` to install new build dependencies


## Run/Build the Project

- Run `npm start` to preview and watch for changes
- Run `npm run build` to build your webapp for production

- *Optional!* Run `npm start -- --port=8080` to preview and watch for changes in port `8080`
- *Optional!* Run `npm run serve:dist` to preview the production build
- *Optional!* Run `npm run serve:dist -- --port=5000` to preview the production build in port `5000`
- *Optional!* Run `npm run build -- --inject` to build your webapp for production in an injected version (External CSS and JS files will be injected inside of your HTML file automatically)
