module.exports = {
    routes: [
        {
            method: "POST",
            path: "/order/send_verification_code",
            handler: "order.sendVerificationCode",
            config: {
                auth: false,
            },
        },
        {
            method: "POST",
            path: "/order/verify_student_email",
            handler: "order.verifyStudentEmail",
            config: {
                auth: false,
            },
        },
    ],
};
