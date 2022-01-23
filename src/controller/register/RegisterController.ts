import { Json } from "aws-sdk/clients/robomaker";
import { Request, Response } from "express";
import {Sqs} from "../../config/SQS/Sqs";
import {RegisterUseCases} from "./RegisterUsecases"

class RegisterController{
  async handle(request:Request, response: Response): Promise<Response>{

    const  sqs = new Sqs();
    const registerUsecases = new RegisterUseCases()
    const { employeeId, employerId, includedAt} = request.body;
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

    //ADD THE NEW DATA INTO THE QUEUE
    await sqs.sendCommand(employeeId, employerId, includedAt)

    //GO TO SLEEP FOR 10 seconds
    await wait(10000).then();
    
    //GET SIZE OF QUEUE
    const QueueSize = await sqs.QueueSizeCommand()
    // console.log('size', QueueSize)

    let finalResponse : JSON [] = []

    for (let i=0;i<QueueSize;i++){

      const element = await sqs.receiveCommand()

      // console.log('element', element.Body)

      // console.log(JSON.parse(element.Body))
      var results = await registerUsecases.execute(JSON.parse(element.Body))


      console.log(' resultados ',results)
      // deleted element in the Queue
      let _= await sqs.deleteCommand(element.ReceiptHandle)
      finalResponse.push(results)
    }

    // const result = registerUsecases.execute({includedAt,employeeId,employerId})
    return response.send(finalResponse);

  }

}

export {RegisterController}