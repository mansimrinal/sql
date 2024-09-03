const {faker}=require('@faker-js/faker');
const mysql=require("mysql2")
const express=require("express");
const app=express();
const path=require("path")
const {v4 : uuidv4}=require("uuid");
const methodOverride=require("method-override");
app.use(methodOverride("_method"))
app.use(express.urlencoded({extended:true}))

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));


const connection=mysql.createConnection({
  host:'localhost',
  user:'root',
  database:'delta_app',
  password:'mansi@123'
});
let  getRandomUser=()=>  {
  return [
     faker.datatype.uuidv4(),
     faker.internet.userName(),
     faker.internet.email(),
     faker.internet.password(),
    
  ];
};

const port=8080;
app.get('/',(req,res)=>{
  let q=`SELECT count(*) FROM user`;
  try{
  connection.query(q,(err,result)=>{
    if(err) throw err;
   let count=result[0]["count(*)"];
   res.render("home.ejs",{count})
  });

} catch(err){
  console.log(err);
  res.send("some error in data base");
}

})
//show users
app.get("/user",(req,res)=>{
  let q=`SELECT *FROM user`
  try{
    connection.query(q,(err,user_result)=>{
      if(err) throw err;
      res.render("showuser.ejs",{user_result})
      
      
    });

  }catch(err){
    res.send("some error in databases")
  }
})
//edit route
app.get("/user/:id/edit",(req,res)=>{
  let{id}=req.params;

  let q=`SELECT *FROM user WHERE id="${id}"`;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err
      let user=result[0]
      res.render("edit.ejs",{user})
    })
  }catch(err){
    console.log("some error in data bases")
  }
});
//update route
app.patch("/user/:id",(req,res)=>{
  let{id}=req.params;
  let{password:formPass,username:newUsername}=req.body;
  let q=`SELECT *FROM user WHERE id="${id}"`;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err
      let user=result[0];
      if(formPass !=user.password){
        res.send("worng password")
      }else{
      let q2=`UPDATE user SET username="${newUsername}" WHERE id="${id}"`
      connection.query(q2,(err,result)=>{
        if(err) throw err;
        res.redirect("/user")

      });
      }
    });
  }catch(err){
    console.log("some error in data bases");
  }
});
//ADD NEW USER
app.get("/user/new",(req,res)=>{
  res.render("new.ejs");
})
app.post("/user/new",(req,res)=>{
  let{username,email,password}=req.body;
  let id=uuidv4();
  let q=`INSERT INTO user (id,username,email,password) VALUES ("${id}","${username}","${email}","${password}")`
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      res.send("added new user")
      res.redirect("/user");
    })
  }catch(err){
    res.send("some error occured");
  }

})
app.get("/user/:id/delete",(req,res)=>{
  let{id}=req.params;
  let q=`SELECT *FROM user WHERE id="${id}"`
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err
      let user=result[0]
      res.render("delete.ejs",{user})
    })
  }catch(err){
    res.send("some error in data")
  }
})
app.delete("/user/:id/",(req,res)=>{
  let {id}=req.params;
  let{password}=req.body;
  let q=`SELECT *FROM user WHERE id="${id}"`
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err
      let user=result[0]
      if(user.password!=password){
        res.send("wrong password entered")
      }else{
        let q2=`DELETE FROM user WHERE id="${id}"`
        connection.query(q2,(err,result)=>{
          if(err)throw err
          res.redirect("/user")

        });
      }
    });
  }catch(err){
    res.send("some error in databases")
  }
});
        
        
       
  
  

app.listen(port,(req,res)=>{
  console.log(`listening to the ${port}`);

})
  
//inserting new data
//let q="INSERT INTO user(id,username,email,password) VALUES ?";
//let data=[];
//for(let i=0;i<=100;i++){
  //data.push(getRandomUser());//100 random /fake users
//}

//try{
 // connection.query(q,[data],(err,result)=>{
  //  if(err) throw err;
  // console.log(result);
 // });

//} catch(err){
 // console.log(err);
//}
//connection.end();