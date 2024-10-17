import path from 'path';


const config = {
    entry: './src/engine.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve('./src/public'),
        clean: true,
    },
    resolve: {
        extensions: ['.js','.ts'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    mode: 'development',
};

export default config;