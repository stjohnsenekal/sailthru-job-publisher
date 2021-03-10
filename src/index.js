import 'dotenv/config';
import redis from 'redis';

function exitCondition() {
  console.log("ERROR INCORRECT USAGE: ");
  console.log("usage format:");
  console.log(`node dist/sailthru.main.js [importList|importUsers|importPurchases] file=\"example.txt\" list="exampleList" (option 0 only)`);
    process.exit(1);
}

console.log("SAILTHRU JOB INITIATOR --begin--");
console.log("...");

if(!(process.argv[2] == "importList" || 
  process.argv[2] == "importUsers" || 
    process.argv[2] == "importPurchases")) {
    exitCondition();
}

const fileName = process.argv[3];
if(!fileName.startsWith("file=")) {
  exitCondition();
}

const filePath = `${fileName.slice(5)}`;

let listTitle = "";
const listName = process.argv[4];
if(listName && listName.startsWith("list=")) {
  listTitle = `${listName.slice(5)}`;
}


const publisher = redis.createClient({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST
});


if (process.argv[2] == "importList") {

  const joblist = { list: listTitle, fileName: filePath }

  publisher.on('ready', function () {
    publisher.publish('job-import-emails-to-list', JSON.stringify(joblist));
    publisher.end(true);
  });

  console.log("SAILTHRU JOB INITIATOR --completed--");

}

if (process.argv[2] == "importUsers") {

  publisher.on('ready', function () {
    publisher.publish('job-import-users-historical', filePath);
    publisher.end(true);
  });

  console.log("SAILTHRU JOB INITIATOR --completed--");

}

if (process.argv[2] == "importPurchases") {

  publisher.on('ready', function () {
    publisher.publish('job-import-purchases-historical', filePath);
    publisher.end(true);
  });


  console.log("SAILTHRU JOB INITIATOR --completed--");

}





