# QuickTerm: FHIR Terminology Client

The QuickTerm is web-based frontend for FHIR terminology services. When run in standalone mode it will automatically connect to the HSPC terminology service. When launched in SMART-on-FHIR mode, it will use an authorization service and FHIR backend of your choice.

* **Live demonstration server: https://quickterm.healthcreek.org**
* Source code and documentation: https://github.com/preston/quickterm
* Pre-built docker images: https://hub.docker.com/r/p3000/quickterm/

## Developer Quick Start

This is an [AngularJS](https://angular.io) project using `grunt` as the build system, [pug](https://pugjs.org/api/getting-started.html) for HTML templates, [SASS](http://sass-lang.com) for CSS and [Bootstrap](http://getbootstrap.com/) for layout. `npm` is the package manager. Assuming you already have node installed via `brew install node` or similar:

	npm install -g grunt typings
	npm install # to install project development dependencies

To run in development mode, just:

	grunt # to serve the project and automatically recompile on file changes

Visit [http://localhost:9000](http://localhost:9000) and do your thang. :)

## Building for Production

First, build:

	grunt build # to build your local copy with any local changes

Then, assuming you've already familiar with [Docker](https://www.docker.com) awesomeness and have it installed, plop the build into a wicked-fast [nginx](http://nginx.org) web server container using the including Dockerfile with:

	docker build -t p3000/quickterm:latest . # though you probably want your own repo and tag strings :)
	docker push p3000/quickterm:latest # upload it to your repository

## Production Deployment

Extremely easy in your existing Dockerized hosting environment by pointing it at your QuickTerm Server installation. Just:

	docker run -d -p 9000:80 --restart unless-stopped p3000/quickterm:latest # or any official tag

And you're done. No environment variables or further configuration are needed. Jedi's may use your existing Kubernetes, Open Shift etc installations as you see fit. :)


# License

[Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)
