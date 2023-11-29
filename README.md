<p align="center">
  <img src="https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/main/public/assets/images/logo/full/werewolves-logo.png?raw=true" width="400" alt="logo"/>
</p>

---

![TypeScript](https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=2F73BF)
![Nest](https://img.shields.io/badge/-NestJs-black?style=for-the-badge&logo=nestjs&color=E0234D)
![Mongoose](https://img.shields.io/badge/-MongoDB-black?style=for-the-badge&logoColor=white&logo=mongodb&color=127237)

[![⚙️ Build Workflow](https://github.com/antoinezanardi/werewolves-assistant-api-next/actions/workflows/build.yml/badge.svg)](https://github.com/antoinezanardi/werewolves-assistant-api-next/actions/workflows/build.yml)
[![🚀 Deploy To Production Workflow](https://github.com/antoinezanardi/werewolves-assistant-api-next/actions/workflows/deploy-to-production.yml/badge.svg)](https://github.com/antoinezanardi/werewolves-assistant-api-next/actions/workflows/deploy-to-production.yml)

[![GitHub release](https://img.shields.io/github/release/antoinezanardi/werewolves-assistant-api-next.svg)](https://GitHub.com/antoinezanardi/werewolves-assistant-api-next/releases/)
[![semantic-release: conventional commits](https://img.shields.io/badge/semantic--release-conventional%20commits-Æ1A7DBD?logo=semantic-release&color=1E7FBF)](https://github.com/semantic-release/semantic-release)
[![GitHub license](https://img.shields.io/github/license/antoinezanardi/werewolves-assistant-api-next.svg)](https://github.com/antoinezanardi/https://img.shields.io/github/license/werewolves-assistant-api-next.svg/blob/main/LICENSE)
![NPM](https://img.shields.io/badge/-npm-black?style=flat-square&logoColor=white&logo=npm&color=CE0201)[![Known Vulnerabilities](https://snyk.io/test/github/antoinezanardi/werewolves-assistant-api-next/badge.svg?targetFile=package.json&style=flat-square)](https://snyk.io/test/github/antoinezanardi/werewolves-assistant-api-next?targetFile=package.json)

[![Tests count](https://byob.yarr.is/antoinezanardi/werewolves-assistant-api-next/tests-count)](https://byob.yarr.is/antoinezanardi/werewolves-assistant-api-next/tests-count)
[![Scenarios](https://byob.yarr.is/antoinezanardi/werewolves-assistant-api-next/scenarios)](https://byob.yarr.is/antoinezanardi/werewolves-assistant-api-next/scenarios)
[![Mutation testing badge](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fantoinezanardi%2Fwerewolves-assistant-api-next%2Fmain)](https://dashboard.stryker-mutator.io/reports/github.com/antoinezanardi/werewolves-assistant-api-next/main)

[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=antoinezanardi_werewolves-assistant-api-next&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=antoinezanardi_werewolves-assistant-api-next)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=antoinezanardi_werewolves-assistant-api-next&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=antoinezanardi_werewolves-assistant-api-next)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=antoinezanardi_werewolves-assistant-api-next&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=antoinezanardi_werewolves-assistant-api-next)

## 📋 Table of Contents

1. 🐺 [What is this API ?](#what-is-this-api)
2. 🃏 [Available roles](#available-roles)
3. 🔨 [Installation](#installation)
4. 🚀 [Build](#build)
5. 🐳 [Docker](#docker)
6. 💯 [Tests](#tests)
7. 🌿 [Env variables](#env-variables)
8. ☑️ [Code analysis and consistency](#code-analysis-and-consistency)
9. 📈 [Releases & Changelog](#versions)
10. 🐙 [GitHub Actions](#github-actions)
11. ✨ [Misc commands](#misc-commands)
12. ©️ [License](#license)
13. ❤️ [Contributors](#contributors)

## <a name="what-is-this-api">🐺 What is this API ?</a>
Werewolves Assistant API provides over HTTP requests a way of manage Werewolves games to help the game master.

This is the **next** version of the current **[Werewolves Assistant API](https://github.com/antoinezanardi/werewolves-assistant-api)**. It is still under development.

#### 🤔 Want to know more about this awesome project ? <a href="https://werewolves-assistant.antoinezanardi.fr/about" target="_blank">**Check out the dedicated about page**</a>.

## <a name="available-roles">🃏 Available roles</a>

**27 different official roles** are available to play :

|                <img src="https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/main/public/assets/images/roles/werewolf/werewolf-small.jpeg?raw=true" width="40"/><br/>**Werewolf**                | <img src="https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/main/public/assets/images/roles/big-bad-wolf/big-bad-wolf-small.jpeg?raw=true" width="40"/><br/>**Big Bad Wolf** | <img src="https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/main/public/assets/images/roles/vile-father-of-wolves/vile-father-of-wolves-small.jpeg?raw=true" width="40"/><br/>**Vile Father Of Wolves** |    <img src="https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/main/public/assets/images/roles/white-werewolf/white-werewolf-small.jpeg?raw=true" width="40"/><br/>**White Werewolf**    |
|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|                <img src="https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/main/public/assets/images/roles/villager/villager-small.jpeg?raw=true" width="40"/><br/>**Villager**                |  <img src="https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/main/public/assets/images/roles/villager/villager-small.jpeg?raw=true" width="40"/><br/> **Villager-Villager**  |                          <img src="https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/main/public/assets/images/roles/seer/seer-small.jpeg?raw=true" width="40"/><br/>**Seer**                           |                 <img src="https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/main/public/assets/images/roles/cupid/cupid-small.jpeg?raw=true" width="40"/><br/>**Cupid**                  |
|                    <img src="https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/main/public/assets/images/roles/witch/witch-small.jpeg?raw=true" width="40"/><br/>**Witch**                     |          <img src="https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/main/public/assets/images/roles/hunter/hunter-small.jpeg?raw=true" width="40"/><br/>**Hunter**          |                <img src="https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/main/public/assets/images/roles/little-girl/little-girl-small.jpeg?raw=true" width="40"/><br/>**Little Girl**                |                 <img src="https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/main/public/assets/images/roles/defender/defender-small.jpeg?raw=true" width="40"/><br/>**Defender**                  |
|                    <img src="https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/main/public/assets/images/roles/elder/elder-small.jpeg?raw=true" width="40"/><br/>**Elder**                     |     <img src="https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/main/public/assets/images/roles/scapegoat/scapegoat-small.jpeg?raw=true" width="40"/><br/>**Scapegoat**      |                         <img src="https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/main/public/assets/images/roles/idiot/idiot-small.jpeg?raw=true" width="40"/><br/>**Idiot**                         |        <img src="https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/main/public/assets/images/roles/two-sisters/two-sisters-small.jpeg?raw=true" width="40"/><br/>**Two Sisters**         |
|       <img src="https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/main/public/assets/images/roles/three-brothers/three-brothers-small.jpeg?raw=true" width="40"/><br/>**Three Brothers**       |              <img src="https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/main/public/assets/images/roles/fox/fox-small.jpeg?raw=true" width="40"/><br/>**Fox**               |                 <img src="https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/main/public/assets/images/roles/bear-tamer/bear-tamer-small.jpeg?raw=true" width="40"/><br/>**Bear Tamer**                  | <img src="https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/main/public/assets/images/roles/stuttering-judge/stuttering-judge-small.jpeg?raw=true" width="40"/><br/>**Stuttering Judge** |
| <img src="https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/main/public/assets/images/roles/rusty-sword-knight/rusty-sword-knight-small.jpeg?raw=true" width="40"/><br/>**Rusty Sword Knight** |    <img src="https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/main/public/assets/images/roles/wild-child/wild-child-small.jpeg?raw=true" width="40"/><br/>**Wild Child**    |                    <img src="https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/main/public/assets/images/roles/dog-wolf/dog-wolf-small.jpeg?raw=true" width="40"/><br/>**Dog-Wolf**                     |                 <img src="https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/main/public/assets/images/roles/thief/thief-small.jpeg?raw=true" width="40"/><br/>**Thief**                  |
|                    <img src="https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/main/public/assets/images/roles/angel/angel-small.jpeg?raw=true" width="40"/><br/>**Angel**                     |    <img src="https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/main/public/assets/images/roles/pied-piper/pied-piper-small.jpeg?raw=true" width="40"/><br/>**Pied Piper**    |                         <img src="https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/main/public/assets/images/roles/raven/raven-small.jpeg?raw=true" width="40"/><br/>**Raven**                         |


## <a name="installation">🔨 Installation</a>

To install this project, you will need to have on your machine :

![NPM](https://img.shields.io/badge/-npm-black?style=for-the-badge&logoColor=white&logo=npm&color=CE0201)
![Docker](https://img.shields.io/badge/-Docker-black?style=for-the-badge&logoColor=white&logo=docker&color=004EA2)

Then, run the following commands :

```bash
# Install dependencies and Husky hooks
npm install

# Run the app in dev mode
npm run start:dev
```

The above command will start the app in development mode and watch for changes on local.

You can also run the app in development mode with Docker, more information in the **[Docker section](#docker)**.

## <a name="build">🚀 Build</a>

In order to build the app for production, run the following command :

```bash
# Build the app
npm run build

# Run the app in production mode
npm run start:prod
```

You can also run the app in production mode with Docker, more information in the **[Docker section](#docker)**.

## <a name="docker">🐳 Docker</a>

This app is Docker ready !

The Dockerfile is available at the root of the project.

### 🔨 Development mode

To run the app in development mode with Docker, multiple commands are available :

```bash
# Run the app in development mode with Docker
npm run docker:dev:start

# Stop the app in development mode with Docker
npm run docker:dev:stop

# Reset the app in development mode with Docker (stop, remove image, containers and volumes, then start)
npm run docker:dev:reset
```

When starting the app in development mode with Docker, a container for the API and a container for the MongoDB database are created.

Docker compose will use the `development` step of the Dockerfile to build the image.

For more information, please check the **[docker-compose.yml file](https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/main/docker/werewolves-assistant-api-dev/docker-compose.yml)**.

### 🚀 Production mode

To run the app in production mode with Docker, multiple commands are available :

```bash
# Run the app in production mode with Docker
npm run docker:production:start

# Stop the app in production mode with Docker
npm run docker:production:stop

# Reset the app in production mode with Docker (stop, remove image, containers and volumes, then start)
npm run docker:production:reset
```

When starting the app in production mode with Docker, a container for the API and a container for the MongoDB database are created.

Docker compose will use the `production` step of the Dockerfile to build the image.

For more information, please check the **[docker-compose.yml file](https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/main/docker/werewolves-assistant-api-production/docker-compose.yml)**.

### 🧪 Test mode

To run the tests available in this project thanks to Docker, multiple commands are available :

```bash
# Deploy test containers (4 databases are created to parallelize tests)
npm run docker:test:start

# Stop test containers
npm run docker:test:stop

# Reset test containers (stop, remove image, containers and volumes, then start)
npm run docker:test:reset
```

For more information, please check the **[docker-compose.yml file](https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/main/docker/werewolves-assistant-api-test/docker-compose.yml)**.

## <a name="tests">💯 Tests</a>

### 🧪 Unit and E2E tests

![Jest](https://img.shields.io/badge/-Jest-black?style=for-the-badge&logoColor=white&logo=jest&color=BF3B14)

[![Tests count](https://byob.yarr.is/antoinezanardi/werewolves-assistant-api-next/tests-count)](https://byob.yarr.is/antoinezanardi/werewolves-assistant-api-next/tests-count)

[![Covered Statements](https://byob.yarr.is/antoinezanardi/werewolves-assistant-api-next/covered-statements)](https://byob.yarr.is/antoinezanardi/werewolves-assistant-api-next/covered-statements)

[![Covered Branches](https://byob.yarr.is/antoinezanardi/werewolves-assistant-api-next/covered-branches)](https://byob.yarr.is/antoinezanardi/werewolves-assistant-api-next/covered-branches)

[![Covered Functions](https://byob.yarr.is/antoinezanardi/werewolves-assistant-api-next/covered-functions)](https://byob.yarr.is/antoinezanardi/werewolves-assistant-api-next/covered-functions)

[![Covered Lines](https://byob.yarr.is/antoinezanardi/werewolves-assistant-api-next/covered-lines)](https://byob.yarr.is/antoinezanardi/werewolves-assistant-api-next/covered-lines)

### 🥒 Acceptance tests

![Cucumber](https://img.shields.io/badge/-Cucumber-black?style=for-the-badge&logoColor=white&logo=cucumber&color=169652) 

[![Scenarios](https://byob.yarr.is/antoinezanardi/werewolves-assistant-api-next/scenarios)](https://byob.yarr.is/antoinezanardi/werewolves-assistant-api-next/scenarios)

Click on the badge below 👇 to see the **[reports](https://reports.cucumber.io/report-collections/9a53c3ab-ff98-43ce-977d-4b6ba9f9ae18)**. 

[![ScenariosReports](https://messages.cucumber.io/api/report-collections/9a53c3ab-ff98-43ce-977d-4b6ba9f9ae18/badge)](https://reports.cucumber.io/report-collections/9a53c3ab-ff98-43ce-977d-4b6ba9f9ae18)

### 👽 Mutant testing

![Stryker](https://img.shields.io/badge/-Stryker-black?style=for-the-badge&logoColor=white&logo=stripe&color=7F1B10) 

[![Mutation testing badge](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fantoinezanardi%2Fwerewolves-assistant-api-next%2Fmain)](https://dashboard.stryker-mutator.io/reports/github.com/antoinezanardi/werewolves-assistant-api-next/main)

You can also check the **[mutation testing report](https://dashboard.stryker-mutator.io/reports/github.com/antoinezanardi/werewolves-assistant-api-next/main#mutant)**.

### ▶️ Commands

Before testing, you must follow the **[installation steps](#installation)**.

Then, run one of the following commands :

```bash
# Assure you started test Docker containers (4 databases are created to parallelize tests)
npm run docker:test:start

# Run unit tests with coverage
npm run test:unit:cov

# Run e2e tests with coverage
npm run test:e2e:cov

# Run both unit and e2e tests with coverage
npm run test:cov

# Run both unit and e2e tests only on staged files (run on pre-commit)
npm run test:staged

# Run acceptance tests
npm run test:cucumber

# Run acceptance tests and publish the report
npm run test:cucumber:publish

# Run mutant tests with coverage
npm run test:stryker

# Run mutant tests with coverage from scratch (without using the incremental file)
npm run test:stryker:force
```

## <a name="env-variables">🌿 Env variables</a>

Environnement files are available in the **[env directory](https://github.com/antoinezanardi/werewolves-assistant-api-next/tree/main/env)**.

You can create a `.env` file in this directory to override the default values when starting the API locally with `npm run start` command.

Environment variables are :

|        Name         |               Description               | Required | Default value |                   Limitations                    |
|:-------------------:|:---------------------------------------:|:--------:|:-------------:|:------------------------------------------------:|
|       `HOST`        | Host on which the API will be available |    ❌     |  `127.0.0.1`  |          If set, can't be empty string           |
|       `PORT`        | Port on which the API will be available |    ❌     |    `8080`     | If set, must be a number between `0` and `65535` |
|   `ENVIRONNEMENT`   |  Environment in which the API will run  |    ✅     |       ❌       |  Must be `development`, `production` or `test`   |
|   `DATABASE_HOST`   |        MongoDB database host URL        |    ✅     |       ❌       |              Can't be empty string               |
|   `DATABASE_PORT`   |          MongoDB database port          |    ❌     |  `undefined`  | If set, must be a number between `0` and `65535` |
|   `DATABASE_NAME`   |          MongoDB database name          |    ✅     |       ❌       |              Can't be empty string               |
| `DATABASE_USERNAME` |          MongoDB database user          |    ✅     |       ❌       |              Can't be empty string               |
| `DATABASE_PASSWORD` |        MongoDB database password        |    ✅     |       ❌       |              Can't be empty string               |


## <a name="code-analysis-and-consistency">☑️ Code analysis and consistency</a>

### 🔍 Code linting & formatting

![ESLint](https://img.shields.io/badge/-ESLint-black?style=for-the-badge&logoColor=white&logo=eslint&color=341BAB)

In order to keep the code clean, consistent and free of bad TS practices, more than **300 ESLint rules are activated** !

Complete list of all enabled rules is available in the **[.eslintrc.js file](https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/master/.eslintrc.js)**.

### ▶️ Commands

Before linting, you must follow the [installation steps](#installation).

Then, run one of the following commands :

```bash
# Lint 
npm run lint

# Lint and fix
npm run lint:fix

# Lint and fix only on staged files (runs on pre-commit)
npm run lint:staged
```

### 🥇 Project quality scanner

Multiple tools are set up to maintain the best code quality and to prevent vulnerabilities :

![CodeQL](https://img.shields.io/badge/-CodeQL-black?style=for-the-badge&logoColor=white&logo=github&color=2781FE)

You can check the **[CodeQL analysis report here](https://github.com/antoinezanardi/werewolves-assistant-api-next/security/code-scanning)**.

![SonarCloud](https://img.shields.io/badge/-SonarCloud-black?style=for-the-badge&logoColor=white&logo=sonarcloud&color=F37A3A)

SonarCloud summary is available **[here](https://sonarcloud.io/summary/new_code?id=antoinezanardi_werewolves-assistant-api-next)**.

[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=antoinezanardi_werewolves-assistant-api-next&metric=coverage)](https://sonarcloud.io/summary/new_code?id=antoinezanardi_werewolves-assistant-api-next)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=antoinezanardi_werewolves-assistant-api-next&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=antoinezanardi_werewolves-assistant-api-next)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=antoinezanardi_werewolves-assistant-api-next&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=antoinezanardi_werewolves-assistant-api-next)

[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=antoinezanardi_werewolves-assistant-api-next&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=antoinezanardi_werewolves-assistant-api-next)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=antoinezanardi_werewolves-assistant-api-next&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=antoinezanardi_werewolves-assistant-api-next)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=antoinezanardi_werewolves-assistant-api-next&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=antoinezanardi_werewolves-assistant-api-next)

[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=antoinezanardi_werewolves-assistant-api-next&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=antoinezanardi_werewolves-assistant-api-next)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=antoinezanardi_werewolves-assistant-api-next&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=antoinezanardi_werewolves-assistant-api-next)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=antoinezanardi_werewolves-assistant-api-next&metric=bugs)](https://sonarcloud.io/summary/new_code?id=antoinezanardi_werewolves-assistant-api-next)

## <a name="versions">📈 Releases & Changelog</a>

Releases on **main** branch are generated and published automatically by :

![Semantic Release](https://img.shields.io/badge/-Semantic%20Release-black?style=for-the-badge&logoColor=white&logo=semantic-release&color=000000)

It uses the **[conventional commit](https://www.conventionalcommits.org/en/v1.0.0/)** strategy.

Each change when a new release comes up is listed in the **<a href="https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/master/CHANGELOG.md" target="_blank">CHANGELOG.md file</a>**.

Also, you can keep up with changes by watching releases via the **Watch GitHub button** at the top of this page.

#### 🏷️ <a href="https://github.com/antoinezanardi/werewolves-assistant-api-next/releases" target="_blank">All releases for this project are available here</a>.

## <a name="github-actions">🐙 GitHub Actions</a>

This project uses **GitHub Actions** to automate some boring tasks.

You can find all the workflows in the **[.github/workflows directory](https://github.com/antoinezanardi/werewolves-assistant-api-next/tree/main/.github/workflows).**

### 🎢 Workflows

|                                                                             Name                                                                             |                                                                                                                                                                          Description & Status                                                                                                                                                                           |                      Triggered on                      |    
|:------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------------------:|
|                         **[⚙️ Build](https://github.com/antoinezanardi/werewolves-assistant-api-next/actions/workflows/build.yml)**                          |                                   Various checks for app health, code quality and tests coverage<br/><br/>[![⚙️ Build Workflow](https://github.com/antoinezanardi/werewolves-assistant-api-next/actions/workflows/build.yml/badge.svg)](https://github.com/antoinezanardi/werewolves-assistant-api-next/actions/workflows/build.yml)                                    | `push` on `develop` and all pull requests to `develop` |
| **[🔃 Lint PR Name Into Develop Workflow](https://github.com/antoinezanardi/werewolves-assistant-api-next/actions/workflows/lint-pr-name-into-develop.yml)** |    Checks if pull request name respects `conventionnal-commit` rules<br/><br/>[![🔃 Lint PR Name Into Develop Workflow](https://github.com/antoinezanardi/werewolves-assistant-api-next/actions/workflows/lint-pr-name-into-develop.yml/badge.svg)](https://github.com/antoinezanardi/werewolves-assistant-api-next/actions/workflows/lint-pr-name-into-develop.yml)    |         `pull-request` `created` or `updated`          | 
|       **[⛵️ Push On Develop Branch Workflow](https://github.com/antoinezanardi/werewolves-assistant-api-next/actions/workflows/push-on-develop.yml)**        |                       Uploads app with `develop` version to `Docker Hub`<br/><br/>[![⛵️ Push On Develop Branch Workflow](https://github.com/antoinezanardi/werewolves-assistant-api-next/actions/workflows/push-on-develop.yml/badge.svg)](https://github.com/antoinezanardi/werewolves-assistant-api-next/actions/workflows/push-on-develop.yml)                       |                  `push` on `develop`                   |
|        **[🔃️ Upsert PR Release Workflow](https://github.com/antoinezanardi/werewolves-assistant-api-next/actions/workflows/upsert-pr-release.yml)**         | Creates or updates pull request to `main` depending on commits on `develop` since last release<br/><br/>[![🔃️ Upsert PR Release Workflow](https://github.com/antoinezanardi/werewolves-assistant-api-next/actions/workflows/upsert-pr-release.yml/badge.svg)](https://github.com/antoinezanardi/werewolves-assistant-api-next/actions/workflows/upsert-pr-release.yml) |                  `push` on `develop`                   | 
|         **[🏷️ Release Creation Workflow](https://github.com/antoinezanardi/werewolves-assistant-api-next/actions/workflows/release-creation.yml)**          |           Creates a new release using `semantic-release` with tag and updated changelog<br/><br/>[![🏷️ Release Creation Workflow](https://github.com/antoinezanardi/werewolves-assistant-api-next/actions/workflows/release-creation.yml/badge.svg)](https://github.com/antoinezanardi/werewolves-assistant-api-next/actions/workflows/release-creation.yml)           |                    `push` on `main`                    | 
|      **[🚀 Deploy To Production Workflow](https://github.com/antoinezanardi/werewolves-assistant-api-next/actions/workflows/deploy-to-production.yml)**      |              Deploys app with last tag version to `Docker Hub` and `GCP`<br/><br/>[![🚀 Deploy To Production Workflow](https://github.com/antoinezanardi/werewolves-assistant-api-next/actions/workflows/deploy-to-production.yml/badge.svg)](https://github.com/antoinezanardi/werewolves-assistant-api-next/actions/workflows/deploy-to-production.yml)               |                     `tag-creation`                     | 

## <a name="misc-commands">✨ Misc commands</a>

### 🌳 Animated tree visualisation of the project's evolution with **[Gource](https://gource.io/)**
```shell
# Please ensure that `gource` is installed on your system.
npm run gource
```

### 🔀 Create git branch with a conventional name
```shell
npm run script:create-branch
```

### ⤴️ Create pull request against the `develop` branch from current branch
```shell
npm run script:create-pull-request
```

### 📣 To all IntelliJ IDEs users (IntelliJ, Webstorm, PHPStorm, etc.)

All the above commands are available in the **.run directory** at the root of the project. 

You can add them as **run configurations** in your IDE.

## <a name="license">©️ License</a>

This project is licensed under the [MIT License](http://opensource.org/licenses/MIT).

## <a name="contributors">❤️ Contributors</a>

There is no contributor yet. Want to be the first ?

If you want to contribute to this project, please read the [**contribution guide**](https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/master/CONTRIBUTING.md).