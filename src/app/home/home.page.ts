import { Component } from '@angular/core';
import {Plugins} from '@capacitor/core';
// import {WifiDirect} from 'capacitor-wifi-direct';

const { WifiDirect } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  wifiState: string;
  status = 'Sleep';
  msgs: string;

  msgWriting: string;

  constructor() {
    WifiDirect.addListener('wifiState', (state: {isEnabled: boolean}) => {
      this.wifiState = 'Wifi ' + state.isEnabled ? 'on' : 'off';
    });
  }

  discoverPeers() {
    this.status = 'Discovery started';
    WifiDirect.discoverPeers()
        .then(({devices}) => {
          this.status = 'Discovery successfull';
          console.log(devices);
        })
        .catch(err => {
          console.error(err);
          this.status = 'Discovery failed';
        });
  }

  sendMsg() {

  }

  writeMsg(msg: CustomEvent) {
    this.msgWriting = msg.detail.value;
  }
}
