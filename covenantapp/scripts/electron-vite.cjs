const { spawn } = require('child_process')
const { join } = require('path')

const args = process.argv.slice(2)
const command = join(
  __dirname,
  '..',
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'electron-vite.cmd' : 'electron-vite'
)
const env = Object.fromEntries(
  Object.entries(process.env).filter(([key]) => key && !key.startsWith('='))
)

delete env.ELECTRON_RUN_AS_NODE

const child = spawn(command, args, {
  env,
  stdio: 'inherit',
  shell: process.platform === 'win32'
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 0)
})
