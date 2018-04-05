# TastyTerm: FHIR Terminology Client

The TastyTerm is web-based frontend for FHIR terminology services. When run in standalone mode it will automatically connect to the HSPC terminology service. When launched in SMART-on-FHIR mode, it will use an authorization service and FHIR backend of your choice.

* **Live demonstration server: https://tastyterm.healthcreek.org**
* Source code and documentation: https://github.com/preston/tastyterm
* Pre-built docker images: https://hub.docker.com/r/p3000/tastyterm/

## Developer Quick Start

This is an [Angular](https://angular.io) project using `ANGULAR CLI` as the build system, [pug](https://pugjs.org/api/getting-started.html) for HTML templates, [SASS](http://sass-lang.com) for CSS and [Bootstrap](http://getbootstrap.com/) for layout. `npm` is the package manager. Assuming you already have node installed via `brew install node` or similar:

	npm install -g @angular/cli
	npm install # to install project development dependencies

To run in development mode, just:

	ng serve # to serve the project and automatically recompile on file changes

Visit [http://localhost:4200](http://localhost:4200) and do your thang. :)

## Building for Production

First, build:

	ng build # to build your local copy with any local changes

Then, assuming you've already familiar with [Docker](https://www.docker.com) awesomeness and have it installed, plop the build into a wicked-fast [nginx](http://nginx.org) web server container using the including Dockerfile with:

	docker build -t p3000/tastyterm:latest . # though you probably want your own repo and tag strings :)
	docker push p3000/tastyterm:latest # upload it to your repository

## Production Deployment

This app respects the `NODE_ENV` environment variable when compiling the front-end. Be sure to set this appropriately. If not set, it defaults to `development`.

Deployment is extremely easy in your existing Dockerized hosting environment by pointing it at your TastyTerm installation. Just:

	docker run -d -p 4200:80 --restart unless-stopped p3000/tastyterm:latest # or any official tag
	
In order to use Smart on FHIR mode, you must set your OAuth Client ID in a system environment variable named `TASTYTERM_OAUTH_CLIENT_ID` like this:

On Windows:

	cmd /C "set "TASTYTERM_OAUTH_CLIENT_ID=[your client id]" && set"

On OSX/UNIX/LINUX:

	export TASTYTERM_OAUTH_CLIENT_ID=[your client id]

And you're done. Jedi's may use your existing Kubernetes, Open Shift etc installations as you see fit. :)


# License

[Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)
