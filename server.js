const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

let users = [];
let likes = [];
let dailyLikes = {};

// 매칭 점수
function score(a,b){
  let s = 0;

  if(a.purpose === b.purpose) s += 5;
  if(a.emotion === b.emotion) s += 3;

  if(a.speed === b.speed) s += 3;
  else s -= 1;

  if(a.conflict === b.conflict) s += 2;
  else s += 1;

  if(a.energy !== b.energy) s += 2;

  if(a.suffering === b.suffering) s += 4;

  return s;
}

// 등록
app.post('/register',(req,res)=>{
  const exists = users.find(u => u.name === req.body.name);
  if(!exists){
    users.push(req.body);
  }
  res.json({ok:true});
});

// 매칭
app.post('/match',(req,res)=>{
  const me = req.body;

  const result = users
    .filter(u => u.name !== me.name)
    .map(u=>({...u, score:score(me,u)}))
    .sort((a,b)=>b.score-a.score)
    .slice(0,10);

  res.json(result);
});

// 좋아요
app.post('/like',(req,res)=>{
  const {from,to} = req.body;

  if(!dailyLikes[from]) dailyLikes[from]=0;

  if(dailyLikes[from] >= 5){
    return res.json({ok:false, msg:"오늘 좋아요 제한"});
  }

  const exists = likes.find(l => l.from===from && l.to===to);

  if(!exists){
    likes.push({from,to});
    dailyLikes[from]++;
  }

  res.json({ok:true});
});

// 상호 매칭
app.get('/matches/:name',(req,res)=>{
  const me = req.params.name;

  const mutual = likes.filter(l =>
    l.from === me &&
    likes.find(x => x.from === l.to && x.to === me)
  );

  res.json(mutual);
});

app.listen(3000, ()=>console.log("running"));