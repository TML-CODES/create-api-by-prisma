const { readFileSync } = require("fs");
const { getDMMF } = require("@prisma/sdk");
const ts = require('typescript');
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

function compileTsToJs(tsContent) {
    const result = ts.transpileModule(tsContent, {
        compilerOptions: {
        module: ts.ModuleKind.CommonJS
        }
    });
    return result.outputText;
}

(async ()=> {
    const questions = [
        {
          type: 'input',
          name: 'type',
          message: "Qual formato dos arquivos? JS ou TS?",
        },
    ];

    let typeSelected = '';
    while(typeSelected.toLowerCase() != 'js' && typeSelected.toLowerCase() != 'ts'){
        const { type } = await inquirer.prompt(questions);
        typeSelected = String(type).toLowerCase();
    }
    
    console.log(`Tipo de saída: ${typeSelected}`);
    
    const schemaPath = path.resolve(__dirname, "./prisma/schema.prisma");
    const json = await convertPrismaSchemaToJson(schemaPath);
    
    const modelsPrisma = json.datamodel.models.map((m) => m.name)
    console.log(modelsPrisma);

    const repositoriesTemplatePath = './repositories-template.ts'
    let repositoriesTemplateContent = fs.readFileSync(repositoriesTemplatePath, 'utf8').toString();
    if(typeSelected === 'js'){
        repositoriesTemplateContent = compileTsToJs(repositoriesTemplateContent);
    }
    console.log(repositoriesTemplateContent);
})()
