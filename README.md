## Senior-Desafio
---
A api desenvolvida é o Register Point. Ela tem como objetivo
de gerenciar avalanchas requisições resolvendo problema de
sobrecarga do servidor com o uso do serviço de Fila AWS-SQS.
Ela também estabelece uma forma sequencial de consumo das
informações para que todas requisições na fila sejam consumidas.

## Funcionamento
---
As requisições de marcação de ponto são automaticamente salvo na
fila. A api espera uns 10 seconds para requisitar quantos 
requisições (mensagens ou informações de marcação de ponto )
a fila possuía. Em seguida, percorrendo o tamanho oferecido da fila,
a api requisita um por um essas informações para seu consumo. Com o
consumo realizado com sucesso, a api manda um comando para excluir
da fila o elemento consumido. E assim vai...

## Processo de Instalação
É preciso primeiro clonar esse repositório no computador que já tem
instalado o gerenciador de pacote "Yarn".

Em seguinte criar um arquivo .env e colocar as seguinte variáveis de
ambiente:

```env
AWS_ACCESS_KEY_ID= < O SEU AMAZON ACCESS KEY ID>
AWS_SECRET_ACCESS_KEY = < O SEU AMAZON SECRET ACCESS KEY >
AWS_REGION= < AMAZON REGION >
AWS_QUEUE_URL= < AMAZON_QUEUE_URL >
AWS_QUEUE_APIVERSION: '2012-11-05'
```

No terminal, sendo que você está na pasta principal do arquivo
você roda o "yarn dev". esse commando inicializará o servidor 

## Testando com a Insomia
---
Para testar a api, encontra se dentra da pasta um arquivo JSON
na pasta Insomnia.
 
Basta o insomnia instalado na sua máquina e importar o arquivo
Insomnia_Senior_Teste.json na aplicação.
 
Você poderia também usar outras ferramentas de test de requisições
Backend como o Postman para testar a funcionalidade da API.
 
Basta escrever um objeto JSON com as seguintes configurações:
```JSON
{
 "includedAt":"2021-03-15 15:10:00",
 "employeeId": 200,
 "employerId": 900
}
```
e encaminha pelo método POST para a url :
http://localhost:3003/register/point
 
 
Esse teste consiste a mandar várias requisições POST para
a API e esperar a resposta que esse último retornará.
 
Vale ressaltar inclusive que uma parte da análise da fila
tem que ser feita olhando dentro da conta amazon. Por exemplo,
Os dados que estão entrando na fila e o status que ela possuem
quando a Api está consumindo as informações nelas.

[![Assista o video teste ](Extra/justimage.jpg)](https://youtu.be/YIuDSbWnMaU)


### Organização das Pastas
---
```TXT
src --> config   --> SQS --> Sqs.ts 
    |
    |--> controller --> register --> RegistrerController.ts
                                 |--> RegisterUsesCases.ts
    |---> errors  --> AppError.ts
    |--> router --> Index.ts
                |--> register.routes.ts
    |--> server.ts 
readme.md
package.json
tsconfig.json
.env
.gitignore
```