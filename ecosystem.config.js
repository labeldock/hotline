const hotline = {
  name: "hotline",
  script: "./server/index.js",
  instance_var: "INSTANCE_ID"
};


if(process.argv.join(" ").indexOf("--env cluster")>0){
  Object.assign(hotline,{
    instances : 2,
    exec_mode : "cluster",
  });
}    

module.exports = {
  apps : [hotline]
};