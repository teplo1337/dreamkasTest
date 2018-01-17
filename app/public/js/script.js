"use strict";
let imgData;
this.addEventListener('load', () => {
  getImgData(3);                                                               //запрос на сервер, и добавление 12 картинок если они есть
  addEventUpload();                                                             //обработка клика загрузки
  addEventRandomButton();                                                       //лисен для кнопки рандомного изображения
  addEventSelectLabel();                                                        //лисен для изменения лейбла с именем файл после его выбора в форме
});

window.addEventListener('scroll', () => {                                       //событие скролл
  checkScrollBarStatus(3);
});

let showMeRandomImage = () => {                                                 //показать случайное изображение
    showModal(getRandom(0, imgData.length - 1));
}

let showModal = (num) => {                                                      //показать на весь экран изображение (номер)
  const modalImg      = document.querySelector('#hiddenImg'),
        modal         = document.querySelector('#myModal'),
        captionText   = document.querySelector('#modalCaption'),
        oneOFImgData  = {
          "src":imgData[num].destination,
          "caption":imgData[num].name
        };

  modalImg.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  modal.style.display = "block";
  modalImg.src = oneOFImgData.src;
  captionText.innerHTML = oneOFImgData.caption;
}

let getRandom = (min, max) => {                                                 //генератор целых рандомных чисел
  return Math.round(Math.random() * (max - min) + min);
}

let checkScrollBarStatus = (count) => {                                         //проверка статуса скролл бара (scrollHeight - scrollTop\ == clientHeight)
  if((document.body.scrollHeight-document.body.scrollTop) - document.body.clientHeight < 3){
    if(imgData.length - document.querySelectorAll('#imgBlock').length-count>0){
      update(imgData, count);
      checkScrollBarStatus(3);
    }
    else{
      update(imgData, imgData.length - document.querySelectorAll('#imgBlock').length);
    }
  }
}

let changeUploadStatus = (msg) => {
  let status = document.querySelector('#uploadStatus');
  status.style.display = "inline";
  status.innerHTML = '  ' + msg;
}

let uploadData = () => {                                                        //загрузка formData на сервер
  let file = document.querySelector('#selectFile').files[0];
  let fd = new FormData();
  fd.append("image", file);
  fd.append("name", document.querySelector('#imgName').value);
  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/', true);
  xhr.upload.onprogress = function(e) {
    if (e.lengthComputable) {
      let percentComplete = (e.loaded / e.total) * 100;
      changeUploadStatus(percentComplete + '% uploaded');
    }
  };
  xhr.onload = function() {
    if (this.status == 200) {
      changeUploadStatus('Success!');
      getImgData(0);
    };
    if (xhr.status == 413) {
      changeUploadStatus('File too large!');
    }
  };
  xhr.send(fd);
}

let getImgData = (count) => {                                                   //получение информации о изображениях с сервера
  let xhr = new XMLHttpRequest();
  xhr.open("PUT", '/', true);
  xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
  xhr.onload = () => {
    let response = JSON.parse(xhr.responseText);
    if (xhr.readyState == 4 && xhr.status == "200") {
      imgData = response.data;
      console.log(imgData)
      checkScrollBarStatus(count);
    }
    else {
      console.log(xhr.responseText);
    }
  }
  xhr.send();
}

let update = (obj, count) => {                                                  // промежуточная функция генерации картинок и имен
  if(count!=0){for(let i=0;i<count;i++){addImg(obj, document.querySelectorAll('#imgBlock').length)}}
}

let addImg = (obj, num) => {                                                    //генерация картинок и имен
  const contentBlock = document.querySelector('#contentBlock');
  const img = document.createElement('img');
  img.id = "pictures";
  img.src= obj[num].destination;
  img.addEventListener('click', () => {
    showModal(num);
  });
  const p = document.createElement('p');
  p.innerHTML = obj[num].name;
  const div = document.createElement('div');
  div.id = "imgBlock";
  div.appendChild(img);
  div.appendChild(p);
  contentBlock.appendChild(div);
}

let addEventRandomButton = () => {
  document.querySelector('#randomButton').addEventListener('click', () => {
    showMeRandomImage();
  });
}

let addEventUpload = () => {
  document.querySelector('#startLoad').addEventListener('click', () => {        //обработка клика загрузки
    const selectFile = document.querySelector('#selectFile');
    const imgName = document.querySelector('#imgName');
    if(selectFile.value && imgName.value) {
      document.querySelector('body').style.backgroundColor = '#e3e8e6';
      document.querySelector('#error').style.display = "none";
      uploadData();
    }
    else{                                                                       //в случае если обязательные поля не заданы
      if(!imgName.value){
        document.querySelector('#error').style.display = "inline";
        document.querySelector('body').style.backgroundColor = '#ebb2b2';
        imgName.focus();
      }
      if(!selectFile.value){
        selectFile.click();
      }
    }
  });
}

let addEventSelectLabel = () => {
  document.querySelector('#selectFile').addEventListener('change', (item) => {  //лисен для загрузки файла
    const path = document.querySelector('#selectFile').value;
    document.querySelector('#selectLabel > p').innerHTML = path.split("\\").pop();
  });
}
