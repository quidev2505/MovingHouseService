module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: ['react-native-reanimated/plugin'], // 플러그인 추가
  };
};
