// Node.js available
const ipc = require('electron').ipcRenderer
const ical = require('cal-parser');
const path = require('path');
const fs = require('fs');
const request = require('request');
//DOWNLOAD 
let actN = 0;
let dayAct = new Date();
//
var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
  console.log('content-type:', res.headers['content-type']);
  console.log('content-length:', res.headers['content-length']);
  request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  }); 
};   
download('https://planning.univ-lorraine.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources=326262&projectId=9&calType=ical&nbWeeks=16'
,'files/test.ics', function(){
  console.log('done');
});
//Parse ics to Js array
const myCalendarString = fs.readFileSync("./files/test.ics", "utf-8");
const parsed = ical.parseString(myCalendarString);
console.log(parsed);
//Afficher une activité
function Modif(h1,h2,h3) {
  document.querySelector("h1#edt").textContent = h1;
  document.querySelector("h2#edt").textContent = h2;
  document.querySelector("h3#edt").textContent = h3;
}
function NextAct(array)
{
  const element = sort_IcsFile(array.getEventsOnDate(dayAct));
  if(element!=0){
    if (actN<element.length) {
      actN++;
      Modif(element[actN]["summary"]["value"],element[actN]["location"]["value"],element[actN]["dtstart"]["value"]);
      console.log(actN)
    }
    else {
      tomorrow = new Date(dayAct.getTime() + (24 * 60 * 60 * 1000));
      dayAct = tomorrow;
    }
  }
  else {
    tomorrow = new Date(dayAct.getTime() + (24 * 60 * 60 * 1000));
    dayAct = tomorrow;
  }
}

function sort_IcsFile(a)
{
  for (let i = 0; i < a.length; i++) {
    console.log(a[i]['dtstart']);
    console.log(currentElement);
    if (a[i+1] != undefined) {
      if (a[i]['dtstart']['value'] > a[i+1]['dtstart']['value']) {
        temp = a[i]['dtstart']
        a[i]['dtstart'] = a[i+1]['dtstart'];
        a[i+1]['dtstart'] = temp;
      }
    }
  }
  return a;
}

/*
function BackAct(array) {
  console.log("1")
  const element = array.getEventsOnDate(dayAct)
  if (actN > element.length) {
    console.log("2" + element + " ok " + actN);
    Modif(element[actN]["summary"]["value"],element[actN]["location"]["value"],element[actN]["dtstart"]["value"]);
    actN--;
  } else{
    actN= 0;
    dayAct = dayAct.setDate((dayAct.getDate()-1).toString());
    console.log("3 ahahhahha " + dayAct);
  }
} */
//Gestion des déplacements
window.addEventListener('DOMContentLoaded', () => {
  //Start
    if (document.querySelector('.little') !== null ) {
      document.querySelector('.little').addEventListener('click',(e) => {
        const rep = ipc.send('pass_account','');
      });
    }
    if (document.querySelector('.click_arrow') !== null){
      document.querySelector('#leftArrow').addEventListener('click',(e) =>{
        //BackAct(parsed)
      })
      document.querySelector('#rightArrow').addEventListener('click',(e) =>{
        NextAct(parsed)
      })
    }
  // the window will close when he clicked on black cross 
    document.querySelector('#close').addEventListener('click',(e) => {
      const rep = ipc.send('close','');
    });
})


