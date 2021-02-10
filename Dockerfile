# Base code is from peatio by yn

# docker build . -t yuknak/snn
# docker push yuknak/snn
# docker build . -t yuknak/snn --build-arg RAILS_ENV=development

FROM ruby:2.7.2 as base

# By default image is built using RAILS_ENV=production.
# You may want to customize it:
#
#   --build-arg RAILS_ENV=development
#
# See https://docs.docker.com/engine/reference/commandline/build/#set-build-time-variables-build-arg
#
ARG RAILS_ENV=production
ENV RAILS_ENV=${RAILS_ENV} APP_HOME=/home/app

# Allow customization of user ID and group ID (it's useful when you use Docker bind mounts)
ARG UID=1000
ARG GID=1000

# Set the TZ variable to avoid perpetual system calls to stat(/etc/localtime)
ENV TZ=JST-9

# Create group "app" and user "app".
RUN groupadd -r --gid ${GID} app \
 && useradd --system --create-home --home ${APP_HOME} --shell /sbin/nologin --no-log-init \
      --gid ${GID} --uid ${UID} app

# Install system dependencies.
RUN curl -sL https://deb.nodesource.com/setup_15.x | bash - \
 && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
 && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
 && apt-get update \
 && apt-get install -y \
      default-libmysqlclient-dev \
      nodejs \
      yarn

WORKDIR $APP_HOME

# Install dependencies defined in Gemfile.
COPY Gemfile Gemfile.lock $APP_HOME/
RUN chown app:app $APP_HOME/Gemfile.lock \
 && mkdir -p /opt/vendor/bundle \
 && chown -R app:app /opt/vendor \
 && su app -s /bin/bash -c "bundle install --path /opt/vendor/bundle"

# Copy application sources.
COPY . $APP_HOME
# TODO: Use COPY --chown=app:app when Docker Hub will support it.
RUN chown -R app:app $APP_HOME

# Switch to application user.
USER app

# TODO: fix (but no data stored in credentials.yml.enc)
ENV RAILS_MASTER_KEY dd42acbac573c0f9e39998465992532b

# Initialize application configuration & assets.
RUN bundle exec rake tmp:create \
  && bundle exec rake yarn:install assets:precompile
#  && bundle exec rake yarn:install assets:precompile \
#  && bundle exec rake dev:cache

# Warning) Only in development mode,
# Set config.webpacker.check_yarn_integrity = false in config/webpacker.yml

# Expose port 3001 to the Docker host, so we can access it from the outside.
EXPOSE 3001

# The main command to run when the container starts.
ENV PORT 3001

CMD bundle exec crono start && bundle exec puma --config config/puma.rb
