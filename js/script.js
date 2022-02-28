const cat_info = document.querySelector(".cat_info")
const cat_update = document.querySelector(".cat_update");

const closeInfo = function () {
    cat_info.classList.remove("active");
}

const closeUpdate = function () {
    cat_update.classList.remove("active");
    cat_update.id = 0;
    inputs = cat_update.querySelectorAll('input');
    inputs.forEach((val,i)=>{
        if(val.className != 'cat__submit') { 
            val.value = "";
            val.checked = false;
        }
    });
    cat_update.querySelector("textarea").value = "";
}

function updateCat(id) {
    const cats = JSON.parse(localStorage.getItem('cats'));

    closeInfo();
    cat_update.classList.add("active");
    elem_input = cat_update.querySelectorAll("input");
    for(let key in cats[id]) {
        elem_input.forEach((val,i)=>{
            if(val.id == key) val.value = cats[id][key];
            if (val.id == 'favourite') {  val.checked = Boolean(cats[id].favourite); }
        })
    };

    console.log(elem_input);
    cat_update.querySelector("textarea").value = cats[id].description;
    cat_update.id = id;
} 

const deleteCat = function(id) {
    const cats = JSON.parse(localStorage.getItem('cats'));
    let result = confirm(`Вы уверены, что хотите удалить котика по имени ${cats[id].name}?`);
    if (result==true) 
      api.deleteCat(cats[id].id)
      .then((val)=>{
        cat_info.classList.remove("active");  
        showAllCats();});
}

function get_desc_years(years){
    if(years==1) return 'год'
    else if (years>=5) return 'лет'
    else return 'года'
}

function showCatInfo(cat) {
    const cats = JSON.parse(localStorage.getItem('cats'));

    cat_info.classList.add("active");
    cat_info.firstElementChild.innerHTML = `
        <img class="cards_cat__img" src="${cats[cat.id].img_link}">
        <div class="cards_cat__info">
            <h2>${cats[cat.id].name}</h2>
            <h3>${cats[cat.id].age+' '+get_desc_years(cats[cat.id].age)}</h3>
            <p>${cats[cat.id].description}</p>
            <div class="cat_info__button">
                <div class="cat_info__update"></div>
                <div class="cat_info__delete"></div>
            </div>        
        </div>
        <div class="cat_info__close" onclick="closeInfo()"></div>
    `;

    cat_info.firstElementChild.querySelector(".cat_info__delete").addEventListener("click", function(e) {
           deleteCat(cat.id);
        });

    cat_info.firstElementChild.querySelector(".cat_info__update").addEventListener("click", function(e) {
            updateCat(cat.id);
         });
}

function setRate(rate){
    let rate_string = ``;
    for (let i = 0; i < 10; i++) {
        if (rate > i) rate_string += `<img src='img/cat-fill.svg'>
        `;
        else rate_string += `<img src='img/cat-stroke.svg'>
        `;
    }
    return rate_string;
}

function create_cards_cat(array_cat){
    const elem_cards = document.getElementById("cards");
    while (elem_cards.firstChild) {
        const el = elem_cards.removeChild(elem_cards.firstChild);
      };

    for(let i=0;i<array_cat.length;i++){
        const elem_card = document.createElement("div");
        elem_card.id = i;
        elem_card.className = 'cards_cat';
        elem_card.innerHTML = `
            <img class="cards_cat__img" src="${array_cat[i].img_link}">
            <h3>${array_cat[i].name}</h3>
            <p class="stars">${setRate(array_cat[i].rate)}</p>
        `;
        elem_cards.appendChild(elem_card);
    }
    localStorage.setItem('cats', JSON.stringify(array_cat));

    const cards_cat = document.querySelectorAll(".cards_cat");
    for (let i = 0; i<cards_cat.length; i++) {
        cards_cat[i].addEventListener("click", function(e) {
            showCatInfo(cards_cat[i]);
        })
    }
}

function showAllCats() {
    localStorage.clear();
    const array_cat = [ ];
    api
      .getAllCats()
      .then((dataFromBack) => dataFromBack.data.filter((el) => el.id))
      .then((cats) => {
        cats.forEach((cat) => array_cat.push(cat));
      })
      .then(()=>create_cards_cat(array_cat));
  }
  
  const SaveCat = function () {
    const cats = JSON.parse(localStorage.getItem('cats'));
    const inputs = document.querySelectorAll("input");
       
    const bodyJSON = {}; 
    for(let i=0;i<inputs.length;i++){
        if(inputs[i].id === '') continue;
        if(inputs[i].id === 'favourite') {
            bodyJSON[inputs[i].id] = inputs[i].checked;
        } else {
            bodyJSON[inputs[i].id] = (inputs[i].type == 'number')?+inputs[i].value:inputs[i].value;
        }
    };
    bodyJSON["description"] = ( document.querySelector("textarea").value || "Описание не заполнено" );

     if (cat_update.id == 0) {
        let maxId = 0;
        cats.forEach((val,i)=> maxId = (maxId < val.id)?val.id:maxId );
        bodyJSON["id"] = ++maxId;

        api.addCat(bodyJSON)
        .then((val)=>{
            closeUpdate();  
            showAllCats()});
    } else {
        bodyJSON["id"] = cats[cat_update.id].id;
        api.updateCat(cats[cat_update.id].id, bodyJSON)
        .then((val)=>{
            closeUpdate();  
            showAllCats()});
    };
}

function show_addCat() {
    cat_update.classList.add("active");
}

document.querySelector(".cat__submit").addEventListener("click", function(e) {
    show_addCat();
 });
showAllCats();
