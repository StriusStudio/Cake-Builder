import morgan from 'morgan';
import chalk from 'chalk';

// Custom token for request body (for logging)
morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

// Custom token for response time with color based on response time
morgan.token('colored-status', (req, res) => {
  const status = res.statusCode;
  let color;
  
  if (status >= 500) {
    color = chalk.red; // red
  } else if (status >= 400) {
    color = chalk.yellow; // yellow
  } else if (status >= 300) {
    color = chalk.cyan; // cyan
  } else if (status >= 200) {
    color = chalk.green; // green
  } else {
    color = chalk.white; // white
  }
  
  return color(status);
});

// Custom format for development
const devFormat = [
  chalk.gray('[:date[clique]]'),
  chalk.blue('[:method]'),
  chalk.cyan(':url'),
  ':colored-status',
  chalk.gray(':response-time ms - :res[content-length] bytes'),
  chalk.yellow(':body')
].join(' ');

// Custom format for production
const prodFormat = '[:date[iso]] :method :url :status :response-time ms - :res[content-length]';

// Development logger
const developmentLogger = morgan(devFormat, {
  skip: (req, res) => process.env.NODE_ENV === 'production'
});

// Production logger
const productionLogger = morgan(prodFormat, {
  skip: (req, res) => process.env.NODE_ENV !== 'production',
  stream: process.stderr
});

// Error logging middleware
const errorHandler = (err, req, res, next) => {
  console.error(chalk.red(err.stack));
  next(err);
};

export { developmentLogger, productionLogger, errorHandler };
