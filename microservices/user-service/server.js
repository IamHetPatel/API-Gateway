const express = require('express');
const app = express();
app.use(express.json());

let users = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Doe' }
];

// Get all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Get a specific user
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send('User not found');
  res.json(user);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`User service running on port ${port}`);
});
