This project was bootstrapped with [Create React Overview](https://github.com/facebook/create-react-app).

## Get Started

You can get a docker container of the app by 
```
docker pull flowsquad/bpm-repo-client
```


If you want to make adjustments, get the app via 
```
git clone https://github.com/FlowSquad/bpm-repo-client.git
```
and check out the [Documentation](#TODO: Docusaurus link einfügen)


## Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.


### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `docker build .`

Build the [Docker](https://docs.docker.com/get-docker/) container in the current directory



## Languages

By default, the app comes with English and German translations.

### Changing translations

If you want to adjust a translations, navigate to the [translations-folder](public/translations) and open the corresponding language package. The JSON file contains the dictionary for all used terms and can be edited as desired.

### Adding new language packages

In order to add a new language, you have to go through three steps:
1. Create a new folder *foldername* in [translations](public/translations)
2. Copy the whole dictionary from another language package and replace all the translations
3. Add the corresponding Select-Option in the UI:
   - Navigate to [Menu](src/components/Layout/Menu.tsx)
    - Add an object like this to the *options*-Array, where you enter id, label, code (all standard nation codes are supported) and your *foldername* :
    
    ```javascript        
      {
      id: "German",
      label: t("language.german"),
      icon: <Flag className={classes.flagIcon} code="de" />,
      type: "button",
      onClick: () => changeLanguage(*foldername*)
      }
   ```



