const moment = require("moment");
const knex = require("../config/config.db");
const Response = require("../helpers/response");
const axios = require("axios");
const Payment = require("../config/config.Payment");

const ShortlinkPremium = {
  create: async (req, res) => {
    try {
      const { original_link, new_link, name, product_id } = req.body;
      const { data } = req.decoded;
      if (
        new_link == "price" ||
        new_link == "verification" ||
        new_link == "logout" ||
        new_link == "user" ||
        new_link == "auth" ||
        new_link.includes("/")
      )
        return Response._.clientOk(res, null, "name not allowed");
      let checkUrlTemp = await knex("temp_shortlink")
        .where({
          new_link,
        })
        .select("id", "new_link", "original_link", "created_at");
      if (checkUrlTemp.length > 0)
        return Response._.clientOk(res, null, "name already registered");
      let checkUrl = await knex("shortlink")
        .where({
          new_link,
        })
        .select("id", "new_link", "original_link", "created_at");
      if (checkUrl.length > 0)
        return Response._.clientOk(res, null, "name already registered");

      let product = await knex("product")
        .where({
          id: product_id,
        })
        .select();
      product = product[0];

      let item = {
        name,
        product_id,
        user_id: data.id,
        created_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        updated_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      };

      let itemTemp = {
        new_link,
        original_link,
        created_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        updated_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      };

      let itemPayment = {
        ppn: process.env.PPN,
        price: product.price,
        tax_amount: (product.price * process.env.PPN) / 100,
        amount_include_tax:
          (product.price * process.env.PPN) / 100 + product.price,
        status: "create",
        created_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        updated_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      };
      let respons = await knex
        .transaction(async (trx) => {
          await knex("premium")
            .transacting(trx)
            .insert(item)
            .returning(["id"])
            .then(async (resp) => {
              itemTemp.premium_id = resp[0].id;
              itemPayment.premium_id = resp[0].id;
              await knex("temp_shortlink")
                .transacting(trx)
                .insert(itemTemp)
                .then(async () => {
                  await knex("payment")
                    .transacting(trx)
                    .insert(itemPayment)
                    .returning(["id"])
                    .then(async (resp) => {
                      return await axios({
                        url: await Payment._.pathCreateTransaction(),
                        method: "post",
                        headers: await Payment._.axiosHeader(),
                        data: {
                          transaction_details: {
                            order_id: resp[0].id,
                            gross_amount: itemPayment.amount_include_tax,
                          },
                          credit_card: {
                            secure: true,
                          },
                          customer_details: {
                            first_name: data.name,
                            email: data.email,
                          },
                          item_details: [
                            {
                              id: product.id,
                              price: itemPayment.amount_include_tax,
                              quantity: 1,
                              name: product.description,
                            },
                          ],
                          expiry: {
                            unit: "hour",
                            duration: 1,
                          },
                        },
                      }).then((snapResponse) => {
                        let snapToken = snapResponse.data.token;
                        return snapToken;
                      });
                    })
                    .then(trx.commit)
                    .catch(trx.rollback);
                })
                .catch(trx.rollback);
            })
            .catch(trx.rollback);
        })
        .then(async (resp) => {
          return resp;
        });
      await respons;
      return Response._.clientOk(res, respons);
    } catch (error) {
      console.log("error", error);
      return Response._.clientError(res, null, error.toString());
    }
  },
  listProduct: async (req, res) => {
    try {
      let result = await knex("product").select();
      return Response._.clientOk(res, result);
    } catch (error) {
      return Response._.clientError(res, null, error.toString());
    }
  },
  listUrlWaitingPayment: async (req, res) => {
    try {
      const { data } = req.decoded;
      let result = await knex("premium")
        .join("user", "user.id", "=", "premium.user_id")
        .join("temp_shortlink", "temp_shortlink.premium_id", "=", "premium.id")
        .join("payment", "payment.premium_id", "=", "premium.id")
        .join("product", "product.id", "=", "premium.product_id")
        .where("user.id", "=", data.id)
        .where("payment.status", "!=", "settlement")
        .orderBy("payment.updated_at", "desc")
        .select(
          knex.ref("payment.id"),
          knex.ref("payment.status"),
          knex.ref("payment.created_at"),
          knex.ref("payment.updated_at"),
          knex.ref("payment.amount_include_tax"),
          knex.ref("premium.name"),
          knex.ref("product.name").as("product_name"),
          knex.ref("temp_shortlink.new_link"),
          knex.ref("temp_shortlink.original_link")
        );
      return Response._.clientOk(res, result);
    } catch (error) {
      return Response._.clientError(res, null, error.toString());
    }
  },
  updateStatusChoosePayment: async (req, res) => {
    try {
      const { payment_id } = req.body;
      let respons = await knex
        .transaction(function (trx) {
          knex("payment")
            .transacting(trx)
            .where({ id: payment_id })
            .update(
              {
                status: "pending",
                updated_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
              },
              ["id"]
            )
            .then(function (resp) {
              return resp[0];
            })
            .then(trx.commit)
            .catch(trx.rollback);
        })
        .then(function (resp) {
          return resp;
        });
      return Response._.clientOk(res, respons);
    } catch (error) {
      return Response._.clientError(res, null, error.toString());
    }
  },
};
module.exports = ShortlinkPremium;
