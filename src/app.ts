import express from 'express';
import bodyParser from 'body-parser';
import adminsRoutes from './handlers/admins';
import booksRoutes from './handlers/books';
import regRoutes from './handlers/reg';
import DashboardService from './handlers/dashbored';

const app: express.Application = express();
const address = 'http://localhost:3000/welcome';

app.use(bodyParser.json());
//TODO loop or map on data to change it's shape
app.get('/welcome', (__req: express.Request, res: express.Response) => {
  res.send(
    '<p><h1 style="color:blue";>Welcome to our library ! 🎉</h1>\nFollow the instructions at the readme file 📧</p>'
  );
});

app.listen(3000, () => {
  console.log(`starting app on: ${address}`);
});

adminsRoutes(app);
booksRoutes(app);
regRoutes(app);
DashboardService(app);

export default app;
