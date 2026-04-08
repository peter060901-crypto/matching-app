function me(){
  return {
    name:val('name'),
    purpose:val('purpose'),
    emotion:val('emotion'),
    speed:val('speed'),
    conflict:val('conflict'),
    energy:val('energy'),
    suffering:val('suffering'),
    intro:val('intro')
  };
}

function val(id){
  return document.getElementById(id).value;
}

async function start(){
  await fetch('/register',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(me())
  });

  showMenu();
}

async function explore(){
  const res = await fetch('/explore',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(me())
  });

  const data = await res.json();

  let html = '<h3>추천</h3>';

  data.forEach(u=>{
    html += `
    <div class="card">
      <b>${u.name}</b><br>
      점수: ${u.score}<br>
      ${u.intro}<br><br>
      <small>${u.reasons.join(', ')}</small><br><br>
      <button onclick="like('${u.name}')">관심</button>
    </div>`;
  });

  document.getElementById('view').innerHTML = html;
}

async function like(name){
  await fetch('/like',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      from:val('name'),
      to:name
    })
  });

  alert("관심 표시됨");
}

async function connections(){
  const res = await fetch('/connections/'+val('name'));
  const data = await res.json();

  let html = '<h3>연결</h3>';

  data.forEach(c=>{
    html += `<div class="card">${c.to}</div>`;
  });

  document.getElementById('view').innerHTML = html;
}

function showMenu(){
  document.getElementById('onboard').style.display='none';
  document.getElementById('menu').style.display='block';
}
