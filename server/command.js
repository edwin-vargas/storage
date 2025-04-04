const { spawn } = require('child_process');

function run(program, params) {
  const command = spawn(program, params);

  command.stdout.on('data', (data) => {
    console.log(`📥 stdout: ${data}`);
  });

  command.stderr.on('data', (data) => {
    console.error(`📤 stderr: ${data}`);
  });

  command.on('close', (code) => {
    console.log(`🔚 child process exited with code ${code}`);
  });
}

module.exports = {
    run
}