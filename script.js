(function(){
  var P = (typeof PUBLICATIONS!=='undefined')?PUBLICATIONS:[];
  var $=function(id){return document.getElementById(id)};
  $('yy').textContent=new Date().getFullYear();
  var burger=$('burger'),menu=$('menu');
  burger.addEventListener('click',function(){var o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
  menu.addEventListener('click',function(e){if(e.target.tagName==='A'){menu.classList.remove('open');burger.setAttribute('aria-expanded','false')}});

  var cites=P.reduce(function(a,p){return a+p.cited},0);
  var years=P.map(function(p){return p.year});
  var span=P.length?Math.min.apply(null,years)+'–'+Math.max.apply(null,years):'';
  function stat(v,l){return '<li><b>'+v+'</b><span>'+l+'</span></li>'}
  $('heroStats').innerHTML=stat(P.length,'dokumen Scopus')+stat(cites,'total sitasi')+stat(span,'rentang tahun');
  $('pubStats').innerHTML=stat(P.length,'dokumen')+stat(cites,'sitasi')+stat(P.filter(function(p){return p.year>=2025}).length,'terbit 2025 ke atas');

  var yr=$("yr"),ty=$('ty');
  Array.from(new Set(years)).sort(function(a,b){return b-a}).forEach(function(y){yr.insertAdjacentHTML('beforeend','<option>'+y+'</option>')});
  Array.from(new Set(P.map(function(p){return p.type}))).forEach(function(t){ty.insertAdjacentHTML('beforeend','<option>'+t+'</option>')});

  function esc(s){return s.replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function authors(a){return esc(a).replace(/Pangaribuan J\.J\./g,'<span class="me">Pangaribuan J.J.</span>')}
  function render(){
    var q=$('q').value.trim().toLowerCase(),y=yr.value,t=ty.value;
    var list=P.filter(function(p){
      return (!y||String(p.year)===y)&&(!t||p.type===t)&&(!q||(p.title+' '+p.authors+' '+p.venue).toLowerCase().indexOf(q)>-1)});
    $('count').textContent='Menampilkan '+list.length+' dari '+P.length+' publikasi';
    $('pubList').innerHTML=list.map(function(p){
      var link=p.doi?'https://doi.org/'+p.doi:'#';
      return '<li class="pub"><div class="y">'+p.year+'</div><div><h3><a href="'+link+'" target="_blank" rel="noopener">'+esc(p.title)+'</a></h3>'+
        '<p class="au">'+authors(p.authors)+'</p><p class="ve">'+esc(p.venue)+'</p>'+
        '<span class="tag">'+esc(p.type)+'</span>'+(p.cited?'<span class="tag c">Disitasi '+p.cited+'×</span>':'')+'</div></li>'}).join('')||'<li class="count">Tidak ada publikasi yang cocok.</li>';
  }
  ['input','change'].forEach(function(ev){$('q').addEventListener(ev,render);yr.addEventListener(ev,render);ty.addEventListener(ev,render)});
  render();
})();
