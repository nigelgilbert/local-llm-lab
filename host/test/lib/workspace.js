// Filesystem helpers around the test workspace (/workspace inside the
// container — purely ephemeral, gone when --rm fires).

const fs   = require('fs');
const path = require('path');

const WORKSPACE = '/workspace';

function reset() {
  if (fs.existsSync(WORKSPACE)) {
    for (const entry of fs.readdirSync(WORKSPACE)) {
      fs.rmSync(path.join(WORKSPACE, entry), { recursive: true, force: true });
    }
  } else {
    fs.mkdirSync(WORKSPACE, { recursive: true });
  }
}

function exists(rel) {
  return fs.existsSync(path.join(WORKSPACE, rel));
}

function read(rel) {
  return fs.readFileSync(path.join(WORKSPACE, rel), 'utf8');
}

function list() {
  return fs.existsSync(WORKSPACE) ? fs.readdirSync(WORKSPACE) : [];
}

module.exports = { WORKSPACE, reset, exists, read, list };
