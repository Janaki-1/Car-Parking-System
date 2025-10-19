// Small app JS to handle auth (localStorage), suggestions, navigation and booking flow

// -- Simple auth helpers --
const Auth = {
  signup: (name, email, pass) => {
    const users = JSON.parse(localStorage.getItem('sp_users')||'[]');
    if(users.find(u=>u.email===email)) return {ok:false,msg:'Email already exists'};
    users.push({name,email,pass,bookings:[]});
    localStorage.setItem('sp_users', JSON.stringify(users));
    return {ok:true,msg:'Signup successful now you can login'};
  },
  login: (email,pass) => {
    const users = JSON.parse(localStorage.getItem('sp_users')||'[]');
    const u = users.find(x=>x.email===email && x.pass===pass);
    if(!u) return {ok:false,msg:'No account found. Please sign up first.'};
    localStorage.setItem('sp_current', JSON.stringify(u));
    return {ok:true,msg:'Login successful'};
  },
  logout: ()=>{localStorage.removeItem('sp_current');location.href='index.html';},
  current: ()=> JSON.parse(localStorage.getItem('sp_current')||'null'),
  saveCurrent: (user)=>{
    // update user in user list
    const users = JSON.parse(localStorage.getItem('sp_users')||'[]');
    const idx = users.findIndex(u=>u.email===user.email);
    if(idx>-1) users[idx]=user;
    localStorage.setItem('sp_users', JSON.stringify(users));
    localStorage.setItem('sp_current', JSON.stringify(user));
  }
}

// -- Common helpers for pages --
function showAuthLinks(){
  const cur = Auth.current();
  document.getElementById('loginLink') && (document.getElementById('loginLink').style.display = cur ? 'none' : 'inline');
  document.getElementById('signupLink') && (document.getElementById('signupLink').style.display = cur ? 'none' : 'inline');
  document.getElementById('accountLink') && (document.getElementById('accountLink').style.display = cur ? 'inline' : 'none');
}

// run on every page
document.addEventListener('DOMContentLoaded', ()=>{
  try{showAuthLinks()}catch(e){}
});

// -- Places autosuggest data (Kerala places sample) --
const keralaPlaces = [
  'Alappuzha Bus Stand','Alappuzha Beach','Kochi Ernakulam','Kozhikode','Thiruvananthapuram','Thrissur','Kottayam','Kollam','Malappuram','Palakkad','Pathanamthitta','Idukki','Wayanad','Kannur','Varkala','Kumarakom','Munnar','Cherai Beach','Fort Kochi'
];

// page-specific logic exports:
window.SP = {
  keralaPlaces,
  Auth
};

// helper to parse query strings
function qs(key){
  const p = new URLSearchParams(location.search);
  return p.get(key);
}

// Booking helpers
function generateTicketId(){
  const t = 'TKT-'+Math.random().toString(36).slice(2,9).toUpperCase();
  return t;
}

// Expose to global for small pages
window.generateTicketId = generateTicketId;
window.qs = qs;