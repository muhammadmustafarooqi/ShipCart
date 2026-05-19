const mongoose = require("mongoose");
const MONGODB_URI = "mongodb+srv://jackcartersmith1_db_user:ye1Sks0VnKrhbCEk@cluster0.o5bwxnj.mongodb.net/?appName=Cluster0";

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const orders = await db.collection("orders").find({}).project({ orderId: 1 }).toArray();
  console.log(orders);
  process.exit(0);
}
main().catch(console.error);
