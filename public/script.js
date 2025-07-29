let searchBtn = document.querySelector('i.bx-search');
let serachtarget = document.querySelector('input[type="search"]')
console.log(serachtarget)

searchBtn.addEventListener('click',()=>{
    if(serachtarget.classList.contains('hidden')){
        serachtarget.classList.remove('hidden');
    }else{
        serachtarget.classList.add('hidden');
    }
})

let hamburger = document.querySelector('#hamburger');
let mobilenav = document.querySelector('#mobilenav')
console.log(hamburger)

hamburger.addEventListener('click',()=>{
    if(mobilenav.classList.contains('hidden')){
        mobilenav.classList.remove('hidden');
        mobilenav.classList.add('block');
        hamburger.classList.remove('bx-menu');
        hamburger.classList.add('bx-x');
    }else{
        mobilenav.classList.remove('block');
        mobilenav.classList.add('hidden');
        hamburger.classList.add('bx-menu');
        hamburger.classList.remove('bx-x');
    }
})
