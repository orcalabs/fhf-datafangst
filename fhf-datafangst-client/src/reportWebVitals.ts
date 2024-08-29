import { MetricType, onCLS, onINP, onLCP } from "web-vitals";

const reportWebVitals = (callback?: (_: MetricType) => void) => {
  if (callback) {
    onCLS(callback);
    onINP(callback);
    onLCP(callback);
  }
};

export default reportWebVitals;
