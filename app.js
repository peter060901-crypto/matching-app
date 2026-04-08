function getData(){
  return {
    name:document.getElementById('name').value,
    purpose:document.getElementById('purpose').value,
    emotion:document.getElementById('emotion').value,
    speed:document.getElementById('speed').value,
    conflict:document.getElementById('conflict').value,
    energy:document.getElementById('energy').value,
    suffering:document.getElementById('suffering').value,
    intro:document.getElementById('intro').value
  };
}

async function register(){
  await fetch('/register',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(getData())
  });

  show('menu');
}

async function match(){
  const res = await fetch('/match',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(getData())
  });

  const data = await res.json();

  let html = '<h3>매칭 결과</h3>';

  data.forEach(u=>{
    html += `
    <div style="border:1px solid #ddd; padding:10px; margin-top:10px">
      <b>${u.name}</b><br>
      적합도: ${u.score}<br>
      ${u.intro || ''}<br><br>
      <button onclick="like('${u.name}')">관심</button>
    </div>
    `;
  });

  html += '<br><button onclick="back()">뒤로</button>';

  document.getElementById('result').innerHTML = html;
  show('result');
}

async function like(name){
  const res = await fetch('/like',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      from:document.getElementById('name').value,
      to:name
    })
  });

  const data = await res.json();

  if(!data.ok){
    alert(data.msg);
  } else {
    alert("관심 표시 완료");
  }
}

async function loadMatches(){
  const name = document.getElementById('name').value;

  const res = await fetch('/matches/'+name);
  const data = await res.json();

  let html = '<h3>내 연결</h3>';

  if(data.length === 0){
    html += "아직 연결 없음";
  } else {
    data.forEach(m=>{
      html += `
      <div style="border:1px solid #ddd; padding:10px; margin-top:10px">
        ${m.to}
      </div>
      `;
    });
  }

  html += '<br><button onclick="back()">뒤로</button>';

  document.getElementById('result').innerHTML = html;
  show('result');
}

function show(id){
  ['step1','menu','result'].forEach(s=>{
    document.getElementById(s).style.display='none';
  });
  document.getElementById(id).style.display='block';
}

function back(){
  show('menu');
}