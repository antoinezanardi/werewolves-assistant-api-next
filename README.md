<p align="center">
  <img src="https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/feat/logo/assets/images/werewolves-logo.png?raw=true" width="400" alt="logo"/>
</p>

---

[![GitHub release](https://img.shields.io/github/release/antoinezanardi/werewolves-assistant-api-next.svg)](https://GitHub.com/antoinezanardi/werewolves-assistant-api-next/releases/)
[![GitHub license](https://img.shields.io/github/license/antoinezanardi/werewolves-assistant-api-next.svg)](https://github.com/antoinezanardi/https://img.shields.io/github/license/werewolves-assistant-api-next.svg/blob/main/LICENSE)
![NPM](https://img.shields.io/badge/-npm-black?style=flat-square&logoColor=white&logo=npm&color=CE0201)[![Known Vulnerabilities](https://snyk.io/test/github/antoinezanardi/werewolves-assistant-api-next/badge.svg?targetFile=package.json&style=flat-square)](https://snyk.io/test/github/antoinezanardi/werewolves-assistant-api-next?targetFile=package.json)

![Build Status](https://github.com/antoinezanardi/werewolves-assistant-api-next/actions/workflows/build.yml/badge.svg)

![TypeScript](https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=2F73BF)
![Nest](https://img.shields.io/badge/-NestJs-black?style=for-the-badge&logo=nestjs&color=E0234D)
![Mongoose](https://img.shields.io/badge/-MongoDB-black?style=for-the-badge&logoColor=white&logo=mongodb&color=127237)

## 📋 Table of Contents

1. 🐺 [What is this API ?](#what-is-this-api)
2. 🔨 [Installation](#installation)
3. 💯 [Tests](#tests)
4. ☑️ [Code analysis and consistency](#code-analysis-and-consistency)
5. ✨ [Misc commands](#misc-commands)
6. ©️ [License](#license)
7. ❤️ [Contributors](#contributors)

## <a name="what-is-this-api">🐺 What is this API ?</a>
Werewolves Assistant API provides over HTTP requests a way of manage Werewolves games to help the game master.

This is the **next** version of the current [Werewolves Assistant API](https://github.com/antoinezanardi/werewolves-assistant-api). It is still under development.

#### 🤔 Want to know more about this awesome project ? <a href="https://werewolves-assistant.antoinezanardi.fr/about" target="_blank">**Check out the dedicated about page**</a>.

## <a name="installation">🔨 Installation</a>

To install this project, you will need to have on your machine :

![NPM](https://img.shields.io/badge/-npm-black?style=for-the-badge&logoColor=white&logo=npm&color=CE0201)
![Docker](https://img.shields.io/badge/-Docker-black?style=for-the-badge&logoColor=white&logo=docker&color=004EA2)

Then, run the following commands :

```bash
# Install dependencies and Husky hooks
npm install

# Start dev Docker containers
npm run docker:dev:start

# Start test Docker containers (if you want to run the tests)
npm run docker:test:start
```

## <a name="tests">💯 Tests</a>

Unit and E2E tests are orchestrated with :

![Jest](https://img.shields.io/badge/-Jest-black?style=for-the-badge&logoColor=white&logo=jest&color=BF3B14)

Mutant testing is also available with :

![Stryker](https://img.shields.io/badge/-Stryker-black?style=for-the-badge&logoColor=white&logo=stripe&color=7F1B10)

Before testing, you must follow the [installation steps](#installation).

Then, run one of the following commands :

```bash
# Assure you started test Docker containers
npm run docker:test:start

# Run unit tests with coverage
npm run test:unit:cov

# Run e2e tests with coverage
npm run test:e2e:cov

# Run both unit and e2e tests with coverage
npm run test:cov

# Run mutant tests with coverage
npm run test:stryker

# Run mutant tests with coverage from scratch (without using the incremental file)
npm run test:stryker:force
```

## <a name="code-analysis-and-consistency">☑️ Code analysis and consistency</a>

Code linting is managed by :

![EsLint](https://img.shields.io/badge/-ESLint-black?style=for-the-badge&logoColor=white&logo=eslint&color=341BAB)

In order to keep the code clean, consistent and free of bad TS practises, more than **300 rules are activated** !

Complete list of all enabled rules is available in the **[.eslintrc.js file](https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/master/.eslintrc.js)**.

Before linting, you must follow the [installation steps](#installation).

Then, run one of the following commands :

```bash
# Lint 
npm run lint

# Lint and fix
npm run lint:fix
```

## <a name="misc-commands">✨ Misc commands</a>

### 🌳 Animated tree visualisation of the project's evolution with [Gource](https://gource.io/)
```shell
# Please ensure that `gource` is installed on your system.
npm run gource
```

## <a name="license">©️ License</a>

This project is licensed under the [MIT License](http://opensource.org/licenses/MIT).

## <a name="contributors">❤️ Contributors</a>

There is no contributor yet. Want to be the first ?

If you want to contribute to this project, please read the [**contribution guide**](https://github.com/antoinezanardi/werewolves-assistant-api-next/blob/master/CONTRIBUTING.md).