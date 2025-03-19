import autoprefixer from "autoprefixer";
import postcssNested from "postcss-nested";

export default {
  plugins: {
    'postcss-nested': postcssNested,
    tailwindcss: {},
    autoprefixer: autoprefixer,
  },
};
