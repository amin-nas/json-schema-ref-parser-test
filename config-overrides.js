const webpack = require('webpack');
module.exports = function override(config, env) {
    config.resolve.fallback = {
        url: require.resolve('url'),
        https: require.resolve("https-browserify"),
        http: require.resolve("stream-http"),
        util: require.resolve("util/"),
        buffer: require.resolve("buffer")
        
    };
    config.plugins.push(
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
    );

    return config;
}