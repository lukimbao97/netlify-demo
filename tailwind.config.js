module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      width: {
        // max: "max-content",
      },
      spacing: {
        100: "55rem",
      },
    },
  },
  variants: {
    display: ["group-hover"],
  },
  plugins: [],
};
