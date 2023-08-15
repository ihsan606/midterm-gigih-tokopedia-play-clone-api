// import app from './app';
import { http } from './app';




const port = process.env.PORT || 3000;
http.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
