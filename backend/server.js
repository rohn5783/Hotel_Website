import app from './app.js';
import { env } from './config/env.js';

const PORT = env.port;

app.listen(PORT, () => {
  console.log(`Hotel API listening on http://localhost:${PORT}`);
});
