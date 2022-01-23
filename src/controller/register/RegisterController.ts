import { Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { Sqs } from "../../config/SQS/Sqs";
import { RegisterUseCases } from "./RegisterUsecases"

class RegisterController{
  async handle(request:Request, response: Response): Promise<Response>{

    const  sqs = new Sqs();
    const registerUsecases = new RegisterUseCases()
    const { employeeId, employerId, includedAt} = request.body;
    const wait = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms));

    //ADD THE NEW DATA INTO THE QUEUE
    await sqs.sendCommand(employeeId, employerId, includedAt)

    //GO TO SLEEP FOR 10 seconds
    await wait(10000).then();
    
    //GET SIZE OF QUEUE
    const QueueSize = await sqs.QueueSizeCommand()
    // console.log('size', QueueSize)

    //INITIALIZE AN EMPTY ARRAY
    let finalResponse : JSON [] = []

    /* FOR ALL ELEMENT IN THE QUEUE 
        Get the first element in the Queue
        Resolve the pendency 
        Delete it when is Done.
    */
    for (let i=0;i<QueueSize;i++){

      const element = await sqs.receiveCommand()

      try{
        var results = await registerUsecases.execute(JSON.parse(element.Body))
        
        // console.log(' resultados ',results)
        if(results.hasOwnProperty('message') && results.hasOwnProperty('system')){

          //DELETED AN ELEMENT OF THE QUEUE
          let _= await sqs.deleteCommand(element.ReceiptHandle)

          // ADD TO THE ARRAYS ALL RETURN VALUES OF ELEMENTS EXECUTIONS
          finalResponse.push(results)
        }
      }catch(e){
        throw new AppError("Element's Queue Failed !!!");
      }

    }
    return response.send(finalResponse);
  }
}

export {RegisterController}