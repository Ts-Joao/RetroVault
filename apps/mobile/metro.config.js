const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');
const fs = require('fs');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

const resolveReal = (p) => {
  try { return fs.realpathSync(p); } catch { return p; }
};

config.resolver.extraNodeModules = {
  'react': resolveReal(path.resolve(projectRoot, 'node_modules/react')),
  'react-dom': resolveReal(path.resolve(projectRoot, 'node_modules/react-dom')),
  'react-native': resolveReal(path.resolve(projectRoot, 'node_modules/react-native')),
};

module.exports = withNativeWind(config, { input: './src/globals.css' });