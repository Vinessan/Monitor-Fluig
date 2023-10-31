import { Component } from '@angular/core';
import { APP_CONFIG } from "./app.config";


interface TimeBlocksObject {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isLoading: boolean = false;
  core: number = 0;
  memory: number = 0;
  memorySize: number = 0;
  hd: number = 0;
  hdSize: number = 0;
  hdFree: number = 0;
  startTime: number = 0;
  memoryFree: number = 0;
  memoryHeap: number = 0;
  memoryNonHeap: number = 0;
  database: number = 0;
  received: number = 0;
  sent: number = 0;
  databaseName: string = '';
  databaseVersion: string = '';
  driveName: string = '';
  driveVersion: string = '';
  used: number = 0;
  licenses: number = 0;
  remaining: number = 0;
  servicesNames: Array<any> = [];
  servicos: Array<any> = [];
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;

  constructor() {
    this.getAPI();
    this.getLicenses();
    this.getServices();
    this.formatBytes(0);
    this.relativeTime(0);
  }
  getAPI() {
    fetch(APP_CONFIG.APP_SERVER + '/monitoring/api/v1/statistics/report')
    .then(dados => dados.json())
    .then(dados => {
      this.core = dados['OPERATION_SYSTEM']['server-core-system']
      this.memory = dados['OPERATION_SYSTEM']['server-memory-size']
      this.hd = dados['OPERATION_SYSTEM']['server-hd-space']
      this.hdFree = dados['OPERATION_SYSTEM']['server-hd-space-free']
      this.startTime = dados['OPERATION_SYSTEM']['system-uptime']
      this.memoryFree = dados['OPERATION_SYSTEM']['server-memory-free']
      this.memoryHeap = dados['MEMORY']['heap-memory-usage']
      this.memoryNonHeap = dados['MEMORY']['non-heap-memory-usage']
      this.database = dados['DATABASE_SIZE']['size']
      this.received = dados['DATABASE_TRAFFIC']['received']
      this.sent = dados['DATABASE_TRAFFIC']['sent']
      this.databaseName = dados['DATABASE_INFO']['databaseName']
      this.databaseVersion = dados['DATABASE_INFO']['databaseVersion']
      this.driveName = dados['DATABASE_INFO']['driverName']
      this.driveVersion = dados['DATABASE_INFO']['driverVersion']   
      
      this.memorySize = Number(this.memory) - Number(this.memoryFree)
      this.hdSize = Number(this.hd) - Number(this.hdFree)     
    })
    .catch(_ => {console.log('_');
    })
    .finally( () => {
      this.isLoading = false;
    })
  }
  getLicenses() {
    fetch(APP_CONFIG.APP_SERVER + '/license/api/v1/licenses')
    .then(licenses => licenses.json())
    .then(licenses => {     
      this.used = licenses['items'][0]['activeUsers']
      this.licenses = licenses['items'][0]['totalLicenses']
      this.remaining = licenses['items'][0]['remainingLicenses']
    })
    .catch(_ => {console.log('_');
    })
    .finally( () => {
      this.isLoading = false;
    }) 
  }
  getServices() {
    fetch(APP_CONFIG.APP_SERVER + '/monitoring/api/v1/monitors/report')
    .then(services => services.json())
    .then(services => {
      let service = services['items']

      let servicos = [
        'Analytics',
        'License Server',
        'Mail Server', 
        'Solr',
        'Viewer',
        'Open Office',
        'Real Time',
        'Microsoft Office'
      ]

      for (let j = 0; j < servicos.length; j++) {
        const element = servicos[j];
        this.servicos.push(element)
      }


      for (let i = 0; i < service.length; i++) {
        const element = service[i];

        let ts = {status: element.status}
        

        if (ts.status === 'NONE') {
          ts.status = 'NÃO UTILIZADO'
        } else if (ts.status === 'OK') {
          ts.status = 'OPERACIONAL'
        } else if (ts.status === 'FAILURE') {
          ts.status = 'COM FALHA'
        }

        this.servicesNames.push(ts)        
      } 
    })
    .catch(error => {console.log('_', error);
    })
    .finally( () => {
      this.isLoading = false;
    })
  }
  formatBytes(
    bytes: number,
    decimals = 2
  ): string {
    try {
      if (!bytes || !+bytes) return '0 Bytes';
      
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
      const i = Math.floor(Math.log(bytes) / Math.log(k));
  
     return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;

     
     
    } catch (error) {
      console.log(error);
      return '0 Bytes';
    }
  }
  relativeTime(
    totalSeconds: number
  ): TimeBlocksObject | null {
    try {
      /**
       * minutes to seconds = 60
       * hours to seconds = 3600
       * days to seconds = 86400
       */
  
      let days = 0;
      let hours = 0;
      let minutes = 0;
      let seconds = 0;
  
      if (totalSeconds >= 60) {
        minutes = Math.floor(totalSeconds / 60);
        seconds = totalSeconds - minutes * 60;
  
        if (minutes >= 60) {
          hours = Math.floor(minutes / 60);
          minutes -= hours * 60;
  
          if (hours >= 24) {
            days = Math.floor(hours / 24);
            hours -= days * 24;
          }
        }
      } else {
        seconds = totalSeconds;
      }

      this.days = days
      this.hours = hours;
      this.minutes = minutes
      // console.log(this.days, this.hours, this.minutes);
  
      return { days, hours, minutes, seconds };
    } catch (error) {
      console.log(`relativeTime -> Could not determine past period: ${error}`);
      return null;
    }
  }
}


