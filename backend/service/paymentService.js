const {Payment, User} = require("../model/index");

const getPaymentStatus = async(orderId)=>{
    try {
        const statusPayment = await Payment.findOne({where : {orderId :orderId}})
        return statusPayment
    } catch (error) {
       console.log(error) 
    }
}

module.exports= {getPaymentStatus}