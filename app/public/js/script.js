"use strict";
var imgData;
this.addEventListener('load', () => {
  getImgData(12);                                                               //запрос на сервер, и добавление 12 картинок
  addEventUpload();                                                             //обработка клика загрузки
  renameSelectLabel();                                                          //лисен для изменения лейбла с именем файл после его выболра в форме
});

window.addEventListener('scroll', () => {
  checkScrollBarStatus(3);
});

let showMeRandomImage = () => {
  console.log('ha')
}

let checkScrollBarStatus = (count) => {
  if(document.body.scrollHeight-document.body.scrollTop===document.body.clientHeight){
    if(imgData.length - document.querySelectorAll('#imgBlock').length-count>0){
      update(imgData, count);
    }
    else{
      update(imgData, imgData.length - document.querySelectorAll('#imgBlock').length);
    }
  }
}
let uploadData = () => {
  var file = document.querySelector('#selectFile').files[0];
  var fd = new FormData();
  fd.append("image", file);
  // These extra params aren't necessary but show that you can include other data.
  fd.append("name", document.querySelector('#imgName').value);
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/', true);
  xhr.upload.onprogress = function(e) {
    if (e.lengthComputable) {
      let percentComplete = (e.loaded / e.total) * 100;
      let status = document.querySelector('#uploadStatus');
      status.style.display = "inline";
      status.innerHTML = '  ' + percentComplete + '% uploaded';
    }
  };
  xhr.onload = function() {
    if (this.status == 200) {
      getImgData(1);
    };
  };
  xhr.send(fd);
}
let getImgData = (count) => {
  var xhr = new XMLHttpRequest();
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

let update = (obj, count) => {
  if(count!=0){for(let i=0;i<count;i++){addImg(obj[document.querySelectorAll('#imgBlock').length])}}
}

let addImg = (obj) => {                                                         //генерация картинок и имен
  const contentBlock = document.querySelector('#contentBlock');
  const img = document.createElement('img');
  img.id = "img";
  img.src= obj.destination;
  const p = document.createElement('p');
  p.id = "p";
  p.innerHTML = obj.name;
  const div = document.createElement('div');
  div.id = "imgBlock";
  div.appendChild(img);
  div.appendChild(p);
  contentBlock.appendChild(div);
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
let renameSelectLabel = () => {
  document.querySelector('#selectFile').addEventListener('change', (item) => {  //лисен для загрузки файла
    const path = document.querySelector('#selectFile').value;
    document.querySelector('#selectLabel > p').innerHTML = path.split("\\").pop();
  });
}
