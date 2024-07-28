const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');
const cors = require('@koa/cors');

const app = new Koa();
const router = new Router();

app.use(bodyParser());
app.use(cors()); 

mongoose.connect('mongodb://localhost/s-tracks');

const PlatformSchema = new mongoose.Schema({
  name: String,
  amountSpent: Number,
  subscriptionStart: Date,
  paymentFrequency: { type: String, enum: ['weekly', 'monthly', 'annually'], required: true },
  subscriptionFee: Number,
});

const Platform = mongoose.model('Platform', PlatformSchema);

const calculateTotalAmountSpent = (subscriptionStart, paymentFrequency, subscriptionFee, amountSpent) => {
  const now = new Date();
  const startDate = new Date(subscriptionStart);
  const timeDifference = now - startDate;

  let paymentIntervals;
  switch (paymentFrequency) {
    case 'weekly':
      paymentIntervals = timeDifference / (1000 * 60 * 60 * 24 * 7);
      break;
    case 'monthly':
      paymentIntervals = timeDifference / (1000 * 60 * 60 * 24 * 30);
      break;
    case 'annually':
      paymentIntervals = timeDifference / (1000 * 60 * 60 * 24 * 365);
      break;
    default:
      paymentIntervals = 0;
  }

  const totalAmountSpent = (paymentIntervals * subscriptionFee) + amountSpent;
  return totalAmountSpent;
};

// function to calculate spending rate
const calculateSpendingRate = (totalAmountSpent, subscriptionStart) => {
  const now = new Date();
  const startDate = new Date(subscriptionStart);
  const timeDifference = now - startDate;

  
  const daysSinceStart = timeDifference / (1000 * 60 * 60 * 24);

  if (daysSinceStart <= 0) return 0;

  const spendingRate = totalAmountSpent / daysSinceStart;
  return spendingRate;
};

router.get('/platforms', async (ctx) => {
  try {
    const platforms = await Platform.find().sort({ amountSpent: -1 });
    const platformsWithDetails = platforms.map(platform => {
      const totalAmountSpent = calculateTotalAmountSpent(
        platform.subscriptionStart,
        platform.paymentFrequency,
        platform.subscriptionFee,
        platform.amountSpent
      );
      const spendingRate = calculateSpendingRate(totalAmountSpent, platform.subscriptionStart);
      return { ...platform.toObject(), totalAmountSpent, spendingRate };
    });
    ctx.body = platformsWithDetails;
  } catch (err) {
    ctx.status = 500;
    ctx.body = err.message;
  }
});

router.post('/platforms', async (ctx) => {
  try {
    const newPlatform = new Platform(ctx.request.body);
    await newPlatform.save();
    ctx.status = 201;
    ctx.body = newPlatform;
  } catch (err) {
    ctx.status = 500;
    ctx.body = err.message;
  }
});

router.delete('/platforms/:id', async (ctx) => {
  try {
    await Platform.findByIdAndDelete(ctx.params.id);
    ctx.status = 204;
  } catch (err) {
    ctx.status = 500;
    ctx.body = err.message;
  }
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

