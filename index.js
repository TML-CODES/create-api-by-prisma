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

let typeSelected = process.env.TYPE_OUTPUT || '';

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

const folders = [
    {
        className: 'controller',
        folder_path: 'controllers'
    },
    {
        className: 'repository',
        folder_path: 'models/repositories'
    },
    {
        className: 'routes',
        folder_path: 'routes'
    }
]

async function main() {
    const modelsPrisma = await getModelsPrisma()
    console.log('Modelos', modelsPrisma);

    const tableNamesWithFirstUpArr = [];

    for(const { className, folder_path } of folders){
        const SRC_PATH = path.resolve(`./src/${folder_path}`)
        
        for(const TABLE_NAME of modelsPrisma){

            const TABLE_NAME_WITH_1UP = TABLE_NAME[0].toUpperCase() + TABLE_NAME.slice(1)
            
            if(!tableNamesWithFirstUpArr.find(t => t == TABLE_NAME_WITH_1UP))
                tableNamesWithFirstUpArr.push(TABLE_NAME_WITH_1UP)

            // FILES BY TABLES
            if(!fs.existsSync(SRC_PATH)){
                fs.mkdirSync(SRC_PATH, { recursive: true })
            }
    
            if(fs.existsSync(`${SRC_PATH}/${TABLE_NAME_WITH_1UP}.${className}.${typeSelected}`)){
                continue;
            }
    
            let templateContent = fs.readFileSync(`./templates/${folder_path}/${className}-template.${typeSelected}`, 'utf8').toString()
            templateContent = templateContent.replace(/(replace_here)/g, TABLE_NAME).replace(/(Replace_Here)/g, TABLE_NAME_WITH_1UP)
    
            fs.writeFileSync(`${SRC_PATH}/${TABLE_NAME_WITH_1UP}.${className}.${typeSelected}`, templateContent)

        }
        
        const CLASS_NAME_WITH_1UP = className[0].toUpperCase() + className.slice(1)
        
        // INDEXES
        let indexTemplateContent = fs.readFileSync(`./templates/${folder_path}/index.${typeSelected}`, 'utf8').toString()
    
        const arrLinesIndexRepositories = indexTemplateContent.split('\n')
        const lineExportsIndex = arrLinesIndexRepositories.findIndex(l => l.includes(CLASS_NAME_WITH_1UP))
        const lineImportsIndex = arrLinesIndexRepositories.findIndex(l => l.includes(`.${className}`))
        
        const lineExports = arrLinesIndexRepositories[lineExportsIndex];
        const lineImports = arrLinesIndexRepositories[lineImportsIndex];
        
        arrLinesIndexRepositories[lineExportsIndex] =  tableNamesWithFirstUpArr.map((tableNameWithFirstUp, index) =>{
            return lineExports.replace(/(replace_here)/g, modelsPrisma[index]).replace(/(Replace_Here)/g, tableNameWithFirstUp)
        }).join(`${(className == 'routes') ? '' : ','}\n`)
    
        arrLinesIndexRepositories[lineImportsIndex] = tableNamesWithFirstUpArr.map((tableNameWithFirstUp, index)=>{
            return lineImports.replace(/(replace_here)/g, modelsPrisma[index]).replace(/(Replace_Here)/g, tableNameWithFirstUp)
        }).join('\n')
    
        fs.writeFileSync(path.resolve(SRC_PATH, `index.${typeSelected}`), arrLinesIndexRepositories.join('\n'))
    }

    // Auth 
    if(!fs.existsSync(path.resolve(`./src/controllers/auth.controller.${typeSelected}`))){
        const authControllerTemplateContent = fs.readFileSync(`./templates/controllers/auth-template.${typeSelected}`, 'utf8').toString()
        fs.writeFileSync(path.resolve(`./src/controllers/auth.controller.${typeSelected}`), authControllerTemplateContent)
    }

    if(!fs.existsSync(path.resolve(`./src/routes/auth.routes.${typeSelected}`))){
        const authRouterTemplateContent = fs.readFileSync(`./templates/routes/auth.routes.${typeSelected}`, 'utf8').toString()
        fs.writeFileSync(path.resolve(`./src/routes/auth.routes.${typeSelected}`), authRouterTemplateContent)
    }

    console.log('!! FIM !!')
}

main()