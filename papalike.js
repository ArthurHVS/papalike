var request = require('request');
var parseString = require('xml2js').parseString;
var cheerio = require('cheerio');
const jsonfile = require('jsonfile');
var extend = require('node.extend');

// Função para salvar cada url de anúncios do sitemap.xml
// Usa o pacotes xml2js
function getTheMap(mapUrl) {
    request(anycaUrl, function (err, res, body) {
        parseString(body, function (err, result) {
            result.urlset.url.forEach(element => {
                getThisCar(element.loc[0]);
            });
        })
    });
}

// Função para gravar individualmente cada registro
function getThisCar(url) {
    // Faz o REQ no servidor desejado
    request(url, function (err, res, body) {
        if (res) {
            if (res.statusCode == 200) {

                // Com a resposta em formato DOM tree e auxílio do cheerio, recorta o dado da resposta.
                const $ = cheerio.load(body);
                const raw_res = $('[type="application/ld+json"]').html();
                result = JSON.parse(raw_res);
                
                // No caso da requisição feita em anyca.net, o objeto result tem três 
                // elementos, sendo que o primeiro é do contexto interno do site.
                // result.shift() retira esse primeiro elemento
                result.shift();

                // Junta os elementos de result em uma única string JSON 
                // Usa o pacote node.extend
                var dest = extend({}, result[0], result[1])
                
                // Escreve esse objeto final no arquivo "XXXX.json"
                // O nome de cada arquivo, nesse caso, é dado pelo id da URL que o site anyca.net gera para cada anúncio.
                jsonfile.writeFileSync('./json-reg/' + result[0].url.split('/').pop() + '.json', dest, { flag: 'a' })
            }
            else {
                console.log(res.statusCode);
            }
        }
    });
}
async function saveTheData(){
    const data = {
        "final_data": []
    };
    const dir = `${__dirname}/json-regs/`;
    fs.readdir(dir, (err, files) => {
        return new Promise((resolve, reject) => {
            if (err) reject(err);
            files.forEach(file => {
               // Requisita cada registro individual de /json-regs
               let content = require(`${dir}${file}`);
                
               // Junta todos os registros individuais em um objeto
               data['final_data'] = data['final_data'].concat(content);
               
               // Deleta os registros individuais em /json-regs
               fs.unlink(file);
            });
            resolve(data);
        }).then(data => {
            // Escreve o objeto no arquivo final
            fs.writeFileSync('./final.json',JSON.stringify(data));
        });
    })
}
const myPromise = new Promise(getTheMap('https://anyca.net/sitemap.xml')).then(saveTheData());
// getThisCar("https://anyca.net/car/32103");