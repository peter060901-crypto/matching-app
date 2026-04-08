const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

let users = [];
let likes = [];

// 점수 + 이유 생성
function analyze(a,b){
  let score = 0;
  let reasons = [];

  if(a.purpose === b.purpose){
    score += 5;
    reasons.push("관계의 방향이 같음");
  }

  if(a.emotion === b.emotion){
    score += 3;
    reasons.push("감정 처리 방식이 유사");
  }

  if(a.speed === b.speed){
    score += 3;
    reasons.push("관계 속도가 맞음");
  } else {
    score -= 1;
  }

  if(a.conflict === b.conflict){
    score += 2;
    reasons.push("갈등 해결 방식이 유사");
  }

  if(a.energy !== b.energy){
    score += 2;
    reasons.push("에너지 흐름이 보완적");
  }

  if(a.suffering === b.suffering){
    score += 4;
    reasons.push("괴로움을 다루는 방식이 같음");
  }

  return {score, reasons};
}

// 등록
app.post('/register',(req,res)=>{
  const exists = users.find(u => u.name === req.body.name);

  if(!exists){
    users.push(req.body);
  }

  res.json({ok:true});
});

// 탐색 (추천 리스트)
app.post('/explore',(req,res)=>{
  const me = req.body;

  const result = users
    .filter(u => u.name !== me.name)
    .map(u=>{
      const result = analyze(me,u);
      return {...u, ...result};
    })
    .sort((a,b)=>b.score-a.score)
    .slice(0,10);

  res.json(result);
});

// 관심
app.post('/like',(req,res)=>{
  const {from,to} = req.body;

  const exists = likes.find(l => l.from===from && l.to===to);

  if(!exists){
    likes.push({from,to});
  }

  res.json({ok:true});
});

// 연결 (상호 좋아요)
app.get('/connections/:name',(req,res)=>{
  const me = req.params.name;

  const matched = likes.filter(l =>
    l.from === me &&
    likes.find(x => x.from === l.to && x.to === me)
  );

  res.json(matched);
});

app.listen(3000, ()=>console.log("running"));
