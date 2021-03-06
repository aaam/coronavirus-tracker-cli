#!/usr/bin/env node
const yargonaut = require('yargonaut').style('green');
const yargs = require('yargs');
const chalk = require('chalk');
const { getCompleteTable } = require('../lib/corona');
const { getCountryTable } = require('../lib/byCountry');
const { lookupCountry } = require('../lib/helpers');

const { argv } = yargs
  .command('$0 [country]','Tool to track COVID-19 statistics for the world or the given country', yargs =>
    yargs.positional('country', {
      coerce(arg) {
        if ('ALL' === arg.toUpperCase()) {
          return 'ALL';
        }
        const country = lookupCountry(arg);
        if (!country) {
          let error = `Country '${arg}' not found.\n`;
          error += 'Try full country name or country code.\n';
          error += 'Ex:\n';
          error += '- UK: for United Kingdom \n';
          error += '- US: for United States of America.\n';
          error += '- Italy: for Italy.\n';
          throw new Error(chalk.red.bold(error));
        }
        return country.iso2;
      },
      describe: 'Filter table by country',
      default: 'all',
      type: 'string'
    })
  )
  .options({
    e: {
      alias: 'emojis',
      describe: 'Show emojis in table',
      default: false,
      type: 'boolean'
    },
    c: {
      alias: 'color',
      describe: 'Show colors formatted output',
      type: 'boolean'
    }
  })
  .strict()
  .help('help');

const { emojis, country } = argv;
(
  country === 'ALL'
    ? getCompleteTable({emojis})
    : getCountryTable({ countryCode: country, emojis })
)
  .then(console.log)
  .catch(console.error);