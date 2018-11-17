import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import WebSocketAsPromised from 'websocket-as-promised';
import { ChannelMessage } from 'src/model/channel-message';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/service/user.service';
import { ChatService } from 'src/service/chat.service';
import { ChannelService } from 'src/service/channel.service';
import { WebsocketPacket } from 'src/model/websocket-packet';
import { EventType } from 'src/enums';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  //styleUrls: ['./channel.component.css']
})

export class ChannelComponent implements OnInit {

  channelMessage: ChannelMessage = new ChannelMessage()
  channelMessages: ChannelMessage[] = []

  private wsp: WebSocketAsPromised
  constructor(
    private activeRoute: ActivatedRoute,
    private userService: UserService,
    private chatService: ChatService,
    private channelService: ChannelService,
    private router: Router,
    private location: Location,
  ) {}

  sendMsg(){
    if(this.channelMessage.content){
      let packet = new WebsocketPacket({event_type: EventType.SendChannelMessage, data: {content: this.channelMessage.content}})
      this.chatService.sendData(packet)
      this.channelMessage.content = ""
    }
  }

  openDM(){
    console.log('======openDM=====')
  }

  ngOnInit() {
    const {channel_hash} = this.activeRoute.snapshot.params

    this.channelService.getChannel(channel_hash)
<<<<<<< HEAD
      .then((channel) => {
        this.channelTitle = channel.title
    })

=======
    this.channelService.getChannelMessage(channel_hash).then((messages) => {
      this.channelMessages = messages.map((message) => new ChannelMessage(message))
    })
>>>>>>> 3dbb215edfbe32a0115a70ea02d09d0770c5dcdf
    this.chatService.connect(channel_hash).then(() => {
      this.chatService.addEventListner((websocketPacket: WebsocketPacket) => {
        switch(+websocketPacket.event_type) {
          case EventType.ReceiveChannelMessage: {
<<<<<<< HEAD
            const data = websocketPacket.data
            const delived_snippet = {sender_id: data["sender_id"], content: data["content"], username: data["username"]}
            this.snippets.unshift(delived_snippet)
=======
            const newMessage = new ChannelMessage(websocketPacket.data)
            this.channelMessages.push(newMessage)
>>>>>>> 3dbb215edfbe32a0115a70ea02d09d0770c5dcdf
          }
          case EventType.NewUserConnect: {
          }
        }
      })
    })
  }

  ngOnDestroy(){
    this.chatService.disconnect()
  }

  signOut(): void {
    const currentUser_id = this.userService.user.id
    const manager_id = this.channelService.channel.manager_id
    const { channel_hash } = this.activeRoute.snapshot.params

    if(currentUser_id == manager_id) {
      this.userService.managerSignOut();
    } else {
      this.userService.userSignOut(channel_hash);
    }
  }

  goBack(): void {
    this.location.back()
  }
}
