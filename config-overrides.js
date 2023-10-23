module.exports =
{
    webpack: function (config, env)
    {
        config.resolve.fallback = 
        {
            url: require.resolve('url/'),
            stream: require.resolve('stream-browserify'),
            querystring: require.resolve('querystring-es3'),
        };

        return config;
    },
};