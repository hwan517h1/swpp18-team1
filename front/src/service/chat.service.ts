import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Channel } from '../model/channel';
import { Router } from '@angular/router';
import { UserService } from 'src/service/user.service';
import WebSocketAsPromised from 'websocket-as-promised';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private websoketUrl = `ws://${environment.awsEndpoint}/ws/chat/:channel_hash/token/:token`
  private wsp: WebSocketAsPromised

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router,
  ) { }

  connect(channel_hash: string): Promise<Event>{
    const wsUrlWithToken = this.websoketUrl.replace(":channel_hash", channel_hash).replace(":token", this.userService.token)
    this.wsp = new WebSocketAsPromised(wsUrlWithToken)
    return this.wsp.open()
  }

  addEventListner(listner: (msg: string) => void) : void{
    if(this.wsp.isOpened){
      console.log("listner wow~")
      // @ts-ignore
      this.wsp.onMessage.addListener(msg => {
        console.log(msg)
        listner(msg);
      })
    } else {
      console.log("nob")
    }
  }

  sendData(data: object) : void{
    if(this.wsp.isOpened){
      this.wsp.send(JSON.stringify(data))
    } else {
      console.log('socket is not opened')
    }
  }

  disconnect() : void{
    if(this.wsp.isOpened){
      this.wsp.close()
      console.log('socket is closed')
    }
  }

}
