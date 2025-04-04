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

function runD(program, params, workingDir) {
  const command = spawn(program, params, {
    cwd: workingDir // This sets the current working directory for the command
  });

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
    run, runD
}