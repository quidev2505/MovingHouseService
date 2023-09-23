const moment = require("moment");

const vnpayMethodController = {

    create_link: async (req, res) => {
        process.env.TZ = 'Asia/Ho_Chi_Minh';

        let date = new Date();
        let createDate = moment(date).format('YYYYMMDDHHmmss');

        let ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;


        let tmnCode = "OFD7D8R7";
        let secretKey = "PSDJHKOXWRGSOBHXPDOYHJUIXFQUJYUT"
        let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
        let returnUrl = "http://localhost:3000/user/booking"
        let orderId = moment(date).format('DDHHmmss');
        let amount = req.body.totalOrder;
        let bankCode = "VNBANK";

        let locale = "vn";
        if (locale === null || locale === '') {
            locale = 'vn';
        }
        let currCode = 'VND';
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }



        let sorted = {};
        let str = [];
        let key;
        for (key in vnp_Params) {
            if (vnp_Params.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(vnp_Params[str[key]]).replace(/%20/g, "+");
        }


        vnp_Params = sorted

        let querystring = require('qs');
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require("crypto");
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

        if (vnpUrl){
            res.status(201).json(vnpUrl);
        }else{
            res.status(501).json('error');
        }
    }


}

module.exports = vnpayMethodController;