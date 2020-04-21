module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-knobs/register',
    '@storybook/addon-actions/register',
    '@storybook/addon-a11y/register',
  ],
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('ts-loader'),
        },
      ],
    })
    config.resolve.extensions.push('.ts', '.tsx')
    config.module.rules = config.module.rules.map(rule => {
      if (rule.test.toString().includes('css')) {
        return {
          ...rule,
          use: ['style-loader', 'css-loader'],
        }
      }
      return rule
    })
    return config
  },
}
