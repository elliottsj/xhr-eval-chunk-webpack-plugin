// @flow

export default class XhrEvalChunkPlugin {
  apply(compiler) {
    compiler.plugin('compilation', function compilerPlugin(compilation) {
      compilation.mainTemplate.plugin(
        'require-ensure',
        function requireEnsurePlugin(source, chunk, hash) {
          const chunkFilename = this.outputOptions.chunkFilename;
          const chunkMaps = chunk.getChunkMaps();
          const chunkLoadTimeout = this.outputOptions.chunkLoadTimeout || 120000;
          const chunkUrl = `${this.requireFn}.p + ${
            this.applyPluginsWaterfall('asset-path', JSON.stringify(chunkFilename), {
              hash: `" + ${this.renderCurrentHashCode(hash)} + "`,
              hashWithLength: (length) => `" + ${this.renderCurrentHashCode(hash, length)} + "`,
              chunk: {
                id: '" + chunkId + "',
                hash: `" + ${JSON.stringify(chunkMaps.hash)}[chunkId] + "`,
                hashWithLength: (length) => {
                  const shortChunkHashMap = Object.keys(chunkMaps.hash)
                    .filter(chunkId => typeof chunkMaps.hash[chunkId] === 'string')
                    .reduce((acc, chunkId) => ({
                      ...acc,
                      [chunkId]: chunkMaps.hash[chunkId].substr(0, length),
                    }), {});
                  return `" + ${JSON.stringify(shortChunkHashMap)}[chunkId] + "`;
                },
                name: `" + (${JSON.stringify(chunkMaps.name)}[chunkId]||chunkId) + "`,
              },
            })
          }`;
          return this.asString([
            'if(installedChunks[chunkId] === 0)',
            this.indent([
              'return Promise.resolve();',
            ]),
            '',
            '// an Promise means "currently loading".',
            'if(installedChunks[chunkId]) {',
            this.indent([
              'return installedChunks[chunkId][2];',
            ]),
            '}',
            '// start chunk loading',
            `var timeout = setTimeout(onReadyStateChange, ${chunkLoadTimeout});`,
            'function onReadyStateChange() {',
            '  if (xhr.readyState === 4 && xhr.status === 200) {',
            '    eval(xhr.responseText);',
            '    clearTimeout(timeout);',
            '    var chunk = installedChunks[chunkId];',
            '    if(chunk !== 0) {',
            '      if(chunk) chunk[1](new Error("Loading chunk " + chunkId + " failed."));',
            '      installedChunks[chunkId] = undefined;',
            '    }',
            '  }',
            '}',
            'var xhr = new XMLHttpRequest();',
            `xhr.open("GET", ${chunkUrl});`,
            'xhr.onreadystatechange = onReadyStateChange;',
            'xhr.send();',
            '',
            'var promise = new Promise(function(resolve, reject) {',
            this.indent([
              'installedChunks[chunkId] = [resolve, reject];',
            ]),
            '});',
            'return installedChunks[chunkId][2] = promise;',
          ]);
        }
      );
    });
  }
}
