const runner = require("@sepalang/runner");

runner(async ({ run, find })=>{
  await run("openssl genrsa 1024 > key.pem",{ cwd: find("../server/cert") });
  await run("openssl req -x509 -new -key key.pem > cert.pem",{ cwd: find("../server/cert") });
})