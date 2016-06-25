const fs = require('fs');
const ip = require('ip');

const CIDR_PATH = './cn-aggregated.zone.txt';
const TEMPLATE_PAC_PATH = './whitelist_template.pac';
const DIST_PAC_PATH = './whitelist.pac';
const PROXY = '127.0.0.1:1080';

const cidrsFile = fs.readFileSync(CIDR_PATH);
const cidrs = cidrsFile.toString().split(/\n|\r\n/);

const pacTemplateFile = fs.readFileSync(TEMPLATE_PAC_PATH).toString();

const ipRepo = [];

cidrs.forEach(cidr => {
  if (cidr) {
    const cidrData = ip.cidrSubnet(cidr);
    const ipStrStart = cidrData.firstAddress;
    const ipStrEnd = cidrData.lastAddress;

    const ipLongStart = ip.toLong(ipStrStart);
    const ipLongEnd = ip.toLong(ipStrEnd);
    
    ipRepo.push([ipLongStart, ipLongEnd]);
  }
})

var testChinaIp = "123.58.180.8";
var testNotChinaIp = "216.58.203.4";

var testChinaIpLong = ip.toLong(testChinaIp);
var testNotChinaIpLong = ip.toLong(testNotChinaIp);

var testIpLong = testNotChinaIp;
var leftIndex = parseInt(ipRepo.length / 2);
var rightIndex = leftIndex + 1;
var leftLong = ipRepo[leftIndex][1];
var rightLong = ipRepo[rightIndex][0];

while (1) {
  if (testIpLong < leftLong) {
    leftIndex = parseInt(leftIndex / 2);
    rightIndex = leftIndex + 1;
    leftLong = ipRepo[leftIndex][1];
    rightLong = ipRepo[rightIndex][0];
    
    var leftMin = ipRepo[leftIndex][0];
    console.log('left of:', leftIndex);
    if (testIpLong > leftMin) {
      console.log('match!');
      break;
    }
  } else if (testIpLong > rightLong) {
    leftIndex = leftIndex + parseInt(leftIndex / 2);
    rightIndex = leftIndex + 1;
    leftLong = ipRepo[leftIndex][1];
    rightLong = ipRepo[rightIndex][0];
    
    var rightMax = ipRepo[rightIndex][1];
    console.log('right of:', leftIndex);
    if (testIpLong < rightMax) {
      console.log('match!');
      break;
    }
  } else {
    // No match -> Pass proxy
    console.log('no match');
    break;
  }
}

let ipsStr = '';
const addIp = (start, end) => ipsStr += `  [${start}, ${end}], \n`;

ipRepo.forEach(ipRange => addIp(ipRange[0], ipRange[1]));

//console.log(ipsStr);
Object.assign(String.prototype, {
  applyTemplate(key, content) {
    return this
      .replace(new RegExp(`\{\#${key}\}`, 'g'), content);
  }
});

var pacContent = pacTemplateFile
  .applyTemplate('ipRepo', ipsStr)
  .applyTemplate('date', new Date().toUTCString());

fs.writeFileSync(DIST_PAC_PATH, pacContent);

// console.log('All done!');\