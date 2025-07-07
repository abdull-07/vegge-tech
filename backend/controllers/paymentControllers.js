import crypto from "crypto"
import qs from "querystring"
import axios from "axios";

// JazzCash Controller
export const createJazzCashPayment = async (req, res) => {
    try {
        const { amount } = req.body

        const date = new Date();
        const txnDateTime = date.toISOString().replace(/[-:.TZ]/g, "").substring(0, 14)
        const txnExpiry = txnDateTime

        const postData = {
            pp_Version: "1.1",
            pp_TxnType: "MWALLET",
            pp_Language: "EN",
            pp_MerchantID: process.env.JAZZCASH_MERCHANT_ID,
            pp_Password: process.env.JAZZCASH_PASSWORD,
            pp_TxnRefNo: "T" + txnExpiry,
            pp_Amount: amount * 100, // JazzCash uses paisa, so Rs 100 = 10000
            pp_TxnDateTime: txnDateTime,
            pp_BillReference: "BillRef",
            pp_Description: "Payment for order",
            pp_TxnCurrency: "PKR",
            pp_ReturnURL: "http://localhost:3000/api/payment/verify",
            pp_SecureHash: "", // to be calculated below
        }

        // create integrity hash
        const sortedKeys = Object.keys(postData).sort()
        const hashingString = sortedKeys.map(k => postData[k].join("&"))
        const secureHash = crypto
            .createHash("sha256", process.env.JAZZCASH_INTEGRITY_SALT)
            .update(hashingString)
            .digest("hex")

        postData.pp_secureHash = secureHash

        // Redirect user to jazzcash host checkout
        const redirectUrl = "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionManagement.do?" + qs.stringify(postData);
        res.status(200).json({ redirectUrl });
    } catch (error) {
        console.error("Error in Updating Cart:", error)
        res.status(500).json({ message: "Internal Server Error" });
    }
}


// JazzCash Verification
export const verifyJazzCashPayment = async (req, res) => {
    try {
        const { pp_ResponseCode, pp_TxnRefNo } = req.body;
        if (pp_ResponseCode === "000") {
            return res.status(200).json({ message: "JazzCash Payment Success", ref: pp_TxnRefNo });
        } else {
            return res.status(400).json({ message: "JazzCash Payment Failed" });
        }
    } catch (err) {
        console.error("JazzCash verify error:", err);
        res.status(500).json({ message: "Verification Failed" });
    }
};


// Easy Paise Controller
export const createEasyPaisaPayment = async (req, res) => { 

    const generateEasyPaisaHash = (data, secret) => {
        const sortedKeys = Object.keys(data).sort();
        const stringToHash = sortedKeys.map(k => data[k]).join("&");
        return crypto.createHmac("sha256", process.env.EP_INTEGRITY_SALT).update(stringToHash).digest("hex");
    };
    try {
        const { amount, userPhone, email } = req.body;
        const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "").substring(0, 14);
        const txnRefNo = `EP${timestamp}`;

        const payload = {
            storeId: process.env.EP_STORE_ID,
            transactionAmount: `${amount}`,
            transactionType: "SALE",
            orderRefNum: txnRefNo,
            emailAddress: email || "test@example.com",
            mobileNum: userPhone || "03001234567",
            paymentMethod: "MA_PAYMENT",
            postBackURL: "http://localhost:3000/api/payment/easypaisa/verify",
        };

        const hash = generateEasyPaisaHash(payload, process.env.EP_INTEGRITY_SALT);
        payload.merchantHashedReq = hash;

        const { data } = await axios.post(
            "https://easypaisa-staging/api/initiate-payment",
            qs.stringify(payload),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        if (data.responseCode !== "000") {
            return res.status(400).json({ message: "Easypaisa failed", detail: data });
        }

        res.status(200).json({ redirectUrl: data.paymentUrl });
    } catch (err) {
        console.error("Easypaisa Init Error:", err);
        res.status(500).json({ message: "Easypaisa payment failed" });
    }
};


// Easy Paisa Verification
export const verifyEasyPaisaPayment = async (req, res) => {
    try {
        const { orderRefNum, transactionStatus, hash } = req.body;

        const expectedHash = generateEasyPaisaHash(req.body, process.env.EP_INTEGRITY_SALT);

        if (hash !== expectedHash) {
            return res.status(400).json({ message: "Hash verification failed" });
        }

        if (transactionStatus === "SUCCESS") {
            // You can mark the order as paid here
            return res.status(200).json({ message: "Payment successful" });
        } else {
            return res.status(400).json({ message: "Payment failed or cancelled" });
        }
    } catch (err) {
        console.error("Easypaisa Verification Error:", err);
        res.status(500).json({ message: "Verification failed" });
    }
};