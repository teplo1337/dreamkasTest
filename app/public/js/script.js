"use strict";
let imgData;

this.addEventListener('load', () => {
  getImgData(3);
  addEventUpload();
  addEventRandomButton();
  addEventSelectLabel();
});

//событие скролл

window.addEventListener('scroll', () => {
  checkScrollBarStatus(3);
});

//показать случайное изображение

let showMeRandomImage = () => {
    showModal(getRandom(0, imgData.length - 1));
}

//показать на весь экран изображение (номер)

let showModal = (num) => {
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

//генератор целых рандомных чисел

let getRandom = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
}

//проверка статуса скролл бара (scrollHeight - scrollTop == clientHeight)

let checkScrollBarStatus = (count) => {
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

//загрузка formData на сервер

let uploadData = () => {                                                        
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

//получение информации о изображениях с сервера

let getImgData = (count) => {                                                   
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

  //обработка клика загрузки

  document.querySelector('#startLoad').addEventListener('click', () => {
    const selectFile = document.querySelector('#selectFile');
    const imgName = document.querySelector('#imgName');

    if (selectFile.value && imgName.value) {
      document.querySelector('body').style.backgroundColor = '#e3e8e6';
      document.querySelector('#error').style.display = "none";
      uploadData();
    } else {

      //в случае если обязательные поля не заданы

      if (!imgName.value) {
        document.querySelector('#error').style.display = "inline";
        document.querySelector('body').style.backgroundColor = '#ebb2b2';
        imgName.focus();
      }
      if (!selectFile.value) {
        selectFile.click();
      }
    }
  });
}

//лисен для загрузки файла

let addEventSelectLabel = () => {
  document.querySelector('#selectFile').addEventListener('change', (item) => {  
    const path = document.querySelector('#selectFile').value;
    document.querySelector('#selectLabel > p').innerHTML = path.split("\\").pop();
  });
}
