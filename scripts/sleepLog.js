const fs = require("fs")
module.exports = async robot => {
  robot.hear(/sleepLog/gi, function (msg) {
    if(msg.message.text.match(/dump/gi)){
      msg.send(fs.readFileSync("./data/sleepLog.csv","utf8"))
      return
    }
    let lastTime
    try{
      lastTime = new Date(fs.readFileSync("./data/lastSleepLog.txt","utf8"))
    }catch(e){
      lastTime = new Date()
    }
    let nowTime = msg.message.text.match(/-d/gi) ? new Date(msg.message.text.replace(/.+\-d\s+/,"")+"") : new Date()
    let sec = Math.floor((nowTime.getTime()-lastTime.getTime())/1000)
    let min = 0
    let hou = 0
    for(hou=0;60*60<=sec;hou++) sec = sec-60*60
    for(min=0;   60<=sec;min++) sec = sec-60
    if(min<10) min = "0"+min
    if(sec<10) sec = "0"+sec
    let text
    text  = `${nowTime.toString()},`
    text += msg.message.text.match(/poyashimi/gi) ? "就寝" : "起床"
    text += `,${hou}:${min}:${sec}`
    text += "\n"
    if(!msg.message.text.match(/now/gi)){
      fs.appendFileSync("./data/sleepLog.csv",text,"utf8")
      fs.writeFileSync("./data/lastSleepLog.txt",nowTime.toString(),"utf8")
    }
    msg.send(text)
  })
}
