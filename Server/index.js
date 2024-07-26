const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');

const app = new Koa();
const router = new Router();

app.use(bodyParser());

mongoose.connect('mongodb://localhost/s-tracks');


const PlatformSchema = new mongoose.Schema({
  name: String,
  amountSpent: Number,
  subscriptionStart: Date,
});

const Platform = mongoose.model('Platform', PlatformSchema);


router.get('/platforms', async (ctx) => {
  ctx.body = await Platform.find().sort({ amountSpent: -1 });
});

router.post('/platforms', async (ctx) => {
  const newPlatform = new Platform(ctx.request.body);
  await newPlatform.save();
  ctx.body = newPlatform;
});

router.delete('/platforms/:id', async (ctx) => {
  await Platform.findByIdAndRemove(ctx.params.id);
  ctx.status = 204;
});

app.use(router.routes()).use(router.allowedMethods());

const port = 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
