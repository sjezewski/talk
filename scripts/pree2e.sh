#!/bin/bash

# install selenium
selenium-standalone install

# Creating Admin Test User
{ echo admin@test.com; echo test; echo test; echo Admin Test User; echo admin;} | dotenv ./bin/cli-users create

# Creating Moderator Test User
{ echo moderator@test.com; echo test; echo test; echo Moderator Test User; echo moderator;} | dotenv ./bin/cli-users create

# Creating Commenter Test User
{ echo commenter@test.com; echo test; echo test; echo Commenter Test User; echo ;} | dotenv ./bin/cli-users create

npm start
