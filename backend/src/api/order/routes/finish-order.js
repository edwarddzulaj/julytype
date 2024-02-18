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
  ],
};
