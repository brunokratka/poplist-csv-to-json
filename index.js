const fs = require('fs');

fs.readdir('./csv', (err, files) => {
  if(err) throw err;

  const list = files.map((file, index) => {

    const newObj = {
      categoryName: file.slice(0, -4),
      productTypeList: dataFromFile(file)
    }
    return newObj;
  })
  fs.writeFile('json/poplist.json', JSON.stringify(list), function(){
    if (err) throw err;
    console.log('The file has been saved!');
  })
});

function dataFromFile(file){
  const fileContent = fs.readFileSync(`./csv/${file}`).toString();
  return splitLines(fileContent);
}

function splitLines(raw){
  return spliCells(raw.split("\n")[0].split("\r").slice(1));
}

function spliCells(lines){
  const arrayOfLinesAndCells = lines.map(line => {
    return line.split(";")
  })
  return dictionaryParse(arrayOfLinesAndCells);
  // console.log(arrayOfLinesAndCells[0]);
}

function dictionaryParse(data){
  let productTypeList = []; // lista do productTypeName, productList
  let productTypeName = '';
  let productList = [];

  for(let i = 0; i < data.length; i++) {
    
    if(data[i][0] !== productTypeName) 
    {
      productTypeName = data[i][0];
      productList = [];
      productList.push(createNewProductList(data[i]));
      productTypeList.push({productTypeName, productList});
    }else{
      productList.push(createNewProductList(data[i]));
    }
  }
  console.log(productTypeList);
  return productTypeList;
  // console.log(dictionary, dictionary.data.datasets);
}

function createNewProductList(productlist) {
  let dataContent = { // productlist
    data: {
      labels: [],
      datasets: [{
        label: '% de Votos',
        data: []
      }]
    }
  };
  
  for (var i = 0; i < productlist.length; i++) {
    if(i === 0){
      dataContent.productTypeName = productlist[i].trim();
    }else if(i === 1){
      dataContent.productName = productlist[i].trim();
    }else if(i === 2){
      dataContent.productLabel = productlist[i].trim();
    }else if(i % 2 !== 0 && productlist[i]){
      dataContent.data.labels.push(productlist[i].trim());
      dataContent.data.datasets[0].data.push(parseFloat(productlist[i+1].replace(',','.').trim()));
    }
  }
  return dataContent;
}