```
npm install -g ntheme
```
ntheme lets you generate and compile a Neto theme!

![](http://design.neto.com.au/assets/uploads/QR0D5N9y3D.png)

## Commands

```
- generate [options] <themeName>  Create a new Neto theme
- compile [options]          Compiles a Neto theme
```

Note that you need [Node.js](https://nodejs.org/en/) installed, and [gulp.js](http://gulpjs.com/) installed globally to run this script successfully.

## Generate a theme

Create your **Themes** directory and `cd` into the directory:

```
cd Themes
```

Now simply run the following command:

```
ntheme generate themeName
```

**Note: You would replace `themeName` with the name of your new theme.**

### Options

**-b 'branch'**

Instead of generating your theme off the Master branch of Skeletal, you can target a branch or release tag. E.g if you wanted to use the Bootstrap4 branch, you could generate your theme like the following:

```
ntheme generate themeName -b "feature/b4"
```

**Note: When you compile your theme you will want to also target this branch/tag.**

## Compile a theme

For a theme to be published to the Neto theme store, it has to be compiled in a certain way which this module takes care of. In order for the compile script to work correctly, your theme will need:

### Neto theme info

Either your theme can have a `THEME_NAME-netohemeinfo.txt` file which is in the templates directory:

```
mythemename
└── src
    └── templates
        └── THEME_NAME-netohemeinfo.txt
```

You can follow the Skeletal file as a template:

- https://github.com/NetoECommerce/Skeletal/blob/master/src/templates/skeletal-netothemeinfo.txt

Or if you do not want to include this file, you can adjust your `package.json` to include a `theme_names` array of theme names. In most cases you will just have the one theme, so it would be:

```
"theme_names": [ "THEME_NAME" ]
```

### Stylesheet

Ensure you have a stylesheet in `./css` called `THEME_NAME-style.css`. This file should contain all your theme editor styles.

### Options

**-b 'branch'**

Instead of compiling your theme off the Master branch of Skeletal, you can target a branch or release tag. E.g if you generated your theme with the Bootstrap4 branch, you would compile with the following command:

```
ntheme compile -b "feature/b4"
```

**Note: When you compile your theme you will have wanted to generated your theme with this branch/tag.** 

## Set up git

Now, you just need to set up git. If you're not experienced with git, We recommend you install [GitHub Desktop](https://desktop.github.com/) and [set up the repository using the app](http://design.neto.com.au/assets/uploads/E9FX9Dej3d.gif).

## Customising templates

It's important to know that your themes repository should only contain the templates which are different to the templates on Skeletal. This is why your new theme only contains the header, footer and homepage by default:

```
mythemename
├── README.md
├── bin
│   └── compile
├── gulpfile.js
├── node_modules
├── package.json
└── src
    ├── css
    │   ├── app.css
    │   ├── app.less
    │   └── mythemename-style.css
    └── templates
        ├── cms
        │   └── home.template.html
        ├── footers
        │   └── template.html
        └── headers
            └── template.html
```

This means that if there are any templates that you wish to customise in your theme which are not included by default, you just need to copy them from the [latest version of Skeletal](https://github.com/NetoECommerce/Skeletal) into your theme.

## How to upload your customisations

To actually develop your theme, you need to install the latest version of Skeletal on your Neto website from the theme builder. From here, you need to upload the contents of your theme's `src` directory over the top of Skeletal's templates.

You will need to configure your FTP application to upload your files without removing any files that are on the server and not in your local directory. This way, your Neto website will be using all of the default Skeletal templates for any templates that are missing from your theme.

## How to compile your styles

Any custom styles which you add to your theme should be done in `src/css/app.less`. This file can be compiled into `app.css` by running the `gulp` command in your theme:

```
cd themeName
gulp
```

This will prompt gulp to watch any changes you make to `src/css/app.less` and automatically compile them. You can add in new build task in the `gulpfile.js`.
