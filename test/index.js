const Nightmare = require('nightmare');
const nightmare = Nightmare({show: true});

nightmare
  .goto(`http://localhost:8080/`)
  // basic assert utility (console.assert is not intercepted)
  .evaluate(() => {
    window.assert = (ok, message) =>
      console.warn('nightmare', !!ok, message || 'unknown');
  })
  // provide a mechanism to intercept asserts
  .on('console', (type, ...args) => {
    if (type === 'warn' && args[0] === 'nightmare') {
      type = 'assert';
      args.shift();
    }
    switch (type) {
      case 'assert':
        const [ok, message] = args;
        if (!ok) exit(new Error(message));
        else console.log(`  \x1B[0;32m✔\x1B[0;0m  ${message}`);
        break;
      case 'error':
        exit(new Error(args[0]));
      default:
        console[type](...args);
    }
  })
  .evaluate(() => {
    const ed = document.querySelectorAll('early-definition');
    assert(ed[0].parsed, 'node with sibling parsed');
    assert(ed[1].parsed, 'node without sibling parsed');
    const ld = document.querySelectorAll('lazy-definition');
    assert(ld[0].parsed, 'lazy definition parsed');
    const np = document.querySelectorAll('not-parsed');
    assert(np[0].parsed, 'node without parsedCallback is parsed anyway');
  })
  .evaluate(() => window.__coverage__)
  .end()
  .then(coverage => {
    require('fs').writeFile(
      require('path').join(__dirname, 'coverage.json'),
      JSON.stringify(coverage),
      (err) => {
        if (err) exit(err);
      }
    );
  })
  .catch(exit);

function exit(error) {
  console.error(error);
  process.exit(1);
}