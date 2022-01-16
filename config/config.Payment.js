require("dotenv").config();

const Payment = {
  axiosHeader: async () => {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization:
        "Basic " +
        Buffer.from(process.env.PAYMENT_SERVER_KEY).toString("base64"),
    };
  },
  pathCreateTransaction: async (data) => {
    return process.env.PAYMENT_HOST + "/snap/v1/transactions";
  },
};

module.exports._ = Payment;
