const { readFileSync } = require("fs");
const { getDMMF } = require("@prisma/sdk");
const path = require("path");
const fs = require("fs");
const inquirer = require('inquirer');


async function convertPrismaSchemaToJson(schemaPath) {
    try {
        const schema = readFileSync(schemaPath, "utf-8");

        const jsonDmmf = await getDMMF({ datamodel: schema });

        return jsonDmmf;
    } catch (error) {
        console.error("Erro ao converter o schema:", error);
        throw error;
    }
}

let typeSelected = '';

async function getModelsPrisma(){
    const questions = [
        {
          type: 'input',
          name: 'type',
          message: "Qual formato dos arquivos? JS ou TS?",
        },
    ];

    while(typeSelected.toLowerCase() != 'js' && typeSelected.toLowerCase() != 'ts'){
        const { type } = await inquirer.prompt(questions);
        typeSelected = String(type).toLowerCase();
    }
    
    console.log(`Tipo de saída: ${typeSelected}`);
    
    const schemaPath = path.resolve(__dirname, "./prisma/schema.prisma");
    const json = await convertPrismaSchemaToJson(schemaPath);
    
    const modelsPrisma = json.datamodel.models.map((m) => m.name)
    return modelsPrisma;
}

(async ()=> {
    const modelsPrisma = await getModelsPrisma()
    console.log('Modelos', modelsPrisma);

    const modelsNamesWithFirstUpArr = [];

    for(const modelName of modelsPrisma){
        const modelNameWithFirstUp = modelName[0].toUpperCase() + modelName.slice(1)
        modelsNamesWithFirstUpArr.push(modelNameWithFirstUp)

        // REPOSITORIES
        if(!fs.existsSync(path.resolve('./src/models')) || !fs.existsSync(path.resolve('./src/models/repositories'))){
            fs.mkdirSync('./src/models/repositories', { recursive: true })
        }

        if(fs.existsSync(path.resolve(`./src/models/repositories/${modelNameWithFirstUp}.repository.${typeSelected}`))){
            continue;
        }

        let repositoriesTemplateContent = fs.readFileSync(`./templates/models/repositories/repositories-template.${typeSelected}`, 'utf8').toString()
        
        repositoriesTemplateContent.replace(/({name})/g, modelName).replace(/({Name})/g, modelNameWithFirstUp)

        fs.writeFileSync(path.resolve(`./src/models/repositories`, `${modelNameWithFirstUp}.repository.${typeSelected}`), repositoriesTemplateContent)

        // CONTROLLERS
    }

    // INDEXES

    // index repositories
    let repositoriesIndexTemplateContent = fs.readFileSync(`./templates/models/repositories/index.${typeSelected}`, 'utf8').toString()

    const arrLinesIndexRepositories = repositoriesIndexTemplateContent.split('\n')
    const lineExportsIndex = arrLinesIndexRepositories.findIndex(l => l.includes("Repository"))
    const lineImportsIndex = arrLinesIndexRepositories.findIndex(l => l.includes(".repository"))

    const lineExports = arrLinesIndexRepositories[lineExportsIndex];
    const lineImports = arrLinesIndexRepositories[lineImportsIndex];

    
    arrLinesIndexRepositories[lineExportsIndex] =  modelsNamesWithFirstUpArr.map((modelNameWithFirstUp, index) =>{
        return lineExports.replace(/({name})/g, modelsPrisma[index]).replace(/({Name})/g, modelNameWithFirstUp)
    }).join(',\n')

    arrLinesIndexRepositories[lineImportsIndex] = modelsNamesWithFirstUpArr.map((modelNameWithFirstUp, index)=>{
        return lineImports.replace(/({name})/g, modelsPrisma[index]).replace(/({Name})/g, modelNameWithFirstUp)
    }).join('\n')

    fs.writeFileSync(path.resolve(`./src/models/repositories`, `index.${typeSelected}`), arrLinesIndexRepositories.join('\n'))
})()
