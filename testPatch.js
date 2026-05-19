const http = require("http");

const req = http.request(
  {
    hostname: "localhost",
    port: 3000,
    path: "/api/orders/AIO-1764",
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  },
  (res) => {
    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });
    res.on("end", () => {
      console.log(`Status: ${res.statusCode}`);
      console.log(`Body: ${data}`);
    });
  }
);

req.on("error", (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(JSON.stringify({ trackingNumber: "TCS-123", courierName: "TCS" }));
req.end();
