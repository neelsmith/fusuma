'use strict';

const { readFile, writeFile } = require('fs');
const { join, extname } = require('path');
const { promisify } = require('util');
const yaml = require('js-yaml');
const pSearch = require('preferred-search');

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

const config = {
  meta: {
    url: null,
    name: null,
    thumbnail: null,
    description: null,
    sns: ['twitter'] // twitter, hatena
  },
  slide: {
    loop: true,
    sidebar: true,
    targetBlank: true,
    showIndex: false,
    isVertical: false,
    // https://github.com/mAAdhaTTah/babel-plugin-prismjs#configuring-the-plugin
    code: {
      languages: ['javascript'],
      plugins: [],
      theme: 'default'
    }
  },
  extends: {
    js: null,
    css: null
  }
};

const configFileNames = ['.fusumarc.yml', '.fusumarc.js'];

function getConfigYaml() {
  const configYaml = yaml.safeDump(config).replace(/null/g, '');

  return configYaml
    .split('\n')
    .map((s) => {
      if (s.substr(-1) === ' ') return s.slice(0, -1);
      else return s;
    })
    .join('\n');
}

async function init(baseDir) {
  try {
    await writeFileAsync(join(baseDir, '.fusumarc.yml'), getConfigYaml());
  } catch (e) {
    throw e;
  }
}

async function read(baseDir) {
  const file = pSearch(baseDir, configFileNames);

  if (file === null) {
    throw new Error('Could not find a configure file. init command creates a configure file.');
  }

  switch (extname(file)) {
    case '.yml':
      return yaml.safeLoad(await readFileAsync(file, 'utf8'));
    case '.js':
      return require(file);
  }
}

async function live(baseDir) {
  const schema = `# need to create keys, see https://developer.twitter.com/
CONSUMER_KEY=
CONSUMER_SECRET=
ACCESS_TOKEN_KEY=
ACCESS_TOKEN_SECRET=
`;

  try {
    await writeFileAsync(join(baseDir, '.env'), schema);
  } catch (e) {
    throw e;
  }
}

module.exports = {
  init,
  read,
  live
};