const express= require("express")
const app= express()
require('dotenv').config()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ConnectDB= require('./config/db.cjs')
const cors= require('cors')
const UserRoutes= require('./routes/UserRoutes.cjs')
const ServiceRecordRoutes= require('./routes/ServiceRecordRoutes.cjs')
const ServiceRoutes= require('./routes/ServiceRoutes.cjs')
const CarRoutes= require('./routes/CarRoutes.cjs')
const PaymentRoutes= require('./routes/PaymentRoutes.cjs')
const PORT= process.env.PORT||3000

app.use(cors());

ConnectDB();
app.listen(PORT,(req,res)=>{
    console.log(`server is running on http://localhost:${PORT}`)
})
app.use('/Users',UserRoutes)
app.use('/Services', ServiceRoutes)
app.use('/ServiceRecords', ServiceRecordRoutes)
app.use('/Cars',CarRoutes)
app.use('/Payments',PaymentRoutes)
