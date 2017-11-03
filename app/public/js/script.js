"use strict";
window.addEventListener('load', () => {
  addImg('12');                                                                 //добавление картинок и имен
  document.querySelector('#selectFile').addEventListener('change', (item) => {  //лисен для наименования картинки
    const path = document.querySelector('#selectFile').value;
    document.querySelector('#selectFileName > p').innerHTML = path.split("\\").pop();
  });
  document.querySelector('#startLoad').addEventListener('click', () => {        //обработка клика загрузки
    const selectFile = document.querySelector('#selectFile');
    const imgName = document.querySelector('#imgName');
    if(selectFile.value && imgName.value) {
    //  document.querySelector('#form').submit();
    }
    else{                                                                       //в случае если поля не заданы
      if(!imgName.value){
        document.querySelector('#error').style.display = "inline";
        imgName.focus();
      }
      if(!selectFile.value){
        selectFile.click();
      }
    }
  });
});

let addImg = (count) => {                                                       //добавление картинок и имен
  const contentBlock = document.querySelector('#contentBlock');
  for(let i=0; i<count; i++){
    const img = document.createElement('img');
    img.id = "img";
    img.src= "/uploads/image-1509619519228.jpg"
    const p = document.createElement('p');
    p.id = "p";
    p.innerHTML = "New text!"
    const div = document.createElement('div');
    div.id = "imgBlock";
    div.appendChild(img);
    div.appendChild(p);
    contentBlock.appendChild(div);
  }
}
