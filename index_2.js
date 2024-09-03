const {faker}=require('@faker-js/faker');
const mysql=require("mysql2")
const connection=mysql.createConnection({
  host:'localhost',
  user:'root',
  database:'delta_app',
  password:'mansi@123'
});
//inserting new data
let q="INSERT INTO user(id,username,email,password) VALUES ?";
let users=[
  ["890d","890_newuserd","hgj@gmail.comb","hgjb"],
["657c","657newuserc","tuy@gmail.comc","tuyc"]
];

try{
  connection.query(q,[users],(err,result)=>{
    if(err) throw err;
    console.log(result);
  });

} catch(err){
  console.log(err);
}
connection.end();
let  getRandomUser=()=>  {
    return {
      Id: faker.datatype.uuid(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      
    };
};
try{
  connection.query("SHOW TABLES",(err,result)=>{
    if(err) throw err;
    console.log(result);
  });
}catch(err){
  console.log(err);

}


console.log(getRandomUser());
  