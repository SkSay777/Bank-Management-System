const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());
app.use(express.json());

const pool =require('./database.js');
const port = 5000;
app.listen(port, ()=>{
    console.log(`Listening at port ${port}...`);
});
//POST
app.post('/customer', async(req,res)=>{
    try {
        console.log(req.body);
        const {name,phone,email,house_no,city,zipcode,username,password} = req.body;
        console.log(`${name}`)
        const query= await pool.query('call insert_into_customer($1,$2,$3,$4,$5,$6,$7,$8)',[name,phone,email,house_no,city,zipcode,username,password]);
        res.send(query);
    } catch (err) {
        console.error(err.message);
    }
});
app.post('/employee', async(req,res)=>{
    try {
        const {username,user_password} =req.body;
        const query = await pool.query('call insert_into_emp_login($1,$2)',[username,user_password]);
        res.send('Inserted record into EMP_LOGIN table...');
    } catch (err) {
        console.error(err.message);
    }
});
app.post('/accounts',async(req,res)=>{
    try {
        
        const {customer_id,current_balance}=req.body;
        console.log(req.body);
        const query = await pool.query('call insert_into_accounts($1,$2)',[customer_id,current_balance]);
        res.send('Record Inserted');

    } catch (err) {
        console.error(err.message);
    }
});
app.get('/accounts',async(req,res)=>{
    try {
        const query = await pool.query('select * from accounts');
        res.json(query.rows);
    } catch (error) {
        console.log(error);
    }
});
app.get('/accounts/:customer_id', async(req,res)=>{
    try {
        const {customer_id}= req.params;
        const query = await pool.query('select account_id,date_opened,current_balance from accounts where customer_id=$1',[customer_id]);
        console.log(query.rows);
        res.json(query.rows);
    } catch (error) {
        console.log(error);
    }
});
app.post('/branch',async(req,res)=>{
    try {
        const {name,house_no,city,zip_code} = req.body;
        const query = await pool.query('call insert_into_branch($1,$2,$3,$4)',[name,house_no,city,zip_code]);
        res.send('Inserted record into Branch table...');
    } catch (err) {
        console.error(err.message);
    }
});
app.post('/transaction',async(req,res)=>{
    try {
        const {account_id,branch_id,amount,action} = req.body;
        const query = await pool.query('call insert_into_transaction($1,$2,$3,$4)',[account_id,branch_id,amount,action]);
        res.send('Inserted record into Transaction table...');       
    } catch (error) {
        
    }
});

//get

app.get('/customer',async(req,res)=>{
    try {
        const query = await pool.query('select customer_id,name,phone,email,house_no,city,zipcode,username from customer');
        res.json(query.rows);
    } catch (err) {
        console.error(err.message);
    }
});
app.get('/employee',async(req,res)=>{
    try {
        const query = await pool.query('select * from EMP_LOGIN');
        res.json(query.rows);
    } catch (err) {
        console.error(err.message);
    }
});
app.get('/branch',async(req,res)=>{
    try {
        const query = await pool.query('select * from branch');
        res.json(query.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//put
app.put('/customer/:username',async(req,res)=>{
    try {
        const {username} = req.params;
    } catch (err) {
        console.error(err.message);
    }
});
app.get('/customer/:username',async(req,res)=>{
    try {
        const username = req.params.username;
        console.log(username);
        const query = await pool.query('select * from customer where username=$1',[username]);
        console.log(query.rows);
        res.json(query.rows[0]);

    } catch (error) {
        console.log(error);
    }
});
app.delete('/employee/:username', async(req,res) =>{
    try {
        const {username} = req.params;
        console.log(username);
        const query = await pool.query('delete from emp_login where username = $1 returning *',[username]);
        res.send(query);
    } catch (error) {
        console.log(error);
    }
});


