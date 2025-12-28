// vite.config.js
import { defineConfig, loadEnv } from "file:///C:/Users/Anand/Desktop/school/school2026/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Anand/Desktop/school/school2026/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\Anand\\Desktop\\school\\school2026";
var vite_config_default = ({ mode }) => {
  const isProd = mode === "production";
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    mode: "development",
    plugins: [react()],
    resolve: {
      alias: {
        "@app": path.resolve(__vite_injected_original_dirname, "./src"),
        "@store": path.resolve(__vite_injected_original_dirname, "./src/store"),
        "@components": path.resolve(__vite_injected_original_dirname, "./src/components"),
        "@modules": path.resolve(__vite_injected_original_dirname, "./src/modules"),
        "@pages": path.resolve(__vite_injected_original_dirname, "./src/pages")
      }
    },
    build: {
      chunkSizeWarningLimit: 1e3,
      rollupOptions: {
        output: {
          manualChunks: void 0
        }
      }
    },
    server: {
      // proxy: {
      //   '/HospediaAPI/api': {
      //     target: process.env.VITE_APP_REACT_APP_BASE_URL,
      //     changeOrigin: true,
      //   }
      // }
    },
    esbuild: isProd ? {
      drop: ["console", "debugger"]
    } : {}
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxBbmFuZFxcXFxEZXNrdG9wXFxcXHNjaG9vbFxcXFxzY2hvb2wyMDI2XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxBbmFuZFxcXFxEZXNrdG9wXFxcXHNjaG9vbFxcXFxzY2hvb2wyMDI2XFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9BbmFuZC9EZXNrdG9wL3NjaG9vbC9zY2hvb2wyMDI2L3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7IG1vZGUgfSkgPT4ge1xyXG4gIGNvbnN0IGlzUHJvZCA9IG1vZGUgPT09ICdwcm9kdWN0aW9uJ1xyXG4gIHByb2Nlc3MuZW52ID0geyAuLi5wcm9jZXNzLmVudiwgLi4ubG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKSB9O1xyXG5cclxuICByZXR1cm4gZGVmaW5lQ29uZmlnKHtcclxuICAgIG1vZGU6ICdkZXZlbG9wbWVudCcsXHJcbiAgICBwbHVnaW5zOiBbcmVhY3QoKV0sXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgJ0BhcHAnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcclxuICAgICAgICAnQHN0b3JlJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3N0b3JlJyksXHJcbiAgICAgICAgJ0Bjb21wb25lbnRzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2NvbXBvbmVudHMnKSxcclxuICAgICAgICAnQG1vZHVsZXMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvbW9kdWxlcycpLFxyXG4gICAgICAgICdAcGFnZXMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvcGFnZXMnKSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBidWlsZDoge1xyXG4gICAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDEwMDAsXHJcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgICBvdXRwdXQ6IHtcclxuICAgICAgICAgIG1hbnVhbENodW5rczogdW5kZWZpbmVkLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgc2VydmVyOiB7XHJcbiAgICAgIC8vIHByb3h5OiB7XHJcbiAgICAgIC8vICAgJy9Ib3NwZWRpYUFQSS9hcGknOiB7XHJcbiAgICAgIC8vICAgICB0YXJnZXQ6IHByb2Nlc3MuZW52LlZJVEVfQVBQX1JFQUNUX0FQUF9CQVNFX1VSTCxcclxuICAgICAgLy8gICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgLy8gICB9XHJcbiAgICAgIC8vIH1cclxuICAgIH0sXHJcbiAgICBlc2J1aWxkOiBpc1Byb2RcclxuICAgICAgPyB7XHJcbiAgICAgICAgICBkcm9wOiBbJ2NvbnNvbGUnLCAnZGVidWdnZXInXSxcclxuICAgICAgICB9XHJcbiAgICAgIDoge30sIFxyXG4gIFxyXG4gIH0pO1xyXG59OyJdLAogICJtYXBwaW5ncyI6ICI7QUFBc1QsU0FBUyxjQUFjLGVBQWU7QUFDNVYsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUZqQixJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHNCQUFRLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDM0IsUUFBTSxTQUFTLFNBQVM7QUFDeEIsVUFBUSxNQUFNLEVBQUUsR0FBRyxRQUFRLEtBQUssR0FBRyxRQUFRLE1BQU0sUUFBUSxJQUFJLENBQUMsRUFBRTtBQUVoRSxTQUFPLGFBQWE7QUFBQSxJQUNsQixNQUFNO0FBQUEsSUFDTixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsSUFDakIsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsUUFBUSxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLFFBQ3ZDLFVBQVUsS0FBSyxRQUFRLGtDQUFXLGFBQWE7QUFBQSxRQUMvQyxlQUFlLEtBQUssUUFBUSxrQ0FBVyxrQkFBa0I7QUFBQSxRQUN6RCxZQUFZLEtBQUssUUFBUSxrQ0FBVyxlQUFlO0FBQUEsUUFDbkQsVUFBVSxLQUFLLFFBQVEsa0NBQVcsYUFBYTtBQUFBLE1BQ2pEO0FBQUEsSUFDRjtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsdUJBQXVCO0FBQUEsTUFDdkIsZUFBZTtBQUFBLFFBQ2IsUUFBUTtBQUFBLFVBQ04sY0FBYztBQUFBLFFBQ2hCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFFBQVE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU9SO0FBQUEsSUFDQSxTQUFTLFNBQ0w7QUFBQSxNQUNFLE1BQU0sQ0FBQyxXQUFXLFVBQVU7QUFBQSxJQUM5QixJQUNBLENBQUM7QUFBQSxFQUVQLENBQUM7QUFDSDsiLAogICJuYW1lcyI6IFtdCn0K
