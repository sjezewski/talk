# Talk [![CircleCI](https://circleci.com/gh/coralproject/talk.svg?style=svg)](https://circleci.com/gh/coralproject/talk)

A commenting platform from [The Coral Project](https://coralproject.net).

## Contributing to Talk

See our [Contribution Guide](https://github.com/coralproject/talk/blob/master/CONTRIBUTING.md)!

## Usage

### Installation

To set up a development environment or build from source, see [INSTALL.md](https://github.com/coralproject/talk/blob/master/INSTALL.md).

To launch a Talk server of your own from your browser without any need to muck about in a terminal or think about engineering concepts, stay tuned. We will launch [our installer](https://github.com/coralproject/talk-install) shortly!!


### Configuration

The Talk application requires specific configuration options to be available
inside the environment in order to run, those variables are listed here:

- `TALK_MONGO_URL` (*required*) - the database connection string for the MongoDB database.
- `TALK_REDIS_URL` (*required*) - the database connection string for the Redis database.
- `TALK_SESSION_SECRET` (*required*) - a random string which will be used to
secure cookies.
- `TALK_FACEBOOK_APP_ID` (*required*) - the Facebook app id for your Facebook
Login enabled app.
- `TALK_FACEBOOK_APP_SECRET` (*required*) - the Facebook app secret for your
Facebook Login enabled app.
- `TALK_ROOT_URL` (*required*) - root url of the installed application externally
available in the format: `<scheme>://<host>` without the path.
- `TALK_SMTP_EMAIL` (*required*) - the address to send emails from using the
  SMTP provider.
- `TALK_SMTP_USERNAME` (*required*) - username of the SMTP provider you are using.
- `TALK_SMTP_PASSWORD` (*required*) - password for the SMTP provider you are using.
- `TALK_SMTP_HOST` (*required*) - SMTP host url with format `smtp.domain.com`.
- `TALK_SMTP_PORT` (*required*) - SMTP port.


### Install from Source

If you want to run Talk in development mode from source (without docker) you can read the [INSTALL file](INSTALL.md).

### License

    Copyright 2016 Mozilla Foundation

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

    See the License for the specific language governing permissions and limitations under the License.
