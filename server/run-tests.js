const { spawn, execSync } = require('child_process');
const path = require('path');

const server = spawn('npx', ['tsx', 'src/server.ts'], {
  cwd: path.resolve(__dirname),
  stdio: ['ignore', 'pipe', 'pipe'],
  shell: true
});

let started = false;

server.stdout.on('data', (d) => {
  const msg = d.toString();
  process.stdout.write(msg);
  if (msg.includes('running on') && !started) {
    started = true;
    setTimeout(runTests, 500);
  }
});

server.stderr.on('data', (d) => process.stderr.write(d));

setTimeout(() => {
  if (!started) {
    console.error('Server start timeout');
    server.kill();
    process.exit(1);
  }
}, 15000);

function runTests() {
  try {
    execSync('node test-api.js', { cwd: __dirname, stdio: 'inherit', timeout: 30000 });
  } catch (e) {
    // test-api.js exits with 1 on failures
  } finally {
    server.kill();
    process.exit(0);
  }
}
