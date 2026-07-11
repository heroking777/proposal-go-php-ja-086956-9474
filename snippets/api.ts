import express from 'express';
import { Request, Response } from 'express';

const app = express();
app.use(express.json());

interface Currency {
  userId: string;
  amount: number;
}

const currencies: Currency[] = [];

// Endpoint to get user's currency balance
app.get('/currency/:userId', (req: Request, res: Response) => {
  const userId = req.params.userId;
  const userCurrency = currencies.find(c => c.userId === userId);

  if (userCurrency) {
    return res.status(200).json(userCurrency);
  } else {
    return res.status(404).json({ message: 'User not found' });
  }
});

// Endpoint to add currency to a user
app.post('/currency/:userId', (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { amount } = req.body;

  if (!amount || typeof amount !== 'number') {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  const userCurrency = currencies.find(c => c.userId === userId);

  if (userCurrency) {
    userCurrency.amount += amount;
    return res.status(200).json(userCurrency);
  } else {
    currencies.push({ userId, amount });
    return res.status(201).json({ userId, amount });
  }
});

// Endpoint to deduct currency from a user
app.put('/currency/:userId', (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { amount } = req.body;

  if (!amount || typeof amount !== 'number') {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  const userCurrency = currencies.find(c => c.userId === userId);

  if (userCurrency && userCurrency.amount >= amount) {
    userCurrency.amount -= amount;
    return res.status(200).json(userCurrency);
  } else {
    return res.status(400).json({ message: 'Insufficient funds or user not found' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});