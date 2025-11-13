require('dotenv').config();
const { app } = require('./app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  const stats = app.locals?.stats ?? { branches: 0, subjects: 0 };
  console.log(`Course Web 2.0 backend running on port ${PORT}`);
  console.log(`Loaded ${stats.branches} branches and ${stats.subjects} subjects.`);
});
