FROM node:9
LABEL maintainer="Preston Lee <preston.lee@prestonlee.com>"
WORKDIR /app

# Make sure the latest version of core dependencies are installed.
RUN npm i -g --unsafe-perm npm serve

# --unsafe-perm due to this issue: https://github.com/npm/npm/issues/17431
RUN npm i -g --unsafe-perm @angular/cli

# Cache project dependency installation prior to project files, since code changes more often than dependencies.
# The custom pug script is necessary for the post-install hook of the package.json
COPY package*.json additional-build-steps.js ./
RUN npm i --unsafe-perm

# Now install everything else.
COPY . .
RUN ng build

EXPOSE 3000
ENTRYPOINT ["serve", "-C", "-s", "-p", "3000", "dist"]
# ENTRYPOINT node env-setup.js && serve -C -s dist
