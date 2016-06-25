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

ipRepo.sort((a, b) => a[0] - b[0]);

var testChinaIp = "123.58.180.8";
var testNotChinaIp = "46.82.174.68";

var testChinaIpLong = ip.toLong(testChinaIp);
var testNotChinaIpLong = ip.toLong(testNotChinaIp);

var testIpLong = testNotChinaIpLong;

test(testChinaIpLong)
test(testNotChinaIpLong)

function test(testIpLong) {
  console.log('\ntesting: ' + ip.fromLong(testIpLong));
  
  var startRange = 0;
  var endRange = ipRepo.length;

  var leftPot = parseInt((startRange + endRange) / 2);
  var rightPot = leftPot + 1;

  var leftLong = ipRepo[leftPot][1];
  var rightLong = ipRepo[rightPot][0];

  while (1) {
    if (testIpLong <= leftLong) {
      endRange = leftPot;
      
      var leftMin = ipRepo[leftPot][0];
      var leftMax = ipRepo[leftPot][1];
      console.log('- left of: ', leftPot);
      if (testIpLong >= leftMin && testIpLong <= leftMax) {
        console.log(`+ match ${testIpLong} between ${leftMin}, ${leftMax} of index-${leftPot}`);
        break;
      }
      
      leftPot = parseInt((startRange + endRange) / 2);
      rightPot = leftPot + 1;
      leftLong = ipRepo[leftPot][1];
      rightLong = ipRepo[rightPot][0];
    } else if (testIpLong >= rightLong) {
      startRange = rightPot;
      
      var rightMin = ipRepo[rightPot][0];
      var rightMax = ipRepo[rightPot][1];
      console.log('- right of: ', rightPot);
      if (testIpLong >= rightMin && testIpLong <= rightMax) {
        console.log(`+ match ${testIpLong} between ${rightMin}, ${rightMax} of index-${rightPot}`);
        break;
      }
      
      leftPot = parseInt((startRange + endRange) / 2);
      rightPot = leftPot + 1;
      leftLong = ipRepo[leftPot][1];
      rightLong = ipRepo[rightPot][0];
    } else {
      // No match -> Pass proxy
      console.log('+ no match');
      break;
    }
  }
}

let ipsStr = '';
const addIpInt = (start, end) => ipsStr += `  [${start}, ${end}], \n`;
const addIpCIDR = (cidr) => ipsStr += `  [${ip.toLong(ip.cidrSubnet(cidr).firstAddress)}, ${ip.toLong(ip.cidrSubnet(cidr).lastAddress)}], \n`;

addIpCIDR('10.0.0.0/8');
addIpCIDR('127.0.0.1/32');
addIpCIDR('100.64.0.0/10');
addIpCIDR('172.16.0.0/12');
addIpCIDR('192.168.0.0/16');

ipRepo.forEach(ipRange => addIpInt(ipRange[0], ipRange[1]));

Object.assign(String.prototype, {
  applyTemplate(key, content) {
    return this.replace(new RegExp(`\{\#${key}\}`, 'g'), content);
  }
});

var pacContent = pacTemplateFile
  .applyTemplate('ipRepo', ipsStr)
  .applyTemplate('date', new Date().toUTCString());

fs.writeFileSync(DIST_PAC_PATH, pacContent);

console.log('\nTest Done / Generated');
