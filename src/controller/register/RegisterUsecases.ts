import axios from  'axios'

interface registerDTO {
  includedAt: Date;
  employeeId: string;
  employerId: string; 
}

// interface registerAnswerDTO {
//   message: string;
//   system: string;
// }

class RegisterUseCases {

  async execute (Data:registerDTO) : Promise<any> {
      try {
        const r = await axios.post('https://api.mockytonk.com/proxy/ab2198a3-cafd-49d5-8ace-baac64e72222 ', {
          includedAt: Data.includedAt,
          employeeId: Data.employeeId,
          employerId: Data.employerId,
        })
        return r.data;
      }catch(e){
        console.error(e)
      }
 }

}


export {RegisterUseCases}