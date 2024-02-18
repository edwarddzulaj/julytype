module.exports = {
  routes: [
    {
      method: "POST",
      path: "/order/finish_order",
      handler: "order.finishOrder",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/order/send_verification_code",
      handler: "order.sendVerificationCode",
      config: {
        auth: false,
      },
    },
  ],
};
