export interface Application {
  clientid:number;
  clienttype: 'Физическое' | 'Юридическое';
  firstname?: string;
  lastname?: string;
  organizationname?: string;
  contactinfo: string;
  contractnumber: string;
}

export interface ApplicationResponse {
  newApplication: {
    clienttype: string;
    firstname?: string;
    lastname?: string;
    organizationname?: string;
    contactinfo: string;
    contractnumber: string;
  };
}

export interface User {
  email: string;
  password: string;
}

export interface MyTokenPayload {
  roleid: number;
  userid: number;
}
