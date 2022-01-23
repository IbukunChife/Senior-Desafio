
import dotenv from 'dotenv';
import aws from  'aws-sdk';
import { response } from 'express';
import { AppError } from "../../errors/AppError";

dotenv.config()

class Sqs {
  sqs: any;
  region: string | undefined;
  url: string | undefined;
  acessKeyId: string | undefined; 
  apiversion: string | undefined;
  secretAcessKey: string | undefined;

  constructor() {
    this.region = process.env.AWS_REGION;
    this.acessKeyId = process.env.AWS_ACCESS_KEY_ID;
    this.url = process.env.AWS_QUEUE_URL;
    this.secretAcessKey = process.env.AWS_SECRET_ACCESS_KEY;
    this.apiversion = process.env.AWS_QUEUE_APIVERSION;
    aws.config.update({ region: this.region })
    this.sqs = new aws.SQS({apiVersion: this.apiversion});

  }


  async sendCommand(employeeId: string, employerId: string, includedAt: string, message?: string): Promise<any>{

    const data = JSON.stringify({
      "includedAt": includedAt,
      "employeeId": employeeId,
      "employerId": employerId,
    })
    var params ={
      DelaySeconds: 10,
      MessageBody: data,
      QueueUrl: `${this.url}`
    }
    const send = await this.sqs.sendMessage( params).promise();
    return send;
  };


  async receiveCommand(): Promise <any>{
    var params = {
      QueueUrl: `${this.url}`,
      VisibilityTimeout: 10 // 10 min (600) wait time for anyone else to process.
    };
    
    try{
      const { Messages } = await this.sqs.receiveMessage(params).promise();
      // console.log('Messages', Messages)
      return Messages[0];
    }catch(e){
      throw new AppError("Messages Attributes Error !!!");
    }
  }

  async deleteCommand(ReceiptHandle: string): Promise<any>{
    const params = {
      QueueUrl: `${this.url}`,
      ReceiptHandle: ReceiptHandle
    };

    try {
      const deleted =  await this.sqs.deleteMessage(params).promise();
      return deleted;
    }catch(err) {
      throw new AppError("Queue element Deleted Error !!!");
    }
  }


  async QueueSizeCommand(): Promise <any>{
    const  params = {
      QueueUrl:  `${this.url}`,
      AttributeNames : ['ApproximateNumberOfMessages'],
    };

    const result = await this.sqs.getQueueAttributes(params).promise()
    const size = Number(result.Attributes.ApproximateNumberOfMessages) 

    return size
  }

}

export {Sqs}