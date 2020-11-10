# Tahoe Weather Findr

This is a hobby project to build a Node-based server with a React UI that shows weather forecast and conditions relevant to the winter community in the Lake Tahoe area.

View it live: (https://tahoe-weather-findr.herokuapp.com)[https://tahoe-weather-findr.herokuapp.com]


## Development

This project has two Node-based applications:

1. The Node server `./server.js`
2. The React UI `./app`

To work on the project in development, you must first `npm install` EACH of these projects, then you can run `npm run start-dev` from the root directory which will start the Node server locally and also start the React development server.


### Serving the UI

* The React development server (from `create-react-app`) is hosted at `http://localhost:3000` and will be updated live as you make changes.

* The Node server will serve the UI from `./app/build`. This folder is populated by running `npm run build` from the root directory;


### Server Logs

* In development, relevant logging will be sent to the console.

* The Node server writes logs to files in the `./logs` directory. You can watch these files for any relevant information.


## Production

* In Production, please make sure that the `NODE_ENV` environment variable is set to `production`.

* This project it scurrently designed to be hosted via the Heroku free tier. It uses the `PORT` environment variable (set automatically by Heroku) to start the Node server.


### Deploying to Heroku

* Once you have the `heroku` CLI installed and logged in (project owner only), you can deploy by running `git push heroku master` to deploy to Heroku's special remote git repo.

* Heroku will automatically run `npm run build` and `npm start` as part of the deployment process.


## Future Enhancements

1. Currently, this project uses the `node-cache` module as an in-memory cache. It may become necessary in the future to swap this out with something a bit more robust like Redis.

2. The React UI currently does not have a user alert modal system. It would be good to add this (using React portals) to improve the user's overall experience.

3. I have noticed that weather forecast requests to the `weather.gov` API occasionally fail, seemingly for no reason. This needs to be investigated further.

4. Need to add specific CORS domains to the Node API.

