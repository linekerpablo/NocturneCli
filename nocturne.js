#!/usr/bin/env node
'use strict';

const program = require('commander');
const { join } = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');
const pkg = require('./package.json');
const shell = require('shelljs');
const download = require('download-git-repo')

const getJson = (path) => {
  const data = fs.existsSync(path) ? fs.readFileSync(path) : [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};
const saveFile = (path, data) => fs.appendFileSync(path, JSON.stringify(data, null, '\t'));

program.version(pkg.version);

program
  .command('create')
  .description('create angular project')
  .action(async (projectName) => {
    let answers;
    let path;
    let typeProject;

    answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'typeProject',
        message: 'What do you want to generate?',
        choices: ["Frontend", "Backend", "Both"]
      }
    ]);

    typeProject = answers.typeProject;

    answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'What is the project name?',
        validate: value => value ? true : 'Must be informed project name'
      }
    ]);

    projectName = answers.projectName;

    answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'path',
        message: 'What is the path to save project?',
        validate: value => value ? true : 'Must be informed path'
      }
    ]);

    path = answers.path;

    console.log('Waiting please...');
    let pathProject = join(path, projectName);

    shell.mkdir('-p', pathProject);

    if (typeProject == 'Frontend' || typeProject == "Both") {
      const pathFrontend = join(pathProject, 'Frontend')

      download('direct:https://github.com/linekerpablo/spidershark-frontend-template/archive/master.zip', pathFrontend, function (err) {
        console.log(`${chalk.green('Frontend create with success in path ' + pathFrontend)}`);
      });
    }

    if (typeProject == 'Backend' || typeProject == "Both") {
      const pathBackend = join(pathProject, 'Backend')

      download('direct:https://github.com/linekerpablo/spidershark-backend-template/archive/master.zip', pathBackend, function (err) {
        console.log(`${chalk.green('Backend create with success in path ' + pathBackend)}`);
      });
    }
  });

program
  .command('crud [path]')
  .description('create crud')
  .action(async (path) => {
    let answers;

    answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'path',
        message: 'What path json?',
        validate: value => value ? true : 'Must be informed path json'
      }
    ]);

    path = answers.path;

    const data = getJson(path);
    console.log(data);
    console.log(data.entityName);
    // let entityJson = JSON.parse(options.json);

    // console.log(entityJson);
    // console.log('Waiting please...');
  });

program.parse(process.argv);

console.log(chalk.cyan(figlet.textSync('Nocturne CLI')));