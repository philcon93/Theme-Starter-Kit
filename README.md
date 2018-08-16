```
npm install -g ntheme
```
ntheme lets you generate and compile Neto themes!

![](http://design.neto.com.au/assets/uploads/QR0D5N9y3D.png)

## Commands

```
- generate|g [options] <themeName>  Generates a Neto theme based on a Skeletal branch
- compile|c [options]               Compiles a Neto theme for the theme store
- migrate|m [options]               Migrates a Neto theme so it can use the other Theme Starter Kit scripts based on a Skeletal branch
```

Note that you need [Node.js](https://nodejs.org/en/) installed, and [gulp.js](http://gulpjs.com/) installed globally to run this script successfully.

## Generate a theme

```
ntheme generate themeName
```

**Note: You would replace `themeName` with the name of your new theme.**

### Options

**-b 'branch'**

Instead of generating your theme off the master branch of Skeletal, you can target a branch or release tag. E.g if you wanted to use the v3 branch, you could generate your theme like the following:

```
ntheme generate themeName -b "v3"
```

**Note: When you compile your theme you will want to also target this branch/tag. Compiling should automatically take the generated theme into account.**

## Compile a theme

```
cd themeName
ntheme compile
```

For a theme to be published to the Neto theme store, it has to be compiled in a certain way which this module takes care of. In order for the compile script to work correctly, your theme will need:

### 1. Theme info file

Either your theme can have a `THEME_NAME-netohemeinfo.txt` file which is in the templates directory:

```
themeName
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

### 2. Stylesheet

Ensure you have a stylesheet in `./css` called `THEME_NAME-style.css`. This file should contain all your theme editor styles.

### Options

**-u**

Compiles a theme as if it was installed from theme store, useful if you want to place your theme up via FTP. This can be useful for starting a theme, as you don't have to install Skeletal on your development site, then sync your theme on top of it. That workflow doesn't work if your master theme is a different branch to Skeletal master. It's useful while in development because the stylesheet will be renamed from `THEME_NAME-style.css` to `style.css`, which the header template is referencing. And finally it is useful because this compiled version is the outputted version merchants will get, so it will give you a better understanding of the final product.

```
ntheme compile -u
```

**-b 'branch'**

Instead of compiling your theme off the master branch of Skeletal, you can target a branch or release tag. E.g if you generated your theme with the v3 branch, you would compile with the following command:

```
ntheme compile -b "v3"
```

**Note: When you compile your theme you will have wanted to generated your theme with this branch/tag. If you are compiling a theme that has been generated with this module then the script will take care of the branch version.**

## Migrate a theme

```
cd themeName
ntheme migrate
```

If you have an older theme, its package.json might not be setup correctly, this script will update it so it has;

- A compile script so you can run `npm run compile`,
- Install Skeletal and ntheme as dependencies,
- Add a generated_themes object.

### Options

**-b 'branch'**

Instead of migrating your theme to the master branch of Skeletal, you can target a branch or release tag. E.g if you migrate your theme with the v3 branch, you would migrate with the following command:

```
ntheme migrate -b "v3"
```

## Set up git

Now, you just need to set up git. If you're not experienced with git, We recommend you install [GitHub Desktop](https://desktop.github.com/) and [set up the repository using the app](http://design.neto.com.au/assets/uploads/E9FX9Dej3d.gif).

## Customising templates

It's important to know that your themes repository should only contain the templates which are different to the templates on Skeletal. This is why your new theme only contains the header, footer and homepage by default:

```
themeName
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

## Upload your customisations

To actually develop your theme, you need to install the latest version of Skeletal on your Neto website from the theme builder. From here, you need to upload the contents of your theme's `src` directory over the top of Skeletal's templates.

You will need to configure your FTP application to upload your files without removing any files that are on the server and not in your local directory. This way, your Neto website will be using all of the default Skeletal templates for any templates that are missing from your theme.

## Compile your styles

Any custom styles which you add to your theme should be done in `src/css/app.less`. This file can be compiled into `app.css` by running the `gulp` command in your theme:

```
cd themeName
gulp
```

This will prompt gulp to watch any changes you make to `src/css/app.less` and automatically compile them. You can add in new build task in the `gulpfile.js`.

**Note:** Skeletal Bootstrap 4 uses SASS instead of LESS as a style preprocessor and is located `src/scss/app.scss`, but the gulp script is the exact same to compile.
