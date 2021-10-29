## Simple Desktop weather application

- Built using Angular & Electron. This application doesn't use any other Angular/Electron boilerplate seed project.
- For more details, please check [here](https://www.dropbox.com/s/aqz0vtwfs0ysekf/Angular%20Electron%20Mini%20Project.txt?dl=0)

## Development

### Environment setup
Install Angular cli, Electron
- `npm install -g @angular/cli`
- `npm install -g electron`

You can still use [Angular CLI](https://angular.io/cli) to create any angular component, services and etc.

### Run
- On the root directory of the project, run this command to install dependencies: 
`npm install`
- Run: 
`npm start`

### Build
- `electron-builder` package was used to build packages for Mac, Windows, Linux: run `npm install -g electron-builder`
- Run these commands to build for each platform: 
`npm run electron:mac`
`npm run electron:windows`
`npm run electron:linux`
